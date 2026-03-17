import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CapturaSolicitudeService } from './captura-solicitud.service';
import { Solicitud220402Store } from '../estados/tramites/tramites220402.store';
import { Solicitud220402State } from '../estados/tramites/tramites220402.store';
import { RespuestaCatalogos } from '@ng-mf/data-access-user';
import { DestinatarioRespuesta } from '../models/pantallas-captura.model';
import { provideHttpClient } from '@angular/common/http';

describe('CapturaSolicitudeService', () => {
  let service: CapturaSolicitudeService;
  let httpMock: HttpTestingController;
  let tramite220402StoreMock: any;

  beforeEach(() => {
    tramite220402StoreMock = {
      setTipoDeCertificado: jest.fn(),
      setPuntoDestino: jest.fn(),
      setSeccionAduanera: jest.fn(),
      setPaisDeDestino: jest.fn(),
      setPaisDeProcedencia: jest.fn(),
      setRangoDeFechas: jest.fn(),
      setFechaInicio: jest.fn(),
      setFechaFinal: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setDescdelaFraccion: jest.fn(),
      setCantidadUMT: jest.fn(),
      setUMT: jest.fn(),
      setCantidadUMC: jest.fn(),
      setUMC: jest.fn(),
      setPaisdeOrigen: jest.fn(),
      setEntidadFederativadeOrigen: jest.fn(),
      setMunicipiodeOrigen: jest.fn(),
      setMarcasDistintivas: jest.fn(),
      setUSO: jest.fn(),
      setNumero: jest.fn(),
      setEmpaques: jest.fn(),
      setUnidadDeVerificar: jest.fn(),
      setTerceroEspecialista: jest.fn(),
      setEntidadFederative: jest.fn(),
      setFitosanitario: jest.fn(),
      setDatosGeneralesArr: jest.fn(),
      setMediodeTransporte: jest.fn(),
      setIdentificacionDelTransporte: jest.fn(),
      setTipoPersona: jest.fn(),
      setNombre: jest.fn(),
      setPrimerApellido: jest.fn(),
      setSegundoApellido: jest.fn(),
      setDenominacion: jest.fn(),
      setPais: jest.fn(),
      setDomicilio: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setExentoDePago: jest.fn(),
      setCadenaDependencia: jest.fn(),
      setBanco: jest.fn(),
      setllaveDePago: jest.fn(),
      setFechaPago: jest.fn(),
      setJustificacion: jest.fn(),
      setClaveDeReferencia: jest.fn(),
      setImportePago: jest.fn(),
      setDestinatario: jest.fn(),
      setNombreComun: jest.fn(),
      setNombreCientifico: jest.fn(),
      setDescripcionProducto: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CapturaSolicitudeService,
        { provide: Solicitud220402Store, useValue: tramite220402StoreMock },
      ],
    });

    service = TestBed.inject(CapturaSolicitudeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update the store with provided data in actualizarEstadoFormulario', () => {
    const mockData: Solicitud220402State = {
      tipoDeCertificado: 'Certificado 1',
      puntoDestino: 'Destino 1',
      seccionAduanera: 'Aduana 1',
      paisDeDestino: 'País 1',
      paisDeProcedencia: 'País 2',
      rangoDeFechas: '2023-01-01 to 2023-01-10',
      fechaInicio: '2023-01-01',
      fechaFinal: '2023-01-10',
      fraccionArancelaria: '12345678',
      descdelaFraccion: 'Descripción de la fracción',
      cantidadUMT: '10',
      UMT: 'Kilogramo',
      cantidadUMC: '20',
      UMC: 'Unidad',
      paisdeOrigen: 'País de origen',
      entidadFederativadeOrigen: 'Entidad federativa',
      municipiodeOrigen: [],
      datosGeneralesArr: [],
      marcasDistintivas: 'Marca',
      USO: 'Uso',
      numero: '123',
      empaques: 'Caja',
      unidadDeVerificar: 'Unidad de verificación',
      terceroEspecialista: 'Especialista',
      entidadFederative: 'Entidad federativa',
      fitosanitario: 'Fitosanitario',
      mediodeTransporte: 'Transporte',
      identificacionDelTransporte: 'Identificación',
      tipoPersona: 'Física',
      nombre: 'Juan',
      primerApellido: 'Pérez',
      segundoApellido: 'Gómez',
      denominacion: 'Denominación',
      pais: 'País',
      domicilio: 'Calle 123',
      lada: '55',
      telefono: '1234567890',
      correoElectronico: 'correo@dominio.com',
      exentoDePago: 'No',
      cadenaDependencia: 'Dependencia',
      banco: 'Banco 1',
      llaveDePago: 'Llave123',
      fechaPago: '2023-01-15',
      justificacion: 'Justificación',
      claveDeReferencia: 'Clave123',
      importePago: '1000',
      destinatario: [],
      nombreComun: 'Nombre común',
      nombreCientifico: 'Nombre científico',
      descripcionProducto: 'Descripción del producto',
      nombreImportExport: '',
    };

    service.actualizarEstadoFormulario(mockData);

    expect(tramite220402StoreMock.setTipoDeCertificado).toHaveBeenCalledWith('Certificado 1');
    expect(tramite220402StoreMock.setPuntoDestino).toHaveBeenCalledWith('Destino 1');
    expect(tramite220402StoreMock.setSeccionAduanera).toHaveBeenCalledWith('Aduana 1');
    expect(tramite220402StoreMock.setPaisDeDestino).toHaveBeenCalledWith('País 1');
    expect(tramite220402StoreMock.setPaisDeProcedencia).toHaveBeenCalledWith('País 2');
    expect(tramite220402StoreMock.setRangoDeFechas).toHaveBeenCalledWith('2023-01-01 to 2023-01-10');
    expect(tramite220402StoreMock.setFechaInicio).toHaveBeenCalledWith('2023-01-01');
    expect(tramite220402StoreMock.setFechaFinal).toHaveBeenCalledWith('2023-01-10');
    expect(tramite220402StoreMock.setFraccionArancelaria).toHaveBeenCalledWith('12345678');
    expect(tramite220402StoreMock.setDescdelaFraccion).toHaveBeenCalledWith('Descripción de la fracción');
    expect(tramite220402StoreMock.setCantidadUMT).toHaveBeenCalledWith('10');
    expect(tramite220402StoreMock.setUMT).toHaveBeenCalledWith('Kilogramo');
    expect(tramite220402StoreMock.setCantidadUMC).toHaveBeenCalledWith('20');
    expect(tramite220402StoreMock.setUMC).toHaveBeenCalledWith('Unidad');
    expect(tramite220402StoreMock.setPaisdeOrigen).toHaveBeenCalledWith('País de origen');
    expect(tramite220402StoreMock.setEntidadFederativadeOrigen).toHaveBeenCalledWith('Entidad federativa');
    expect(tramite220402StoreMock.setMunicipiodeOrigen).toHaveBeenCalledWith([]);
    expect(tramite220402StoreMock.setMarcasDistintivas).toHaveBeenCalledWith('Marca');
    expect(tramite220402StoreMock.setUSO).toHaveBeenCalledWith('Uso');
    expect(tramite220402StoreMock.setNumero).toHaveBeenCalledWith('123');
    expect(tramite220402StoreMock.setEmpaques).toHaveBeenCalledWith('Caja');
    expect(tramite220402StoreMock.setUnidadDeVerificar).toHaveBeenCalledWith('Unidad de verificación');
    expect(tramite220402StoreMock.setTerceroEspecialista).toHaveBeenCalledWith('Especialista');
    expect(tramite220402StoreMock.setEntidadFederative).toHaveBeenCalledWith('Entidad federativa');
    expect(tramite220402StoreMock.setFitosanitario).toHaveBeenCalledWith('Fitosanitario');
    expect(tramite220402StoreMock.setDatosGeneralesArr).toHaveBeenCalledWith([]);
    expect(tramite220402StoreMock.setMediodeTransporte).toHaveBeenCalledWith('Transporte');
    expect(tramite220402StoreMock.setIdentificacionDelTransporte).toHaveBeenCalledWith('Identificación');
    expect(tramite220402StoreMock.setTipoPersona).toHaveBeenCalledWith('Física');
    expect(tramite220402StoreMock.setNombre).toHaveBeenCalledWith('Juan');
    expect(tramite220402StoreMock.setPrimerApellido).toHaveBeenCalledWith('Pérez');
    expect(tramite220402StoreMock.setSegundoApellido).toHaveBeenCalledWith('Gómez');
    expect(tramite220402StoreMock.setDenominacion).toHaveBeenCalledWith('Denominación');
    expect(tramite220402StoreMock.setPais).toHaveBeenCalledWith('País');
    expect(tramite220402StoreMock.setDomicilio).toHaveBeenCalledWith('Calle 123');
    expect(tramite220402StoreMock.setLada).toHaveBeenCalledWith('55');
    expect(tramite220402StoreMock.setTelefono).toHaveBeenCalledWith('1234567890');
    expect(tramite220402StoreMock.setCorreoElectronico).toHaveBeenCalledWith('correo@dominio.com');
    expect(tramite220402StoreMock.setExentoDePago).toHaveBeenCalledWith('No');
    expect(tramite220402StoreMock.setCadenaDependencia).toHaveBeenCalledWith('Dependencia');
    expect(tramite220402StoreMock.setBanco).toHaveBeenCalledWith('Banco 1');
    expect(tramite220402StoreMock.setllaveDePago).toHaveBeenCalledWith('Llave123');
    expect(tramite220402StoreMock.setFechaPago).toHaveBeenCalledWith('2023-01-15');
    expect(tramite220402StoreMock.setJustificacion).toHaveBeenCalledWith('Justificación');
    expect(tramite220402StoreMock.setClaveDeReferencia).toHaveBeenCalledWith('Clave123');
    expect(tramite220402StoreMock.setImportePago).toHaveBeenCalledWith('1000');
    expect(tramite220402StoreMock.setDestinatario).toHaveBeenCalledWith([]);
    expect(tramite220402StoreMock.setNombreComun).toHaveBeenCalledWith('Nombre común');
    expect(tramite220402StoreMock.setNombreCientifico).toHaveBeenCalledWith('Nombre científico');
    expect(tramite220402StoreMock.setDescripcionProducto).toHaveBeenCalledWith('Descripción del producto');
  });

  it('should fetch bank data from JSON file in getBanco', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200,
      data: [{ id: 1, descripcion: 'Banco 1' }],
      message: '',
    };

    service.getBanco().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220402/banco.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch sample data from JSON file in getRegistroTomaMuestrasMercanciasData', () => {
    const mockResponse: Solicitud220402State = {
      tipoDeCertificado: 'Certificado 1',
      // Add other properties as needed
    } as Solicitud220402State;

    service.getRegistroTomaMuestrasMercanciasData().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220402/registro_220402.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch destinatarios from JSON file in obtenerDestinatario', () => {
    const mockResponse: DestinatarioRespuesta = {
      datos: [{
        id: 1,
        nombreDenominacionORazonSocial: "acapulco oficina  de inspeccion",
        telefono: "744 484 00 00",
        correoElectronico: "Electronico",
        domicilio: "Domicilio",
        pais: "pais"
      }],
    };

    service.obtenerDestinatario().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220402/destinatario.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});