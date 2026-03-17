import { TestBed } from '@angular/core/testing';
import { TramiteFolioService, JSONResponse } from '../service/servicios-extraordinarios.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';

describe('TramiteFolioService', () => {
  let service: TramiteFolioService;
  let httpClientMock: any;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        TramiteFolioService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });

    service = TestBed.inject(TramiteFolioService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener el trámite correctamente', (done) => {
    const mockResponse: JSONResponse = {
      id: 1,
      descripcion: 'Trámite de prueba',
      codigo: 'ABC123',
      data: 'Información adicional'
    };

    httpClientMock.get.mockReturnValue(of(mockResponse));

    service.obtenerTramite(1).subscribe((resp: any) => {
      expect(resp).toEqual(mockResponse);
      expect(httpClientMock.get).toHaveBeenCalledWith(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/1`);
      done();
    });
  });

  it('debería manejar error cuando la solicitud falla', (done) => {
    const mockError = { status: 404, message: 'No encontrado' };
    httpClientMock.get.mockReturnValue(throwError(() => mockError));

    service.obtenerTramite(99).subscribe({
      next: () => {
        // No debería entrar aquí
        fail('La solicitud debería fallar');
      },
      error: (err: any) => {
        expect(err).toEqual(mockError);
        expect(httpClientMock.get).toHaveBeenCalledWith(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/99`);
        done();
      }
    });
  });
});
