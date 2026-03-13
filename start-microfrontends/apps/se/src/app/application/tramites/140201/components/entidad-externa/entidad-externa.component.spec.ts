import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';

import { EntidadExternaComponent } from './entidad-externa.component';
import { CancelacionesStore } from '../../estados/cancelaciones.store';
import { CancelacionesQuery } from '../../estados/cancelaciones.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { FECHA_DE_PAGO } from '../../models/cancelacions.model';

jest.mock('../../estados/cancelaciones.store');
jest.mock('../../estados/cancelaciones.query');

describe('EntidadExternaComponent', () => {
  let component: EntidadExternaComponent;
  let fixture: ComponentFixture<EntidadExternaComponent>;
  let cancelacionesStore: jest.Mocked<CancelacionesStore>;
  let cancelacionesQuery: jest.Mocked<CancelacionesQuery>;
  let consultaioQuery: any;
  let formBuilder: FormBuilder;

  const mockCancelacionesState = {
    entidadExterna: 'Entidad Test',
    nombreSolicitanteIPC: 'Juan Pérez',
    cargoSolicitanteIPC: 'Director',
    folioOficioSolicitudIPC: 'FOL-123456',
    correoSolicitanteIPC: 'juan@test.com',
    fechaPago: '2024-01-15'
  };

  const mockConsultaioState = {
    readonly: false,
    parameter: 'TEST_PARAMETER',
    tipoDeTramite: 'Test Tramite'
  };

  beforeEach(async () => {
    consultaioQuery = {
      selectConsultaioState$: of(mockConsultaioState)
    };

    cancelacionesStore = {
      setEntidadExterna: jest.fn(),
      setNombreSolicitanteIPC: jest.fn(),
      setCargoSolicitanteIPC: jest.fn(),
      setFolioOficioSolicitudIPC: jest.fn(),
      setCorreoSolicitanteIPC: jest.fn(),
      setFechaPago: jest.fn()
    } as any;

    cancelacionesQuery = {
      selectSeccionState$: of(mockCancelacionesState),
      entidadExterna$: of('Entidad Externa'),
      nombreSolicitanteIPC$: of('Nombre Solicitante'),
      cargoSolicitanteIPC$: of('Cargo Solicitante'),
      folioOficioSolicitudIPC$: of('Folio Oficio'),
      correoSolicitanteIPC$: of('correo@ejemplo.com')
    } as any;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EntidadExternaComponent],
      providers: [
        FormBuilder,
        { provide: CancelacionesStore, useValue: cancelacionesStore },
        { provide: CancelacionesQuery, useValue: cancelacionesQuery },
        { provide: ConsultaioQuery, useValue: consultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EntidadExternaComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar propiedades en el constructor', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
    expect(component.fechaInicioInput).toBeDefined();
    expect(component.fechaInicioInput).toBe(FECHA_DE_PAGO);
  });

  it('debe suscribirse a consultaioQuery en el constructor', () => {
    consultaioQuery.selectConsultaioState$ = of({ readonly: true });
    
    const newFixture = TestBed.createComponent(EntidadExternaComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();
    
    expect(newComponent.esFormularioSoloLectura).toBe(true);
  });

  it('debe inicializar el formulario en ngOnInit', () => {
    expect(component.entidadForm).toBeDefined();
    expect(component.entidadForm.get('entidadExterna')).toBeTruthy();
    expect(component.entidadForm.get('nombreSolicitanteIPC')).toBeTruthy();
    expect(component.entidadForm.get('cargoSolicitanteIPC')).toBeTruthy();
    expect(component.entidadForm.get('folioOficioSolicitudIPC')).toBeTruthy();
    expect(component.entidadForm.get('fechaPago')).toBeTruthy();
    expect(component.entidadForm.get('correoSolicitanteIPC')).toBeTruthy();
  });

  it('debe suscribirse a selectSeccionState$ en ngOnInit', () => {
    expect(component.cancelacionesState).toEqual(mockCancelacionesState);
  });

  it('debe llamar inicializarEstadoFormulario en ngOnInit', () => {
    const spy = jest.spyOn(component, 'inicializarEstadoFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('debe inicializar el formulario con validadores correctos', () => {
    const entidadControl = component.entidadForm.get('entidadExterna');
    const nombreControl = component.entidadForm.get('nombreSolicitanteIPC');
    const folioControl = component.entidadForm.get('folioOficioSolicitudIPC');
    
    entidadControl?.setValue('');
    nombreControl?.setValue('');
    folioControl?.setValue('');
    
    expect(entidadControl?.invalid).toBe(true);
    expect(nombreControl?.invalid).toBe(true);
    expect(folioControl?.invalid).toBe(true);
  });

  it('debe validar maxLength en los controles', () => {
    const entidadControl = component.entidadForm.get('entidadExterna');
    const valorLargo = 'a'.repeat(256); 
    
    entidadControl?.setValue(valorLargo);
    
    expect(entidadControl?.invalid).toBe(true);
    expect(entidadControl?.errors?.['maxlength']).toBeTruthy();
  });

  it('debe validar maxLength de 30 en folioOficioSolicitudIPC', () => {
    const folioControl = component.entidadForm.get('folioOficioSolicitudIPC');
    const valorLargo = 'a'.repeat(31); 
    
    folioControl?.setValue(valorLargo);
    
    expect(folioControl?.invalid).toBe(true);
    expect(folioControl?.errors?.['maxlength']).toBeTruthy();
  });

  it('debe actualizar formulario y store en cambioFechaPago', () => {
    const nuevaFecha = '2024-12-31';
    
    component.cambioFechaPago(nuevaFecha);
    
    expect(component.entidadForm.get('fechaPago')?.value).toBe(nuevaFecha);
    expect(cancelacionesStore.setFechaPago).toHaveBeenCalledWith(nuevaFecha);
  });

  it('debe manejar fecha vacía en cambioFechaPago', () => {
    component.cambioFechaPago('');
    
    expect(component.entidadForm.get('fechaPago')?.value).toBe('');
    expect(cancelacionesStore.setFechaPago).toHaveBeenCalledWith('');
  });

  it('debe llamar guardarDatosFormulario cuando es solo lectura en inicializarEstadoFormulario', () => {
    component.esFormularioSoloLectura = true;
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    
    component.inicializarEstadoFormulario();
    
    expect(spy).toHaveBeenCalled();
  });

  it('debe llamar estadoActualizacion cuando no es solo lectura en inicializarEstadoFormulario', () => {
    component.esFormularioSoloLectura = false;
    const spy = jest.spyOn(component, 'estadoActualizacion');
    
    component.inicializarEstadoFormulario();
    
    expect(spy).toHaveBeenCalled();
  });

  it('debe deshabilitar formulario cuando es solo lectura en guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    
    component.guardarDatosFormulario();
    
    expect(component.entidadForm.disabled).toBe(true);
  });

  it('debe habilitar formulario cuando no es solo lectura en guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = false;
    component.entidadForm.disable();
    
    component.guardarDatosFormulario();
    
    expect(component.entidadForm.enabled).toBe(true);
  });

  it('debe llamar estadoActualizacion en guardarDatosFormulario', () => {
    const spy = jest.spyOn(component, 'estadoActualizacion');
    
    component.guardarDatosFormulario();
    
    expect(spy).toHaveBeenCalled();
  });

  it('debe actualizar entidadExterna desde observable en estadoActualizacion', () => {

    const newObservable = of('Nueva Entidad');
    Object.defineProperty(component, 'entidadExterna$', {
      value: newObservable,
      configurable: true
    });
    
    component.estadoActualizacion();
    
    expect(component.entidadForm.get('entidadExterna')?.value).toBe('Nueva Entidad');
  });

  it('debe actualizar nombreSolicitanteIPC desde observable en estadoActualizacion', () => {
    const newObservable = of('Nuevo Nombre');
    Object.defineProperty(component, 'nombreSolicitanteIPC$', {
      value: newObservable,
      configurable: true
    });
    
    component.estadoActualizacion();
    
    expect(component.entidadForm.get('nombreSolicitanteIPC')?.value).toBe('Nuevo Nombre');
  });

  it('debe actualizar cargoSolicitanteIPC desde observable en estadoActualizacion', () => {
    const newObservable = of('Nuevo Cargo');
    Object.defineProperty(component, 'cargoSolicitanteIPC$', {
      value: newObservable,
      configurable: true
    });
    
    component.estadoActualizacion();
    
    expect(component.entidadForm.get('cargoSolicitanteIPC')?.value).toBe('Nuevo Cargo');
  });

  it('debe actualizar folioOficioSolicitudIPC desde observable en estadoActualizacion', () => {
    const newObservable = of('Nuevo Folio');
    Object.defineProperty(component, 'folioOficioSolicitudIPC$', {
      value: newObservable,
      configurable: true
    });
    
    component.estadoActualizacion();
    
    expect(component.entidadForm.get('folioOficioSolicitudIPC')?.value).toBe('Nuevo Folio');
  });

  it('debe actualizar correoSolicitanteIPC desde observable en estadoActualizacion', () => {
    const newObservable = of('nuevo@correo.com');
    Object.defineProperty(component, 'correoSolicitanteIPC$', {
      value: newObservable,
      configurable: true
    });
    
    component.estadoActualizacion();
    
    expect(component.entidadForm.get('correoSolicitanteIPC')?.value).toBe('nuevo@correo.com');
  });

  it('debe manejar valores null en observables durante estadoActualizacion', () => {
    const nullObservable = of(null as unknown as string);
    Object.defineProperty(component, 'entidadExterna$', {
      value: nullObservable,
      configurable: true
    });
    
    expect(() => component.estadoActualizacion()).not.toThrow();
  });

  it('debe manejar valores undefined en observables durante estadoActualizacion', () => {
    const undefinedObservable = of(undefined) as unknown as Observable<string>;
    Object.defineProperty(component, 'nombreSolicitanteIPC$', {
      value: undefinedObservable,
      configurable: true
    });
    
    expect(() => component.estadoActualizacion()).not.toThrow();
  });

  it('debe no actualizar cuando el valor es falsy en estadoActualizacion', () => {
    const valorInicial = component.entidadForm.get('entidadExterna')?.value;
    const emptyObservable = of('');
    Object.defineProperty(component, 'entidadExterna$', {
      value: emptyObservable,
      configurable: true
    });
    
    component.estadoActualizacion();
    
   expect(component.entidadForm.get('entidadExterna')?.value).toBe(valorInicial);
  });

  it('debe llamar setEntidadExterna con valor correcto en updateEntidadExterna', () => {
    const valor = 'Entidad Test';
    component.entidadForm.get('entidadExterna')?.setValue(valor);
    
    component.updateEntidadExterna();
    
    expect(cancelacionesStore.setEntidadExterna).toHaveBeenCalledWith(valor);
  });

  it('debe llamar setNombreSolicitanteIPC con valor correcto en updateNombreSolicitanteIPC', () => {
    const valor = 'Nombre Test';
    component.entidadForm.get('nombreSolicitanteIPC')?.setValue(valor);
    
    component.updateNombreSolicitanteIPC();
    
    expect(cancelacionesStore.setNombreSolicitanteIPC).toHaveBeenCalledWith(valor);
  });

  it('debe llamar setCargoSolicitanteIPC con valor correcto en updateCargoSolicitanteIPC', () => {
    const valor = 'Cargo Test';
    component.entidadForm.get('cargoSolicitanteIPC')?.setValue(valor);
    
    component.updateCargoSolicitanteIPC();
    
    expect(cancelacionesStore.setCargoSolicitanteIPC).toHaveBeenCalledWith(valor);
  });

  it('debe llamar setFolioOficioSolicitudIPC con valor correcto en updateFolioOficioSolicitudIPC', () => {
    const valor = 'FOL-TEST-123';
    component.entidadForm.get('folioOficioSolicitudIPC')?.setValue(valor);
    
    component.updateFolioOficioSolicitudIPC();
    
    expect(cancelacionesStore.setFolioOficioSolicitudIPC).toHaveBeenCalledWith(valor);
  });

  it('debe llamar setCorreoSolicitanteIPC con valor correcto en updateCorreoSolicitanteIPC', () => {
    const valor = 'test@correo.com';
    component.entidadForm.get('correoSolicitanteIPC')?.setValue(valor);
    
    component.updateCorreoSolicitanteIPC();
    
    expect(cancelacionesStore.setCorreoSolicitanteIPC).toHaveBeenCalledWith(valor);
  });

  it('debe manejar valores null en métodos update', () => {
    component.entidadForm.get('entidadExterna')?.setValue(null);
    
    component.updateEntidadExterna();
    
    expect(cancelacionesStore.setEntidadExterna).toHaveBeenCalledWith(null);
  });

  it('debe manejar valores undefined en métodos update', () => {
    component.entidadForm.get('nombreSolicitanteIPC')?.setValue(undefined);
    
    component.updateNombreSolicitanteIPC();
    
    expect(cancelacionesStore.setNombreSolicitanteIPC).toHaveBeenCalledWith(undefined);
  });

  it('debe manejar valores vacíos en métodos update', () => {
    component.entidadForm.get('cargoSolicitanteIPC')?.setValue('');
    
    component.updateCargoSolicitanteIPC();
    
    expect(cancelacionesStore.setCargoSolicitanteIPC).toHaveBeenCalledWith('');
  });

  it('debe completar destroy$ y desuscribir subscription en ngOnDestroy', () => {
  
    component['destroy$'] = new Subject<void>();
    component['subscription'] = { unsubscribe: jest.fn() } as any;
    
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    const unsubscribeSpy = jest.spyOn(component['subscription'], 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('debe manejar múltiples llamadas a ngOnDestroy sin error', () => {
    component['destroy$'] = new Subject<void>();
    component['subscription'] = { unsubscribe: jest.fn() } as any;
    
    component.ngOnDestroy();
    
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('debe manejar formulario no inicializado en métodos update', () => {
   
    const newComponent = new EntidadExternaComponent(
      formBuilder,
      cancelacionesStore,
      cancelacionesQuery,
      consultaioQuery
    );
    
    expect(() => newComponent.updateEntidadExterna()).not.toThrow();
    expect(() => newComponent.updateNombreSolicitanteIPC()).not.toThrow();
    expect(() => newComponent.updateCargoSolicitanteIPC()).not.toThrow();
    expect(() => newComponent.updateFolioOficioSolicitudIPC()).not.toThrow();
    expect(() => newComponent.updateCorreoSolicitanteIPC()).not.toThrow();
  });

  it('debe manejar errores en store methods', () => {
    cancelacionesStore.setEntidadExterna.mockImplementation(() => {
      throw new Error('Store error');
    });
    
    expect(() => component.updateEntidadExterna()).toThrow('Store error');
  });

  it('debe inicializar fechaPago con valor del state', () => {
    expect(component.entidadForm.get('fechaPago')?.value).toBe(mockCancelacionesState.fechaPago);
  });

  it('debe validar formulario completo', () => {
    component.entidadForm.patchValue({
      entidadExterna: 'Entidad Válida',
      nombreSolicitanteIPC: 'Nombre Válido',
      cargoSolicitanteIPC: 'Cargo Válido',
      folioOficioSolicitudIPC: 'FOL-123',
      fechaPago: '2024-01-01',
      correoSolicitanteIPC: 'test@valid.com'
    });
    
    expect(component.entidadForm.valid).toBe(true);
  });

  it('debe invalidar formulario con campos requeridos vacíos', () => {
    component.entidadForm.patchValue({
      entidadExterna: '',
      nombreSolicitanteIPC: '',
      folioOficioSolicitudIPC: ''
    });
    
    expect(component.entidadForm.invalid).toBe(true);
  });

  it('debe manejar cambios en readonly state durante el ciclo de vida', () => {
    const readonlySubject = new Subject();
    consultaioQuery.selectConsultaioState$ = readonlySubject.asObservable();
    
    const newFixture = TestBed.createComponent(EntidadExternaComponent);
    const newComponent = newFixture.componentInstance;
    
    readonlySubject.next({ readonly: true });
    expect(newComponent.esFormularioSoloLectura).toBe(true);
    
    readonlySubject.next({ readonly: false });
    expect(newComponent.esFormularioSoloLectura).toBe(false);
  });

  it('debe inicializar observables correctamente', () => {
    expect(component.entidadExterna$).toBe(cancelacionesQuery.entidadExterna$);
    expect(component.nombreSolicitanteIPC$).toBe(cancelacionesQuery.nombreSolicitanteIPC$);
    expect(component.cargoSolicitanteIPC$).toBe(cancelacionesQuery.cargoSolicitanteIPC$);
    expect(component.folioOficioSolicitudIPC$).toBe(cancelacionesQuery.folioOficioSolicitudIPC$);
    expect(component.correoSolicitanteIPC$).toBe(cancelacionesQuery.correoSolicitanteIPC$);
  });

  it('debe procesar cambios de fecha con diferentes formatos', () => {
    const fechas = ['2024-01-15', '15/01/2024', '2024-12-31T23:59:59'];
    
    fechas.forEach(fecha => {
      component.cambioFechaPago(fecha);
      expect(component.entidadForm.get('fechaPago')?.value).toBe(fecha);
      expect(cancelacionesStore.setFechaPago).toHaveBeenCalledWith(fecha);
    });
  });
});
