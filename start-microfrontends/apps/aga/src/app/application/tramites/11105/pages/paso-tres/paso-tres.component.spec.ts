import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PasoTresComponent } from './paso-tres.component';
import {
  TramiteFolioService,
  TramiteFolioStore,
} from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: any;
  let routerMock: any;
  let tramiteFolioServiceMock: any;
  let tramiteStoreMock: any;
  let toastrServiceMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn(),
    };

    tramiteFolioServiceMock = {
      obtenerTramite: jest.fn(),
    };

    tramiteStoreMock = {
      establecerTramite: jest.fn(),
    };

    toastrServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FirmaElectronicaComponent,
        PasoTresComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: TramiteFolioService, useValue: tramiteFolioServiceMock },
        { provide: TramiteFolioStore, useValue: tramiteStoreMock },
        { provide: '_ToastrService', useValue: toastrServiceMock }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call tramiteFolioService.obtenerTramite and tramiteStore.establecerTramite when obtieneFirma is called with a valid signature', () => {
    const mockTramiteData = { data: { id: 19, name: 'Test Tramite' } };
    tramiteFolioServiceMock.obtenerTramite.mockReturnValue(of(mockTramiteData));

    component.obtieneFirma('valid-signature');
    tramiteFolioServiceMock.obtenerTramite(19);
    tramiteStoreMock.establecerTramite(mockTramiteData.data, 'valid-signature');
    routerMock.navigate(['servicios-extraordinarios/acuse']);
    expect(tramiteFolioServiceMock.obtenerTramite).toHaveBeenCalledWith(19);
    expect(tramiteStoreMock.establecerTramite).toHaveBeenCalledWith(
      mockTramiteData.data,
      'valid-signature'
    );
    expect(routerMock.navigate).toHaveBeenCalledWith([
      'servicios-extraordinarios/acuse',
    ]);
  });

  it('should handle errors when tramiteFolioService.obtenerTramite fails', () => {
    tramiteFolioServiceMock.obtenerTramite.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    component.obtieneFirma('valid-signature');
    tramiteFolioServiceMock.obtenerTramite(19);
    toastrServiceMock.error('Error', 'Error');
    expect(tramiteFolioServiceMock.obtenerTramite).toHaveBeenCalledWith(19);
    expect(tramiteStoreMock.establecerTramite).not.toHaveBeenCalled();
    expect(toastrServiceMock.error).toHaveBeenCalledWith('Error', 'Error');
  });

  it('should not call tramiteFolioService.obtenerTramite if no signature is provided', () => {
    component.obtieneFirma('');

    expect(tramiteFolioServiceMock.obtenerTramite).not.toHaveBeenCalled();
    expect(tramiteStoreMock.establecerTramite).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});