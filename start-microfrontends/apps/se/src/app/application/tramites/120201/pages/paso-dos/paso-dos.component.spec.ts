import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { TramiteStore } from '../../../../estados/tramite.store';
import { Router } from '@angular/router';
import { FirmaElectronicaComponent, TramiteFolioService } from '@libs/shared/data-access-user/src';
import { of, throwError } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let tramiteFolioServiceMock: Partial<TramiteFolioService>;
  let fixture: ComponentFixture<PasoDosComponent>;
  let tramiteStoreMock: Partial<TramiteStore>;
  let routerMock: Partial<Router>;

  beforeEach(async () => {
    tramiteFolioServiceMock = {
      obtenerTramite: jest.fn().mockReturnValue(of({ data: { id: 123, name: 'Test Tramite' } })),
    };

    tramiteStoreMock = {
      establecerTramite: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      imports: [
        FirmaElectronicaComponent, 
        ToastrModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        { provide: TramiteFolioService, useValue: tramiteFolioServiceMock },
        { provide: TramiteStore, useValue: tramiteStoreMock },
        { provide: Router, useValue: routerMock }        
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
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

  it('should call obtenerTramite and navigate on obtieneFirma when FIRMA is provided', () => {
    const firma = 'valid-signature';

    component.obtieneFirma(firma);

    expect(tramiteFolioServiceMock.obtenerTramite).toHaveBeenCalledWith(19);
    expect(tramiteStoreMock.establecerTramite).toHaveBeenCalledWith(
      { id: 123, name: 'Test Tramite' }, 
      firma
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
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
