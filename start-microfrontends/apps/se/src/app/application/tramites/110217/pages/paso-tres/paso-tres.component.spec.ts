
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let router: Router;

  beforeEach(async () => {
    const routerSpy = jest.fn().mockResolvedValue(true);
    
    await TestBed.configureTestingModule({
      imports: [PasoTresComponent, CommonModule],
      providers: [
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        provideHttpClient(),
        { provide: Router, useValue: { navigate: routerSpy } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to acuse page on valid firma', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    const firma = 'valid-signature';
    component.obtieneFirma(firma);
    expect(navigateSpy).toHaveBeenCalledWith(['inicialmente-certificado-origen/acuse']);
  });

  it('should not navigate to acuse page on invalid firma', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const firma = '';
    component.obtieneFirma(firma);
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});