import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { of, throwError } from 'rxjs';

import { CambioCorreoComponent } from './cambio-correo.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { AuthService } from '../../../core/services/auth.service';

describe('CambioCorreoComponent', () => {
  let component: CambioCorreoComponent;
  let fixture: ComponentFixture<CambioCorreoComponent>;
  let mockApiService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockApiService = {
      cambiarCorreo: jest.fn().mockReturnValue(of({})),
    };

    mockAuthService = {
      usuario: signal({ rfc: 'GOMA800101AB1', correo: 'old@test.com' } as any),
      rol: signal(null as any),
    };

    await TestBed.configureTestingModule({
      imports: [CambioCorreoComponent, ReactiveFormsModule],
      providers: [
        { provide: UsuariosApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CambioCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('paso() debería iniciar en 0', () => {
    expect(component.paso()).toBe(0);
  });

  it('cargando() debería iniciar en false', () => {
    expect(component.cargando()).toBe(false);
  });

  it('exito() debería iniciar en false', () => {
    expect(component.exito()).toBe(false);
  });

  it('el formulario debería tener los controles correoNuevo y confirmacion', () => {
    expect(component.form.contains('correoNuevo')).toBe(true);
    expect(component.form.contains('confirmacion')).toBe(true);
  });

  it('correoNuevo debería requerir formato email válido', () => {
    const ctrl = component.form.get('correoNuevo')!;
    ctrl.setValue('no-es-email');
    ctrl.markAsTouched();
    expect(ctrl.hasError('email')).toBe(true);
  });

  it('el formulario debería ser inválido si correoNuevo no tiene formato email', () => {
    component.form.get('correoNuevo')!.setValue('texto-sin-arroba');
    component.form.get('confirmacion')!.setValue('texto-sin-arroba');
    expect(component.form.invalid).toBe(true);
  });

  it('el formulario debería ser válido con correos correctos', () => {
    component.form.get('correoNuevo')!.setValue('nuevo@correo.com');
    component.form.get('confirmacion')!.setValue('confirmado@correo.com');
    expect(component.form.valid).toBe(true);
  });

  it('guardar() debería llamar a api.cambiarCorreo() con los datos del form', () => {
    component.form.get('correoNuevo')!.setValue('nuevo@correo.com');
    component.form.get('confirmacion')!.setValue('nuevo@correo.com');

    component.guardar();

    expect(mockApiService.cambiarCorreo).toHaveBeenCalledTimes(1);
    expect(mockApiService.cambiarCorreo).toHaveBeenCalledWith({
      rfcUsuario: 'GOMA800101AB1',
      correoActual: 'old@test.com',
      correoNuevo: 'nuevo@correo.com',
      confirmacionCorreo: 'nuevo@correo.com',
    });
  });

  it('tras respuesta exitosa, exito() debería ser true', () => {
    component.form.get('correoNuevo')!.setValue('nuevo@correo.com');
    component.form.get('confirmacion')!.setValue('nuevo@correo.com');

    component.guardar();

    expect(component.exito()).toBe(true);
  });

  it('tras respuesta exitosa, paso() debería ser 2', () => {
    component.form.get('correoNuevo')!.setValue('nuevo@correo.com');
    component.form.get('confirmacion')!.setValue('nuevo@correo.com');

    component.guardar();

    expect(component.paso()).toBe(2);
  });

  it('tras respuesta exitosa, cargando() debería ser false', () => {
    component.form.get('correoNuevo')!.setValue('nuevo@correo.com');
    component.form.get('confirmacion')!.setValue('nuevo@correo.com');

    component.guardar();

    expect(component.cargando()).toBe(false);
  });

  it('tras error en guardar(), paso() debería ser 2 y exito() false', () => {
    mockApiService.cambiarCorreo.mockReturnValue(throwError(() => new Error('Error de red')));

    component.form.get('correoNuevo')!.setValue('nuevo@correo.com');
    component.form.get('confirmacion')!.setValue('nuevo@correo.com');

    component.guardar();

    expect(component.paso()).toBe(2);
    expect(component.exito()).toBe(false);
  });

  it('onFirmado() debería guardar los datos de la firma en fielData', () => {
    const datosFirma = { rfc: 'GOMA800101AB1', nombre: 'ARTURO GONZALEZ' };
    component.onFirmado(datosFirma);
    expect(component.fielData).toEqual(datosFirma);
  });
});
