import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let routerMock: { navigate: jest.Mock };

  beforeEach(() => {
    routerMock = { navigate: jest.fn() };
    component = new PasoTresComponent(routerMock as any);
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('should call router.navigate when obtieneFirma is called with a value', () => {
    component.obtieneFirma('firma-valida');
    expect(routerMock.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should not call router.navigate when obtieneFirma is called with an empty string', () => {
    component.obtieneFirma('');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});