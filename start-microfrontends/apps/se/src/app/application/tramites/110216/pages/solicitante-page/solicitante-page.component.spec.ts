import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitantePageComponent } from './solicitante-page.component';
import { AlertComponent, BtnContinuarComponent, PasoFirmaComponent, WizardComponent } from '@ng-mf/data-access-user';
import { Tramite110216Store } from '../../../../estados/tramites/tramite110216.store';
import { Tramite110216Query } from '../../../../estados/queries/tramite110216.query';
import { of } from 'rxjs';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr, ToastrService } from 'ngx-toastr';

describe('SolicitantePageComponent', () => {
  let component: SolicitantePageComponent;
  let fixture: ComponentFixture<SolicitantePageComponent>;
  let storeMock: any;
  let queryMock: any;

  beforeEach(async () => {
    storeMock = {
      setPasoActivo: jest.fn(),
    };

    queryMock = {
      selectSolicitud$: of({
        pestanaActiva: 1,
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
        { provide: Tramite110216Store, useValue: storeMock },
        { provide: Tramite110216Query, useValue: queryMock },
      ],
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

  it('should render ng-alert when indice is 1', () => {
    component.indice = 1;
    fixture.detectChanges();
    const alertElement = fixture.debugElement.nativeElement.querySelector('ng-alert');
    expect(alertElement).toBeTruthy();
  });

  it('validarFormulariosPasoActual should call pasoUnoComponent.validarFormularios when indice is 1', () => {
    component.indice = 1;
    component.pasoUnoComponent = { validarFormularios: jest.fn().mockReturnValue(false) } as any;
    const result = component.validarFormulariosPasoActual();
    expect(component.pasoUnoComponent.validarFormularios).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('validarFormulariosPasoActual should return true when pasoUnoComponent is undefined', () => {
    component.indice = 1;
    component.pasoUnoComponent = undefined as any;
    const result = component.validarFormulariosPasoActual();
    expect(result).toBe(true);
  });

  it('mostrarNotificacionError should set nuevaNotificacion and btnContinuar', () => {
    component.mostrarNotificacionError();
    expect(component.nuevaNotificacion).toEqual(expect.objectContaining({
      tipoNotificacion: expect.any(String),
      categoria: expect.any(String),
      mensaje: expect.any(String),
    }));
    expect(component.btnContinuar).toBe(true);
  });

  it('btnContinuarNotificacion should set btnContinuar to false', () => {
    component.btnContinuar = true;
    component.btnContinuarNotificacion();
    expect(component.btnContinuar).toBe(false);
  });

  it('getValorIndice should show notificacion error if validarFormulariosPasoActual returns false on cont', () => {
    component.indice = 1;
    component.pasoUnoComponent = { validarFormularios: jest.fn().mockReturnValue(false) } as any;
    const spyShow = jest.spyOn(component, 'mostrarNotificacionError');
    component.getValorIndice({ accion: 'cont', valor: 1 });
    expect(component.isPeligro).toBe(true);
    expect(component.peligroTexto).toContain('¡Error de registro!');
    expect(spyShow).toHaveBeenCalled();
  });

});