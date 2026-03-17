import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControladoraComponent } from './controladora.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ConsultaioQuery, ConsultaioState } from '@libs/shared/data-access-user/src';
import { EconomicoService } from '../../services/economico.service';
import { Tramite32606Query } from '../../state/Tramite32606.query';
import { Solicitud32606State, Tramite32606Store } from '../../state/Tramite32606.store';
import { BehaviorSubject, ReplaySubject, of } from 'rxjs';

describe('ControladoraComponent', () => {
  let component: ControladoraComponent;
  let fixture: ComponentFixture<ControladoraComponent>;
  let mockEconomicoService: jest.Mocked<EconomicoService>;
  let mockTramite32606Query: jest.Mocked<Tramite32606Query>;
  let mockTramite32606Store: jest.Mocked<Tramite32606Store>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let selectConsultaioState$: BehaviorSubject<ConsultaioState>;
  let selectSolicitud$: BehaviorSubject<Solicitud32606State>;
  let fb: FormBuilder;

  const mockConsultaioState: ConsultaioState = {
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

  const mockSolicitudState: Solicitud32606State = {
    tipoRadio21: 'si',
    tipoRadio22: 'no',
    tipoRadio23: 'si',
    monto: '1000',
    operacionesBancarias: 'OP123',
    llavePago: 'KEY123',
    modalidad: 'Modalidad1',
    fechaRegistro: '2023-01-01',
    numeroAutorizacion: 'AUTH123',
    radioAutorizo: 'SI',
    radioClasificacion: 'publica',
    tipoRadio01: '', tipoRadio02: '', tipoRadio03: '', tipoRadio04: '', tipoRadio05: '', tipoRadio06: '', tipoRadio07: '', tipoRadio08: '', tipoRadio09: '', tipoRadio10: '', tipoRadio11: '', tipoRadio12: '', tipoRadio13: '', tipoRadio14: '', tipoRadio15: '', tipoRadio16: '', tipoRadio17: '', tipoRadio18: '', tipoRadio19: '', tipoRadio20: '', tipoRadio24: '', tipoRadio25: '', tipoRadio26: '', tipoRadio27: '', tipoRadio28: '', tipoRadio29: '', tipoRadio30: '', tipoRadio31: '', tipoRadio32: '', tipoRadio33: '', tipoRadio34: '', sectorProductivo: '', servicio: '', domicilio: '', biomestre: '', numeroEmpleados: '', domicillio: '', file1: '', file2: '', actualmente: '', actualmente2: '', sistemaIdentificacion: '', lugarRadicacion: '', sistemaControlInventarios: false, rfcTercero: '', rfc: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '', telefono: '', correoElectronico: '', caracter: '', nacionalidad: '', fechaInicio: '', fechaPago: '', entidadFederativa: '', municipio: '', tipoDeInstalacion: '', registroSESAT: '', descripcion: '', codigoPostal: ''
  };

  beforeEach(async () => {
    mockEconomicoService = {} as jest.Mocked<EconomicoService>;
    mockTramite32606Store = {
      setFechaInicio: jest.fn(),
      setFechaPago: jest.fn(),
      setTipoRadio21: jest.fn(),
      setTipoRadio22: jest.fn(),
      setTipoRadio23: jest.fn(),
      setMonto: jest.fn(),
      setOperacionesBancarias: jest.fn(),
      setLlavePago: jest.fn(),
      setModalidad: jest.fn(),
      setFechaRegistro: jest.fn(),
      setNumeroAutorizacion: jest.fn(),
      setRadioAutorizo: jest.fn(),
      setRadioClasificacion: jest.fn()
    } as unknown as jest.Mocked<Tramite32606Store>;
    selectConsultaioState$ = new BehaviorSubject<ConsultaioState>(mockConsultaioState);
    selectSolicitud$ = new BehaviorSubject<Solicitud32606State>(mockSolicitudState);
    mockTramite32606Query = {
      selectSolicitud$: selectSolicitud$.asObservable()
    } as unknown as jest.Mocked<Tramite32606Query>;
    mockConsultaioQuery = {
      selectConsultaioState$: selectConsultaioState$.asObservable()
    } as unknown as jest.Mocked<ConsultaioQuery>;
    fb = new FormBuilder();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ControladoraComponent],
      providers: [
        { provide: EconomicoService, useValue: mockEconomicoService },
        { provide: Tramite32606Query, useValue: mockTramite32606Query },
        { provide: Tramite32606Store, useValue: mockTramite32606Store },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: FormBuilder, useValue: fb }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ControladoraComponent);
    component = fixture.componentInstance;
    component.solicitudState = mockSolicitudState;
    fixture.detectChanges();
  });

  it('crea el componente', () => {
    expect(component).toBeTruthy();
  });

  it('inicializa solicitudState desde query.selectSolicitud$', () => {
    expect(component.solicitudState).toEqual(mockSolicitudState);

    const updatedState = { ...mockSolicitudState, monto: '2000' };
    selectSolicitud$.next(updatedState);
    expect(component.solicitudState.monto).toBe('2000');
  });

  it('inicializarEstadoFormulario llama guardarDatosFormulario si soloLectura', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('inicializarEstadoFormulario llama donanteDomicilio si no soloLectura', () => {
    const spy = jest.spyOn(component, 'donanteDomicilio');
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('guardarDatosFormulario deshabilita el formulario si soloLectura', () => {
    component.soloLectura = true;
    component.donanteDomicilio();
    const spy = jest.spyOn(component.controladoraForm, 'disable');
    component.guardarDatosFormulario();
  });

  it('guardarDatosFormulario habilita el formulario si no soloLectura', () => {
    component.soloLectura = false;
    component.donanteDomicilio();
    const spy = jest.spyOn(component.controladoraForm, 'enable');
    component.guardarDatosFormulario();
  });

  it('cambioFechaInicio actualiza el valor y llama setValoresStore', () => {
    component.donanteDomicilio();
    const spy = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaInicio('2023-05-15');
    expect(spy).toHaveBeenCalledWith(component.controladoraForm, 'fechaInicio', 'setFechaInicio');
  });

  it('cambioFechaPago actualiza el valor y llama setValoresStore', () => {
    component.donanteDomicilio();
    const spy = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaPago('2023-06-20');
    expect(spy).toHaveBeenCalledWith(component.controladoraForm, 'fechaInicio', 'setFechaPago');
  });

  it('validarDestinatarioFormulario marca todos como tocados si inválido', () => {
    component.donanteDomicilio();
    component.controladoraForm.setErrors({ invalid: true });
    const spy = jest.spyOn(component.controladoraForm, 'markAllAsTouched');
    component.validarDestinatarioFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('validarDestinatarioFormulario no marca como tocados si válido', () => {
    component.donanteDomicilio();
    component.controladoraForm.setErrors(null);
    const spy = jest.spyOn(component.controladoraForm, 'markAllAsTouched');
    component.validarDestinatarioFormulario();
    expect(spy).not.toHaveBeenCalled();
  });

  it('setValoresStore llama el método correcto del store con el valor', () => {
    component.donanteDomicilio();
    component.controladoraForm.get('monto')?.setValue('5000');
    component.setValoresStore(component.controladoraForm, 'monto', 'setMonto');
    expect(mockTramite32606Store.setMonto).toHaveBeenCalledWith('5000');
  });

  it('setValoresStore maneja valores nulos', () => {
    component.donanteDomicilio();
    component.setValoresStore(component.controladoraForm, 'noExiste', 'setMonto');
    expect(mockTramite32606Store.setMonto).toHaveBeenCalledWith(undefined);
  });

  it('donanteDomicilio inicializa el formulario con valores de solicitudState', () => {
    component.solicitudState = mockSolicitudState;
    component.soloLectura = false;
    component.donanteDomicilio();
    expect(component.controladoraForm.get('tipoRadio21')?.value).toBe('si');
    expect(component.controladoraForm.get('monto')?.value).toBe('1000');
  });

  it('donanteDomicilio deshabilita los campos si soloLectura', () => {
    component.solicitudState = mockSolicitudState;
    component.soloLectura = true;
    component.donanteDomicilio();
    expect(component.controladoraForm.get('tipoRadio21')?.disabled).toBe(true);
    expect(component.controladoraForm.get('monto')?.disabled).toBe(true);
  });

  it('ngOnDestroy completa destroyed$', () => {
    const spyNext = jest.spyOn(component['destroyed$'], 'next');
    const spyComplete = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalledWith(true);
    expect(spyComplete).toHaveBeenCalled();
  });
});