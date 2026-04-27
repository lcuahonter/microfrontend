import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { PersonaOirRecibirComponent } from './persona-oir-recibir.component';
import { UsuariosApiService } from '../../core/services/usuarios-api.service';

const mockApiService = {
  altaPersonaOirRecibir: jest.fn().mockReturnValue(of({})),
};

describe('PersonaOirRecibirComponent', () => {
  let component: PersonaOirRecibirComponent;
  let fixture: ComponentFixture<PersonaOirRecibirComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockApiService.altaPersonaOirRecibir.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [PersonaOirRecibirComponent, ReactiveFormsModule],
      providers: [
        { provide: UsuariosApiService, useValue: mockApiService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaOirRecibirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('paso() debe iniciar en 0', () => {
    expect(component.paso()).toBe(0);
  });

  it('form debe tener el control nombre como requerido', () => {
    const ctrl = component.form.get('nombre');
    expect(ctrl).toBeTruthy();
    ctrl!.setValue('');
    ctrl!.markAsTouched();
    expect(ctrl!.hasError('required')).toBe(true);
  });

  it('form debe tener el control primerApellido como requerido', () => {
    const ctrl = component.form.get('primerApellido');
    expect(ctrl).toBeTruthy();
    ctrl!.setValue('');
    ctrl!.markAsTouched();
    expect(ctrl!.hasError('required')).toBe(true);
  });

  it('form debe tener el control correo como requerido', () => {
    const ctrl = component.form.get('correo');
    expect(ctrl).toBeTruthy();
    ctrl!.setValue('');
    ctrl!.markAsTouched();
    expect(ctrl!.hasError('required')).toBe(true);
  });

  it('form debe tener el control correo con validación de email', () => {
    const ctrl = component.form.get('correo');
    ctrl!.setValue('correo-invalido');
    ctrl!.markAsTouched();
    expect(ctrl!.hasError('email')).toBe(true);
  });

  it('form debe tener el control telefono sin validación required', () => {
    const ctrl = component.form.get('telefono');
    expect(ctrl).toBeTruthy();
    ctrl!.setValue('');
    expect(ctrl!.hasError('required')).toBe(false);
  });

  it('form es inválido sin datos', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('form es válido con todos los campos requeridos', () => {
    component.form.setValue({
      nombre: 'JUAN',
      primerApellido: 'PEREZ',
      segundoApellido: '',
      correo: 'juan@correo.com',
      telefono: '',
    });
    expect(component.form.valid).toBe(true);
  });

  it('form es válido con telefono opcional incluido', () => {
    component.form.setValue({
      nombre: 'JUAN',
      primerApellido: 'PEREZ',
      segundoApellido: 'GARCIA',
      correo: 'juan@correo.com',
      telefono: '5512345678',
    });
    expect(component.form.valid).toBe(true);
  });

  it('readonly pasos debe tener 4 elementos', () => {
    expect(component.pasos.length).toBe(4);
  });

  it('los pasos deben tener las etiquetas correctas', () => {
    expect(component.pasos[0].label).toBe('Usuario');
    expect(component.pasos[1].label).toBe('Datos');
    expect(component.pasos[2].label).toBe('e.firma');
    expect(component.pasos[3].label).toBe('Listo');
  });

  it('guardar() debe llamar a api.altaPersonaOirRecibir() con el RFC del usuario y los datos del form', () => {
    const usuarioMock = { rfc: 'GOMA800101AB1', nombre: 'GOMEZ', primerApellido: 'MARTINEZ' } as any;
    component.usuario.set(usuarioMock);
    component.form.setValue({
      nombre: 'JUAN',
      primerApellido: 'PEREZ',
      segundoApellido: '',
      correo: 'juan@correo.com',
      telefono: '',
    });

    component.guardar();

    expect(mockApiService.altaPersonaOirRecibir).toHaveBeenCalledWith(
      'GOMA800101AB1',
      expect.objectContaining({
        nombre: 'JUAN',
        primerApellido: 'PEREZ',
        correo: 'juan@correo.com',
      })
    );
  });

  it('tras guardar() exitoso, exito() debe ser true y paso() debe ser 3', () => {
    const usuarioMock = { rfc: 'GOMA800101AB1', nombre: 'GOMEZ', primerApellido: 'MARTINEZ' } as any;
    component.usuario.set(usuarioMock);
    component.form.setValue({
      nombre: 'JUAN',
      primerApellido: 'PEREZ',
      segundoApellido: '',
      correo: 'juan@correo.com',
      telefono: '',
    });

    component.guardar();

    expect(component.exito()).toBe(true);
    expect(component.paso()).toBe(3);
  });
});
