import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PasoTresComponent } from './paso-tres.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
      imports:[HttpClientTestingModule,FirmaElectronicaComponent,ToastrModule.forRoot()],
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

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería navegar a "servicios-extraordinarios/acuse" cuando obtieneFirma es llamada con una firma válida', () => {
    const firma = 'valid-signature';
    component.obtieneFirma(firma);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('no debería navegar cuando obtieneFirma es llamada con una firma vacía', () => {
    const firma = '';
    component.obtieneFirma(firma);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});