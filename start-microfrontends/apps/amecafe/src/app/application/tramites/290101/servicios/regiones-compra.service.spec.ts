import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductoTablaServicios } from './regiones-compra.service';

describe('ProductoTablaServicios', () => {
  let service: ProductoTablaServicios;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoTablaServicios]
    });
    service = TestBed.inject(ProductoTablaServicios);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch regiones compra data from JSON', () => {
    const mockData = [
      { id: 1, nombre: 'Región 1' },
      { id: 2, nombre: 'Región 2' }
    ];
    let result: any[] | undefined;
    service.obtenerDatos().subscribe(data => (result = data));

    const req = httpMock.expectOne('/assets/json/290101/producto-tabla-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(result).toEqual(mockData);
  });
});