import { AsignarPersonaComponent } from './asignar-persona.component';

describe('AsignarPersonaComponent', () => {
  let component: AsignarPersonaComponent;

  beforeEach(() => {
    component = new AsignarPersonaComponent();
  });

  describe('Initialization', () => {
    it('should initialize with the default tab index as 1', () => {
      expect(component.indice).toBe(1);
    });
  });

  describe('seleccionaTab', () => {
    it('should update the tab index when a tab is selected', () => {
      component.seleccionaTab(2);
      expect(component.indice).toBe(2);

      component.seleccionaTab(1);
      expect(component.indice).toBe(1);
    });
  });
});