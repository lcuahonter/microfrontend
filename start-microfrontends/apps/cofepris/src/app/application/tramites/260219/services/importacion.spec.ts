import { TestBed } from '@angular/core/testing';
import { ImportacionService } from './importacion.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Tramite260219Store } from '../estados/tramite260219Store.store';

jest.mock('@angular/common/http');
jest.mock('../estados/tramite260219Store.store');

describe('ImportacionService', () => {
  let service: ImportacionService;
  let httpClientMock: jest.Mocked<HttpClient>;
  let tramite260219StoreMock: jest.Mocked<Tramite260219Store>;

  beforeEach(() => {
    httpClientMock = { get: jest.fn() } as any;
    tramite260219StoreMock = {
      update: jest.fn((updater: any) => {
        // If updater is a function, call it with a dummy state
        if (typeof updater === 'function') {
          return updater({});
        }
        // Otherwise, just return the updater
        return updater;
      }),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        ImportacionService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: Tramite260219Store, useValue: tramite260219StoreMock },
      ],
    });

    service = TestBed.inject(ImportacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('actualizarEstadoFormulario', () => {
    it('should call tramite260219Store.update with the provided data', () => {
      const mockData: Tramite260219Store = { campo: 'valor' } as any;
      service.actualizarEstadoFormulario(mockData);
      expect(tramite260219StoreMock.update).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('getTramiteDatos', () => {
    it('should call http.get with correct URL and return observable', (done) => {
      const mockData: Tramite260219Store = { campo: 'valor' } as any;
      httpClientMock.get.mockReturnValue(of(mockData));
      service.getTramiteDatos().subscribe((data) => {
        expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/260219/datos-previos.json');
        expect(data).toEqual(mockData);
        done();
      });
    });
  });
});