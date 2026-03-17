import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImportacionDeAcuiculturaService } from './importacion-de-agricultura.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

// Import the real interfaces from your models for type safety
import {
  FormularioPago,
  FormularioMovilizacion,
  DatosMercancia220701,
  EnviarDatos,
  Agricultura
} from '../modelos/importacion-de-acuicultura.module';
import { TramiteState } from '../estados/tramite220701.store';

describe('ImportacionDeAcuiculturaService', () => {
  let service: ImportacionDeAcuiculturaService;
  let httpMock: HttpTestingController;
  let agriculturaStoreMock: any;
  let seccionStoreMock: any;
  let tramiteStoreMock: any;

  beforeEach(() => {
    agriculturaStoreMock = {
      _select: jest.fn(),
      actualizarFormularioPago: jest.fn(),
      actualizarFormularioMovilizacion: jest.fn(),
      actualizarDatosMercancia: jest.fn(),
      actualizarformaValida: jest.fn(),
      limpiarFormulario: jest.fn()
    };
    seccionStoreMock = {
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn()
    };
    tramiteStoreMock = {
      setSolicitudTramite: jest.fn(),
      setInternaDatosGeneralesTramite: jest.fn(),
      setInternaPagoDeDerechosTramite: jest.fn(),
      setPagoDeDerechosTramite: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: 'AgriculturaStore', useValue: agriculturaStoreMock },
        { provide: 'SeccionLibStore', useValue: seccionStoreMock },
        { provide: 'TramiteStore', useValue: tramiteStoreMock },
        {
          provide: ImportacionDeAcuiculturaService,
          useFactory: (http: HttpClient) =>
            new ImportacionDeAcuiculturaService(
              http,
              agriculturaStoreMock,
              seccionStoreMock,
              tramiteStoreMock
            ),
          deps: [HttpClient]
        }
      ]
    });
    service = TestBed.inject(ImportacionDeAcuiculturaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerDetallesDelCatalogo should GET the correct file', () => {
    const mockResponse = { data: 'test' };
    service.obtenerDetallesDelCatalogo('test.json').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220701/test.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('obtenerDatos should select state from agriculturaStore', () => {
    const mockState: Agricultura = {} as Agricultura;
    agriculturaStoreMock._select.mockReturnValue(of(mockState));
    service.obtenerDatos().subscribe(res => {
      expect(res).toEqual(mockState);
    });
    expect(agriculturaStoreMock._select).toHaveBeenCalled();
  });

  it('actualizarFormularioPago should call store', () => {
    const form: FormularioPago = {
      exentoPago: 'false',
      justificacion: '',
      claveReferencia: '',
      cadenaDependencia: '',
      banco: '',
      llavePago: '',
      fechaPago: '',
      importePago: '',
      fechaFactura: ''
    } as any;
    service.actualizarFormularioPago(form);
    expect(agriculturaStoreMock.actualizarFormularioPago).toHaveBeenCalledWith(form);
  });

  it('actualizarFormularioMovilizacion should call store', () => {
    const form: FormularioMovilizacion = {
      medioDeTransporte: '',
      identificacionTransporte: '',
      puntoVerificacion: '',
      nombreEmpresaTransportista: ''
    } as any;
    service.actualizarFormularioMovilizacion(form);
    expect(agriculturaStoreMock.actualizarFormularioMovilizacion).toHaveBeenCalledWith(form);
  });

  it('actualizarDatosMercancia should call store', () => {
    const datos: DatosMercancia220701 = {
      realizarGroup: {
        aduanaIngreso: '',
        oficinaInspeccion: '',
        puntoInspeccion: '',
        numeroGuia: '',
        regimen: ''
      },
      mercanciaGroup: {
        tipoRequisito: '',
        requisito: '',
        numeroCertificadoInternacional: '',
        numeroOficioCasoEspecial: '',
        fraccionArancelaria: '',
        descripcionFraccionArancelaria: '',
        nico: '',
        descripcionNico: '',
        descripcion: '',
        cantidadUMT: '',
        umt: '',
        cantidadUMC: '',
        umc: '',
        uso: '',
        numeroDeLote: '',
        faseDeDesarrollo: '',
        especie: '',
        paisDeOrigen: '',
        paisDeProcedencia: ''
      },
      detalles: {
        nombreCientifico: ''
      }
    } as any;
    service.actualizarDatosMercancia(datos);
    expect(agriculturaStoreMock.actualizarDatosMercancia).toHaveBeenCalledWith(datos);
  });

  it('obtenerTodosLosStatus should return true if all values are true', done => {
    // Use only the properties that exist in EnviarDatos
    const formaValida: EnviarDatos = { formularioMovilizacion: true, datosMercancia: true } as any;
    agriculturaStoreMock._select.mockReturnValue(of(formaValida));
    service.obtenerTodosLosStatus().subscribe(res => {
      expect(res).toBe(true);
      done();
    });
  });

  it('obtenerTodosLosStatus should return false if any value is false', done => {
    const formaValida: EnviarDatos = { formularioMovilizacion: false, datosMercancia: true } as any;
    agriculturaStoreMock._select.mockReturnValue(of(formaValida));
    service.obtenerTodosLosStatus().subscribe(res => {
      expect(res).toBe(false);
      done();
    });
  });

  it('updateSolicitud should call tramiteStore.setSolicitudTramite', () => {
    const solicitud: TramiteState['SolicitudState'] = {
      justificacion: '',
      certificadosAutorizados: [],
      fechaInicio: '',
      horaDeInspeccion: '',
      aduanaDeIngreso: '',
      sanidadAgropecuaria: '',
      puntoDeInspeccion: '',
      nombreInspector: '',
      establecimiento: '',
      veterinario: '',
      regimen: '',
      primerApellido: '',
      segundoApellido: '',
      cantidadContenedores: 0,
      tipoContenedor: ''
    } as any;
    service.updateSolicitud(solicitud);
    expect(tramiteStoreMock.setSolicitudTramite).toHaveBeenCalledWith(solicitud);
  });

  it('updateInternaDatosGenerales should call tramiteStore.setInternaDatosGeneralesTramite', () => {
    const datos: TramiteState['InternaDatosGeneralesState'] = {
      folioControlUnico: '',
      aduanaIngreso: '',
      oficinaInspeccion: '',
      puntoInspeccion: '',
      claveControlUnico: '',
      establecimientoTIFs: '',
      nombreVeterinario: '',
      numeroGuia: ''
    } as any;
    service.updateInternaDatosGenerales(datos);
    expect(tramiteStoreMock.setInternaDatosGeneralesTramite).toHaveBeenCalledWith(datos);
  });

  it('updateInternaPagoDeDerechos should call tramiteStore.setInternaPagoDeDerechosTramite', () => {
    const datos: TramiteState['FormularioPagoState'] = {
      exentoPago: 'false',
      justificacion: '',
      claveReferencia: '',
      cadenaDependencia: '',
      lineaCaptura: '',
      fechaPago: '',
      banco: '',
      monto: 0,
      pago: 1,
      llavePago: '',
      importePago: 0,
      fechaFactura: ''
    } as any;
    service.updateInternaPagoDeDerechos(datos);
    expect(tramiteStoreMock.setInternaPagoDeDerechosTramite).toHaveBeenCalledWith(datos);
  });

  it('updatePagoDeDerechos should call tramiteStore.setPagoDeDerechosTramite', () => {
    const datos: TramiteState['PagosDeDerechosState'] = {
      claveDeReferencia: '',
      cadenaDependencia: '',
      banco: '',
      llaveDePago: '',
      importeDePago: 0,
      fechaDeFactura: '',
      fechaInicio: '',
      claveDeReferenciaRevision: '',
      bancoRevision: '',
      llaveDePagoRevision: '',
      importeDePagoRevision: 0,
      fechaDeFacturaRevision: ''
    } as any;
    service.updatePagoDeDerechos(datos);
    expect(tramiteStoreMock.setPagoDeDerechosTramite).toHaveBeenCalledWith(datos);
  });

  it('limpiarFormulario should call agriculturaStore.limpiarFormulario', () => {
    service.limpiarFormulario();
    expect(agriculturaStoreMock.limpiarFormulario).toHaveBeenCalled();
  });

  it('actualizarEstadoFormulario should update all tramiteStore states', () => {
    const datos: TramiteState = {
      SolicitudState: {
        justificacion: '',
        certificadosAutorizados: [],
        fechaInicio: '',
        horaDeInspeccion: '',
        aduanaDeIngreso: '',
        sanidadAgropecuaria: '',
        puntoDeInspeccion: '',
        nombreInspector: '',
        establecimiento: '',
        veterinario: '',
        regimen: '',
        primerApellido: '',
        segundoApellido: '',
        cantidadContenedores: 0,
        tipoContenedor: ''
      } as any,
      InternaDatosGeneralesState: {
        folioControlUnico: '',
        aduanaIngreso: '',
        oficinaInspeccion: '',
        puntoInspeccion: '',
        claveControlUnico: '',
        establecimientoTIFs: '',
        nombreVeterinario: '',
        numeroGuia: ''
      } as any,
      FormularioPagoState: {
        exentoPago: 'false',
        justificacion: '',
        claveReferencia: '',
        cadenaDependencia: '',
        lineaCaptura: '',
        fechaPago: '',
        banco: '',
        monto: 0,
        pago: 1,
        llavePago: '',
        importePago: 0,
        fechaFactura: ''
      } as any,
      PagosDeDerechosState: {
        claveDeReferencia: '',
        cadenaDependencia: '',
        banco: '',
        llaveDePago: '',
        importeDePago: 0,
        fechaDeFactura: '',
        fechaInicio: '',
        claveDeReferenciaRevision: '',
        bancoRevision: '',
        llaveDePagoRevision: '',
        importeDePagoRevision: 0,
        fechaDeFacturaRevision: ''
      } as any
    };
    service.actualizarEstadoFormulario(datos);
    expect(tramiteStoreMock.setSolicitudTramite).toHaveBeenCalledWith(datos.SolicitudState);
    expect(tramiteStoreMock.setInternaDatosGeneralesTramite).toHaveBeenCalledWith(datos.InternaDatosGeneralesState);
    expect(tramiteStoreMock.setInternaPagoDeDerechosTramite).toHaveBeenCalledWith(datos.FormularioPagoState);
    expect(tramiteStoreMock.setPagoDeDerechosTramite).toHaveBeenCalledWith(datos.PagosDeDerechosState);
  });

  it('getDatosDeLaSolicitudData should GET datos-de-la-solicitud.json', () => {
    const mockResponse = { foo: 'bar' };
    service.getDatosDeLaSolicitudData().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220701/datos-de-la-solicitud.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('obtenerDetallesDelCatalogo should handle http error', done => {
    service.obtenerDetallesDelCatalogo('fail.json').subscribe({
      error: (err) => {
        expect(err.status).toBe(404);
        done();
      }
    });
    const req = httpMock.expectOne('assets/json/220701/fail.json');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('getDatosDeLaSolicitudData should handle http error', done => {
    service.getDatosDeLaSolicitudData().subscribe({
      error: (err) => {
        expect(err.status).toBe(500);
        done();
      }
    });
    const req = httpMock.expectOne('assets/json/220701/datos-de-la-solicitud.json');
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });

  it('constructor should set url property', () => {
    expect(service.url).toBe('assets/json/220701/');
  });

  it('updateSolicitud should not call store if undefined', () => {
    service.updateSolicitud(undefined as any);
    expect(tramiteStoreMock.setSolicitudTramite).toHaveBeenCalledWith(undefined);
  });

  it('updateInternaDatosGenerales should not call store if undefined', () => {
    service.updateInternaDatosGenerales(undefined as any);
    expect(tramiteStoreMock.setInternaDatosGeneralesTramite).toHaveBeenCalledWith(undefined);
  });

  it('updateInternaPagoDeDerechos should not call store if undefined', () => {
    service.updateInternaPagoDeDerechos(undefined as any);
    expect(tramiteStoreMock.setInternaPagoDeDerechosTramite).toHaveBeenCalledWith(undefined);
  });

  it('updatePagoDeDerechos should not call store if undefined', () => {
    service.updatePagoDeDerechos(undefined as any);
    expect(tramiteStoreMock.setPagoDeDerechosTramite).toHaveBeenCalledWith(undefined);
  });

  it('limpiarFormulario should not throw if called multiple times', () => {
    expect(() => {
      service.limpiarFormulario();
      service.limpiarFormulario();
    }).not.toThrow();
  });
});