import { TestBed } from '@angular/core/testing';
import { PlantasComponent } from './plantas.component';
import { CommonModule } from '@angular/common';
import { TablaDinamicaComponent, TituloComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { PLANTAS } from '../../constantes/complementaria.enum';
import { PlantasTabla } from '../../models/complementaria.model';

describe('PlantasComponent', () => {
  let component: PlantasComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule, 
        TablaDinamicaComponent, 
        TituloComponent,
        PlantasComponent
      ],
    });

    component = TestBed.createComponent(PlantasComponent).componentInstance;
  });

  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize with empty plantasTablaDatos array', () => {
    expect(component.plantasTablaDatos).toEqual([]);
  });

  test('should set plantasTabla correctly', () => {
    expect(component.plantasTabla).toEqual(PLANTAS);
  });

  test('should set TablaSeleccion correctly', () => {
    expect(component.tablaSeleccion).toBe(TablaSeleccion);
  });

  test('should accept input data', () => {
    const mockData: PlantasTabla[] = [
      {
        "calle": "LOMBARDINI PTE",
        "numeroExterior": 1353,
        "numeroInterior": 120,
        "codigoPostal": 81124,
        "colonia": "OTRA NO ESPECIFICADA EN EL CATALOGO",
        "municipioOAlcaldia": "GUASAVE",
        "estado": "SINALOA",
        "pais": "pais",
        "registroFederal": '',
        "razonSocial": '',
        "domicilioFiscal": '',
        "estatus": ''
      }
    ];
    component.plantasTablaDatos = mockData;
    expect(component.plantasTablaDatos).toEqual(mockData);
  });
});