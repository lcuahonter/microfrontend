import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { DesasignarRolesComponent } from './desasignar-roles.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

const mockApiService = {
  desasignarRoles: jest.fn().mockReturnValue(of({})),
};

const mockUsuario: any = {
  rfc: 'GOMA800101AB1',
  nombre: 'GOMEZ',
  primerApellido: 'MARTINEZ',
  roles: [{ id: 1, nombreRol: 'OPERATIVO', tipoRol: 'OPERATIVO', activo: true }],
};

describe('DesasignarRolesComponent', () => {
  let component: DesasignarRolesComponent;
  let fixture: ComponentFixture<DesasignarRolesComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockApiService.desasignarRoles.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [DesasignarRolesComponent, ReactiveFormsModule],
      providers: [
        { provide: UsuariosApiService, useValue: mockApiService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DesasignarRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('onUsuarioSeleccionado(usuario) debe actualizar usuario()', () => {
    component.onUsuarioSeleccionado(mockUsuario);
    expect(component.usuario()).toEqual(mockUsuario);
  });

  it('onUsuarioSeleccionado(usuario) debe resetear motivoCtrl', () => {
    component.motivoCtrl.setValue('motivo previo');
    component.onUsuarioSeleccionado(mockUsuario);
    expect(component.motivoCtrl.value).toBeFalsy();
  });

  it('onUsuarioSeleccionado(usuario) debe limpiar rolesSeleccionados', () => {
    component.rolesSeleccionados = [1, 2];
    component.onUsuarioSeleccionado(mockUsuario);
    expect(component.rolesSeleccionados).toEqual([]);
  });

  it('toggleRol(id, event) con checked=true debe añadir el id a rolesSeleccionados', () => {
    const event = { target: { checked: true } } as unknown as Event;
    component.toggleRol(1, event);
    expect(component.rolesSeleccionados).toContain(1);
  });

  it('toggleRol(id, event) con checked=false debe quitar el id de rolesSeleccionados', () => {
    component.rolesSeleccionados = [1, 2];
    const event = { target: { checked: false } } as unknown as Event;
    component.toggleRol(1, event);
    expect(component.rolesSeleccionados).not.toContain(1);
    expect(component.rolesSeleccionados).toContain(2);
  });

  it('desasignar() debe llamar a api.desasignarRoles() con los datos correctos', () => {
    component.onUsuarioSeleccionado(mockUsuario);
    const eventCheck = { target: { checked: true } } as unknown as Event;
    component.toggleRol(1, eventCheck);
    component.motivoCtrl.setValue('Motivo de prueba');

    component.desasignar();

    expect(mockApiService.desasignarRoles).toHaveBeenCalledWith({
      rfcUsuario: 'GOMA800101AB1',
      rolIds: [1],
      motivo: 'Motivo de prueba',
    });
  });

  it('tras éxito de desasignar(), exito() debe ser true', () => {
    component.onUsuarioSeleccionado(mockUsuario);
    const eventCheck = { target: { checked: true } } as unknown as Event;
    component.toggleRol(1, eventCheck);
    component.motivoCtrl.setValue('Motivo de prueba');

    component.desasignar();

    expect(component.exito()).toBe(true);
  });

  it('tras éxito de desasignar(), rolesSeleccionados debe quedar vacío', () => {
    component.onUsuarioSeleccionado(mockUsuario);
    const eventCheck = { target: { checked: true } } as unknown as Event;
    component.toggleRol(1, eventCheck);
    component.motivoCtrl.setValue('Motivo de prueba');

    component.desasignar();

    expect(component.rolesSeleccionados).toEqual([]);
  });
});
