import { PasoDosComponent } from './paso-dos.component';
import { TEXTOS } from '@libs/shared/data-access-user/src';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;

  beforeEach(() => {
    component = new PasoDosComponent();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have TEXTOS property defined', () => {
    expect(component.TEXTOS).toBeDefined();
  });

  it('should have TEXTOS property equal to imported TEXTOS', () => {
    expect(component.TEXTOS).toBe(TEXTOS);
  });
});