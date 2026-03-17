import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitantePageComponent } from './solicitante-page.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { AlertComponent } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InjectionToken } from '@angular/core';

// Mocks
class Tramite32506StoreMock {
  setPasoActivo = jest.fn();
}
class Tramite32506QueryMock {
  selectSolicitud$ = of({ some: 'state' });
}
class WizardComponentMock {
  siguiente = jest.fn(() => of());
  atras = jest.fn(() => of());
}

export const TRAMITE_STORE = new InjectionToken('Tramite32506Store');
export const TRAMITE_QUERY = new InjectionToken('Tramite32506Query');

describe('SolicitantePageComponent', () => {
  let component: SolicitantePageComponent;
  let fixture: ComponentFixture<SolicitantePageComponent>;
  let store: Tramite32506StoreMock;
  let tramiteQuery: Tramite32506QueryMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SolicitantePageComponent,
        WizardComponent,
        BtnContinuarComponent,
        AlertComponent,
        PasoUnoComponent,
        PasoDosComponent,
        PasoTresComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        { provide: TRAMITE_STORE, useClass: Tramite32506StoreMock },
        { provide: TRAMITE_QUERY, useClass: Tramite32506QueryMock },
      ],
    })
      .overrideComponent(SolicitantePageComponent, {
        set: {
          providers: [
            { provide: Tramite32506StoreMock, useClass: Tramite32506StoreMock },
            { provide: Tramite32506QueryMock, useClass: Tramite32506QueryMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SolicitantePageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(TRAMITE_STORE) as any;
    tramiteQuery = TestBed.inject(TRAMITE_QUERY) as any;
    component.wizardComponent = new WizardComponentMock() as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pasos and datosPasos', () => {
    expect(component.pasos.length).toBeGreaterThan(0);
    expect(component.datosPasos.nroPasos).toEqual(component.pasos.length);
    expect(component.datosPasos.indice).toEqual(component.indice);
  });

  it('should subscribe to tramiteQuery.selectSolicitud$ on ngOnInit and set tramiteState', () => {
    component.tramiteQuery = {
      selectSolicitud$: of({ foo: 'bar' }),
    } as any;
    component.ngOnInit();
    expect(component.tramiteState).toEqual({ foo: 'bar' });
  });

  it('should call wizardComponent.siguiente and store.setPasoActivo on getValorIndice with accion "cont"', () => {
    const accion = { accion: 'cont', valor: 2 };
    component.getValorIndice(accion as any);
    expect(component.indice).toBe(2);
  });

  it('should call wizardComponent.atras and store.setPasoActivo on getValorIndice with accion "atras"', () => {
    const accion = { accion: 'atras', valor: 1 };
    component.getValorIndice(accion as any);
    expect(component.indice).toBe(1);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const spyNext = jest.spyOn(component.destroyNotifier$, 'next');
    const spyComplete = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
