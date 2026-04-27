import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { RolAsignado, TipoRol } from '../models/usuario.model';

const mockRouter = { navigate: jest.fn() };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('estado inicial de signals', () => {
    it('el signal usuario debería iniciar en null', () => {
      expect(service.usuario()).toBeNull();
    });

    it('el signal rol debería iniciar en null', () => {
      expect(service.rol()).toBeNull();
    });

    it('el signal logueado debería iniciar en false', () => {
      expect(service.logueado()).toBe(false);
    });

    it('rolesDisponibles debería retornar array vacío cuando no hay sesión', () => {
      expect(service.rolesDisponibles()).toEqual([]);
    });
  });

  describe('loginConPassword()', () => {
    it('debería retornar error cuando el RFC no existe en el mock', fakeAsync(() => {
      let resultado: any;
      service.loginConPassword('RFCNOEXISTE', 'password123').subscribe(res => {
        resultado = res;
      });
      tick(1000);
      expect(resultado).toEqual({ error: 'Usuario no encontrado' });
    }));

    it('debería autenticar al usuario demo GOMA800101AB1 sin HTTP', fakeAsync(() => {
      let resultado: any;
      service.loginConPassword('GOMA800101AB1', 'cualquier-password').subscribe(res => {
        resultado = res;
      });
      tick(1500);
      expect(resultado).toBeTruthy();
      expect((resultado as any).rfc).toBe('GOMA800101AB1');
    }));

    it('debería establecer la sesión al autenticar con GOMA800101AB1', fakeAsync(() => {
      service.loginConPassword('GOMA800101AB1', 'cualquier-password').subscribe();
      tick(1500);
      expect(service.usuario()).not.toBeNull();
      expect(service.usuario()?.rfc).toBe('GOMA800101AB1');
    }));

    it('debería establecer logueado en true tras autenticación exitosa', fakeAsync(() => {
      service.loginConPassword('GOMA800101AB1', 'cualquier-password').subscribe();
      tick(1500);
      expect(service.logueado()).toBe(true);
    }));

    it('debería establecer el rol activo al autenticar con un usuario con un solo rol', fakeAsync(() => {
      service.loginConPassword('GOMA800101AB1', 'cualquier-password').subscribe();
      tick(1500);
      expect(service.rol()).not.toBeNull();
      expect(service.rol()?.nombreRol).toBe('Operativo General');
    }));

    it('debería retornar múltiples roles disponibles con PERA750605CD2 (dos roles)', fakeAsync(() => {
      service.loginConPassword('PERA750605CD2', 'cualquier-password').subscribe();
      tick(1500);
      expect(service.rolesDisponibles().length).toBeGreaterThan(1);
    }));

    it('debería emitir el observable correctamente (sin errores HTTP)', fakeAsync(() => {
      let completado = false;
      service.loginConPassword('GOMA800101AB1', 'pwd').subscribe({
        complete: () => { completado = true; },
      });
      tick(1500);
      expect(completado).toBe(true);
    }));
  });

  describe('logout()', () => {
    it('debería resetear el signal usuario a null', fakeAsync(() => {
      service.loginConPassword('GOMA800101AB1', 'pwd').subscribe();
      tick(1500);
      expect(service.usuario()).not.toBeNull();

      service.logout();
      expect(service.usuario()).toBeNull();
    }));

    it('debería resetear el signal rol a null', fakeAsync(() => {
      service.loginConPassword('GOMA800101AB1', 'pwd').subscribe();
      tick(1500);
      expect(service.rol()).not.toBeNull();

      service.logout();
      expect(service.rol()).toBeNull();
    }));

    it('debería resetear logueado a false', fakeAsync(() => {
      service.loginConPassword('GOMA800101AB1', 'pwd').subscribe();
      tick(1500);
      expect(service.logueado()).toBe(true);

      service.logout();
      expect(service.logueado()).toBe(false);
    }));

    it('debería navegar a /login al hacer logout', fakeAsync(() => {
      service.loginConPassword('GOMA800101AB1', 'pwd').subscribe();
      tick(1500);

      service.logout();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    }));
  });

  describe('seleccionarRol()', () => {
    it('debería actualizar el rol activo en la sesión', fakeAsync(() => {
      service.loginConPassword('PERA750605CD2', 'pwd').subscribe();
      tick(1500);

      const nuevoRol: RolAsignado = {
        id: 3,
        nombreRol: 'Administrador',
        tipoRol: TipoRol.ADMINISTRADOR,
        fechaAsignacion: '2023-01-10',
        activo: true,
      };

      service.seleccionarRol(nuevoRol);
      expect(service.rol()?.id).toBe(3);
      expect(service.rol()?.nombreRol).toBe('Administrador');
    }));

    it('no debería fallar si no hay sesión activa', () => {
      const rol: RolAsignado = {
        id: 1,
        nombreRol: 'Operativo',
        tipoRol: TipoRol.OPERATIVO,
        fechaAsignacion: '2023-01-01',
        activo: true,
      };
      expect(() => service.seleccionarRol(rol)).not.toThrow();
    });
  });

  describe('getSesion()', () => {
    it('debería retornar null cuando no hay sesión', () => {
      expect(service.getSesion()).toBeNull();
    });

    it('debería retornar la sesión activa tras autenticación', fakeAsync(() => {
      service.loginConPassword('GOMA800101AB1', 'pwd').subscribe();
      tick(1500);
      const sesion = service.getSesion();
      expect(sesion).not.toBeNull();
      expect(sesion?.usuario.rfc).toBe('GOMA800101AB1');
      expect(sesion?.token).toContain('mock-token-');
    }));
  });
});
