import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    router = { navigate: jest.fn() } as any;
    component = new PasoTresComponent(router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('obtieneFirma', () => {
    it('should navigate to "servicios-extraordinarios/acuse" if firma is provided', () => {
      component.obtieneFirma('firma-valida');
      expect(router.navigate).toHaveBeenCalledWith([
        'servicios-extraordinarios/acuse',
      ]);
    });

    it('should not navigate if firma is an empty string', () => {
      component.obtieneFirma('');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate if firma is undefined', () => {
      component.obtieneFirma(undefined as any);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate if firma is null', () => {
      component.obtieneFirma(null as any);
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
