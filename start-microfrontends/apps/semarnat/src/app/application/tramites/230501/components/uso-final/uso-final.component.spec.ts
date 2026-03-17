// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { UsoFinalComponent } from './uso-final.component';
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

describe('UsoFinalComponent', () => {
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
    }).overrideComponent(UsoFinalComponent, {

      set: { providers: [{ provide: MaterialesPeligrososService, useClass: MockMaterialesPeligrososService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(UsoFinalComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #onTipoPersonaChange()', async () => {
    component.tipoPersona = component.tipoPersona || {};
    component.tipoPersona.FISICA = 'FISICA';
    component.usuarioFinalForm = component.usuarioFinalForm || {};
    component.usuarioFinalForm.get = jest.fn().mockReturnValue({
      updateValueAndValidity: function() {},
      setValidators: function() {},
      clearValidators: function() {}
    });
    component.onTipoPersonaChange({});
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.usoFinalForm = component.usoFinalForm || {};
    component.usoFinalForm.disable = jest.fn();
    component.createUsoFinalForm = jest.fn();
    component.inicializarEstadoFormulario();
  });

  it('should run #ngOnInit()', async () => {
    component.createUsuarioFinalForm = jest.fn();
    component.createUsoFinalForm = jest.fn();
    component.onTipoPersonaChange = jest.fn();
    component.tipoPersona = component.tipoPersona || {};
    component.tipoPersona.FISICA = 'FISICA';
    component.cargarDatos = jest.fn();
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.getusoTablaDatos$ = observableOf({});
    component.tramiteQuery.esUsuarioElModoDeEdicion$ = observableOf({});
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.usuarioSujeto = observableOf({});
    component.usuarioFinalForm = component.usuarioFinalForm || {};
    component.usuarioFinalForm.patchValue = jest.fn();
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
    expect(component.onTipoPersonaChange).toHaveBeenCalled();
    expect(component.cargarDatos).toHaveBeenCalled();
    expect(component.usuarioFinalForm.patchValue).toHaveBeenCalled();
  });

  it('should run #cargarDatos()', async () => {
    component.materialesPeligrososService = component.materialesPeligrososService || {};
    component.materialesPeligrososService.obtenerListaPaises = jest.fn().mockReturnValue(observableOf({}));
    component.cargarDatos();
  });

  it('should run #guardarUsuarioFinal()', async () => {
    component.usuarioFinalForm = component.usuarioFinalForm || {};
    component.usuarioFinalForm.value = {
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
    component.usuarioFinalForm.valid = 'valid';
    component.usuarioFinalForm.reset = jest.fn();
    component.setFormValida = jest.fn();
    component.usuarioFinal = component.usuarioFinal || {};
    component.usuarioFinal.push = jest.fn();
    component.updateUsuario = jest.fn();
    component.addUsuario = jest.fn();
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.guardarUsuarioFinal();
  });

  it('should run #createUsuarioFinalForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.createUsuarioFinalForm();
  });

  it('should run #createUsoFinalForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.createUsoFinalForm();
  });

  it('should run #limpiarFormulario()', async () => {
    component.usuarioFinalForm = component.usuarioFinalForm || {};
    component.usuarioFinalForm.reset = jest.fn();
    component.limpiarFormulario();
  });

  it('should run #cancelar()', async () => {
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.cancelar();
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });

  it('should run #addUsuario()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.addUsuarioTablaDatos = jest.fn();
    component.addUsuario({});
  });

  it('should run #updateUsuario()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateUsuarioTablaDatos = jest.fn();
    component.updateUsuario({});
    expect(component.tramiteStore.updateUsuarioTablaDatos).toHaveBeenCalled();
  });

  it('should run #addUsoFinalTabla()', async () => {
    component.usoFinalForm = component.usoFinalForm || {};
    component.usoFinalForm.value = {
      descripcion: {},
      pais: {}
    };
    component.usoFinalForm.reset = jest.fn();
    component.usoFinals = component.usoFinals || {};
    component.usoFinals.push = jest.fn();
    component.addUsoFinal = jest.fn();
    component.addUsoFinalTabla();
  });

  it('should run #eliminarUsoFinal()', async () => {
    component.usoFinalFilaSeleccionada = component.usoFinalFilaSeleccionada || {};
    component.usoFinalFilaSeleccionada = '0';
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.eliminarUsoFinal = jest.fn();
    component.eliminarUsoFinal();
  });

  it('should run #addUsoFinal()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateUsoFinalTabla = jest.fn();
    component.addUsoFinal({});
  });

  it('should run #ngOnDestroy()', async () => {
    component.unsubscribe$ = component.unsubscribe$ || {};
    component.unsubscribe$.next = jest.fn();
    component.unsubscribe$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

});