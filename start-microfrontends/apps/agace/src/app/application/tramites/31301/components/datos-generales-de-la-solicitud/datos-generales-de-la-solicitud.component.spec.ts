import { TestBed } from '@angular/core/testing';
import { DatosGeneralesDeLaSolicitudComponent } from './datos-generales-de-la-solicitud.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud31301Store } from '../../estados/solicitud31301.store';
import { Solicitud31301Query } from '../../estados/solicitud31301.query';
import {
  CatalogoSelectComponent,
  ConsultaioQuery,
  InputRadioComponent,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosGeneralesDeLaSolicitudComponent', () => {
  let component: DatosGeneralesDeLaSolicitudComponent;
  let fixture: any;
  let solicitudServiceSpy: jest.Mocked<SolicitudService>;
  let solicitud31301StoreSpy: jest.Mocked<Solicitud31301Store>;
  let solicitud31301QuerySpy: jest.Mocked<Solicitud31301Query>;
  let consultaioQuerySpy: jest.Mocked<ConsultaioQuery>;

  beforeEach(async () => {
    solicitudServiceSpy = {
      conseguirDatosGeneralesCatologo: jest.fn().mockReturnValue(
        of({
          concepto: {},
          tipoDeInversion: {},
        })
      ),
      conseguirListaDeSubcontratistas: jest.fn().mockReturnValue(of([])),
      conseguirRegimenAduanero: jest.fn().mockReturnValue(of([])),
      conseguirMiembrosDeLaEmpresa: jest.fn().mockReturnValue(of([])),
      conseguirTipoDeInversionDatos: jest.fn().mockReturnValue(of([])),
      conseguirDomicilios: jest.fn().mockReturnValue(of([])),
      conseguirDatosGeneralesDeLaSolicitudDatos: jest
        .fn()
        .mockReturnValue(of({})),
    } as any;

    solicitud31301StoreSpy = {
      actualizarTipoDeGarantia: jest.fn(() => of()),
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
      actualizarTextoGenerico4: jest.fn(),
      actualizarTextoGenerico5: jest.fn(),
      actualizar3523: jest.fn(),
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
      actualizarAlerta1: jest.fn(),
      actualizarAlerta2: jest.fn(),
      actualizarTipoDeEndoso: jest.fn(),
    } as any;

    solicitud31301QuerySpy = {
      selectSolicitud$: of({}),
    } as any;

    consultaioQuerySpy = {
      selectConsultaioState$: of({ readonly: false }),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        CatalogoSelectComponent,
        InputRadioComponent,
        TablaDinamicaComponent,
        DatosGeneralesDeLaSolicitudComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useValue: solicitudServiceSpy },
        { provide: Solicitud31301Store, useValue: solicitud31301StoreSpy },
        { provide: Solicitud31301Query, useValue: solicitud31301QuerySpy },
        { provide: ConsultaioQuery, useValue: consultaioQuerySpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosGeneralesDeLaSolicitudComponent);
    component = fixture.componentInstance;
    component.solicitud31301Store = {
      actualizarTipoDeGarantia: jest.fn(),
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
      actualizarTextoGenerico4: jest.fn(),
      actualizarTextoGenerico5: jest.fn(),
      actualizar3523: jest.fn(),
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
      actualizarAlerta1: jest.fn(),
      actualizarAlerta2: jest.fn(),
    } as any;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize datosGeneralesForm on ngOnInit', () => {
    component.solicitud31301State = {
      tipoDeEndoso: 'A',
      claveEnumeracionH: 'H',
    } as any;
    component.ngOnInit();
    expect(component.datosGeneralesForm).toBeDefined();
    expect(component.datosGeneralesForm.get('tipoDeEndoso')).toBeDefined();
  });

  it('should call guardarDatosFormulario if esFormularioSoloLectura is true', () => {
    const guardarDatosFormularioSpy = jest.spyOn(
      component,
      'guardarDatosFormulario'
    );
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario if esFormularioSoloLectura is false', () => {
    const inicializarFormularioSpy = jest.spyOn(
      component,
      'inicializarFormulario'
    );
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(inicializarFormularioSpy).toHaveBeenCalled();
  });

  it('should disable form if esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.inicializarFormulario = jest.fn();
    component.datosGeneralesForm = new FormBuilder().group({ test: [''] });
    const disableSpy = jest.spyOn(component.datosGeneralesForm, 'disable');
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(disableSpy).toHaveBeenCalled();
  });

  it('should enable form if esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.inicializarFormulario = jest.fn();
    component.datosGeneralesForm = new FormBuilder().group({ test: [''] });
    const enableSpy = jest.spyOn(component.datosGeneralesForm, 'enable');
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(enableSpy).toHaveBeenCalled();
  });


  it('should set conceptoLista and tipoDeInversionLista in conseguirDatosGeneralesCatologo', () => {
    component.conceptoLista = {
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
    } as any;
    component.tipoDeInversionLista = {
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
    } as any;
    component.conseguirDatosGeneralesCatologo();
    expect(component.conceptoLista).toBeDefined();
    expect(component.tipoDeInversionLista).toBeDefined();
  });

  it('should set listaDeSubcontratistas in conseguirListaDeSubcontratistas', () => {
    component.listaDeSubcontratistas = [
      {
        rfc: 'MAHA790703QW5',
        razonSocial: 'ARTURO MATA HERNANDEZ',
      },
    ] as any;
    component.conseguirListaDeSubcontratistas();
    expect(component.listaDeSubcontratistas).toBeDefined();
    expect(Array.isArray(component.listaDeSubcontratistas)).toBe(true);
  });

  it('should set listaRegimenAduanero in conseguirRegimenAduanero', () => {
    component.listaRegimenAduanero = [
      'Importación temporal para elaboración, transformación o reparación en programas de maquila o de exportación (IMMEX)',
      'Depósito fiscal para someterse al proceso de ensamble y fabricación de vehículos a empresas de la industria automotriz terminal',
      'Elaboración, transformación o reparación en recinto fiscalizado',
      'Recinto fiscalizado estratégico',
    ] as any;
    component.conseguirRegimenAduanero();
    expect(component.listaRegimenAduanero).toBeDefined();
    expect(Array.isArray(component.listaRegimenAduanero)).toBe(true);
  });

  it('should set listaSeccionSociosIC in conseguirMiembrosDeLaEmpresa', () => {
    component.listaSeccionSociosIC = [
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
    ] as any;
    component.conseguirMiembrosDeLaEmpresa();
    expect(component.listaSeccionSociosIC).toBeDefined();
    expect(Array.isArray(component.listaSeccionSociosIC)).toBe(true);
  });

  it('should set tipoDeInversionDatos in conseguirTipoDeInversionDatos', () => {
    component.tipoDeInversionDatos = [
      {
        idRegistro: 'INV12345',
        tipoInversion: 'Bienes Inmuebles',
        descripcion: 'Departamento en Ciudad de México',
        valor: '2500000',
        cveTipoInversion: 'BI01',
      },
    ] as any;
    component.conseguirTipoDeInversionDatos();
    expect(component.tipoDeInversionDatos).toBeDefined();
    expect(Array.isArray(component.tipoDeInversionDatos)).toBe(true);
  });

  it('should set domiciliosDatos in conseguirDomicilios', () => {
    component.domiciliosDatos = [
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
    ] as any;
    component.conseguirDomicilios();
    expect(component.domiciliosDatos).toBeDefined();
    expect(Array.isArray(component.domiciliosDatos)).toBe(true);
  });

  it('should call all store update methods with correct values in conseguirDatosGeneralesDeLaSolicitudDatos', () => {
    const mockRespuesta = {
      tipoDeGarantia: 'garantia',
      modalidadDeLaGarantia: 'modalidad',
      tipoSector: 'sector',
      concepto: 'concepto',
      '3500': 'v3500',
      '3501': 'v3501',
      '3502': 'v3502',
      datosGeneralesRFC: 'RFC123',
      '3503': 'v3503',
      '3504': 'v3504',
      '3505': 'v3505',
      '3506': 'v3506',
      '3507': 'v3507',
      '3508': 'v3508',
      '3509': 'v3509',
      '3511': 'v3511',
      '3512': 'v3512',
      '3513': 'v3513',
      textoGenerico1: 'tg1',
      textoGenerico2: 'tg2',
      '3514': 'v3514',
      '3515': 'v3515',
      '3516': 'v3516',
      textoGenerico3: 'tg3',
      '3517': 'v3517',
      '3518': 'v3518',
      '3519': 'v3519',
      '3520': 'v3520',
      tipoInversion: 'inversion',
      cantidadInversion: '1000',
      descInversion: 'desc',
      '3521': 'v3521',
      '3522': 'v3522',
      claveEnumeracionD0: 'd0',
      claveEnumeracionD1: 'd1',
      claveEnumeracionD2: 'd2',
      claveEnumeracionD3: 'd3',
      claveEnumeracionH: 'h',
      textoGenerico4: 'tg4',
      textoGenerico5: 'tg5',
      '3523': 'v3523',
      '3528': 'v3528',
      '3529': 'v3529',
      textoGenerico6: 'tg6',
      textoGenerico7: 'tg7',
      '3530': 'v3530',
      '3531': 'v3531',
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
      alerta1: 'alerta1',
      alerta2: 'alerta2',
    };

    component.destroy$ = new Subject<void>();

    component.solicitudService = {
      conseguirDatosGeneralesDeLaSolicitudDatos: jest
        .fn()
        .mockReturnValue(of(mockRespuesta)),
    } as any;

    component.conseguirDatosGeneralesDeLaSolicitudDatos();

    expect(
      component.solicitud31301Store.actualizarTipoDeGarantia
    ).toHaveBeenCalledWith('garantia');
    expect(
      component.solicitud31301Store.actualizarModalidadDeLaGarantia
    ).toHaveBeenCalledWith('modalidad');
    expect(component.solicitud31301Store.actualizarTipoSector).toHaveBeenCalledWith(
      'sector'
    );
    expect(component.solicitud31301Store.actualizarConcepto).toHaveBeenCalledWith(
      'concepto'
    );
    expect(component.solicitud31301Store.actualizar3500).toHaveBeenCalledWith('v3500');
    expect(component.solicitud31301Store.actualizar3501).toHaveBeenCalledWith('v3501');
    expect(component.solicitud31301Store.actualizar3502).toHaveBeenCalledWith('v3502');
    expect(
      component.solicitud31301Store.actualizarDatosGeneralesRFC
    ).toHaveBeenCalledWith('RFC123');
    expect(component.solicitud31301Store.actualizar3503).toHaveBeenCalledWith('v3503');
    expect(component.solicitud31301Store.actualizar3504).toHaveBeenCalledWith('v3504');
    expect(component.solicitud31301Store.actualizar3505).toHaveBeenCalledWith('v3505');
    expect(component.solicitud31301Store.actualizar3506).toHaveBeenCalledWith('v3506');
    expect(component.solicitud31301Store.actualizar3507).toHaveBeenCalledWith('v3507');
    expect(component.solicitud31301Store.actualizar3508).toHaveBeenCalledWith('v3508');
    expect(component.solicitud31301Store.actualizar3509).toHaveBeenCalledWith('v3509');
    expect(component.solicitud31301Store.actualizar3511).toHaveBeenCalledWith('v3511');
    expect(component.solicitud31301Store.actualizar3512).toHaveBeenCalledWith('v3512');
    expect(component.solicitud31301Store.actualizar3513).toHaveBeenCalledWith('v3513');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico1
    ).toHaveBeenCalledWith('tg1');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico2
    ).toHaveBeenCalledWith('tg2');
    expect(component.solicitud31301Store.actualizar3514).toHaveBeenCalledWith('v3514');
    expect(component.solicitud31301Store.actualizar3515).toHaveBeenCalledWith('v3515');
    expect(component.solicitud31301Store.actualizar3516).toHaveBeenCalledWith('v3516');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico3
    ).toHaveBeenCalledWith('tg3');
    expect(component.solicitud31301Store.actualizar3517).toHaveBeenCalledWith('v3517');
    expect(component.solicitud31301Store.actualizar3518).toHaveBeenCalledWith('v3518');
    expect(component.solicitud31301Store.actualizar3519).toHaveBeenCalledWith('v3519');
    expect(component.solicitud31301Store.actualizar3520).toHaveBeenCalledWith('v3520');
    expect(component.solicitud31301Store.actualizarTipoInversion).toHaveBeenCalledWith(
      'inversion'
    );
    expect(
      component.solicitud31301Store.actualizarCantidadInversion
    ).toHaveBeenCalledWith('1000');
    expect(component.solicitud31301Store.actualizarDescInversion).toHaveBeenCalledWith(
      'desc'
    );
    expect(component.solicitud31301Store.actualizar3521).toHaveBeenCalledWith('v3521');
    expect(component.solicitud31301Store.actualizar3522).toHaveBeenCalledWith('v3522');
    expect(
      component.solicitud31301Store.actualizarClaveEnumeracionD0
    ).toHaveBeenCalledWith('d0');
    expect(
      component.solicitud31301Store.actualizarClaveEnumeracionD1
    ).toHaveBeenCalledWith('d1');
    expect(
      component.solicitud31301Store.actualizarClaveEnumeracionD2
    ).toHaveBeenCalledWith('d2');
    expect(
      component.solicitud31301Store.actualizarClaveEnumeracionD3
    ).toHaveBeenCalledWith('d3');
    expect(
      component.solicitud31301Store.actualizarClaveEnumeracionH
    ).toHaveBeenCalledWith('h');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico4
    ).toHaveBeenCalledWith('tg4');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico5
    ).toHaveBeenCalledWith('tg5');
    expect(component.solicitud31301Store.actualizar3523).toHaveBeenCalledWith('v3523');
    expect(component.solicitud31301Store.actualizar3528).toHaveBeenCalledWith('v3528');
    expect(component.solicitud31301Store.actualizar3529).toHaveBeenCalledWith('v3529');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico6
    ).toHaveBeenCalledWith('tg6');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico7
    ).toHaveBeenCalledWith('tg7');
    expect(component.solicitud31301Store.actualizar3530).toHaveBeenCalledWith('v3530');
    expect(component.solicitud31301Store.actualizar3531).toHaveBeenCalledWith('v3531');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico9
    ).toHaveBeenCalledWith('tg9');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico10
    ).toHaveBeenCalledWith('tg10');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico11
    ).toHaveBeenCalledWith('tg11');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico12
    ).toHaveBeenCalledWith('tg12');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico13
    ).toHaveBeenCalledWith('tg13');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico14
    ).toHaveBeenCalledWith('tg14');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico15
    ).toHaveBeenCalledWith('tg15');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico16
    ).toHaveBeenCalledWith('tg16');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico17
    ).toHaveBeenCalledWith('tg17');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico18
    ).toHaveBeenCalledWith('tg18');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico19
    ).toHaveBeenCalledWith('tg19');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico20
    ).toHaveBeenCalledWith('tg20');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico21
    ).toHaveBeenCalledWith('tg21');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico22
    ).toHaveBeenCalledWith('tg22');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico23
    ).toHaveBeenCalledWith('tg23');
    expect(
      component.solicitud31301Store.actualizarTextoGenerico24
    ).toHaveBeenCalledWith('tg24');
    expect(component.solicitud31301Store.actualizarAlerta1).toHaveBeenCalledWith(
      'alerta1'
    );
    expect(component.solicitud31301Store.actualizarAlerta2).toHaveBeenCalledWith(
      'alerta2'
    );
  });

  it('should clean up destroy$ on ngOnDestroy', () => {
    const destroy$ = component.destroy$ as Subject<void>;
    const nextSpy = jest.spyOn(destroy$, 'next');
    const completeSpy = jest.spyOn(destroy$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
