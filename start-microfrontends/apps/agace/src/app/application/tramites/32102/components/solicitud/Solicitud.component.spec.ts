import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [SolicitudComponent],
      providers: [FormBuilder],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    component.solicitudState = {
      MANIFIESTO_1: true,
      MANIFIESTO_2: false,
      MANIFIESTO_3: false,
      MANIFIESTO_4: false,
    } as any;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con los valores del estado', () => {
    component.inicializarFormulario();
    expect(component.formularioAvisoDeExtension.value.MANIFIESTO_1).toBe(true);
    expect(component.formularioAvisoDeExtension.value.MANIFIESTO_2).toBe(false);
  });

  it('debería marcar el formulario como inválido si no todos los checkboxes están seleccionados', () => {
    component.inicializarFormulario();
    expect(component.formularioAvisoDeExtension.valid).toBeFalsy();
    component.formularioAvisoDeExtension.patchValue({
      MANIFIESTO_1: true,
      MANIFIESTO_2: true,
      MANIFIESTO_3: true,
      MANIFIESTO_4: true,
    });
    expect(component.formularioAvisoDeExtension.valid).toBe(true);
  });

  it('debería deshabilitar el formulario si esFormularioSoloLectura es true', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.formularioAvisoDeExtension.disabled).toBe(true);
  });

  it('debería habilitar el formulario si esFormularioSoloLectura es false', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.formularioAvisoDeExtension.enabled).toBe(true);
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const spyNext = spyOn(component['destroyNotifier$'], 'next').and.callThrough();
    const spyComplete = spyOn(component['destroyNotifier$'], 'complete').and.callThrough();
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('debería establecer el valor en el store usando setValoresStore', () => {
    component.formularioAvisoDeExtension = new FormBuilder().group({
      MANIFIESTO_1: [true]
    });
    component.tramite32102Store = {
      setManifiesto1: jasmine.createSpy('setManifiesto1')
    } as any;
    component.setValoresStore(
      component.formularioAvisoDeExtension,
      'MANIFIESTO_1',
      'setManifiesto1' as keyof typeof component.tramite32102Store
    );
    expect(component.tramite32102Store.setManifiesto1).toHaveBeenCalledWith(true);
  });
});