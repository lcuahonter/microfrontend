import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AmpliacionServiciosService } from './ampliacion-servicios.service';
import { AmpliacionServiciosStore } from '../estados/tramite80205.store';
import { Catalogo } from '../constantes/modificacion.enum';
import { Servicio, AmpliacionServiciosState, ServicioAmpliacion } from '../models/datos-info.model';
import { COMUN_URL } from '../../../core/server/api-router';

describe('AmpliacionServiciosService', () => {
  let service: AmpliacionServiciosService;
  let httpMock: HttpTestingController;
  let mockStore: jest.Mocked<AmpliacionServiciosStore>;

  const createMockStore = (): jest.Mocked<AmpliacionServiciosStore> => ({
    setInfoRegistro: jest.fn(),
    setAduanaDeIngresoSeleccion: jest.fn(),
    setNumeroPrograma: jest.fn(),
    setRfcEmpresa: jest.fn(),
    setTiempoPrograma: jest.fn(),
    setDatosImmex: jest.fn(),
    setDatos: jest.fn(),
  } as any);

  beforeEach(() => {
    mockStore = createMockStore();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AmpliacionServiciosService,
        { provide: AmpliacionServiciosStore, useValue: mockStore }
      ]
    });
    
    service = TestBed.inject(AmpliacionServiciosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  describe('Inicialización del Servicio', () => {
    it('debe ser creado', () => {
      expect(service).toBeTruthy();
    });

    it('debe inicializar host con la URL base correcta', () => {
      expect(service.host).toBe(COMUN_URL.BASE_URL);
    });
  });

  describe('Método getDatos', () => {
    it('debe obtener y mapear datos exitosamente', () => {
      const mockResponse = { 
        data: [
          { id: 1, descripcion: 'Servicio 1', tipode: 'tipo1' },
          { id: 2, descripcion: 'Servicio 2', tipode: 'tipo2' }
        ] 
      };
      const expectedData = mockResponse.data;

      service.getDatos().subscribe(data => {
        expect(data).toEqual(expectedData);
        expect(data).toHaveLength(2);
        expect(data[0].id).toBe(1);
        expect(data[0].descripcion).toBe('Servicio 1');
        expect(data[1].tipode).toBe('tipo2');
      });

      const req = httpMock.expectOne('assets/json/80205/ampliacion-servicios.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('debe manejar arreglo de datos vacío', () => {
      const mockResponse = { data: [] };

      service.getDatos().subscribe(data => {
        expect(data).toEqual([]);
        expect(data).toHaveLength(0);
      });

      const req = httpMock.expectOne('assets/json/80205/ampliacion-servicios.json');
      req.flush(mockResponse);
    });

    it('debe manejar respuesta con datos nulos', () => {
      const mockResponse = { data: null };

      service.getDatos().subscribe(data => {
        expect(data).toBeNull();
      });

      const req = httpMock.expectOne('assets/json/80205/ampliacion-servicios.json');
      req.flush(mockResponse);
    });

    it('debe manejar respuesta sin propiedad data', () => {
      const mockResponse = {};

      service.getDatos().subscribe(data => {
        expect(data).toBeUndefined();
      });

      const req = httpMock.expectOne('assets/json/80205/ampliacion-servicios.json');
      req.flush(mockResponse);
    });

    it('debe manejar error HTTP', () => {
      const errorMessage = 'Failed to load data';

      service.getDatos().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne('assets/json/80205/ampliacion-servicios.json');
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Método actualizarEstadoFormulario', () => {
    it('debe actualizar store con datos de estado completos', () => {
      const mockState: AmpliacionServiciosState = {
        servicios: { 
          seleccionaLaModalidad: 'modalidad1', 
          folio: 'FOL001', 
          ano: '2024',
          folioPrograma: 'PROG001'
        },
        aduanaDeIngresoSelecion: { id: 1, descripcion: 'Aduana Test' } as Catalogo,
        rfcEmpresa: 'RFC123456789',
        numeroPrograma: '12345',
        tiempoPrograma: '2024-2025',
        tablaDatosIMMEX: [
          { id: 1, descripcion: 'Servicio IMMEX 1', tipode: 'tipo1' }
        ],
        tablaDatos: [
          { 
            Servicio: 'Servicio A', 
            RegistroContribuyentes: 'RC001', 
            NumeroIMMEX: 'IMX001', 
            AñoIMMEX: '2024' 
          } as any
        ]
      };

      service.actualizarEstadoFormulario(mockState);

      expect(mockStore.setInfoRegistro).toHaveBeenCalledWith(mockState.servicios);
      expect(mockStore.setAduanaDeIngresoSeleccion).toHaveBeenCalledWith(mockState.aduanaDeIngresoSelecion as Catalogo);
      expect(mockStore.setNumeroPrograma).toHaveBeenCalledWith(mockState.numeroPrograma);
      expect(mockStore.setRfcEmpresa).toHaveBeenCalledWith(mockState.rfcEmpresa);
      expect(mockStore.setTiempoPrograma).toHaveBeenCalledWith(mockState.tiempoPrograma);
      expect(mockStore.setDatosImmex).toHaveBeenCalledWith(mockState.tablaDatosIMMEX);
      expect(mockStore.setDatos).toHaveBeenCalledWith(mockState.tablaDatos);
    });

    it('debe manejar arreglos vacíos en datos de estado', () => {
      const mockState: AmpliacionServiciosState = {
        servicios: { 
          seleccionaLaModalidad: '', 
          folio: '', 
          ano: '',
          folioPrograma: ''
        },
        aduanaDeIngresoSelecion: { id: 0, descripcion: '' } as Catalogo,
        rfcEmpresa: '',
        numeroPrograma: '',
        tiempoPrograma: '',
        tablaDatosIMMEX: [],
        tablaDatos: []
      };


      service.actualizarEstadoFormulario(mockState);

      expect(mockStore.setDatosImmex).toHaveBeenCalledWith([]);
      expect(mockStore.setDatos).toHaveBeenCalledWith([]);
    });

    it('debe convertir apropiadamente tablaDatosIMMEX a arreglo ServicioAmpliacion', () => {
      const tablaDatosIMMEX = [
        { id: 1, descripcion: 'Test', tipode: 'tipo' }
      ];
      const mockState: AmpliacionServiciosState = {
        servicios: { seleccionaLaModalidad: '', folio: '', ano: '', folioPrograma: '' },
        aduanaDeIngresoSelecion: { id: 1, descripcion: 'test' } as Catalogo,
        rfcEmpresa: '',
        numeroPrograma: '',
        tiempoPrograma: '',
        tablaDatosIMMEX,
        tablaDatos: []
      };

      service.actualizarEstadoFormulario(mockState);

      expect(mockStore.setDatosImmex).toHaveBeenCalledWith(tablaDatosIMMEX as unknown as ServicioAmpliacion[]);
    });
  });

  describe('Método getServiciosData', () => {
    it('debe obtener AmpliacionServiciosState completo exitosamente', () => {
      const mockState: AmpliacionServiciosState = {
        servicios: { 
          seleccionaLaModalidad: 'modalidad1', 
          folio: 'FOL001', 
          ano: '2024',
          folioPrograma: 'PROG001'
        },
        aduanaDeIngresoSelecion: { id: 1, descripcion: 'Aduana Test' } as Catalogo,
        rfcEmpresa: 'RFC123456789',
        numeroPrograma: '12345',
        tiempoPrograma: '2024-2025',
        tablaDatosIMMEX: [
          { id: 1, descripcion: 'Servicio 1', tipode: 'tipo1' }
        ],
        tablaDatos: [
          { 
            Servicio: 'Servicio A', 
            RegistroContribuyentes: 'RC001', 
            NumeroIMMEX: 'IMX001', 
            AñoIMMEX: '2024' 
          } as any
        ]
      };

      service.getServiciosData().subscribe(data => {
        expect(data).toEqual(mockState);
        expect(data.servicios.seleccionaLaModalidad).toBe('modalidad1');
        expect(data.aduanaDeIngresoSelecion.id).toBe(1);
        expect(data.rfcEmpresa).toBe('RFC123456789');
        expect(data.tablaDatosIMMEX).toHaveLength(1);
        expect(data.tablaDatos).toHaveLength(1);
      });

      const req = httpMock.expectOne('assets/json/80205/ampliacion-campo.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockState);
    });

    it('debe manejar respuesta de estado vacío', () => {
      const emptyState: AmpliacionServiciosState = {
        servicios: { seleccionaLaModalidad: '', folio: '', ano: '', folioPrograma: '' },
        aduanaDeIngresoSelecion: { id: 0, descripcion: '' } as Catalogo,
        rfcEmpresa: '',
        numeroPrograma: '',
        tiempoPrograma: '',
        tablaDatosIMMEX: [],
        tablaDatos: []
      };

      service.getServiciosData().subscribe(data => {
        expect(data).toEqual(emptyState);
        expect(data.tablaDatosIMMEX).toHaveLength(0);
        expect(data.tablaDatos).toHaveLength(0);
      });

      const req = httpMock.expectOne('assets/json/80205/ampliacion-campo.json');
      req.flush(emptyState);
    });

    it('debe manejar error HTTP para getServiciosData', () => {
      const errorMessage = 'Server error';

      service.getServiciosData().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne('assets/json/80205/ampliacion-campo.json');
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('Pruebas de Integración', () => {
    it('debe manejar múltiples llamadas secuenciales a getDatos', () => {
      const mockResponse1 = { data: [{ id: 1, descripcion: 'First', tipode: 'tipo1' }] };
      const mockResponse2 = { data: [{ id: 2, descripcion: 'Second', tipode: 'tipo2' }] };

      service.getDatos().subscribe(data => {
        expect(data).toEqual(mockResponse1.data);
      });

      let req = httpMock.expectOne('assets/json/80205/ampliacion-servicios.json');
      req.flush(mockResponse1);

      service.getDatos().subscribe(data => {
        expect(data).toEqual(mockResponse2.data);
      });

      req = httpMock.expectOne('assets/json/80205/ampliacion-servicios.json');
      req.flush(mockResponse2);
    });

    it('debe manejar múltiples actualizaciones de store', () => {
      const state1: AmpliacionServiciosState = {
        servicios: { seleccionaLaModalidad: 'mod1', folio: 'fol1', ano: '2024', folioPrograma: 'prog1' },
        aduanaDeIngresoSelecion: { id: 1, descripcion: 'aduana1' } as Catalogo,
        rfcEmpresa: 'rfc1',
        numeroPrograma: 'num1',
        tiempoPrograma: 'tiempo1',
        tablaDatosIMMEX: [],
        tablaDatos: []
      };

      const state2: AmpliacionServiciosState = {
        servicios: { seleccionaLaModalidad: 'mod2', folio: 'fol2', ano: '2025', folioPrograma: 'prog2' },
        aduanaDeIngresoSelecion: { id: 2, descripcion: 'aduana2' } as Catalogo,
        rfcEmpresa: 'rfc2',
        numeroPrograma: 'num2',
        tiempoPrograma: 'tiempo2',
        tablaDatosIMMEX: [],
        tablaDatos: []
      };

      service.actualizarEstadoFormulario(state1);
      service.actualizarEstadoFormulario(state2);

      expect(mockStore.setInfoRegistro).toHaveBeenCalledTimes(2);
      expect(mockStore.setInfoRegistro).toHaveBeenNthCalledWith(1, state1.servicios);
      expect(mockStore.setInfoRegistro).toHaveBeenNthCalledWith(2, state2.servicios);
    });
  });
});