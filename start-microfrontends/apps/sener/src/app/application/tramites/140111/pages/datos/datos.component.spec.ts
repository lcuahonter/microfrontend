import { DatosComponent } from './datos.component';

describe('DatosComponent', () => {
  let component: DatosComponent;

  const mockServicio = {
    getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: () => {} }) }),
    actualizarEstadoFormulario: jest.fn()
  };
  const mockConsultaQuery = {
    selectConsultaioState$: { pipe: () => ({ subscribe: () => {} }) }
  };

  beforeEach(() => {
    component = new DatosComponent(
      mockServicio as any,
      mockConsultaQuery as any
    );
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el índice con el valor predeterminado 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debe inicializar totalPestanas con el valor 5', () => {
    expect(component.totalPestanas).toBe(5);
  });

  it('Debería volver verdadera para esPrimeraPestana cuando el índice es 1', () => {
    component.indice = 1;
    expect(component.esPrimeraPestana).toBeTruthy();
  });

  it('Debería devolver falso para esPrimeraPestana cuando el índice sea mayor que 1', () => {
    component.indice = 2;
    expect(component.esPrimeraPestana).toBeFalsy();
  });

  it('Debería devolver verdadero para esUltimaPestana cuando el índice es totalPestanas', () => {
    component.indice = component.totalPestanas;
    expect(component.esUltimaPestana).toBeTruthy();
  });

  it('debería devolver falso para esUltimaPestana cuando el índice es menor que totalPestanas', () => {
    component.indice = 4;
    expect(component.esUltimaPestana).toBeFalsy();
  });

  it('debe cambiar el índice cuando se llama a seleccionaTab con un número válido', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('No debe cambiar el índice cuando se llama a seleccionaTab con un número no válido', () => {
    component.seleccionaTab(6);
    expect(component.indice).toBe(1); 
  });

  it('Debería aumentar el índice cuando se llama a avanzarTab, si no en la última pestaña', () => {
    component.indice = 3;
    component.avanzarTab();
    expect(component.indice).toBe(4);
  });

  it('No debería aumentar el índice cuando se llama a avanzarTab en la última pestaña', () => {
    component.indice = component.totalPestanas;
    component.avanzarTab();
    expect(component.indice).toBe(component.totalPestanas);
  });

  it('Debería disminuir el índice cuando se llama a retrocederTab, si no en la primera pestaña', () => {
    component.indice = 3;
    component.retrocederTab();
    expect(component.indice).toBe(2);
  });

  it('No debe disminuir el índice cuando se llama a retrocederTab en la primera pestaña', () => {
    component.indice = 1;
    component.retrocederTab();
    expect(component.indice).toBe(1);
  });

  it('debe restablecer el índice a 1 cuando se llama a resetTabs', () => {
    component.indice = 4;
    component.resetTabs();
    expect(component.indice).toBe(1);
  });
});
