import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RepresentanteLegalComponent } from './representante-legal.component';

describe('Componente RepresentanteLegalComponent', () => {
  let component: RepresentanteLegalComponent;
  let fixture: ComponentFixture<RepresentanteLegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepresentanteLegalComponent, ReactiveFormsModule],
      providers: [FormBuilder],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepresentanteLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario en ngOnInit', () => {
    component.ngOnInit();
    expect(component.representanteLegalForm).toBeDefined();
    expect(component.representanteLegalForm.get('nombreRazonSocial')?.disabled).toBe(true);
    expect(component.representanteLegalForm.get('apellidoPaterno')?.disabled).toBe(true);
    expect(component.representanteLegalForm.get('apellidoMaterno')?.disabled).toBe(true);
  });

  it('debería manejar controles de formulario inválidos', () => {
    const form = component.representanteLegalForm;
    form.get('nombreRazonSocial')?.setValue('');
    form.get('apellidoPaterno')?.setValue('');

    expect(form.valid).toBe(false);
  });

  describe('guardarDatosFormulario', () => {
    it('debería deshabilitar el formulario si esFormularioSoloLectura es verdadero', () => {
      component.esFormularioSoloLectura = true;
      component.representanteLegalForm.enable(); 
      const initSpy = jest.spyOn(component, 'inicializarFormulario');
      component.guardarDatosFormulario();
      expect(initSpy).toHaveBeenCalled();
      expect(component.representanteLegalForm.disabled).toBe(true);
    });

    it('debería habilitar el formulario si esFormularioSoloLectura es falso', () => {
      component.esFormularioSoloLectura = false;
      component.representanteLegalForm.disable(); // asegurar que esté deshabilitado antes
      const initSpy = jest.spyOn(component, 'inicializarFormulario');
      component.guardarDatosFormulario();
      expect(initSpy).toHaveBeenCalled();
      expect(component.representanteLegalForm.enabled).toBe(true);
    });
  });
});