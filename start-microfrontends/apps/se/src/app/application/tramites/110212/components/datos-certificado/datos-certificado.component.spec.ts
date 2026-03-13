// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosCertificadoComponent } from './datos-certificado.component';
import { FormBuilder } from '@angular/forms';
import { Tramite110212Store } from '../../../../estados/tramites/tramite110212.store';
import { Tramite110212Query } from '../../../../estados/queries/tramite110212.query';;
import { SeccionLibQuery, SeccionLibStore } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite110212Store {}

@Injectable()
class MockTramite110212Query {
  formDatosCertificado$ = observableOf({});
  selectIdioma$ = {};
  selectEntidadFederativa$ = {};
  selectrepresentacionFederal$ = {};
}


describe('DatosCertificadoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,DatosCertificadoComponent,HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Tramite110212Store, useClass: MockTramite110212Store },
        { provide: Tramite110212Query, useClass: MockTramite110212Query },
        SeccionLibQuery,
        SeccionLibStore,
        ConsultaioQuery
      ]
    }).overrideComponent(DatosCertificadoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosCertificadoComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #formularioControl', async () => {
    component.formDatosCertificado = component.formDatosCertificado || {};
    component.formDatosCertificado.get = jest.fn();
    const formularioControl = component.formularioControl;
  });

  it('should run GetterDeclaration #childForm', async () => {
    component.datosCertificadoDeRef = component.datosCertificadoDeRef || {};
    component.datosCertificadoDeRef.formDatosCertificado = 'formDatosCertificado';
    const childForm = component.childForm;

  });

  it('should run #ngOnInit()', async () => {
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #setValoresStore()', async () => {
    component.store = component.store || {};
    component.store.setFormDatosCertificado = jest.fn();
    component.setValoresStore({});
  });

  it('should run #idiomaSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setIdiomaSeleccion = jest.fn();
    component.idiomaSeleccion({});
  });

  it('should run #obtenerDatosFormulario()', async () => {
    component.store = component.store || {};
    component.store.setFormDatosCertificado = jest.fn();
    component.obtenerDatosFormulario({});
  });

  it('should run #representacionFederalSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setRepresentacionFederalDatosSeleccion = jest.fn();
    component.representacionFederalSeleccion({});
  });

  it('should run #setFormValida()', async () => {
    component.store = component.store || {};
    component.store.setFormValida = jest.fn();
    component.setFormValida({});
  });

  it('should run #isChildFormValid()', async () => {
    component.datosCertificadoDeRef = component.datosCertificadoDeRef || {};
    component.datosCertificadoDeRef.validarFormularios = jest.fn();
    component.isChildFormValid();
  });


  it('should run #validateAll()', async () => {
    component.datosCertificadoDeRef = component.datosCertificadoDeRef || {};
    component.datosCertificadoDeRef.validarFormularios = jest.fn();
    component.setFormValida = jest.fn();
    component.validateAll();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

});