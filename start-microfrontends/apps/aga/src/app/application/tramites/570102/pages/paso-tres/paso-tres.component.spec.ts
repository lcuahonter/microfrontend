import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { FirmaElectronicaComponent, TramiteFolioService, TramiteStore } from '@ng-mf/data-access-user';
import { of, throwError, ReplaySubject } from 'rxjs';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let routerMock: any;
  let tramiteFolioServiceMock: any;
  let tramiteStoreMock: any;

  beforeEach(async () => {
    routerMock = { navigate: jest.fn() };
    tramiteFolioServiceMock = {
      obtenerTramite: jest.fn()
    };
    tramiteStoreMock = {
      establecerTramite: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      imports: [FirmaElectronicaComponent, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: TramiteFolioService, useValue: tramiteFolioServiceMock },
        { provide: TramiteStore, useValue: tramiteStoreMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tipoPersona in obtenerTipoPersona', () => {
    component.obtenerTipoPersona(2);
    expect(component.tipoPersona).toBe(2);
  });

  it('should call services and navigate on obtieneFirma with valid firma', () => {
    const mockTramite = { data: { id: 1 } };
    tramiteFolioServiceMock.obtenerTramite.mockReturnValue(of(mockTramite));
    const establecerSpy = jest.spyOn(tramiteStoreMock, 'establecerTramite');
    const navigateSpy = jest.spyOn(routerMock, 'navigate');

    component.obtieneFirma('firma123');

    expect(tramiteFolioServiceMock.obtenerTramite).toHaveBeenCalledWith(19);
    expect(establecerSpy).toHaveBeenCalledWith(mockTramite.data, 'firma123');
    expect(navigateSpy).toHaveBeenCalledWith(['pago/registro-solicitud/acuse']);
  });

  it('should not call services if obtieneFirma is called with empty firma', () => {
    component.obtieneFirma('');
    expect(tramiteFolioServiceMock.obtenerTramite).not.toHaveBeenCalled();
  });

  it('should handle error in obtieneFirma observable (catchError branch)', () => {
    tramiteFolioServiceMock.obtenerTramite.mockReturnValue(throwError(() => new Error('fail')));
    expect(() => component.obtieneFirma('firma123')).not.toThrow();
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    component.destroyed$ = { next: jest.fn(), complete: jest.fn() } as any;
    const nextSpy = jest.spyOn(component.destroyed$, 'next');
    const completeSpy = jest.spyOn(component.destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });
});