// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PagoDeDerechosContenedoraComponent } from './pago-de-derechos-contenedora.component';
import { Tramite240108Query } from '../../estados/tramite240108Query.query';
import { Tramite240108Store } from '../../estados/tramite240108Store.store';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
@Injectable()
class MockTramite240108Query {}

@Injectable()
class MockTramite240108Store {}

describe('PagoDeDerechosContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule ],

      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240108Query, useClass: MockTramite240108Query },
        { provide: Tramite240108Store, useClass: MockTramite240108Store },
        DatosSolicitudService
      ]
    }).overrideComponent(PagoDeDerechosContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PagoDeDerechosContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.getPagoDerechos$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #ngOnDestroy()', async () => {
    component.unsubscribe$ = component.unsubscribe$ || {};
    component.unsubscribe$.next = jest.fn();
    component.unsubscribe$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
  });

  it('should run #updatePagoDerechos()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updatePagoDerechosFormState = jest.fn();
    component.updatePagoDerechos({});
    expect(component.tramiteStore.updatePagoDerechosFormState).toHaveBeenCalled();
  });

});