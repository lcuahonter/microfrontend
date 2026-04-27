import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ShellComponent } from './shell.component';
import { AuthService } from '../../core/services/auth.service';
import { NAV_ITEMS } from './nav-items.constants';

describe('ShellComponent', () => {
  let component: ShellComponent;

  const mockAuthService = {
    usuario: signal<any>(null),
    rol: signal<any>(null),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('estado inicial', () => {
    it('el signal sidenavOpen debería iniciar en true', () => {
      expect(component.sidenavOpen()).toBe(true);
    });

    it('debería exponer la referencia al AuthService como propiedad pública', () => {
      expect(component.auth).toBeDefined();
    });

    it('debería cargar los NAV_ITEMS desde las constantes', () => {
      expect(component.navItems).toBe(NAV_ITEMS);
    });
  });

  describe('NAV_ITEMS', () => {
    it('debería contener el ítem de Dashboard', () => {
      const dashboardItem = component.navItems.find(i => i.route === 'dashboard');
      expect(dashboardItem).toBeDefined();
      expect(dashboardItem?.label).toBe('Dashboard');
    });

    it('debería tener al menos 5 ítems de navegación', () => {
      expect(component.navItems.length).toBeGreaterThanOrEqual(5);
    });

    it('cada ítem de navegación debe tener label, icon y route', () => {
      component.navItems.forEach(item => {
        expect(item.label).toBeTruthy();
        expect(item.icon).toBeTruthy();
        expect(item.route).toBeTruthy();
      });
    });

    it('los NAV_ITEMS del componente deben coincidir con las constantes importadas', () => {
      expect(component.navItems).toEqual(NAV_ITEMS);
    });
  });

  describe('toggleSidenav()', () => {
    it('debería cambiar sidenavOpen de true a false', () => {
      expect(component.sidenavOpen()).toBe(true);
      component.toggleSidenav();
      expect(component.sidenavOpen()).toBe(false);
    });

    it('debería volver a true al llamar toggleSidenav dos veces', () => {
      component.toggleSidenav();
      component.toggleSidenav();
      expect(component.sidenavOpen()).toBe(true);
    });

    it('debería alternar el valor correctamente varias veces', () => {
      component.toggleSidenav(); // false
      expect(component.sidenavOpen()).toBe(false);
      component.toggleSidenav(); // true
      expect(component.sidenavOpen()).toBe(true);
      component.toggleSidenav(); // false
      expect(component.sidenavOpen()).toBe(false);
    });
  });

  describe('integración con AuthService', () => {
    it('debería reflejar el valor del signal usuario del AuthService', () => {
      expect(component.auth.usuario()).toBeNull();

      mockAuthService.usuario.set({
        id: 1,
        rfc: 'GOMA800101AB1',
        nombre: 'Arturo',
        primerApellido: 'González',
      });

      expect(component.auth.usuario()).not.toBeNull();
      expect(component.auth.usuario()?.rfc).toBe('GOMA800101AB1');
    });

    it('debería reflejar el valor del signal rol del AuthService', () => {
      expect(component.auth.rol()).toBeNull();

      mockAuthService.rol.set({
        id: 1,
        nombreRol: 'Operativo General',
        tipoRol: 'OPERATIVO',
        activo: true,
        fechaAsignacion: '2023-01-01',
      });

      expect(component.auth.rol()).not.toBeNull();
      expect(component.auth.rol()?.nombreRol).toBe('Operativo General');
    });

    it('debería llamar a auth.logout() cuando se invoca el método logout del servicio', () => {
      component.auth.logout();
      expect(mockAuthService.logout).toHaveBeenCalled();
    });
  });
});
