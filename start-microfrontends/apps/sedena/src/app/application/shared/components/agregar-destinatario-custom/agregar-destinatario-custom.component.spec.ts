// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AgregarDestinatarioCustomComponent } from './agregar-destinatario-custom.component';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';

@Injectable()
class MockDatosSolicitudService {}


describe('AgregarDestinatarioCustomComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,AgregarDestinatarioCustomComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        Location,
        { provide: DatosSolicitudService, useClass: MockDatosSolicitudService }
      ]
    }).overrideComponent(AgregarDestinatarioCustomComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AgregarDestinatarioCustomComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnChanges()', async () => {

    component.ngOnChanges();

  });

  it('should run #guardarDestinatario()', async () => {
    component.agregarDestinatarioFinal = component.agregarDestinatarioFinal || {};
    component.agregarDestinatarioFinal.value = {
      tipoPersona: {},
      denominacionRazon: {},
      nombres: {},
      primerApellido: {},
      segundoApellido: {},
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
      estado: {},
      codigoPostal: {}
    };
    component.agregarDestinatarioFinal.reset = jest.fn();
    component.destinatarios = component.destinatarios || {};
    component.destinatarios = {
      tableindex: {}
    };
    component.destinatarios.push = jest.fn();
    component.formaDatos = component.formaDatos || {};
    component.actualizaExistenteEnDestinatarioDatos = component.actualizaExistenteEnDestinatarioDatos || {};
    component.actualizaExistenteEnDestinatarioDatos.emit = jest.fn();
    component.updateDestinatarioFinalTablaDatos = component.updateDestinatarioFinalTablaDatos || {};
    component.updateDestinatarioFinalTablaDatos.emit = jest.fn();
    component.ubicaccion = component.ubicaccion || {};
    component.guardarDestinatario();
    expect(component.agregarDestinatarioFinal.reset).toHaveBeenCalled();
    expect(component.destinatarios.push).toHaveBeenCalled();
    expect(component.actualizaExistenteEnDestinatarioDatos.emit).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.crearFormaulario = jest.fn();
    component.cargarDatos = jest.fn();
    component.agregarDestinatarioFinal = component.agregarDestinatarioFinal || {};
    component.agregarDestinatarioFinal.patchValue = jest.fn();
    component.agregarDestinatarioFinal.enable = jest.fn();
    component.destinatarioFinalTablaDatos = component.destinatarioFinalTablaDatos || {};
    component.destinatarioFinalTablaDatos = '0';
    component.tipoPersonaCambioDeValor = jest.fn();
    component.ngOnInit();
    expect(component.crearFormaulario).toHaveBeenCalled();
    expect(component.cargarDatos).toHaveBeenCalled();
  });

  it('should run #ngAfterViewInit()', async () => {
    component.agregarDestinatarioFinal = component.agregarDestinatarioFinal || {};
    component.agregarDestinatarioFinal.disable = jest.fn();
    component.agregarDestinatarioFinal.enable = jest.fn();
    component.ngAfterViewInit();
  });

  it('should run #crearFormaulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn().mockReturnValue({
      patchValue: function() {},
      get: function() {},
      disable: function() {}
    });
    component.crearFormaulario();
    expect(component.fb.group).toHaveBeenCalled();
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
    expect(component.cancelarEventListener.emit).toHaveBeenCalled();
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
    component.unsubscribe$ = component.unsubscribe$ || {};
    component.unsubscribe$.next = jest.fn();
    component.unsubscribe$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

});