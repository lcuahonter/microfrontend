import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AvisoOpcionesDeRadio } from '../models/aviso-catalogo.model';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { MercanciasDesmontadasOSinMontarService } from './mercancias-desmontadas-o-sin-montar.service';

describe('MercanciasDesmontadasOSinMontarService', () => {
  let service: MercanciasDesmontadasOSinMontarService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MercanciasDesmontadasOSinMontarService],
    });

    service = TestBed.inject(MercanciasDesmontadasOSinMontarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch options of radio from assets', () => {
    const mockResponse: AvisoOpcionesDeRadio = {
      opcionesDeRadio: [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' },
      ],
      required: true,
    };
  
    service.obtenerAvisoOpcionesDeRadio().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
  
    const req = httpMock.expectOne('assets/json/231002/aviso-opciones-de-radio.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error when fetching options of radio', () => {
    const mockError = { status: 500, statusText: 'Internal Server Error' };

    service.obtenerAvisoOpcionesDeRadio().subscribe({
      next: () => {
        fail('Expected error, but got success');
      },
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      },
    });

    const req = httpMock.expectOne('assets/json/231002/aviso-opciones-de-radio.json');
    expect(req.request.method).toBe('GET');
    req.flush('Error', mockError);
  });
});
