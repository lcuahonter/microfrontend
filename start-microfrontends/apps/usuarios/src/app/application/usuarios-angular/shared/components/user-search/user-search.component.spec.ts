import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { UserSearchComponent } from './user-search.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { Usuario } from '../../../core/models/usuario.model';

const mockUsuario: Partial<Usuario> = {
  rfc: 'GOMA800101AB1',
  nombre: 'GOMEZ',
  primerApellido: 'MARTINEZ',
  segundoApellido: '',
  tipoPersona: 'FISICA' as any,
  estatus: 'ACTIVO' as any,
  correo: 'test@test.com',
  fechaRegistro: '2024-01-01',
  roles: [],
};

const mockUsuariosApiService = {
  buscarUsuario: jest.fn().mockReturnValue(of(mockUsuario as Usuario)),
};

describe('UserSearchComponent', () => {
  let component: UserSearchComponent;
  let fixture: ComponentFixture<UserSearchComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [UserSearchComponent],
      providers: [
        { provide: UsuariosApiService, useValue: mockUsuariosApiService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Estado inicial de signals', () => {
    it('debería iniciar el signal "cargando" en false', () => {
      expect(component.cargando()).toBe(false);
    });

    it('debería iniciar el signal "noEncontrado" en false', () => {
      expect(component.noEncontrado()).toBe(false);
    });

    it('debería iniciar el signal "usuario" en null', () => {
      expect(component.usuario()).toBeNull();
    });
  });

  describe('buscar()', () => {
    it('NO debería llamar al API si el formulario es inválido (RFC vacío)', () => {
      component.form.get('rfc')!.setValue('');
      component.buscar();
      expect(mockUsuariosApiService.buscarUsuario).not.toHaveBeenCalled();
    });

    it('debería llamar al API con buscarUsuario cuando el RFC es válido', () => {
      component.form.get('rfc')!.setValue('GOMA800101AB1');
      component.buscar();
      expect(mockUsuariosApiService.buscarUsuario).toHaveBeenCalledWith('GOMA800101AB1');
    });

    it('debería convertir el RFC a mayúsculas antes de llamar al API', () => {
      component.form.get('rfc')!.setValue('goma800101ab1');
      component.buscar();
      expect(mockUsuariosApiService.buscarUsuario).toHaveBeenCalledWith('GOMA800101AB1');
    });

    it('debería poner "cargando" en false después de recibir la respuesta del API', () => {
      component.form.get('rfc')!.setValue('GOMA800101AB1');
      component.buscar();
      expect(component.cargando()).toBe(false);
    });

    it('debería poner "noEncontrado" en true cuando el API retorna null', () => {
      mockUsuariosApiService.buscarUsuario.mockReturnValue(of(null));
      component.form.get('rfc')!.setValue('GOMA800101AB1');
      component.buscar();
      expect(component.noEncontrado()).toBe(true);
    });

    it('debería poner "noEncontrado" en false cuando el API retorna un usuario', () => {
      mockUsuariosApiService.buscarUsuario.mockReturnValue(of(mockUsuario as Usuario));
      component.form.get('rfc')!.setValue('GOMA800101AB1');
      component.buscar();
      expect(component.noEncontrado()).toBe(false);
    });

    it('debería establecer el signal "usuario" cuando el API retorna un usuario', () => {
      mockUsuariosApiService.buscarUsuario.mockReturnValue(of(mockUsuario as Usuario));
      component.form.get('rfc')!.setValue('GOMA800101AB1');
      component.buscar();
      expect(component.usuario()).toEqual(mockUsuario);
    });

    it('debería resetear el signal "usuario" a null cuando el API retorna null', () => {
      // Primero establecer un usuario
      component.form.get('rfc')!.setValue('GOMA800101AB1');
      component.buscar();

      // Luego buscar de nuevo y retornar null
      mockUsuariosApiService.buscarUsuario.mockReturnValue(of(null));
      component.buscar();
      expect(component.usuario()).toBeNull();
    });
  });

  describe('Output seleccionado', () => {
    it('debería emitir el usuario a través del output "seleccionado" al llamar seleccionar()', () => {
      mockUsuariosApiService.buscarUsuario.mockReturnValue(of(mockUsuario as Usuario));
      component.form.get('rfc')!.setValue('GOMA800101AB1');
      component.buscar();

      const emitSpy = jest.spyOn(component.seleccionado, 'emit');
      component.seleccionar();

      expect(emitSpy).toHaveBeenCalledWith(mockUsuario);
    });

    it('no debería emitir el output "seleccionado" si no hay usuario encontrado', () => {
      mockUsuariosApiService.buscarUsuario.mockReturnValue(of(null));
      component.form.get('rfc')!.setValue('GOMA800101AB1');
      component.buscar();

      const emitSpy = jest.spyOn(component.seleccionado, 'emit');
      component.seleccionar();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
