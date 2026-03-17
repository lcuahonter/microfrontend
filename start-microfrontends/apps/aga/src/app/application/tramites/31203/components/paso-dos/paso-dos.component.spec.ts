import { PasoDosComponent } from './paso-dos.component';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;

  beforeEach(() => {
    component = new PasoDosComponent();
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('should have TEXTOS property', () => {
    expect(component.TEXTOS).toBeDefined();
  });
});