import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { HttpClientModule } from '@angular/common/http';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let router: Router;

  const routerMock = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      imports: [
        HttpClientModule,
        FirmaElectronicaComponent,
        ToastrModule.forRoot(),
      ],
      providers: [ToastrService, 
        { provide: Router, useValue: routerMock },],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to acuse page when firma is provided', () => {
    const firma = 'VALID_FIRMA';
    component.obtieneFirma(firma);
    expect(router.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should NOT navigate if firma is empty', () => {
    component.obtieneFirma('');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should NOT navigate if firma is null', () => {
    component.obtieneFirma(null as any);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should NOT navigate if firma is undefined', () => {
    component.obtieneFirma(undefined as any);
    expect(router.navigate).not.toHaveBeenCalled();
  });

});
