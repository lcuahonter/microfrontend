import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComunesComponent } from './datos-comunes.component';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { EconomicoService } from '../../services/economico.service';
import { Tramite32606Query } from '../../state/Tramite32606.query';
import { Tramite32606Store, Solicitud32606State } from '../../state/Tramite32606.store';
import { ValidacionesFormularioService, ConsultaioQuery, ConsultaioState } from '@libs/shared/data-access-user/src';
import { BehaviorSubject, of } from 'rxjs';

describe('DatosComunesComponent', () => {
  let component: DatosComunesComponent;
  let fixture: ComponentFixture<DatosComunesComponent>;
  let mockEconomicoService: jest.Mocked<EconomicoService>;
  let mockTramite32606Query: jest.Mocked<Tramite32606Query>;
  let mockTramite32606Store: jest.Mocked<Tramite32606Store>;
  let mockValidacionesService: jest.Mocked<ValidacionesFormularioService>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let selectConsultaioState$: BehaviorSubject<ConsultaioState>;
  let selectSolicitud$: BehaviorSubject<Solicitud32606State>;
  let fb: FormBuilder;

  const consultaioState: ConsultaioState = {
    procedureId: '',
    parameter: '',
    department: '',
    folioTramite: '',
    tipoDeTramite: '',
    estadoDeTramite: '',
    readonly: false,
    create: true,
    update: false,
    consultaioSolicitante: null
  };
  const solicitudState: Solicitud32606State = {
    sectorProductivo: 'sector',
    servicio: 'servicio',
    tipoRadio01: 'si',
    tipoRadio02: 'no',
    tipoRadio03: 'si',
    tipoRadio04: 'no',
    tipoRadio05: 'si',
    tipoRadio06: 'no',
    tipoRadio07: 'si',
    tipoRadio08: 'no',
    tipoRadio09: 'si',
    tipoRadio10: 'no',
    tipoRadio11: 'si',
    domicilio: 'domicilio',
    biomestre: 'biomestre',
    numeroEmpleados: '10',
    tipoRadio12: '', tipoRadio13: '', tipoRadio14: '', tipoRadio15: '', tipoRadio16: '', tipoRadio17: '', tipoRadio18: '', tipoRadio19: '', tipoRadio20: '', tipoRadio21: '', tipoRadio22: '', tipoRadio23: '', tipoRadio24: '', tipoRadio25: '', tipoRadio26: '', tipoRadio27: '', tipoRadio28: '', tipoRadio29: '', tipoRadio30: '', tipoRadio31: '', tipoRadio32: '', tipoRadio33: '', tipoRadio34: '', domicillio: '', file1: '', file2: '', actualmente: '', actualmente2: '', sistemaIdentificacion: '', lugarRadicacion: '', sistemaControlInventarios: false, rfcTercero: '', rfc: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '', telefono: '', correoElectronico: '', monto: '', operacionesBancarias: '', llavePago: '', modalidad: '', fechaRegistro: '', numeroAutorizacion: '', radioAutorizo: '', radioClasificacion: '', caracter: '', nacionalidad: '', fechaInicio: '', fechaPago: '', entidadFederativa: '', municipio: '', tipoDeInstalacion: '', registroSESAT: '', descripcion: '', codigoPostal: ''
  };

  beforeEach(async () => {
    mockEconomicoService = {
      obtenerSectorProductivo: jest.fn().mockReturnValue(of([])),
      obtenerServicio: jest.fn().mockReturnValue(of([])),
      obtenerBimestre: jest.fn().mockReturnValue(of([])),
      obtenerDomicillio: jest.fn().mockReturnValue(of([])),
      obtenerEntidad: jest.fn().mockReturnValue(of([])),
      obtenerTablaEntidad: jest.fn().mockReturnValue(of([])),
      obtenerTablaDomicillio: jest.fn().mockReturnValue(of([])),
      obtenerTablaQuerella: jest.fn().mockReturnValue(of([])),
      obtenerCaracter: jest.fn().mockReturnValue(of([])),
      obtenerNacionalidad: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<EconomicoService>;
    mockTramite32606Query = {
      selectSolicitud$: new BehaviorSubject<Solicitud32606State>(solicitudState).asObservable()
    } as unknown as jest.Mocked<Tramite32606Query>;
    mockTramite32606Store = {
      setSectorProductivo: jest.fn(),
      setServicio: jest.fn()
    } as unknown as jest.Mocked<Tramite32606Store>;
    mockValidacionesService = {
      isValid: jest.fn()
    } as unknown as jest.Mocked<ValidacionesFormularioService>;
    selectConsultaioState$ = new BehaviorSubject<ConsultaioState>(consultaioState);
    mockConsultaioQuery = {
      selectConsultaioState$: selectConsultaioState$.asObservable()
    } as unknown as jest.Mocked<ConsultaioQuery>;
    fb = new FormBuilder();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosComunesComponent],
      providers: [
        { provide: EconomicoService, useValue: mockEconomicoService },
        { provide: Tramite32606Query, useValue: mockTramite32606Query },
        { provide: Tramite32606Store, useValue: mockTramite32606Store },
        { provide: ValidacionesFormularioService, useValue: mockValidacionesService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: FormBuilder, useValue: fb }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComunesComponent);
    component = fixture.componentInstance;
    component.solicitudState = solicitudState;
    fixture.detectChanges();
  });

  it('crea el componente', () => {
    expect(component).toBeTruthy();
  });

  it('inicializa el formulario con valores', () => {
    component.donanteDomicilio();
    expect(component.datosComunesForm.get('sectorProductivo')?.value).toBe('sector');
    expect(component.datosComunesForm.get('servicio')?.value).toBe('servicio');
    expect(component.datosComunesForm.get('tipoRadio01')?.value).toBe('si');
  });

  it('inicializarEstadoFormulario llama guardarDatosFormulario si soloLectura', () => {
    jest.spyOn(component, 'guardarDatosFormulario');
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('inicializarEstadoFormulario llama donanteDomicilio si no soloLectura', () => {
    jest.spyOn(component, 'donanteDomicilio');
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.donanteDomicilio).toHaveBeenCalled();
  });

  it('cambiarRadio actualiza valorSeleccionado y llama abrirModal si valor es "si"', () => {
    jest.spyOn(component, 'abrirModal');
    component.cambiarRadio('si');
    expect(component.valorSeleccionado).toBe('si');
    expect(component.abrirModal).toHaveBeenCalled();
  });

  it('cambiarRadio actualiza valorSeleccionado y no llama abrirModal si valor no es "si"', () => {
    jest.spyOn(component, 'abrirModal');
    component.cambiarRadio('no');
    expect(component.valorSeleccionado).toBe('no');
    expect(component.abrirModal).not.toHaveBeenCalled();
  });

  it('cambiarRadio2 actualiza valorSeleccionado y llama abrirModal si valor es "no"', () => {
    jest.spyOn(component, 'abrirModal');
    component.cambiarRadio2('no');
    expect(component.valorSeleccionado).toBe('no');
    expect(component.abrirModal).toHaveBeenCalled();
  });

  it('cambiarRadio2 actualiza valorSeleccionado y no llama abrirModal si valor no es "no"', () => {
    jest.spyOn(component, 'abrirModal');
    component.cambiarRadio2('si');
    expect(component.valorSeleccionado).toBe('si');
    expect(component.abrirModal).not.toHaveBeenCalled();
  });

  it('obtenerSectorProductivo actualiza catalogos', () => {
    const resp = [{ id: 1, descripcion: 'A' }];
    mockEconomicoService.obtenerSectorProductivo.mockReturnValue(of(resp));
    component.obtenerSectorProductivo();
    expect(component.sectorProductivo.catalogos).toEqual(resp);
  });

  it('obtenerServicio actualiza catalogos', () => {
    const resp = [{ id: 2, descripcion: 'B' }];
    mockEconomicoService.obtenerServicio.mockReturnValue(of(resp));
    component.obtenerServicio();
    expect(component.servicioCatalogo.catalogos).toEqual(resp);
  });

  it('obtenerBimestre actualiza catalogos', () => {
    const resp = [{ id: 3, descripcion: 'C' }];
    mockEconomicoService.obtenerBimestre.mockReturnValue(of(resp));
    component.obtenerBimestre();
    expect(component.biomestreCatalogo.catalogos).toEqual(resp);
  });

  it('eliminarPedimento elimina elemento si borrar es true', () => {
    component.pedimentos = [{}, {}, {}] as any;
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(true);
    expect(component.pedimentos.length).toBe(2);
  });

  it('eliminarPedimento no elimina si borrar es false', () => {
    component.pedimentos = [{}, {}, {}] as any;
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(false);
    expect(component.pedimentos.length).toBe(3);
  });

  it('abrirModal actualiza nuevaNotificacion y elementoParaEliminar', () => {
    component.abrirModal(5);
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.elementoParaEliminar).toBe(5);
  });

  it('eliminarPedimento2 elimina elemento si borrar es true', () => {
    component.pedimentos = [{}, {}, {}] as any;
    component.elementoParaEliminar = 0;
    component.eliminarPedimento2(true);
    expect(component.pedimentos.length).toBe(2);
  });

  it('eliminarPedimento2 no elimina si borrar es false', () => {
    component.pedimentos = [{}, {}, {}] as any;
    component.elementoParaEliminar = 0;
    component.eliminarPedimento2(false);
    expect(component.pedimentos.length).toBe(3);
  });

  it('isValid retorna true si validacionesService.isValid retorna true', () => {
    mockValidacionesService.isValid.mockReturnValue(true);
    const form = new FormGroup({});
    expect(component.isValid(form, 'campo')).toBe(true);
  });

  it('isValid retorna false si validacionesService.isValid retorna false', () => {
    mockValidacionesService.isValid.mockReturnValue(false);
    const form = new FormGroup({});
    expect(component.isValid(form, 'campo')).toBe(false);
  });

  it('validarDestinatarioFormulario marca todos como tocados si inválido', () => {
    component.donanteDomicilio();
    component.datosComunesForm.setErrors({ invalid: true });
    jest.spyOn(component.datosComunesForm, 'markAllAsTouched');
    component.validarDestinatarioFormulario();
    expect(component.datosComunesForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('validarDestinatarioFormulario no marca como tocados si válido', () => {
    component.donanteDomicilio();
    component.datosComunesForm.setErrors(null);
    jest.spyOn(component.datosComunesForm, 'markAllAsTouched');
    component.validarDestinatarioFormulario();
    expect(component.datosComunesForm.markAllAsTouched).not.toHaveBeenCalled();
  });

  it('setValoresStore llama al método correcto del store', () => {
    component.donanteDomicilio();
    component.datosComunesForm.get('sectorProductivo')?.setValue('nuevo');
    component.setValoresStore(component.datosComunesForm, 'sectorProductivo', 'setSectorProductivo');
    expect(mockTramite32606Store.setSectorProductivo).toHaveBeenCalledWith('nuevo');
  });

  it('setValoresStore maneja valores nulos', () => {
    component.donanteDomicilio();
    component.setValoresStore(component.datosComunesForm, 'noExiste', 'setSectorProductivo');
    expect(mockTramite32606Store.setSectorProductivo).toHaveBeenCalledWith(undefined);
  });

  it('ngOnDestroy completa destroyed$', () => {
    jest.spyOn(component['destroyed$'], 'next');
    jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(component['destroyed$'].next).toHaveBeenCalledWith(true);
    expect(component['destroyed$'].complete).toHaveBeenCalled();
  });
});