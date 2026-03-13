import { PantallasComponent } from './pantallas.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/31601/servicios-pantallas.model';

describe('PantallasComponent', () => {
  let component: PantallasComponent;

  beforeEach(() => {
    component = new PantallasComponent();
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as unknown as WizardComponent;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar con los valores por defecto', () => {
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
  });

  it('debe actualizar el índice y llamar a wizardComponent.siguiente cuando la acción es "cont"', () => {
    const accion: AccionBoton = { valor: 2, accion: 'cont' };
    component.getValorIndice(accion);
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('debe actualizar el índice y llamar a wizardComponent.atras cuando la acción es distinta de "cont"', () => {
    const accion: AccionBoton = { valor: 1, accion: 'back' };
    component.getValorIndice(accion);
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('no debe actualizar el índice si el valor está fuera de rango (muy bajo)', () => {
    const accion: AccionBoton = { valor: 0, accion: 'cont' };
    component.getValorIndice(accion);
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('no debe actualizar el índice si el valor está fuera de rango (muy alto)', () => {
    const accion: AccionBoton = { valor: 99, accion: 'cont' };
    component.getValorIndice(accion);
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});