import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitantePageComponent } from './solicitante-page.component';
import { AlertComponent, BtnContinuarComponent, PasoFirmaComponent, WizardComponent } from '@ng-mf/data-access-user';
import { Tramite110214Store } from '../../../../estados/tramites/tramite110214.store';
import { Tramite110214Query } from '../../../../estados/queries/tramite110214.query';
import { of } from 'rxjs';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SolicitantePageComponent', () => {
  let component: SolicitantePageComponent;
  let fixture: ComponentFixture<SolicitantePageComponent>;
  let storeMock: any;
  let queryMock: any;
  let validarInicialmenteCertificadoServiceMock: any;
  beforeEach(async () => {

    validarInicialmenteCertificadoServiceMock = {
      getAllState: jest.fn().mockReturnValue(of({})),
      guardarDatosPost: jest.fn().mockReturnValue(of({
        codigo: '00',
        mensaje: 'OK',
        datos: {},
      })),
      buildProductoresPorExportador: jest.fn().mockReturnValue([]),
      buildMercanciasProductor: jest.fn().mockReturnValue([]),
      buildCertificado: jest.fn().mockReturnValue({}),
      buildDestinatario: jest.fn().mockReturnValue({}),
      buildDatosCertificado: jest.fn().mockReturnValue({}),
    };

    storeMock = {
      setPasoActivo: jest.fn(),
      setContinuarTriggered: jest.fn(),
    };

    queryMock = {
      selectSolicitud$: of({
        pestanaActiva: 1,
      }),
      getValue: jest.fn().mockReturnValue({
        formValidity: {
          certificadoOrigen: true,
          datosCertificado: true,
          destinatario: true,
          histProductores: true,
        }
      }),
    };

    await TestBed.configureTestingModule({
      imports: [WizardComponent, BtnContinuarComponent, PasoUnoComponent, PasoTresComponent, AlertComponent, PasoFirmaComponent],
      declarations: [SolicitantePageComponent],
      providers: [
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        provideHttpClient(),
        { provide: Tramite110214Store, useValue: storeMock },
        { provide: Tramite110214Query, useValue: queryMock },
        { provide: ValidarInicialmenteCertificadoService, useValue: validarInicialmenteCertificadoServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitantePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tramiteState on ngOnInit', () => {
    component.ngOnInit();
    expect(component.tramiteState).toEqual({ pestanaActiva: 1 });
  });

  it('should update indice and call wizardComponent.atras() on getValorIndice with "atras"', () => {
    const wizardComponentSpy = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice({ accion: 'atras', valor: 1 });
    expect(component.indice).toBe(1);
    expect(wizardComponentSpy).toHaveBeenCalled();
    expect(storeMock.setPasoActivo).toHaveBeenCalledWith(1);
  });

  it('should not update indice or call wizardComponent methods if valor is out of range', () => {
    const wizardComponentSpySiguiente = jest.spyOn(component.wizardComponent, 'siguiente');
    const wizardComponentSpyAtras = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice({ accion: 'cont', valor: 5 });
    expect(component.indice).toBe(1); // Default value
    expect(wizardComponentSpySiguiente).not.toHaveBeenCalled();
    expect(wizardComponentSpyAtras).not.toHaveBeenCalled();
    expect(storeMock.setPasoActivo).not.toHaveBeenCalled();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });

  it('should render the wizard component', () => {
    const wizardElement = fixture.debugElement.nativeElement.querySelector('app-wizard');
    expect(wizardElement).toBeTruthy();
  });

  it('should render app-paso-uno when indice is 1', () => {
    component.indice = 1;
    fixture.detectChanges();
    const pasoUnoElement = fixture.debugElement.nativeElement.querySelector('app-paso-uno');
    expect(pasoUnoElement).toBeTruthy();
  });

  it('should not render ng-alert when indice is not 1', () => {
    component.indice = 2;
    fixture.detectChanges();
    const alertElement = fixture.debugElement.nativeElement.querySelector('ng-alert');
    expect(alertElement).toBeFalsy();
  });
});