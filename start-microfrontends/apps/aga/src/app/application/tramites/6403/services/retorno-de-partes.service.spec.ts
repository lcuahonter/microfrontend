import { TestBed } from '@angular/core/testing';
import { RetornoDePartesService } from './retorno-de-partes.service';
import { Tramite6403Store } from '../estados/tramite6403.store';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('RetornoDePartesService', () => {
  let service: RetornoDePartesService;
  let httpMock: HttpTestingController;
  let tramiteStoreMock: any;

  beforeEach(() => {
    tramiteStoreMock = {
      setCveAduana: jest.fn(),
      setCveSeccionAduanal: jest.fn(),
      setCveRecintoFiscalizado: jest.fn(),
      setCveTipoDocumento: jest.fn(),
      setEstadoTipoDocumento: jest.fn(),
      setAduana: jest.fn(),
      setPatente: jest.fn(),
      setPedimento: jest.fn(),
      setFolioImportacionTemporal: jest.fn(),
      setFolioFormatoOficial: jest.fn(),
      setCheckProrroga: jest.fn(),
      setFolioOficialProrroga: jest.fn(),
      setFechaImportacionTemporal: jest.fn(),
      setFechaVencimiento: jest.fn(),
      setDescMercancia: jest.fn(),
      setMarca: jest.fn(),
      setModelo: jest.fn(),
      setNumeroSerie: jest.fn(),
      setTipo: jest.fn(),
      setCveMedioTrasporte: jest.fn(),
      setGuiaMaster: jest.fn(),
      setGuiaBl: jest.fn(),
      setNumeroBl: jest.fn(),
      setRfcEmpresaTransportista: jest.fn(),
      setEstadoMedioTransporte: jest.fn(),
      setCartaPorte: jest.fn(),
      setCvePaisProcedencia: jest.fn(),
      setGuiaHouse: jest.fn(),
      setNumeroBuque: jest.fn(),
      setNumeroEquipo: jest.fn(),
      setFechaCartaPorte: jest.fn(),
      setTipContenedor: jest.fn(),
      setTranporteMarca: jest.fn(),
      setTranporteModelo: jest.fn(),
      setTranportePlaca: jest.fn(),
      setObservaciones: jest.fn(),
      setConDestino: jest.fn(),
      setCveTipoDestino: jest.fn(),
      setCveTipoDocumentoReemplazada: jest.fn(),
      setNumeroActaDescruccion: jest.fn(),
      setCveAduanaDestino: jest.fn(),
      setCvePatenteDestino: jest.fn(),
      setCvePedimentoDestino: jest.fn(),
      setFolioVucemRetorno: jest.fn(),
      setFolioFormatoOficialDestino: jest.fn(),
      setFechaDescruccionDestino: jest.fn(),
      setEstadoTipoDocumentoDestino: jest.fn(),
      setAutoridadPresentoAvisoDestruccion: jest.fn(),
      setModalDescMercancia: jest.fn(),
      setEspeMercancia: jest.fn(),
      setMarcaMercancia: jest.fn(),
      setModeloMercancia: jest.fn(),
      setNumSerieMercancia: jest.fn(),
      setNumParteMercancia: jest.fn(),
      setTipoMercancia: jest.fn(),
      setTablaPartesReemplazadasDatos: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Tramite6403Store, useValue: tramiteStoreMock }
      ]
    });

    service = TestBed.inject(RetornoDePartesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not update store if datos are missing in actualizarEstadoFormulario', () => {
    service.actualizarEstadoFormulario({} as any);
    expect(tramiteStoreMock.setCveAduana).not.toHaveBeenCalled();
  });

  it('should update store for all fields in actualizarEstadoFormulario', () => {
    const datos = {
      solicitudFormulario: {
        cveAduana: '1',
        cveSeccionAduanal: '2',
        cveRecintoFiscalizado: '3',
        cveTipoDocumento: '4',
        estadoTipoDocumento: '5',
        aduana: '6',
        patente: '7',
        pedimento: '8',
        folioImportacionTemporal: '9',
        folioFormatoOficial: '10',
        checkProrroga: true,
        folioOficialProrroga: '11',
        fechaImportacionTemporal: '2024-01-01',
        fechaVencimiento: '2024-12-31',
        descMercancia: 'desc',
        marca: 'marca',
        modelo: 'modelo',
        numeroSerie: 'serie',
        tipo: 'tipo',
        cveMedioTrasporte: 'medio',
        guiaMaster: 'master',
        guiaBl: 'bl',
        numeroBl: 'nbl',
        rfcEmpresaTransportista: 'rfc',
        estadoMedioTransporte: 'estado',
        cartaPorte: 'carta',
        cvePaisProcedencia: 'pais',
        guiaHouse: 'house',
        numeroBuque: 'buque',
        numeroEquipo: 'equipo',
        fechaCartaPorte: '2024-01-02',
        tipContenedor: 'contenedor',
        tranporteMarca: 'tmarca',
        tranporteModelo: 'tmodelo',
        tranportePlaca: 'tpl',
        observaciones: 'obs',
        conDestino: 'dest',
        cveTipoDestino: 'tdest',
        cveTipoDocumentoReemplazada: 'tdoc',
        numeroActaDescruccion: 'acta',
        cveAduanaDestino: 'adest',
        cvePatenteDestino: 'pdes',
        cvePedimentoDestino: 'pddes',
        folioVucemRetorno: 'fvr',
        folioFormatoOficialDestino: 'ffod',
        fechaDescruccionDestino: '2024-11-30',
        estadoTipoDocumentoDestino: 'etdd',
        autoridadPresentoAvisoDestruccion: 'autoridad'
      },
      mercanciaFormulario: {
        modalDescMercancia: 'desc',
        espeMercancia: 'espe',
        marcaMercancia: 'marca',
        modeloMercancia: 'modelo',
        numSerieMercancia: 'serie',
        numParteMercancia: 'parte',
        tipoMercancia: 'tipo'
      }
    };
    service.actualizarEstadoFormulario(datos as any);
    expect(tramiteStoreMock.setCveAduana).toHaveBeenCalledWith('1');
    expect(tramiteStoreMock.setTipoMercancia).toHaveBeenCalledWith('tipo');
  });

  it('should get registro toma muestras mercancias data', () => {
    const mockResponse = { success: true, datos: {} as any, message: '' };
    service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/6403/registro_toma_muestras_mercancias.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get datos solicitante', () => {
    const mockResponse = { rfc: 'RFC', denominacion: 'Denom', actividadEconomica: 'Act', correoElectronico: 'mail', pais: 'MX', codigoPostal: '12345', horaDestruccion: '12:00', fechaDestruccion: '2024-01-01', entidadFederativa: 'CDMX', municipio: 'BJ', localidad: 'Loc', colonia: 'Col', calle: 'Calle', nExt: '1', nInt: '2', lada: '55', telefono: '1234567890', adace: 'ADACE' };
    service.obtenerDatosSolicitante().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/6403/datosSolicitante.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get solicitud tabla', () => {
    const mockResponse = { datos: [{ id: 1, marca: 'A', modelo: 'B', numeroDeSerie: 'C', tipo: 'D', descripcionMercancia: 'E' }] };
    service.obtenerSolicitudTabla().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/6403/autorizacion-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get federativa', () => {
    const mockResponse = { datos: [{ id: 1, descripcion: 'CDMX' }] };
    service.obtenerFederativa().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/6403/entidad-federativa.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get aduanas', () => {
    const mockResponse = { datos: [{ id: 1, descripcion: 'Aduana' }] };
    service.obtenerAduanas().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/6403/aduanas.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get aduaneras', () => {
    const mockResponse = { datos: [{ id: 1, descripcion: 'Aduanera' }] };
    service.obtenerAduaneras().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/6403/aduaneras.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get recinto fiscalizado', () => {
    const mockResponse = { datos: [{ id: 1, descripcion: 'Recinto' }] };
    service.obtenerRecintoFiscalizado().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/6403/recinto-fiscalizado.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get tipo de documento', () => {
    const mockResponse = { datos: [{ id: 1, descripcion: 'TipoDoc' }] };
    service.obtenerTipoDeDocumento().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/6403/tipo-de-documento.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get medio de transporte', () => {
    const mockResponse = { datos: [{ id: 1, descripcion: 'Medio' }] };
    service.obtenerMedioDeTransporte().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/6403/medio-de-transporte.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get pais de procedencia', () => {
    const mockResponse = { datos: [{ id: 1, descripcion: 'Pais' }] };
    service.obtenerPaisDeProcedencia().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/6403/pais-de-procedencia.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});