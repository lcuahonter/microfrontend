import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { SeleccionRolComponent } from './seleccion-rol.component';
import { AuthService } from '../../../core/services/auth.service';
import { RolAsignado, TipoRol } from '../../../core/models/usuario.model';

const mockRouter = { navigate: jest.fn() };

describe('SeleccionRolComponent', () => {
  let component: SeleccionRolComponent;

  const mockRol: RolAsignado = {
    id: 1,
    nombreRol: 'OPERATIVO',
    tipoRol: TipoRol.OPERATIVO,
    activo: true,
    fechaAsignacion: '2023-01-01',
  };

  const mockRolAdmin: RolAsignado = {
    id: 2,
    nombreRol: 'Administrador',
    tipoRol: TipoRol.ADMINISTRADOR,
    activo: true,
    fechaAsignacion: '2023-06-01',
  };

  const mockAuthService = {
    rolesDisponibles: jest.fn().mockReturnValue([mockRol, mockRolAdmin]),
    seleccionarRol: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockAuthService.rolesDisponibles.mockReturnValue([mockRol, mockRolAdmin]);

    await TestBed.configureTestingModule({
      imports: [SeleccionRolComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(SeleccionRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('inicialización', () => {
    it('debería cargar los roles disponibles desde el AuthService', () => {
      expect(component.roles).toEqual([mockRol, mockRolAdmin]);
    });

    it('debería iniciar con el mapa de iconos definido', () => {
      expect(component.iconMap).toBeDefined();
      expect(component.iconMap['OPERATIVO']).toBe('bi-briefcase');
      expect(component.iconMap['AUTORIZADOR']).toBe('bi-shield-check');
      expect(component.iconMap['ADMINISTRADOR']).toBe('bi-person-gear');
      expect(component.iconMap['FUNCIONARIO']).toBe('bi-bank');
    });
  });

  describe('seleccionar()', () => {
    it('debería llamar a auth.seleccionarRol() con el rol seleccionado', () => {
      component.seleccionar(mockRol);
      expect(mockAuthService.seleccionarRol).toHaveBeenCalledWith(mockRol);
    });

    it('debería llamar a auth.seleccionarRol() con el rol correcto cuando hay múltiples roles', () => {
      component.seleccionar(mockRolAdmin);
      expect(mockAuthService.seleccionarRol).toHaveBeenCalledWith(mockRolAdmin);
    });

    it('debería navegar a /dashboard después de seleccionar un rol', () => {
      component.seleccionar(mockRol);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('debería llamar primero a seleccionarRol y luego navegar', () => {
      const callOrder: string[] = [];
      mockAuthService.seleccionarRol.mockImplementation(() => {
        callOrder.push('seleccionarRol');
      });
      mockRouter.navigate.mockImplementation(() => {
        callOrder.push('navigate');
        return Promise.resolve(true);
      });

      component.seleccionar(mockRol);

      expect(callOrder[0]).toBe('seleccionarRol');
      expect(callOrder[1]).toBe('navigate');
    });

    it('debería navegar a /dashboard al seleccionar el segundo rol disponible', () => {
      component.seleccionar(mockRolAdmin);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('cuando no hay roles disponibles', () => {
    let localComponent: SeleccionRolComponent;

    beforeEach(async () => {
      // El módulo ya está configurado por el beforeEach externo.
      // Solo actualizamos el mock y creamos una nueva instancia del componente.
      mockAuthService.rolesDisponibles.mockReturnValue([]);
      const localFixture = TestBed.createComponent(SeleccionRolComponent);
      localComponent = localFixture.componentInstance;
      localFixture.detectChanges();
    });

    it('debería tener un array de roles vacío', () => {
      expect(localComponent.roles).toEqual([]);
    });
  });
});
