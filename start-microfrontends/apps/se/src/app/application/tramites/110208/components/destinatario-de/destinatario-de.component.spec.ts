// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DestinatarioDeComponent } from './destinatario-de.component';
import { FormBuilder } from '@angular/forms';
import { Tramite110208Store } from '../../../../estados/tramites/tramite110208.store';
import { Tramite110208Query } from '../../../../estados/queries/tramite110208.query';
import { SeccionLibQuery, SeccionLibStore } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DestinatarioService } from '../../../../shared/services/destinatario.service';

@Injectable()
class MockTramite110208Store {
  setDestinatarioForm() {}
  setFormDatosDelDestinatario() {}
  setFormDestinatario() {}
  setMedioDeTransporteSeleccion() {}
  setPaisDestinSeleccion() {}
}

@Injectable()
class MockTramite110208Query {
  selectDestinatarioForm$ = observableOf({});
  selectFormDestinatario$ = observableOf({});
  selectFormDatosDelDestinatario$ = observableOf({});
  selectPaisDestino$ = observableOf({});
  selectMedioDeTransporte$ = observableOf({});
}

@Injectable()
class MockDestinatarioService {
  
}

describe('DestinatarioDeComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DestinatarioDeComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Tramite110208Store, useClass: MockTramite110208Store },
        { provide: Tramite110208Query, useClass: MockTramite110208Query },
        SeccionLibQuery,
        SeccionLibStore,
        ConsultaioQuery,
        { provide: DestinatarioService, useClass: MockDestinatarioService }
      ]
    }).overrideComponent(DestinatarioDeComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DestinatarioDeComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #formularioControl', async () => {
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.get = jest.fn();
    const formularioControl = component.formularioControl;
  });

  it('should run #iniciarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.iniciarFormulario();
  });

  it('should run #ngOnInit()', async () => {
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #validateAll()', async () => {
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.markAllAsTouched = jest.fn();
    component.destinatarioComponent = component.destinatarioComponent || {};
    component.destinatarioComponent.markAllFieldsTouched = jest.fn();
    component.destinatarioComponent.formDestinatario = {
      valid: {}
    };
    component.setFormValidaDestinatario = jest.fn();
    component.datosDelDestinatarioComponent = component.datosDelDestinatarioComponent || {};
    component.datosDelDestinatarioComponent.markAllFieldsTouched = jest.fn();
    component.datosDelDestinatarioComponent.formDatosDelDestinatario = {
      valid: {}
    };
    component.setFormValida = jest.fn();
    component.validateAll();
  });

  it('should run #setFormValida()', async () => {

    component.setFormValida({});

  });

  it('should run #setFormValidaDestinatario()', async () => {

    component.setFormValidaDestinatario({});

  });

  it('should run #inicializarSuscripciones()', async () => {
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.selectDestinatarioForm$ = observableOf({});
    component.tramiteQuery.selectFormDestinatario$ = observableOf({});
    component.tramiteQuery.selectFormDatosDelDestinatario$ = observableOf({});
    component.tramiteQuery.selectPaisDestino$ = 'selectPaisDestino$';
    component.tramiteQuery.selectMedioDeTransporte$ = 'selectMedioDeTransporte$';
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.patchValue = jest.fn();
    component.destinatarioForm.valueChanges = observableOf({});
    component.store = component.store || {};
    component.store.setDestinatarioForm = jest.fn();
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.inicializarSuscripciones();
  });

  it('should run #setValoresStore()', async () => {
    component.store = component.store || {};
    component.store.setFormDatosDelDestinatario = jest.fn();
    component.setValoresStore({});
  });

  it('should run #setValoresStoreDe()', async () => {
    component.store = component.store || {};
    component.store.setFormDestinatario = jest.fn();
    component.setValoresStoreDe({});
  });

  it('should run #formDestinatarioFunc()', async () => {
    component.store = component.store || {};
    component.store.setFormDestinatario = jest.fn();
    component.formDestinatarioFunc({});
  });

  it('should run #detosDelDestinatarioFunc()', async () => {
    component.store = component.store || {};
    component.store.setFormDatosDelDestinatario = jest.fn();
    component.detosDelDestinatarioFunc({});
  });

  it('should run #medioDeTransporteSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setMedioDeTransporteSeleccion = jest.fn();
    component.medioDeTransporteSeleccion({});
  });

  it('should run #paisDestinSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setPaisDestinSeleccion = jest.fn();
    component.paisDestinSeleccion({});
  });



});