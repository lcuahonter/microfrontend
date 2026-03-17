import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = { navigate: jest.fn() };
    component = new PasoTresComponent(mockRouter as Router);
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('obtieneFirma debe navegar si la firma es válida', () => {
    component.obtieneFirma('firma-valida');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('obtieneFirma NO debe navegar si la firma es vacía', () => {
    component.obtieneFirma('');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
