import { TestBed } from '@angular/core/testing';
import { BitacoraTablaComponent } from './bitacora.component';
import { TituloComponent, TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Bitacora } from '../../models/bitacora.model';
import { TABLA_BITACORA } from '../../constantes/bitacora.enum';

describe('BitacoraTablaComponent', () => {
  let component: BitacoraTablaComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TituloComponent, 
        TablaDinamicaComponent,
        BitacoraTablaComponent
      ],
    });

    component = TestBed.createComponent(BitacoraTablaComponent).componentInstance;
  });

  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize with empty bitacoraDatos array', () => {
    expect(component.bitacoraDatos).toEqual([]);
  });

  test('should set configuracionTabla correctly', () => {
    expect(component.configuracionTabla).toEqual(TABLA_BITACORA);
  });

  test('should set TablaSeleccion correctly', () => {
    expect(component.tablaSeleccion).toBe(TablaSeleccion);
  });

  test('should accept input data', () => {
    const mockData: Bitacora[] = [
      {
        "tipoModificacion": "Alta de domicilio de una planta",
        "fechaModificacion": "05/04/2025",
        "valoresAnteriores": " ",
        "valoresNuevos": "LOMBARDINI PTE 1353 81124 OTRA NO ESPECIFICADA EN EL CATALOGO VENUSTIANO CARRANZA PUEBLA"
      }
    ];
    component.bitacoraDatos = mockData;
    expect(component.bitacoraDatos).toEqual(mockData);
  });
});