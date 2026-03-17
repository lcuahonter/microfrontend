import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AutoridadService } from './autoridad.service';
import { CatalogosSelect } from '@libs/shared/data-access-user/src';
import { CapturarElTextoLibre, RequerimientoOpcions, RespuestaContenedor } from '../models/datos-tramite.model';
import { of } from 'rxjs';

describe('AutoridadService', () => {
  let service: AutoridadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AutoridadService],
    });
    service = TestBed.inject(AutoridadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tramite list', (done) => {
    const mockResponse: CatalogosSelect = {
      catalogos: [
        {
          id: 1,
          descripcion: 'Documentos',
        },
        {
          id: 2,
          descripcion: 'Documentos 1',
        },
        {
          id: 3,
          descripcion: 'Documentos 2',
        },
      ],
      required: false,
      labelNombre: 'Tipo de trámite',
      primerOpcion: 'Seleccione un valor',
    };

    service.obtenerTramiteLista().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne('assets/json/32401/tipo-de-tramite.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch aduana list', (done) => {
    const mockResponse: CatalogosSelect = {
      catalogos: [
        {
          id: 1,
          descripcion: 'Documentos',
        },
        {
          id: 2,
          descripcion: 'Documentos 1',
        },
        {
          id: 3,
          descripcion: 'Documentos 2',
        },
      ],
      required: false,
      labelNombre: 'Tipo de trámite',
      primerOpcion: 'Seleccione un valor',
    };

    service.obtenerAduanaLista().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne(
      'assets/json/32401/tipo-de-requerimiento.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch solicitud data', (done) => {
    const mockResponse: RespuestaContenedor = {
      success: true,
      message: 'Solicitud enviada exitosamente',
      datos: {
        id: 1,
        folioTramite: '0100300701020160301001711',
        tipoTramite:
          'Aviso de Modificación para Certificación en Materia de IVA e IEPS ',
        rfc: 'RDC070320K75',
        razonSocial: 'RDCM S DE RL DE CV',
        estadoDelTramite: 'Concluido',
      },
    };

    service.agregarSolicitud().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne('assets/json/32401/contenedorLista.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch CapturarElTextoLibre data', (done) => {
    const mockResponse: CapturarElTextoLibre = {
      detalles_de_administracion_1:
        'Administración General de Auditoría de Comercio Exterior',
      detalles_de_administracion_2:
        'Administración central de Certificacion y Asintos Internacionales de Auditoria de',
      detalles_de_administracion_3:
        ' Administración de Certificacion y Asintos Internacionales de Auditoria de Camerdo',
      exterior: "Exterior '2'",
      officio: 'Officio',
      ciudad_de_mexico: 'Ciudad de Mexico, a',
      direccion_1: 'HOTEL Y RESAURANT RITZ DE TAB SA DE CV',
      direccion_2:
        'CALZADA DE MARISOLES LT1 47, COL.FRACC. INDUSTRVANERA, CP. 76900, CORREGIDORA, QUERÉTARO',
      identificacion: 'COR8002198KA',
    };

    service.agregarCapturarElTextoLibre().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne(
      'assets/json/32401/capturar-el-texto-libre.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch RequerimientoOpcions data', (done) => {
    const mockResponse: RequerimientoOpcions[] = [
      {
        value: 1,
        label: 'Opción 1',
      },
      {
        value: 2,
        label: 'Opción 2',
      },
      {
        value: 3,
        label: 'Opción 3',
      },
    ];

    service.agregarRequerimientoOpcions().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne(
      'assets/json/32401/requerimiento-opcions.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch requerimiento data', (done) => {
    const mockResponse = {
      motivoCancelacion: 'Motivo de prueba',
      tipoDeRequerimiento: 'Tipo de requerimiento de prueba',
      tipoDeDocumento: 'Tipo de documento de prueba',
      documentoAdicional: 'Documento adicional de prueba',
    };

    service.agregarRequerimiento().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne('assets/json/32401/requerimiento.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should update store state when actualizarEstadoFormulario is called', () => {
    const tramite32401StoreMock = {
      setMotivoCancelacion: jest.fn(()=> of()),
      setTipoDeRequerimiento: jest.fn(()=> of()),
      setTipoDeDocumento: jest.fn(()=> of()),
      setDocumentoAdicional: jest.fn(()=> of()),
    };
    
    const testService = new AutoridadService(
      TestBed.inject(HttpClientTestingModule as any),
      tramite32401StoreMock as any
    );

    const mockValor = {
      motivoCancelacion: 'Motivo',
      tipoDeRequerimiento: 'Tipo',
      tipoDeDocumento: 'Documento',
      documentoAdicional: 'Adicional',
    };

    testService.actualizarEstadoFormulario(mockValor as any);

    expect(tramite32401StoreMock.setMotivoCancelacion).toHaveBeenCalledWith('Motivo');
    expect(tramite32401StoreMock.setTipoDeRequerimiento).toHaveBeenCalledWith('Tipo');
    expect(tramite32401StoreMock.setTipoDeDocumento).toHaveBeenCalledWith('Documento');
    expect(tramite32401StoreMock.setDocumentoAdicional).toHaveBeenCalledWith('Adicional');
  });

  it('should fetch tipos de documentos', (done) => {
    const mockResponse: CatalogosSelect = {
      catalogos: [
        { id: 1, descripcion: 'Documento 1' },
        { id: 2, descripcion: 'Documento 2' },
      ],
      required: true,
      labelNombre: 'Tipo de documento',
      primerOpcion: 'Seleccione un documento',
    };

    service.getTiposDocumentos().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne('assets/json/32401/tipos-documentos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
