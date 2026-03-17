import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ModificacionDescripcionService } from './modificacion-descripcion.service';
import { RespuestaConsulta } from '../models/modificacion-descripcion.model';
import { HttpCoreService, LoginQuery } from '@libs/shared/data-access-user/src';
import { Tramite130401Query } from '../../../estados/queries/tramite130401.query';
import { Tramite130401Store } from '../../../estados/tramites/tramite130401.store';
import { of } from 'rxjs';

describe('ModificacionDescripcionService', () => {
  let service: ModificacionDescripcionService;
  let httpMock: HttpTestingController;
  let httpCoreServiceMock: any;
  let loginQueryMock: any;
  let tramite130401QueryMock: any;
  let tramite130401StoreMock: any;

  beforeEach(() => {
    httpCoreServiceMock = {
      post: jest.fn()
    };

    loginQueryMock = {
      selectLoginState$: of({ rfc: 'test-rfc' })
    };

    tramite130401QueryMock = {
      selectSolicitud$: of({})
    };

    tramite130401StoreMock = {
      update: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ModificacionDescripcionService,
        { provide: HttpCoreService, useValue: httpCoreServiceMock },
        { provide: LoginQuery, useValue: loginQueryMock },
        { provide: Tramite130401Query, useValue: tramite130401QueryMock },
        { provide: Tramite130401Store, useValue: tramite130401StoreMock },
      ],
    });

    service = TestBed.inject(ModificacionDescripcionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get datos consulta', () => {
    const mockResponse: RespuestaConsulta = {
      success: true,
      message: "",
      datos: {
        "datosSolicitud": {
          "numeroFolioTramiteOriginal": "0201300100320242540000014",
          "numeroFolioResolucion": "test",
          "tramite": { "solicitud": true },
          "mercancia": "test",
          "tipoSolicitudPexim": "test",
          "mercanciaResponseDto": {
            "tipoSolicitudPexim": "test",
            "regimen": "test",
            "clasificacionRegimen": "test",
            "condicionMercancia": "test",
            "descripcion": "test",
            "fraccionArancelaria": "test",
            "unidadMedidaTarifaria": "test",
            "unidadesAutorizadas": "test",
            "importeFacturaAutorizadoUSD": "test"
          },
          "solicitud": "1",
          "clasificacionRegimen": "De importación",
          "condicionMercancia": "0",
          "mercanciaDescripcion": "PRUEBA QA PAU",
          "fraccionArancelaria": "98020019- Mercancías para el Programa",
          "unidadMedidaTarifaria": "Caja",
          "unidadesAutorizadas": "100",
          "importeFacturaAutorizadoUSD": "100",
          "usoEspecifico": "CANCULIACAN",
          "justificacionImportacionExportacion": "PRUEBAS QA",
          "observaciones": "PRUEBAS",
          "representacionFederal": "CULIACAN",
          "paises": "test"
        },
        "mercancia": {
          "numeroFolioResolucion": "2540R824038180",
          "cantidadLibreMercancia": "100",
          "descripcion": "PRUEBA QA PAU",
          "descripcionNuevaMercanciaPexim": "PRUEBA QA",
        },
        "mercanciaTablaDatos": [
          {
            "idPartidaSol": 1,
            "unidadesAutorizadas": "100",
            "descripcionAutorizada": "PRUEBA QA",
            "descripcionSolicitada": "PRUEBA QA",
            "importeUnitarioUSDAutorizado": "1",
            "importeTotalUSDAutorizado": "100"
          }
        ]
      }
    };

    service.getDatosConsulta().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/130401/consulta-130401.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call buscar method', () => {
    const mockBody = { folio: '123' };
    
    service.buscar(mockBody).subscribe((response) => {
      expect(response).toBeDefined();
      expect(response.datos).toBeDefined();
    });
  });

  it('should call guardarDatos method', () => {
    const mockBody = { data: 'test' };
    const mockResponse = { success: true };
    
    service.guardarDatos(mockBody).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://api-v30.cloud-ultrasist.net/api/sat-t130401/solicitud/guardar');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});