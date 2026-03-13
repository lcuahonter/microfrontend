import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PasoTresComponent } from './paso-tres.component';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let router: Router;

  beforeEach(() => {
    const routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    router = TestBed.inject(Router);
    component = new PasoTresComponent(router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('obtieneFirma', () => {
    it('should navigate to "servicios-extraordinarios/acuse" when FIRMA is valid', () => {
      const firma = 'valid-firma';
      component.obtieneFirma(firma);
      expect(router.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
    });

    it('should not navigate when FIRMA is invalid', () => {
      const firma = '';
      component.obtieneFirma(firma);
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});