import { RevisionDocumentalComponent } from './revision-documental.component';
import { PagoDeDerechosComponent } from '../../shared/pago-de-derechos/pago-de-derechos.component';
import { TercerosRelacionadosComponent } from '../../shared/terceros-relacionados/terceros-relacionados.component';

describe('RevisionDocumentalComponent', () => {
  let component: RevisionDocumentalComponent;

  beforeEach(() => {
    component = new RevisionDocumentalComponent();
    component.pagoDeDerechos = {
      validarFormulario: jest.fn(() => true)
    } as unknown as PagoDeDerechosComponent;

    component.tercerosRelacionados = {
      validarFormulario: jest.fn(() => true)
    } as unknown as TercerosRelacionadosComponent;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener las propiedades por defecto inicializadas', () => {
    expect(component.indice).toBe(1);
    expect(component.colapsable).toBe(true);
    expect(component.currentIndex).toBe(1);
    expect(component.rows).toEqual([]);
    expect(component.forma).toBe('');
  });

  it('debe tener el método seleccionaTab', () => {
    expect(typeof component.seleccionaTab).toBe('function');
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('debe validar los formularios y retornar true cuando ambos componentes hijos retornan true', () => {
    const result = component.validarFormularios();
    expect(result).toBe(true);
    expect(component.pagoDeDerechos.validarFormulario).toHaveBeenCalled();
    expect(component.tercerosRelacionados.validarFormulario).toHaveBeenCalled();
  });

  it('debe retornar false si pagoDeDerechos no existe', () => {
    component.pagoDeDerechos = undefined as any;
    const result = component.validarFormularios();
    expect(result).toBe(false);
  });

  it('debe retornar true si tercerosRelacionados no existe', () => {
    component.tercerosRelacionados = undefined as any;
    const result = component.validarFormularios();
    expect(result).toBe(true);
  });

  it('debe retornar false si la validación de los hijos falla', () => {
    component.pagoDeDerechos.validarFormulario = jest.fn(() => false);
    component.tercerosRelacionados.validarFormulario = jest.fn(() => false);
    const result = component.validarFormularios();
    expect(result).toBe(false);
  });
});
