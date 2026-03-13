// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { RepresentanteLegalComponent } from './representante-legal.component';
import { Tramite32515Query } from '../../estados/tramite32515.query';
import { Tramite32515Store } from '../../estados/tramite32515.store';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

@Injectable()
class MockTramite32515Query {}

@Injectable()
class MockTramite32515Store {}

describe('RepresentanteLegalComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite32515Query, useClass: MockTramite32515Query },
        { provide: Tramite32515Store, useClass: MockTramite32515Store },
        ConsultaioQuery
      ]
    }).overrideComponent(RepresentanteLegalComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(RepresentanteLegalComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #ninoFormGroup', async () => {
    component.forma = component.forma || {};
    component.forma.get = jest.fn();
    const ninoFormGroup = component.ninoFormGroup;
    expect(component.forma.get).toHaveBeenCalled();
  });

  it('should run #establecerCambioDeValor()', async () => {
    component.cambioEnValoresStore = jest.fn();
    component.establecerCambioDeValor({
      campo: {},
      valor: {}
    });
    expect(component.cambioEnValoresStore).toHaveBeenCalled();
  });

  it('should run #cambioEnValoresStore()', async () => {
    component.tramiteStore32515 = component.tramiteStore32515 || {};
    component.tramiteStore32515.establecerDatos = jest.fn();
    component.cambioEnValoresStore({}, {});
    expect(component.tramiteStore32515.establecerDatos).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteQuery32515 = component.tramiteQuery32515 || {};
    component.tramiteQuery32515.select$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.ngOnInit();

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