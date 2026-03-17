import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { PasoTresComponent } from './paso-tres.component';
import { TramiteFolioService } from '@ng-mf/data-access-user';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let router: jest.Mocked<Router>;
  let serviciosExtraordinariosService: jest.Mocked<TramiteFolioService>;

  beforeEach(async () => {
    const routerMock = {
      navigate: jest.fn(),
    };

    const serviciosExtraordinariosServiceMock = {
      obtenerTramite: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      imports: [FirmaElectronicaComponent, ToastrModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: TramiteFolioService, useValue: serviciosExtraordinariosServiceMock },
        ToastrService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router) as jest.Mocked<Router>;
    serviciosExtraordinariosService = TestBed.inject(TramiteFolioService) as jest.Mocked<TramiteFolioService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error on invalid tramite', () => {
    const firma = 'valid-firma';
    const errorResponse = new Error('Invalid tramite');
    serviciosExtraordinariosService.obtenerTramite.mockReturnValue(throwError(() => errorResponse));
    component.obtieneFirma(firma);
    expect(serviciosExtraordinariosService.obtenerTramite).toHaveBeenCalledWith(19);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not call service or navigate on empty firma', () => {
    const firma = '';
    component.obtieneFirma(firma);
    expect(serviciosExtraordinariosService.obtenerTramite).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
