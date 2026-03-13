import { AdaceService } from './adace.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('AdaceService', () => {
  let service: AdaceService;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    service = new AdaceService(httpMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerDatosMes should call http.get with correct URL and return observable', (done) => {
    const mockResponse = [{ id: 1, descripcion: 'Enero' }];
    httpMock.get.mockReturnValue(of(mockResponse));

    service.obtenerDatosMes().subscribe((result) => {
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/32508/mes.json');
      expect(result).toEqual(mockResponse);
      done();
    });
  });

  it('obtenerDatosAno should call http.get with correct URL and return observable', (done) => {
    const mockResponse = [{ id: 1, descripcion: '2024' }];
    httpMock.get.mockReturnValue(of(mockResponse));

    service.obtenerDatosAno().subscribe((result) => {
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/32508/ano.json');
      expect(result).toEqual(mockResponse);
      done();
    });
  });

});

