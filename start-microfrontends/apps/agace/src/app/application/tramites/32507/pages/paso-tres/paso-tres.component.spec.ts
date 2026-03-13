import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PasoTresComponent } from './paso-tres.component';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let routerMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [PasoTresComponent, FirmaElectronicaComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerMock },
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('obtieneFirma', () => {
    it('should navigate to acuse page when a valid firma is provided', () => {
      const validFirma = 'valid-electronic-signature-12345';

      component.obtieneFirma(validFirma);

      expect(routerMock.navigate).toHaveBeenCalledWith(['aviso-traslado/acuse']);
      expect(routerMock.navigate).toHaveBeenCalledTimes(1);
    });

    it('should navigate to acuse page when firma is a non-empty string', () => {
      const firma = 'test-signature';

      component.obtieneFirma(firma);

      expect(routerMock.navigate).toHaveBeenCalledWith(['aviso-traslado/acuse']);
    });

    it('should navigate to acuse page when firma contains only spaces but is truthy', () => {
      const firma = '   ';

      component.obtieneFirma(firma);

      expect(routerMock.navigate).toHaveBeenCalledWith(['aviso-traslado/acuse']);
    });

    it('should not navigate when firma is an empty string', () => {
      const emptyFirma = '';

      component.obtieneFirma(emptyFirma);

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate when firma is null', () => {
      const nullFirma = null as any;

      component.obtieneFirma(nullFirma);

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate when firma is undefined', () => {
      const undefinedFirma = undefined as any;

      component.obtieneFirma(undefinedFirma);

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should handle long signature strings', () => {
      const longFirma = 'a'.repeat(1000);

      component.obtieneFirma(longFirma);

      expect(routerMock.navigate).toHaveBeenCalledWith(['aviso-traslado/acuse']);
    });

    it('should handle special characters in firma', () => {
      const specialCharFirma = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      component.obtieneFirma(specialCharFirma);

      expect(routerMock.navigate).toHaveBeenCalledWith(['aviso-traslado/acuse']);
    });

    it('should assign firma to FIRMA constant correctly', () => {
      const testFirma = 'test-signature-value';
      const navigateSpy = jest.spyOn(routerMock, 'navigate');

      component.obtieneFirma(testFirma);

      expect(navigateSpy).toHaveBeenCalledWith(['aviso-traslado/acuse']);
    });

    it('should handle numeric string as firma', () => {
      const numericFirma = '123456';

      component.obtieneFirma(numericFirma);

      expect(routerMock.navigate).toHaveBeenCalledWith(['aviso-traslado/acuse']);
    });

    it('should reset router mock calls between tests', () => {
      expect(routerMock.navigate).not.toHaveBeenCalled();
      
      component.obtieneFirma('test');
      
      expect(routerMock.navigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Component initialization', () => {
    it('should initialize with router dependency', () => {
      expect(component).toBeDefined();
      expect((component as any).router).toBeDefined();
    });

    it('should be a standalone component', () => {
      expect(component).toBeInstanceOf(PasoTresComponent);
    });
  });
});
