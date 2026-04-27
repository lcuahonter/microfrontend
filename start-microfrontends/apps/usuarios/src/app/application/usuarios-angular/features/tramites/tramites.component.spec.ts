import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { TramitesComponent } from './tramites.component';
import { UsuariosApiService } from '../../core/services/usuarios-api.service';

const mockCatalogoTramites = [
  { id: 1, clave: 'T001', nombre: 'Trámite 1', descripcion: 'Desc 1' },
];

const mockApiService = {
  getCatalogoTramites: jest.fn().mockReturnValue(of(mockCatalogoTramites)),
  asignarTramites: jest.fn().mockReturnValue(of({})),
};

describe('TramitesComponent', () => {
  let component: TramitesComponent;
  let fixture: ComponentFixture<TramitesComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockApiService.getCatalogoTramites.mockReturnValue(of(mockCatalogoTramites));
    mockApiService.asignarTramites.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [TramitesComponent, CommonModule],
      providers: [
        { provide: UsuariosApiService, useValue: mockApiService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TramitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('tabActivo() debe iniciar en "asignar"', () => {
    expect(component.tabActivo()).toBe('asignar');
  });

  it('ngOnInit() debe llamar a getCatalogoTramites()', () => {
    expect(mockApiService.getCatalogoTramites).toHaveBeenCalledTimes(1);
  });

  it('ngOnInit() debe cargar el catálogo de trámites en el signal', () => {
    expect(component.catalogoTramites()).toEqual(mockCatalogoTramites);
  });

  it('onUsuario(usuario) debe actualizar usuario()', () => {
    const usuarioMock = { rfc: 'GOMA800101AB1', nombre: 'GOMEZ', primerApellido: 'MARTINEZ' } as any;
    component.onUsuario(usuarioMock);
    expect(component.usuario()).toEqual(usuarioMock);
  });

  it('onUsuario(usuario) debe resetear exito a false', () => {
    component.exito.set(true);
    const usuarioMock = { rfc: 'GOMA800101AB1', nombre: 'GOMEZ', primerApellido: 'MARTINEZ' } as any;
    component.onUsuario(usuarioMock);
    expect(component.exito()).toBe(false);
  });

  it('asignar() debe llamar a api.asignarTramites() con el RFC y trámites seleccionados', () => {
    const usuarioMock = { rfc: 'GOMA800101AB1', nombre: 'GOMEZ', primerApellido: 'MARTINEZ' } as any;
    component.onUsuario(usuarioMock);
    component.tramitesSeleccionados = [1];

    component.asignar();

    expect(mockApiService.asignarTramites).toHaveBeenCalledWith('GOMA800101AB1', [1]);
  });

  it('tras éxito de asignar(), exito() debe ser true', () => {
    const usuarioMock = { rfc: 'GOMA800101AB1', nombre: 'GOMEZ', primerApellido: 'MARTINEZ' } as any;
    component.onUsuario(usuarioMock);
    component.tramitesSeleccionados = [1];

    component.asignar();

    expect(component.exito()).toBe(true);
  });

  it('asignar() debe llamar al API con múltiples trámites', () => {
    const usuarioMock = { rfc: 'GOMA800101AB1', nombre: 'GOMEZ', primerApellido: 'MARTINEZ' } as any;
    component.onUsuario(usuarioMock);
    component.tramitesSeleccionados = [1, 2, 3];

    component.asignar();

    expect(mockApiService.asignarTramites).toHaveBeenCalledWith('GOMA800101AB1', [1, 2, 3]);
  });
});
