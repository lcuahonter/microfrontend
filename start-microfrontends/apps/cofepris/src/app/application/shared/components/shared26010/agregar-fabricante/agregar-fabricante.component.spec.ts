// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AgregarFabricanteComponent } from './agregar-fabricante.component';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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

describe('AgregarFabricanteComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, AgregarFabricanteComponent, HttpClientTestingModule ],
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
    }).overrideComponent(AgregarFabricanteComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AgregarFabricanteComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.cargarDatos = jest.fn();
    component.validarElementos = jest.fn();
    component.crearAgregarFormularioFabricante = jest.fn();
    component.changeNacionalidad = jest.fn();
    const mockRFCControl = {
      setValidators: jest.fn(),
      updateValueAndValidity: jest.fn(),
      enable: jest.fn(),
      disable: jest.fn(),
      value: '',
      markAsTouched: jest.fn()
    };

    if (!component.agregarFabricanteForm) {
      component.agregarFabricanteForm = {
        getRawValue: jest.fn().mockReturnValue({}),
        get: jest.fn().mockReturnValue(mockRFCControl),
        controls: {
          RFC_CONTROL: mockRFCControl
        }
      };
    } else {
      if (!component.agregarFabricanteForm.getRawValue) {
        component.agregarFabricanteForm.getRawValue = jest.fn().mockReturnValue({});
      }
      if (!component.agregarFabricanteForm.get) {
        component.agregarFabricanteForm.get = jest.fn().mockReturnValue(mockRFCControl);
      }
      if (!component.agregarFabricanteForm.controls) {
        component.agregarFabricanteForm.controls = {
          RFC_CONTROL: mockRFCControl
        };
      } else if (!component.agregarFabricanteForm.controls.RFC_CONTROL) {
        component.agregarFabricanteForm.controls.RFC_CONTROL = mockRFCControl;
      }
    }
    component.ngOnInit();
    expect(component.cargarDatos).toHaveBeenCalled();
    expect(component.validarElementos).toHaveBeenCalled();
    expect(component.crearAgregarFormularioFabricante).toHaveBeenCalled();
    expect(component.changeNacionalidad).toHaveBeenCalled();
  });

  it('should run #crearAgregarFormularioFabricante()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.obtenerValor = jest.fn();
    component.elementosDeshabilitados = component.elementosDeshabilitados || {};
    component.elementosDeshabilitados.includes = jest.fn();
    component.elementosNoRequeridos = component.elementosNoRequeridos || {};
    component.elementosNoRequeridos.includes = jest.fn();
    component.agregarFabricanteForm = component.agregarFabricanteForm || { get: jest.fn() };
    component.crearAgregarFormularioFabricante();
    expect(component.fb.group).toHaveBeenCalled();
    expect(component.obtenerValor).toHaveBeenCalled();
    expect(component.elementosDeshabilitados.includes).toHaveBeenCalled();
    expect(component.elementosNoRequeridos.includes).toHaveBeenCalled();
  });

  it('should run #validarElementos()', async () => {

    component.validarElementos();

  });

  it('should run #guardarFabricante()', async () => {
    component.agregarFabricanteForm = component.agregarFabricanteForm || {};
    component.agregarFabricanteForm.getRawValue = jest.fn().mockReturnValue({
      lada: {},
      razonSocial: {},
      segundoApellido: {},
      primerApellido: {},
      nombres: {},
      coloniaOEquivalente: {},
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
      curp: {},
      rfc: {},
      tipoPersona: {}
    });
    component.tipoPersona = component.tipoPersona || {};
    component.tipoPersona.MORAL = 'MORAL';
    component.tipoPersona.FISICA = 'FISICA';
    component.fabricantes = [];
    component.fabricantes[Symbol.iterator] = Array.prototype[Symbol.iterator];
    component.updateFabricanteTablaDatos = component.updateFabricanteTablaDatos || {};
    component.updateFabricanteTablaDatos.emit = jest.fn();
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.guardarFabricante();
    expect(component.agregarFabricanteForm.getRawValue).toHaveBeenCalled();
    expect(component.fabricantes.length).toBe(1);
    expect(component.updateFabricanteTablaDatos.emit).toHaveBeenCalled();
    expect(component.ubicaccion.back).toHaveBeenCalled();
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
    component.agregarFabricanteForm = component.agregarFabricanteForm || {};
    component.agregarFabricanteForm.reset = jest.fn();
    component.limpiarFormulario();
    expect(component.agregarFabricanteForm.reset).toHaveBeenCalled();
  });

  it('should run #cancelar()', async () => {
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.cancelar();
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });

  it('should run #esInvalido()', async () => {
    component.agregarFabricanteForm = component.agregarFabricanteForm || {};
    component.agregarFabricanteForm.get = jest.fn().mockReturnValue({
      dirty: {},
      touched: {},
      invalid: {}
    });
    component.esInvalido({});
    expect(component.agregarFabricanteForm.get).toHaveBeenCalled();
  });

  it('should run #obtenerValor()', async () => {

    component.obtenerValor({});

  });

  it('should run #changeNacionalidad()', async () => {
    const mockFormControl = {
      disable: jest.fn(),
      enable: jest.fn(),
      value: '',
      setValidators: jest.fn(),
      updateValueAndValidity: jest.fn(),
      markAsTouched: jest.fn()
    };
    
    component.agregarFabricanteForm = component.agregarFabricanteForm || {};
    component.agregarFabricanteForm.get = jest.fn().mockReturnValue(mockFormControl);
    component.agregarFabricanteForm.getRawValue = jest.fn().mockReturnValue({});
    component.agregarFabricanteForm.controls = {
      nacionalidad: mockFormControl,
      tipoPersona: mockFormControl,
      RFC_CONTROL: mockFormControl,
      otherControl: mockFormControl
    };
    
    component.changeNacionalidad();
    
    expect(component.agregarFabricanteForm.get).toHaveBeenCalled();
    expect(mockFormControl.disable).toHaveBeenCalled();
    expect(mockFormControl.enable).toHaveBeenCalled();
    expect(mockFormControl.setValidators).toHaveBeenCalled();
    expect(mockFormControl.updateValueAndValidity).toHaveBeenCalled();
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