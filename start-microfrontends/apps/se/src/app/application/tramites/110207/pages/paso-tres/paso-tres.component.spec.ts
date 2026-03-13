import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { FirmaElectronicaComponent, TramiteFolioService } from '@ng-mf/data-access-user';
import { TramiteStore } from '../../../../estados/tramite.store';
import { of, throwError } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let routerMock: any;
  let tramiteFolioServiceMock: any;
  let tramiteStoreMock: any;
  const toastrServiceMock = {
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
};
  beforeEach(async () => {
    routerMock = { navigate: jest.fn() };
    tramiteFolioServiceMock = {
      obtenerTramite: jest.fn().mockReturnValue(of({ data: { folio: '123' } }))
    };
    tramiteStoreMock = {
      establecerTramite: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      imports: [
        FirmaElectronicaComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: TramiteFolioService, useValue: tramiteFolioServiceMock },
        { provide: TramiteStore, useValue: tramiteStoreMock },
        { provide: ToastrService, useValue: toastrServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set tipoPersona in obtenerTipoPersona', () => {
    component.obtenerTipoPersona(2);
    expect(component.tipoPersona).toBe(2);
  });

  it('should call TramiteFolioService, TramiteStore, and Router in obtieneFirma when FIRMA is present', () => {
    const spyObtenerTramite = jest.spyOn(tramiteFolioServiceMock, 'obtenerTramite');
    const spyEstablecerTramite = jest.spyOn(tramiteStoreMock, 'establecerTramite');
    const spyNavigate = jest.spyOn(routerMock, 'navigate');
    component.obtieneFirma('firma123');
    expect(spyObtenerTramite).toHaveBeenCalledWith(19);
    expect(spyEstablecerTramite).toHaveBeenCalledWith({ folio: '123' }, 'firma123');
    expect(spyNavigate).toHaveBeenCalledWith(['pago/reportes/acuse']);
  });

  it('should not call TramiteFolioService if FIRMA is empty', () => {
    const spyObtenerTramite = jest.spyOn(tramiteFolioServiceMock, 'obtenerTramite');
    component.obtieneFirma('');
    expect(spyObtenerTramite).not.toHaveBeenCalled();
  });

  it('should handle error in obtieneFirma observable', () => {
    tramiteFolioServiceMock.obtenerTramite.mockReturnValueOnce(throwError(() => new Error('fail')));
    expect(() => component.obtieneFirma('firma123')).not.toThrow();
  });

  it('should complete destroyed$ in ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });
});