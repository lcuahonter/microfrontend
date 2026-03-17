import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoDosComponent } from './paso-dos.component';
import { Router } from '@angular/router';
import { TramiteFolioService, TramiteStore } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockRouter {
  navigate() {};
}

describe('PasoDosComponent', () => {
  let fixture: ComponentFixture<PasoDosComponent>;
  let component: { ngOnDestroy: () => void; tramiteFolioService: { obtenerTramite?: any; }; tramiteStore: { establecerTramite?: any; }; router: { navigate?: any; }; obtieneFirma: (arg0: {}) => void; destruirNotificador$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, PasoDosComponent, HttpClientTestingModule ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useClass: MockRouter },
        TramiteFolioService,
        TramiteStore
      ]
    }).overrideComponent(PasoDosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #obtieneFirma()', async () => {
    component.tramiteFolioService = component.tramiteFolioService || {};
    component.tramiteFolioService.obtenerTramite = jest.fn().mockReturnValue(observableOf({}));
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.establecerTramite = jest.fn();
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.obtieneFirma({});
  });

  it('should run #ngOnDestroy()', async () => {
    component.destruirNotificador$ = component.destruirNotificador$ || {};
    component.destruirNotificador$.next = jest.fn();
    component.destruirNotificador$.complete = jest.fn();
    component.ngOnDestroy();
  });

});