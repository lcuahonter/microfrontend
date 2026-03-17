import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitantePageComponent } from './solicitante-page.component';
import { WizardComponent, BtnContinuarComponent, AlertComponent } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { Tramite6403Store } from '../../estados/tramite6403.store';
import { Tramite6403Query } from '../../estados/tramite6403.query';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SolicitantePageComponent', () => {
  let component: SolicitantePageComponent;
  let fixture: ComponentFixture<SolicitantePageComponent>;
  let storeMock: any;
  let tramiteQueryMock: any;

  beforeEach(async () => {
    storeMock = {
      setPasoActivo: jest.fn(),
    };

    tramiteQueryMock = {
      selectSolicitud$: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [
        SolicitantePageComponent,
        WizardComponent,
        BtnContinuarComponent,
        PasoUnoComponent,
        AlertComponent,
        PasoDosComponent,PasoTresComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: Tramite6403Store, useValue: storeMock },
        { provide: Tramite6403Query, useValue: tramiteQueryMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitantePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    component.pasoUnoComponent = {
      isFormValid: jest.fn().mockReturnValue(true)
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to tramiteQuery.selectSolicitud$ and set tramiteState in ngOnInit', () => {
    component.tramiteState = undefined as any;
    component.ngOnInit();
    expect(component.tramiteState).toBeDefined();
  });

  it('should call wizardComponent.siguiente and setPasoActivo on getValorIndice with accion "cont"', () => {
    component.indice = 1;
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(storeMock.setPasoActivo).toHaveBeenCalledWith(2);
  });

  it('should call wizardComponent.atras and setPasoActivo on getValorIndice with accion "atras"', () => {
    component.indice = 3;
    component.getValorIndice({ accion: 'atras', valor: 2 });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(storeMock.setPasoActivo).toHaveBeenCalledWith(2);
  });

  it('should not change indice or call wizardComponent if valor is out of range', () => {
    component.indice = 2;
    component.getValorIndice({ accion: 'cont', valor: 0 });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    expect(storeMock.setPasoActivo).not.toHaveBeenCalled();

    component.getValorIndice({ accion: 'cont', valor: 5 });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    expect(storeMock.setPasoActivo).not.toHaveBeenCalled();
  });

  it('should complete destroyNotifier$ in ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});