import { TestBed } from '@angular/core/testing';
import { CatalogosService } from './catalogos.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

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

  it('should fetch aduana de ingreso', () => {
    const mockResponse: RespuestaCatalogos = { data: [{ id: 1, descripcion: 'Aduana' }], code: 200, message: 'OK' };
    let result: RespuestaCatalogos | undefined;
    service.obtenerAduanaDeIngreso().subscribe(data => result = data);

    const req = httpMock.expectOne('/assets/json/290101/aduana_de_ingreso.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });

  it('should fetch bodega propia/alquilada', () => {
    const mockResponse: RespuestaCatalogos = { data: [{ id: 2, descripcion: 'Propia' }], code: 200, message: 'OK' };
    let result: RespuestaCatalogos | undefined;
    service.cargarBodegaPropiaAlquilad().subscribe(data => result = data);

    const req = httpMock.expectOne('/assets/json/290101/propia-alquilada.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });

  it('should fetch estado catalog', () => {
    const mockResponse: RespuestaCatalogos = { data: [{ id: 3, descripcion: 'Estado' }], code: 200, message: 'OK' };
    let result: RespuestaCatalogos | undefined;
    service.cargarEstadoCatalog().subscribe(data => result = data);

    const req = httpMock.expectOne('/assets/json/290101/estado.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });

  it('should fetch clasificacion', () => {
    const mockResponse: RespuestaCatalogos = { data: [{ id: 4, descripcion: 'Clasificacion' }], code: 200, message: 'OK' };
    let result: RespuestaCatalogos | undefined;
    service.cargarClasificacion().subscribe(data => result = data);

    const req = httpMock.expectOne('/assets/json/290101/propia-alquilada.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });

  it('should fetch tipo de cafe', () => {
    const mockResponse: RespuestaCatalogos = { data: [{ id: 5, descripcion: 'Tipo de Cafe' }], code: 200, message: 'OK' };
    let result: RespuestaCatalogos | undefined;
    service.cargarTipoDeCafe().subscribe(data => result = data);

    const req = httpMock.expectOne('/assets/json/290101/tipo-de-cafe.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });

  it('should have correct RadioOpcion values', () => {
    expect(service.RadioOpcion).toEqual([
      { label: 'Sí', value: 'true' },
      { label: 'No', value: 'false' }
    ]);
  });
});