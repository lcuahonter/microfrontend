import { DatosDomicilioService } from './datos-domicilio.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('DatosDomicilioService', () => {
  let servicio: DatosDomicilioService;
  let httpClienteMock: { get: jest.Mock };

  beforeEach(() => {
    httpClienteMock = { get: jest.fn() };
    servicio = new DatosDomicilioService(httpClienteMock as any);
  });

  it('debería ser creado', () => {
    expect(servicio).toBeTruthy();
  });

  it('debería llamar a http.get con la URL correcta para getObtenerTablaDatos', (done) => {
    const respuestaMock = { data: 'prueba' };
    httpClienteMock.get.mockReturnValue(of(respuestaMock));
    servicio.getObtenerTablaDatos().subscribe((res) => {
      expect(res).toEqual(respuestaMock);
      expect(httpClienteMock.get).toHaveBeenCalledWith('assets/json/cofepris/clave-scian.json');
      done();
    });
  });

  it('debería llamar a http.get con la URL correcta para getObtenerMercanciasDatos', (done) => {
    const respuestaMock = { mercancias: [] };
    httpClienteMock.get.mockReturnValue(of(respuestaMock));
    servicio.getObtenerMercanciasDatos().subscribe((res) => {
      expect(res).toEqual(respuestaMock);
      expect(httpClienteMock.get).toHaveBeenCalledWith('assets/json/cofepris/mercancias-tabla.json');
      done();
    });
  });

  it('debería tener http inyectado como una propiedad pública', () => {
    expect(servicio.http).toBe(httpClienteMock);
  });
});
