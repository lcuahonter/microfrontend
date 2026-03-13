import { FormGroup, FormControl } from '@angular/forms';
import { ServicioDeFormularioService } from './formulario-validacion.service';

describe('ServicioDeFormularioService', () => {
  let service: ServicioDeFormularioService;

  beforeEach(() => {
    service = new ServicioDeFormularioService();
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe registrar y recuperar un formulario', () => {
    const form = new FormGroup({ campo: new FormControl('valor') });
    service.registerForm('testForm', form);
    expect(service.getForm('testForm')).toBe(form);
  });

  it('no debe sobrescribir un formulario existente al registrar', () => {
    const form1 = new FormGroup({ campo: new FormControl('valor1') });
    const form2 = new FormGroup({ campo: new FormControl('valor2') });
    service.registerForm('testForm', form1);
    service.registerForm('testForm', form2);
    expect(service.getForm('testForm')).toBe(form1);
  });

  it('debe establecer y obtener el valor del formulario', () => {
    const form = new FormGroup({ campo: new FormControl('') });
    service.registerForm('testForm', form);
    service.setFormValue('testForm', { campo: 'nuevoValor' });
    expect(service.getFormValue('testForm')).toEqual({ campo: 'nuevoValor' });
  });

  it('debe reiniciar un formulario', () => {
    const form = new FormGroup({ campo: new FormControl('valor') });
    service.registerForm('testForm', form);
    service.setFormValue('testForm', { campo: 'otroValor' });
    service.resetForm('testForm');
    expect(form.value).toEqual({ campo: null });
  });

  it('debe devolver la validez del formulario', () => {
    const form = new FormGroup({ campo: new FormControl('valor') });
    service.registerForm('testForm', form);
    expect(service.isFormValid('testForm')).toBe(true);
  });

  it('debe devolver undefined para la validez si el formulario no existe', () => {
    expect(service.isFormValid('noForm')).toBeUndefined();
  });

  it('debe eliminar un control de un formulario', () => {
    const form = new FormGroup({ campo: new FormControl('valor'), otro: new FormControl('otro') });
    service.registerForm('testForm', form);
    service.removeControl('testForm', 'campo');
    expect(form.contains('campo')).toBe(false);
    expect(form.contains('otro')).toBe(true);
  });

  it('no debe hacer nada al eliminar un control de un formulario inexistente', () => {
    expect(() => service.removeControl('noForm', 'campo')).not.toThrow();
  });

  it('no debe hacer nada al eliminar un control inexistente', () => {
    const form = new FormGroup({ campo: new FormControl('valor') });
    service.registerForm('testForm', form);
    expect(() => service.removeControl('testForm', 'otro')).not.toThrow();
    expect(form.contains('campo')).toBe(true);
  });
});