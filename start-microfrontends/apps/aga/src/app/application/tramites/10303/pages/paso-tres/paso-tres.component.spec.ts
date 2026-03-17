import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoTresComponent } from './paso-tres.component';
import { FirmaElectronicaComponent, TramiteFolioService, TramiteStore } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

fdescribe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let tramiteFolioServiceMock: Partial<TramiteFolioService>;
  let tramiteStoreMock: Partial<TramiteStore>;
  let routerMock: Partial<Router>;

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
      declarations: [PasoTresComponent],
      imports: [FirmaElectronicaComponent, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        { provide: TramiteFolioService, useValue: tramiteFolioServiceMock },
        { provide: TramiteStore, useValue: tramiteStoreMock },
        { provide: Router, useValue: routerMock }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error in obtieneFirma if obtenerTramite fails', () => {
    const FIRMA = 'valid-signature';

    (tramiteFolioServiceMock.obtenerTramite as jest.Mock).mockReturnValue(throwError(() => new Error('Test Error')));

    component.obtieneFirma(FIRMA);

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
});