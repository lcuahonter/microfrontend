import { PantallasComponent } from './pantallas.component';

describe('PantallasComponent', () => {
  let component: PantallasComponent;

  beforeEach(() => {
    component = new PantallasComponent();
    // Mock the wizardComponent with jest.fn()
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('should have indice initialized to 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should update indice and call siguiente when getValorIndice is called with accion "cont"', () => {
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should update indice and call atras when getValorIndice is called with accion not "cont"', () => {
    component.getValorIndice({ valor: 3, accion: 'back' });
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not update indice or call wizard methods if valor is out of range', () => {
    component.getValorIndice({ valor: 0, accion: 'cont' });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();

    component.getValorIndice({ valor: 5, accion: 'back' });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});