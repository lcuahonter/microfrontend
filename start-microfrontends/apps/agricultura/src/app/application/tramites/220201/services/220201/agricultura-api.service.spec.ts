import { HttpClient } from '@angular/common/http';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { AgriculturaApiService } from './agricultura-api.service';

describe('AgriculturaApiService', () => {
  let service: AgriculturaApiService;
  let httpClientMock: Partial<HttpClient>;
  let seccionStoreMock: Partial<SeccionLibStore>;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn()
    };
    seccionStoreMock = {};

    service = new AgriculturaApiService(
      httpClientMock as HttpClient,
      seccionStoreMock as SeccionLibStore
    );
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerSelectorList debe llamar a http.get con la url correcta y mapear la respuesta', (done) => {
    const fileName = 'catalogo.json';
    const mockResponse = { data: [{ id: 1, nombre: 'Catalogo1' }] };

    (httpClientMock.get as jest.Mock).mockReturnValue(of(mockResponse));

    service.obtenerSelectorList(fileName).subscribe(data => {
      expect(data).toEqual(mockResponse.data);
      expect(httpClientMock.get).toHaveBeenCalledWith(service.url + fileName);
      done();
    });
  });

  it('obtenerRespuestaPorUrl debe llamar a http.get con la url correcta', (done) => {
    const url = 'datos-solicitud.json';
    const mockData = { id: 123, nombre: 'Solicitud' };

    (httpClientMock.get as jest.Mock).mockReturnValue(of(mockData));

    service.obtenerRespuestaPorUrl(url).subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientMock.get).toHaveBeenCalledWith(`../../../../../assets/json/220202/${url}`);
      done();
    });
  });

  it('obtenerProductoRespuestaPorUrl debe llamar a http.get con la url correcta', (done) => {
    const url = 'productos-catalogo.json';
    const mockData = { productos: ['producto1', 'producto2'] };

    (httpClientMock.get as jest.Mock).mockReturnValue(of(mockData));

    service.obtenerProductoRespuestaPorUrl(url).subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientMock.get).toHaveBeenCalledWith(`../../../../../assets/json/220202/${url}`);
      done();
    });
  });

});
