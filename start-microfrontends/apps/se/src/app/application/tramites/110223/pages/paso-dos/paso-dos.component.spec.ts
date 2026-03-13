import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError, Subscription } from 'rxjs';
import { PasoDosComponent } from './paso-dos.component';
import { TramiteFolioService } from '@ng-mf/data-access-user';
import { TramiteStore } from '../../../../estados/tramite.store';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr, ToastrService } from 'ngx-toastr';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let mockRouter: Router;
  let mockTramiteFolioService: TramiteFolioService;
  let mockTramiteStore: TramiteStore;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    } as unknown as Router;

    mockTramiteFolioService = {
      obtenerTramite: jest.fn(),
    } as unknown as TramiteFolioService;

    mockTramiteStore = {
      establecerTramite: jest.fn(),
    } as unknown as TramiteStore;

    await TestBed.configureTestingModule({
      imports: [PasoDosComponent],
      providers: [ provideHttpClient(),
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        { provide: Router, useValue: mockRouter },
        { provide: TramiteFolioService, useValue: mockTramiteFolioService },
        { provide: TramiteStore, useValue: mockTramiteStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set tipoPersona when obtenerTipoPersona is called', () => {
    component.obtenerTipoPersona(1);
    expect(component.tipoPersona).toBe(1);
  });

  it('should handle error when obtieneFirma is called and TramiteFolioService fails', () => {
    jest.spyOn(mockTramiteFolioService, 'obtenerTramite').mockReturnValue(throwError(() => new Error('Service error')));

    component.obtieneFirma('valid-signature');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});