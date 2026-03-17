import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosGeneralesDeLaSolicitudComponent } from './datos-generales-de-la-solicitud.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  CatalogoSelectComponent,
  ConsultaioQuery,
  InputFechaComponent,
  InputRadioComponent,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablePaginationComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { MiembroDeLaEmpresaComponent } from '../miembro-de-la-empresa/miembro-de-la-empresa.component';
import { ModificarImmexProgramComponent } from '../modificar-immex-program/modificar-immex-program.component';
import { AgregarImmexProgramComponent } from '../agregar-immex-program/agregar-immex-program.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud31101Query } from '../../estados/solicitud31101.query';
import { Solicitud31101Store } from '../../estados/solicitud31101.store';
import { TIPO_DE_INVERSION_CONFIG } from '../../constants/solicitud.enum';

const mockSolicitudService = {
  conseguirDatosGeneralesCatologo: jest.fn().mockReturnValue(
    of({
      concepto: [{ id: 1, descripcion: 'Concepto 1' }],
      tipoDeInversion: [{ id: 1, descripcion: 'Inversión 1' }],
      modalidadDelProgramaIMMEX: [{ id: 1, descripcion: 'IMMEX 1' }],
    })
  ),
  conseguirListaDeSubcontratistas: jest.fn().mockReturnValue(of([])),
  conseguirRegimenAduanero: jest.fn().mockReturnValue(of(['Regimen1'])),
  conseguirMiembrosDeLaEmpresa: jest.fn().mockReturnValue(of([])),
  conseguirTipoDeInversionDatos: jest.fn().mockReturnValue(of([])),
  conseguirDomicilios: jest.fn().mockReturnValue(of([])),
  conseguirDatosGeneralesOpcionDeRadio: jest.fn().mockReturnValue(of([])),
  entidadFederativaCatalogo: jest.fn().mockReturnValue(of([])),
};

const mockSolicitud31101Store = {
  actualizarTipoDeGarantia: jest.fn(() => of()),
  actualizarModalidadDeLaGarantia: jest.fn(() => of()),
  actualizarTipoSector: jest.fn(() => of()),
  actualizarProductivoConcepto: jest.fn(() => of()),
  actualizarServicioConcepto: jest.fn(() => of()),
  actualizar3500: jest.fn(() => of()),
  actualizar3501: jest.fn(() => of()),
  actualizar3502: jest.fn(() => of()),
  actualizarDatosGeneralesRFC: jest.fn(() => of()),
  actualizar3503: jest.fn(() => of()),
  actualizar3504: jest.fn(() => of()),
  actualizar3505: jest.fn(() => of()),
  actualizar3506: jest.fn(() => of()),
  actualizar3507: jest.fn(() => of()),
  actualizar3508: jest.fn(() => of()),
  actualizar3509: jest.fn(() => of()),
  actualizar3511: jest.fn(() => of()),
  actualizar3512: jest.fn(() => of()),
  actualizar3513: jest.fn(() => of()),
  actualizarTextoGenerico1: jest.fn(() => of()),
  actualizarTextoGenerico2: jest.fn(() => of()),
  actualizar3514: jest.fn(() => of()),
  actualizar3515: jest.fn(() => of()),
  actualizar3516: jest.fn(() => of()),
  actualizarTextoGenerico3: jest.fn(() => of()),
  actualizar3517: jest.fn(() => of()),
  actualizar3518: jest.fn(() => of()),
  actualizar3519: jest.fn(() => of()),
  actualizar3520: jest.fn(() => of()),
  actualizarTipoInversion: jest.fn(() => of()),
  actualizarCantidadInversion: jest.fn(() => of()),
  actualizarDescInversion: jest.fn(() => of()),
  actualizar3521: jest.fn(() => of()),
  actualizar3522: jest.fn(() => of()),
  actualizarClaveEnumeracionD0: jest.fn(() => of()),
  actualizarClaveEnumeracionD1: jest.fn(() => of()),
  actualizarClaveEnumeracionD2: jest.fn(() => of()),
  actualizarClaveEnumeracionD3: jest.fn(() => of()),
  actualizarClaveEnumeracionH: jest.fn(() => of()),
  actualizarModalidadProgramaImmex: jest.fn(() => of()),
  actualizarTextoGenerico4: jest.fn(() => of()),
  actualizarTextoGenerico5: jest.fn(() => of()),
  actualizar3523: jest.fn(() => of()),
  actualizar3524: jest.fn(() => of()),
  actualizar3525: jest.fn(() => of()),
  actualizar3526: jest.fn(() => of()),
  actualizar3527: jest.fn(() => of()),
  actualizarFechaFinVigencia1: jest.fn(() => of()),
  actualizarNumeroAutorizacion1: jest.fn(() => of()),
  actualizarFechaFinVigencia2: jest.fn(() => of()),
  actualizarNumeroAutorizacion2: jest.fn(() => of()),
  actualizar3528: jest.fn(() => of()),
  actualizar3529: jest.fn(() => of()),
  actualizarTextoGenerico6: jest.fn(() => of()),
  actualizarTextoGenerico7: jest.fn(() => of()),
  actualizar3530: jest.fn(() => of()),
  actualizar3531: jest.fn(() => of()),
  actualizarTextoGenerico9: jest.fn(() => of()),
  actualizarTextoGenerico10: jest.fn(() => of()),
  actualizarTextoGenerico11: jest.fn(() => of()),
  actualizarTextoGenerico12: jest.fn(() => of()),
  actualizarTextoGenerico13: jest.fn(() => of()),
  actualizarTextoGenerico14: jest.fn(() => of()),
  actualizarTextoGenerico15: jest.fn(() => of()),
  actualizarTextoGenerico16: jest.fn(() => of()),
  actualizarTextoGenerico17: jest.fn(() => of()),
  actualizarTextoGenerico18: jest.fn(() => of()),
  actualizarTextoGenerico19: jest.fn(() => of()),
  actualizarTextoGenerico20: jest.fn(() => of()),
  actualizarTextoGenerico21: jest.fn(() => of()),
  actualizarAlerta2: jest.fn(() => of()),
  actualizarTextoGenerico22: jest.fn(() => of()),
  actualizarTextoGenerico23: jest.fn(() => of()),
  actualizarTextoGenerico24: jest.fn(() => of()),
  update: jest.fn(() => of()),
  actualizarInstalacionesPrincipales: jest.fn(() => of()),
  actualizarRegimenAduanero: jest.fn(() => of()),
  actualizarListaDeSubcontratistas: jest.fn(() => of()),
  actualizarMunicipio: jest.fn(() => of()),
  actualizarEntidadFederativa: jest.fn(() => of()),
  actualizarCodigoPostal: jest.fn(() => of()),
  actualizarTipoDeInstalacion: jest.fn(() => of()),
  actualizarFederativa: jest.fn(() => of()),
  actualizarRegistroSESAT: jest.fn(() => of()),
  actualizarDomicilio: jest.fn(() => of()),
  actualizarMiembrosDeLaEmpresa: jest.fn(() => of()),
  actualizarTipoDeInversionDatos: jest.fn(() => of()),
  actualizarRegistroSE: jest.fn(() => of()),
  actualizarDesceripe: jest.fn(() => of()),
  actualizarProcesoProductivo: jest.fn(() => of()),
  actualizarPolizaFianzaActual: jest.fn(() => of()),
  actualizarFolioFianza: jest.fn(() => of()),
  actualizarRfcAfianzadora: jest.fn(() => of()),
  actualizarFechaExpedicionFianza: jest.fn(() => of()),
  actualizarFecInicioVigenciaFianza: jest.fn(() => of()),
  actualizarFecFinVigenciaFianza: jest.fn(() => of()),
  actualizarFianzaImporteTotal: jest.fn(() => of()),
  actualizarPolizaDeFianzaActual: jest.fn(() => of()),
  actualizarNumeroFolio: jest.fn(() => of()),
  actualizarRfcInstitucion: jest.fn(() => of()),
};

const mockSolicitud31101Query = {
  selectSolicitud$: of({}),
};

const mockConsultaioQuery = {
  selectConsultaioState$: of({ readonly: false }),
};

describe('DatosGeneralesDeLaSolicitudComponent', () => {
  let component: DatosGeneralesDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosGeneralesDeLaSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DatosGeneralesDeLaSolicitudComponent,
        CommonModule,
        TituloComponent,
        CatalogoSelectComponent,
        InputRadioComponent,
        TablaDinamicaComponent,
        NotificacionesComponent,
        MiembroDeLaEmpresaComponent,
        ModificarImmexProgramComponent,
        AgregarImmexProgramComponent,
        InputFechaComponent,
        TablePaginationComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useValue: mockSolicitudService },
        { provide: Solicitud31101Store, useValue: mockSolicitud31101Store },
        { provide: Solicitud31101Query, useValue: mockSolicitud31101Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    })
      .overrideComponent(DatosGeneralesDeLaSolicitudComponent, {
        set: {
          providers: [
            { provide: SolicitudService, useValue: mockSolicitudService },
          ],
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(DatosGeneralesDeLaSolicitudComponent);
    component = fixture.componentInstance;
    component.tipoDeInversionLista = TIPO_DE_INVERSION_CONFIG;
    component.solicitudService = TestBed.inject(SolicitudService as any);
    component.solicitud31101Store = TestBed.inject(Solicitud31101Store as any);
    component.solicitud31101Query = TestBed.inject(Solicitud31101Query as any);
    component.consultaioQuery = TestBed.inject(ConsultaioQuery as any);
    jest.spyOn(component, 'inicializarFormulario').mockImplementation(() => {});
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    const spy = jest.spyOn(component, 'inicializarEstadoFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call actualizarTipoDeGarantia', () => {
    component.actualizarTipoDeGarantia('test');
    expect(
      mockSolicitud31101Store.actualizarTipoDeGarantia
    ).toHaveBeenCalledWith('test');
  });

  it('should call actualizarModalidadDeLaGarantia', () => {
    component.actualizarModalidadDeLaGarantia(1);
    expect(
      mockSolicitud31101Store.actualizarModalidadDeLaGarantia
    ).toHaveBeenCalledWith(1);
  });

  it('should set espectaculoConcepto true if tipoSector > 0', () => {
    component.actualizarTipoSector(2);
    expect(component.espectaculoConcepto).toBe(true);
  });

  it('should set espectaculoConcepto false if tipoSector <= 0', () => {
    component.actualizarTipoSector(0);
    expect(component.espectaculoConcepto).toBe(false);
  });

  it('should call actualizarProductivoConcepto if tipoSector is 1', () => {
    component.datosGeneralesForm = new FormBuilder().group({ tipoSector: [1] });
    component.actualizarConcepto({ id: 5, descripcion: 'test' } as any);
    expect(
      mockSolicitud31101Store.actualizarProductivoConcepto
    ).toHaveBeenCalledWith(5);
  });

  it('should call actualizarServicioConcepto if tipoSector is 2', () => {
    component.datosGeneralesForm = new FormBuilder().group({ tipoSector: [2] });
    component.actualizarConcepto({ id: 6, descripcion: 'test' } as any);
    expect(
      mockSolicitud31101Store.actualizarServicioConcepto
    ).toHaveBeenCalledWith(6);
  });

  it('should call actualizarDatosGeneralesRFC', () => {
    const event = { target: { value: 'RFC123' } } as any;
    component.actualizarDatosGeneralesRFC(event);
    expect(
      mockSolicitud31101Store.actualizarDatosGeneralesRFC
    ).toHaveBeenCalledWith('RFC123');
  });

  it('should call actualizar3506 and set espectaculoEnCasoNegativo', () => {
    component.actualizar3506(2);
    expect(component.espectaculoEnCasoNegativo).toBe(true);
    expect(mockSolicitud31101Store.actualizar3506).toHaveBeenCalledWith(2);

    component.actualizar3506(1);
    expect(component.espectaculoEnCasoNegativo).toBe(false);
  });

  it('should call actualizarCantidadInversion', () => {
    const event = { target: { value: '1000' } } as any;
    component.actualizarCantidadInversion(event);
    expect(
      mockSolicitud31101Store.actualizarCantidadInversion
    ).toHaveBeenCalledWith('1000');
  });

  it('should call actualizarDescInversion', () => {
    const event = { target: { value: 'desc' } } as any;
    component.actualizarDescInversion(event);
    expect(
      mockSolicitud31101Store.actualizarDescInversion
    ).toHaveBeenCalledWith('desc');
  });

  it('should call actualizarAlerta2', () => {
    const event = { target: { checked: true } } as any;
    component.actualizarAlerta2(event);
    expect(mockSolicitud31101Store.actualizarAlerta2).toHaveBeenCalledWith(
      true
    );
  });

  it('should set subContratistasDatos on seleccionarSubContratistasDatos', () => {
    const arr = [{ idRegistro: 1 }] as any;
    component.seleccionarSubContratistasDatos(arr);
    expect(component.subContratistasDatos).toBe(arr);
  });

  it('should remove subcontratista on eliminarRFCDatos', () => {
    component.subContratistasDatos = [];
    component.listaDeSubcontratistas = [];
    const abrirModalSpy = jest.spyOn(component, 'abrirModal');
    component.eliminarRFCDatos();
    expect(component.listaDeSubcontratistas.length).toBe(0);
    expect(component.subContratistasDatos.length).toBe(0);
  });

  it('should set nuevaNotificacion and elementoParaEliminar on abrirModal', () => {
    component.abrirModal('msg', 3);
    expect(component.nuevaNotificacion.mensaje).toBe('msg');
    expect(component.elementoParaEliminar).toBe(3);
  });

  it('should calculate and call actualizarTextoGenerico22 on calcularValorComercial', () => {
    component.datosGeneralesForm = new FormBuilder().group({
      textoGenerico10: [1],
      textoGenerico13: [2],
      textoGenerico16: [3],
      textoGenerico19: [4],
    });
    component.calcularValorComercial();
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico22
    ).toHaveBeenCalledWith(10);
  });

  it('should calculate and call actualizarTextoGenerico23 on calcularValorAduana', () => {
    component.datosGeneralesForm = new FormBuilder().group({
      textoGenerico11: [1],
      textoGenerico14: [2],
      textoGenerico17: [3],
      textoGenerico20: [4],
    });
    component.calcularValorAduana();
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico23
    ).toHaveBeenCalledWith(10);
  });

  it('should calculate and call actualizarTextoGenerico24 on calcularValorPorcentaje', () => {
    component.datosGeneralesForm = new FormBuilder().group({
      textoGenerico12: [1],
      textoGenerico15: [2],
      textoGenerico18: [3],
      textoGenerico21: [4],
    });
    component.calcularValorPorcentaje();
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico24
    ).toHaveBeenCalledWith(10);
  });

  it('should remove pedimento on eliminarPedimento', () => {
    component.pedimentos = [{}, {}, {}] as any;
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(true);
    expect(component.pedimentos.length).toBe(2);
  });

  it('should set seleccionarDomiciliosDatos on seleccionarDomiciliosLista', () => {
    const arr = [{ id: 1 }] as any;
    component.seleccionarDomiciliosLista(arr);
    expect(component.seleccionarDomiciliosDatos).toBe(arr);
  });

  it('should set selectedListaSeccionSociosIC on listaDeFilaSeleccionada', () => {
    const arr = [{ rfc: 'X' }] as any;
    component.listaDeFilaSeleccionada(arr);
    expect(component.selectedListaSeccionSociosIC).toBe(arr);
  });

  it('should remove member from listaSeccionSociosIC on eliminarMiembrosEmpresa', () => {
    component.selectedListaSeccionSociosIC = [{ rfc: 'A' }] as any;
    component.listaSeccionSociosIC = [{ rfc: 'A' }, { rfc: 'B' }] as any;
    component.eliminarMiembrosEmpresa();
    expect(component.listaSeccionSociosIC.length).toBe(1);
    expect(component.selectedListaSeccionSociosIC.length).toBe(0);
  });

  it('should add to tipoDeInversionDatos on agregarMiembrosDeLaEmpresa', () => {
    component.tipoDeInversionLista = {
      catalogos: [{ id: 1, descripcion: 'INV' }],
    } as any;
    component.datosGeneralesForm = new FormBuilder().group({
      tipoInversion: [1],
      cantidadInversion: [100],
      descInversion: ['desc'],
    });
    component.tipoDeInversionDatos = [];
    component.agregarMiembrosDeLaEmpresa();
    expect(component.tipoDeInversionDatos.length).toBe(1);
  });

  it('should add RFC to listaDeSubcontratistas on agregarRFCDato', () => {
    component.datosGeneralesForm = new FormBuilder().group({
      datosGeneralesRFC: ['RFCX'],
    });
    component.listaDeSubcontratistas = [];
    component.agregarRFCDato();
    expect(component.listaDeSubcontratistas.length).toBe(1);
    expect(component.datosGeneralesForm.get('datosGeneralesRFC')?.value).toBe(
      ''
    );
  });

  it('should return true for noEsValido if control is invalid and touched', () => {
    component.datosGeneralesForm = new FormBuilder().group({
      test: ['val'],
    });
    const control = component.datosGeneralesForm.get('test');
    control?.setErrors({ required: true });
    control?.markAsTouched();
    expect(component.noEsValido('test')).toBe(true);
  });

  it('should call solicitud31101Store.update on seleccionarRegimenAduanero', () => {
    const event = { target: { checked: true } } as any;
    component.seleccionarRegimenAduanero(event, 'campo');
    expect(mockSolicitud31101Store.update).toHaveBeenCalled();
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const destroy$ = new Subject<void>();
    (component as any).destroy$ = destroy$;
    const nextSpy = jest.spyOn(destroy$, 'next');
    const completeSpy = jest.spyOn(destroy$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario if esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    const guardarDatosFormularioSpy = jest.spyOn(
      component,
      'guardarDatosFormulario'
    );
    component.inicializarEstadoFormulario();
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario if esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    const inicializarFormularioSpy = jest.spyOn(
      component,
      'inicializarFormulario'
    );
    component.inicializarEstadoFormulario();
    expect(inicializarFormularioSpy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario and disable form if esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    const disableSpy = jest.spyOn(component.datosGeneralesForm, 'disable');
    component.guardarDatosFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(disableSpy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario and enable form if esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    const enableSpy = jest.spyOn(component.datosGeneralesForm, 'enable');
    component.guardarDatosFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(enableSpy).toHaveBeenCalled();
  });

  it('should call actualizar3500', () => {
    component.actualizar3500(123);
    expect(mockSolicitud31101Store.actualizar3500).toHaveBeenCalledWith(123);
    component.actualizar3500('abc');
    expect(mockSolicitud31101Store.actualizar3500).toHaveBeenCalledWith('abc');
  });

  it('should call actualizar3501', () => {
    component.actualizar3501(456);
    expect(mockSolicitud31101Store.actualizar3501).toHaveBeenCalledWith(456);
    component.actualizar3501('def');
    expect(mockSolicitud31101Store.actualizar3501).toHaveBeenCalledWith('def');
  });

  it('should call actualizar3502', () => {
    component.actualizar3502(789);
    expect(mockSolicitud31101Store.actualizar3502).toHaveBeenCalledWith(789);
    component.actualizar3502('ghi');
    expect(mockSolicitud31101Store.actualizar3502).toHaveBeenCalledWith('ghi');
  });

  it('should call actualizar3503', () => {
    component.actualizar3503(321);
    expect(mockSolicitud31101Store.actualizar3503).toHaveBeenCalledWith(321);
    component.actualizar3503('xyz');
    expect(mockSolicitud31101Store.actualizar3503).toHaveBeenCalledWith('xyz');
  });

  it('should call actualizar3504', () => {
    component.actualizar3504(654);
    expect(mockSolicitud31101Store.actualizar3504).toHaveBeenCalledWith(654);
    component.actualizar3504('uvw');
    expect(mockSolicitud31101Store.actualizar3504).toHaveBeenCalledWith('uvw');
  });

  it('should call actualizar3505', () => {
    component.actualizar3505(987);
    expect(mockSolicitud31101Store.actualizar3505).toHaveBeenCalledWith(987);
    component.actualizar3505('rst');
    expect(mockSolicitud31101Store.actualizar3505).toHaveBeenCalledWith('rst');
  });

  it('should call actualizar3507', () => {
    component.actualizar3507(111);
    expect(mockSolicitud31101Store.actualizar3507).toHaveBeenCalledWith(111);
    component.actualizar3507('abc');
    expect(mockSolicitud31101Store.actualizar3507).toHaveBeenCalledWith('abc');
  });

  it('should call actualizar3508', () => {
    component.actualizar3508(222);
    expect(mockSolicitud31101Store.actualizar3508).toHaveBeenCalledWith(222);
    component.actualizar3508('def');
    expect(mockSolicitud31101Store.actualizar3508).toHaveBeenCalledWith('def');
  });

  it('should call actualizar3509', () => {
    component.actualizar3509(333);
    expect(mockSolicitud31101Store.actualizar3509).toHaveBeenCalledWith(333);
    component.actualizar3509('ghi');
    expect(mockSolicitud31101Store.actualizar3509).toHaveBeenCalledWith('ghi');
  });

  it('should call actualizar3511', () => {
    component.actualizar3511(444);
    expect(mockSolicitud31101Store.actualizar3511).toHaveBeenCalledWith(444);
    component.actualizar3511('jkl');
    expect(mockSolicitud31101Store.actualizar3511).toHaveBeenCalledWith('jkl');
  });

  it('should call actualizar3512', () => {
    component.actualizar3512(555);
    expect(mockSolicitud31101Store.actualizar3512).toHaveBeenCalledWith(555);
    component.actualizar3512('mno');
    expect(mockSolicitud31101Store.actualizar3512).toHaveBeenCalledWith('mno');
  });

  it('should call actualizar3513', () => {
    component.actualizar3513(666);
    expect(mockSolicitud31101Store.actualizar3513).toHaveBeenCalledWith(666);
    component.actualizar3513('pqr');
    expect(mockSolicitud31101Store.actualizar3513).toHaveBeenCalledWith('pqr');
  });

  it('should call actualizarTextoGenerico1 with input value', () => {
    const event = { target: { value: 'texto1' } } as any;
    component.actualizarTextoGenerico1(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico1
    ).toHaveBeenCalledWith('texto1');
  });

  it('should call actualizarTextoGenerico2 with input value', () => {
    const event = { target: { value: 'texto2' } } as any;
    component.actualizarTextoGenerico2(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico2
    ).toHaveBeenCalledWith('texto2');
  });

  it('should call actualizar3514', () => {
    component.actualizar3514(777);
    expect(mockSolicitud31101Store.actualizar3514).toHaveBeenCalledWith(777);
    component.actualizar3514('stu');
    expect(mockSolicitud31101Store.actualizar3514).toHaveBeenCalledWith('stu');
  });

  it('should call actualizar3515', () => {
    component.actualizar3515(888);
    expect(mockSolicitud31101Store.actualizar3515).toHaveBeenCalledWith(888);
    component.actualizar3515('vwx');
    expect(mockSolicitud31101Store.actualizar3515).toHaveBeenCalledWith('vwx');
  });

  it('should call actualizar3516', () => {
    component.actualizar3516(999);
    expect(mockSolicitud31101Store.actualizar3516).toHaveBeenCalledWith(999);
    component.actualizar3516('yz');
    expect(mockSolicitud31101Store.actualizar3516).toHaveBeenCalledWith('yz');
  });

  it('should call actualizarTextoGenerico3 with input value', () => {
    const event = { target: { value: 'texto3' } } as any;
    component.actualizarTextoGenerico3(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico3
    ).toHaveBeenCalledWith('texto3');
  });

  it('should call actualizar3517', () => {
    component.actualizar3517(1010);
    expect(mockSolicitud31101Store.actualizar3517).toHaveBeenCalledWith(1010);
    component.actualizar3517('abc2');
    expect(mockSolicitud31101Store.actualizar3517).toHaveBeenCalledWith('abc2');
  });

  it('should call actualizar3518', () => {
    component.actualizar3518(2020);
    expect(mockSolicitud31101Store.actualizar3518).toHaveBeenCalledWith(2020);
    component.actualizar3518('def2');
    expect(mockSolicitud31101Store.actualizar3518).toHaveBeenCalledWith('def2');
  });

  it('should call actualizar3519', () => {
    component.actualizar3519(3030);
    expect(mockSolicitud31101Store.actualizar3519).toHaveBeenCalledWith(3030);
    component.actualizar3519('ghi2');
    expect(mockSolicitud31101Store.actualizar3519).toHaveBeenCalledWith('ghi2');
  });

  it('should call actualizar3520', () => {
    component.actualizar3520(4040);
    expect(mockSolicitud31101Store.actualizar3520).toHaveBeenCalledWith(4040);
    component.actualizar3520('jkl2');
    expect(mockSolicitud31101Store.actualizar3520).toHaveBeenCalledWith('jkl2');
  });

  it('should call actualizarTipoInversion with catalogo id', () => {
    const catalogo = { id: 123, descripcion: 'Tipo Inv' } as any;
    component.actualizarTipoInversion(catalogo);
    expect(
      mockSolicitud31101Store.actualizarTipoInversion
    ).toHaveBeenCalledWith(123);
  });

  it('should call actualizar3521', () => {
    component.actualizar3521(1234);
    expect(mockSolicitud31101Store.actualizar3521).toHaveBeenCalledWith(1234);
    component.actualizar3521('abcd');
    expect(mockSolicitud31101Store.actualizar3521).toHaveBeenCalledWith('abcd');
  });

  it('should call actualizar3522', () => {
    component.actualizar3522(5678);
    expect(mockSolicitud31101Store.actualizar3522).toHaveBeenCalledWith(5678);
    component.actualizar3522('efgh');
    expect(mockSolicitud31101Store.actualizar3522).toHaveBeenCalledWith('efgh');
  });

  it('should call actualizarClaveEnumeracionD0', () => {
    component.actualizarClaveEnumeracionD0(true);
    expect(
      mockSolicitud31101Store.actualizarClaveEnumeracionD0
    ).toHaveBeenCalledWith(true);
    component.actualizarClaveEnumeracionD0(false);
    expect(
      mockSolicitud31101Store.actualizarClaveEnumeracionD0
    ).toHaveBeenCalledWith(false);
  });

  it('should call actualizarClaveEnumeracionD1', () => {
    component.actualizarClaveEnumeracionD1(true);
    expect(
      mockSolicitud31101Store.actualizarClaveEnumeracionD1
    ).toHaveBeenCalledWith(true);
    component.actualizarClaveEnumeracionD1(false);
    expect(
      mockSolicitud31101Store.actualizarClaveEnumeracionD1
    ).toHaveBeenCalledWith(false);
  });

  it('should call actualizarClaveEnumeracionD2', () => {
    component.actualizarClaveEnumeracionD2(true);
    expect(
      mockSolicitud31101Store.actualizarClaveEnumeracionD2
    ).toHaveBeenCalledWith(true);
    component.actualizarClaveEnumeracionD2(false);
    expect(
      mockSolicitud31101Store.actualizarClaveEnumeracionD2
    ).toHaveBeenCalledWith(false);
  });

  it('should call actualizarClaveEnumeracionD3', () => {
    component.actualizarClaveEnumeracionD3(true);
    expect(
      mockSolicitud31101Store.actualizarClaveEnumeracionD3
    ).toHaveBeenCalledWith(true);
    component.actualizarClaveEnumeracionD3(false);
    expect(
      mockSolicitud31101Store.actualizarClaveEnumeracionD3
    ).toHaveBeenCalledWith(false);
  });

  it('should call actualizarClaveEnumeracionH', () => {
    component.actualizarClaveEnumeracionH(true);
    expect(
      mockSolicitud31101Store.actualizarClaveEnumeracionH
    ).toHaveBeenCalledWith(true);
    component.actualizarClaveEnumeracionH(false);
    expect(
      mockSolicitud31101Store.actualizarClaveEnumeracionH
    ).toHaveBeenCalledWith(false);
  });

  it('should call conseguirDomicilios and actualizarModalidadProgramaImmex if evento.id exists', () => {
    const conseguirDomiciliosSpy = jest
      .spyOn(component, 'conseguirDomicilios')
      .mockImplementation(() => {});
    component.actualizarModalidadProgramaImmex({
      id: 99,
      descripcion: 'IMMEX',
    } as any);
    expect(conseguirDomiciliosSpy).toHaveBeenCalled();
    expect(
      mockSolicitud31101Store.actualizarModalidadProgramaImmex
    ).toHaveBeenCalledWith(99);
  });

  it('should not call conseguirDomicilios or actualizarModalidadProgramaImmex if evento.id is falsy', () => {
    const conseguirDomiciliosSpy = jest
      .spyOn(component, 'conseguirDomicilios')
      .mockImplementation(() => {});
    component.actualizarModalidadProgramaImmex({} as any);
    expect(conseguirDomiciliosSpy).not.toHaveBeenCalled();
    expect(
      mockSolicitud31101Store.actualizarModalidadProgramaImmex
    ).not.toHaveBeenCalled();
  });

  it('should call actualizarTextoGenerico4 with input value', () => {
    const event = { target: { value: 'texto4' } } as any;
    component.actualizarTextoGenerico4(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico4
    ).toHaveBeenCalledWith('texto4');
  });

  it('should call actualizarTextoGenerico5 with input value', () => {
    const event = { target: { value: 'texto5' } } as any;
    component.actualizarTextoGenerico5(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico5
    ).toHaveBeenCalledWith('texto5');
  });

  it('should call actualizar3523', () => {
    component.actualizar3523(12345);
    expect(mockSolicitud31101Store.actualizar3523).toHaveBeenCalledWith(12345);
    component.actualizar3523('ijkl');
    expect(mockSolicitud31101Store.actualizar3523).toHaveBeenCalledWith('ijkl');
  });

  it('should call actualizar3524', () => {
    component.actualizar3524(67890);
    expect(mockSolicitud31101Store.actualizar3524).toHaveBeenCalledWith(67890);
    component.actualizar3524('mnop');
    expect(mockSolicitud31101Store.actualizar3524).toHaveBeenCalledWith('mnop');
  });

  it('should call actualizar3525', () => {
    component.actualizar3525(11111);
    expect(mockSolicitud31101Store.actualizar3525).toHaveBeenCalledWith(11111);
    component.actualizar3525('qrst');
    expect(mockSolicitud31101Store.actualizar3525).toHaveBeenCalledWith('qrst');
  });

  it('should call actualizar3526', () => {
    component.actualizar3526(22222);
    expect(mockSolicitud31101Store.actualizar3526).toHaveBeenCalledWith(22222);
    component.actualizar3526('uvwx');
    expect(mockSolicitud31101Store.actualizar3526).toHaveBeenCalledWith('uvwx');
  });

  it('should call actualizar3527', () => {
    component.actualizar3527(33333);
    expect(mockSolicitud31101Store.actualizar3527).toHaveBeenCalledWith(33333);
    component.actualizar3527('yzab');
    expect(mockSolicitud31101Store.actualizar3527).toHaveBeenCalledWith('yzab');
  });

  it('should call actualizarFechaFinVigencia1', () => {
    component.actualizarFechaFinVigencia1('2024-01-01');
    expect(
      mockSolicitud31101Store.actualizarFechaFinVigencia1
    ).toHaveBeenCalledWith('2024-01-01');
  });

  it('should call actualizarNumeroAutorizacion1 with input value', () => {
    const event = { target: { value: 'aut1' } } as any;
    component.actualizarNumeroAutorizacion1(event);
    expect(
      mockSolicitud31101Store.actualizarNumeroAutorizacion1
    ).toHaveBeenCalledWith('aut1');
  });

  it('should call actualizarFechaFinVigencia2', () => {
    component.actualizarFechaFinVigencia2('2024-12-31');
    expect(
      mockSolicitud31101Store.actualizarFechaFinVigencia2
    ).toHaveBeenCalledWith('2024-12-31');
  });

  it('should call actualizarNumeroAutorizacion2 with input value', () => {
    const event = { target: { value: 'aut2' } } as any;
    component.actualizarNumeroAutorizacion2(event);
    expect(
      mockSolicitud31101Store.actualizarNumeroAutorizacion2
    ).toHaveBeenCalledWith('aut2');
  });

  it('should call actualizar3528', () => {
    component.actualizar3528(44444);
    expect(mockSolicitud31101Store.actualizar3528).toHaveBeenCalledWith(44444);
    component.actualizar3528('cdef');
    expect(mockSolicitud31101Store.actualizar3528).toHaveBeenCalledWith('cdef');
  });

  it('should call actualizar3529', () => {
    component.actualizar3529(55555);
    expect(mockSolicitud31101Store.actualizar3529).toHaveBeenCalledWith(55555);
    component.actualizar3529('ghij');
    expect(mockSolicitud31101Store.actualizar3529).toHaveBeenCalledWith('ghij');
  });

  it('should call actualizarTextoGenerico6 with input value', () => {
    const event = { target: { value: 'texto6' } } as any;
    component.actualizarTextoGenerico6(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico6
    ).toHaveBeenCalledWith('texto6');
  });

  it('should call actualizarTextoGenerico7 with input value', () => {
    const event = { target: { value: 'texto7' } } as any;
    component.actualizarTextoGenerico7(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico7
    ).toHaveBeenCalledWith('texto7');
  });

  it('should call actualizar3530', () => {
    component.actualizar3530(66666);
    expect(mockSolicitud31101Store.actualizar3530).toHaveBeenCalledWith(66666);
    component.actualizar3530('klmn');
    expect(mockSolicitud31101Store.actualizar3530).toHaveBeenCalledWith('klmn');
  });

  it('should call actualizar3531', () => {
    component.actualizar3531(77777);
    expect(mockSolicitud31101Store.actualizar3531).toHaveBeenCalledWith(77777);
    component.actualizar3531('opqr');
    expect(mockSolicitud31101Store.actualizar3531).toHaveBeenCalledWith('opqr');
  });

  it('should call actualizarTextoGenerico9 with input value', () => {
    const event = { target: { value: 'texto9' } } as any;
    component.actualizarTextoGenerico9(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico9
    ).toHaveBeenCalledWith('texto9');
  });

  it('should call actualizarTextoGenerico10 and calcularValorComercial', () => {
    const calcularValorComercialSpy = jest
      .spyOn(component, 'calcularValorComercial')
      .mockImplementation(() => {});
    const event = { target: { value: 'texto10' } } as any;
    component.actualizarTextoGenerico10(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico10
    ).toHaveBeenCalledWith('texto10');
    expect(calcularValorComercialSpy).toHaveBeenCalled();
  });

  it('should call actualizarTextoGenerico11 and calcularValorAduana', () => {
    const calcularValorAduanaSpy = jest
      .spyOn(component, 'calcularValorAduana')
      .mockImplementation(() => {});
    const event = { target: { value: 'texto11' } } as any;
    component.actualizarTextoGenerico11(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico11
    ).toHaveBeenCalledWith('texto11');
    expect(calcularValorAduanaSpy).toHaveBeenCalled();
  });

  it('should call actualizarTextoGenerico12 and calcularValorPorcentaje', () => {
    const calcularValorPorcentajeSpy = jest
      .spyOn(component, 'calcularValorPorcentaje')
      .mockImplementation(() => {});
    const event = { target: { value: 'texto12' } } as any;
    component.actualizarTextoGenerico12(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico12
    ).toHaveBeenCalledWith('texto12');
    expect(calcularValorPorcentajeSpy).toHaveBeenCalled();
  });

  it('should call actualizarTextoGenerico13 and calcularValorComercial', () => {
    const calcularValorComercialSpy = jest
      .spyOn(component, 'calcularValorComercial')
      .mockImplementation(() => {});
    const event = { target: { value: 'texto13' } } as any;
    component.actualizarTextoGenerico13(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico13
    ).toHaveBeenCalledWith('texto13');
    expect(calcularValorComercialSpy).toHaveBeenCalled();
  });

  it('should call actualizarTextoGenerico14 and calcularValorAduana', () => {
    const calcularValorAduanaSpy = jest
      .spyOn(component, 'calcularValorAduana')
      .mockImplementation(() => {});
    const event = { target: { value: 'texto14' } } as any;
    component.actualizarTextoGenerico14(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico14
    ).toHaveBeenCalledWith('texto14');
    expect(calcularValorAduanaSpy).toHaveBeenCalled();
  });

  it('should call actualizarTextoGenerico15 and calcularValorPorcentaje', () => {
    const calcularValorPorcentajeSpy = jest
      .spyOn(component, 'calcularValorPorcentaje')
      .mockImplementation(() => {});
    const event = { target: { value: 'texto15' } } as any;
    component.actualizarTextoGenerico15(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico15
    ).toHaveBeenCalledWith('texto15');
    expect(calcularValorPorcentajeSpy).toHaveBeenCalled();
  });

  it('should call actualizarTextoGenerico16 and calcularValorComercial', () => {
    const calcularValorComercialSpy = jest
      .spyOn(component, 'calcularValorComercial')
      .mockImplementation(() => {});
    const event = { target: { value: 'texto16' } } as any;
    component.actualizarTextoGenerico16(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico16
    ).toHaveBeenCalledWith('texto16');
    expect(calcularValorComercialSpy).toHaveBeenCalled();
  });

  it('should call actualizarTextoGenerico17 and calcularValorAduana', () => {
    const calcularValorAduanaSpy = jest
      .spyOn(component, 'calcularValorAduana')
      .mockImplementation(() => {});
    const event = { target: { value: 'texto17' } } as any;
    component.actualizarTextoGenerico17(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico17
    ).toHaveBeenCalledWith('texto17');
    expect(calcularValorAduanaSpy).toHaveBeenCalled();
  });

  it('should call actualizarTextoGenerico18 and calcularValorPorcentaje', () => {
    const calcularValorPorcentajeSpy = jest
      .spyOn(component, 'calcularValorPorcentaje')
      .mockImplementation(() => {});
    const event = { target: { value: 'texto18' } } as any;
    component.actualizarTextoGenerico18(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico18
    ).toHaveBeenCalledWith('texto18');
    expect(calcularValorPorcentajeSpy).toHaveBeenCalled();
  });

  it('should call actualizarTextoGenerico19 and calcularValorComercial', () => {
    const calcularValorComercialSpy = jest
      .spyOn(component, 'calcularValorComercial')
      .mockImplementation(() => {});
    const event = { target: { value: 'texto19' } } as any;
    component.actualizarTextoGenerico19(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico19
    ).toHaveBeenCalledWith('texto19');
    expect(calcularValorComercialSpy).toHaveBeenCalled();
  });

  it('should call actualizarTextoGenerico20 and calcularValorAduana', () => {
    const calcularValorAduanaSpy = jest
      .spyOn(component, 'calcularValorAduana')
      .mockImplementation(() => {});
    const event = { target: { value: 'texto20' } } as any;
    component.actualizarTextoGenerico20(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico20
    ).toHaveBeenCalledWith('texto20');
    expect(calcularValorAduanaSpy).toHaveBeenCalled();
  });

  it('should call actualizarTextoGenerico21 and calcularValorPorcentaje', () => {
    const calcularValorPorcentajeSpy = jest
      .spyOn(component, 'calcularValorPorcentaje')
      .mockImplementation(() => {});
    const event = { target: { value: 'texto21' } } as any;
    component.actualizarTextoGenerico21(event);
    expect(
      mockSolicitud31101Store.actualizarTextoGenerico21
    ).toHaveBeenCalledWith('texto21');
    expect(calcularValorPorcentajeSpy).toHaveBeenCalled();
  });

  it('should add the member to listaSeccionSociosIC, open modal, and add a pedimento on eventoActualizarMiembro', () => {
    const evento = { rfc: 'RFCMEMBER' } as any;
    component.listaSeccionSociosIC = [];
    component.pedimentos = [];
    const abrirModalSpy = jest.spyOn(component, 'abrirModal');
    component.eventoActualizarMiembro(evento);
    expect(component.listaSeccionSociosIC).toContain(evento);
    expect(abrirModalSpy).toHaveBeenCalledWith('Datos guardados correctamente.');
    expect(component.pedimentos.length).toBe(1);
    expect(component.pedimentos[0].descTipoPedimento).toBe('Por evaluar');
  });

  it('should add domicilio to domiciliosDatos and set id if not present, then hide modal if instance exists', () => {
    const evento = { id: undefined, nombre: 'Domicilio Test' } as any;
    component.domiciliosDatos = [];
    component.MODAL_INSTANCE_AGREGAR_IMMEX = { hide: jest.fn() } as any;
    component.agregarImmexValor(evento);
    expect(component.domiciliosDatos.length).toBe(1);
    expect(component.domiciliosDatos[0].id).toBe(1);
    expect(component.MODAL_INSTANCE_AGREGAR_IMMEX.hide).toHaveBeenCalled();
  });

  it('should not add domicilio if id exists, but should still hide modal if instance exists', () => {
    const evento = { id: 5, nombre: 'Domicilio Existente' } as any;
    component.domiciliosDatos = [{ id: 1, nombre: 'Otro' }] as any;
    component.MODAL_INSTANCE_AGREGAR_IMMEX = { hide: jest.fn() } as any;
    component.agregarImmexValor(evento);
    expect(component.domiciliosDatos.length).toBe(1);
    expect(component.MODAL_INSTANCE_AGREGAR_IMMEX.hide).toHaveBeenCalled();
  });

  it('should not throw if MODAL_INSTANCE_AGREGAR_IMMEX is undefined', () => {
    const evento = { id: undefined, nombre: 'Domicilio Sin Modal' } as any;
    component.domiciliosDatos = [];
    component.MODAL_INSTANCE_AGREGAR_IMMEX = undefined as any;
    expect(() => component.agregarImmexValor(evento)).not.toThrow();
    expect(component.domiciliosDatos.length).toBe(1);
    expect(component.domiciliosDatos[0].id).toBe(1);
  });

  it('should remove the selected tipoDeInversionDatos and clear tipoSeleccionListo and open modal on confirmaPedimento(true)', () => {
    const abrirModalSpy = jest.spyOn(component, 'abrirModal');
    component.tipoDeInversionDatos = [
      { idRegistro: 1, desc: 'A' } as any,
      { idRegistro: 2, desc: 'B' } as any,
    ];
    component.tipoSeleccionListo = [{ idRegistro: 1 }] as any;
    component.confirmaPedimento(true);
    expect(component.tipoDeInversionDatos).toEqual([{ idRegistro: 2, desc: 'B' }]);
    expect(component.tipoSeleccionListo).toEqual([]);
    expect(abrirModalSpy).toHaveBeenCalledWith(
      'El registro seleccionado fue eliminado correctamente',
      0
    );
  });

  it('should do nothing on confirmaPedimento(true) if tipoSeleccionListo is empty', () => {
    const abrirModalSpy = jest.spyOn(component, 'abrirModal');
    component.tipoDeInversionDatos = [
      { idRegistro: 1, desc: 'A' } as any,
      { idRegistro: 2, desc: 'B' } as any,
    ];
    component.tipoSeleccionListo = [];
    component.confirmaPedimento(true);
    expect(component.tipoDeInversionDatos.length).toBe(2);
    expect(abrirModalSpy).not.toHaveBeenCalled();
  });

  it('should do nothing on confirmaPedimento(false)', () => {
    const abrirModalSpy = jest.spyOn(component, 'abrirModal');
    component.tipoDeInversionDatos = [
      { idRegistro: 1, desc: 'A' } as any,
      { idRegistro: 2, desc: 'B' } as any,
    ];
    component.tipoSeleccionListo = [{ idRegistro: 1 }] as any;
    component.confirmaPedimento(false);
    expect(component.tipoDeInversionDatos.length).toBe(2);
    expect(component.tipoSeleccionListo.length).toBe(1);
    expect(abrirModalSpy).not.toHaveBeenCalled();
  });

  it('should remove domicilio and add pedimento and set eliminadosCorrectamenteNotificacion on eliminarPedimentoImmexNotificacion(true) with idRecinto', () => {
    component.seleccionarDomiciliosDatos = [{ id: 1, idRecinto: 123 }] as any;
    component.domiciliosDatos = [{ id: 1, idRecinto: 123 }, { id: 2 }] as any;
    component.pedimentos = [];
    component.elementoParaEliminar = 0;
    component.eliminadosCorrectamenteNotificacion = undefined as any;
    component.eliminarPedimentoImmexNotificacion(true);
    expect(component.domiciliosDatos).toEqual([{ id: 2 }]);
    expect(component.pedimentos.length).toBe(0);
    expect(component.eliminadosCorrectamenteNotificacion).toBeDefined();
    expect(component.seleccionarDomiciliosDatos).toEqual([]);
  });

  it('should just clear seleccionarDomiciliosDatos and remove pedimento if no idRecinto on eliminarPedimentoImmexNotificacion(true)', () => {
    component.seleccionarDomiciliosDatos = [{ id: 1 }] as any;
    component.domiciliosDatos = [{ id: 1 }, { id: 2 }] as any;
    component.pedimentos = [{}, {}] as any;
    component.elementoParaEliminar = 1;
    component.eliminarPedimentoImmexNotificacion(true);
    expect(component.domiciliosDatos.length).toBe(2);
    expect(component.seleccionarDomiciliosDatos).toEqual([]);
    expect(component.pedimentos.length).toBe(1);
  });

  it('should do nothing on eliminarPedimentoImmexNotificacion(false)', () => {
    component.seleccionarDomiciliosDatos = [{ id: 1, idRecinto: 123 }] as any;
    component.domiciliosDatos = [{ id: 1, idRecinto: 123 }, { id: 2 }] as any;
    component.pedimentos = [{}, {}] as any;
    component.elementoParaEliminar = 1;
    component.eliminarPedimentoImmexNotificacion(false);
    expect(component.domiciliosDatos.length).toBe(2);
    expect(component.pedimentos.length).toBe(2);
  });

  it('should remove pedimento at elementoParaEliminar on eliminarCorrectamenteImmexNotificacion(true)', () => {
    component.pedimentos = [{ a: 1 }, { a: 2 }, { a: 3 }] as any;
    component.elementoParaEliminar = 1;
    component.eliminarCorrectamenteImmexNotificacion(true);
    expect(component.pedimentos).toEqual([{ a: 1 }, { a: 3 }]);
  });

  it('should do nothing on eliminarCorrectamenteImmexNotificacion(false)', () => {
    component.pedimentos = [{ a: 1 }, { a: 2 }, { a: 3 }] as any;
    component.elementoParaEliminar = 1;
    component.eliminarCorrectamenteImmexNotificacion(false);
    expect(component.pedimentos).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
  });

  it('should not throw if agregarMiembrosEmpresa called and modalElement is undefined', () => {
    component.modalElement = undefined as any;
    expect(() => component.agregarMiembrosEmpresa()).not.toThrow();
  });


  it('should not show modificarImmexProgram modal if seleccionarDomiciliosDatos.length !== 1', () => {
    const showMock = jest.fn();
    component.seleccionarDomiciliosDatos = [] as any;
    component.modificarImmexProgramElement = { nativeElement: {} } as any;
    global.Modal = function (el: any) { return { show: showMock }; };
    component.modificarImmexProgramModel();
    expect(showMock).not.toHaveBeenCalled();
  });

  it('should add pedimento and set eliminarImmexNotificacion with SE message if no idRecinto on eliminarImmexProgram', () => {
    component.seleccionarDomiciliosDatos = [{ id: 1 }] as any;
    component.pedimentos = [];
    component.eliminarImmexProgram();
    expect(component.eliminarImmexNotificacion).toBeDefined();
    expect(component.eliminarImmexNotificacion.mensaje).toBe('No puede eliminar domicilios de la SE.');
    expect(component.pedimentos.length).toBe(1);
    expect(component.inputSelection).toBe(-1);
  });

  it('should add pedimento and set eliminarImmexNotificacion with confirm message if idRecinto on eliminarImmexProgram', () => {
    component.seleccionarDomiciliosDatos = [{ id: 1, idRecinto: 123 }] as any;
    component.pedimentos = [];
    component.eliminarImmexProgram();
    expect(component.eliminarImmexNotificacion).toBeDefined();
    expect(component.eliminarImmexNotificacion.mensaje).toBe('¿Desea eliminar el registro seleccionado?');
    expect(component.pedimentos.length).toBe(1);
    expect(component.inputSelection).toBe(-1);
  });

  it('should do nothing if seleccionarDomiciliosDatos is empty on eliminarImmexProgram', () => {
    component.seleccionarDomiciliosDatos = [] as any;
    component.pedimentos = [];
    component.eliminarImmexProgram();
    expect(component.pedimentos.length).toBe(0);
  });
});
