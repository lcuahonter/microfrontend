import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SolicitudService } from './solicitud.service';
import { Tramite120404Store } from '../estados/store/tramite120404.store';
import { Tramite120404State } from '../estados/store/tramite120404.store';
import { of } from 'rxjs';

describe('SolicitudService', () => {
  let service: SolicitudService;
  let httpMock: HttpTestingController;
  let mockStore: jest.Mocked<Tramite120404Store>;

  class MockTramite120404Query {
    allStoreData$ = of({ a: 1, b: 2 });
    selectTramite120404$ = of({});
    getValue = () => ({});
  }

  beforeEach(() => {
    mockStore = {
      establecerDatos: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SolicitudService,
        { provide: Tramite120404Store, useValue: mockStore },
        { provide: require('../estados/queries/tramite120404.query').Tramite120404Query, useClass: MockTramite120404Query },
      ],
    });

    service = TestBed.inject(SolicitudService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call establecerDatos with correct state in actualizarEstadoFormulario', () => {
    const mockState: Tramite120404State = { folio: 'ABC123' } as any;
    service.actualizarEstadoFormulario(mockState);
    expect(mockStore.establecerDatos).toHaveBeenCalledWith(mockState);
  });

  it('should fetch data from JSON file in getRegistroTomaMuestrasMercanciasData', () => {
    const mockResponse: Tramite120404State = { folio: 'XYZ789' } as any;

    service.getRegistroTomaMuestrasMercanciasData().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/120404/asignciondirecta.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
  
    it('should send POST request and return response in guardarDatosPost', () => {
      const mockPayload = { test: 'data' };
      const mockResponse = { codigo: '00', mensaje: 'OK' };
      service.guardarDatosPost('120404', mockPayload).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpMock.expectOne((r) => r.method === 'POST' && r.url.includes('120404'));
      expect(req.request.body).toEqual(mockPayload);
      req.flush(mockResponse);
    });
  
    it('should send POST request and return response in obtenerBuscarDatos', () => {
      const mockPayload = { test: 'search' };
      const mockResponse = { codigo: '01', mensaje: 'BUSCAR' };
      service.obtenerBuscarDatos('120404', mockPayload).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpMock.expectOne((r) => r.method === 'POST' && r.url.includes('120404'));
      expect(req.request.body).toEqual(mockPayload);
      req.flush(mockResponse);
    });
  
    it('should combine and merge state in getAllState', (done) => {
      class MockTramite120404Query {
        allStoreData$ = of({ a: 1, b: 2 });
      }
      (service as any).tramite120404Query = new MockTramite120404Query();
      service.getAllState().subscribe((result) => {
        expect(result).toEqual({ a: 1, b: 2 });
        done();
      });
    });
});
