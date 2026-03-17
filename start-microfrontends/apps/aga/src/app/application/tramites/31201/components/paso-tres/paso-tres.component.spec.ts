import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PasoTresComponent } from './paso-tres.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoTresComponent, FirmaElectronicaComponent, CommonModule, RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      declarations: [],
      providers: [ToastrService,
              provideToastr({
                positionClass: 'toast-top-right',
              }),],
    }).compileComponents();

    const fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "servicios-extraordinarios/acuse" when obtieneFirma is called with a valid signature', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const mockSignature = 'valid-signature';

    component.obtieneFirma(mockSignature);

    expect(navigateSpy).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should not navigate when obtieneFirma is called with an empty signature', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const mockSignature = '';

    component.obtieneFirma(mockSignature);

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});