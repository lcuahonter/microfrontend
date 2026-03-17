import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransportacionMaritimaService } from './transportacion-maritima.service';
import { RespuestaCaatTabla, RespuestaContribuyenteTabla, RespuestaContribuyentePMNTabla } from '../../models/transportacion-maritima.model';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

describe('TransportacionMaritimaService', () => {
  let service: TransportacionMaritimaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransportacionMaritimaService],
    });

    service = TestBed.inject(TransportacionMaritimaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the country catalog (getPaisCatalogo)', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code: 200, data: [{ id: 1, descripcion: 'México' }], message: 'Success' };

    service.getPaisCatalogo().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/40201/pais-catalogo.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch the state catalog (getEstadoCatalogo)', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code: 200, data: [{ id: 1, descripcion: 'Estado' }], message: 'Success' };

    service.getEstadoCatalogo().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/40201/estado-catalogo.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch the municipality catalog (getMunicipioCatalogo)', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code: 200, data: [{ id: 1, descripcion: 'Municipio' }], message: 'Success' };

    service.getMunicipioCatalogo().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/40201/municipio-catalogo.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch the colony catalog (getColoniaCatalogo)', () => {
    const MOCK_RESPONSE: RespuestaCatalogos = { code: 200, data: [{ id: 1, descripcion: 'Colonia' }], message: 'Success' };

    service.getColoniaCatalogo().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/40201/colonia-catalogo.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch the CAAT company catalog (obtenerBuscarEmpresaCaat)', () => {
    const MOCK_RESPONSE: RespuestaCaatTabla = {
      code: 200,
      data: [
        {
          rfc: 'RFC123',
          nombreDenominacionRazonSocial: 'Empresa 1',
          caat: 'CAAT123',
          perfilCaat: 'Perfil 1',
          inicioVigencia: '2025-01-01',
          finVigencia: '2025-12-31',
          pais: 'México',
        }
      ],
      message: 'Success'
    };

    service.obtenerBuscarEmpresaCaat().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/40201/buscar-empresa-caat.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });

  it('should fetch the buscar contribuyente PFN tabla datos (buscarContribuyentePFN)', () => {
    const MOCK_RESPONSE: RespuestaContribuyenteTabla = {
      code: 200,
      data: [
        {
          "rfcPFN": "MAVL621207C95",
          "nombrePFN": "EUROFOODS DE MEXICO",
          "apellidoPaternoPFN": "GONZALEZ",
          "apellidoMaternoPFN": "PINAL",
          "paisPFN": 1,
          "codigoPostalPFN": "34000",
          "estadoPFN": 1,
          "municipioPFN": 1,
          "localidadPFN": "",
          "coloniaPFN": 1,
          "callePFN": "LIBERTAD",
          "numeroExteriorPFN": "SN",
          "numeroInteriorPFN": "",
          "domicilioPFN": ""
        }
      ],
      message: 'Success'
    };

    service.buscarContribuyentePFN().subscribe((response) => {
      expect(response).toEqual(MOCK_RESPONSE);
    });

    const REQ = httpMock.expectOne('assets/json/40201/buscar-contribuyente-pfn-datos.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_RESPONSE);
  });
});