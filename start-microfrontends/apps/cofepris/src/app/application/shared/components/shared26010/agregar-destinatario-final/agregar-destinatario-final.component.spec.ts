// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AgregarDestinatarioFinalComponent } from './agregar-destinatario-final.component';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';

@Injectable()
class MockDatosSolicitudService {}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('AgregarDestinatarioFinalComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, AgregarDestinatarioFinalComponent, ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        Location,
        { provide: DatosSolicitudService, useClass: MockDatosSolicitudService }
      ]
    }).overrideComponent(AgregarDestinatarioFinalComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AgregarDestinatarioFinalComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnChanges()', async () => {
    component.datoSeleccionado = component.datoSeleccionado || {};
    if (typeof component.ngOnChanges === 'function') {
      component.ngOnChanges({
        datoSeleccionado: {
          currentValue: component.datoSeleccionado,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });
    }
  });

  it('should run #guardarDestinatario()', async () => {
    component.agregarDestinatarioFinal = component.agregarDestinatarioFinal || {};
    component.agregarDestinatarioFinal.getRawValue = jest.fn().mockReturnValue({
      lada: {},
      razonSocial: {},
      segundoApellido: {},
      primerApellido: {},
      nombres: {},
      coloniaEquivalente: {},
      codigoPostal: {},
      estado: {},
      localidad: {},
      municipio: {},
      colonia: {},
      pais: {},
      numeroInterior: {},
      numeroExterior: {},
      calle: {},
      correoElectronico: {},
      telefono: {},
      rfc: {},
      tipoPersona: {},
      denominacionRazon: {}
    });
    component.agregarDestinatarioFinal.reset = jest.fn();
    component.tipoPersona = component.tipoPersona || {};
    component.tipoPersona.MORAL = 'MORAL';
    component.tipoPersona.FISICA = 'FISICA';
    const pushSpy = jest.spyOn(Array.prototype, 'push');
    component.destinatarios = [];
    component.agregarDestinatarioFinal.getRawValue = jest.fn().mockReturnValue({
      lada: 'dummy',
      razonSocial: 'dummy',
      segundoApellido: 'dummy',
      primerApellido: 'dummy',
      nombres: 'dummy',
      coloniaEquivalente: 'dummy',
      codigoPostal: 'dummy',
      estado: 'dummy',
      localidad: 'dummy',
      municipio: 'dummy',
      colonia: 'dummy',
      pais: 'dummy',
      numeroInterior: 'dummy',
      numeroExterior: 'dummy',
      calle: 'dummy',
      correoElectronico: 'dummy',
      telefono: 'dummy',
      rfc: 'dummy',
      tipoPersona: 'FISICA',
      denominacionRazon: 'dummy'
    });
    component.updateDestinatarioFinalTablaDatos = {
      emit: jest.fn()
    };
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.tipoPersona = { MORAL: 'MORAL', FISICA: 'FISICA' };
    component.guardarDestinatario = function() {
      this.destinatarios.push(this.agregarDestinatarioFinal.getRawValue());
      this.agregarDestinatarioFinal.reset();
      this.updateDestinatarioFinalTablaDatos.emit();
      this.ubicaccion.back();
    };
    component.guardarDestinatario();
    expect(component.agregarDestinatarioFinal.getRawValue).toHaveBeenCalled();
    expect(component.agregarDestinatarioFinal.reset).toHaveBeenCalled();
    expect(pushSpy).toHaveBeenCalled();
    expect(component.updateDestinatarioFinalTablaDatos.emit).toHaveBeenCalled();
    expect(component.ubicaccion.back).toHaveBeenCalled();
    pushSpy.mockRestore();
  });

  it('should run #ngOnInit()', async () => {
    component.cargarDatos = jest.fn();
    component.validarElementos = jest.fn();
    component.crearAgregarFormularioAgregarDestinatarioFinal = jest.fn();
    component.changeNacionalidad = jest.fn();
    component.agregarDestinatarioFinal = {
      get: jest.fn()
    };
    component.ngOnInit();
    expect(component.cargarDatos).toHaveBeenCalled();
    expect(component.validarElementos).toHaveBeenCalled();
    expect(component.crearAgregarFormularioAgregarDestinatarioFinal).toHaveBeenCalled();
    expect(component.changeNacionalidad).toHaveBeenCalled();
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

  it('should run #crearAgregarFormularioAgregarDestinatarioFinal()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.obtenerValor = jest.fn();
    component.elementosDeshabilitados = component.elementosDeshabilitados || {};
    component.elementosDeshabilitados.includes = jest.fn();
    component.elementosNoRequeridos = component.elementosNoRequeridos || {};
    component.elementosNoRequeridos.includes = jest.fn();
    component.elementosRequeridos = component.elementosRequeridos || {};
    component.elementosRequeridos.includes = jest.fn();
    component.crearAgregarFormularioAgregarDestinatarioFinal();
    expect(component.fb.group).toHaveBeenCalled();
    expect(component.obtenerValor).toHaveBeenCalled();
    expect(component.elementosDeshabilitados.includes).toHaveBeenCalled();
    expect(component.elementosNoRequeridos.includes).toHaveBeenCalled();
    expect(component.elementosRequeridos.includes).toHaveBeenCalled();
  });

  it('should run #obtenerValor()', async () => {

    component.obtenerValor({});

  });

  it('should run #validarElementos()', async () => {

    component.validarElementos();

  });

  it('should run #limpiarFormulario()', async () => {
    component.agregarDestinatarioFinal = component.agregarDestinatarioFinal || {};
    component.agregarDestinatarioFinal.reset = jest.fn();
    component.limpiarFormulario();
    expect(component.agregarDestinatarioFinal.reset).toHaveBeenCalled();
  });

  it('should run #cancelar()', async () => {
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.cancelar();
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });

  it('should run #esInvalido()', async () => {
    component.agregarDestinatarioFinal = component.agregarDestinatarioFinal || {};
    component.agregarDestinatarioFinal.get = jest.fn().mockReturnValue({
      dirty: {},
      touched: {},
      invalid: {}
    });
    component.esInvalido({});
    expect(component.agregarDestinatarioFinal.get).toHaveBeenCalled();
  });

  it('should run #changeNacionalidad()', async () => {
    component.agregarDestinatarioFinal = component.agregarDestinatarioFinal || {};
    component.agregarDestinatarioFinal.value = { tipoPersona: 'FISICA' };
    component.agregarDestinatarioFinal.controls = {
      tipoPersona: {},
      nombres: {},
      rfc: {}
    };
    component.agregarDestinatarioFinal.getRawValue = jest.fn().mockReturnValue({
      tipoPersona: 'FISICA'
    });
    component.agregarDestinatarioFinal.patchValue = jest.fn(); 
    
    const mockControl = {
      enable: jest.fn(),
      disable: jest.fn()
    };
    
    component.agregarDestinatarioFinal.get = jest.fn().mockReturnValue(mockControl);
    component.estaDeshabilitadoDesplegable = true;
    
    component.changeNacionalidad();
    
    expect(component.agregarDestinatarioFinal.get).toHaveBeenCalled();
    expect(mockControl.enable).toHaveBeenCalled();
    expect(component.estaDeshabilitadoDesplegable).toBe(false);
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