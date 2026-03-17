import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { RenovacionesMuestrasMercanciasService } from './renovaciones-muestras-mercancias.service';
import { of } from 'rxjs';
import { ImportanteCatalogoSeleccion } from '../../models/registro-muestras-mercancias.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RenovacionesMuestrasMercanciasService', () => {
  let service: RenovacionesMuestrasMercanciasService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    const mockHttpClient = {
      get: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RenovacionesMuestrasMercanciasService,
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    });

    service = TestBed.inject(RenovacionesMuestrasMercanciasService);
    httpClientMock = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerOpcionesDesplegables should call HttpClient.get with correct URL and return expected data', (done) => {
    const mockResponse: ImportanteCatalogoSeleccion = {} as ImportanteCatalogoSeleccion;
    httpClientMock.get.mockReturnValue(of(mockResponse));

    service.obtenerOpcionesDesplegables().subscribe(result => {
      expect(result).toEqual(mockResponse);
      expect(httpClientMock.get).toHaveBeenCalledWith(
        'assets/json/30901/registro-muestras-mercancias.json'
      );
      done();
    });
  });
});