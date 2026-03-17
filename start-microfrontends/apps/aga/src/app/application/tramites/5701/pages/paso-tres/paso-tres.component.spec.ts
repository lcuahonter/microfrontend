import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { TramiteFolioService } from '@ng-mf/data-access-user';
import { TramiteFolioStore } from '@ng-mf/data-access-user';
import { FirmaElectronicaService } from '@libs/shared/data-access-user/src/core/services/shared/firma-electronica/firma-electronica.service';
import { Tramite5701Query } from '../../../../core/queries/tramite5701.query';
import { Tramite5701Store } from '../../../../core/estados/tramites/tramite5701.store';
import { CadenaOriginalService } from '@ng-mf/data-access-user';
import { DocumentoService } from '@ng-mf/data-access-user';
import { of, throwError } from 'rxjs';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let mockRouter: jest.Mocked<any>;
  let mockTramiteFolioService: jest.Mocked<any>;
  let mockTramiteStore: jest.Mocked<any>;
  let mockFirmaService: jest.Mocked<any>;
  let mockTramite5701Query: jest.Mocked<any>;
  let mockTramite5701Store: jest.Mocked<any>;
  let mockCadenaOriginalService: jest.Mocked<any>;
  let mockDocumentoService: jest.Mocked<any>;

  beforeEach(() => {
    // Crear mocks de todos los servicios
    mockRouter = {
      url: '/tramites/5701/paso3',
      navigate: jest.fn((commands) => {
        const fullPath = Array.isArray(commands) ? commands.join('/') : commands;
        return Promise.resolve(true);
      }),
      createUrlTree: jest.fn((commands) => ({
        toString: () => {
          const baseUrl = '/tramites/5701';
          const path = Array.isArray(commands) ? commands.join('/') : commands;
          return `${baseUrl}/${path}`;
        }
      }))
    };

    mockTramiteFolioService = {
      obtenerTramite: jest.fn().mockReturnValue(of({ data: 'tramiteData' }))
    };

    mockTramiteStore = {
      establecerTramite: jest.fn()
    };

    mockFirmaService = {
      obtenerCadenaOriginal: jest.fn(),
      enviarFirma: jest.fn().mockReturnValue(of({ datos: 'folio123' }))
    };

    mockTramite5701Query = {
      getValue: jest.fn().mockReturnValue({ idSolicitud: '123' })
    };

    mockTramite5701Store = {
      // Agregar métodos si es necesario
    };

    mockCadenaOriginalService = {
      generarCadena: jest.fn().mockReturnValue(of({ datos: 'datosCadena' }))
    };

    mockDocumentoService = {
      obtenerDatosFirma: jest.fn().mockReturnValue(of({
        datos: { documentos_requeridos: ['doc1', 'doc2'] }
      }))
    };

    // Crear una instancia del componente con los mocks
    component = new PasoTresComponent(
      mockRouter as unknown as Router,
      mockTramiteFolioService as unknown as TramiteFolioService,
      mockTramiteStore as unknown as TramiteFolioStore,
      mockFirmaService as unknown as FirmaElectronicaService,
      mockTramite5701Query as unknown as Tramite5701Query,
      mockTramite5701Store as unknown as Tramite5701Store,
      mockCadenaOriginalService as unknown as CadenaOriginalService,
      mockDocumentoService as unknown as DocumentoService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ngOnInit', () => {
    it('debería establecer correctamente la URL y llamar a generarCadena', () => {
      component.ngOnInit();
      expect(component.url).toBe('/tramites/5701');
      expect(mockCadenaOriginalService.generarCadena).toHaveBeenCalled();
    });
  });

  describe('obtenerCadenaOriginal', () => {
    it('debería establecer datosCadena y cadenaOriginal si la respuesta es exitosa', () => {
      mockFirmaService.obtenerCadenaOriginal.mockReturnValue(of({ datos: 'cadenaOriginal' }));

      component.obtenerCadenaOriginal();

      expect(mockCadenaOriginalService.generarCadena).toHaveBeenCalled();
      expect(mockFirmaService.obtenerCadenaOriginal).toHaveBeenCalledWith('datosCadena');
      expect(component.datosCadena).toBe('datosCadena');
      expect(component.cadenaOriginal).toBe('cadenaOriginal');
    });

    it('debería manejar errores al generar la cadena', () => {
      const consoleSpy = jest.spyOn(console, 'error');
      mockCadenaOriginalService.generarCadena.mockReturnValue(throwError(() => new Error('Error')));

      component.obtenerCadenaOriginal();

      expect(consoleSpy).toHaveBeenCalledWith('Error al cargar datos del trámite:', expect.any(Error));
    });

    it('debería manejar errores al obtener la cadena original', () => {
      const consoleSpy = jest.spyOn(console, 'error');
      mockFirmaService.obtenerCadenaOriginal.mockReturnValue(throwError(() => new Error('Error')));

      component.obtenerCadenaOriginal();

      expect(consoleSpy).toHaveBeenCalledWith('Error al generar cadena:', expect.any(Error));
    });
  });

  describe('datosFirma', () => {
    it('debería asignar datosFirmaReales y llamar a obtieneFirma', () => {
      const mockDatos = {
        firma: 'firma123',
        certSerialNumber: 'cert123',
        rfc: 'RFC123',
        fechaFin: '2023-12-31'
      };

      jest.spyOn(component, 'obtieneFirma');

      component.datosFirma(mockDatos);

      expect(component.datosFirmaReales).toEqual(mockDatos);
      expect(component.obtieneFirma).toHaveBeenCalledWith('firma123');
    });
  });

  describe('obtieneFirma', () => {
    beforeEach(() => {
      component.cadenaOriginal = 'cadenaOriginal';
      component.datosFirmaReales = {
        firma: 'firma123',
        certSerialNumber: 'cert123',
        rfc: 'RFC123',
        fechaFin: '2023-12-31'
      };
    });

    it('debería completar correctamente el proceso de firma', () => {
      component.obtieneFirma('firma123');
    });

    it('no debería continuar si faltan cadenaOriginal o datosFirmaReales', () => {
      const consoleSpy = jest.spyOn(console, 'error');

      component.cadenaOriginal = undefined;
      component.obtieneFirma('firma123');

      expect(consoleSpy).toHaveBeenCalledWith('Faltan datos para completar la firma');
      expect(mockDocumentoService.obtenerDatosFirma).not.toHaveBeenCalled();
    });

    it('debería manejar errores en el proceso de firma', () => {
      const consoleSpy = jest.spyOn(console, 'error');
      mockDocumentoService.obtenerDatosFirma.mockReturnValue(throwError(() => new Error('Test Error')));

      component.obtieneFirma('firma123');

      expect(consoleSpy).toHaveBeenCalledWith('Error en el proceso de firma:', expect.any(Error));
    });
  });

  describe('ngOnDestroy', () => {
    it('debería completar el subject destroy$', () => {
      const nextSpy = jest.spyOn(component['destroy$'], 'next');
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
