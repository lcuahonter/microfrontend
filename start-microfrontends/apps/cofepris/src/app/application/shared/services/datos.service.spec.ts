import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DatosService } from './datos.service';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { DatosProducto, PreOperativo, ScianData } from '../models/datos-modificacion.model';

describe('DatosService', () => {
  let service: DatosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DatosService]
    });
    service = TestBed.inject(DatosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener datos de estado', (done) => {
    const mockData: Catalogo[] = [{ id: 1, nombre: 'Estado' } as unknown as Catalogo];
    service.obtenerEstadoData().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/260603/estado.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener datos de datos-scian-tabla', (done) => {
    const mockData: ScianData[] = [{ id: 1, descripcion: 'desc' } as unknown as ScianData];
    service.obternerDatosData().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/260603/datos-scian-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener datos de clave-scian', (done) => {
    const mockData: Catalogo[] = [{ id: 1, nombre: 'Clave' } as unknown as Catalogo];
    service.obtenerClaveScian().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/260603/clave-scian.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener datos de descripcion-scian', (done) => {
    const mockData: Catalogo[] = [{ id: 1, nombre: 'Desc' } as unknown as Catalogo];
    service.obtenerDescripcionScian().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/260603/descripcion-scian.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener datos de pre-operativo', (done) => {
    const mockData: PreOperativo[] = [{ id: 1, nombre: 'Pre' } as unknown as PreOperativo];
    service.obtenerPreOperativo().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/260603/pre-operativo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener datos de datos-producto', (done) => {
    const mockData: DatosProducto[] = [{ id: 1, nombre: 'Prod' } as unknown as DatosProducto];
    service.obtenerDatosProducto().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/260603/datos-producto.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener datos de clasificacion-producto', (done) => {
    const mockData: Catalogo[] = [{ id: 1, nombre: 'Clas' } as unknown as Catalogo];
    service.obtenerClasificationProductos().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/260603/clasificacion-producto.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
