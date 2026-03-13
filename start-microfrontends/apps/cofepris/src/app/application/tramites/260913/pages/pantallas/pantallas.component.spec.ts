import { PantallasComponent } from './pantallas.component';

describe('PantallasComponent', () => {
  let component: PantallasComponent;

  // Mock para los pasos y el wizard
  const pasosMock = [
    { nombre: 'Paso 1' },
    { nombre: 'Paso 2' },
    { nombre: 'Paso 3' }
  ];

  beforeEach(() => {
    component = new PantallasComponent();
    // Sobrescribe la constante de pasos para pruebas
    component.pantallasPasos = pasosMock as any;
    component.datosPasos = {
      nroPasos: pasosMock.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar'
    };
    // Mock del wizardComponent
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as any;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería actualizar el índice y llamar a siguiente() cuando la acción es "cont" y el valor es válido', () => {
    component.getValorIndice({ accion: 'cont', valor: 2 } as any);
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('debería actualizar el índice y llamar a atras() cuando la acción NO es "cont" y el valor es válido', () => {
    component.getValorIndice({ accion: 'ant', valor: 2 } as any);
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('no debería actualizar el índice ni llamar métodos del wizard si el valor es menor o igual a 0', () => {
    component.indice = 1;
    component.datosPasos.indice = 1;
    component.getValorIndice({ accion: 'cont', valor: 0 } as any);
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('no debería actualizar el índice ni llamar métodos del wizard si el valor es mayor al número de pasos', () => {
    component.indice = 1;
    component.datosPasos.indice = 1;
    component.getValorIndice({ accion: 'cont', valor: 10 } as any);
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('no debería hacer nada si el parámetro es undefined', () => {
    component.indice = 1;
    component.datosPasos.indice = 1;
    component.getValorIndice(undefined as any);
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});