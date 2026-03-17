import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DomicilioDelEstablecimientoService } from './domicilio-del-establecimiento.service';
import { Catalogo } from '@ng-mf/data-access-user';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { MercanciasTabla, RespuestaTabla } from '../../modelos/modificación-del-permiso-sanitario-de-importación-de-insumo.model';

describe('DomicilioDelEstablecimientoService', () => {
  let service: DomicilioDelEstablecimientoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DomicilioDelEstablecimientoService],
    });

    service = TestBed.inject(DomicilioDelEstablecimientoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

it('should fetch representacion data', () => {
    const mockData: Catalogo[] = [
      {id:1, clave: 'RF01', descripcion: 'Representación 1' },
    ];

    service.getRepresentacion().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/260904/descriptionClave.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch entidad data', () => {
    const mockData: Catalogo[] = [
      { id: 1, clave: 'EF01', descripcion: 'Entidad 1' },
    ];

    service.getEntidad().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/260904/clavescian.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
