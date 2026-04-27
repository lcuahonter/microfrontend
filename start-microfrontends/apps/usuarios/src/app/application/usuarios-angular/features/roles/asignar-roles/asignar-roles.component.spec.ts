import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { AsignarRolesComponent } from './asignar-roles.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

const mockCatalogos = {
  roles: [{ id: 1, nombre: 'OPERATIVO', tipoRol: 'OPERATIVO' }],
  dependencias: [{ id: 1, nombre: 'SAT' }],
  unidades: [{ id: 1, nombre: 'UA1', dependenciaId: 1 }],
};

const mockApiService = {
  getCatalogosRoles: jest.fn().mockReturnValue(of(mockCatalogos)),
  asignarRol: jest.fn().mockReturnValue(of({})),
};

describe('AsignarRolesComponent', () => {
  let component: AsignarRolesComponent;
  let fixture: ComponentFixture<AsignarRolesComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockApiService.getCatalogosRoles.mockReturnValue(of(mockCatalogos));
    mockApiService.asignarRol.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [AsignarRolesComponent, ReactiveFormsModule],
      providers: [
        { provide: UsuariosApiService, useValue: mockApiService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignarRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('paso() debe iniciar en 0', () => {
    expect(component.paso()).toBe(0);
  });

  it('ngOnInit() debe llamar a getCatalogosRoles()', () => {
    expect(mockApiService.getCatalogosRoles).toHaveBeenCalledTimes(1);
  });

  it('ngOnInit() debe cargar los catálogos en el signal', () => {
    expect(component.catalogos()).toEqual(mockCatalogos);
  });

  it('onUsuarioSeleccionado(usuario) debe actualizar usuarioSeleccionado', () => {
    const usuarioMock = { rfc: 'TEST800101AB1', nombre: 'TEST', primerApellido: 'PRUEBA' } as any;
    component.onUsuarioSeleccionado(usuarioMock);
    expect(component.usuarioSeleccionado()).toEqual(usuarioMock);
  });

  it('irPaso(i) debe permitir ir a un paso anterior', () => {
    component.paso.set(2);
    component.irPaso(1);
    expect(component.paso()).toBe(1);
  });

  it('irPaso(i) NO debe ir a un paso mayor que el actual', () => {
    component.paso.set(1);
    component.irPaso(2);
    expect(component.paso()).toBe(1);
  });

  it('irPaso(i) NO debe moverse si se intenta ir al mismo paso', () => {
    component.paso.set(1);
    component.irPaso(1);
    expect(component.paso()).toBe(1);
  });

  it('onDependenciaChange() debe filtrar unidadesFiltradas por dependenciaId', () => {
    // primero cargar los catálogos
    expect(component.catalogos()).toEqual(mockCatalogos);

    const eventMock = { target: { value: '1' } } as unknown as Event;
    component.onDependenciaChange(eventMock);

    expect(component.unidadesFiltradas().length).toBe(1);
    expect(component.unidadesFiltradas()[0].nombre).toBe('UA1');
  });

  it('onDependenciaChange() con dependencia inexistente debe retornar arreglo vacío', () => {
    const eventMock = { target: { value: '99' } } as unknown as Event;
    component.onDependenciaChange(eventMock);
    expect(component.unidadesFiltradas()).toEqual([]);
  });

  it('readonly pasos debe tener 3 elementos', () => {
    expect(component.pasos.length).toBe(3);
  });

  it('los pasos deben tener las etiquetas correctas', () => {
    expect(component.pasos[0].label).toBe('Buscar Usuario');
    expect(component.pasos[1].label).toBe('Asignar Rol');
    expect(component.pasos[2].label).toBe('Asignar Trámites');
  });

  it('formRol debe ser inválido sin rolId', () => {
    component.formRol.get('rolId')?.setValue('');
    expect(component.formRol.invalid).toBe(true);
  });

  it('formRol debe ser válido con rolId', () => {
    component.formRol.get('rolId')?.setValue('1');
    expect(component.formRol.valid).toBe(true);
  });

  describe('guardar()', () => {
    it('no debe llamar a la API si no hay usuarioSeleccionado', () => {
      component.guardar();
      expect(mockApiService.asignarRol).not.toHaveBeenCalled();
    });

    it('debe llamar a api.asignarRol con los datos del formulario', () => {
      const usuarioMock = { rfc: 'TEST800101AB1', nombre: 'TEST' } as any;
      component.onUsuarioSeleccionado(usuarioMock);
      component.formRol.patchValue({ rolId: '1', dependenciaId: '', unidadId: '' });
      component.guardar();
      expect(mockApiService.asignarRol).toHaveBeenCalledWith(
        expect.objectContaining({ rfcUsuario: 'TEST800101AB1', rolId: 1 })
      );
    });

    it('debe poner exito=true y cargando=false en respuesta exitosa', () => {
      const usuarioMock = { rfc: 'TEST800101AB1', nombre: 'TEST' } as any;
      component.onUsuarioSeleccionado(usuarioMock);
      component.formRol.patchValue({ rolId: '1' });
      component.guardar();
      expect(component.exito()).toBe(true);
      expect(component.cargando()).toBe(false);
    });

    it('debe poner error y cargando=false cuando la API falla', () => {
      mockApiService.asignarRol.mockReturnValue(throwError(() => new Error('error')));
      const usuarioMock = { rfc: 'TEST800101AB1', nombre: 'TEST' } as any;
      component.onUsuarioSeleccionado(usuarioMock);
      component.formRol.patchValue({ rolId: '1' });
      component.guardar();
      expect(component.error()).toBe('Error al asignar el rol.');
      expect(component.cargando()).toBe(false);
    });
  });
});
