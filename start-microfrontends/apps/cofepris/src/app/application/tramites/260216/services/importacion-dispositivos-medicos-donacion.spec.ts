import { TestBed } from '@angular/core/testing';
import { ImportacionDispositivosMedicosDonacionService } from './importacion-dispositivos-medicos-donacion.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Tramite260216State } from '../estados/tramite260216Store.store';

jest.mock('@angular/common/http');

describe('ImportacionDispositivosMedicosDonacionService', () => {
  let service: ImportacionDispositivosMedicosDonacionService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = { get: jest.fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        ImportacionDispositivosMedicosDonacionService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });

    service = TestBed.inject(ImportacionDispositivosMedicosDonacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRegistroTomaMuestrasMercanciasData', () => {
    it('should call http.get with correct URL and return observable', (done) => {
      const mockData: Tramite260216State = { campo: 'valor' } as any;
      httpClientMock.get.mockReturnValue(of(mockData));
      service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
        expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/260216/respuestaDeActualizacionDe.json');
        expect(data).toEqual(mockData);
        done();
      });
    });
  });
});