// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite80102Query } from '../../estados/tramite80102.query';
import { Tramite80102Store } from '../../estados/tramite80102.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { AutorizacionProgrmaNuevoService } from '../../services/autorizacion-programa-nuevo.service';

@Injectable()
class MockTramite80102Query {}

@Injectable()
class MockTramite80102Store {}

@Injectable()
class MockAutorizacionProgrmaNuevoService {}


describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite80102Query, useClass: MockTramite80102Query },
        { provide: Tramite80102Store, useClass: MockTramite80102Store },
        ConsultaioQuery,
        { provide: AutorizacionProgrmaNuevoService, useClass: MockAutorizacionProgrmaNuevoService }
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.consultaState = component.consultaState || { update: true, procedureId: '80102', create: false};
    component.guardarDatosFormulario = jest.fn();
    component.query = component.query || {};
    component.query.indicePrevioRuta$ = observableOf({});
    component.ngOnInit();
    expect(component.guardarDatosFormulario).not.toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.autorizacionProgrmaNuevoService = component.autorizacionProgrmaNuevoService || {};
    component.autorizacionProgrmaNuevoService.getRegistroTomaMuestrasMercanciasData = jest.fn().mockReturnValue(observableOf({}));
    component.autorizacionProgrmaNuevoService.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
    expect(component.autorizacionProgrmaNuevoService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {
    component.store = component.store || {};
    component.store.setindicePrevioRuta = jest.fn();
    component.seleccionaTab(1);
    expect(component.store.setindicePrevioRuta).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
  });

});