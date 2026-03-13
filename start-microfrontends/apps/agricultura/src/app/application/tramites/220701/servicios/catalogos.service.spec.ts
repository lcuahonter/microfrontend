import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CatalogosService } from './catalogos.service';
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

  it('obtenerPuntoInspeccion should GET punto.json', () => {
    const mockResponse = { data: 'punto' } as unknown as RespuestaCatalogos;
    service.obtenerPuntoInspeccion().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('/assets/json/220701/punto.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('obtenerSanidadAgropecuaria should GET oficina_de_inspeccion.json', () => {
    const mockResponse = { data: 'sanidad' } as unknown as RespuestaCatalogos;
    service.obtenerSanidadAgropecuaria().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('/assets/json/220701/oficina_de_inspeccion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('obtenerAduanaDeIngreso should GET aduana_de_ingreso.json', () => {
    const mockResponse = { data: 'aduana' } as unknown as RespuestaCatalogos;
    service.obtenerAduanaDeIngreso().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('/assets/json/220701/aduana_de_ingreso.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('obtenerEstablecimiento should GET establecimiento.json', () => {
    const mockResponse = { data: 'establecimiento' } as unknown as RespuestaCatalogos;
    service.obtenerEstablecimiento().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('/assets/json/220701/establecimiento.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('obtenerVeterinario should GET nombre.json', () => {
    const mockResponse = { data: 'veterinario' } as unknown as RespuestaCatalogos;
    service.obtenerVeterinario().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('/assets/json/220701/nombre.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('obtenerRegimen should GET regimen.json', () => {
    const mockResponse = { data: 'regimen' } as unknown as RespuestaCatalogos;
    service.obtenerRegimen().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('/assets/json/220701/regimen.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});