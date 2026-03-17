import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SolicitudDeRegistroInvocarService } from './solicitud-de-registro-invocar.service';
import { RespuestaTabla, InstalacionesPrincipalesRespuestaTabla, PersonaRespuestaTabla } from '@libs/shared/data-access-user/src/core/models/32614/dato-comunes.model';
import { 
  Solicitud32614MensajeriaState, 
  Tramite32614MensajeriaStore 
} from '../estados/tramites/tramite32614_mensajeria.store';
import { 
  Solicitud32614PerfilesState, 
  Tramite32614PerfilesStore 
} from '../estados/tramites/tramite32614_perfiles.store';
import { 
  Solicitud32614PerfilesMensajeriaState, 
  Tramite32614PerfilesMensajeriaStore 
} from '../estados/tramites/tramite32614_perfilesMensajeria.store';
import { 
  Solicitud32614TercerosState, 
  Tramite32614TercerosStore 
} from '../estados/tramites/tramite32614_terceros.store';
import { 
  Solicitud32614State, 
  Tramite32614Store 
} from '../estados/tramites/tramite32614.store';

describe('SolicitudDeRegistroInvocarService', () => {
  let service: SolicitudDeRegistroInvocarService;
  let httpMock: HttpTestingController;
  let mockTramite32614MensajeriaStore: any;
  let mockTramite32614PerfilesStore: any;
  let mockTramite32614PerfilesMensajeriaStore: any;
  let mockTramite32614TercerosStore: any;
  let mockTramite32614Store: any;

  beforeEach(() => {
    mockTramite32614MensajeriaStore = {
      setLaSolicitante: jest.fn(),
      setSusFiliales: jest.fn(),
      setLasEmpresas: jest.fn(),
      setFinDeVigencia: jest.fn(),
      setNumeroDeOficio: jest.fn(),
      setFechaDePresentacion: jest.fn(),
      setMensajeriaPaqueteria: jest.fn(),
      setLaSolicitanteInterna: jest.fn(),
      setSubsidiaria: jest.fn(),
      setFiliales: jest.fn(),
      setMatrices: jest.fn(),
      setAeronauticaCivil: jest.fn(),
      setConformidadArticulos: jest.fn(),
      setRfc: jest.fn(),
      setDocumentosMercancias: jest.fn(),
      setRfcLasEmpresas: jest.fn(),
      setGeneralAeronauticaCivil: jest.fn(),
      setExteriorConformidad: jest.fn(),
      setReconocimientoMutuo: jest.fn(),
      setRfcListado: jest.fn(),
      setNombreRazonSocialListado: jest.fn(),
      setDireccionFiscalListado: jest.fn(),
      setPaginaElectronicaListado: jest.fn(),
      setCorreoElectronicaListado: jest.fn(),
      setTelefonoContactoListado: jest.fn(),
      setInformacionProporcionada: jest.fn(),
      setClaveReferencia: jest.fn(),
      setNumeroOperacion: jest.fn(),
      setCadenaDependencia: jest.fn(),
      setBanco: jest.fn(),
      setLlavePago: jest.fn(),
      setFechaFactura: jest.fn(),
      setImportePago: jest.fn()
    };

    mockTramite32614PerfilesStore = {
      setProcedimientoDocumentado: jest.fn(),
      setIndiqueNumero: jest.fn(),
      setCargosFunciones: jest.fn(),
      setCasoContratarse: jest.fn(),
      setCasoContar: jest.fn(),
      setDescribirProcedimiento: jest.fn(),
      setIndiqueMecanismos: jest.fn(),
      setIndicarEmpleados: jest.fn(),
      setIndiqueIdentifica: jest.fn(),
      setDescribaEmpresa: jest.fn(),
      setIndiqueAsegura: jest.fn(),
      setProcedimientoParaControl: jest.fn(),
      setSenaleRegistros: jest.fn(),
      setSenaleQuien: jest.fn(),
      setDescribaRecepion: jest.fn(),
      setIndiqueEncargado: jest.fn(),
      setIndiqueIdentfica: jest.fn(),
      setSenaleComo: jest.fn(),
      setDescribaCaracteristicas: jest.fn(),
      setSenaleAccion: jest.fn(),
      setIndiqueLleva: jest.fn(),
      setDescribaProcedimiento: jest.fn(),
      setIndiqueSocios: jest.fn(),
      setIndiqueForma: jest.fn(),
      setIndiqueExisten: jest.fn(),
      setIndiqueCuenta: jest.fn(),
      setProcedimientoRealizar: jest.fn(),
      setIndiquePeriodicidad: jest.fn(),
      setDescribaComo: jest.fn(),
      setComoAseguran: jest.fn(),
      setIndiqueFormatos: jest.fn(),
      setSenalarMedidas: jest.fn(),
      setIndiqueAlmacenes: jest.fn(),
      setExpliqueBrevemente: jest.fn(),
      setIndiqueCerciora: jest.fn(),
      setIndiqueEstos: jest.fn(),
      setIndiquePertenecen: jest.fn(),
      setIndiqueResponsable: jest.fn(),
      setIndiqueTecnologia: jest.fn(),
      setDescribirProcesamiento: jest.fn(),
      setDetalleComo: jest.fn(),
      setIndiqueUtiliza: jest.fn(),
      setDetalleValida: jest.fn(),
      setComoNumero: jest.fn(),
      setSenaleAsociados: jest.fn(),
      setIndiqueMateriales: jest.fn(),
      setQueForma: jest.fn(),
      setPersonalResponsable: jest.fn(),
      setIndiqueCuantas: jest.fn(),
      setIndiqueMonitoreadas: jest.fn(),
      setDetalleExisten: jest.fn(),
      setDescribaAcceso: jest.fn(),
      setDescribirTipo: jest.fn(),
      setDescribaAreas: jest.fn(),
      setSenaleMismas: jest.fn(),
      setCasoNoContar: jest.fn(),
      setPeriodicidadVerifica: jest.fn(),
      setIndiqueTareas: jest.fn(),
      setDescribaManera: jest.fn(),
      setIndiqueSepara: jest.fn(),
      setSenaleRestringido: jest.fn(),
      setDescribaMonitoreo: jest.fn(),
      setResponsablesControlar: jest.fn(),
      setEstacionamientos: jest.fn(),
      setLlevaEntrada: jest.fn(),
      setPoliticasMecanismos: jest.fn(),
      setProcedimientoOperacion: jest.fn(),
      setSenaleEncuentran: jest.fn(),
      setMencioneCuenta: jest.fn(),
      setQueManera: jest.fn(),
      setDescribaContactar: jest.fn(),
      setIndiqueOperativo: jest.fn(),
      setIndiqueAparatos: jest.fn(),
      setMantenimiento: jest.fn(),
      setPoliticasAparatos: jest.fn(),
      setProgramaMantenimiento: jest.fn(),
      setIndiqueRespaldo: jest.fn(),
      setDescribaAlarma: jest.fn(),
      setIndiqueUtilizan: jest.fn(),
      setDescribaSistemas: jest.fn(),
      setIndicarCamaras: jest.fn(),
      setMencioneInspeccion: jest.fn(),
      setSenalarUbicacion: jest.fn(),
      setIndiqueHorarios: jest.fn(),
      setIndiqueRevisan: jest.fn(),
      setIndiqueDesignado: jest.fn(),
      setComoDocumentan: jest.fn(),
      setIndiqueTiempo: jest.fn(),
      setContarPlanta: jest.fn(),
      setEstosSistemas: jest.fn(),
      setIndicarCircuito: jest.fn(),
      setDescribaImplementado: jest.fn(),
      setFormaControlan: jest.fn(),
      setIndiqueTodas: jest.fn(),
      setIndiquePlanta: jest.fn(),
      setCuentaDocumentado: jest.fn(),
      setIndiquePuertas: jest.fn(),
      setIndiqueCerrado: jest.fn(),
      setIndicarCircuitoCerrado: jest.fn(),
      setRegistroVisitantes: jest.fn(),
      setCasoSocios: jest.fn(),
      setEstosEmpresa: jest.fn(),
      setComiteSeguridad: jest.fn(),
      setFuentesInformacion: jest.fn(),
      setPolitica: jest.fn(),
      setIndique: jest.fn(),
      setPeriodicidad: jest.fn(),
      setPrograma: jest.fn(),
      setCapacitacion: jest.fn(),
      setProcedimiento: jest.fn(),
      setDescripcionProcedimiento: jest.fn(),
      setNombreProcedimiento: jest.fn(),
      setProgramacionAuditoria: jest.fn(),
      setParticipantesAuditoria: jest.fn(),
      setEnfoqueAuditoria: jest.fn(),
      setProcesosAuditados: jest.fn(),
      setRegistrosAuditoria: jest.fn(),
      setProgramacion: jest.fn()
    };

    mockTramite32614PerfilesMensajeriaStore = {};
    mockTramite32614TercerosStore = {};
    mockTramite32614Store = {};

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SolicitudDeRegistroInvocarService,
        { provide: Tramite32614MensajeriaStore, useValue: mockTramite32614MensajeriaStore },
        { provide: Tramite32614PerfilesStore, useValue: mockTramite32614PerfilesStore },
        { provide: Tramite32614PerfilesMensajeriaStore, useValue: mockTramite32614PerfilesMensajeriaStore },
        { provide: Tramite32614TercerosStore, useValue: mockTramite32614TercerosStore },
        { provide: Tramite32614Store, useValue: mockTramite32614Store }
      ],
    });
    service = TestBed.inject(SolicitudDeRegistroInvocarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch data for obtenerTablaDatos', () => {
    const mockResponse: RespuestaTabla = { data: [], code: 200, "message": "Consulta exitosa" };

    service.obtenerTablaDatos().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/32614/mercancias-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch data for obtenerInstalacionesPrincipalesTablaDatos', () => {
    const mockResponse: InstalacionesPrincipalesRespuestaTabla = { data: [], code: 200, "message": "Consulta exitosa" };

    service.obtenerInstalacionesPrincipalesTablaDatos().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/32614/instalacionesPrincipales-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch data for obtenerPersonaTablaDatos', () => {
    const mockResponse: PersonaRespuestaTabla = { data: [], code: 200, "message": "Consulta exitosa" };

    service.obtenerPersonaTablaDatos().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/32614/personapara.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error for obtenerTablaDatos', () => {
    const mockError = new ErrorEvent('Network error');

    service.obtenerTablaDatos().subscribe(
      () => fail('Expected an error, not data'),
      (error) => {
        expect(error.error).toBe(mockError);
      }
    );

    const req = httpMock.expectOne('assets/json/32614/mercancias-tabla.json');
    req.error(mockError);
  });

  it('should handle error for obtenerInstalacionesPrincipalesTablaDatos', () => {
    const mockError = new ErrorEvent('Network error');

    service.obtenerInstalacionesPrincipalesTablaDatos().subscribe(
      () => fail('Expected an error, not data'),
      (error) => {
        expect(error.error).toBe(mockError);
      }
    );

    const req = httpMock.expectOne('assets/json/32614/instalacionesPrincipales-tabla.json');
    req.error(mockError);
  });

  it('should handle error for obtenerPersonaTablaDatos', () => {
    const mockError = new ErrorEvent('Network error');

    service.obtenerPersonaTablaDatos().subscribe(
      () => fail('Expected an error, not data'),
      (error) => {
        expect(error.error).toBe(mockError);
      }
    );

    const req = httpMock.expectOne('assets/json/32614/personapara.json');
    req.error(mockError);
  });

  // Tests for new data retrieval methods
  describe('Data Retrieval Methods', () => {
    it('should fetch merchandise sampling registration data', () => {
      const mockResponse: Solicitud32614MensajeriaState = {
        laSolicitante: 'Test Solicitante',
        susFiliales: 'Test Filiales',
        lasEmpresas: 'Test Empresas',
        finDeVigencia: '2024-12-31',
        numeroDeOficio: '12345',
        fechaDePresentacion: '2024-01-01',
        mensajeriaPaqueteria: 'Test Mensajeria',
        laSolicitanteInterna: 'Test Interna',
        subsidiaria: 'Test Subsidiaria',
        filiales: 'Test Filiales',
        matrices: 'Test Matrices',
        aeronauticaCivil: 'Test Aeronautica',
        conformidadArticulos: 'Test Conformidad',
        rfc: 'RFC123456789',
        documentosMercancias: 'Test Documentos',
        rfcLasEmpresas: 'RFC987654321',
        generalAeronauticaCivil: 'Test General',
        exteriorConformidad: 'Test Exterior',
        reconocimientoMutuo: 'Test Reconocimiento',
        rfcListado: 'RFC555666777',
        nombreRazonSocialListado: 'Test Nombre',
        direccionFiscalListado: 'Test Direccion',
        paginaElectronicaListado: 'test@test.com',
        correoElectronicaListado: 'correo@test.com',
        telefonoContactoListado: '1234567890',
        informacionProporcionada: 'Test Info',
        claveReferencia: 'REF123',
        numeroOperacion: 'OP123',
        cadenaDependencia: 'DEP123',
        banco: 'Test Bank',
        llavePago: 'PAY123',
        fechaFactura: '2024-01-15',
        importePago: '1000.00'
      };

      service.getRegistroTomaMuestrasMercanciasData().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/32614/tramite32614_mensajeria.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch profiles registration data', () => {
      const mockResponse: Solicitud32614PerfilesState = {
        procedimientoDocumentado: 'Test Procedimiento',
        indiqueNumero: 'Test Numero',
        cargosFunciones: 'Test Cargos',
        casoContratarse: 'Test Caso',
        casoContar: 'Test Contar',
        describirProcedimiento: 'Test Descripcion'
      } as Solicitud32614PerfilesState;

      service.getRegistroperfilessData().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/32614/tramite32614_perfiles.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch profiles messaging registration data', () => {
      const mockResponse: Solicitud32614PerfilesMensajeriaState = {} as Solicitud32614PerfilesMensajeriaState;

      service.getRegistroTperfilesMensajeriassData().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/32614/tramite32614_permensajeria.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch third parties registration data', () => {
      const mockResponse: Solicitud32614TercerosState = {} as Solicitud32614TercerosState;

      service.getRegistroTotercerosData().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/32614/tramite32614_terceros.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch procedure 32614 registration data', () => {
      const mockResponse: Solicitud32614State = {} as Solicitud32614State;

      service.getRegistroTotramite32614Data().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/32614/tramite32614.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  // Tests for data setting methods
  describe('Data Setting Methods', () => {
    it('should set merchandise sampling registration data with all fields', () => {
      const mockData: Solicitud32614MensajeriaState = {
        laSolicitante: 'Test Solicitante',
        susFiliales: 'Test Filiales',
        lasEmpresas: 'Test Empresas',
        finDeVigencia: '2024-12-31',
        numeroDeOficio: '12345',
        fechaDePresentacion: '2024-01-01',
        mensajeriaPaqueteria: 'Test Mensajeria',
        laSolicitanteInterna: 'Test Interna',
        subsidiaria: 'Test Subsidiaria',
        filiales: 'Test Filiales Value',
        matrices: 'Test Matrices',
        aeronauticaCivil: 'Test Aeronautica',
        conformidadArticulos: 'Test Conformidad',
        rfc: 'RFC123456789',
        documentosMercancias: 'Test Documentos',
        rfcLasEmpresas: 'RFC987654321',
        generalAeronauticaCivil: 'Test General',
        exteriorConformidad: 'Test Exterior',
        reconocimientoMutuo: 'Test Reconocimiento',
        rfcListado: 'RFC555666777',
        nombreRazonSocialListado: 'Test Nombre',
        direccionFiscalListado: 'Test Direccion',
        paginaElectronicaListado: 'test@test.com',
        correoElectronicaListado: 'correo@test.com',
        telefonoContactoListado: '1234567890',
        informacionProporcionada: 'Test Info',
        claveReferencia: 'REF123',
        numeroOperacion: 'OP123',
        cadenaDependencia: 'DEP123',
        banco: 'Test Bank',
        llavePago: 'PAY123',
        fechaFactura: '2024-01-15',
        importePago: '1000.00'
      };

      service.setRegistroTomaMuestrasMercanciasData(mockData);

      // Verify required fields are set
      expect(mockTramite32614MensajeriaStore.setLaSolicitante).toHaveBeenCalledWith('Test Solicitante');
      expect(mockTramite32614MensajeriaStore.setSusFiliales).toHaveBeenCalledWith('Test Filiales');
      expect(mockTramite32614MensajeriaStore.setLasEmpresas).toHaveBeenCalledWith('Test Empresas');
      expect(mockTramite32614MensajeriaStore.setFinDeVigencia).toHaveBeenCalledWith('2024-12-31');
      expect(mockTramite32614MensajeriaStore.setNumeroDeOficio).toHaveBeenCalledWith('12345');
      expect(mockTramite32614MensajeriaStore.setFechaDePresentacion).toHaveBeenCalledWith('2024-01-01');
      expect(mockTramite32614MensajeriaStore.setMensajeriaPaqueteria).toHaveBeenCalledWith('Test Mensajeria');
      expect(mockTramite32614MensajeriaStore.setLaSolicitanteInterna).toHaveBeenCalledWith('Test Interna');

      // Verify optional basic fields are set
      expect(mockTramite32614MensajeriaStore.setSubsidiaria).toHaveBeenCalledWith('Test Subsidiaria');
      expect(mockTramite32614MensajeriaStore.setFiliales).toHaveBeenCalledWith('Test Filiales Value');
      expect(mockTramite32614MensajeriaStore.setMatrices).toHaveBeenCalledWith('Test Matrices');
      expect(mockTramite32614MensajeriaStore.setRfc).toHaveBeenCalledWith('RFC123456789');

      // Verify optional contact fields are set
      expect(mockTramite32614MensajeriaStore.setRfcListado).toHaveBeenCalledWith('RFC555666777');
      expect(mockTramite32614MensajeriaStore.setNombreRazonSocialListado).toHaveBeenCalledWith('Test Nombre');
      expect(mockTramite32614MensajeriaStore.setCorreoElectronicaListado).toHaveBeenCalledWith('correo@test.com');

      // Verify optional payment fields are set
      expect(mockTramite32614MensajeriaStore.setClaveReferencia).toHaveBeenCalledWith('REF123');
      expect(mockTramite32614MensajeriaStore.setBanco).toHaveBeenCalledWith('Test Bank');
      expect(mockTramite32614MensajeriaStore.setImportePago).toHaveBeenCalledWith('1000.00');
    });

    it('should set merchandise sampling registration data with undefined optional fields', () => {
      const mockData: Solicitud32614MensajeriaState = {
        laSolicitante: 'Test Solicitante',
        susFiliales: 'Test Filiales',
        lasEmpresas: 'Test Empresas',
        finDeVigencia: '2024-12-31',
        numeroDeOficio: '12345',
        fechaDePresentacion: '2024-01-01',
        mensajeriaPaqueteria: 'Test Mensajeria',
        laSolicitanteInterna: 'Test Interna'
      } as Solicitud32614MensajeriaState;

      service.setRegistroTomaMuestrasMercanciasData(mockData);

      // Verify required fields are set
      expect(mockTramite32614MensajeriaStore.setLaSolicitante).toHaveBeenCalledWith('Test Solicitante');
      expect(mockTramite32614MensajeriaStore.setSusFiliales).toHaveBeenCalledWith('Test Filiales');

      // Verify optional fields are set with empty strings when undefined
      expect(mockTramite32614MensajeriaStore.setSubsidiaria).toHaveBeenCalledWith('');
      expect(mockTramite32614MensajeriaStore.setFiliales).toHaveBeenCalledWith('');
      expect(mockTramite32614MensajeriaStore.setRfc).toHaveBeenCalledWith('');
      expect(mockTramite32614MensajeriaStore.setClaveReferencia).toHaveBeenCalledWith('');
    });

    it('should update all profile fields', () => {
      const mockData: Solicitud32614PerfilesState = {
        procedimientoDocumentado: 'Test Procedimiento',
        indiqueNumero: 'Test Numero',
        cargosFunciones: 'Test Cargos',
        casoContratarse: 'Test Caso',
        casoContar: 'Test Contar',
        describirProcedimiento: 'Test Descripcion'
      } as Solicitud32614PerfilesState;

      service.actualizarTodosCampos(mockData);

      expect(mockTramite32614PerfilesStore.setProcedimientoDocumentado).toHaveBeenCalledWith('Test Procedimiento');
      expect(mockTramite32614PerfilesStore.setIndiqueNumero).toHaveBeenCalledWith('Test Numero');
      expect(mockTramite32614PerfilesStore.setCargosFunciones).toHaveBeenCalledWith('Test Cargos');
      expect(mockTramite32614PerfilesStore.setCasoContratarse).toHaveBeenCalledWith('Test Caso');
      expect(mockTramite32614PerfilesStore.setCasoContar).toHaveBeenCalledWith('Test Contar');
      expect(mockTramite32614PerfilesStore.setDescribirProcedimiento).toHaveBeenCalledWith('Test Descripcion');
    });
  });

  // Error handling tests for new methods
  describe('Error Handling for New Methods', () => {
    it('should handle error for getRegistroTomaMuestrasMercanciasData', () => {
      const mockError = new ErrorEvent('Network error');

      service.getRegistroTomaMuestrasMercanciasData().subscribe(
        () => fail('Expected an error, not data'),
        (error) => {
          expect(error.error).toBe(mockError);
        }
      );

      const req = httpMock.expectOne('assets/json/32614/tramite32614_mensajeria.json');
      req.error(mockError);
    });

    it('should handle error for getRegistroperfilessData', () => {
      const mockError = new ErrorEvent('Network error');

      service.getRegistroperfilessData().subscribe(
        () => fail('Expected an error, not data'),
        (error) => {
          expect(error.error).toBe(mockError);
        }
      );

      const req = httpMock.expectOne('assets/json/32614/tramite32614_perfiles.json');
      req.error(mockError);
    });

    it('should handle error for getRegistroTperfilesMensajeriassData', () => {
      const mockError = new ErrorEvent('Network error');

      service.getRegistroTperfilesMensajeriassData().subscribe(
        () => fail('Expected an error, not data'),
        (error) => {
          expect(error.error).toBe(mockError);
        }
      );

      const req = httpMock.expectOne('assets/json/32614/tramite32614_permensajeria.json');
      req.error(mockError);
    });

    it('should handle error for getRegistroTotercerosData', () => {
      const mockError = new ErrorEvent('Network error');

      service.getRegistroTotercerosData().subscribe(
        () => fail('Expected an error, not data'),
        (error) => {
          expect(error.error).toBe(mockError);
        }
      );

      const req = httpMock.expectOne('assets/json/32614/tramite32614_terceros.json');
      req.error(mockError);
    });

    it('should handle error for getRegistroTotramite32614Data', () => {
      const mockError = new ErrorEvent('Network error');

      service.getRegistroTotramite32614Data().subscribe(
        () => fail('Expected an error, not data'),
        (error) => {
          expect(error.error).toBe(mockError);
        }
      );

      const req = httpMock.expectOne('assets/json/32614/tramite32614.json');
      req.error(mockError);
    });
  });
});
