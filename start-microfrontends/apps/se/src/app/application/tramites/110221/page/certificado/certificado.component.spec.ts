// certificado.component.spec.ts
import { CertificadoComponent } from './certificado.component';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { Tramite110221Query } from '../../estados/tramite110221.query';

describe('CertificadoComponent', () => {
  let component: CertificadoComponent;

  beforeEach(() => {
    const mockSeccionStore = {} as SeccionLibStore;
    const mockTramiteQuery = {} as Tramite110221Query;

    component = new CertificadoComponent(mockSeccionStore, mockTramiteQuery);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize indice as 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should update indice when getValorIndice is called with "cont"', () => {
    // Mock pasoUnoComponent so validation passes
    component['pasoUnoComponent'] = { validarFormularios: () => true } as any;
    component['wizardComponent'] = { siguiente: jest.fn(), atras: jest.fn() } as any;

    component.getValorIndice({ accion: 'cont', valor: 1 });
    expect(component.indice).toBe(2);
  });
});
