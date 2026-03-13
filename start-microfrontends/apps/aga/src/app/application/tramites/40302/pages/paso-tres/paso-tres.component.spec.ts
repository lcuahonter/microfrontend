import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { Router } from '@angular/router'; 
import { PasoTresComponent } from './paso-tres.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let mockRouter: any;

  const mockToastrService = {
    success: jest.fn(),
    error: jest.fn(),
  };
  const mockToastConfig = {};

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      imports:[FirmaElectronicaComponent,ToastrModule.forRoot()],
      providers: [{ provide: Router, useValue: mockRouter },
      { provide: '_ToastrService', useValue: mockToastrService },
      { provide: 'ToastConfig', useValue: mockToastConfig }, 
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "servicios-extraordinarios/acuse" when obtieneFirma is called with a valid signature', () => {
    const firma = 'valid-signature';
    component.obtieneFirma(firma);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should not navigate when obtieneFirma is called with an empty signature', () => {
    const firma = '';
    component.obtieneFirma(firma);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
