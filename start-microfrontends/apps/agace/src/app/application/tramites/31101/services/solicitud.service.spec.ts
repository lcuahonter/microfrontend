import { TestBed } from '@angular/core/testing';
import { SolicitudService } from './solicitud.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Solicitud31101Store } from '../estados/solicitud31101.store';

describe('SolicitudService', () => {
  let service: SolicitudService;
  let httpMock: HttpTestingController;
  let solicitud31101Store: jest.Mocked<Solicitud31101Store>;

  beforeEach(() => {
    solicitud31101Store = {
      actualizarTipoDeGarantia: jest.fn().mockReturnValue('Fianza'),
      actualizarModalidadDeLaGarantia: jest.fn(),
      actualizarTipoSector: jest.fn(),
      actualizarConcepto: jest.fn(),
      actualizar3500: jest.fn(),
      actualizar3501: jest.fn(),
      actualizar3502: jest.fn(),
      actualizarDatosGeneralesRFC: jest.fn(),
      actualizar3503: jest.fn(),
      actualizar3504: jest.fn(),
      actualizar3505: jest.fn(),
      actualizar3506: jest.fn(),
      actualizar3507: jest.fn(),
      actualizar3508: jest.fn(),
      actualizar3509: jest.fn(),
      actualizar3511: jest.fn(),
      actualizar3512: jest.fn(),
      actualizar3513: jest.fn(),
      actualizarTextoGenerico1: jest.fn(),
      actualizarTextoGenerico2: jest.fn(),
      actualizar3514: jest.fn(),
      actualizar3515: jest.fn(),
      actualizar3516: jest.fn(),
      actualizarTextoGenerico3: jest.fn(),
      actualizar3517: jest.fn(),
      actualizar3518: jest.fn(),
      actualizar3519: jest.fn(),
      actualizar3520: jest.fn(),
      actualizarTipoInversion: jest.fn(),
      actualizarCantidadInversion: jest.fn(),
      actualizarDescInversion: jest.fn(),
      actualizar3521: jest.fn(),
      actualizar3522: jest.fn(),
      actualizarClaveEnumeracionD0: jest.fn(),
      actualizarClaveEnumeracionD1: jest.fn(),
      actualizarClaveEnumeracionD2: jest.fn(),
      actualizarClaveEnumeracionD3: jest.fn(),
      actualizarClaveEnumeracionH: jest.fn(),
      actualizarModalidadProgramaImmex: jest.fn(),
      actualizarTextoGenerico4: jest.fn(),
      actualizarTextoGenerico5: jest.fn(),
      actualizar3523: jest.fn(),
      actualizar3524: jest.fn(),
      actualizar3525: jest.fn(),
      actualizar3526: jest.fn(),
      actualizar3527: jest.fn(),
      actualizarFechaFinVigencia1: jest.fn(),
      actualizarNumeroAutorizacion1: jest.fn(),
      actualizarFechaFinVigencia2: jest.fn(),
      actualizarNumeroAutorizacion2: jest.fn(),
      actualizar3528: jest.fn(),
      actualizar3529: jest.fn(),
      actualizarTextoGenerico6: jest.fn(),
      actualizarTextoGenerico7: jest.fn(),
      actualizar3530: jest.fn(),
      actualizar3531: jest.fn(),
      actualizarTextoGenerico9: jest.fn(),
      actualizarTextoGenerico10: jest.fn(),
      actualizarTextoGenerico11: jest.fn(),
      actualizarTextoGenerico12: jest.fn(),
      actualizarTextoGenerico13: jest.fn(),
      actualizarTextoGenerico14: jest.fn(),
      actualizarTextoGenerico15: jest.fn(),
      actualizarTextoGenerico16: jest.fn(),
      actualizarTextoGenerico17: jest.fn(),
      actualizarTextoGenerico18: jest.fn(),
      actualizarTextoGenerico19: jest.fn(),
      actualizarTextoGenerico20: jest.fn(),
      actualizarTextoGenerico21: jest.fn(),
      actualizarTextoGenerico22: jest.fn(),
      actualizarTextoGenerico23: jest.fn(),
      actualizarTextoGenerico24: jest.fn(),
      actualizarAlerta2: jest.fn(),
      actualizarPolizaDeFianzaActual: jest.fn(),
      actualizarNumeroFolio: jest.fn(),
      actualizarRfcInstitucion: jest.fn(),
      actualizarFechaExpedicion: jest.fn(),
      actualizarFechaInicioVigenciaNo: jest.fn(),
      actualizarFechaFinVigenciaNo: jest.fn(),
      actualizarFechaInicioVigencia: jest.fn(),
      actualizarFechaFinVigencia: jest.fn(),
      actualizarImporteTotal: jest.fn(),
      actualizarRazonSocialAnterior: jest.fn(),
      actualizarRazonSocialActual: jest.fn(),
      actualizarRfc: jest.fn(),
      actualizarCurp: jest.fn(),
      actualizarNombre: jest.fn(),
      actualizarApellidoPaterno: jest.fn(),
      actualizarApellidoMaterno: jest.fn(),
      actualizarMiembroCaracterDe: jest.fn(),
      actualizarMiembroTributarMexico: jest.fn(),
      actualizarMiembroNacionalidad: jest.fn(),
      actualizarMiembroRFC: jest.fn(),
      actualizarMiembroRegistroFederal: jest.fn(),
      actualizarMiembroNombreCompleto: jest.fn(),
      actualizarMiembroTipoPersonaMuestra: jest.fn(),
      actualizarMiembroNombre: jest.fn(),
      actualizarMiembroApellidoPaterno: jest.fn(),
      actualizarMiembroApellidoMaterno: jest.fn(),
      actualizarMiembroNombreEmpresa: jest.fn(),
      actualizarEntidadFederativa: jest.fn(),
      actualizarInstalacionesPrincipales: jest.fn(),
      actualizarMunicipio: jest.fn(),
      actualizarTipoDeInstalacion: jest.fn(),
      actualizarFederativa: jest.fn(),
      actualizarRegistroSE: jest.fn(),
      actualizarDesceripe: jest.fn(),
      actualizarCodigoPostal: jest.fn(),
      actualizarProcesoProductivo: jest.fn(),
    } as unknown as jest.Mocked<Solicitud31101Store>;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SolicitudService,
        { provide: Solicitud31101Store, useValue: solicitud31101Store },
      ],
    });
    service = TestBed.inject(SolicitudService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch recibir notificaciones', () => {
    const mockData = [
      {
        rfc: 'GODE561231GR8',
        curp: 'GODE561231HDFRRN04',
        nombre: 'Juan',
        apellidoPaterno: 'Gómez',
        apellidoMaterno: 'Delgado',
      },
    ];
    service.conseguirRecibirNotificaciones().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      'assets/json/31101/recibir-notificaciones.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch modificacion denominacion razon social', () => {
    const mockData = {
      razonSocialAnterior: 'EQUIPOS ELECTRICOS GARCIA SA DE CV',
      razonSocialActual:
        'UNION DE PERMISIONARIOS VERACRUZ BOCA DEL RIO GRUPO LIBERTAD SA DE CV',
    };
    service.conseguirModificacionDenominacionRazonSocial().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      'assets/json/31101/modificacion-denominacion-razon-social.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch nombre institucion catalogo', () => {
    const mockData = {
      labelNombre: 'Datos de la póliza de fianza actual',
      required: false,
      primerOpcion: 'Seleccione un valor',
      catalogos: [
        {
          id: 1,
          descripcion: 'DORAMA, INSTITUCION DE GARANTIAS SA',
        },
        {
          id: 2,
          descripcion: 'DORAMA, INSTITUCION DE GARANTIAS SA - 1',
        },
      ],
    };
    service.conseguirNombreInstitucionCatalogo().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      'assets/json/31101/nombre-institucion-catalogo.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch datos por garantia', () => {
    const mockData = {
      polizaDeFianzaActual: 1,
      numeroFolio: '645456546',
      rfcInstitucion: 'FDO9411098R8',
      fechaExpedicion: '30/09/2024',
      fechaInicioVigenciaNo: '30/09/2024',
      fechaFinVigenciaNo: '30/09/2024',
      fechaInicioVigencia: '30/09/2024',
      fechaFinVigencia: '30/09/2024',
      importeTotal: '3213',
    };
    service.conseguirDatosPorGarantia().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/31101/datos-por-garantia.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch datos generales opcion de radio', () => {
    const mockData = {
      tipoDeEndoso: {
        radioOptions: [
          {
            label: 'Aumento de monto',
            value: 1,
          },
          {
            label: 'Aumento de monto y renovación/ampliación de vigencia',
            value: 2,
          },
          {
            label: 'Modificación de denominación o razórrsocial',
            value: 3,
          },
          {
            label: 'Renovación/ampliación de vigencia',
            value: 4,
          },
        ],
        isRequired: true,
      },
      tipoDeGarantia: {
        radioOptions: [
          {
            label: 'Fianza',
            value: 1,
          },
          {
            label: 'Carta de crédito',
            value: 2,
          },
        ],
        isRequired: true,
      },
      modalidadDeLaGarantia: {
        radioOptions: [
          {
            label: 'Garantía revolvente',
            value: 1,
          },
          {
            label: 'Garantía individual',
            value: 2,
          },
        ],
        isRequired: true,
      },
      tipoSector: {
        radioOptions: [
          {
            label: 'Sector productivo',
            value: 1,
          },
          {
            label: 'Sector servicio',
            value: 2,
          },
        ],
        isRequired: true,
      },
      requisitos: {
        radioOptions: [
          {
            label: 'Sí',
            value: 1,
          },
          {
            label: 'No',
            value: 2,
          },
        ],
        isRequired: true,
      },
    };
    service.conseguirDatosGeneralesOpcionDeRadio().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      'assets/json/31101/datos-generales-de-la-solicitud-radio-option.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch datos generales catalogo', () => {
    const mockData = {
      concepto: {
        labelNombre: 'Concepto',
        required: false,
        primerOpcion: 'Seleccione un valor',
        catalogos: [
          {
            id: 1,
            descripcion: 'Fabricación de maquinaria y equipo',
          },
          {
            id: 2,
            descripcion: 'Fabricación de maquinaria y equipo - 1',
          },
        ],
      },
      tipoDeInversion: {
        labelNombre: 'Tipo de inversión',
        required: true,
        primerOpcion: 'Selecciona un tipo',
        catalogos: [
          {
            id: 1,
            descripcion: 'Test',
          },
          {
            id: 2,
            descripcion: 'Test - 1',
          },
        ],
      },
    };
    service.conseguirDatosGeneralesCatologo().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      'assets/json/31101/datos-generales-de-la-solicitud-catologo.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch lista de subcontratistas', () => {
    const mockData = [
      {
        rfc: 'MAHA790703QW5',
        razonSocial: 'ARTURO MATA HERNANDEZ',
      },
    ];
    service.conseguirListaDeSubcontratistas().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      'assets/json/31101/lista-de-subcontratistas.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch regimen aduanero', () => {
    const mockData = [
      'Importación temporal para elaboración, transformación o reparación en programas de maquila o de exportación (IMMEX)',
      'Depósito fiscal para someterse al proceso de ensamble y fabricación de vehículos a empresas de la industria automotriz terminal',
      'Elaboración, transformación o reparación en recinto fiscalizado',
      'Recinto fiscalizado estratégico',
    ];
    service.conseguirRegimenAduanero().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/31101/regimen-aduanero.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch miembros de la empresa', () => {
    const mockData = [
      {
        tipoPersonaMuestra: 'Física',
        nombreCompleto: 'Juan Pérez',
        rfc: 'PEJJ800101XXX',
        caracterDe: 'Representante Legal',
        nacionalidad: 'Mexicana',
        nombreEmpresa: 'Tecnologías Avanzadas SA de CV',
        tributarMexico: 'Sí',
        razonSocial: 'Tecnologías Avanzadas SA de CV',
      },
    ];
    service.conseguirMiembrosDeLaEmpresa().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      'assets/json/31101/miembros-de-la-empresa.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch tipo de inversion datos', () => {
    const mockData = [
      {
        idRegistro: 'INV12345',
        tipoInversion: 'Bienes Inmuebles',
        descripcion: 'Departamento en Ciudad de México',
        valor: '2500000',
        cveTipoInversion: 'BI01',
      },
    ];
    service.conseguirTipoDeInversionDatos().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      'assets/json/31101/tipo-de-inversion-datos.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch domicilios', () => {
    const mockData = [
      {
        instalacionPrincipal: 'Planta Norte',
        cveTipoInstalacion: '01',
        tipoInstalacion: 'Fábrica',
        cveEntidadFederativa: '09',
        entidadFederativa: 'Ciudad de México',
        cveDelegacionMunicipio: '010',
        municipioDelegacion: 'Gustavo A. Madero',
        direccion: 'Av. Central 123',
        codigoPostal: '07760',
        registroSESAT: 'SESAT-456789',
        procesoProductivo: 'Fabricación de electrónicos',
        fechaModificacion: '2025-04-18',
        cveEstatus: 'A1',
        estatus: 'Activo',
        noExterior: '123',
        noInterior: '5B',
        cveColonia: '025',
        calle: 'Av. Central',
        descCol: 'Colonia Industrial',
        idRecinto: 'RC-998877',
        numFolioAcuse: 'FA-20250418-01',
        observaciones: 'Instalación con verificación reciente.',
      },
    ];
    service.conseguirDomicilios().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/31101/domicilios.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch guardarDatosFormulario', () => {
    const mockData = {
      tipoDeGarantia: 'Fianza',
      modalidadDeLaGarantia: 'Individual',
      tipoSector: 'Productivo',
      concepto: 'Test',
      3500: 'a',
      3501: 'b',
      3502: 'c',
      datosGeneralesRFC: 'RFC',
      3503: 'd',
      3504: 'e',
      3505: 'f',
      3506: 'g',
      3507: 'h',
      3508: 'i',
      3509: 'j',
      3511: 'k',
      3512: 'l',
      3513: 'm',
      textoGenerico1: 'n',
      textoGenerico2: 'o',
      3514: 'p',
      3515: 'q',
      3516: 'r',
      textoGenerico3: 's',
      3517: 't',
      3518: 'u',
      3519: 'v',
      3520: 'w',
      tipoInversion: 'Bienes',
      cantidadInversion: 1,
      descInversion: 'desc',
      3521: 'x',
      3522: 'y',
      claveEnumeracionD0: 'd0',
      claveEnumeracionD1: 'd1',
      claveEnumeracionD2: 'd2',
      claveEnumeracionD3: 'd3',
      claveEnumeracionH: 'h',
      modalidadProgramaImmex: 'immex',
      textoGenerico4: 'tg4',
      textoGenerico5: 'tg5',
      3523: 'z',
      3524: 'aa',
      3525: 'bb',
      3526: 'cc',
      3527: 'dd',
      fechaFinVigencia1: '2024-01-01',
      numeroAutorizacion1: 'aut1',
      fechaFinVigencia2: '2024-02-01',
      numeroAutorizacion2: 'aut2',
      3528: 'ee',
      3529: 'ff',
      textoGenerico6: 'tg6',
      textoGenerico7: 'tg7',
      3530: 'gg',
      3531: 'hh',
      textoGenerico9: 'tg9',
      textoGenerico10: 'tg10',
      textoGenerico11: 'tg11',
      textoGenerico12: 'tg12',
      textoGenerico13: 'tg13',
      textoGenerico14: 'tg14',
      textoGenerico15: 'tg15',
      textoGenerico16: 'tg16',
      textoGenerico17: 'tg17',
      textoGenerico18: 'tg18',
      textoGenerico19: 'tg19',
      textoGenerico20: 'tg20',
      textoGenerico21: 'tg21',
      textoGenerico22: 'tg22',
      textoGenerico23: 'tg23',
      textoGenerico24: 'tg24',
      alerta2: true,
      polizaDeFianzaActual: 1,
      numeroFolio: 'folio',
      rfcInstitucion: 'RFCI',
      fechaExpedicion: '2024-01-01',
      fechaInicioVigenciaNo: '2024-01-01',
      fechaFinVigenciaNo: '2024-01-01',
      fechaInicioVigencia: '2024-01-01',
      fechaFinVigencia: '2024-01-01',
      importeTotal: 1000,
      razonSocialAnterior: 'RSA',
      razonSocialActual: 'RSACT',
      rfc: 'RFC',
      curp: 'CURP',
      nombre: 'NOMBRE',
      apellidoPaterno: 'AP',
      apellidoMaterno: 'AM',
      miembroCaracterDe: 'MC',
      miembroTributarMexico: 'MTM',
      miembroNacionalidad: 'MN',
      miembroRfc: 'MRFC',
      miembroRegistroFederal: 'MRF',
      miembroNombreCompleto: 'MNC',
      miembroTipoPersonaMuestra: 'MTPM',
      miembroNombre: 'MNOM',
      miembroApellidoPaterno: 'MAP',
      miembroApellidoMaterno: 'MAM',
      miembroNombreEmpresa: 'MNE',
      entidadFederativa: 'EF',
      instalacionesPrincipales: 'IP',
      municipio: 'MUN',
      tipoDeInstalacion: 'TI',
      federativa: 'FED',
      registroSE: 'RSE',
      desceripe: 'DESC',
      codigoPostal: 'CP',
      procesoProductivo: 'PP',
    };
    service.guardarDatosFormulario().subscribe((data) => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/31101/solicitud31101.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should update store when actualizarEstadoFormulario is called', () => {
    const respuesta: any = {
      tipoDeGarantia: 'Fianza',
      modalidadDeLaGarantia: 'Individual',
      tipoSector: 'Productivo',
      concepto: 'Test',
      3500: 'a',
      3501: 'b',
      3502: 'c',
      datosGeneralesRFC: 'RFC',
      3503: 'd',
      3504: 'e',
      3505: 'f',
      3506: 'g',
      3507: 'h',
      3508: 'i',
      3509: 'j',
      3511: 'k',
      3512: 'l',
      3513: 'm',
      textoGenerico1: 'n',
      textoGenerico2: 'o',
      3514: 'p',
      3515: 'q',
      3516: 'r',
      textoGenerico3: 's',
      3517: 't',
      3518: 'u',
      3519: 'v',
      3520: 'w',
      tipoInversion: 'Bienes',
      cantidadInversion: 1,
      descInversion: 'desc',
      3521: 'x',
      3522: 'y',
      claveEnumeracionD0: 'd0',
      claveEnumeracionD1: 'd1',
      claveEnumeracionD2: 'd2',
      claveEnumeracionD3: 'd3',
      claveEnumeracionH: 'h',
      modalidadProgramaImmex: 'immex',
      textoGenerico4: 'tg4',
      textoGenerico5: 'tg5',
      3523: 'z',
      3524: 'aa',
      3525: 'bb',
      3526: 'cc',
      3527: 'dd',
      fechaFinVigencia1: '2024-01-01',
      numeroAutorizacion1: 'aut1',
      fechaFinVigencia2: '2024-02-01',
      numeroAutorizacion2: 'aut2',
      3528: 'ee',
      3529: 'ff',
      textoGenerico6: 'tg6',
      textoGenerico7: 'tg7',
      3530: 'gg',
      3531: 'hh',
      textoGenerico9: 'tg9',
      textoGenerico10: 'tg10',
      textoGenerico11: 'tg11',
      textoGenerico12: 'tg12',
      textoGenerico13: 'tg13',
      textoGenerico14: 'tg14',
      textoGenerico15: 'tg15',
      textoGenerico16: 'tg16',
      textoGenerico17: 'tg17',
      textoGenerico18: 'tg18',
      textoGenerico19: 'tg19',
      textoGenerico20: 'tg20',
      textoGenerico21: 'tg21',
      textoGenerico22: 'tg22',
      textoGenerico23: 'tg23',
      textoGenerico24: 'tg24',
      alerta2: true,
      polizaDeFianzaActual: 1,
      numeroFolio: 'folio',
      rfcInstitucion: 'RFCI',
      fechaExpedicion: '2024-01-01',
      fechaInicioVigenciaNo: '2024-01-01',
      fechaFinVigenciaNo: '2024-01-01',
      fechaInicioVigencia: '2024-01-01',
      fechaFinVigencia: '2024-01-01',
      importeTotal: 1000,
      razonSocialAnterior: 'RSA',
      razonSocialActual: 'RSACT',
      rfc: 'RFC',
      curp: 'CURP',
      nombre: 'NOMBRE',
      apellidoPaterno: 'AP',
      apellidoMaterno: 'AM',
      miembroCaracterDe: 'MC',
      miembroTributarMexico: 'MTM',
      miembroNacionalidad: 'MN',
      miembroRfc: 'MRFC',
      miembroRegistroFederal: 'MRF',
      miembroNombreCompleto: 'MNC',
      miembroTipoPersonaMuestra: 'MTPM',
      miembroNombre: 'MNOM',
      miembroApellidoPaterno: 'MAP',
      miembroApellidoMaterno: 'MAM',
      miembroNombreEmpresa: 'MNE',
      entidadFederativa: 'EF',
      instalacionesPrincipales: 'IP',
      municipio: 'MUN',
      tipoDeInstalacion: 'TI',
      federativa: 'FED',
      registroSE: 'RSE',
      desceripe: 'DESC',
      codigoPostal: 'CP',
      procesoProductivo: 'PP',
    };
    service.actualizarEstadoFormulario(respuesta);
    console.log
    expect(solicitud31101Store.actualizarTipoDeGarantia).toHaveBeenCalledWith(
      'Fianza'
    );
    expect(
      solicitud31101Store.actualizarModalidadDeLaGarantia
    ).toHaveBeenCalledWith('Individual');
    expect(solicitud31101Store.actualizarTipoSector).toHaveBeenCalledWith(
      'Productivo'
    );
    expect(solicitud31101Store.actualizarConcepto).toHaveBeenCalledWith('Test');
    expect(solicitud31101Store.actualizar3500).toHaveBeenCalledWith('a');
    expect(solicitud31101Store.actualizar3501).toHaveBeenCalledWith('b');
    expect(solicitud31101Store.actualizar3502).toHaveBeenCalledWith('c');
    expect(
      solicitud31101Store.actualizarDatosGeneralesRFC
    ).toHaveBeenCalledWith('RFC');
    expect(solicitud31101Store.actualizar3503).toHaveBeenCalledWith('d');
    expect(solicitud31101Store.actualizar3504).toHaveBeenCalledWith('e');
    expect(solicitud31101Store.actualizar3505).toHaveBeenCalledWith('f');
    expect(solicitud31101Store.actualizar3506).toHaveBeenCalledWith('g');
    expect(solicitud31101Store.actualizar3507).toHaveBeenCalledWith('h');
    expect(solicitud31101Store.actualizar3508).toHaveBeenCalledWith('i');
    expect(solicitud31101Store.actualizar3509).toHaveBeenCalledWith('j');
    expect(solicitud31101Store.actualizar3511).toHaveBeenCalledWith('k');
    expect(solicitud31101Store.actualizar3512).toHaveBeenCalledWith('l');
    expect(solicitud31101Store.actualizar3513).toHaveBeenCalledWith('m');
    expect(solicitud31101Store.actualizarTextoGenerico1).toHaveBeenCalledWith(
      'n'
    );
    expect(solicitud31101Store.actualizarTextoGenerico2).toHaveBeenCalledWith(
      'o'
    );
    expect(solicitud31101Store.actualizar3514).toHaveBeenCalledWith('p');
    expect(solicitud31101Store.actualizar3515).toHaveBeenCalledWith('q');
    expect(solicitud31101Store.actualizar3516).toHaveBeenCalledWith('r');
    expect(solicitud31101Store.actualizarTextoGenerico3).toHaveBeenCalledWith(
      's'
    );
    expect(solicitud31101Store.actualizar3517).toHaveBeenCalledWith('t');
    expect(solicitud31101Store.actualizar3518).toHaveBeenCalledWith('u');
    expect(solicitud31101Store.actualizar3519).toHaveBeenCalledWith('v');
    expect(solicitud31101Store.actualizar3520).toHaveBeenCalledWith('w');
    expect(solicitud31101Store.actualizarTipoInversion).toHaveBeenCalledWith(
      'Bienes'
    );
    expect(
      solicitud31101Store.actualizarCantidadInversion
    ).toHaveBeenCalledWith(1);
    expect(solicitud31101Store.actualizarDescInversion).toHaveBeenCalledWith(
      'desc'
    );
    expect(solicitud31101Store.actualizar3521).toHaveBeenCalledWith('x');
    expect(solicitud31101Store.actualizar3522).toHaveBeenCalledWith('y');
    expect(
      solicitud31101Store.actualizarClaveEnumeracionD0
    ).toHaveBeenCalledWith('d0');
    expect(
      solicitud31101Store.actualizarClaveEnumeracionD1
    ).toHaveBeenCalledWith('d1');
    expect(
      solicitud31101Store.actualizarClaveEnumeracionD2
    ).toHaveBeenCalledWith('d2');
    expect(
      solicitud31101Store.actualizarClaveEnumeracionD3
    ).toHaveBeenCalledWith('d3');
    expect(
      solicitud31101Store.actualizarClaveEnumeracionH
    ).toHaveBeenCalledWith('h');
    expect(
      solicitud31101Store.actualizarModalidadProgramaImmex
    ).toHaveBeenCalledWith('immex');
    expect(solicitud31101Store.actualizarTextoGenerico4).toHaveBeenCalledWith(
      'tg4'
    );
    expect(solicitud31101Store.actualizarTextoGenerico5).toHaveBeenCalledWith(
      'tg5'
    );
    expect(solicitud31101Store.actualizar3523).toHaveBeenCalledWith('z');
    expect(solicitud31101Store.actualizar3524).toHaveBeenCalledWith('aa');
    expect(solicitud31101Store.actualizar3525).toHaveBeenCalledWith('bb');
    expect(solicitud31101Store.actualizar3526).toHaveBeenCalledWith('cc');
    expect(solicitud31101Store.actualizar3527).toHaveBeenCalledWith('dd');
    expect(
      solicitud31101Store.actualizarFechaFinVigencia1
    ).toHaveBeenCalledWith('2024-01-01');
    expect(
      solicitud31101Store.actualizarNumeroAutorizacion1
    ).toHaveBeenCalledWith('aut1');
    expect(
      solicitud31101Store.actualizarFechaFinVigencia2
    ).toHaveBeenCalledWith('2024-02-01');
    expect(
      solicitud31101Store.actualizarNumeroAutorizacion2
    ).toHaveBeenCalledWith('aut2');
    expect(solicitud31101Store.actualizar3528).toHaveBeenCalledWith('ee');
    expect(solicitud31101Store.actualizar3529).toHaveBeenCalledWith('ff');
    expect(solicitud31101Store.actualizarTextoGenerico6).toHaveBeenCalledWith(
      'tg6'
    );
    expect(solicitud31101Store.actualizarTextoGenerico7).toHaveBeenCalledWith(
      'tg7'
    );
    expect(solicitud31101Store.actualizar3530).toHaveBeenCalledWith('gg');
    expect(solicitud31101Store.actualizar3531).toHaveBeenCalledWith('hh');
    expect(solicitud31101Store.actualizarTextoGenerico9).toHaveBeenCalledWith(
      'tg9'
    );
    expect(solicitud31101Store.actualizarTextoGenerico10).toHaveBeenCalledWith(
      'tg10'
    );
    expect(solicitud31101Store.actualizarTextoGenerico11).toHaveBeenCalledWith(
      'tg11'
    );
    expect(solicitud31101Store.actualizarTextoGenerico12).toHaveBeenCalledWith(
      'tg12'
    );
    expect(solicitud31101Store.actualizarTextoGenerico13).toHaveBeenCalledWith(
      'tg13'
    );
    expect(solicitud31101Store.actualizarTextoGenerico14).toHaveBeenCalledWith(
      'tg14'
    );
    expect(solicitud31101Store.actualizarTextoGenerico15).toHaveBeenCalledWith(
      'tg15'
    );
    expect(solicitud31101Store.actualizarTextoGenerico16).toHaveBeenCalledWith(
      'tg16'
    );
    expect(solicitud31101Store.actualizarTextoGenerico17).toHaveBeenCalledWith(
      'tg17'
    );
    expect(solicitud31101Store.actualizarTextoGenerico18).toHaveBeenCalledWith(
      'tg18'
    );
    expect(solicitud31101Store.actualizarTextoGenerico19).toHaveBeenCalledWith(
      'tg19'
    );
    expect(solicitud31101Store.actualizarTextoGenerico20).toHaveBeenCalledWith(
      'tg20'
    );
    expect(solicitud31101Store.actualizarTextoGenerico21).toHaveBeenCalledWith(
      'tg21'
    );
    expect(solicitud31101Store.actualizarTextoGenerico22).toHaveBeenCalledWith(
      'tg22'
    );
    expect(solicitud31101Store.actualizarTextoGenerico23).toHaveBeenCalledWith(
      'tg23'
    );
    expect(solicitud31101Store.actualizarTextoGenerico24).toHaveBeenCalledWith(
      'tg24'
    );
    expect(solicitud31101Store.actualizarAlerta2).toHaveBeenCalledWith(true);
    expect(
      solicitud31101Store.actualizarPolizaDeFianzaActual
    ).toHaveBeenCalledWith(1);
    expect(solicitud31101Store.actualizarNumeroFolio).toHaveBeenCalledWith(
      'folio'
    );
    expect(solicitud31101Store.actualizarRfcInstitucion).toHaveBeenCalledWith(
      'RFCI'
    );
    expect(solicitud31101Store.actualizarFechaExpedicion).toHaveBeenCalledWith(
      '2024-01-01'
    );
    expect(
      solicitud31101Store.actualizarFechaInicioVigenciaNo
    ).toHaveBeenCalledWith('2024-01-01');
    expect(
      solicitud31101Store.actualizarFechaFinVigenciaNo
    ).toHaveBeenCalledWith('2024-01-01');
    expect(
      solicitud31101Store.actualizarFechaInicioVigencia
    ).toHaveBeenCalledWith('2024-01-01');
    expect(solicitud31101Store.actualizarFechaFinVigencia).toHaveBeenCalledWith(
      '2024-01-01'
    );
    expect(solicitud31101Store.actualizarImporteTotal).toHaveBeenCalledWith(
      1000
    );
    expect(
      solicitud31101Store.actualizarRazonSocialAnterior
    ).toHaveBeenCalledWith('RSA');
    expect(
      solicitud31101Store.actualizarRazonSocialActual
    ).toHaveBeenCalledWith('RSACT');
    expect(solicitud31101Store.actualizarRfc).toHaveBeenCalledWith('RFC');
    expect(solicitud31101Store.actualizarCurp).toHaveBeenCalledWith('CURP');
    expect(solicitud31101Store.actualizarNombre).toHaveBeenCalledWith('NOMBRE');
    expect(solicitud31101Store.actualizarApellidoPaterno).toHaveBeenCalledWith(
      'AP'
    );
    expect(solicitud31101Store.actualizarApellidoMaterno).toHaveBeenCalledWith(
      'AM'
    );
    expect(
      solicitud31101Store.actualizarMiembroCaracterDe
    ).toHaveBeenCalledWith('MC');
    expect(
      solicitud31101Store.actualizarMiembroTributarMexico
    ).toHaveBeenCalledWith('MTM');
    expect(
      solicitud31101Store.actualizarMiembroNacionalidad
    ).toHaveBeenCalledWith('MN');
    expect(solicitud31101Store.actualizarMiembroRFC).toHaveBeenCalledWith(
      'MRFC'
    );
    expect(
      solicitud31101Store.actualizarMiembroRegistroFederal
    ).toHaveBeenCalledWith('MRF');
    expect(
      solicitud31101Store.actualizarMiembroNombreCompleto
    ).toHaveBeenCalledWith('MNC');
    expect(
      solicitud31101Store.actualizarMiembroTipoPersonaMuestra
    ).toHaveBeenCalledWith('MTPM');
    expect(solicitud31101Store.actualizarMiembroNombre).toHaveBeenCalledWith(
      'MNOM'
    );
    expect(
      solicitud31101Store.actualizarMiembroApellidoPaterno
    ).toHaveBeenCalledWith('MAP');
    expect(
      solicitud31101Store.actualizarMiembroApellidoMaterno
    ).toHaveBeenCalledWith('MAM');
    expect(
      solicitud31101Store.actualizarMiembroNombreEmpresa
    ).toHaveBeenCalledWith('MNE');
    expect(
      solicitud31101Store.actualizarEntidadFederativa
    ).toHaveBeenCalledWith('EF');
    expect(
      solicitud31101Store.actualizarInstalacionesPrincipales
    ).toHaveBeenCalledWith('IP');
    expect(solicitud31101Store.actualizarMunicipio).toHaveBeenCalledWith('MUN');
    expect(
      solicitud31101Store.actualizarTipoDeInstalacion
    ).toHaveBeenCalledWith('TI');
    expect(solicitud31101Store.actualizarFederativa).toHaveBeenCalledWith(
      'FED'
    );
    expect(solicitud31101Store.actualizarRegistroSE).toHaveBeenCalledWith(
      'RSE'
    );
    expect(solicitud31101Store.actualizarDesceripe).toHaveBeenCalledWith(
      'DESC'
    );
    expect(solicitud31101Store.actualizarCodigoPostal).toHaveBeenCalledWith(
      'CP'
    );
    expect(
      solicitud31101Store.actualizarProcesoProductivo
    ).toHaveBeenCalledWith('PP');
  });
});
