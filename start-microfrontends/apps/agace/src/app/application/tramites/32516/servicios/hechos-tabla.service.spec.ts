import { TestBed } from '@angular/core/testing';
import { HechosTablaServicios } from './hechos-tabla.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('HechosTablaServicios', () => {
  let service: HechosTablaServicios;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HechosTablaServicios]
    });
    service = TestBed.inject(HechosTablaServicios);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch hechos tabla data from JSON', () => {
    const mockData = [{ id: 1, descripcion: 'Hecho 1' }, { id: 2, descripcion: 'Hecho 2' }];
    let result: any[] | undefined;
    service.obtenerDatos().subscribe(data => (result = data));

    const req = httpMock.expectOne('/assets/json/32516/hechos-tabla-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(result).toEqual(mockData);
  });
});