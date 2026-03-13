import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of as observableOf } from 'rxjs';
import { PasoTresComponent } from './paso-tres.component';
import { TramiteStore } from '@ng-mf/data-access-user';
import { Router } from '@angular/router';
import { TramiteFolioService } from '@ng-mf/data-access-user';

@Injectable()
class MockRouter {
  navigate() {};
}

@Injectable()
class MockTramiteStore {}


describe('PasoTresComponent', () => {
  let fixture: ComponentFixture<PasoTresComponent>;
  let component: { ngOnDestroy: () => void; obtenerTipoPersona: (arg0: {}) => void; serviciosExtraordinariosServices: { obtenerTramite?: any; }; tramiteStore: { establecerTramite?: any; }; router: { navigate?: any; }; obtieneFirma: (arg0: {}) => void; destroy$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientModule ],
      declarations: [
        PasoTresComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useClass: MockRouter },
        TramiteFolioService,
        { provide: TramiteStore, useClass: MockTramiteStore }
      ]
    }).overrideComponent(PasoTresComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #obtenerTipoPersona()', async () => {

    component.obtenerTipoPersona({});

  });

  it('should run #obtieneFirma()', async () => {
    component.serviciosExtraordinariosServices = component.serviciosExtraordinariosServices || {};
    component.serviciosExtraordinariosServices.obtenerTramite = jest.fn().mockReturnValue(observableOf({}));
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.establecerTramite = jest.fn();
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.obtieneFirma({});
    expect(component.serviciosExtraordinariosServices.obtenerTramite).toHaveBeenCalled();
    expect(component.tramiteStore.establecerTramite).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });

});