// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder } from '@angular/forms';
import { DesistimientoSolicitudService } from '../../services/desistimiento-solicitud.service';
import { Tramite230301Store } from '../../estados/tramites/tramites230301.store';
import { Solicitud230301Query } from '../../estados/queries/tramites230301.query';
import { SeccionLibQuery, SeccionLibStore } from '@libs/shared/data-access-user/src';

@Injectable()
class MockDesistimientoSolicitudService {}

@Injectable()
class MockSolicitud230301Store {}

@Injectable()
class MockConsultaSolicitud230301Query {}

describe('SolicitudComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        SolicitudComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: DesistimientoSolicitudService, useClass: MockDesistimientoSolicitudService },
        { provide: Tramite230301Store, useClass: MockSolicitud230301Store },
        { provide: Solicitud230301Query, useClass: MockConsultaSolicitud230301Query },
        SeccionLibQuery,
        SeccionLibStore
      ]
    }).overrideComponent(SolicitudComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.consultaSolicitud230301 = component.consultaSolicitud230301 || {};
    component.consultaSolicitud230301.estadoSolicitud$ = observableOf({});
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.getFromdata = jest.fn();
    component.ngOnInit();
    // expect(component.fb.group).toHaveBeenCalled();
    // expect(component.getFromdata).toHaveBeenCalled();
  });

  it('should run #getFromdata()', async () => {
    component.desistimientoService = component.desistimientoService || {};
    component.desistimientoService.getDesistimientoSolicitud = jest.fn().mockReturnValue(observableOf({
      desistimientoFolio: {},
      solicitudTipo: {}
    }));
    component.formDesistimiento = component.formDesistimiento || {};
    component.formDesistimiento.patchValue = jest.fn();
    component.desistimientoStore = component.desistimientoStore || {};
    component.desistimientoStore.setSolicitudTipo = jest.fn();
    component.desistimientoStore.setDesistimientoFolio = jest.fn();
    component.getFromdata();
    // expect(component.desistimientoService.getDesistimientoSolicitud).toHaveBeenCalled();
    // expect(component.formDesistimiento.patchValue).toHaveBeenCalled();
    // expect(component.desistimientoStore.setSolicitudTipo).toHaveBeenCalled();
    // expect(component.desistimientoStore.setDesistimientoFolio).toHaveBeenCalled();
  });

  it('should run #validate()', async () => {
    component.formDesistimiento = component.formDesistimiento || {};
    component.formDesistimiento.valid = 'valid';
    component.formDesistimiento.value = 'value';
    component.formDesistimiento.markAllAsTouched = jest.fn();
    component.validate();
    // expect(component.formDesistimiento.markAllAsTouched).toHaveBeenCalled();
  });

  it('should run #onDescripcionChange()', async () => {
    component.formDesistimiento = component.formDesistimiento || {};
    component.formDesistimiento.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.desistimientoStore = component.desistimientoStore || {};
    component.desistimientoStore.setDesistimientoMotivo = jest.fn();
    component.desistimientoStore.getValue = jest.fn();
    component.seccion = component.seccion || {};
    component.seccion.formaValida = [];
    component.seccionStore = component.seccionStore || {};
    component.seccionStore.establecerFormaValida = jest.fn();
    component.onDescripcionChange();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    // expect(component.destroyNotifier$.next).toHaveBeenCalled();
    // expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});