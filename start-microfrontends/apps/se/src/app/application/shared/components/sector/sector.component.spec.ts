import { TestBed } from '@angular/core/testing';
import { SectorComponent } from './sector.component';
import { CommonModule } from '@angular/common';
import { TablaDinamicaComponent, TituloComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { SECTOR } from '../../constantes/complementaria.enum';
import { SectorTabla } from '../../models/complementaria.model';

describe('SectorComponent', () => {
  let component: SectorComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule, 
        TablaDinamicaComponent, 
        TituloComponent,
        SectorComponent
      ],
    });

    component = TestBed.createComponent(SectorComponent).componentInstance;
  });

  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize with empty sectorTablaDatos array', () => {
    expect(component.sectorTablaDatos).toEqual([]);
  });

  test('should set SectorTabla correctly', () => {
    expect(component.SectorTabla).toEqual(SECTOR);
  });

  test('should set TablaSeleccion correctly', () => {
    expect(component.tablaSeleccion).toBe(TablaSeleccion);
  });

  test('should accept input data', () => {
    const mockData: SectorTabla[] = [
      {
        "listaDeSectores": "De la Industria Eléctrica",
        "claveDelSector": "I",
        "estatus": "Autorizada"
      }
    ];
    component.sectorTablaDatos = mockData;
    expect(component.sectorTablaDatos).toEqual(mockData);
  });
});