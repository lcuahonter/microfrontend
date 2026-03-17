import { TestBed } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { FormaServicioService } from './forma-servicio.service';

describe('FormaServicioService', () => {
  let service: FormaServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormaServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register and retrieve a form', () => {
    const form = new FormGroup({ field: new FormControl('value') });
    service.registerForm('testForm', form);
    expect(service.getForm('testForm')).toBe(form);
  });

  it('should not overwrite an existing form', () => {
    const form1 = new FormGroup({ field: new FormControl('value1') });
    const form2 = new FormGroup({ field: new FormControl('value2') });
    service.registerForm('uniqueForm', form1);
    service.registerForm('uniqueForm', form2);
    expect(service.getForm('uniqueForm')).toBe(form1);
  });

  it('should return undefined for non-existent form', () => {
    expect(service.getForm('noForm')).toBeUndefined();
  });

  it('should set form value if form exists', () => {
    const form = new FormGroup({ field: new FormControl('old') });
    service.registerForm('setForm', form);
    service.setFormValue('setForm', { field: 'new' });
    expect(form.value.field).toBe('new');
  });

  it('should not throw when setting value for non-existent form', () => {
    expect(() => service.setFormValue('noForm', { field: 'x' })).not.toThrow();
  });

  it('should get form value if form exists', () => {
    const form = new FormGroup({ field: new FormControl('abc') });
    service.registerForm('getFormValue', form);
    expect(service.getFormValue('getFormValue')).toEqual({ field: 'abc' });
  });

  it('should return undefined for getFormValue on non-existent form', () => {
    expect(service.getFormValue('noForm')).toBeUndefined();
  });

  it('should reset form if exists', () => {
    const form = new FormGroup({ field: new FormControl('resetMe') });
    service.registerForm('resetForm', form);
    form.setValue({ field: 'changed' });
    service.resetForm('resetForm');
    expect(form.value.field).toBeNull();
  });

  it('should not throw when resetting non-existent form', () => {
    expect(() => service.resetForm('noForm')).not.toThrow();
  });

  it('should return form validity', () => {
    const form = new FormGroup({ field: new FormControl('valid') });
    service.registerForm('validForm', form);
    expect(service.isFormValid('validForm')).toBe(true);
  });

  it('should return undefined for isFormValid on non-existent form', () => {
    expect(service.isFormValid('noForm')).toBeUndefined();
  });

  it('should remove control from form if exists', () => {
    const form = new FormGroup({ field: new FormControl('val'), other: new FormControl('x') });
    service.registerForm('removeForm', form);
    expect(form.contains('field')).toBe(true);
    service.removeControl('removeForm', 'field');
    expect(form.contains('field')).toBe(false);
    // Should not throw if control does not exist
    service.removeControl('removeForm', 'notExist');
  });

  it('should not throw when removing control from non-existent form', () => {
    expect(() => service.removeControl('noForm', 'any')).not.toThrow();
  });
});