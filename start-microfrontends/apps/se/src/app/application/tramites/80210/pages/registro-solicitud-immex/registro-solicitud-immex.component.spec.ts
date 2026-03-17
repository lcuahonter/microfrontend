import { registroSolicitudImmexComponent } from './registro-solicitud-immex.component';
import { WizardComponent } from '@ng-mf/data-access-user';

describe('registroSolicitudImmexComponent', () => {
  let componente: registroSolicitudImmexComponent;

  beforeEach(() => {
    componente = new registroSolicitudImmexComponent();
    componente.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;
  });

  it('debería inicializarse con valores predeterminados', () => {
    expect(componente.indice).toBe(1);
    expect(componente.datosPasos.nroPasos).toBe(componente.pasos.length);
    expect(componente.datosPasos.indice).toBe(componente.indice);
    expect(componente.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(componente.datosPasos.txtBtnSig).toBe('Continuar');
    expect(componente.AVISO_PRIVACIDAD_ADJUNTAR).toBeDefined();
  });

  it('debería actualizar el índice y llamar a siguiente cuando la acción sea "cont"', () => {
    const EVENTO = { accion: 'cont', valor: 2 };
    componente.getValorIndice(EVENTO);
    expect(componente.indice).toBe(2);
    expect(componente.wizardComponent.siguiente).toHaveBeenCalled();
    expect(componente.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('debería actualizar el índice y llamar a atrás cuando la acción no sea "cont"', () => {
    const EVENTO = { accion: 'prev', valor: 2 };
    componente.getValorIndice(EVENTO);
    expect(componente.indice).toBe(2);
    expect(componente.wizardComponent.atras).toHaveBeenCalled();
    expect(componente.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

});