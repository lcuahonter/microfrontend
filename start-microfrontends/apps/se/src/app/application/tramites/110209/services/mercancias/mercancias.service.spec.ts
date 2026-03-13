import { TestBed } from '@angular/core/testing';
import { MercanciasService } from './mercancias.service';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { of } from 'rxjs';

const MERCANCIAS_URL = 'assets/json/110209/mercancias.json';
const TIPO_DE_FACTURA_URL = 'assets/json/110209/tipo-de-factura.json';
const UNIDAD_URL = 'assets/json/110209/unidad.json';

describe('MercanciasService', () => {
  let service: MercanciasService;
  let httpMock: any;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        MercanciasService,
        { provide: HttpCoreService, useValue: httpMock }
      ]
    });

    service = TestBed.inject(MercanciasService);
  });

  it('debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe llamar a http.get con la URL correcta en getMercancias', () => {
    const MOCK_RESPONSE_MERCANCIAS = [{ id: 1, nombre: 'Mercancia 1' }];
    httpMock.get.mockReturnValue(of(MOCK_RESPONSE_MERCANCIAS));

    service.getMercancias().subscribe(res => {
      expect(res).toEqual(MOCK_RESPONSE_MERCANCIAS);
    });

    expect(httpMock.get).toHaveBeenCalledWith(MERCANCIAS_URL);
  });

  it('debe llamar a http.get con la URL correcta en getTipoDeFactura', () => {
    const MOCK_RESPONSE_TIPO_FACTURA = [{ id: 1, nombre: 'Factura A' }];
    httpMock.get.mockReturnValue(of(MOCK_RESPONSE_TIPO_FACTURA));

    service.getTipoDeFactura().subscribe(res => {
      expect(res).toEqual(MOCK_RESPONSE_TIPO_FACTURA);
    });

    expect(httpMock.get).toHaveBeenCalledWith(TIPO_DE_FACTURA_URL);
  });

  it('debe llamar a http.get con la URL correcta en getUnidad', () => {
    const MOCK_RESPONSE_UNIDAD = [{ id: 1, nombre: 'Unidad A' }];
    httpMock.get.mockReturnValue(of(MOCK_RESPONSE_UNIDAD));

    service.getUnidad().subscribe(res => {
      expect(res).toEqual(MOCK_RESPONSE_UNIDAD);
    });

    expect(httpMock.get).toHaveBeenCalledWith(UNIDAD_URL);
  });
});