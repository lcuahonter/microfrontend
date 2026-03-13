import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoTresComponent } from './paso-tres.component';
import { FirmaElectronicaComponent, TramiteFolioService, TramiteStore } from '@libs/shared/data-access-user/src';
import { ToastrModule } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Subscription, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let routerMock: Partial<Router>;
  let tramiteStoreMock: Partial<TramiteStore>;
  let tramiteFolioServiceMock: any;

  beforeEach(async () => {
    tramiteFolioServiceMock = {
      obtenerTramite: jest.fn().mockReturnValue(of({ data: { id: 19, descripcion: 'get-numero-tramite', codigo: '200', data: 'MXSE-20250127-001' } })),
    };

    tramiteStoreMock = {
      establecerTramite: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        FirmaElectronicaComponent,
        ToastrModule.forRoot(),
        PasoTresComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: TramiteFolioService, useValue: tramiteFolioServiceMock },
        { provide: TramiteStore, useValue: tramiteStoreMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error in obtieneFirma if obtenerTramite fails', () => {
    const FIRMA = 'valid-signature';

    (tramiteFolioServiceMock.obtenerTramite as jest.Mock).mockReturnValue(throwError(() => new Error('Test Error')));

    component.obtieneFirma(FIRMA);
    tramiteFolioServiceMock.obtenerTramite(19);
    expect(tramiteFolioServiceMock.obtenerTramite).toHaveBeenCalledWith(19);
    expect(tramiteStoreMock.establecerTramite).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should not call obtenerTramite if FIRMA is empty in obtieneFirma', () => {
    component.obtieneFirma('');

    expect(tramiteFolioServiceMock.obtenerTramite).not.toHaveBeenCalled();
    expect(tramiteStoreMock.establecerTramite).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should unsubscribe obtienerTramiteSubscriber on destroy', () => {
    const mockSubscription = new Subscription();
    const unsubscribeSpy = jest.spyOn(mockSubscription, 'unsubscribe');

    component.obtienerTramiteSubscriber = mockSubscription;

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
  });
});