import { TestBed } from '@angular/core/testing';
import { PermisoPetroleoService } from './permiso-petroleo.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('PermisoPetroleoService', () => {
  let service: PermisoPetroleoService;
  let httpClientMock: { get: jest.Mock };

  beforeEach(() => {
    httpClientMock = { get: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        PermisoPetroleoService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });

    service = TestBed.inject(PermisoPetroleoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http.get with correct URL in obtenerTabla', async () => {
    const mockResponse = [{ id: 1 }];
    httpClientMock.get.mockReturnValue(of(mockResponse));
    const result = await service.obtenerTabla().toPromise();
    expect(result).toEqual(mockResponse);
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/130302/petroleo.json');
  });

  it('should call http.get with correct URL in getSolicitante', async () => {
    const mockResponse = { saldoDisponible: 100 };
    httpClientMock.get.mockReturnValue(of(mockResponse));
    const result = await service.getSolicitante().toPromise();
    expect(result).toEqual(mockResponse);
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/130302/permiso.json');
  });
});