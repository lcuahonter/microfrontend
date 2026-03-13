import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacinadosComponent } from './terceros-relacinados.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tramite32606Query } from '../../state/Tramite32606.query';
import { Tramite32606Store, Solicitud32606State } from '../../state/Tramite32606.store';
import { EconomicoService } from '../../services/economico.service';
import { ConsultaioQuery, ConsultaioState } from '@libs/shared/data-access-user/src';
import { ReplaySubject, BehaviorSubject } from 'rxjs';

describe('TercerosRelacinadosComponent', () => {
  let component: TercerosRelacinadosComponent;
  let fixture: ComponentFixture<TercerosRelacinadosComponent>;
  let mockEconomicoService: jest.Mocked<EconomicoService>;
  let mockTramite32606Query: jest.Mocked<Tramite32606Query>;
  let mockTramite32606Store: jest.Mocked<Tramite32606Store>;
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
    rfcTercero: 'RFC123',
    rfc: 'RFC456',
    nombre: 'Juan',
    apellidoPaterno: 'Pérez',
    apellidoMaterno: 'Gómez',
    telefono: '5555555555',
    correoElectronico: 'juan@mail.com',
    tipoRadio01: '', tipoRadio02: '', tipoRadio03: '', tipoRadio04: '', tipoRadio05: '', tipoRadio06: '', tipoRadio07: '', tipoRadio08: '', tipoRadio09: '', tipoRadio10: '', tipoRadio11: '', tipoRadio12: '', tipoRadio13: '', tipoRadio14: '', tipoRadio15: '', tipoRadio16: '', tipoRadio17: '', tipoRadio18: '', tipoRadio19: '', tipoRadio20: '', tipoRadio21: '', tipoRadio22: '', tipoRadio23: '', tipoRadio24: '', tipoRadio25: '', tipoRadio26: '', tipoRadio27: '', tipoRadio28: '', tipoRadio29: '', tipoRadio30: '', tipoRadio31: '', tipoRadio32: '', tipoRadio33: '', tipoRadio34: '', sectorProductivo: '', servicio: '', domicilio: '', biomestre: '', numeroEmpleados: '', domicillio: '', file1: '', file2: '', actualmente: '', actualmente2: '', sistemaIdentificacion: '', lugarRadicacion: '', sistemaControlInventarios: false, monto: '', operacionesBancarias: '', llavePago: '', modalidad: '', fechaRegistro: '', numeroAutorizacion: '', radioAutorizo: '', radioClasificacion: '', caracter: '', nacionalidad: '', fechaInicio: '', fechaPago: '', entidadFederativa: '', municipio: '', tipoDeInstalacion: '', registroSESAT: '', descripcion: '', codigoPostal: ''
  };

  beforeEach(async () => {
    mockEconomicoService = {} as jest.Mocked<EconomicoService>;
    mockTramite32606Query = {
      selectSolicitud$: new BehaviorSubject<Solicitud32606State>(solicitudState).asObservable()
    } as unknown as jest.Mocked<Tramite32606Query>;
    mockTramite32606Store = {
      setRfcTercero: jest.fn(),
      setRfc: jest.fn(),
      setNombre: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setApellidoMaterno: jest.fn(),
      setTelefono: jest.fn(),
      setCorreoElectronico: jest.fn()
    } as unknown as jest.Mocked<Tramite32606Store>;
    selectConsultaioState$ = new BehaviorSubject<ConsultaioState>(consultaioState);
    mockConsultaioQuery = {
      selectConsultaioState$: selectConsultaioState$.asObservable()
    } as unknown as jest.Mocked<ConsultaioQuery>;
    fb = new FormBuilder();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TercerosRelacinadosComponent],
      providers: [
        { provide: EconomicoService, useValue: mockEconomicoService },
        { provide: Tramite32606Query, useValue: mockTramite32606Query },
        { provide: Tramite32606Store, useValue: mockTramite32606Store },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: FormBuilder, useValue: fb }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacinadosComponent);
    component = fixture.componentInstance;
    component.solicitudState = solicitudState;
    fixture.detectChanges();
  });

  it('crea el componente', () => {
    expect(component).toBeTruthy();
  });

  it('donanteDomicilio inicializa el formulario', () => {
    component.solicitudState = solicitudState;
    component.soloLectura = false;
    component.donanteDomicilio();
    expect(component.tercerosRelacionadosForm.get('rfcTercero')?.value).toBe('RFC123');
    expect(component.tercerosRelacionadosForm.get('rfc')?.value).toBe('RFC456');
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
    component.donanteDomicilio();
    component.soloLectura = true;
    const spy = jest.spyOn(component.tercerosRelacionadosForm, 'disable');
    component.guardarDatosFormulario();
  });

  it('guardarDatosFormulario habilita el formulario si no soloLectura', () => {
    component.donanteDomicilio();
    component.soloLectura = false;
    const spy = jest.spyOn(component.tercerosRelacionadosForm, 'enable');
    component.guardarDatosFormulario();
  });

  it('validarDestinatarioFormulario marca todos como tocados si inválido', () => {
    component.donanteDomicilio();
    component.tercerosRelacionadosForm.setErrors({ invalid: true });
    const spy = jest.spyOn(component.tercerosRelacionadosForm, 'markAllAsTouched');
    component.validarDestinatarioFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('validarDestinatarioFormulario no marca como tocados si válido', () => {
    component.donanteDomicilio();
    component.tercerosRelacionadosForm.setErrors(null);
    const spy = jest.spyOn(component.tercerosRelacionadosForm, 'markAllAsTouched');
    component.validarDestinatarioFormulario();
    expect(spy).not.toHaveBeenCalled();
  });

  it('setValoresStore llama al método correcto del store', () => {
    component.donanteDomicilio();
    component.tercerosRelacionadosForm.get('rfcTercero')?.setValue('nuevo');
    component.setValoresStore(component.tercerosRelacionadosForm, 'rfcTercero', 'setRfcTercero');
    expect(mockTramite32606Store.setRfcTercero).toHaveBeenCalledWith('nuevo');
  });

  it('setValoresStore maneja valores nulos', () => {
    component.donanteDomicilio();
    component.setValoresStore(component.tercerosRelacionadosForm, 'noExiste', 'setRfcTercero');
    expect(mockTramite32606Store.setRfcTercero).toHaveBeenCalledWith(undefined);
  });

  it('ngOnDestroy completa destroyed$', () => {
    const spyNext = jest.spyOn(component['destroyed$'], 'next');
    const spyComplete = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalledWith(true);
    expect(spyComplete).toHaveBeenCalled();
  });
});