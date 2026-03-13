import { TestBed } from '@angular/core/testing';
import { ImportacionArmasMunicionesService } from './importacion-armas-municiones.service';
import { Tramite240101Store } from '../estados/tramite240101Store.store';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Tramite240101State } from '../estados/tramite240101Store.store';

describe('ImportacionArmasMunicionesService', () => {
  let service: ImportacionArmasMunicionesService;
  let httpMock: HttpTestingController;
  let tramite240101Store: Tramite240101Store;

  beforeEach(() => {
    const storeMock = {
      update: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ImportacionArmasMunicionesService,
        { provide: Tramite240101Store, useValue: storeMock }
      ]
    });

    service = TestBed.inject(ImportacionArmasMunicionesService);
    httpMock = TestBed.inject(HttpTestingController);
    tramite240101Store = TestBed.inject(Tramite240101Store);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call store.update with merged state in actualizarEstadoFormulario', () => {
    const datos: Tramite240101State = { test: 'value' } as any;
    service.actualizarEstadoFormulario(datos);
    expect(tramite240101Store.update).toHaveBeenCalledWith(expect.any(Function));
    // Optionally, test the merge logic:
    const updateFn = (tramite240101Store.update as jest.Mock).mock.calls[0][0];
    const prevState = { prev: 'state' };
    expect(updateFn(prevState)).toEqual({ prev: 'state', test: 'value' });
  });

  it('should fetch registro tomar muestras datos from JSON', () => {
    const mockResponse: Tramite240101State = { test: 'mock' } as any;
    service.obtenerRegistroTomarMuestrasDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/240101/respuestaDeActualizacionDe.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});