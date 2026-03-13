import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipoMovimientoService } from './tipo-movimiento.service';

describe('TipoMovimientoService', () => {
  let service: TipoMovimientoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoMovimientoService]
    });
    service = TestBed.inject(TipoMovimientoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener datos de aduana', () => {
    const mockData = [{ id: 1, descripcion: 'Aduana 1' }];
    service.getAduanaData().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/250101/aduana.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener datos de inspectoria', () => {
    const mockData = [{ id: 2, descripcion: 'Inspectoria 1' }];
    service.getInspectoriaData().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/250101/inspectoria-profepa.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener datos de alcaldía', () => {
    const mockData = [{ id: 3, descripcion: 'Municipio 1' }];
    service.getAlcaldiaData().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/250101/municipio-alcaldia.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});