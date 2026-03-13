// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { RepresentanteLegalComponent } from './representante-legal.component';
import { FormBuilder } from '@angular/forms';
import { MaterialesPeligrososService } from '../../services/materiales-peligrosos.service';
import { Location } from '@angular/common';
import { Tramite230501Store } from '../../estados/stores/tramite230501Store.store';
import { Tramite230501Query } from '../../estados/queries/tramite230501Query.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockMaterialesPeligrososService {}

@Injectable()
class MockTramite230501Store {}

@Injectable()
class MockTramite230501Query {}

describe('RepresentanteLegalComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: MaterialesPeligrososService, useClass: MockMaterialesPeligrososService },
        Location,
        { provide: Tramite230501Store, useClass: MockTramite230501Store },
        { provide: Tramite230501Query, useClass: MockTramite230501Query },
        ConsultaioQuery
      ]
    }).overrideComponent(RepresentanteLegalComponent, {

      set: { providers: [{ provide: MaterialesPeligrososService, useClass: MockMaterialesPeligrososService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(RepresentanteLegalComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #onTipoPersonaChange()', async () => {
    component.tipoPersona = component.tipoPersona || {};
    component.tipoPersona.FISICA = 'FISICA';
    component.representanteLegalForm = component.representanteLegalForm || {};
    component.representanteLegalForm.get = jest.fn().mockReturnValue({
      updateValueAndValidity: function() {},
      setValidators: function() {},
      clearValidators: function() {}
    });
    component.onTipoPersonaChange({});
    expect(component.representanteLegalForm.get).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.createRepresentForm = jest.fn();
    component.onTipoPersonaChange = jest.fn();
    component.tipoPersona = component.tipoPersona || {};
    component.tipoPersona.FISICA = 'FISICA';
    component.cargarDatos = jest.fn();
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.representanteSujeto = observableOf({});
    component.representanteLegalForm = component.representanteLegalForm || {};
    component.representanteLegalForm.patchValue = jest.fn();
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.esRepresentanteLegalElModoDeEdicion$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
  });

  it('should run #cargarDatos()', async () => {
    component.materialesPeligrososService = component.materialesPeligrososService || {};
    component.materialesPeligrososService.obtenerListaPaises = jest.fn().mockReturnValue(observableOf({}));
    component.cargarDatos();
  });

  it('should run #guardarRepresentante()', async () => {
    component.representanteLegalForm = component.representanteLegalForm || {};
    component.representanteLegalForm.value = {
      segundoApellido: {},
      primerApellido: {},
      nombres: {},
      rfc: {},
      lada: {},
      telefono: {},
      correoElectronico: {},
      calle: {},
      numeroExterior: {},
      numeroInterior: {},
      pais: {},
      colonia: {},
      municipio: {},
      localidad: {},
      estadoLocalidad: {},
      codigoPostal: {},
      codie: {},
      tipoPersona: {}
    };
    component.representanteLegalForm.valid = 'valid';
    component.representanteLegalForm.reset = jest.fn();
    component.setFormValida = jest.fn();
    component.representantes = component.representantes || {};
    component.representantes.push = jest.fn();
    component.updateRepresentanteLegal = jest.fn();
    component.addRepresentanteLegal = jest.fn();
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.guardarRepresentante();
  });

  it('should run #limpiarFormulario()', async () => {
    component.representanteLegalForm = component.representanteLegalForm || {};
    component.representanteLegalForm.reset = jest.fn();
    component.limpiarFormulario();
  });

  it('should run #cancelar()', async () => {
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.cancelar();
  });

  it('should run #setFormValida()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setFormValida = jest.fn();
    component.setFormValida({});
  });

  it('should run #addRepresentanteLegal()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.addRepresentanteLegalTablaDatos = jest.fn();
    component.addRepresentanteLegal({});
  });

  it('should run #updateRepresentanteLegal()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateRepresentanteLegalTablaDatos = jest.fn();
    component.updateRepresentanteLegal({});
  });

  it('should run #createRepresentForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.createRepresentForm();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.representanteLegalForm = component.representanteLegalForm || {};
    component.representanteLegalForm.disable = jest.fn();
    component.createRepresentForm = jest.fn();
    component.inicializarEstadoFormulario();
  });

  it('should run #ngOnDestroy()', async () => {
    component.unsubscribe$ = component.unsubscribe$ || {};
    component.unsubscribe$.next = jest.fn();
    component.unsubscribe$.complete = jest.fn();
    component.ngOnDestroy();
  });

});