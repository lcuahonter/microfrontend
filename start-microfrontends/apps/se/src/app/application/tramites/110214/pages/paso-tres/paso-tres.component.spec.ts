
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoTresComponent, CommonModule, FirmaElectronicaComponent],
      providers: [ToastrService,
        provideHttpClient(),
        provideToastr({
          positionClass: 'toast-top-right',
        }),],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the FirmaElectronicaComponent', () => {
    const firmaElectronicaElement = fixture.debugElement.nativeElement.querySelector('firma-electronica');
    expect(firmaElectronicaElement).toBeTruthy();
  });

  it('should not navigate to acuse page on invalid firma', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const firma = '';
    component.obtieneFirma(firma);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should navigate to "validar-inicialmente-certificado/acuse" when FIRMA is valid', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const mockFirma = 'valid-firma';
    component.obtieneFirma(mockFirma);
    expect(navigateSpy).toHaveBeenCalledWith(['validar-inicialmente-certificado/acuse']);
  });
});