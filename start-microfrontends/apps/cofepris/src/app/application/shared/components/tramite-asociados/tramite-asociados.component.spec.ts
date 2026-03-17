import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TramiteAsociadosComponent } from './tramite-asociados.component';
import { CommonModule } from '@angular/common';
import { TituloComponent, TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { TramiteAsociados } from '../../models/tramite-asociados.model';

describe('TramiteAsociadosComponent', () => {
  let component: TramiteAsociadosComponent;
  let fixture: ComponentFixture<TramiteAsociadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, TituloComponent, TablaDinamicaComponent, TramiteAsociadosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TramiteAsociadosComponent);
    component = fixture.componentInstance;

    component.configuracionTabla = [
      { encabezado: '', clave: (item: TramiteAsociados) => item.id, orden: 1 },
      {
        encabezado: 'Folio trámite',
        clave: (item: TramiteAsociados) => item.folioTramite,
        orden: 2,
      },
      {
        encabezado: 'Tipo trámite',
        clave: (item: TramiteAsociados) => item.tipoTramite,
        orden: 3,
      },
      {
        encabezado: 'Estatus',
        clave: (item: TramiteAsociados) => item.estatus,
        orden: 4,
      },
      {
        encabezado: 'Fecha alta de registro',
        clave: (item: TramiteAsociados) => item.fetchaAltaDeRegistro,
        orden: 5,
      },
    ] as ConfiguracionColumna<TramiteAsociados>[];

    component.tramiteAsociados = [
      { id: 1, folioTramite: 12345, tipoTramite: 'Tipo A', estatus: 'Activo', fetchaAltaDeRegistro: "2025-03-08" },
    ] as TramiteAsociados[];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize configuracionTabla', () => {
    expect(component.configuracionTabla).toBeDefined();
    expect(component.configuracionTabla.length).toBe(5);
    expect(component.configuracionTabla[1].encabezado).toBe('Folio trámite');
    expect(component.configuracionTabla[2].encabezado).toBe('Tipo trámite');
    expect(component.configuracionTabla[3].encabezado).toBe('Estatus');
    expect(component.configuracionTabla[4].encabezado).toBe('Fecha alta de registro');
  });

  it('should initialize tramiteAsociados', () => {
    expect(component.tramiteAsociados).toBeDefined();
    expect(component.tramiteAsociados.length).toBe(1);
    expect(component.tramiteAsociados[0].id).toBe(1);
    expect(component.tramiteAsociados[0].folioTramite).toBe(12345);
    expect(component.tramiteAsociados[0].tipoTramite).toBe('Tipo A');
    expect(component.tramiteAsociados[0].estatus).toBe('Activo');
    expect(component.tramiteAsociados[0].fetchaAltaDeRegistro).toBe('2025-03-08');
  });
});