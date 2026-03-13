import { TestBed } from '@angular/core/testing';
import { ProducirMercanciasComponent } from './producir-mercancias.component';
import { TituloComponent, TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Mercancias } from '../../models/complementaria.model';
import { TABLA_PRODUCIR_MERCANCIAS } from '../../constantes/complementaria.enum';

describe('ProducirMercanciasComponent', () => {
  let component: ProducirMercanciasComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TituloComponent, 
        TablaDinamicaComponent,
        ProducirMercanciasComponent
      ],
    });

    component = TestBed.createComponent(ProducirMercanciasComponent).componentInstance;
  });

  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize with empty mercanciasProducir array', () => {
    expect(component.mercanciasProducir).toEqual([]);
  });

  test('should set configuracionTabla correctly', () => {
    expect(component.configuracionTabla).toEqual(TABLA_PRODUCIR_MERCANCIAS);
  });

  test('should set TablaSeleccion correctly', () => {
    expect(component.tablaSeleccion).toBe(TablaSeleccion);
  });

  test('should accept input data', () => {
    const mockData: Mercancias[] = [
      {
        "fraccionArancelaria": "Fracción 1",
        "claveDelSector": "I",
        "eStatus": "Autorizada "
      }
    ];
    component.mercanciasProducir = mockData;
    expect(component.mercanciasProducir).toEqual(mockData);
  });
});
