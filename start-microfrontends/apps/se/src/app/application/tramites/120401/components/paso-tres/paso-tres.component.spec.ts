import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PasoTresComponent } from './paso-tres.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let router: Router;

  const toastrServiceMock = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([]),
        FirmaElectronicaComponent,
        PasoTresComponent,
        HttpClientModule,
        BrowserAnimationsModule, // Required for toastr animations
        ToastrModule.forRoot(), // Add this to provide ToastConfig
      ],
      providers: [
        { provide: ToastrService, useValue: toastrServiceMock }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('obtieneFirma', () => {
    it('should navigate to the acuse page when a valid FIRMA is provided', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const mockFirma = 'firma-electronica';

      component.obtieneFirma(mockFirma);

      expect(navigateSpy).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
    });

    it('should not navigate when FIRMA is empty', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const mockFirma = '';

      component.obtieneFirma(mockFirma);

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });
});