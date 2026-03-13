import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExportacionService } from './exportacion.service';
import { PermisoModel } from '../../shared/models/aviso-exportacion.model';
import { PreOperativo } from '../models/datos-modificacion.model';

describe('Servicio ExportacionService', () => {
  let service: ExportacionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExportacionService]
    });
    service = TestBed.inject(ExportacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('obtenerDatosLocalidad', () => {
    it('debería retornar datos del http get', (done) => {
      const mockData = { foo: 'bar' };
      service.obtenerDatosLocalidad().subscribe(data => {
        expect(data).toEqual(mockData);
        done();
      });
      const req = httpMock.expectOne('assets/json/260604/exportacion.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('debería manejar el error', (done) => {
      service.obtenerDatosLocalidad().subscribe({
        error: (err) => {
          expect(err.status).toBe(500);
          done();
        }
      });
      const req = httpMock.expectOne('assets/json/260604/exportacion.json');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('obtenerTabla', () => {
    it('debería retornar PermisoModel[] desde http get', (done) => {
      const mockTable: PermisoModel[] = [{ id: 1 } as unknown as PermisoModel];
      service.obtenerTabla().subscribe(data => {
        expect(data).toEqual(mockTable);
        done();
      });
      const req = httpMock.expectOne('assets/json/260604/terceros.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockTable);
    });
  });

  describe('obtenerRadio', () => {
    it('debería retornar PreOperativo[] desde http get', (done) => {
      const mockRadio: PreOperativo[] = [{ id: 1, nombre: 'Fisica' } as unknown as PreOperativo];
      service.obtenerRadio().subscribe(data => {
        expect(data).toEqual(mockRadio);
        done();
      });
      const req = httpMock.expectOne('assets/json/260604/tipoPersonaradio.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockRadio);
    });
  });
});
