import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ModificacionTransportacionMaritimaService } from './modificacion-transportacion-maritima.service';
import { RespuestaCaatTabla } from '../../models/modificacion-transportacion-maritima.model';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { TransportacionMaritima40202State } from '../../../../core/estados/tramites/tramite40202.store';

describe('ModificacionTransportacionMaritimaService (Jest)', () => {
  let service: ModificacionTransportacionMaritimaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ModificacionTransportacionMaritimaService],
    });

    service = TestBed.inject(ModificacionTransportacionMaritimaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be instantiated', () => {
    expect(service).toBeDefined();
  });

  describe('obtenerBuscarEmpresaCaat', () => {
    it('should return CAAT data from local JSON', () => {
      const mockResponse: RespuestaCaatTabla = {
        code: 200,
        data: [{
          rfc: '123456789184',
          nombreDenominacionRazonSocial: 'Empresa CAAT',
          caat: 'CAAT001',
          inicioVigencia: '20/6/2025',
          finVigencia: '25/6/2025',
          pais: 'Test pais'
        }],
        message: 'success'
      };

      service.obtenerBuscarEmpresaCaat().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/40202/buscar-empresa-caat.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getPaisCatalogo', () => {
    it('should return country catalog from JSON', () => {
      const mockResponse: RespuestaCatalogos = {
        code: 200,
        data: [
          { id: 1, descripcion: 'México' },
          { id: 2, descripcion: 'India' },
        ],
        message: 'Success'
      };

      service.getPaisCatalogo().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/40202/pais-catalogo.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getConsultaTransportacionMaritimaDatos', () => {
    it('should return maritime transport data', () => {
      const mockResponse: TransportacionMaritima40202State = {
        "tipoDeEmpresaOpcion": "2",
        "buscarPorDenominacionEx": "HAZEL NAVA AVILA",
        "folioCaatBusquedaEx": "3L8J",
        "caatRegistradoEmpresaTabla": [
          {
            "rfc": "12345678900",
            "nombreDenominacionRazonSocial": "HAZEL NAVA AVILA",
            "caat": "3L8J",
            "inicioVigencia": "2021-01-06 00:12:00.0 GMT-06:00",
            "finVigencia": "N/A",
            "pais": "COLOMBIA (REPUBLICA DE)",
            "nombrePFE": "HAZEL",
            "apellidoPaternoPFE": "NAVA",
            "apellidoMaternoPFE": "AVILA",
            "correoPFE": "hnavaa@ultrasist.com.mx",
            "codigoPostalPFE": "12345",
            "callePFE": "100",
            "numeroExteriorPFE": "1",
            "numeroInteriorPFE": "",
            "ciudadPFE": "Medellin",
            "estadoPFE": "ni idea"
          }
        ],
        "candidatoModificarCaatTabla": [
          {
            "rfc": "12345678900",
            "nombreDenominacionRazonSocial": "HAZEL NAVA AVILA",
            "correoElectronico": "hnavaa@ultrasist.com.mx",
            "domicilio": "100 1 Medellin ni idea undefined 12345",
            "nombreDG": ""
          }
        ]
      }

      service.getConsultaTransportacionMaritimaDatos().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/40202/consulta-transportacion-maritima.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('should handle error for CAAT service', () => {
      service.obtenerBuscarEmpresaCaat().subscribe({
        next: () => fail('Should not succeed'),
        error: (err) => {
          expect(err.status).toBe(500);
        },
      });

      const req = httpMock.expectOne('assets/json/40202/buscar-empresa-caat.json');
      req.flush('Error fetching data', { status: 500, statusText: 'Server Error' });
    });
  });
});
