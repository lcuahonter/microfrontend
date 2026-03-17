import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Tramite40402Service } from './tramite40402.service';
import { Tramite40402Store } from './tramite40402.store';
import { CAATSolicitud } from '../models/transportacion-maritima.model';
import { Catalogo } from '@libs/shared/data-access-user/src';

describe('Tramite40402Service', () => {
  let service: Tramite40402Service;
  let httpMock: HttpTestingController;
  let store: Tramite40402Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Tramite40402Service, { provide: Tramite40402Store, useValue: {} }],
    });
    service = TestBed.inject(Tramite40402Service);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Tramite40402Store);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debe buscar el catálogo tipo CAAT aéreo', () => {
    const mockResponse: Catalogo[] = [
      { id: 1, descripcion: 'Aéreo' },
      { id: 2, descripcion: 'Marítimo' },
    ];
    service.getTipoDeCaatAerea().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('/assets/json/40402/tipo-CAAT-aéreo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería obtener el catálogo de códigos (getCodigoCatalogo)', () => {
    const mockResponse: Catalogo[] = [
      { id: 1, descripcion: 'COD1' },
      { id: 2, descripcion: 'COD2' },
    ];
    service.geTideCodTransportacionAerea().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('/assets/json/40402/codigo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debe buscar la solicitud CAAT de claveFolioCAAT', () => {
    const claveFolioCAAT = 'CAAT123';
    const mockResponse: CAATSolicitud = {
        idSolicitud: '',
        idPersonaSolicitud: '',
        ideGenerica1: '',
        claveFolioCAAT: '',
        cveFolioCaat: '',
        descripcionTipoCaat: '',
        tipoDeCaatAerea: '',
        ideCodTransportacionAerea: '',
        codIataIcao: '',
        fechaInicioVigencia: '',
        fechaFinVigencia: ''
    };
    service.buscarSolicitudPorCAATe(claveFolioCAAT).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`/api/solicitud/buscarPorCAAT?claveFolioCAAT=${claveFolioCAAT}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería manejar el error en buscarSolicitudPorCAATe', () => {
    const claveFolioCAAT = 'CAAT123';
    const errorMsg = 'Not Found';
    service.buscarSolicitudPorCAATe(claveFolioCAAT).subscribe({
      next: () => fail('debería haber dado un error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe(errorMsg);
      },
    });
    const req = httpMock.expectOne(`/api/solicitud/buscarPorCAAT?claveFolioCAAT=${claveFolioCAAT}`);
    req.flush(null, { status: 404, statusText: errorMsg });
  });
});
