import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let router: Router;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      imports: [FirmaElectronicaComponent, RouterTestingModule],
      providers: [
        ToastrService,
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

  it('should navigate to acuse page if firma is valid', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.obtieneFirma('valid-firma');
    expect(navigateSpy).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should not navigate if firma is empty string', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.obtieneFirma('');
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should not navigate if firma is null', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.obtieneFirma(null as unknown as string);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should not navigate if firma is undefined', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.obtieneFirma(undefined as unknown as string);
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
