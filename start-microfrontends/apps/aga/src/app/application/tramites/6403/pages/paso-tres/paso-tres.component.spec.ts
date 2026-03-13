import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import {
  FirmaElectronicaComponent,
  TramiteFolioService,
  TramiteStore,
} from '@ng-mf/data-access-user';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, InjectionToken } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let routerMock: jest.Mocked<Router>;
  let tramiteFolioServiceMock: any;
  let tramiteStoreMock: any;
  let mockToastr: any;
  const ToastConfig = new InjectionToken<any>('ToastConfig');
  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;
    tramiteFolioServiceMock = {
      obtenerTramite: jest.fn().mockReturnValue(of({ data: { folio: '123' } })),
    };
    tramiteStoreMock = {
      establecerTramite: jest.fn(),
    };
    mockToastr = {
      error: jest.fn(),
      success: jest.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [
        PasoTresComponent,
        FirmaElectronicaComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        ToastrService,
        { provide: Router, useValue: routerMock },
        { provide: TramiteFolioService, useValue: tramiteFolioServiceMock },
        { provide: TramiteStore, useValue: tramiteStoreMock },
        { provide: ToastConfig, useValue: {} },
        FormBuilder,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tipoPersona in obtenerTipoPersona', () => {
    component.tipoPersona = 0;
    component.obtenerTipoPersona(2);
    expect(component.tipoPersona).toBe(2);
  });

  it('should not call TramiteFolioService if FIRMA is empty', () => {
    const spyObtenerTramite = jest.spyOn(
      tramiteFolioServiceMock,
      'obtenerTramite'
    );
    component.obtieneFirma('');
    expect(spyObtenerTramite).not.toHaveBeenCalled();
  });

  it('should handle error in obtieneFirma observable', () => {
    tramiteFolioServiceMock.obtenerTramite.mockReturnValueOnce(
      throwError(() => new Error('error'))
    );
    expect(() => component.obtieneFirma('firma-digital')).not.toThrow();
  });

  it('should complete destroyed$ in ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });
});
