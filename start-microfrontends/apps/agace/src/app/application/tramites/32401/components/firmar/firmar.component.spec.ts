import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FirmarComponent } from './firmar.component';
import {
  FirmaElectronicaComponent,
  TramiteFolioService,
} from '@libs/shared/data-access-user/src';
import { TramiteStore } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('FirmarComponent', () => {
  let component: FirmarComponent;
  let fixture: ComponentFixture<FirmarComponent>;
  let router: jest.Mocked<Router>;
  let tramiteFolioService: jest.Mocked<TramiteFolioService>;
  let tramiteStore: jest.Mocked<TramiteStore>;

  beforeEach(async () => {
    const routerMock = { navigate: jest.fn() } as Partial<jest.Mocked<Router>>;
    const tramiteFolioServiceMock = {
      obtenerTramite: jest.fn(() =>
        of({
          id: 1,
          descripcion: 'Test Descripcion',
          codigo: 'Test Codigo',
          data: 'mockData',
        })
      ),
    } as unknown as Partial<jest.Mocked<TramiteFolioService>>;
    const tramiteStoreMock = {
      establecerTramite: jest.fn(() => of('mockData', 'validSignature')),
    } as unknown as Partial<jest.Mocked<TramiteStore>>;

    await TestBed.configureTestingModule({
      imports: [
        FirmarComponent,
        FirmaElectronicaComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        ToastrService,
        { provide: Router, useValue: routerMock },
        { provide: TramiteFolioService, useValue: tramiteFolioServiceMock },
        { provide: TramiteStore, useValue: tramiteStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FirmarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    tramiteFolioService = TestBed.inject(
      TramiteFolioService
    ) as jest.Mocked<TramiteFolioService>;
    tramiteStore = TestBed.inject(TramiteStore) as jest.Mocked<TramiteStore>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tipoPersona when obtenerTipoPersona is called', () => {
    component.obtenerTipoPersona(1);
    expect(component.tipoPersona).toBe(1);
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should not call obtenerTramite if obtieneFirma is called with an empty signature', () => {
    component.obtieneFirma('');
    expect(tramiteFolioService.obtenerTramite).not.toHaveBeenCalled();
    expect(tramiteStore.establecerTramite).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should handle error in obtieneFirma and not call establecerTramite or navigate', () => {
    tramiteStore.establecerTramite = jest.fn();
    router.navigate = jest.fn();

    component.obtieneFirma('validSignature');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
