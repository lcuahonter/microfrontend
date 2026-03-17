import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignciontabComponent } from './asigncion-tab.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CatalogoServices, ConsultaioQuery, TituloComponent } from '@ng-mf/data-access-user';
import { Tramite120403Store } from '../../estados/store/tramite120403.store';
import { Tramite120403Query } from '../../estados/queries/tramite120403.query';
import { SolicitudService } from '../../services/solicitud.service';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AsignciontabComponent', () => {
  let component: AsignciontabComponent;
  let fixture: ComponentFixture<AsignciontabComponent>;
  let store: Tramite120403Store;
  let query: Tramite120403Query;
  let catalogoServices: CatalogoServices;
  let consultaioQuery: ConsultaioQuery;
  let solicitudService: SolicitudService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, TituloComponent,AsignciontabComponent],
      declarations: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: CatalogoServices, useValue: { asignacionCatalogo: jest.fn().mockReturnValue(of({ datos: [] })) } },
        { provide: Tramite120403Store, useValue: { establecerDatos: jest.fn(), setFormValidity: jest.fn(), setBuscarSection: jest.fn() } },
        { provide: Tramite120403Query, useValue: { selectTramite120403$: of({ asignacionRadio: '', asignacionsolitud: '', numTramite: '' }) } },
        { provide: ConsultaioQuery, useValue: { selectConsultaioState$: of({ readonly: false }) } },
        { provide: SolicitudService, useValue: { getBuscarDatosDos: jest.fn().mockReturnValue(of({ datos: {} })) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AsignciontabComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Tramite120403Store);
    query = TestBed.inject(Tramite120403Query);
    catalogoServices = TestBed.inject(CatalogoServices);
    consultaioQuery = TestBed.inject(ConsultaioQuery);
    solicitudService = TestBed.inject(SolicitudService);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    component.solicitudState = { asignacionRadio: 'vigencia', asignacionsolitud: '2023', numTramite: '123' } as any;
    component.initForm();
    expect(component.asignacionForm).toBeDefined();
    expect(component.asignacionForm.get('asignacionRadio')?.value).toBe('vigencia');
    expect(component.asignacionForm.get('asignacionsolitud')?.value).toBe('2023');
    expect(component.asignacionForm.get('numTramite')?.value).toBe('123');
  });

  it('debería obtener datos de año de oficio y asignar solicitanteList', () => {
    (catalogoServices.asignacionCatalogo as any).mockReturnValueOnce(of({ datos: [{ clave: '1', nombre: 'Año' }] }));
    component.getAnoOficioDatos();
    expect(catalogoServices.asignacionCatalogo).toHaveBeenCalled();
  });

  it('debería obtener el estado de la solicitud y asignarlo', () => {
    component.obtenerEstadoSolicitud();
    expect(component.solicitudState).toBeDefined();
  });

  it('debería inicializar el estado del formulario en modo lectura', () => {
    component.esFormularioSoloLectura = true;
    component.initForm = jest.fn();
    component.guardarDatosFormulario();
    expect(component.initForm).toHaveBeenCalled();
  });

  it('debería inicializar el estado del formulario en modo edición', () => {
    component.esFormularioSoloLectura = false;
    component.initForm = jest.fn();
    component.guardarDatosFormulario();
    expect(component.initForm).toHaveBeenCalled();
  });

  it('debería validar si un control es inválido', () => {
    component.initForm();
    const control = component.asignacionForm.get('numTramite');
    control?.markAsTouched();
    control?.setValue('');
    expect(component.isInvalid('numTramite')).toBe(true);
  });

  it('debería obtener el mensaje de error para numTramite', () => {
    component.initForm();
    const control = component.asignacionForm.get('numTramite');
    control?.setValue('');
    control?.markAsTouched();
    expect(component.getNumTramiteErrorMessage()).toContain('obligatorio');
    control?.setValue('abc');
    control?.setErrors({ numeroInvalido: { valor: 'abc' } });
    expect(component.getNumTramiteErrorMessage()).toContain('debe ser un número válido');
    control?.setValue('1'.repeat(31));
    control?.setErrors({ maxlength: true });
    expect(component.getNumTramiteErrorMessage()).toContain('no puede exceder 30 caracteres');
  });

  it('debería guardar datos en el store y actualizar validez', () => {
    component.initForm();
    const spy = jest.spyOn(store, 'establecerDatos');
    const spyValid = jest.spyOn(store, 'setFormValidity');
    component.setValoresStore(component.asignacionForm, 'numTramite');
    expect(spy).toHaveBeenCalled();
    expect(spyValid).toHaveBeenCalled();
  });

  it('debería emitir evento buscarIntento y llamar getBuscarDatos si el formulario es válido', () => {
    component.initForm();
    component.solicitudState = { numTramite: '123' } as any;
    const spyBuscar = jest.spyOn(component.buscarIntento, 'emit');
    const spyStore = jest.spyOn(store, 'setBuscarSection');
    component.getBuscarDatos = jest.fn();
    component.asignacionForm.get('asignacionRadio')?.setValue('vigencia');
    component.asignacionForm.get('asignacionsolitud')?.setValue('2023');
    component.asignacionForm.get('numTramite')?.setValue('123');
    component.buscar();
    expect(spyBuscar).toHaveBeenCalledWith(expect.objectContaining({ submitted: true, invalid: false, numTramite: '123' }));
    expect(spyStore).toHaveBeenCalledWith(true);
    expect(component.getBuscarDatos).toHaveBeenCalled();
  });

  it('debería marcar todos los controles como tocados si el formulario es inválido en buscar', () => {
    component.initForm();
    const spyStore = jest.spyOn(store, 'setBuscarSection');
    component.asignacionForm.get('asignacionRadio')?.setValue('');
    component.buscar();
    expect(component.asignacionForm.invalid).toBe(true);
    expect(spyStore).toHaveBeenCalledWith(false);
  });

  it('debería llamar solicitudService.getBuscarDatosDos y asignar formaDato', () => {
    component.initForm();
    (solicitudService.getBuscarDatosDos as any).mockReturnValueOnce(of({ datos: { test: 'valor' } }));
    component.getBuscarDatos();
    expect(solicitudService.getBuscarDatosDos).toHaveBeenCalled();
  });

  it('debería validar formularios correctamente', () => {
    component.initForm();
    component.asignacionForm.get('asignacionRadio')?.setValue('vigencia');
    component.asignacionForm.get('asignacionsolitud')?.setValue('2023');
    component.asignacionForm.get('numTramite')?.setValue('123');
    const spy = jest.spyOn(store, 'setFormValidity');
    expect(component.validarFormularios()).toBe(true);
    expect(spy).toHaveBeenCalledWith('asigncion', true);
    component.asignacionForm.get('numTramite')?.setValue('');
    expect(component.validarFormularios()).toBe(false);
    expect(spy).toHaveBeenCalledWith('asigncion', false);
  });

  it('debería ejecutar ngOnInit y llamar métodos de inicialización', () => {
    component.obtenerEstadoSolicitud = jest.fn();
    component.inicializarEstadoFormulario = jest.fn();
    component.getAnoOficioDatos = jest.fn();
    component.ngOnInit();
    expect(component.obtenerEstadoSolicitud).toHaveBeenCalled();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
    expect(component.getAnoOficioDatos).toHaveBeenCalled();
  });

  it('debería ejecutar ngOnChanges y validar formularios si isContinuarTriggered es true', () => {
    component.isContinuarTriggered = true;
    component.validarFormularios = jest.fn();
    component.ngOnChanges();
    expect(component.validarFormularios).toHaveBeenCalled();
  });

  it('debería destruir el componente y completar destroyed$', () => {
    const spy = jest.spyOn(component.destroyed$, 'next');
    const spyComplete = jest.spyOn(component.destroyed$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('debería validar correctamente el validador estático numeroValidoValidator', () => {
    const control: any = { value: '123' };
    expect(AsignciontabComponent['numeroValidoValidator'](control)).toBeNull();
    control.value = 'abc';
    expect(AsignciontabComponent['numeroValidoValidator'](control)).toEqual({ numeroInvalido: { valor: 'abc' } });
    control.value = '';
    expect(AsignciontabComponent['numeroValidoValidator'](control)).toBeNull();
  });
});