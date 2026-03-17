import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let routerMock: any;

  beforeEach(async () => {
    routerMock = { navigate: jest.fn() };
    
    await TestBed.configureTestingModule({
      imports: [PasoTresComponent, CommonModule, FirmaElectronicaComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        ToastrService,
        provideHttpClient(),
        provideToastr({
          positionClass: 'toast-top-right',
        }),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to acuse page if obtieneFirma is called with a non-empty string', () => {
    component.obtieneFirma('firma123');
    expect(routerMock.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should not navigate if obtieneFirma is called with an empty string', () => {
    component.obtieneFirma('');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});