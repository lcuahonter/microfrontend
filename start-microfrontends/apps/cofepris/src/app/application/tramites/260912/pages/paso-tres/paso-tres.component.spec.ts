import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { ToastrService, TOAST_CONFIG, ToastrModule } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
    let router: Router;
  let navigateSpy: jest.SpyInstance;

  // Servicio de tostado simulado
  const mockToastrService = {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  };


   beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([]),
        ToastrModule.forRoot(),
        PasoTresComponent
      ],
      providers: [
        { provide: ToastrService, useValue: mockToastrService },
        provideHttpClient(),
        ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   describe('obtieneFirma', () => {
    it('should navigate to acuse page if firma is provided', () => {
      const testFirma = 'fake-digital-signature';
      component.obtieneFirma(testFirma);
      expect(navigateSpy).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
    });

    it('should not navigate if firma is empty', () => {
      component.obtieneFirma('');
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });
});