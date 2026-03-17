import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosProductorComponent } from './datos-productor.component';
import { FormBuilder } from '@angular/forms';
import { PermisoImportacionStore } from '../../estados/permiso-importacion.store';
import { Tramite130120Query } from '../../estados/permiso-importacion.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

@Injectable()
class MockPermisoImportacionStore {}

@Injectable()
class MockTramite130120Query {}

describe('DatosProductorComponent', () => {
  let fixture: ComponentFixture<DatosProductorComponent>;
  let component: { ngOnDestroy: () => void; query: { selectDatos$?: any; }; initActionFormBuild: jest.Mock<any, any, any> | (() => void); consultaQuery: { selectConsultaioState$?: any; }; ngOnInit: () => any; fb: { group?: any; }; datosState: { datosProductor?: any; }; datosProductor: { get?: any; controls?: any; }; store: { setPersona_tipo?: any; setDenominación_razón_social?: any; setPersonales_nombre?: any; setPrimer_apellido?: any; setSegundo_apellido?: any; metodoNombre?: any; }; onTipoPersonaProductorChange: (arg0: {}) => void; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DatosProductorComponent ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: PermisoImportacionStore, useClass: MockPermisoImportacionStore },
        { provide: Tramite130120Query, useClass: MockTramite130120Query },
        ConsultaioQuery
      ]
    }).overrideComponent(DatosProductorComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosProductorComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.query = component.query || {};
    component.query.selectDatos$ = observableOf({});
    component.initActionFormBuild = jest.fn();
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    await component.ngOnInit();
    expect(component.initActionFormBuild).toHaveBeenCalled();
  });

  it('should run #initActionFormBuild()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.datosState = component.datosState || {};
    component.datosState.datosProductor = {
      persona_tipo: {},
      personales_nombre: {},
      primer_apellido: {},
      seguna_apellido: {},
      denominación_razón_social: {},
      domicilio: {}
    };
    component.initActionFormBuild();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #onTipoPersonaProductorChange()', async () => {
    component.datosProductor = component.datosProductor || {};
    component.datosProductor.get = jest.fn().mockReturnValue({
      updateValueAndValidity: function() {},
      clearValidators: function() {},
      setValue: function() {},
      setValidators: function() {}
    });
    component.datosProductor.controls = 'controls';
    component.store = component.store || {};
    component.store.setPersona_tipo = jest.fn();
    component.store.setDenominación_razón_social = jest.fn();
    component.store.setPersonales_nombre = jest.fn();
    component.store.setPrimer_apellido = jest.fn();
    component.store.setSegundo_apellido = jest.fn();
    component.onTipoPersonaProductorChange({});
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});