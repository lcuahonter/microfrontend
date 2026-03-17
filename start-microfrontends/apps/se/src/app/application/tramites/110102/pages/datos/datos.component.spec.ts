import { DatosComponent, AccionBoton } from './datos.component';
import { WizardComponent } from '@libs/shared/data-access-user/src';

describe('DatosComponent', () => {
  let component: DatosComponent;

  beforeEach(() => {
    component = new DatosComponent();
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as unknown as WizardComponent;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el índice en 1', () => {
    expect(component.indice).toBe(1);
  });

  it('getValorIndice debe actualizar el índice y llamar a siguiente si accion es "cont"', () => {
    const accion: AccionBoton = { accion: 'cont', valor: 2 };
    component.getValorIndice(accion);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('getValorIndice debe actualizar el índice y llamar a atras si accion no es "cont"', () => {
    const accion: AccionBoton = { accion: 'atras', valor: 3 };
    component.getValorIndice(accion);
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('getValorIndice NO debe actualizar el índice ni llamar métodos si valor es inválido', () => {
    const accion: AccionBoton = { accion: 'cont', valor: 0 };
    component.getValorIndice(accion);
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});