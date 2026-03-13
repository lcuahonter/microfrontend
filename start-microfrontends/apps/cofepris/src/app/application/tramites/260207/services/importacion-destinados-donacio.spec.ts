import { TestBed } from '@angular/core/testing';
import { ImportacionDestinadosDonacioService } from './importacion-destinados-donacio.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Tramite260207Store } from '../estados/tramite260207Store.store';
import { Tramite260207State } from '../estados/tramite260207Store.store';

jest.mock('@angular/common/http');
jest.mock('../estados/tramite260207Store.store');

describe('ImportacionDestinadosDonacioService', () => {
  let service: ImportacionDestinadosDonacioService;
  let httpClientMock: jest.Mocked<HttpClient>;
  let tramite260207StoreMock: jest.Mocked<Tramite260207Store>;

  beforeEach(() => {
    httpClientMock = { get: jest.fn() } as any;
    tramite260207StoreMock = {
      update: jest.fn((updater: any) => {
        // If updater is a function, call it with a dummy state
        if (typeof updater === 'function') {
          return updater({});
        }
        // Otherwise, just return the updater
        return updater;
      })
    } as any;
  
    TestBed.configureTestingModule({
      providers: [
        ImportacionDestinadosDonacioService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: Tramite260207Store, useValue: tramite260207StoreMock }
      ]
    });
  
    service = TestBed.inject(ImportacionDestinadosDonacioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRegistroTomaMuestrasMercanciasData', () => {
    it('should call http.get with correct URL and return observable', (done) => {
      const mockData: Tramite260207State = { campo: 'valor' } as any;
      httpClientMock.get.mockReturnValue(of(mockData));
      service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
        expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/260207/datos.json');
        expect(data).toEqual(mockData);
        done();
      });
    });
  });
});