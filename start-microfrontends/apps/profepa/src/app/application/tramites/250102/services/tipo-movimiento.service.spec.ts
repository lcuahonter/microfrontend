import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipoMovimientoService } from './tipo-movimiento.service';
import { Catalogo } from '@libs/shared/data-access-user/src';

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
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener datos de aduanas', () => {
    const dummyAduanaData: Catalogo[] = [
      { id: 1, descripcion: 'Aduana 1' },
      { id: 2, descripcion: 'Aduana 2' }
    ];

    service.obtenerAduanaData().subscribe(data => {
      expect(data).toEqual(dummyAduanaData);
    });

    const req = httpMock.expectOne('assets/json/250102/aduana.json');
    expect(req.request.method).toBe('GET');
    req.flush(dummyAduanaData);
  });

  it('debe obtener datos de inspectorías', () => {
    const dummyInspectoriaData: Catalogo[] = [
      { id: 10, descripcion: 'Inspectoria A' },
      { id: 20, descripcion: 'Inspectoria B' }
    ];

    service.obtenerInspectoriaData().subscribe(data => {
      expect(data).toEqual(dummyInspectoriaData);
    });

    const req = httpMock.expectOne('assets/json/250102/inspectoria-profepa.json');
    expect(req.request.method).toBe('GET');
    req.flush(dummyInspectoriaData);
  });

  it('debe obtener datos de alcaldías', () => {
    const dummyAlcaldiaData: Catalogo[] = [
      { id: 100, descripcion: 'Alcaldía X' },
      { id: 200, descripcion: 'Alcaldía Y' }
    ];

    service.obtenerAlcaldíaData().subscribe(data => {
      expect(data).toEqual(dummyAlcaldiaData);
    });

    const req = httpMock.expectOne('assets/json/250102/municipio-alcaldia.json');
    expect(req.request.method).toBe('GET');
    req.flush(dummyAlcaldiaData);
  });
});
