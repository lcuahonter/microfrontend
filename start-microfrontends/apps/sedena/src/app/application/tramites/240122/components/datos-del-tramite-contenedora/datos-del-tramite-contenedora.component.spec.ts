// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosDelTramiteContenedoraComponent } from './datos-del-tramite-contenedora.component';
import { Tramite240122Query } from '../../estados/tramite240122Query.query';
import { Tramite240122Store } from '../../estados/tramite240122Store.store';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { ActivatedRoute } from '@angular/router';

@Injectable()
class MockTramite240122Query { }

@Injectable()
class MockTramite240122Store { }

describe('DatosDelTramiteContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Tramite240122Query, useClass: MockTramite240122Query },
        { provide: Tramite240122Store, useClass: MockTramite240122Store },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              queryParams: {}
            }
          }
        },
        ConsultaioQuery
      ]
    }).overrideComponent(DatosDelTramiteContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosDelTramiteContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.getMercanciaTablaDatos$ = observableOf({});
    component.tramiteQuery.getDatosDelTramite$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #updateDatosDelTramiteFormulario()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateDatosDelTramiteFormState = jest.fn();
    component.updateDatosDelTramiteFormulario({});
    expect(component.tramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.unsubscribe$ = component.unsubscribe$ || {};
    component.unsubscribe$.next = jest.fn();
    component.unsubscribe$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('should set esFormularioSoloLectura to true when selectConsultaioState$ emits readonly true', async () => {
    const mockConsultaioQuery = {
      selectConsultaioState$: observableOf({ readonly: true })
    };
    component.consultaioQuery = mockConsultaioQuery as any;
    component.unsubscribe$ = new (require('rxjs').Subject)();
    component.esFormularioSoloLectura = false;
    component.ngAfterViewInit();
    expect(component.esFormularioSoloLectura).toBe(true);
  });

  it('should set esFormularioSoloLectura to false when selectConsultaioState$ emits readonly false', async () => {
    const mockConsultaioQuery = {
      selectConsultaioState$: observableOf({ readonly: false })
    };
    component.consultaioQuery = mockConsultaioQuery as any;
    component.unsubscribe$ = new (require('rxjs').Subject)();
    component.esFormularioSoloLectura = true;
    component.ngAfterViewInit();
    expect(component.esFormularioSoloLectura).toBe(false);
  });

});