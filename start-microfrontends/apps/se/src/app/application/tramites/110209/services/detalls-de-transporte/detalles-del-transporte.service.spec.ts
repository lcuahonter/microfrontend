import { TestBed } from '@angular/core/testing';
import { DetallesDelTransporteService } from './detalles-del-transporte.service';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { of } from 'rxjs';

const MOCK_RESPONSE = { data: 'test' };
const URL_DETALLES_DEL_TRANSPORTE = 'assets/json/110209/detalles-del-transporte.json';

describe('DetallesDelTransporteService', () => {
  let service: DetallesDelTransporteService;
  let httpMock: any;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        DetallesDelTransporteService,
        { provide: HttpCoreService, useValue: httpMock }
      ]
    });

    service = TestBed.inject(DetallesDelTransporteService);
  });

  it('debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe llamar a http.get con la URL correcta en getMedioDeTransporte', () => {
    httpMock.get.mockReturnValue(of(MOCK_RESPONSE));

    service.getMedioDeTransporte().subscribe(res => {
      expect(res).toEqual(MOCK_RESPONSE);
    });

    expect(httpMock.get).toHaveBeenCalledWith(URL_DETALLES_DEL_TRANSPORTE);
  });
});