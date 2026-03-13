import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';

fdescribe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      imports: [
        FirmaElectronicaComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        ToastrService,
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    const FIXTURE = TestBed.createComponent(PasoTresComponent);
    component = FIXTURE.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "servicios-extraordinarios/acuse" when a valid signature is provided', () => {
    const ROUTERSPY = jest.spyOn(component.router, 'navigate');
    const VALIDSIGNATURE = 'validSignature';

    component.obtieneFirma(VALIDSIGNATURE);

    expect(ROUTERSPY).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should not navigate when an invalid signature is provided', () => {
    const ROUTERSPY = jest.spyOn(component.router, 'navigate');
    const INVALIDSIGNATURE = '';

    component.obtieneFirma(INVALIDSIGNATURE);

    expect(ROUTERSPY).not.toHaveBeenCalled();
  });
});
