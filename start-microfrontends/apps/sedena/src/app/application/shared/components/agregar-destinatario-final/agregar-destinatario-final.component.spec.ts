// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {  Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AgregarDestinatarioFinalComponent } from './agregar-destinatario-final.component';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

@Injectable()
class MockDatosSolicitudService {}


describe('AgregarDestinatarioFinalComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,AgregarDestinatarioFinalComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        Location,
        { provide: DatosSolicitudService, useClass: MockDatosSolicitudService },
        ConsultaioQuery
      ]
    }).overrideComponent(AgregarDestinatarioFinalComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AgregarDestinatarioFinalComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.crearFormaulario = jest.fn();
    component.inicializarEstadoFormulario();
    expect(component.crearFormaulario).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.crearFormaulario = jest.fn();
    component.agregarDestinatarioFinal = component.agregarDestinatarioFinal || {};
    component.agregarDestinatarioFinal.disable = jest.fn();
    component.agregarDestinatarioFinal.enable = jest.fn();
    component.guardarDatosFormulario();
    expect(component.crearFormaulario).toHaveBeenCalled();
  });

  it('should run #ngOnChanges()', async () => {

    component.ngOnChanges();

  });

  it('should run #guardarDestinatario()', async () => {
    component.agregarDestinatarioFinal = component.agregarDestinatarioFinal || {};
    component.agregarDestinatarioFinal.markAllAsTouched = jest.fn();
    component.agregarDestinatarioFinal.value = {
      nombres: {},
      primerApellido: {},
      segundoApellido: {},
      rfc: {},
      curp: {},
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
      estado: {},
      codigoPostal: {},
      tipoPersona: {}
    };
    component.destinatarios = component.destinatarios || {};
    component.updateDestinatarioFinalTablaDatos = component.updateDestinatarioFinalTablaDatos || {};
    component.guardarDestinatario();
    expect(component.agregarDestinatarioFinal.markAllAsTouched).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.crearFormaulario = jest.fn();
    component.campoObligatorioChange = jest.fn();
    component.cargarDatos = jest.fn();
    component.ngOnInit();
    expect(component.crearFormaulario).toHaveBeenCalled();
    expect(component.campoObligatorioChange).toHaveBeenCalled();
    expect(component.cargarDatos).toHaveBeenCalled();
  });

  it('should run #crearFormaulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn().mockReturnValue({
      patchValue: function() {},
      get: function() {},
      disable: function() {}
    });
    component.cargarDatos = jest.fn();
    component.crearFormaulario();
    expect(component.fb.group).toHaveBeenCalled();
    expect(component.cargarDatos).toHaveBeenCalled();
  });

  it('should run #campoObligatorioChange()', async () => {
    component.agregarDestinatarioFinal = component.agregarDestinatarioFinal || {};
    component.agregarDestinatarioFinal.get = jest.fn().mockReturnValue({
      updateValueAndValidity: function() {},
      clearValidators: function() {},
      setValidators: function() {}
    });
    component.campoObligatorioChange();
    expect(component.agregarDestinatarioFinal.get).toHaveBeenCalled();
  });

  it('should run #cargarDatos()', async () => {
    component.datosSolicitudService = component.datosSolicitudService || {};
    component.datosSolicitudService.obtenerListaCodigosPostales = jest.fn().mockReturnValue(observableOf({}));
    component.datosSolicitudService.obtenerListaPaises = jest.fn().mockReturnValue(observableOf({}));
    component.datosSolicitudService.obtenerListaEstados = jest.fn().mockReturnValue(observableOf({}));
    component.datosSolicitudService.obtenerListaMunicipios = jest.fn().mockReturnValue(observableOf({}));
    component.datosSolicitudService.obtenerListaLocalidades = jest.fn().mockReturnValue(observableOf({}));
    component.datosSolicitudService.obtenerListaColonias = jest.fn().mockReturnValue(observableOf({}));
    component.cargarDatos();
    expect(component.datosSolicitudService.obtenerListaCodigosPostales).toHaveBeenCalled();
    expect(component.datosSolicitudService.obtenerListaPaises).toHaveBeenCalled();
    expect(component.datosSolicitudService.obtenerListaEstados).toHaveBeenCalled();
    expect(component.datosSolicitudService.obtenerListaMunicipios).toHaveBeenCalled();
    expect(component.datosSolicitudService.obtenerListaLocalidades).toHaveBeenCalled();
    expect(component.datosSolicitudService.obtenerListaColonias).toHaveBeenCalled();
  });

  it('should run #limpiarFormulario()', async () => {
    component.agregarDestinatarioFinal = component.agregarDestinatarioFinal || {};
    component.agregarDestinatarioFinal.reset = jest.fn();
    component.agregarDestinatarioFinal.disable = jest.fn();
    component.agregarDestinatarioFinal.get = jest.fn().mockReturnValue({
      enable: function() {}
    });
    component.limpiarFormulario();
    expect(component.agregarDestinatarioFinal.reset).toHaveBeenCalled();
    expect(component.agregarDestinatarioFinal.disable).toHaveBeenCalled();
    expect(component.agregarDestinatarioFinal.get).toHaveBeenCalled();
  });

  it('should run #cancelar()', async () => {
    component.cancelarEventListener = component.cancelarEventListener || {};
    component.cancelarEventListener.emit = jest.fn();
    component.cancelar();
    // expect(component.cancelarEventListener.emit).toHaveBeenCalled();
  });

  it('should run #tipoPersonaCambioDeValor()', async () => {
    component.agregarDestinatarioFinal = component.agregarDestinatarioFinal || {};
    component.agregarDestinatarioFinal.enable = jest.fn();
    component.agregarDestinatarioFinal.patchValue = jest.fn();
    component.tipoPersonaCambioDeValor({});
    expect(component.agregarDestinatarioFinal.enable).toHaveBeenCalled();
    expect(component.agregarDestinatarioFinal.patchValue).toHaveBeenCalled();
  });

  it('should run #terecerosNacionalidadCambioDeValor()', async () => {
    component.agregarDestinatarioFinal = component.agregarDestinatarioFinal || {};
    component.agregarDestinatarioFinal.patchValue = jest.fn();
    component.terecerosNacionalidadCambioDeValor({});
    expect(component.agregarDestinatarioFinal.patchValue).toHaveBeenCalled();
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