import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { ToastrService, TOAST_CONFIG } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let routerMock: any;

  class MockToastrService {
    success = jest.fn();
    error = jest.fn();
    info = jest.fn();
    warning = jest.fn();
  }

  const mockToastConfig = {
    default: {},
  };

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule, // ✅ Provide HttpClient
        PasoTresComponent,
        FirmaElectronicaComponent,
      ],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ToastrService, useClass: MockToastrService },
        { provide: TOAST_CONFIG, useValue: mockToastConfig },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to acuse page if valid firma is provided', () => {
    component.obtieneFirma('VALID_SIGNATURE');
    expect(routerMock.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should not navigate if firma is empty', () => {
    component.obtieneFirma('');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
