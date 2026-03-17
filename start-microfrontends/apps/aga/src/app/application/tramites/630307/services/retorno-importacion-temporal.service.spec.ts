import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RetornoImportacionTemporalService } from './retorno-importacion-temporal.service';
import { Catalogo } from '@libs/shared/data-access-user/src';

describe('RetornoImportacionTemporalService', () => {
  let service: RetornoImportacionTemporalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RetornoImportacionTemporalService],
    });

    service = TestBed.inject(RetornoImportacionTemporalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch seccion aduanera data', () => {
    const mockData: Catalogo[] = [{ id: 1, descripcion: 'Sección 1' }];

    service.getSeccionAduanera().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/assets/json/630307/seccion-aduanera.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch aduana de ingreso data', () => {
    const mockData: Catalogo[] = [{ id: 2, descripcion: 'Aduana 1' }];

    service.getAduanaDeIngreso().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/assets/json/630307/aduana-de-ingreso.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch prorroga data', () => {
    const mockData: Catalogo[] = [{ id: 3, descripcion: 'Prórroga 1' }];

    service.getProrroga().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/assets/json/630307/prorroga.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch propietario data', () => {
    const mockData: Catalogo[] = [{ id: 4, descripcion: 'Propietario 1' }];

    service.getPropietario().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/assets/json/630307/propietario.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch tipo de propietario data', () => {
    const mockData: Catalogo[] = [{ id: 5, descripcion: 'Tipo Propietario 1' }];

    service.getTipoDePropietario().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/assets/json/630307/tipo-de-propietario.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch pais data', () => {
    const mockData: Catalogo[] = [{ id: 6, descripcion: 'País 1' }];

    service.getPais().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/assets/json/630307/pais.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

});