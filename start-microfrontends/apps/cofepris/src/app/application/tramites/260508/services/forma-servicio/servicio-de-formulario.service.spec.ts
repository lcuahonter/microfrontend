import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicioDeFormularioService } from './servicio-de-formulario.service';

describe('ServicioDeFormularioService', () => {
  let service: ServicioDeFormularioService;
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [ServicioDeFormularioService],
    });
    service = TestBed.inject(ServicioDeFormularioService);
    fb = TestBed.inject(FormBuilder);
  });

  it('debería crear', () => {
    expect(service).toBeTruthy();
  });

  it('debería registrar un formulario si no está registrado', () => {
    const form = fb.group({
      nombre: new FormControl(''),
    });
    service.registerForm('testForm', form);

    const result = service.getForm('testForm');
    expect(result).toBe(form);
  });

  it('no debería sobrescribir el formulario existente al registrarse nuevamente', () => {
    const form1 = fb.group({ field1: ['A'] });
    const form2 = fb.group({ field2: ['B'] });

    service.registerForm('testForm', form1);
    service.registerForm('testForm', form2);

    const result = service.getForm('testForm');
    expect(result).toBe(form1);
    expect(result).not.toBe(form2);
  });

  it('debería devolver undefined si el formulario no se encuentra', () => {
    const result = service.getForm('nonexistentForm');
    expect(result).toBeUndefined();
  });

  it('debería patch el valor del formulario si existe', () => {
    const form = fb.group({ name: [''] });
    service.registerForm('patchForm', form);
    service.setFormValue('patchForm', { name: 'John' });

    const result = service.getForm('patchForm');
    expect(result?.value.name).toBe('John');
  });

  it('debería devolver el valor del formulario si existe', () => {
    const form = fb.group({ name: ['Jane'] });
    service.registerForm('valueForm', form);

    const result = service.getFormValue('valueForm');
    expect(result).toEqual({ name: 'Jane' });
  });

  it('debería devolver undefined si el formulario no existe', () => {
    const result = service.getFormValue('missingForm');
    expect(result).toBeUndefined();
  });

  it('debería resetear el formulario', () => {
    const form = fb.group({ age: ['30'] });
    service.registerForm('resetForm', form);

    service.resetForm('resetForm');
    expect(form.value.age).toBeNull(); // reset clears the value
  });

  it('debería validar el formulario correctamente', () => {
    const form = fb.group({ email: ['', Validators.required] });
    service.registerForm('validForm', form);

    expect(service.isFormValid('validForm')).toBe(false);

    form.patchValue({ email: 'example@test.com' });
    expect(service.isFormValid('validForm')).toBe(true);
  });

  it('debería devolver undefined si el formulario no se encuentra', () => {
    expect(service.isFormValid('unknownForm')).toBeUndefined();
  });

  it('debería eliminar el control si existe en el formulario', () => {
    const form = fb.group({
      control1: ['value1'],
      control2: ['value2'],
    });

    service.registerForm('removeForm', form);
    service.removeControl('removeForm', 'control1');

    expect(form.contains('control1')).toBe(false);
    expect(form.contains('control2')).toBe(true);
  });

  it('No debería fallar al eliminar un control de un formulario inexistente', () => {
    expect(() => service.removeControl('noForm', 'controlX')).not.toThrow();
  });

  it('No debería fallar al eliminar un control inexistente', () => {
    const form = fb.group({ control1: ['value'] });
    service.registerForm('edgeForm', form);
    expect(() => service.removeControl('edgeForm', 'nonexistent')).not.toThrow();
  });
});
