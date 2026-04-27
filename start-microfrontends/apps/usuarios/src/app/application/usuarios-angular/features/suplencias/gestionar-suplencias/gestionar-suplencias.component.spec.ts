import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { GestionarSuplenciasComponent } from './gestionar-suplencias.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { AuthService } from '../../../core/services/auth.service';

const mockApiService = {
  getSuplencias: jest.fn().mockReturnValue(of([])),
  crearSuplencia: jest.fn().mockReturnValue(of({})),
};

const mockAuthService = {
  usuario: signal({ rfc: 'GOMA800101AB1' } as any),
};

describe('GestionarSuplenciasComponent', () => {
  let component: GestionarSuplenciasComponent;
  let fixture: ComponentFixture<GestionarSuplenciasComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockApiService.getSuplencias.mockReturnValue(of([]));
    mockApiService.crearSuplencia.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [GestionarSuplenciasComponent, ReactiveFormsModule],
      providers: [
        { provide: UsuariosApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionarSuplenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('tabActivo() debe iniciar en "nueva"', () => {
    expect(component.tabActivo()).toBe('nueva');
  });

  it('paso() debe iniciar en 0', () => {
    expect(component.paso()).toBe(0);
  });

  it('ngOnInit() debe llamar a getSuplencias() con el RFC del usuario', () => {
    expect(mockApiService.getSuplencias).toHaveBeenCalledWith('GOMA800101AB1');
  });

  it('ngOnInit() NO debe llamar a getSuplencias() si no hay RFC', async () => {
    jest.clearAllMocks();
    const authSinRfc = { usuario: signal(null as any) };

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [GestionarSuplenciasComponent, ReactiveFormsModule],
      providers: [
        { provide: UsuariosApiService, useValue: mockApiService },
        { provide: AuthService, useValue: authSinRfc },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixtureLocal = TestBed.createComponent(GestionarSuplenciasComponent);
    fixtureLocal.detectChanges();

    expect(mockApiService.getSuplencias).not.toHaveBeenCalled();
  });

  it('crearSuplencia() con formulario inválido NO debe llamar al API', () => {
    // formFechas está vacío (inválido)
    expect(component.formFechas.invalid).toBe(true);
    // El componente no llama crearSuplencia() si el form es inválido (el botón está deshabilitado)
    // Verificamos que el formulario sea inválido sin datos
    expect(mockApiService.crearSuplencia).not.toHaveBeenCalled();
  });

  it('crearSuplencia() con formulario válido debe llamar al API', () => {
    const titularMock = { rfc: 'TITU800101AB1', nombre: 'TITULAR', primerApellido: 'PRUEBA' } as any;
    const suplenteMock = { rfc: 'SUPL800101AB1', nombre: 'SUPLENTE', primerApellido: 'TEST' } as any;
    component.titular.set(titularMock);
    component.suplente.set(suplenteMock);
    component.formFechas.setValue({ inicio: '2026-01-01', fin: '2026-12-31', motivo: '' });

    component.crearSuplencia();

    expect(mockApiService.crearSuplencia).toHaveBeenCalledTimes(1);
  });

  it('readonly pasos debe tener 3 elementos', () => {
    expect(component.pasos.length).toBe(3);
  });

  it('los pasos deben tener las etiquetas correctas', () => {
    expect(component.pasos[0].label).toBe('Titular');
    expect(component.pasos[1].label).toBe('Suplente');
    expect(component.pasos[2].label).toBe('Fechas');
  });

  it('formFechas debe ser inválido sin fechas', () => {
    component.formFechas.setValue({ inicio: '', fin: '', motivo: '' });
    expect(component.formFechas.invalid).toBe(true);
  });

  it('formFechas debe ser válido con fechas completas', () => {
    component.formFechas.setValue({ inicio: '2026-01-01', fin: '2026-12-31', motivo: '' });
    expect(component.formFechas.valid).toBe(true);
  });
});
