import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegistroService } from './registro.service';
import { Tramite30506Store, Solicitud30506State, Catalogo, createInitialState } from '../state/tramite30506.store';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';

describe('RegistroService', () => {
  let service: RegistroService;
  let httpMock: HttpTestingController;
  let tramite30506StoreMock: any;

  const mockSolicitudData: Solicitud30506State = {
    numeroOperacion: 'OP123456',
    fechaInicio: '01/01/2024',
    fechaFinal: '31/12/2024',
    banco: 'BANCO_TEST',
    llave: 'LLAVE_TEST',
    manifiesto1: true,
    manifiesto2: false,
    fechaPago: '15/06/2024',
    folio: 'FOL123',
    claveReferencia: 'REF456',
    cadenaDependecia: 'CADENA_TEST',
    importePago: '1000.00'
  };

  const mockBancoCatalogo: Catalogo[] = [
    { id: 1, descripcion: 'Banco Nacional' },
    { id: 2, descripcion: 'Banco Internacional' },
    { id: 3, descripcion: 'Banco Regional' }
  ];

  beforeEach(async () => {
    tramite30506StoreMock = {
      setBanco: jest.fn(),
      setNumeroOperacion: jest.fn(),
      setFechaInicio: jest.fn(),
      setFechaFinal: jest.fn(),
      setLlave: jest.fn(),
      setFechaPago: jest.fn(),
      setManifiesto1: jest.fn(),
      setManifiesto2: jest.fn(),
      setClaveReferencia: jest.fn(),
      setCadenaDependecia: jest.fn(),
      setImportePago: jest.fn(),
      limpiarSolicitud: jest.fn(),
      reset: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RegistroService,
        { provide: Tramite30506Store, useValue: tramite30506StoreMock }
      ]
    }).compileComponents();

    service = TestBed.inject(RegistroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Constructor and Properties', () => {
    it('should initialize with correct URL properties', () => {
      expect(service.urlServer).toBe(ENVIRONMENT.URL_SERVER);
      expect(service.urlServerCatalogos).toBe(ENVIRONMENT.URL_SERVER_JSON_AUXILIAR);
    });

    it('should inject dependencies correctly', () => {
      expect(service['http']).toBeDefined();
      expect(service['tramite30506Store']).toBe(tramite30506StoreMock);
    });
  });

  describe('actualizarEstadoFormulario', () => {
    it('should call all store methods with correct data', () => {
      service.actualizarEstadoFormulario(mockSolicitudData);

      expect(tramite30506StoreMock.setBanco).toHaveBeenCalledWith(mockSolicitudData.banco);
      expect(tramite30506StoreMock.setNumeroOperacion).toHaveBeenCalledWith(mockSolicitudData.numeroOperacion);
      expect(tramite30506StoreMock.setFechaInicio).toHaveBeenCalledWith(mockSolicitudData.fechaInicio);
      expect(tramite30506StoreMock.setFechaFinal).toHaveBeenCalledWith(mockSolicitudData.fechaFinal);
      expect(tramite30506StoreMock.setLlave).toHaveBeenCalledWith(mockSolicitudData.llave);
      expect(tramite30506StoreMock.setFechaPago).toHaveBeenCalledWith(mockSolicitudData.fechaPago);
      expect(tramite30506StoreMock.setManifiesto1).toHaveBeenCalledWith(mockSolicitudData.manifiesto1);
      expect(tramite30506StoreMock.setManifiesto2).toHaveBeenCalledWith(mockSolicitudData.manifiesto2);
      expect(tramite30506StoreMock.setClaveReferencia).toHaveBeenCalledWith(mockSolicitudData.claveReferencia);
      expect(tramite30506StoreMock.setCadenaDependecia).toHaveBeenCalledWith(mockSolicitudData.cadenaDependecia);
      expect(tramite30506StoreMock.setImportePago).toHaveBeenCalledWith(mockSolicitudData.importePago);
    });

    it('should call all store methods exactly once', () => {
      service.actualizarEstadoFormulario(mockSolicitudData);

      expect(tramite30506StoreMock.setBanco).toHaveBeenCalledTimes(1);
      expect(tramite30506StoreMock.setNumeroOperacion).toHaveBeenCalledTimes(1);
      expect(tramite30506StoreMock.setFechaInicio).toHaveBeenCalledTimes(1);
      expect(tramite30506StoreMock.setFechaFinal).toHaveBeenCalledTimes(1);
      expect(tramite30506StoreMock.setLlave).toHaveBeenCalledTimes(1);
      expect(tramite30506StoreMock.setFechaPago).toHaveBeenCalledTimes(1);
      expect(tramite30506StoreMock.setManifiesto1).toHaveBeenCalledTimes(1);
      expect(tramite30506StoreMock.setManifiesto2).toHaveBeenCalledTimes(1);
      expect(tramite30506StoreMock.setClaveReferencia).toHaveBeenCalledTimes(1);
      expect(tramite30506StoreMock.setCadenaDependecia).toHaveBeenCalledTimes(1);
      expect(tramite30506StoreMock.setImportePago).toHaveBeenCalledTimes(1);
    });

    it('should handle empty string values', () => {
      const emptyData: Solicitud30506State = {
        numeroOperacion: '',
        fechaInicio: '',
        fechaFinal: '',
        banco: '',
        llave: '',
        manifiesto1: false,
        manifiesto2: false,
        fechaPago: '',
        folio: '',
        claveReferencia: '',
        cadenaDependecia: '',
        importePago: ''
      };

      service.actualizarEstadoFormulario(emptyData);

      expect(tramite30506StoreMock.setBanco).toHaveBeenCalledWith('');
      expect(tramite30506StoreMock.setNumeroOperacion).toHaveBeenCalledWith('');
      expect(tramite30506StoreMock.setFechaInicio).toHaveBeenCalledWith('');
      expect(tramite30506StoreMock.setFechaFinal).toHaveBeenCalledWith('');
      expect(tramite30506StoreMock.setLlave).toHaveBeenCalledWith('');
      expect(tramite30506StoreMock.setFechaPago).toHaveBeenCalledWith('');
      expect(tramite30506StoreMock.setManifiesto1).toHaveBeenCalledWith(false);
      expect(tramite30506StoreMock.setManifiesto2).toHaveBeenCalledWith(false);
      expect(tramite30506StoreMock.setClaveReferencia).toHaveBeenCalledWith('');
      expect(tramite30506StoreMock.setCadenaDependecia).toHaveBeenCalledWith('');
      expect(tramite30506StoreMock.setImportePago).toHaveBeenCalledWith('');
    });

    it('should handle boolean values correctly', () => {
      const dataWithBooleans: Solicitud30506State = {
        ...mockSolicitudData,
        manifiesto1: true,
        manifiesto2: false
      };

      service.actualizarEstadoFormulario(dataWithBooleans);

      expect(tramite30506StoreMock.setManifiesto1).toHaveBeenCalledWith(true);
      expect(tramite30506StoreMock.setManifiesto2).toHaveBeenCalledWith(false);
    });

    it('should handle different boolean combinations', () => {
      const dataWithDifferentBooleans: Solicitud30506State = {
        ...mockSolicitudData,
        manifiesto1: false,
        manifiesto2: true
      };

      service.actualizarEstadoFormulario(dataWithDifferentBooleans);

      expect(tramite30506StoreMock.setManifiesto1).toHaveBeenCalledWith(false);
      expect(tramite30506StoreMock.setManifiesto2).toHaveBeenCalledWith(true);
    });

    it('should handle initial state data', () => {
      const initialState = createInitialState();

      service.actualizarEstadoFormulario(initialState);

      expect(tramite30506StoreMock.setBanco).toHaveBeenCalledWith('');
      expect(tramite30506StoreMock.setFechaInicio).toHaveBeenCalledWith('29/05/2025');
      expect(tramite30506StoreMock.setFechaFinal).toHaveBeenCalledWith('29/06/2025');
      expect(tramite30506StoreMock.setManifiesto1).toHaveBeenCalledWith(false);
      expect(tramite30506StoreMock.setManifiesto2).toHaveBeenCalledWith(false);
    });
  });

  describe('getRegistroTomaMuestrasMercanciasData', () => {
    it('should return solicitud data from JSON file', () => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
        expect(data).toEqual(mockSolicitudData);
      });

      const req = httpMock.expectOne('assets/json/30506/registro_toma_muestras_mercancias.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockSolicitudData);
    });

    it('should handle HTTP error responses', () => {
      const errorMessage = 'HTTP Error';
      
      service.getRegistroTomaMuestrasMercanciasData().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne('assets/json/30506/registro_toma_muestras_mercancias.json');
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });

    it('should handle empty response', () => {
      const emptyResponse = {} as Solicitud30506State;

      service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
        expect(data).toEqual(emptyResponse);
      });

      const req = httpMock.expectOne('assets/json/30506/registro_toma_muestras_mercancias.json');
      req.flush(emptyResponse);
    });

    it('should handle null response', () => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
        expect(data).toBeNull();
      });

      const req = httpMock.expectOne('assets/json/30506/registro_toma_muestras_mercancias.json');
      req.flush(null);
    });

    it('should make correct HTTP request with proper URL', () => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe();

      const req = httpMock.expectOne('assets/json/30506/registro_toma_muestras_mercancias.json');
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe('assets/json/30506/registro_toma_muestras_mercancias.json');
      expect(req.request.headers.keys()).toEqual([]);
      
      req.flush(mockSolicitudData);
    });

    it('should handle network timeout', () => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.name).toBe('TimeoutError');
        }
      });

      const req = httpMock.expectOne('assets/json/30506/registro_toma_muestras_mercancias.json');
      req.error(new ProgressEvent('timeout'), { status: 0, statusText: 'Unknown Error' });
    });
  });

  describe('obtenerDatosBanco', () => {
    it('should return banco catalog data from JSON file', () => {
      service.obtenerDatosBanco().subscribe(data => {
        expect(data).toEqual(mockBancoCatalogo);
        expect(data).toHaveLength(3);
        expect(data[0]).toEqual({ id: 1, descripcion: 'Banco Nacional' });
        expect(data[1]).toEqual({ id: 2, descripcion: 'Banco Internacional' });
        expect(data[2]).toEqual({ id: 3, descripcion: 'Banco Regional' });
      });

      const req = httpMock.expectOne('assets/json/30506/banco.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockBancoCatalogo);
    });

    it('should handle empty banco catalog', () => {
      const emptyCatalog: Catalogo[] = [];

      service.obtenerDatosBanco().subscribe(data => {
        expect(data).toEqual(emptyCatalog);
        expect(data).toHaveLength(0);
      });

      const req = httpMock.expectOne('assets/json/30506/banco.json');
      req.flush(emptyCatalog);
    });

    it('should handle single banco item', () => {
      const singleBanco: Catalogo[] = [{ id: 1, descripcion: 'Único Banco' }];

      service.obtenerDatosBanco().subscribe(data => {
        expect(data).toEqual(singleBanco);
        expect(data).toHaveLength(1);
        expect(data[0].id).toBe(1);
        expect(data[0].descripcion).toBe('Único Banco');
      });

      const req = httpMock.expectOne('assets/json/30506/banco.json');
      req.flush(singleBanco);
    });

    it('should handle HTTP error for banco catalog', () => {
      service.obtenerDatosBanco().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne('assets/json/30506/banco.json');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should make correct HTTP request for banco catalog', () => {
      service.obtenerDatosBanco().subscribe();

      const req = httpMock.expectOne('assets/json/30506/banco.json');
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe('assets/json/30506/banco.json');
      expect(req.request.body).toBeNull();
      
      req.flush(mockBancoCatalogo);
    });

    it('should handle malformed JSON response', () => {
      service.obtenerDatosBanco().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeDefined();
        }
      });

      const req = httpMock.expectOne('assets/json/30506/banco.json');
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    });

    it('should handle null response for banco catalog', () => {
      service.obtenerDatosBanco().subscribe(data => {
        expect(data).toBeNull();
      });

      const req = httpMock.expectOne('assets/json/30506/banco.json');
      req.flush(null);
    });

    it('should handle banco catalog with special characters', () => {
      const specialCharsBanco: Catalogo[] = [
        { id: 1, descripcion: 'Banco Ñuñoa & Cía.' },
        { id: 2, descripcion: 'Banco María José' },
        { id: 3, descripcion: 'Banco €uro$' }
      ];

      service.obtenerDatosBanco().subscribe(data => {
        expect(data).toEqual(specialCharsBanco);
        expect(data[0].descripcion).toContain('Ñ');
        expect(data[1].descripcion).toContain('José');
        expect(data[2].descripcion).toContain('€');
      });

      const req = httpMock.expectOne('assets/json/30506/banco.json');
      req.flush(specialCharsBanco);
    });
  });

  describe('HTTP Error Handling', () => {
    it('should handle network connectivity issues', () => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeDefined();
        }
      });

      const req = httpMock.expectOne('assets/json/30506/registro_toma_muestras_mercancias.json');
      req.error(new ProgressEvent('network error'));
    });

    it('should handle 403 Forbidden error', () => {
      service.obtenerDatosBanco().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(403);
        }
      });

      const req = httpMock.expectOne('assets/json/30506/banco.json');
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });

    it('should handle 401 Unauthorized error', () => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne('assets/json/30506/registro_toma_muestras_mercancias.json');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('Service Integration', () => {
    it('should work correctly when called multiple times', () => {
      service.actualizarEstadoFormulario(mockSolicitudData);
      
      const differentData = { ...mockSolicitudData, banco: 'DIFFERENT_BANCO' };
      service.actualizarEstadoFormulario(differentData);

      expect(tramite30506StoreMock.setBanco).toHaveBeenCalledTimes(2);
      expect(tramite30506StoreMock.setBanco).toHaveBeenNthCalledWith(1, mockSolicitudData.banco);
      expect(tramite30506StoreMock.setBanco).toHaveBeenNthCalledWith(2, 'DIFFERENT_BANCO');
    });

    it('should handle concurrent HTTP requests', () => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe();
      service.obtenerDatosBanco().subscribe();

      const registroReq = httpMock.expectOne('assets/json/30506/registro_toma_muestras_mercancias.json');
      const bancoReq = httpMock.expectOne('assets/json/30506/banco.json');

      expect(registroReq.request.method).toBe('GET');
      expect(bancoReq.request.method).toBe('GET');

      registroReq.flush(mockSolicitudData);
      bancoReq.flush(mockBancoCatalogo);
    });

    it('should maintain service state across method calls', () => {
      expect(service.urlServer).toBe(ENVIRONMENT.URL_SERVER);
      
      service.actualizarEstadoFormulario(mockSolicitudData);
      
      expect(service.urlServer).toBe(ENVIRONMENT.URL_SERVER);
      expect(service.urlServerCatalogos).toBe(ENVIRONMENT.URL_SERVER_JSON_AUXILIAR);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined values in solicitud data', () => {
      const dataWithUndefined = {
        ...mockSolicitudData,
        banco: undefined as any,
        numeroOperacion: undefined as any
      };

      expect(() => service.actualizarEstadoFormulario(dataWithUndefined)).not.toThrow();
      
      expect(tramite30506StoreMock.setBanco).toHaveBeenCalledWith(undefined);
      expect(tramite30506StoreMock.setNumeroOperacion).toHaveBeenCalledWith(undefined);
    });

    it('should handle very long string values', () => {
      const longString = 'a'.repeat(1000);
      const dataWithLongStrings = {
        ...mockSolicitudData,
        banco: longString,
        claveReferencia: longString
      };

      service.actualizarEstadoFormulario(dataWithLongStrings);

      expect(tramite30506StoreMock.setBanco).toHaveBeenCalledWith(longString);
      expect(tramite30506StoreMock.setClaveReferencia).toHaveBeenCalledWith(longString);
    });

    it('should handle special characters in data', () => {
      const dataWithSpecialChars = {
        ...mockSolicitudData,
        banco: 'Banco "Special" & <Characters>',
        claveReferencia: '¿Cláve? ñ € $ @ #'
      };

      service.actualizarEstadoFormulario(dataWithSpecialChars);

      expect(tramite30506StoreMock.setBanco).toHaveBeenCalledWith('Banco "Special" & <Characters>');
      expect(tramite30506StoreMock.setClaveReferencia).toHaveBeenCalledWith('¿Cláve? ñ € $ @ #');
    });
  });
});