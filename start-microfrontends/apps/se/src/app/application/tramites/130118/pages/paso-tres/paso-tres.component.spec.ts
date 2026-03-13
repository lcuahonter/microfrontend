import { Router } from '@angular/router';
import { DocumentoService, TramiteFolioStore } from '@libs/shared/data-access-user/src';
import { DocumentosQuery } from '@libs/shared/data-access-user/src/core/queries/documentos.query';
import { CadenaOriginalService } from '@libs/shared/data-access-user/src/core/services/shared/cadena-original/cadena-original.service';
import { of, throwError } from 'rxjs';
import { CadenaOriginal130118Service } from '../../services/cadena-original.service';
import { Firma130118Service } from '../../services/firma130118.service';
import { Tramite130118Query } from '../../estados/queries/tramite130118.query';
import { PasoTresComponent } from './paso-tres.component';

interface BaseResponse<T> {
  codigo: string;
  datos: T;
  path: string;
  timestamp: string;
  mensaje: string;
}

function baseResponse<T>(
  datos: T,
  codigo = '00',
  mensaje = '',
  path = '',
  timestamp = ''
): BaseResponse<T> {
  return {
    codigo,
    datos,
    mensaje,
    path,
    timestamp,
  };
}

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;

  let mockRouter: jest.Mocked<Router>;
  let mockCadenaOriginalService: jest.Mocked<CadenaOriginalService>;
  let mockCadenaOriginal130118Service: jest.Mocked<CadenaOriginal130118Service>;
  let mockFirma130118Service: jest.Mocked<Firma130118Service>;
  let mockDocumentoService: jest.Mocked<DocumentoService>;
  let mockTramite130118Query: jest.Mocked<Tramite130118Query>;
  let mockTramiteStore: jest.Mocked<TramiteFolioStore>;
  let mockDocumentosQuery: jest.Mocked<DocumentosQuery>;

  beforeEach(() => {
    mockRouter = {
      url: '/tramite/130118/paso-tres',
      navigate: jest.fn().mockResolvedValue(true),
    } as any;

    mockCadenaOriginalService = {
      generarCadena130118: jest.fn(),
    } as any;

    mockCadenaOriginal130118Service = {
      obtenerCadenaOriginal: jest.fn(),
    } as any;

    mockFirma130118Service = {
      enviarFirma: jest.fn(),
    } as any;

    mockDocumentoService = {
      obtenerDatosFirma: jest.fn(),
    } as any;

    mockTramite130118Query = {
      selectSeccionState$: of({ idSolicitud: 123 }),
    } as any;

    mockTramiteStore = {
      establecerTramite: jest.fn(),
    } as any;

    mockDocumentosQuery = {
      selectDocumentoState$: of({}),
    } as any;

    component = new PasoTresComponent(
      mockRouter,
      mockCadenaOriginalService,
      mockCadenaOriginal130118Service,
      mockFirma130118Service,
      mockDocumentoService,
      mockTramite130118Query,
      mockTramiteStore,
      mockDocumentosQuery
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ngOnInit', () => {
    it('debería inicializar url y suscribirse a estados', () => {
      mockCadenaOriginalService.generarCadena130118.mockReturnValue(
        of(baseResponse({ foo: 'bar' }))
      );

      mockCadenaOriginal130118Service.obtenerCadenaOriginal.mockReturnValue(
        of(baseResponse('cadenaOriginalMock'))
      );

      component.ngOnInit();

      expect(component.url).toBe('/tramite/130118');
    });
  });

  describe('obtenerCadenaOriginal', () => {
    it('debería establecer datosCadena y cadenaOriginal si éxito', () => {
      const respuestaCadena = baseResponse({ foo: 'bar' });
      const respuestaObtener = baseResponse('cadenaOriginal');

      mockCadenaOriginalService.generarCadena130118.mockReturnValue(of(respuestaCadena));
      mockCadenaOriginal130118Service.obtenerCadenaOriginal.mockReturnValue(of(respuestaObtener));

      component.solicitudState = { idSolicitud: 123 } as any; // simula estado inicial

      component.obtenerCadenaOriginal();

      expect(mockCadenaOriginalService.generarCadena130118).toHaveBeenCalled();
      expect(mockCadenaOriginal130118Service.obtenerCadenaOriginal).toHaveBeenCalledWith('123', respuestaCadena.datos);
      expect(component.datosCadena).toEqual(respuestaCadena.datos);
      expect(component.cadenaOriginal).toBe('cadenaOriginal');
    });

    it('debería manejar error en generarCadena130118', () => {
      const error = new Error('Error en generarCadena130118');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      mockCadenaOriginalService.generarCadena130118.mockReturnValue(throwError(() => error));

      component.obtenerCadenaOriginal();

      expect(consoleSpy).toHaveBeenCalledWith('Error al cargar datos del trámite:', error);
    });

    it('debería manejar error en obtenerCadenaOriginal', () => {
      const error = new Error('Error en obtenerCadenaOriginal');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      mockCadenaOriginalService.generarCadena130118.mockReturnValue(
        of(baseResponse({ foo: 'bar' }))
      );
      mockCadenaOriginal130118Service.obtenerCadenaOriginal.mockReturnValue(throwError(() => error));

      component.solicitudState = { idSolicitud: 123 } as any;

      component.obtenerCadenaOriginal();

      expect(consoleSpy).toHaveBeenCalledWith('Error al iniciar trámite:', error);
    });
  });

  describe('datosFirma', () => {
    it('debería asignar datosFirmaReales y llamar obtieneFirma', () => {
      const datos = { firma: 'f', certSerialNumber: '123', rfc: 'rfc', fechaFin: '2025-01-01' };
      const spy = jest.spyOn(component, 'obtieneFirma').mockImplementation(() => { });

      component.datosFirma(datos);

      expect(component.datosFirmaReales).toEqual(datos);
      expect(spy).toHaveBeenCalledWith('f');
    });
  });

  describe('obtieneFirma', () => {
    beforeEach(() => {
      component.cadenaOriginal = 'cadena';
      component.datosFirmaReales = {
        firma: 'firma',
        certSerialNumber: 'cert',
        rfc: 'rfc',
        fechaFin: '2025-01-01',
      };
    });

    it('debería mostrar error si faltan datos', () => {
      component.cadenaOriginal = undefined;
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      component.obtieneFirma('firma');

      expect(consoleSpy).toHaveBeenCalledWith('Faltan datos para completar la firma');
      expect(component.nuevaNotificacion.categoria).toBe('danger');
      expect(mockDocumentoService.obtenerDatosFirma).not.toHaveBeenCalled();
    });

    it('debería ejecutar el flujo completo de firma con éxito', async () => {
      const documentosRequeridos = ['doc1', 'doc2'];

      mockDocumentoService.obtenerDatosFirma.mockReturnValue(
        of(baseResponse({ documentos_requeridos: documentosRequeridos }))
      );
      mockFirma130118Service.enviarFirma.mockReturnValue(of(baseResponse('folio123')));

      component.solicitudState = { idSolicitud: 123 } as any;

      component.obtieneFirma('firmaBase64');

      // Espera alguna condición o tiempo necesario
      await new Promise(r => setTimeout(r, 20));

      expect(mockDocumentoService.obtenerDatosFirma).toHaveBeenCalled();
      expect(mockFirma130118Service.enviarFirma).toHaveBeenCalled();
      expect(component.folio).toBe('folio123');
      expect(mockTramiteStore.establecerTramite).toHaveBeenCalledWith('folio123', 'firmaBase64', 123);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/acuse']); // o ruta correcta según arriba
    });

    it('debería manejar error en el flujo de firma', (done) => {
      mockDocumentoService.obtenerDatosFirma.mockReturnValue(throwError(() => new Error('Error firma')));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      component.solicitudState = { idSolicitud: 123 } as any;

      component.obtieneFirma('firmaBase64');

      setTimeout(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error en el proceso de firma:', expect.any(Error));
        done();
      }, 10);
    });
  });

  describe('ngOnDestroy', () => {
    it('debería completar destroy$', () => {
      const nextSpy = jest.spyOn(component['destroy$'], 'next');
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('formatFecha', () => {
    it('debería formatear correctamente la fecha', () => {
      const date = new Date('2024-07-19T15:30:20');
      const result = PasoTresComponent.formatFecha(date);
      expect(result).toBe('2024-07-19 15:30:20');
    });
  });
});
