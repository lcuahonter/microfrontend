import { TestBed } from '@angular/core/testing';
import { DatosDomicilioLegalService } from './datos-domicilio-legal.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { DatosDomicilioLegalQuery } from '../estados/queries/datos-domicilio-legal.query';
import { DatosDomicilioLegalStore } from '../estados/stores/datos-domicilio-legal.store';

describe('DatosDomicilioLegalService', () => {
  let service: DatosDomicilioLegalService;
  let httpClientMock: any;
  let queryMock: any;
  let storeMock: any;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn()
    };
    queryMock = {
      selectSolicitud$: of({ test: 'state' })
    };
    storeMock = {
      setClaveDeReferencia: jest.fn(),
      setCadenaDependencia: jest.fn(),
      setBanco: jest.fn(),
      setllaveDePago: jest.fn(),
      setFechaPago: jest.fn(),
      setImportePago: jest.fn(),
      setRfcDel: jest.fn(),
      setDenominacion: jest.fn(),
      setCorreo: jest.fn(),
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
      setMuncipio: jest.fn(),
      setLocalidad: jest.fn(),
      setColonia: jest.fn(),
      setCalle: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setClaveScianModal: jest.fn(),
      setClaveDescripcionModal: jest.fn(),
      setAvisoCheckbox: jest.fn(),
      setLicenciaSanitaria: jest.fn(),
      setRegimen: jest.fn(),
      setAduanasEntradas: jest.fn(),
      setNumeroPermiso: jest.fn(),
      setClasificacion: jest.fn(),
      setEspecificar: jest.fn(),
      setDenominacionEspecifica: jest.fn(),
      setDenominacionDistintiva: jest.fn(),
      setDenominacionComun: jest.fn(),
      setTipoDeProducto: jest.fn(),
      setEstadoFisico: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setDescripcionFraccion: jest.fn(),
      setCantidadUMT: jest.fn(),
      setUMT: jest.fn(),
      setCantidadUMC: jest.fn(),
      setUMC: jest.fn(),
      setPresentacion: jest.fn(),
      setNumeroRegistro: jest.fn(),
      setFechaCaducidad: jest.fn(),
      setCumplimiento: jest.fn(),
      setRfc: jest.fn(),
      setNombre: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setApellidoMaterno: jest.fn(),
      setPaisDeOriginDatos: jest.fn(),
      setGarantiasOfrecidas: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        DatosDomicilioLegalService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: DatosDomicilioLegalQuery, useValue: queryMock },
        { provide: DatosDomicilioLegalStore, useValue: storeMock }
      ]
    });
    service = TestBed.inject(DatosDomicilioLegalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getObtenerEstadoList should call http.get with correct url', () => {
    const mockResponse = { data: 'test' };
    httpClientMock.get.mockReturnValue(of(mockResponse));
    service.getObtenerEstadoList().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/260501/seleccion.json');
  });

  it('getObtenerTablaDatos should call http.get with correct url', () => {
    const mockResponse = { data: 'test' };
    httpClientMock.get.mockReturnValue(of(mockResponse));
    service.getObtenerTablaDatos().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/260501/tablaDatos.json');
  });

  it('getObtenerMercanciasDatos should call http.get with correct url', () => {
    const mockResponse = { data: 'test' };
    httpClientMock.get.mockReturnValue(of(mockResponse));
    service.getObtenerMercanciasDatos().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/260501/mercanciasDatos.json');
  });

  it('getData should call http.get with correct url', () => {
    const mockResponse = [{ id: 1 }];
    httpClientMock.get.mockReturnValue(of(mockResponse));
    service.getData().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/260501/terceros-relacionados.json');
  });

  it('getTable should call http.get with correct url', () => {
    const mockResponse = [{ id: 1 }];
    httpClientMock.get.mockReturnValue(of(mockResponse));
    service.getTable().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/260501/terceros.json');
  });

  it('getDatosDomicilioLegalState should return query.selectSolicitud$', (done) => {
    service.getDatosDomicilioLegalState().subscribe(res => {
      expect(res).toEqual({ test: 'state' });
      done();
    });
  });

  it('actualizarEstadoFormulario should call all store setters', () => {
    const datos: any = {
      claveDeReferencia: 'a',
      cadenaDependencia: 'b',
      banco: 'c',
      llaveDePago: 'd',
      fechaPago: 'e',
      importePago: 'f',
      rfcDel: 'g',
      denominacion: 'h',
      correo: 'i',
      codigoPostal: 'j',
      estado: 'k',
      muncipio: 'l',
      localidad: 'm',
      colonia: 'n',
      calle: 'o',
      lada: 'p',
      telefono: 'q',
      claveScianModal: 'r',
      claveDescripcionModal: 's',
      avisoCheckbox: true,
      licenciaSanitaria: 't',
      regimen: 'u',
      aduanasEntradas: 'v',
      numeroPermiso: 'w',
      clasificacion: 'x',
      especificar: 'y',
      denominacionEspecifica: 'z',
      denominacionDistintiva: 'aa',
      denominacionComun: 'bb',
      tipoDeProducto: 'cc',
      estadoFisico: 'dd',
      fraccionArancelaria: 'ee',
      descripcionFraccion: 'ff',
      cantidadUMT: 'gg',
      UMT: 'hh',
      cantidadUMC: 'ii',
      UMC: 'jj',
      presentacion: 'kk',
      numeroRegistro: 'll',
      fechaCaducidad: 'mm',
      cumplimiento: 'nn',
      rfc: 'oo',
      nombre: 'pp',
      apellidoPaterno: 'qq',
      apellidoMaterno: 'rr',
      aduanasDeEntrada: ['ss'],
      garantiasOfrecidas: 'tt'
    };
    service.actualizarEstadoFormulario(datos);
    expect(storeMock.setClaveDeReferencia).toHaveBeenCalledWith('a');
    expect(storeMock.setCadenaDependencia).toHaveBeenCalledWith('b');
    expect(storeMock.setBanco).toHaveBeenCalledWith('c');
    expect(storeMock.setllaveDePago).toHaveBeenCalledWith('d');
    expect(storeMock.setFechaPago).toHaveBeenCalledWith('e');
    expect(storeMock.setImportePago).toHaveBeenCalledWith('f');
    expect(storeMock.setRfcDel).toHaveBeenCalledWith('g');
    expect(storeMock.setDenominacion).toHaveBeenCalledWith('h');
    expect(storeMock.setCorreo).toHaveBeenCalledWith('i');
    expect(storeMock.setCodigoPostal).toHaveBeenCalledWith('j');
    expect(storeMock.setEstado).toHaveBeenCalledWith('k');
    expect(storeMock.setMuncipio).toHaveBeenCalledWith('l');
    expect(storeMock.setLocalidad).toHaveBeenCalledWith('m');
    expect(storeMock.setColonia).toHaveBeenCalledWith('n');
    expect(storeMock.setCalle).toHaveBeenCalledWith('o');
    expect(storeMock.setLada).toHaveBeenCalledWith('p');
    expect(storeMock.setTelefono).toHaveBeenCalledWith('q');
    expect(storeMock.setClaveScianModal).toHaveBeenCalledWith('r');
    expect(storeMock.setClaveDescripcionModal).toHaveBeenCalledWith('s');
    expect(storeMock.setAvisoCheckbox).toHaveBeenCalledWith(true);
    expect(storeMock.setLicenciaSanitaria).toHaveBeenCalledWith('t');
    expect(storeMock.setRegimen).toHaveBeenCalledWith('u');
    expect(storeMock.setAduanasEntradas).toHaveBeenCalledWith('v');
    expect(storeMock.setNumeroPermiso).toHaveBeenCalledWith('w');
    expect(storeMock.setClasificacion).toHaveBeenCalledWith('x');
    expect(storeMock.setEspecificar).toHaveBeenCalledWith('y');
    expect(storeMock.setDenominacionEspecifica).toHaveBeenCalledWith('z');
    expect(storeMock.setDenominacionDistintiva).toHaveBeenCalledWith('aa');
    expect(storeMock.setDenominacionComun).toHaveBeenCalledWith('bb');
    expect(storeMock.setTipoDeProducto).toHaveBeenCalledWith('cc');
    expect(storeMock.setEstadoFisico).toHaveBeenCalledWith('dd');
    expect(storeMock.setFraccionArancelaria).toHaveBeenCalledWith('ee');
    expect(storeMock.setDescripcionFraccion).toHaveBeenCalledWith('ff');
    expect(storeMock.setCantidadUMT).toHaveBeenCalledWith('gg');
    expect(storeMock.setUMT).toHaveBeenCalledWith('hh');
    expect(storeMock.setCantidadUMC).toHaveBeenCalledWith('ii');
    expect(storeMock.setUMC).toHaveBeenCalledWith('jj');
    expect(storeMock.setPresentacion).toHaveBeenCalledWith('kk');
    expect(storeMock.setNumeroRegistro).toHaveBeenCalledWith('ll');
    expect(storeMock.setFechaCaducidad).toHaveBeenCalledWith('mm');
    expect(storeMock.setCumplimiento).toHaveBeenCalledWith('nn');
    expect(storeMock.setRfc).toHaveBeenCalledWith('oo');
    expect(storeMock.setNombre).toHaveBeenCalledWith('pp');
    expect(storeMock.setApellidoPaterno).toHaveBeenCalledWith('qq');
    expect(storeMock.setApellidoMaterno).toHaveBeenCalledWith('rr');
    expect(storeMock.setPaisDeOriginDatos).toHaveBeenCalledWith(['ss']);
    expect(storeMock.setGarantiasOfrecidas).toHaveBeenCalledWith('tt');
  });

  it('actualizarEstadoFormulario should not call setAvisoCheckbox if not boolean', () => {
    const datos: any = { avisoCheckbox: 'notBoolean' };
    service.actualizarEstadoFormulario(datos);
    expect(storeMock.setAvisoCheckbox).not.toHaveBeenCalled();
  });

  it('actualizarEstadoFormulario should not call setPaisDeOriginDatos if aduanasDeEntrada is not array', () => {
    const datos: any = { aduanasDeEntrada: 'notArray' };
    service.actualizarEstadoFormulario(datos);
    expect(storeMock.setPaisDeOriginDatos).not.toHaveBeenCalled();
  });

  it('getRegistroTomaMuestrasMercanciasData should call http.get with correct url', () => {
    const mockResponse = { data: 'test' };
    httpClientMock.get.mockReturnValue(of(mockResponse));
    service.getRegistroTomaMuestrasMercanciasData().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/260501/registro_toma_muestras_mercancias.json');
  });

  it('getObtenerScianTablaDatos should call http.get with correct url', () => {
    const mockResponse = { data: 'test' };
    httpClientMock.get.mockReturnValue(of(mockResponse));
    service.getObtenerScianTablaDatos().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/cofepris/clave-scian.json');
  });

  it('getObtenerDataMercanciasDatos should call http.get with correct url', () => {
    const mockResponse = { data: 'test' };
    httpClientMock.get.mockReturnValue(of(mockResponse));
    service.getObtenerDataMercanciasDatos().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/cofepris/mercancias-tabla.json');
  });
});