import { TestBed } from '@angular/core/testing';
import { RegistroService } from './registro.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import {
  Solicitud110207State,
  Tramite110207Store,
} from '../state/Tramite110207.store';
import { Tramite110207Query } from '../state/Tramite110207.query';
import { HttpCoreService, JSONResponse } from '@ng-mf/data-access-user';
import { PROC_110207 } from '../servers/api-route';

describe('RegistroService', () => {
  let service: RegistroService;
  let httpClientMock: jest.Mocked<HttpClient>;
  let tramiteQueryMock: jest.Mocked<Tramite110207Query>;
  let httpCoreServiceMock: jest.Mocked<HttpCoreService>;
  let tramite110207StoreMock: jest.Mocked<Tramite110207Store>;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
    } as any;

    tramiteQueryMock = {
      selectState$: of({}),
    } as any;

    httpCoreServiceMock = {
      post: jest.fn(),
    } as any;

    tramite110207StoreMock = {
      setTratado: jest.fn(() => of()),
      setPais: jest.fn(() => of()),
      setFraccionArancelaria: jest.fn(() => of()),
      setNumRegistro: jest.fn(() => of()),
      setNomComercial: jest.fn(() => of()),
      setFechInicioB: jest.fn(() => of()),
      setFechFinB: jest.fn(() => of()),
      setArchivo: jest.fn(() => of()),
      setObservaciones: jest.fn(() => of()),
      setPresica: jest.fn(() => of()),
      setPresenta: jest.fn(() => of()),
      setIdioma: jest.fn(() => of()),
      setEntidad: jest.fn(() => of()),
      setRepresentacion: jest.fn(() => of()),
      setNombre: jest.fn(() => of()),
      setApellidoPrimer: jest.fn(() => of()),
      setApellidoSegundo: jest.fn(() => of()),
      setNumeroFiscal: jest.fn(() => of()),
      setRazonSocial: jest.fn(() => of()),
      setCiudad: jest.fn(() => of()),
      setCalle: jest.fn(() => of()),
      setNumeroLetra: jest.fn(() => of()),
      setLada: jest.fn(() => of()),
      setTelefono: jest.fn(() => of()),
      setFax: jest.fn(() => of()),
      setCorreoElectronico: jest.fn(() => of()),
      setNacion: jest.fn(() => of()),
      setTransporte: jest.fn(() => of()),
      setfraccionMercanArancelaria: jest.fn(() => of()),
      setnombretecnico: jest.fn(() => of()),
      setnomreeningles: jest.fn(() => of()),
      setcriterioparaconferir: jest.fn(() => of()),
      setmarca: jest.fn(() => of()),
      setcantidad: jest.fn(() => of()),
      setUMC: jest.fn(() => of()),
      setvalordelamercancia: jest.fn(() => of()),
      setcomplementodeladescripcion: jest.fn(() => of()),
      setmasabruta: jest.fn(() => of()),
      setnombrecomercialdelamercancia: jest.fn(() => of()),
      setUnidadMedida: jest.fn(() => of()),
      setTipoFactura: jest.fn(() => of()),
      setFecha: jest.fn(() => of()),
      setNFactura: jest.fn(() => of()),
      setJustificacion: jest.fn(() => of()),
      setCheckbox: jest.fn(() => of()),
      setEstablecerSiCasilla: jest.fn(() => of()),
      setRutaCompleta: jest.fn(() => of()),
      setPuertoEmbarque: jest.fn(() => of()),
      setPuertoDesembarque: jest.fn(() => of()),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        RegistroService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: Tramite110207Query, useValue: tramiteQueryMock },
        { provide: HttpCoreService, useValue: httpCoreServiceMock },
        { provide: Tramite110207Store, useValue: tramite110207StoreMock },
      ],
    });
    service = TestBed.inject(RegistroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('actualizarEstadoFormulario should call store setters', () => {
    const datos: Solicitud110207State = {
      tratado: [
        {
          id: 1,
          descripcion: 'tratado',
        },
      ],
      pais: [
        {
          id: 1,
          descripcion: 'tratado',
        },
      ],
      fraccionArancelaria: 'fraccion',
      numeroRegistro: 'num',
      nombreComercial: 'comercial',
      fechaInicial: '2024-01-01',
      fechaFinal: '2024-01-02',
      archivo: 'archivo',
      observaciones: 'obs',
      presica: 'presica',
      presenta: 'presenta',
      idioma: [
        {
          id: 1,
          descripcion: 'idioma',
        },
      ],
      entidad: [{ id: 1, descripcion: 'entidad' }],
      representacion: [{ id: 1, descripcion: 'representacion' }],
      nombre: 'nombre',
      apellidoPrimer: 'ap1',
      apellidoSegundo: 'ap2',
      numeroFiscal: 'fiscal',
      razonSocial: 'razon',
      ciudad: 'ciudad',
      calle: 'calle',
      numeroLetra: 'numLetra',
      lada: 'lada',
      telefono: 'tel',
      fax: 'fax',
      correoElectronico: 'correo',
      nacion: [{ id: 1, descripcion: 'nacion' }],
      transporte: [{ id: 1, descripcion: 'transporte' }],
      fraccionMercanciaArancelaria: 'fraccionMercancia',
      nombreTecnico: 'tecnico',
      nombreEnIngles: 'ingles',
      criterioParaConferir: 'criterio',
      marca: 'marca',
      cantidad: 'cantidad',
      umc: [{ id: 1, descripcion: 'umc' }],
      valorDelaMercancia: 'valor',
      complementoDelaDescripcion: 'complemento',
      masaBruta: 'masa',
      nombreComercialDelaMercancia: 'nombreMercancia',
      unidadMedida: [{ id: 1, descripcion: 'unidad' }],
      tipoFactura: [{ id: 1, descripcion: 'tipoFactura' }],
      fecha: 'fecha',
      numeroFactura: 'numFactura',
      justificacion: 'justificacion',
      casillaVerificacion: '',
      siCasilla: false,
      rutaCompleta: 'ruta',
      puertoEmbarque: 'embarque',
      puertoDesembarque: 'desembarque',
      paisBloques: [{ id: 1, descripcion: 'bloque' }],
      formCertificado: {},
      estado: { id: 1, descripcion: 'estado' },
      idSolicitud: 1,
      formDatosCertificado: {},
      entidadFederativaDatos: [{ id: 1, descripcion: 'entidadFed' }],
      representacionFederalDatos: [{ id: 1, descripcion: 'repFed' }],
      idiomaDatos: [{ id: 1, descripcion: 'idiomaDatos' }],
      representacionFederalSeleccion: { id: 1, descripcion: 'repFedSel' },
      formaValida: {},
      formulario: {},
      disponiblesDatos: [],
      mercanciaTabla: [],
      formDatosDelDestinatario: {},
      formDestinatario: {},
      grupoRepresentativo: {
        lugar: '',
        nombreExportador: '',
        empresa: '',
        cargo: '',
        telefono: '',
        correoElectronico: '',
      },
      destinatarioForm: {},
      medioDeTransporte: [{ id: 1, descripcion: 'medio' }],
      paisDestinSeleccion: { id: 1, descripcion: 'paisDestSel' },
      paisDestin: [{ id: 1, descripcion: 'paisDest' }],
      medioDeTransporteSeleccion: { id: 1, descripcion: 'medioSel' },
    };
    service.actualizarEstadoFormulario(datos);
    expect(tramite110207StoreMock.setTratado).toHaveBeenCalledWith([{"descripcion": "tratado", "id": 1}]);
    expect(tramite110207StoreMock.setFraccionArancelaria).toHaveBeenCalledWith('fraccion');
    expect(tramite110207StoreMock.setNumRegistro).toHaveBeenCalledWith('num');
    expect(tramite110207StoreMock.setNomComercial).toHaveBeenCalledWith('comercial');
  });

  it('getRegistroTomaMuestrasMercanciasData should call http.get with correct url', (done) => {
    const mockResponse = { some: 'data' };
    httpClientMock.get.mockReturnValue(of(mockResponse));
    service.getRegistroTomaMuestrasMercanciasData().subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpClientMock.get).toHaveBeenCalledWith(
        'assets/json/110207/registro_toma_muestras_mercancias.json'
      );
      done();
    });
  });

  it('getCatalogoById should call http.get with correct url', (done) => {
    const mockResponse = { catalogo: 'data' };
    service.urlServerCatalogos = 'catalogosUrl';
    httpClientMock.get.mockReturnValue(of(mockResponse));
    service.getCatalogoById(5).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpClientMock.get).toHaveBeenCalledWith('catalogosUrl/5');
      done();
    });
  });

  it('getAllState should return tramiteQuery.selectState$', (done) => {
    service.getAllState().subscribe((res) => {
      expect(res).toEqual({});
      done();
    });
  });

  it('buscarMercanciasCert should call httpService.post with correct params', (done) => {
    const mockResponse = { result: 'ok' };
    httpCoreServiceMock.post.mockReturnValue(of(mockResponse));
    service.buscarMercanciasCert({ key: 'value' }).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpCoreServiceMock.post).toHaveBeenCalledWith(
        PROC_110207.BUSCAR,
        { body: { key: 'value' } }
      );
      done();
    });
  });

  it('buildMercanciaSeleccionadas should build correct array', () => {
    const input = [
      {
        id: 1,
        fraccionArancelaria: 'fa',
        cantidad: '10',
        valorMercancia: '100',
        nombreTecnico: 'tec',
        nombreComercial: 'com',
        numeroDeRegistrodeProductos: 'reg',
        umc: 'kg',
        fechaExpedicion: '2024-01-01',
        fechaVencimiento: '2024-12-31',
        tipoFactura: 'tipo',
        numeroFactura: 'nf',
        complementoDescripcion: 'desc',
        fechaFactura: '2024-01-02',
      },
    ];
    const result = service.buildMercanciaSeleccionadas(input);
    expect(result).toEqual([
      {
        id: 1,
        fraccion_arancelaria: 'fa',
        cantidad: '10',
        unidad_medida: 'kg',
        valor_mercancia: '100',
        nombreTecnico: 'tec',
        nombre_comercial: 'com',
        registro_producto: 'reg',
        fechaExpedicion: '2024-01-01',
        fechaVencimiento: '2024-12-31',
        tipo_factura: 'tipo',
        num_factura: 'nf',
        complemento_descripcion: 'desc',
        fecha_factura: '2024-01-02',
      },
    ]);
  });

  it('guardarDatosPost should call httpService.post with correct params', (done) => {
    const mockResponse = { saved: true };
    httpCoreServiceMock.post.mockReturnValue(of(mockResponse));
    service.guardarDatosPost({ foo: 'bar' }).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpCoreServiceMock.post).toHaveBeenCalledWith(
        PROC_110207.GUARDAR,
        { body: { foo: 'bar' } }
      );
      done();
    });
  });
});
