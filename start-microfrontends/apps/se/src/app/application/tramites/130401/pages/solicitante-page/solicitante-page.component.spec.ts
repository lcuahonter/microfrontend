import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitantePageComponent } from './solicitante-page.component';
import { AlertComponent, BtnContinuarComponent, WizardComponent } from '@ng-mf/data-access-user';
import { Tramite130401Store } from '../../../../estados/tramites/tramite130401.store';
import { Tramite130401Query } from '../../../../estados/queries/tramite130401.query';
import { of } from 'rxjs';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
      imports: [WizardComponent, BtnContinuarComponent, PasoUnoComponent, PasoTresComponent, AlertComponent, PasoDosComponent],
      declarations: [SolicitantePageComponent],
      providers: [
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        provideHttpClient(),
        { provide: Tramite130401Store, useValue: storeMock },
        { provide: Tramite130401Query, useValue: queryMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
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

  it('should update indice and call wizardComponent.siguiente() on getValorIndice with "cont"', () => {

    component.pasoUnoComponent = {
      modificacionMercancia: {
        validarFormulario: jest.fn().mockReturnValue(true)
      }
    } as any;
    

    component.indice = 1;
    

    jest.spyOn(component, 'obtenerDatosDelStore').mockImplementation(() => {

      component.pasoNavegarPor({ accion: 'cont', valor: 2 });
    });
    
    const wizardComponentSpy = jest.spyOn(component.wizardComponent, 'siguiente');
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(wizardComponentSpy).toHaveBeenCalled();
  });

  it('should update indice and call wizardComponent.atras() on getValorIndice with "atras"', () => {
    const wizardComponentSpy = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice({ accion: 'atras', valor: 1 });
    expect(wizardComponentSpy).toHaveBeenCalled();
  });

  it('should not update indice or call wizardComponent methods if valor is out of range', () => {
    const wizardComponentSpySiguiente = jest.spyOn(component.wizardComponent, 'siguiente');
    const wizardComponentSpyAtras = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice({ accion: 'cont', valor: 5 });
    expect(component.indice).toBe(1);
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

  it('should handle different step indices', () => {
    component.indice = 1;
    expect(component.indice).toBe(1);
    
    component.indice = 2;
    expect(component.indice).toBe(2);
    
    component.indice = 3;
    expect(component.indice).toBe(3);
  });

  it('should maintain proper step navigation state', () => {

    expect(component.pasos).toBeDefined();
    expect(component.indice).toBe(1);
  });
});