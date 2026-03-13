import { TestBed } from '@angular/core/testing';
import { CertificadoValidacionService } from './certificado-validacion.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Tramite110202Store } from '../estados/tramite110202.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { TramiteState } from '../estados/tramite110202.store';

describe('CertificadoValidacionService', () => {
  let service: CertificadoValidacionService;
  let httpMock: HttpTestingController;
  let tramiteStoreMock: Partial<Tramite110202Store>;

  beforeEach(() => {
    tramiteStoreMock = {
      _select: jest.fn(),
      update: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CertificadoValidacionService,
        { provide: Tramite110202Store, useValue: tramiteStoreMock }
      ]
    });

    service = TestBed.inject(CertificadoValidacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  type ServiceMethod =
    | 'obtenerListaTratadoAcuerdo'
    | 'obtenerPaisBloque'
    | 'obtenerMercancia'
    | 'obtenerIdioma'
    | 'obtenerEntidadFederativa'
    | 'obtenerRepresentacionFederal'
    | 'obtenerFacturas'
    | 'obtenerUmc'
    | 'obtenerPaisDestino'
    | 'obtenerMedioDeTransporte';

  const endpoints: { method: ServiceMethod; url: string }[] = [
    { method: 'obtenerListaTratadoAcuerdo', url: './assets/json/110202/tratado-acuerdo.json' },
    { method: 'obtenerPaisBloque', url: 'assets/json/110202/pais-bloque.json' },
    { method: 'obtenerMercancia', url: 'assets/json/110202/mercancia.json' },
    { method: 'obtenerFacturas', url: 'assets/json/110202/factura.json' },
    { method: 'obtenerUmc', url: 'assets/json/110202/umc.json' },
    { method: 'obtenerPaisDestino', url: 'assets/json/110202/pais-destinatario.json' },
    { method: 'obtenerMedioDeTransporte', url: 'assets/json/110202/medio-de-transporte.json' },
  ];

  endpoints.forEach(({ method, url }) => {
    it(`should fetch data from ${method}`, () => {
      const mockData: Catalogo[] = [{ id: 1, descripcion: 'Test' }];
      (service[method] as () => any)().subscribe((data: Catalogo[]) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockData });
    });
  });

  it('should fetch tramite state data for toma de muestras', () => {
    const mockState: TramiteState = {
      idiomaDatos: [],
      idiomaDatosSeleccion: { id: 1, descripcion: '' },
      paisDestin: [],
      paisDestinSeleccion: { id: 1, descripcion: '' },
      medioDeTransporte: [],
      medioDeTransporteSeleccion: { id: 1, descripcion: '' },
      entidadFederativaSeleccion: { id: 1, descripcion: '' },
      entidadFederativaDatos: [],
      representacionFederalDatos: [],
      representacionFederalSeleccion: { id: 1, descripcion: '' },
      altaPlanta: [],
      estado: { id: 1, descripcion: '' },
      factura: [],
      facturas: { id: 1, descripcion: '' },
      umc: { id: 1, descripcion: '' },
      umcs: [],
      masa: { id: 1, descripcion: '' },
      masaBruta: [],
      paisBloques: [],
      paisBloque: { id: 1, descripcion: '' },
      formCertificado: {},
      formDatosCertificado: {},
      mercanciaForm: {},
      formaValida: {},
      buscarMercancia: [],
      mercanciaTabla: [],
      destinatarioForm: {},
      formDestinatario: {},
      formDatosDelDestinatario: {},
      idSolicitud: null,
      calle1: '',
      numeroLetra1: '',
      disponiblesDatos: [],
      fraccionArancelaria: '',
      tratado: '',
      pais: '',
      numeroRegistro: '',
      nombreComercial: '',
      fechaInicial: '',
      fechaFinal: '',
      archivo: '',
      presica: '',
      presenta: '',
      idioma: '',
      entidad: '',
      representacion: '',
      apellidoPrimer: '',
      apellidoSegundo: '',
      numeroFiscal: '',
      ciudad: '',
      calle: '',
      numeroLetra: '',
      lada: '',
      telefono: '',
      fax: '',
      correoElectronico: '',
      nacion: '',
      transporte: '',
      fraccionMercanciaArancelaria: '',
      nombreTecnico: '',
      nombreEnIngles: '',
      criterioParaConferir: '',
      marca: '',
      cantidad: '',
      valorDelaMercancia: '',
      complementoDelaDescripcion: '',
      nombreComercialDelaMercancia: '',
      unidadMedida: '',
      tipoFactura: '',
      fecha: '',
      numeroFactura: '',
      justificacion: '',
      casillaVerificacion: '',
      mercanciaSeleccionadasTablaData: [],
      mercancias_disponibles: []
    };

    service.getRegistroTomaMuestrasMercanciasData().subscribe((data) => {
      expect(data).toEqual(mockState);
    });

    const req = httpMock.expectOne('assets/json/110202/datos-previos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockState);
  });

  it('should call store.update when actualizarEstadoFormulario is called', () => {
    const mockState: TramiteState = {
      idiomaDatos: [],
      idiomaDatosSeleccion: { id: 1, descripcion: '' },
      paisDestin: [],
      paisDestinSeleccion: { id: 1, descripcion: '' },
      medioDeTransporte: [],
      medioDeTransporteSeleccion: { id: 1, descripcion: '' },
      entidadFederativaSeleccion: { id: 1, descripcion: '' },
      entidadFederativaDatos: [],
      representacionFederalDatos: [],
      representacionFederalSeleccion: { id: 1, descripcion: '' },
      altaPlanta: [],
      estado: { id: 1, descripcion: '' },
      factura: [],
      facturas: { id: 1, descripcion: '' },
      umc: { id: 1, descripcion: '' },
      umcs: [],
      masa: { id: 1, descripcion: '' },
      masaBruta: [],
      paisBloques: [],
      paisBloque: { id: 1, descripcion: '' },
      formCertificado: {},
      formDatosCertificado: {},
      mercanciaForm: {},
      formaValida: {},
      buscarMercancia: [],
      mercanciaTabla: [],
      destinatarioForm: {},
      formDestinatario: {},
      formDatosDelDestinatario: {},
      idSolicitud: null,
      calle1: '',
      numeroLetra1: '',
      disponiblesDatos: [],
      fraccionArancelaria: '',
      tratado: '',
      pais: '',
      numeroRegistro: '',
      nombreComercial: '',
      fechaInicial: '',
      fechaFinal: '',
      archivo: '',
      presica: '',
      presenta: '',
      idioma: '',
      entidad: '',
      representacion: '',
      apellidoPrimer: '',
      apellidoSegundo: '',
      numeroFiscal: '',
      ciudad: '',
      calle: '',
      numeroLetra: '',
      lada: '',
      telefono: '',
      fax: '',
      correoElectronico: '',
      nacion: '',
      transporte: '',
      fraccionMercanciaArancelaria: '',
      nombreTecnico: '',
      nombreEnIngles: '',
      criterioParaConferir: '',
      marca: '',
      cantidad: '',
      valorDelaMercancia: '',
      complementoDelaDescripcion: '',
      nombreComercialDelaMercancia: '',
      unidadMedida: '',
      tipoFactura: '',
      fecha: '',
      numeroFactura: '',
      justificacion: '',
      casillaVerificacion: '',
      mercanciaSeleccionadasTablaData: [],
      mercancias_disponibles: []
    };

    service.actualizarEstadoFormulario(mockState);

    expect(tramiteStoreMock.update).toHaveBeenCalledWith(expect.any(Function));
  });
});
