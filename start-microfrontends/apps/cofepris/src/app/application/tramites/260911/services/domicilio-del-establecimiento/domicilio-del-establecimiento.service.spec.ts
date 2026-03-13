import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DomicilioDelEstablecimientoService } from './domicilio-del-establecimiento.service';
import { Catalogo } from '@ng-mf/data-access-user';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { MercanciasTabla, RespuestaTabla } from '../../models/modificación-del-permiso-sanitario-de-importación-de-insumo.model';

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

  it('should fetch tabla datos', () => {
    const mockData: RespuestaTabla = {
      code: 200,
      data: [{ clave_Scian: 'SC01', descripcion_Scian: 'Descripción SC01' }],
      message: 'OK'
    };

    service.obtenerTablaDatos().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/260911/tablaDatos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch estado list', () => {
    const mockData: RespuestaCatalogos = {
      code: 200,
      data: [],
      message: 'OK'
    };

    service.obtenerEstadoList().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/260911/seleccion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch mercancias datos', () => {
    const mockData: MercanciasTabla = {
      code: 200,
      data: [{ clasificacion: 'Medicamento', descripcionFraccion: 'Mercancía 1', especificar: '', denominacionEspecifica: '', denominacionDistintiva: '', denominacionComun: '', formaFarmaceutica: '', estadoFisico: '', fraccionArancelaria: '', unidad: '', cantidadUMC: '', unidadUMT: '', cantidadUMT: '', presentacion: '', numeroRegistro: '', paisDeOrigen: '', paisDeProcedencia: '', tipoProducto: '', usoEspecifico: '', fechaCaducidad: '' }],
      message: 'OK'
    };

    service.obtenerMercanciasDatos().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/260911/mercanciasDatos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch representacion data', () => {
    const mockData: Catalogo[] = [
      {id:1, clave: 'RF01', descripcion: 'Representación 1' },
    ];

    service.getRepresentacion().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/260911/descriptionClave.json');
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

    const req = httpMock.expectOne('assets/json/260911/clavescian.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
