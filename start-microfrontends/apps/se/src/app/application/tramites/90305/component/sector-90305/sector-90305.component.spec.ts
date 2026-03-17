import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sector90305Component } from './sector-90305.component';

import { of } from 'rxjs';

import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';

import { CommonModule } from '@angular/common';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';
import { SectorModel  } from '../../models/prosec-modificacion.model';

describe('Sector90305Component', () => {
  let component: Sector90305Component;
  let fixture: ComponentFixture<Sector90305Component>;
  let mockService: ProsecModificacionServiceTsService;

  const MOCK_SECTOR: SectorModel [] = [
    { listaDeSectores: 'Sector A', claveDelSector: '123', estatus: 'Activo' },
    { listaDeSectores: 'Sector B', claveDelSector: '456', estatus: 'Inactivo' }
  ];

  beforeEach(async () => {
    // Creating a simple mock service manually
    mockService = {
      getSector: () => of(MOCK_SECTOR),
    } as ProsecModificacionServiceTsService;

    await TestBed.configureTestingModule({
      imports: [Sector90305Component, CommonModule, TablaDinamicaComponent, TituloComponent],
      providers: [{ provide: ProsecModificacionServiceTsService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Sector90305Component);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and call loadSector()', () => {
    component.ngOnInit();
    expect(component.sectorData).toEqual(MOCK_SECTOR);
  });

  it('should have the correct table configuration', () => {
    const EXPECTED_CONFIG: ConfiguracionColumna<SectorModel >[] = [
      { encabezado: 'Lista de sectores', clave: (item: SectorModel ) => item.listaDeSectores, orden: 1 },
      { encabezado: 'Clave del sector', clave: (item: SectorModel ) => item.claveDelSector, orden: 2 },
      { encabezado: 'Estatus', clave: (item: SectorModel ) => item.estatus, orden: 3 }
    ];
    expect(component.configuracionTabla.map(col => ({
      encabezado: col.encabezado,
      orden: col.orden
    }))).toEqual(EXPECTED_CONFIG.map(col => ({
      encabezado: col.encabezado,
      orden: col.orden
    })));
  });

  it('should call loadSector() and populate sectorData', () => {
    component.loadSector();
    expect(component.sectorData).toEqual(MOCK_SECTOR);
  });
});
