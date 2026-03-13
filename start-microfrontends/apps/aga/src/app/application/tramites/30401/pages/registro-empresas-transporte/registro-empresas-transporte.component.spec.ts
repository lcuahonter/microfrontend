import { RegistroEmpresasTransporteComponent } from './registro-empresas-transporte.component';
import { WizardComponent } from '@ng-mf/data-access-user';

describe('RegistroEmpresasTransporteComponent', () => {
  let component: RegistroEmpresasTransporteComponent;

  beforeEach(() => {
    component = new RegistroEmpresasTransporteComponent();
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;
  });

  it('debería inicializarse con valores predeterminados', () => {
    expect(component.indice).toBe(1);
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
    expect(component.AVISO_PRIVACIDAD_ADJUNTAR).toBeDefined();
  });

  it('debería actualizar el índice y llamar a siguiente cuando la acción sea "cont"', () => {
    const event = { accion: 'cont', valor: 2 };
    component.getValorIndice(event);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('Debería actualizar el índice y llamar a atras cuando la acción no sea "cont"', () => {
    const event = { accion: 'prev', valor: 2 };
    component.getValorIndice(event);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

});