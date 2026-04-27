import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { UsuariosApiService } from '../../core/services/usuarios-api.service';
import { AuthService } from '../../core/services/auth.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockApiService: any;
  let mockAuthService: any;

  const usuariosMock = [
    {
      rfc: 'GOMA800101AB1',
      nombre: 'GOMEZ',
      primerApellido: 'MARTINEZ',
      tipoPersona: 'FISICA',
      estatus: 'ACTIVO',
      fechaRegistro: '2024-01-01',
    },
  ];

  beforeEach(async () => {
    mockApiService = {
      listarUsuarios: jest.fn().mockReturnValue(of(usuariosMock)),
    };

    mockAuthService = {
      usuario: signal(null as any),
      rol: signal(null as any),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        { provide: UsuariosApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería iniciar con cargando() en true antes de ngOnInit', () => {
    // Antes de disparar detectChanges (que llama ngOnInit), cargando debe ser true
    expect(component.cargando()).toBe(true);
  });

  it('debería llamar a listarUsuarios() al inicializar', () => {
    fixture.detectChanges();
    expect(mockApiService.listarUsuarios).toHaveBeenCalledTimes(1);
  });

  it('debería poner cargando() en false tras respuesta exitosa', () => {
    fixture.detectChanges();
    expect(component.cargando()).toBe(false);
  });

  it('debería poblar usuarios() con la lista recibida', () => {
    fixture.detectChanges();
    expect(component.usuarios()).toEqual(usuariosMock);
  });

  it('debería tener exactamente 4 elementos en kpis', () => {
    fixture.detectChanges();
    expect(component.kpis.length).toBe(4);
  });

  it('debería tener exactamente 5 elementos en quickActions', () => {
    fixture.detectChanges();
    expect(component.quickActions.length).toBe(5);
  });
});
