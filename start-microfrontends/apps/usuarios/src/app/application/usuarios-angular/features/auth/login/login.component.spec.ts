import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

const mockRouter = { navigate: jest.fn() };

describe('LoginComponent', () => {
  let component: LoginComponent;

  const mockAuthService = {
    loginConPassword: jest.fn().mockReturnValue(
      of({ id: 1, rfc: 'GOMA800101AB1', nombre: 'Arturo', roles: [] })
    ),
    loginConFiel: jest.fn().mockReturnValue(of({})),
    rolesDisponibles: jest.fn().mockReturnValue([]),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockAuthService.loginConPassword.mockReturnValue(
      of({ id: 1, rfc: 'GOMA800101AB1', nombre: 'Arturo', roles: [] })
    );
    mockAuthService.rolesDisponibles.mockReturnValue([]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('estado inicial de signals', () => {
    it('el signal tabActivo debería iniciar en "password"', () => {
      expect(component.tabActivo()).toBe('password');
    });

    it('el signal cargando debería iniciar en false', () => {
      expect(component.cargando()).toBe(false);
    });

    it('el signal error debería iniciar como cadena vacía', () => {
      expect(component.error()).toBe('');
    });

    it('el signal mostrarPass debería iniciar en false', () => {
      expect(component.mostrarPass()).toBe(false);
    });
  });

  describe('loginPassword() - validaciones de formulario', () => {
    it('NO debería llamar al AuthService si el formulario es inválido', () => {
      component.formPassword.setValue({ rfc: '', password: '' });
      component.loginPassword();
      expect(mockAuthService.loginConPassword).not.toHaveBeenCalled();
    });

    it('NO debería llamar al AuthService si solo falta la contraseña', () => {
      component.formPassword.setValue({ rfc: 'GOMA800101AB1', password: '' });
      component.loginPassword();
      expect(mockAuthService.loginConPassword).not.toHaveBeenCalled();
    });

    it('NO debería llamar al AuthService si solo falta el RFC', () => {
      component.formPassword.setValue({ rfc: '', password: 'miContra123' });
      component.loginPassword();
      expect(mockAuthService.loginConPassword).not.toHaveBeenCalled();
    });
  });

  describe('loginPassword() - flujo exitoso', () => {
    it('debería llamar a auth.loginConPassword() con RFC y password válidos', fakeAsync(() => {
      component.formPassword.setValue({ rfc: 'GOMA800101AB1', password: 'miContra123' });
      component.loginPassword();
      tick();
      expect(mockAuthService.loginConPassword).toHaveBeenCalledWith('GOMA800101AB1', 'miContra123');
    }));

    it('debería poner cargando en true durante la petición', () => {
      component.formPassword.setValue({ rfc: 'GOMA800101AB1', password: 'miContra123' });
      mockAuthService.loginConPassword.mockReturnValue(
        new (require('rxjs').Observable)(() => {})
      );
      component.loginPassword();
      expect(component.cargando()).toBe(true);
    });

    it('debería navegar a /dashboard cuando el usuario tiene exactamente 1 rol', fakeAsync(() => {
      mockAuthService.rolesDisponibles.mockReturnValue([
        { id: 1, nombreRol: 'Operativo', tipoRol: 'OPERATIVO', activo: true, fechaAsignacion: '2023-01-01' },
      ]);

      component.formPassword.setValue({ rfc: 'GOMA800101AB1', password: 'pwd' });
      component.loginPassword();
      tick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    }));

    it('debería navegar a /seleccion-rol cuando el usuario tiene más de 1 rol', fakeAsync(() => {
      mockAuthService.rolesDisponibles.mockReturnValue([
        { id: 1, nombreRol: 'Operativo', tipoRol: 'OPERATIVO', activo: true, fechaAsignacion: '2023-01-01' },
        { id: 2, nombreRol: 'Administrador', tipoRol: 'ADMINISTRADOR', activo: true, fechaAsignacion: '2023-02-01' },
      ]);

      component.formPassword.setValue({ rfc: 'PERA750605CD2', password: 'pwd' });
      component.loginPassword();
      tick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/seleccion-rol']);
    }));

    it('debería mostrar el error devuelto por el servicio si la respuesta contiene { error }', fakeAsync(() => {
      mockAuthService.loginConPassword.mockReturnValue(
        of({ error: 'Usuario no encontrado' })
      );

      component.formPassword.setValue({ rfc: 'RFCNOEXISTE', password: 'pwd' });
      component.loginPassword();
      tick();

      expect(component.error()).toBe('Usuario no encontrado');
      expect(component.cargando()).toBe(false);
    }));

    it('debería poner cargando en false después de una respuesta exitosa', fakeAsync(() => {
      mockAuthService.rolesDisponibles.mockReturnValue([
        { id: 1, nombreRol: 'Operativo', tipoRol: 'OPERATIVO', activo: true, fechaAsignacion: '2023-01-01' },
      ]);

      component.formPassword.setValue({ rfc: 'GOMA800101AB1', password: 'pwd' });
      component.loginPassword();
      tick();

      expect(component.cargando()).toBe(false);
    }));
  });

  describe('loginPassword() - flujo con error HTTP', () => {
    it('debería establecer el mensaje de error de conexión cuando el servidor falla', fakeAsync(() => {
      mockAuthService.loginConPassword.mockReturnValue(
        throwError(() => new Error('500 Internal Server Error'))
      );

      component.formPassword.setValue({ rfc: 'GOMA800101AB1', password: 'pwd' });
      component.loginPassword();
      tick();

      expect(component.error()).toBe('Error al conectar con el servidor.');
      expect(component.cargando()).toBe(false);
    }));

    it('debería poner cargando en false después de un error HTTP', fakeAsync(() => {
      mockAuthService.loginConPassword.mockReturnValue(
        throwError(() => new Error('Network Error'))
      );

      component.formPassword.setValue({ rfc: 'GOMA800101AB1', password: 'pwd' });
      component.loginPassword();
      tick();

      expect(component.cargando()).toBe(false);
    }));

    it('debería limpiar el error previo al iniciar una nueva petición', fakeAsync(() => {
      mockAuthService.loginConPassword.mockReturnValueOnce(
        throwError(() => new Error('error'))
      );
      component.formPassword.setValue({ rfc: 'GOMA800101AB1', password: 'pwd' });
      component.loginPassword();
      tick();
      expect(component.error()).toBe('Error al conectar con el servidor.');

      mockAuthService.loginConPassword.mockReturnValue(
        new (require('rxjs').Observable)(() => {})
      );
      component.loginPassword();
      expect(component.error()).toBe('');
    }));
  });

  describe('loginFiel()', () => {
    it('debería navegar a /dashboard al recibir el resultado de la firma', () => {
      component.loginFiel({ cer: 'mock-cer', key: 'mock-key' });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('cambio de tab', () => {
    it('debería cambiar tabActivo a "fiel" al modificar el signal', () => {
      component.tabActivo.set('fiel');
      expect(component.tabActivo()).toBe('fiel');
    });

    it('debería regresar tabActivo a "password"', () => {
      component.tabActivo.set('fiel');
      component.tabActivo.set('password');
      expect(component.tabActivo()).toBe('password');
    });
  });
});
