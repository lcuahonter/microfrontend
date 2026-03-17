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
    httpMock.verify();
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener el catálogo de países (getPaisCatalogo)', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [{ id: 1, descripcion: 'México' }], message: 'Success' };

    service.getPaisCatalogo().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/40402/pais-catalogo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería obtener el catálogo de estados (getEstadoCatalogo)', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [{ id: 1, descripcion: 'Estado' }], message: 'Success' };

    service.getEstadoCatalogo().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/40402/estado-catalogo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería obtener el catálogo de municipios (getMunicipioCatalogo)', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [{ id: 1, descripcion: 'Municipio' }], message: 'Success' };

    service.getMunicipioCatalogo().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/40402/municipio-catalogo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería obtener el catálogo de colonias (getColoniaCatalogo)', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [{ id: 1, descripcion: 'Colonia' }], message: 'Success' };

    service.getColoniaCatalogo().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/40402/colonia-catalogo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería obtener el catálogo de empresas CAAT (obtenerBuscarEmpresaCaat)', () => {
    const mockResponse: RespuestaCaatTabla = {
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
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/40402/buscar-empresa-caat.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

    it('debería obtener los datos del contribuyente PFN (buscarContribuyentePFN)', () => {
      const mockResponse: RespuestaContribuyenteTabla = {
        code: 200,
        data: [
          {
            nombrePFN: 'Juan',
            rfcPFN: 'RFC456',
            apellidoPaternoPFN: 'Perez',
            apellidoMaternoPFN: 'Gomez',
            paisPFN: 'México',
            codigoPostalPFN: '03100',
            estadoPFN: 'CDMX',
            municipioPFN: 'Benito Juárez',
            localidadPFN: 'Del Valle',
            coloniaPFN: 'Del Valle',
            callePFN: 'Insurgentes',
            numeroExteriorPFN: '123',
            numeroInteriorPFN: 'A',
            domicilioPFN: 'Insurgentes 123, Del Valle, CDMX',
          }
        ],
        message: 'Success'
      };

      service.buscarContribuyentePFN().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/40402/buscar-contribuyente-pfn-datos.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('debería obtener los datos del contribuyente PMN (buscarContribuyentePMN)', () => {
      const mockResponse: RespuestaContribuyentePMNTabla = {
        code: 200,
        data: [
          {
            rfcPMN: 'RFC789',
            denominacionPMN: 'Empresa Moral',
            correoPMN: 'contacto@empresamoral.com',
            paisPMN: 'México',
            codigoPostalPMN: '03100',
            estadoPMN: 'CDMX',
            municipioPMN: 'Benito Juárez',
            localidadPMN: 'Del Valle',
            coloniaPMN: 'Del Valle',
            callePMN: 'Insurgentes',
            numeroExteriorPMN: '456',
            numeroInteriorPMN: 'B',
            nombreDirectorGeneral: 'Carlos López',
            apellidoPaternoDirectorGeneral: 'López',
            apellidoMaternoDirectorGeneral: 'Martínez',
            domicilioPMN: 'Insurgentes 456, Del Valle, CDMX',
          }
        ],
        message: 'Success'
      };

      service.buscarContribuyentePMN().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/40402/buscar-contribuyente-pmn-datos.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('debería obtener los datos de consulta (getDatosConsulta)', () => {
      const mockResponse = {
        success: true,
        datos: {
          seguroNumero: 'SN123',
          nombrePFE: 'Ana',
          apellidoPaternoPFE: 'Martínez',
          apellidoMaternoPFE: 'García',
          correoPFE: 'ana.martinez@example.com',
          paisPFE: 'España',
        },
        message: 'Consulta exitosa'
      };

      service.getDatosConsulta().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/40402/consulta_40402.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
});