import { TestBed } from '@angular/core/testing';
import { SolicitudPantallasService } from './solicitud-pantallas.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Solicitud220502Store } from '../estados/tramites220502.store';
import {
  CargarDatosIniciales,
  DatosDeLaSolicitud,
  DatosDelTramiteRealizar,
  TipoContenedor
} from '../models/solicitud-pantallas.model';
import { of } from 'rxjs';

describe('SolicitudPantallasService', () => {
  let service: SolicitudPantallasService;
  let httpMock: HttpTestingController;
  let storeSpy: jest.Mocked<Solicitud220502Store>;

  beforeEach(() => {
    const spy = {
      setCertificadosAutorizados: jest.fn(()=> of()),
      setHoraDeInspeccion: jest.fn(()=> of()),
      setAduanaDeIngreso: jest.fn(()=> of()),
      setSanidadAgropecuaria: jest.fn(()=> of()),
      setPuntoDeInspeccion: jest.fn(()=> of()),
      setFechaDeInspeccion: jest.fn(()=> of()),
      setNombre: jest.fn(()=> of()),
      setPrimerapellido: jest.fn(()=> of()),
      setSegundoapellido: jest.fn(()=> of()),
      setMercancia: jest.fn(()=> of()),
      setTipocontenedor: jest.fn(()=> of()),
      setTransporteIdMedio: jest.fn(()=> of()),
      setIdentificacionTransporte: jest.fn(()=> of()),
      setTotalDeGuiasAmparadas: jest.fn(()=> of()),
      setEsSolicitudFerros: jest.fn(()=> of()),
      setFoliodel: jest.fn(()=> of()),
      setPuntoInspeccion: jest.fn(()=> of()),
      setNumeroguia: jest.fn(()=> of()),
      setRegimen: jest.fn(()=> of()),
      setFerrocarril: jest.fn(()=> of()),
      setMovilizacion: jest.fn(()=> of()),
      setPunto: jest.fn(()=> of()),
      setNombreEmpresa: jest.fn(()=> of()),
      setExentoPagoNo: jest.fn(()=> of()),
      setJustificacion: jest.fn(()=> of()),
      setClaveReferencia: jest.fn(()=> of()),
      setCadenaDependencia: jest.fn(()=> of()),
      setBanco: jest.fn(()=> of()),
      setIlavePago: jest.fn(()=> of()), 
      setFetchaPago: jest.fn(()=> of()),
      setImportePago: jest.fn(()=> of()),
      setAduanaIngreso: jest.fn(()=> of()),
      setOficinaInspeccion: jest.fn(()=> of())
    } as unknown as jest.Mocked<Solicitud220502Store>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideHttpClientTesting(),
        SolicitudPantallasService,
        { provide: Solicitud220502Store, useValue: spy }
      ]
    });

    service = TestBed.inject(SolicitudPantallasService);
    httpMock = TestBed.inject(HttpTestingController);
    storeSpy = TestBed.inject(Solicitud220502Store) as jest.Mocked<Solicitud220502Store>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getData() in constructor', () => {
    httpMock.match('assets/json/220502/solicitud-pantallas-mock-data.json');
  });

  it('should fetch CargarDatosIniciales with getData()', (done) => {
    const mockData: CargarDatosIniciales = {} as any;
    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/solicitud-pantallas-mock-data.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch DatosDelTramiteRealizar with getDataDatosDelTramite()', (done) => {
    const mockData: DatosDelTramiteRealizar = {} as any;
    service.getDataDatosDelTramite().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/solicitud-pantallas-mock-data.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch TipoContenedor with getDataResponsableInspeccion()', (done) => {
    const mockData: TipoContenedor = {} as any;
    service.getDataResponsableInspeccion().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/solicitud-pantallas-mock-data.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch DatosDeLaSolicitud with getDatosDeLaSolicitud()', (done) => {
    const mockData: DatosDeLaSolicitud = {} as any;
    service.getDatosDeLaSolicitud().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/datos-de-la-solicitud.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should update store with actualizarEstadoFormulario() including new fields', () => {
    const datos: DatosDeLaSolicitud = {
      certificadosAutorizados: 'cert',
      horaDeInspeccion: '10:00',
      aduanaDeIngreso: 'aduana',
      sanidadAgropecuaria: 'sanidad',
      puntoDeInspeccion: 'punto',
      fechaDeInspeccion: '2024-01-01',
      nombre: 'Juan',
      primerapellido: 'Perez',
      segundoapellido: 'Lopez',
      mercancia: 'mercancia',
      tipocontenedor: 'contenedor',
      transporteIdMedio: 'transporte',
      identificacionTransporte: 'id',
      totalDeGuiasAmparadas: 5,
      esSolicitudFerros: true,
      foliodel: 'folio',
      puntoInspeccion: 'puntoInspeccion',
      numeroguia: '12345',
      regimen: 'regimen',
      ferrocarril: 'ferrocarril',
      movilizacion: 'movilizacion',
      punto: 'puntoExtra',
      nombreEmpresa: 'Empresa SA',
      exentoPagoNo: false,
      justificacion: 'justificacion',
      claveReferencia: 'claveRef',
      cadenaDependencia: 'cadenaDep',
      banco: 'banco',
      llavePago: 'llavePago',
      fetchapago: '2024-06-01',
      importePago: 1000,
      aduanaIngreso: 'aduanaIngreso',
      oficinaInspeccion: 'oficinaInspeccion'
    } as any;

    service.actualizarEstadoFormulario(datos);

    expect(storeSpy.setCertificadosAutorizados).toHaveBeenCalledWith(datos.certificadosAutorizados);
    expect(storeSpy.setHoraDeInspeccion).toHaveBeenCalledWith(datos.horaDeInspeccion);
    expect(storeSpy.setAduanaDeIngreso).toHaveBeenCalledWith(datos.aduanaDeIngreso);
    expect(storeSpy.setPuntoDeInspeccion).toHaveBeenCalledWith(datos.puntoDeInspeccion);
    expect(storeSpy.setFechaDeInspeccion).toHaveBeenCalledWith(datos.fechaDeInspeccion);
    expect(storeSpy.setNombre).toHaveBeenCalledWith(datos.nombre);
    expect(storeSpy.setPrimerapellido).toHaveBeenCalledWith(datos.primerapellido);
    expect(storeSpy.setSegundoapellido).toHaveBeenCalledWith(datos.segundoapellido);
    expect(storeSpy.setMercancia).toHaveBeenCalledWith(datos.mercancia);
    expect(storeSpy.setTipocontenedor).toHaveBeenCalledWith(datos.tipocontenedor);
    expect(storeSpy.setTransporteIdMedio).toHaveBeenCalledWith(datos.transporteIdMedio);
    expect(storeSpy.setIdentificacionTransporte).toHaveBeenCalledWith(datos.identificacionTransporte);
    expect(storeSpy.setTotalDeGuiasAmparadas).toHaveBeenCalledWith(datos.totalDeGuiasAmparadas);
    expect(storeSpy.setEsSolicitudFerros).toHaveBeenCalledWith(datos.esSolicitudFerros);
    expect(storeSpy.setFoliodel).toHaveBeenCalledWith(datos.foliodel);
    expect(storeSpy.setAduanaDeIngreso).toHaveBeenCalledWith(datos.aduanaDeIngreso);
    expect(storeSpy.setSanidadAgropecuaria).toHaveBeenCalledWith(datos.sanidadAgropecuaria);
    expect(storeSpy.setPuntoInspeccion).toHaveBeenCalledWith(datos.puntoInspeccion);
    expect(storeSpy.setNumeroguia).toHaveBeenCalledWith(datos.numeroguia);
    expect(storeSpy.setRegimen).toHaveBeenCalledWith(datos.regimen);
    expect(storeSpy.setFerrocarril).toHaveBeenCalledWith(datos.ferrocarril);
    expect(storeSpy.setMovilizacion).toHaveBeenCalledWith(datos.movilizacion);
    expect(storeSpy.setIdentificacionTransporte).toHaveBeenCalledWith(datos.identificacionTransporte);
    expect(storeSpy.setPunto).toHaveBeenCalledWith(datos.punto);
    expect(storeSpy.setNombreEmpresa).toHaveBeenCalledWith(datos.nombreEmpresa);
    expect(storeSpy.setExentoPagoNo).toHaveBeenCalledWith(datos.exentoPagoNo);
    expect(storeSpy.setJustificacion).toHaveBeenCalledWith(datos.justificacion);
    expect(storeSpy.setClaveReferencia).toHaveBeenCalledWith(datos.claveReferencia);
    expect(storeSpy.setCadenaDependencia).toHaveBeenCalledWith(datos.cadenaDependencia);
    expect(storeSpy.setBanco).toHaveBeenCalledWith(datos.banco);
    expect(storeSpy.setIlavePago).toHaveBeenCalledWith(datos.llavePago);
    expect(storeSpy.setFetchaPago).toHaveBeenCalledWith(datos.fetchapago);
    expect(storeSpy.setImportePago).toHaveBeenCalledWith(datos.importePago);
    expect(storeSpy.setAduanaIngreso).toHaveBeenCalledWith(datos.aduanaIngreso);
    expect(storeSpy.setOficinaInspeccion).toHaveBeenCalledWith(datos.oficinaInspeccion);
  });


  it('should fetch RegistroTomaMuestrasMercanciasDatos with getRegistroTomaMuestrasMercanciasData()', (done) => {
    const mockData = {} as any;
    service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/registro_toma_muestras_mercancias.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch Exportador[] with obtenerTablaExportador()', (done) => {
    const mockData = [{}, {}] as any;
    service.obtenerTablaExportador().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/exportador-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should handle error in obtenerTablaExportador()', (done) => {
    service.obtenerTablaExportador().subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      }
    });
    const req = httpMock.expectOne('assets/json/220502/exportador-tabla.json');
    req.error(new ProgressEvent('error'));
  });

  it('should fetch Destinatario[] with obtenerTablaDestinatario()', (done) => {
    const mockData = [{}, {}] as any;
    service.obtenerTablaDestinatario().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/destinatario-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should handle error in obtenerTablaDestinatario()', (done) => {
    service.obtenerTablaDestinatario().subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      }
    });
    const req = httpMock.expectOne('assets/json/220502/destinatario-tabla.json');
    req.error(new ProgressEvent('error'));
  });

  it('should fetch RespuestaCatalogos with getAduanaIngreso()', (done) => {
    const mockData = {} as any;
    service.getAduanaIngreso().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/aduana-ingreso.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch RespuestaCatalogos with getOficianaInspeccion()', (done) => {
    const mockData = {} as any;
    service.getOficianaInspeccion().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/oficiana-de-inspeccion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch RespuestaCatalogos with getPuntoInspeccion()', (done) => {
    const mockData = {} as any;
    service.getPuntoInspeccion().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/punto-de-inspeccion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch RespuestaCatalogos with getEstablecimiento()', (done) => {
    const mockData = {} as any;
    service.getEstablecimiento().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/establecimiento.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch RespuestaCatalogos with getRegimenDestinaran()', (done) => {
    const mockData = {} as any;
    service.getRegimenDestinaran().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/regimen-destinaran.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch RespuestaCatalogos with getMovilizacionNacional()', (done) => {
    const mockData = {} as any;
    service.getMovilizacionNacional().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/movilizacion-nacional.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch RespuestaCatalogos with getPuntoVerificacion()', (done) => {
    const mockData = {} as any;
    service.getPuntoVerificacion().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/punto-verificacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch RespuestaCatalogos with getEmpresaTransportista()', (done) => {
    const mockData = {} as any;
    service.getEmpresaTransportista().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/empresa-transportista.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch RespuestaCatalogos with getJustificacion()', (done) => {
    const mockData = {} as any;
    service.getJustificacion().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/justificacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch RespuestaCatalogos with getBanco()', (done) => {
    const mockData = {} as any;
    service.getBanco().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/banco.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch PagoDeDerechos with getPagoDeDerechos()', (done) => {
    const mockData = {} as any;
    service.getPagoDeDerechos().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/pago-de-derechos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch Solicitud220502State with getDatosDelaSolicitud()', (done) => {
    const mockData = {} as any;
    service.getDatosDelaSolicitud().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    const req = httpMock.expectOne('assets/json/220502/datos-dela-solicitud.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});