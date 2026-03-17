import { PasoDosComponent } from './paso-dos.component';
import { TEXTOS } from '@ng-mf/data-access-user';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;

  beforeEach(() => {
    component = new PasoDosComponent();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar la variable TEXTOS correctamente', () => {
    expect(component.TEXTOS).toBe(TEXTOS);
  });
});