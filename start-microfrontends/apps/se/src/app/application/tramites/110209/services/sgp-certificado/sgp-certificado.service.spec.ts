import { TestBed } from '@angular/core/testing';

import { SgpCertificadoService } from './sgp-certificado.service';
import { of } from 'rxjs';
import { Tramite110209State } from '../../estados/stores/tramite110209.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('SgpCertificadoService', () => {
  let service: SgpCertificadoService;

  beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],

    // ...other config
  });
  service = TestBed.inject(SgpCertificadoService);
});

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });
});
describe('SgpCertificadoService - getCertificadoDatos', () => {
  let service: SgpCertificadoService;
  let httpMock: any;
  let tramite110209StoreMock: any;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    };
    tramite110209StoreMock = {};
    service = new SgpCertificadoService(httpMock, tramite110209StoreMock);
  });

  it('debe llamar a http.get con la URL correcta y retornar el observable', (done) => {
    const mockResponse: Tramite110209State = { } as Tramite110209State;
    httpMock.get.mockReturnValue(of(mockResponse));

    service.getCertificadoDatos().subscribe((result) => {
      expect(result).toBe(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/110209/sgp-certificado-datos.json');
      done();
    });
  });

  it('debe retornar un observable que emite el valor esperado', (done) => {
    const expectedData: Tramite110209State = { /* mock properties as needed */ } as Tramite110209State;
    httpMock.get.mockReturnValue(of(expectedData));

    service.getCertificadoDatos().subscribe((data) => {
      expect(data).toEqual(expectedData);
      done();
    });
  });
});
