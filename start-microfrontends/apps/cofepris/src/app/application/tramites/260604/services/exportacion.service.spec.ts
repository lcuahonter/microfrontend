import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { ExportacionService } from './exportacion.service';
import { PermisoModel } from '@libs/shared/data-access-user/src/core/models/260604/aviso-exportacion.model';

describe('Servicio ExportacionService', () => {
  let service: ExportacionService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        ExportacionService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });
    service = TestBed.inject(ExportacionService);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('getLocalidaddata', () => {
    it('debería devolver datos del método http get', (done) => {
      const mockData = { foo: 'bar' };
      httpClientMock.get.mockReturnValue(of(mockData));
      service.getLocalidaddata().subscribe(data => {
        expect(data).toEqual(mockData);
        done();
      });
    });

    it('debería manejar el error y llamar a throwError', (done) => {
      const error = new Error('Error de prueba');
      httpClientMock.get.mockReturnValue(throwError(() => error));
      service.getLocalidaddata().subscribe({
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('getTable', () => {
    it('debería devolver PermisoModel[] del método http get', (done) => {
      const mockTable: PermisoModel[] = [{ id: 1 } as unknown as PermisoModel];
      httpClientMock.get.mockReturnValue(of(mockTable));
      service.getTable().subscribe(data => {
        expect(data).toEqual(mockTable);
        done();
      });
    });
  });
});
