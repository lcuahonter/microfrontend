import { TestBed } from '@angular/core/testing';
import { TercerosRelacionadosFabricanteComponent } from './terceros-relacionados-fabricante.component';
import { FABRICANTE_TABLA, OTROS_TABLA } from '../../../../shared/constantes/terceros-relacionados-fabricante.enum';
import { Fabricante, TablaSeleccion } from '@libs/shared/data-access-user/src';

describe('TercerosRelacionadosFabricanteComponent', () => {
  let component: TercerosRelacionadosFabricanteComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TercerosRelacionadosFabricanteComponent],
    });
    const FIXTURE = TestBed.createComponent(TercerosRelacionadosFabricanteComponent);
    component = FIXTURE.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar fabricanteTablaDatos como un arreglo vacío', () => {
    expect(component.fabricanteTablaDatos).toEqual([]);
  });

  it('debería inicializar checkbox con TablaSeleccion.CHECKBOX', () => {
    expect(component.checkbox).toBe(TablaSeleccion.CHECKBOX);
  });

  it('debería inicializar facturadorTablaDatos como un arreglo vacío', () => {
    expect(component.facturadorTablaDatos).toEqual([]);
  });

  it('debería inicializar otrosTablaDatos como un arreglo vacío', () => {
    expect(component.otrosTablaDatos).toEqual([]);
  });

  it('debería inicializar configuracionFabricante con FABRICANTE_TABLA', () => {
    expect(component.configuracionFabricante).toEqual(FABRICANTE_TABLA);
  });

  it('debería inicializar configuracionOtros con OTROS_TABLA', () => {
    expect(component.configuracionOtros).toEqual(OTROS_TABLA);
  });

  describe('generateConfiguracionTabla', () => {
    it('debería devolver un arreglo de configuración válido para una entrada dada', () => {
      const INPUT = [
        { encabezado: 'Nombre', clave: 'nombre' as keyof Fabricante },
        { encabezado: 'Dirección', clave: 'direccion' as keyof Fabricante },
      ];
    });

  });
});