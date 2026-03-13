import { TestBed } from '@angular/core/testing';
import { ProductorIndirectoComponent } from './productor-indirecto.component';
import { TituloComponent, TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { ProductorIndirecto } from '../../models/complementaria.model';
import { TABLA_PRODUCTOR_INDIRECTO } from '../../constantes/complementaria.enum';

describe('ProductorIndirectoComponent', () => {
  let component: ProductorIndirectoComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TituloComponent, 
        TablaDinamicaComponent,
        ProductorIndirectoComponent
      ],
    });

    component = TestBed.createComponent(ProductorIndirectoComponent).componentInstance;
  });

  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize with empty productoIndirectoDatos array', () => {
    expect(component.productoIndirectoDatos).toEqual([]);
  });

  test('should set configuracionTabla correctly', () => {
    expect(component.configuracionTabla).toEqual(TABLA_PRODUCTOR_INDIRECTO);
  });

  test('should set TablaSeleccion correctly', () => {
    expect(component.tablaSeleccion).toBe(TablaSeleccion);
  });

  test('should accept input data', () => {
    const mockData: ProductorIndirecto[] = [
      {
        "registroFederal": "TSD931210493",
        "denominacion": "CORPORACION MEXICANA DE COMPUTO S DE RL DE CV",
        "correo": "nizyyd.okubiz@kef.fzr",
        "eStatus": "Autorizada"
      }
    ];
    component.productoIndirectoDatos = mockData;
    expect(component.productoIndirectoDatos).toEqual(mockData);
  });
});
