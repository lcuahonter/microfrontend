import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SolicitudComponent } from './solicitud.component';
import { Catalogo, ConsultaioQuery, ConsultaioState, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { of, BehaviorSubject } from 'rxjs';
import { Solicitud30506State } from '../../state/tramite30506.store';

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;
  let registroServiceMock: any;
  let tramite30506StoreMock: any;
  let tramite30506QueryMock: any;
  let consultaioQueryMock: any;
  let validacionesServiceMock: any;

  let consultaioStateSubject: BehaviorSubject<ConsultaioState>;
  let solicitudStateSubject: BehaviorSubject<Solicitud30506State>;
  let bancoDataSubject: BehaviorSubject<Catalogo[]>;

  const mockConsultaState: ConsultaioState = {
    procedureId: 'PROC_30506',
    parameter: 'TEST_PARAM',
    department: 'AGACE',
    folioTramite: 'FOL_123456',
    tipoDeTramite: 'REGISTRO_TOMA_MUESTRAS',
    estadoDeTramite: 'EN_PROCESO',
    readonly: false,
    create: false,
    update: false,
    consultaioSolicitante: {
      folioDelTramite: 'FOL_SOL_123456',
      fechaDeInicio: '01/01/2024',
      estadoDelTramite: 'NUEVO'
    }
  };

  const mockSolicitudData: Solicitud30506State = {
    numeroOperacion: 'OP123456',
    fechaInicio: '01/01/2024',
    fechaFinal: '31/12/2024',
    banco: 'BANCO_TEST',
    llave: 'LLAVE_TEST',
    manifiesto1: true,
    manifiesto2: false,
    fechaPago: '15/06/2024',
    folio: 'FOL123',
    claveReferencia: 'REF456',
    cadenaDependecia: 'CADENA_TEST',
    importePago: '1000.00'
  };

  const mockBancoCatalogo: Catalogo[] = [
    { id: 1, descripcion: 'Banco Nacional' },
    { id: 2, descripcion: 'Banco Internacional' },
    { id: 3, descripcion: 'Banco Regional' }
  ];

  beforeEach(async () => {
    consultaioStateSubject = new BehaviorSubject(mockConsultaState);
    solicitudStateSubject = new BehaviorSubject(mockSolicitudData);
    bancoDataSubject = new BehaviorSubject(mockBancoCatalogo);

    registroServiceMock = {
      obtenerDatosBanco: jest.fn(() => bancoDataSubject.asObservable()),
      getRegistroTomaMuestrasMercanciasData: jest.fn(() => of(mockSolicitudData)),
      actualizarEstadoFormulario: jest.fn()
    };

    tramite30506StoreMock = {
      setBanco: jest.fn(),
      setNumeroOperacion: jest.fn(),
      setFechaInicio: jest.fn(),
      setFechaFinal: jest.fn(),
      setLlave: jest.fn(),
      setFechaPago: jest.fn(),
      setManifiesto1: jest.fn(),
      setManifiesto2: jest.fn(),
      setClaveReferencia: jest.fn(),
      setCadenaDependecia: jest.fn(),
      setImportePago: jest.fn(),
      limpiarSolicitud: jest.fn(),
      reset: jest.fn()
    };

    tramite30506QueryMock = {
      selectSolicitud$: jest.fn(() => solicitudStateSubject.asObservable())
    };

    consultaioQueryMock = {
      selectConsultaioState$: jest.fn(() => consultaioStateSubject.asObservable())
    };

    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SolicitudComponent],
      providers: [
        FormBuilder,
        { provide: RegistroService, useValue: registroServiceMock },
        { provide: Tramite30506Store, useValue: tramite30506StoreMock },
        { provide: Tramite30506Query, useValue: tramite30506QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
    consultaioStateSubject.complete();
    solicitudStateSubject.complete();
    bancoDataSubject.complete();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with solicitudState values', () => {
  component.solicitudState = mockSolicitudData;
  component.donanteDomicilio();

  expect(component.registroForm.get('banco')?.value).toBe(mockSolicitudData.banco);
  expect(component.registroForm.get('numeroOperacion')?.value).toBe(mockSolicitudData.numeroOperacion);
});

  it('should set banco catalogo after obtenerDatosBanco is called', () => {
    component.obtenerDatosBanco();
    expect(component.bancoCatalogo.catalogos).toEqual(mockBancoCatalogo);
  });

  it('should set soloLectura based on consultaioState', () => {
    expect(component.soloLectura).toBe(mockConsultaState.readonly);
  });

  it('should call setValoresStore and update store method', () => {
    component.donanteDomicilio();
    component.registroForm.patchValue({ banco: 'Banco Test' });
    component.setValoresStore(component.registroForm, 'banco', 'setBanco');
    expect(tramite30506StoreMock.setBanco).toHaveBeenCalledWith('Banco Test');
  });

  it('should mark form as touched if invalid during validation', () => {
    component.donanteDomicilio();
    const markAllAsTouchedSpy = jest.spyOn(component.registroForm, 'markAllAsTouched');
    Object.defineProperty(component.registroForm, 'invalid', { get: () => true });
    component.validarDestinatarioFormulario();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component.destroyed$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });

it('should call guardarDatosFormulario if soloLectura is true', () => {
  component.soloLectura = true;
  const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
  component.inicializarEstadoFormulario();
  expect(guardarSpy).toHaveBeenCalled();
});

it('should call donanteDomicilio if soloLectura is false', () => {
  component.soloLectura = false;
  const donanteSpy = jest.spyOn(component, 'donanteDomicilio');
  component.inicializarEstadoFormulario();
  expect(donanteSpy).toHaveBeenCalled();
});

it('should disable the form if soloLectura is true', () => {
  component.soloLectura = true;
  component.donanteDomicilio();
  component.guardarDatosFormulario();
  expect(component.registroForm.disabled).toBe(true);
});

it('should enable the form if soloLectura is false', () => {
  component.soloLectura = false;
  component.donanteDomicilio();
  component.guardarDatosFormulario();
  expect(component.registroForm.disabled).toBe(false);
});

it('should patch fechaPago and update store in cambioFechaPago()', () => {
  component.donanteDomicilio();
  const patchSpy = jest.spyOn(component.registroForm, 'patchValue');
  const setStoreSpy = jest.spyOn(component, 'setValoresStore');
  
  const newDate = '01/01/2025';
  component.cambioFechaPago(newDate);

  expect(patchSpy).toHaveBeenCalledWith({ fechaPago: newDate });
  expect(setStoreSpy).toHaveBeenCalledWith(component.registroForm, 'fechaPago', 'setFechaPago');
});
it('should not throw when form is valid in enviarFormulario', () => {
  component.donanteDomicilio();
  jest.spyOn(component.registroForm, 'valid', 'get').mockReturnValue(true);
  expect(() => component.enviarFormulario()).not.toThrow();
});

it('should not throw when form is invalid in enviarFormulario', () => {
  component.donanteDomicilio();
  jest.spyOn(component.registroForm, 'valid', 'get').mockReturnValue(false);
  expect(() => component.enviarFormulario()).not.toThrow();
});

});
