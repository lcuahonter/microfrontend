import { TestBed } from '@angular/core/testing';

import { AvisoSanitarioService } from './aviso-sanitario.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { ManifiestosRespuesta, MercanciaCrossList, RepresentanteLegalRespuesta } from '../models/aviso-model';

describe('AvisoSanitarioService', () => {
  let service: AvisoSanitarioService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AvisoSanitarioService,
        HttpClient
      ],
    });
    service = TestBed.inject(AvisoSanitarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch estado catalog', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: 'Success message' };
    service.getEstado('catalogo').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/260601/estado.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch producto clasificacion catalog', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [{
        "id": 1,
        "descripcion": "Producto_Clasificación_1"
      }], message: 'Success message'
    };
    service.getProductoClasificacion('catalogo').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/260601/producto-clasificacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch clave SCIAN catalog', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [{
        "id": 614041,
        "descripcion": "614041"
      }], message: 'Success message'
    };
    service.getClaveScian('catalogo').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/260601/clave-scian.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch especifico producto clasificacion catalog', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [{
        "id": 1,
        "descripcion": "Especifico_Producto_Clasificación_1"
      }], message: 'Success message'
    };
    service.getEspecificoProductoClasificacion('catalogo').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/260601/especifico-producto-clasificacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch pais catalog', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [{
        "id": 1,
        "descripcion": "País_1"
      }], message: 'Success message'
    };
    service.getPais('catalogo').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/260601/pais.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch tipo producto catalog', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [{
        "id": 1,
        "descripcion": "TipoProducto_1"
      }], message: 'Success message'
    };
    service.getTipoProducto('catalogo').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/260601/tipo-producto.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch pais destino catalog', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [{
        "id": 1,
        "descripcion": "País_Destino_1"
      }], message: 'Success message'
    };
    service.getPaisDestino('catalogo').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/260601/pais-destino.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch descripcion SCIAN catalog', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: 'Success message' };
    service.getDescripcionScian().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/260601/descripcion-scian.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch regímenes catalog', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: 'Success message' };
    service.getRegimenes('catalogo').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/260601/regimenes.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch manifiestos data', () => {
    const mockResponse: ManifiestosRespuesta = { data: [] };
    service.getManifiestos().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/260601/manifiestos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch representative legal RFC', () => {
    const mockResponse: RepresentanteLegalRespuesta = {
      data: [{
        rfc: 'MAVL1245678',
        nombreOrazonsocial: 'Miguel',
        apellidoPaterno: 'Aguilar',
        apellidoMaterno: 'Vázquez'
      },
      ]
    };
    service.buscarRfc().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/260601/representante-legal.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch mercancia crosslist data', () => {
    const mockResponse: MercanciaCrossList = {
      paisOrigenCrossList: {
        label: { tituluDeLaIzquierda: 'País de orígen:', derecha: 'País(es) seleccionado(s)*:' }, fechas: [
          "AFGANISTÁN (EMIRATO ISLÁMICO)",
          "ALBANIA (REPÚBLICA DE)",
          "ALEMANIA (REPÚBLICA FEDERAL DE)",
          "ANDORRA (PRINCIPADO DE)"
        ]
      },
      paisProcedencisCrossList: {
        label: { tituluDeLaIzquierda: 'País de procedencia:', derecha: 'País(es) seleccionado(s)*:' }, fechas: [
          "AFGANISTÁN (EMIRATO ISLÁMICO)",
          "ALBANIA (REPÚBLICA DE)",
          "ALEMANIA (REPÚBLICA FEDERAL DE)",
          "ANDORRA (PRINCIPADO DE)"
        ]
      },
      usoEspecificoCrossList: {
        label: { tituluDeLaIzquierda: 'Uso específico:', derecha: 'Uso específico seleccionada*:' }, fechas: [
          "AFGANISTÁN (EMIRATO ISLÁMICO)",
          "ALBANIA (REPÚBLICA DE)",
          "ALEMANIA (REPÚBLICA FEDERAL DE)",
          "ANDORRA (PRINCIPADO DE)"
        ]
      }
    };
    service.obtenerMercanciaCrosslist().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/260601/mercancia-crosslist.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
