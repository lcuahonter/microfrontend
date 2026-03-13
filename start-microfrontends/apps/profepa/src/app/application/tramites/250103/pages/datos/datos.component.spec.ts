import { DatosComponent } from './datos.component';

describe('DatosComponent', () => {
  let component: DatosComponent;

  beforeEach(() => {
    component = new DatosComponent();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debería tener el índice inicializado en 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should update indice when seleccionaTab is called', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debe actualizar el índice cuando se llama a seleccionaTab', () => {
    component.seleccionaTab(-1);
    expect(component.indice).toBe(-1);
  });

  it('debe manejar cero en seleccionaTab', () => {
    component.seleccionaTab(0);
    expect(component.indice).toBe(0);
  });
});
