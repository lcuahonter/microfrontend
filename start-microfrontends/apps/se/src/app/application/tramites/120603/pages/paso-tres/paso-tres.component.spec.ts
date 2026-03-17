import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { TramiteFolioService, TramiteStore } from '@ng-mf/data-access-user';
import { provideHttpClient } from '@angular/common/http';
@Injectable()
class MockRouter {
  navigate() {};
}


describe('PasoTresComponent', () => {
  let fixture: ComponentFixture<PasoTresComponent>;
  let component: { ngOnDestroy: () => void; obtenerTipoPersona: (arg0: {}) => void; serviciosExtraordinariosServices: { obtenerTramite?: any; }; tramiteStore: { establecerTramite?: any; }; router: { navigate?: any; }; obtieneFirma: (arg0: {}) => void; destroyed$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoTresComponent,
        
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        provideHttpClient(),
        { provide: Router, useClass: MockRouter },
        TramiteFolioService,
        TramiteStore
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
    component.destroyed$ = component.destroyed$ || {};
    component.destroyed$.next = jest.fn();
    component.destroyed$.complete = jest.fn();
    component.ngOnDestroy();
     expect(component.destroyed$.next).toHaveBeenCalled();
     expect(component.destroyed$.complete).toHaveBeenCalled();
  });

});