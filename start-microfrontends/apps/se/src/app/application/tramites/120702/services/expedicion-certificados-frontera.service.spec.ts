import { TestBed } from '@angular/core/testing';
import { ExpedicionCertificadosFronteraService } from './expedicion-certificados-frontera.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Solicitud120702State, Tramite120702Store } from '../estados/tramite120702.store';
import { Tramite120702Query } from '../estados/tramite120702.query';
import { MontoExpedirTablaDatos } from '../models/expedicion-certificados-frontera.models';

describe('ExpedicionCertificadosFronteraService', () => {
  let service: ExpedicionCertificadosFronteraService;
  let httpMock: HttpTestingController;
  let store: Tramite120702Store;
  
  const mockStore = {
    setAnoDelOficio: jest.fn(),
    setNumeroOficio: jest.fn(),
    setMontoAExpedir: jest.fn(),
    setFechaInicio: jest.fn(),
    setFechaFin: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ExpedicionCertificadosFronteraService,
        { provide: Tramite120702Store, useValue: mockStore },
        { provide: Tramite120702Query, useValue: {} }
      ]
    });
    service = TestBed.inject(ExpedicionCertificadosFronteraService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Tramite120702Store);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('getAnoOficioDatos', () => {
    it('debería retornar un array de Catalogo', () => {
      const mockResponse: Catalogo[] = [
        { id: 1, descripcion: 'Año 2023' },
        { id: 2, descripcion: 'Año 2024' }
      ];

      service.getAnoOficioDatos().subscribe(data => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/120702/ano-oficio.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getMontoExpedirTabla', () => {
    it('debería retornar MontoExpedirTablaDatos', () => {
      const mockResponse: MontoExpedirTablaDatos = {
        columns: ['Monto']
      };

      service.getMontoExpedirTabla().subscribe(data => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/120702/monto-expedir.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getRegistroTomaMuestrasMercanciasData', () => {
    it('debería retornar Solicitud120702State', () => {
      const mockResponse: Solicitud120702State = {
        anoDelOficio: { id: 1, descripcion: '2023' },
        numeroOficio: 123,
        montoAExpedir: 1000,
        fechaInicioVigencia: '2025-01-01',
        fechaFinVigencia: '2025-12-31',
        estado: '', // Add appropriate mock value
        representacionFederal: '', // Add appropriate mock value
        montoAsignado: 0, // Add appropriate mock value
        montoExpedido: 0, // Add appropriate mock value
        montoDisponible: 0, // Mock value
        datosNumeroOficio: 0, // Mock value, adjust type as needed
        montoADisponible: 0, // Mock value
        totalAExpedir: 0 // Mock value
      };

      service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/120702/expedicion-certificados-consulta.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('actualizarEstadoFormulario', () => {
    it('debería llamar a los setters del store con el estado proporcionado', () => {
      const mockState: Solicitud120702State = {
        anoDelOficio: { id: 1, descripcion: '2023' },
        numeroOficio: 987,
        montoAExpedir: 1500,
        fechaInicioVigencia: '2024-06-01',
        fechaFinVigencia: '2024-12-31',
        estado: '', // mock value
        representacionFederal: '', // mock value
        montoAsignado: 0, // mock value
        montoExpedido: 0, // mock value
        montoDisponible: 0, // mock value
        datosNumeroOficio: 0, // mock value
        montoADisponible: 0, // mock value
        totalAExpedir: 0 // mock value
      };

      service.actualizarEstadoFormulario(mockState);

      expect(store.setAnoDelOficio).toHaveBeenCalledWith({ id: 1, descripcion: '2023' });
      expect(store.setNumeroOficio).toHaveBeenCalledWith(987);
      expect(store.setMontoAExpedir).toHaveBeenCalledWith(1500);
      expect(store.setFechaInicio).toHaveBeenCalledWith('2024-06-01');
      expect(store.setFechaFin).toHaveBeenCalledWith('2024-12-31');
    });
  });
});
