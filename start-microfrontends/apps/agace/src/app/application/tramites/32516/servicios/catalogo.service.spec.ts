import { TestBed } from '@angular/core/testing';
import { CatalogosService } from './catalogo.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Catalogo } from '@ng-mf/data-access-user';

describe('CatalogosService', () => {
  let service: CatalogosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CatalogosService]
    });
    service = TestBed.inject(CatalogosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch menu desplegable data', () => {
    const mockResponse = [{ id: 1, descripcion: 'Test' }] as Catalogo[];
    let result: Catalogo[] | undefined;
    service.obtenerMenuDesplegable('test.json').subscribe(data => result = data);

    const req = httpMock.expectOne('/assets/json/32516/test.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });

  it('should fetch levantar acta desplegable data', () => {
    const mockResponse = { data: [{ id: 2, descripcion: 'Levantar' }] as Catalogo[] };
    let result: Catalogo[] | undefined;
    service.obtenerLevantarActaDesplegable('levantar.json').subscribe(data => result = data);

    const req = httpMock.expectOne('/assets/json/32516/levantar.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(result).toEqual(mockResponse.data);
  });

  it('should fetch unidad desplegable data', () => {
    const mockResponse = { data: [{ id: 3, descripcion: 'Unidad' }] as Catalogo[] };
    let result: Catalogo[] | undefined;
    service.obtenerUnidadDesplegable('unidad.json').subscribe(data => result = data);

    const req = httpMock.expectOne('/assets/json/32516/unidad.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(result).toEqual(mockResponse.data);
  });

  it('should have correct RadioOpcion values', () => {
    expect(service.RadioOpcion).toEqual([
      { label: 'Sí', value: 'true' },
      { label: 'No', value: 'false' }
    ]);
  });
});