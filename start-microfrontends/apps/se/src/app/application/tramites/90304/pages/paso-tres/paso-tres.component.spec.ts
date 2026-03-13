import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FirmaElectronicaComponent, TramiteFolioService } from '@libs/shared/data-access-user/src';
import { of, throwError } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TramiteStore } from '@libs/shared/data-access-user/src/core/estados/tramite.store';
import { PasoTresComponent } from './paso-tres.component';
import { provideHttpClient } from '@angular/common/http';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let tramiteFolioServiceMock: Partial<TramiteFolioService>;
  let fixture: ComponentFixture<PasoTresComponent>;
  let tramiteStoreMock: Partial<TramiteStore>;
  let routerMock: Partial<Router>;

  beforeEach(async () => {
    tramiteFolioServiceMock = {
      obtenerTramite: jest.fn().mockReturnValue(of({ data: {id: 19, descripcion: 'get-numero-tramite', codigo: '200', data: 'MXSE-20250127-001'} })),
    };

    tramiteStoreMock = {
      establecerTramite: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      imports: [FirmaElectronicaComponent, ToastrModule.forRoot()],
      providers: [provideHttpClient(),
        { provide: TramiteFolioService, useValue: tramiteFolioServiceMock },
        { provide: TramiteStore, useValue: tramiteStoreMock },
        { provide: Router, useValue: routerMock }        
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    component.ngOnDestroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error in obtieneFirma if obtenerTramite fails', () => {
    const firma = 'valid-signature';

    (tramiteFolioServiceMock.obtenerTramite as jest.Mock).mockReturnValue(throwError(() => new Error('Test Error')));

    component.obtieneFirma(firma);

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

  it('should unsubscribe destruirNotificador$ in ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destruirNotificador$'], 'next');
    const completeSpy = jest.spyOn(component['destruirNotificador$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });
});