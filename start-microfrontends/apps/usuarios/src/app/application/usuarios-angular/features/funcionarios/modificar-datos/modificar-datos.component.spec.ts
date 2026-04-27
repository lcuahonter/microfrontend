import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { ModificarDatosComponent } from './modificar-datos.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

const mockApiService = {
  modificarDatos: jest.fn().mockReturnValue(of({})),
};

const mockUsuario: any = {
  rfc: 'GOMA800101AB1',
  nombre: 'GOMEZ',
  primerApellido: 'MARTINEZ',
  segundoApellido: '',
};

describe('ModificarDatosComponent', () => {
  let component: ModificarDatosComponent;
  let fixture: ComponentFixture<ModificarDatosComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockApiService.modificarDatos.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ModificarDatosComponent, ReactiveFormsModule],
      providers: [
        { provide: UsuariosApiService, useValue: mockApiService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('paso() debe iniciar en 0', () => {
    expect(component.paso()).toBe(0);
  });

  it('onUsuario(usuario) debe setear usuario()', () => {
    component.onUsuario(mockUsuario);
    expect(component.usuario()).toEqual(mockUsuario);
  });

  it('onUsuario(usuario) debe parchear el formulario con los datos del usuario', () => {
    component.onUsuario(mockUsuario);
    expect(component.form.value.nombre).toBe('GOMEZ');
    expect(component.form.value.primerApellido).toBe('MARTINEZ');
    expect(component.form.value.segundoApellido).toBe('');
  });

  it('form debe tener el control nombre', () => {
    expect(component.form.get('nombre')).toBeTruthy();
  });

  it('form debe tener el control primerApellido', () => {
    expect(component.form.get('primerApellido')).toBeTruthy();
  });

  it('form debe tener el control segundoApellido', () => {
    expect(component.form.get('segundoApellido')).toBeTruthy();
  });

  it('nombre es requerido en el form', () => {
    const ctrl = component.form.get('nombre');
    ctrl!.setValue('');
    ctrl!.markAsTouched();
    expect(ctrl!.hasError('required')).toBe(true);
  });

  it('primerApellido es requerido en el form', () => {
    const ctrl = component.form.get('primerApellido');
    ctrl!.setValue('');
    ctrl!.markAsTouched();
    expect(ctrl!.hasError('required')).toBe(true);
  });

  it('segundoApellido NO es requerido en el form', () => {
    const ctrl = component.form.get('segundoApellido');
    ctrl!.setValue('');
    expect(ctrl!.hasError('required')).toBe(false);
  });

  it('readonly pasos debe tener 3 elementos', () => {
    expect(component.pasos.length).toBe(3);
  });

  it('los pasos deben tener las etiquetas correctas', () => {
    expect(component.pasos[0].label).toBe('Buscar');
    expect(component.pasos[1].label).toBe('Editar');
    expect(component.pasos[2].label).toBe('Confirmar');
  });

  it('guardar() debe llamar a api.modificarDatos() con los datos del formulario', () => {
    component.onUsuario(mockUsuario);
    component.form.patchValue({ nombre: 'NUEVO NOMBRE', primerApellido: 'NUEVO APELLIDO', segundoApellido: '' });

    component.guardar();

    expect(mockApiService.modificarDatos).toHaveBeenCalledWith('GOMA800101AB1', {
      nombre: 'NUEVO NOMBRE',
      primerApellido: 'NUEVO APELLIDO',
      segundoApellido: undefined,
    });
  });
});
