import { TestBed } from '@angular/core/testing';

import { ContribuyenteRespuesta, ManifiestosRespuesta, BasicRequerimientosRespuesta } from '../../models/donaciones-extranjeras.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DonacionesExtranjerasService } from './donaciones-extranjeras.service';
import { RespuestaCatalogos } from 'libs/shared/data-access-user/src/core/models/shared/catalogos.model';

describe('DonacionesExtranjerasService', () => {
  let service: DonacionesExtranjerasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DonacionesExtranjerasService]
    });
    service = TestBed.inject(DonacionesExtranjerasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch manifiestos', () => {
    const MOCK_RESPONSE: ManifiestosRespuesta = { data: [] };

    service.getManifiestos().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/manifiestos.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch basic requerimientos', () => {
    const MOCK_RESPONSE: BasicRequerimientosRespuesta = { data: [] };

    service.getBasicoRequerimientos().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/basic-requerimientos.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch aduana', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code:200, data: [], message: 'Success' };

    service.getAduana().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/aduana.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch destino donacion', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code:200, data: [], message: 'Success' };

    service.getDestinoDonacion().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/destino-donacion.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch tipo de mercancia', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code:200, data: [], message: 'Success' };

    service.getTipoDeMercancia().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/tipo-de-mercancia.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch unidad de medida', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code:200, data: [], message: 'Success' };

    service.getUnidadMedida().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/umc.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch umt', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code:200, data: [], message: 'Success' };

    service.getUmt().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/umt.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch procedencia otro', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code:200, data: [], message: 'Success' };

    service.getProcedenciaOtro().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/procedencia-otro.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch condicion mercancia', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code:200, data: [], message: 'Success' };

    service.getCondicionMercancia().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/condicion-mercancia.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch pais origen medicamento', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code:200, data: [], message: 'Success' };

    service.getPaisOrigenMedicamento().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/pais-origen-medicamento.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch pais procedencia medicamento', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code:200, data: [], message: 'Success' };

    service.getPaisProcedenciaMedicamento().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/pais-procedencia-medicamento.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch paises', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code:200, data: [], message: 'Success' };

    service.getPaises().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/paises.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch documento residencia', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code:200, data: [], message: 'Success' };

    service.getDocumentoResidencia().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/documento-residencia.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch contribuyente by RFC', () => {
    const MOCK_RESPONSE: ContribuyenteRespuesta = { data: [] };

    service.buscarContribuyente('XAXX010101000').subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/donatario-datos.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch registro de donacion', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code:200, data: [], message: 'Success' };

    service.getRegistroDeDonacionDatos().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/registro-de-donacion-datos.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch pais procedencia', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code:200, data: [], message: 'Success' };

    service.getPaisProcedencia().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/pais-procedencia-medicamento.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch Pais Medico Origen', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code:200, data: [], message: 'Success' };

    service.getPaisMedicoOrigen().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/pais-origen-medicamento.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch ano', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code:200, data: [], message: 'Success' };

    service.getAno().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/10303/ano.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });
});