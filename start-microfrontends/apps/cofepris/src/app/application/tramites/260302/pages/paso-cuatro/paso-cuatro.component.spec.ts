import { PasoCuatroComponent } from './paso-cuatro.component';

describe('PasoCuatroComponent', () => {
  let component: PasoCuatroComponent;

  beforeEach(() => {
    component = new PasoCuatroComponent();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have firma as empty string by default', () => {
    expect(component.firma).toBe('');
  });

  it('should set firma when obtieneFirma is called', () => {
    component.obtieneFirma('test-firma');
    expect(component.firma).toBe('test-firma');
  });
});
