import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitantetabComponent } from './solicitantetab.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('SolicitantetabComponent', () => {
  let component: SolicitantetabComponent;
  let fixture: ComponentFixture<SolicitantetabComponent>;
  let mockService: any;
  let mockValidacionesService: any;
  let mockTramite120403Store: any;
  let mockTramite120403Query: any;

  beforeEach(async () => {
    mockService = {};
    mockValidacionesService = {
      isValid: jest.fn().mockReturnValue(true),
    };
    mockTramite120403Store = {
      establecerDatos: jest.fn(),
      setFormValidity: jest.fn(),
    };
    mockTramite120403Query = {
      selectTramite120403$: of({
        fechaFin: '2025-12-31',
        asignacionRadio: 'vigencia',
        asignacionsolitud: '2024',
        numTramite: '12345',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SolicitantetabComponent],
      providers: [
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: 'service', useValue: mockService },
        { provide: 'validacionesService', useValue: mockValidacionesService },
        { provide: 'tramite120403Store', useValue: mockTramite120403Store },
        { provide: 'tramite120403Query', useValue: mockTramite120403Query },
        DatePipe,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(SolicitantetabComponent, {
        set: {
          providers: [
            { provide: 'service', useValue: mockService },
            { provide: 'validacionesService', useValue: mockValidacionesService },
            { provide: 'tramite120403Store', useValue: mockTramite120403Store },
            { provide: 'tramite120403Query', useValue: mockTramite120403Query },
            DatePipe,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SolicitantetabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente en initForm', () => {
    component.initForm();
    expect(component.formasignacion).toBeDefined();
    expect(component.formasignacion.get('fechaFin')?.value).toBe('2025-12-31');
  });

  it('debería actualizar el formulario con el input formaDatos', () => {
    const datos = {
      asignacionResponse: {
        fechaFinVigenciaAprobada: '2025-12-31',
        fechaInicioVigencia: '2025-01-01',
        impTotalExpedido: 100,
        montoExpedido: 50,
        montoDisponible: 50,
      },
    };
    component.initForm();
    component.formaDatos = datos;
    expect(component.formasignacion.get('especie')?.value).toBe('31/12/2025');
    expect(component.formasignacion.get('funcionZootecnica')?.value).toBe('01/01/2025');
    expect(component.formasignacion.get('autorizado')?.value).toBe(100);
    expect(component.formasignacion.get('expendido')?.value).toBe(50);
    expect(component.formasignacion.get('disponible')?.value).toBe(50);
  });

  it('debería obtener el estado de la solicitud y asignar a solicitudState', () => {
    component.obtenerEstadoSolicitud();
    expect(component.solicitudState).toBeDefined();
    expect(component.solicitudState.fechaFin).toBe('2025-12-31');
  });

  it('debería inicializar el formulario en ngOnInit y validar si isContinuarTriggered es true', () => {
    const spyValidar = jest.spyOn(component, 'validarFormularios');
    component.isContinuarTriggered = true;
    component.ngOnInit();
    expect(component.formasignacion).toBeDefined();
    expect(spyValidar).toHaveBeenCalled();
  });

  it('debería ejecutar ngOnChanges y obtener el estado de la solicitud', () => {
    const spyObtener = jest.spyOn(component, 'obtenerEstadoSolicitud');
    component.ngOnChanges();
    expect(spyObtener).toHaveBeenCalled();
  });

  it('debería actualizar la fecha de fin y llamar a setValoresStore', () => {
    component.initForm();
    const spySetValores = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaPago('2026-01-01');
    expect(component.formasignacion.get('fechaFin')?.value).toBe('2026-01-01');
    expect(spySetValores).toHaveBeenCalledWith(component.formasignacion, 'fechaFin');
  });

  it('debería llamar a establecerDatos y updateValueAndValidity en setValoresStore', () => {
    component.initForm();
    const spyEstablecer = jest.spyOn(mockTramite120403Store, 'establecerDatos');
    component.setValoresStore(component.formasignacion, 'fechaFin');
    expect(spyEstablecer).toHaveBeenCalled();
    expect(component.formasignacion.get('fechaFin')?.valid).toBe(true);
  });

  it('debería validar un campo usando el servicio', () => {
    component.initForm();
    expect(component.isValid(component.formasignacion, 'fechaFin')).toBe(true);
  });

  it('debería validar el formulario correctamente y llamar a setFormValidity', () => {
    component.initForm();
    component.formasignacion.get('amplia')?.setValue('valor');
    component.formasignacion.get('fechaFin')?.setValue('2025-12-31');
    const spySetFormValidity = jest.spyOn(mockTramite120403Store, 'setFormValidity');
    expect(component.validarFormularios()).toBe(true);
    expect(spySetFormValidity).toHaveBeenCalledWith('solicitante', true);
    component.formasignacion.get('amplia')?.setValue('');
    expect(component.validarFormularios()).toBe(false);
    expect(spySetFormValidity).toHaveBeenCalledWith('solicitante', false);
  });

  it('debería limpiar destroyed$ en ngOnDestroy', () => {
    const spyNext = jest.spyOn((component as any).destroyed$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('debería no hacer nada en enviarFormulario si el formulario es válido', () => {
    component.initForm();
    component.formasignacion.get('amplia')?.setValue('valor');
    component.formasignacion.get('fechaFin')?.setValue('2025-12-31');
    expect(() => component.enviarFormulario()).not.toThrow();
  });

  it('debería no hacer nada en enviarFormulario si el formulario es inválido', () => {
    component.initForm();
    component.formasignacion.get('amplia')?.setValue('');
    expect(() => component.enviarFormulario()).not.toThrow();
  });

  it('debería exponer el getter formaDatos correctamente', () => {
    const datos = { asignacionResponse: {} };
    component.formaDatos = datos;
    expect(component.formaDatos).toBe(datos);
  });

  it('debería inicializar valores por defecto en propiedades públicas', () => {
    expect(component.indice).toBe(1);
    expect(Array.isArray(component.pasos)).toBe(true);
    expect(component.tramites).toBe('120403');
    expect(component.fechaFinInput).toBeDefined();
  });
});