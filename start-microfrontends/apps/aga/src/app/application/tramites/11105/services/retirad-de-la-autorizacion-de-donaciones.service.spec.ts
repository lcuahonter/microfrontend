import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Catalogo, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { DetallesDelMercancia, RespuestaConsulta } from '@libs/shared/data-access-user/src/core/models/11105/detalles-del-merchancia.model';
import { RetiradaDeLaAutorizacionDeDonacionesService } from './retirad-de-la-autorizacion-de-donaciones.service';

describe('RetiradaDeLaAutorizacionDeDonacionesService', () => {
  let service: RetiradaDeLaAutorizacionDeDonacionesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RetiradaDeLaAutorizacionDeDonacionesService],
    });
    service = TestBed.inject(RetiradaDeLaAutorizacionDeDonacionesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAduanaIngresara should return expected data', () => {
    const mockData: Catalogo[] = [{ id: 1, descripcion: 'Aduana Test' } as Catalogo];

    service.getAduanaIngresara().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/11105/aduana-ingresara.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('getDetallesDelMercanciaDatos should return expected data', () => {
    const mockData: DetallesDelMercancia = { detalle: 'Mercancia 1' } as any;

    service.getDetallesDelMercanciaDatos().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/11105/detalles-del-mercancia-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('getDatosConsulta should return expected data', () => {
    const mockData: RespuestaConsulta = { success: true, datos: {} } as any;

    service.getDatosConsulta().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/11105/consulta_11105.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('getPaisCatalogo should return expected data', () => {
    const mockData: RespuestaCatalogos = { catalogos: [] } as any;

    service.getPaisCatalogo().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/11105/pais.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});