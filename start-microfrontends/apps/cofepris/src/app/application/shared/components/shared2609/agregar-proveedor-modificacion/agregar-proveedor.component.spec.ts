// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AgregarProveedorComponent } from './agregar-proveedor.component';
import { FormBuilder } from '@angular/forms';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { Location } from '@angular/common';
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

describe('AgregarProveedorComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, AgregarProveedorComponent, HttpClientTestingModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: DatosSolicitudService, useClass: MockDatosSolicitudService },
        Location
      ]
    }).overrideComponent(AgregarProveedorComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AgregarProveedorComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.cargarDatos = jest.fn();
    component.validarElementos = jest.fn();
    component.crearAgregarFormularioProveedor = jest.fn();
    component.changeNacionalidad = jest.fn();
    component.agregarProveedorForm = { get: jest.fn() };
    component.ngOnInit();
    expect(component.cargarDatos).toHaveBeenCalled();
    expect(component.validarElementos).toHaveBeenCalled();
    expect(component.crearAgregarFormularioProveedor).toHaveBeenCalled();
    expect(component.changeNacionalidad).toHaveBeenCalled();
  });

  it('should run #obtenerValor()', async () => {

    component.obtenerValor({});

  });

  it('should run #crearAgregarFormularioProveedor()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.obtenerValor = jest.fn();
    component.elementosRequeridos = component.elementosRequeridos || {};
    component.elementosRequeridos.includes = jest.fn();
    component.elementosDeshabilitados = component.elementosDeshabilitados || {};
    component.elementosDeshabilitados.includes = jest.fn();
    component.crearAgregarFormularioProveedor();
    expect(component.fb.group).toHaveBeenCalled();
    expect(component.obtenerValor).toHaveBeenCalled();
    expect(component.elementosRequeridos.includes).toHaveBeenCalled();
    expect(component.elementosDeshabilitados.includes).toHaveBeenCalled();
  });

  it('should run #validarElementos()', async () => {

    component.validarElementos();

  });

  it('should run #cargarDatos()', async () => {
    component.datosSolicitudService = component.datosSolicitudService || {};
    component.datosSolicitudService.obtenerListaPaises = jest.fn().mockReturnValue(observableOf({}));
    component.cargarDatos();
    expect(component.datosSolicitudService.obtenerListaPaises).toHaveBeenCalled();
  });

  it('should run #guardarProveedor()', async () => {
    component.agregarProveedorForm = component.agregarProveedorForm || {};
    component.agregarProveedorForm.getRawValue = jest.fn().mockReturnValue({
      lada: {},
      razonSocial: {},
      segundoApellido: {},
      primerApellido: {},
      nombres: {},
      codigoPostal: {},
      estadoLocalidad: {},
      estado: {},
      colonia: {},
      pais: {},
      numeroInterior: {},
      numeroExterior: {},
      calle: {},
      correoElectronico: {},
      telefono: {},
      tipoPersona: {},
      denominacionRazon: {}
    });
    component.agregarProveedorForm.reset = jest.fn();
    component.tipoPersona = component.tipoPersona || {};
    component.tipoPersona.MORAL = 'MORAL';
    component.tipoPersona.FISICA = 'FISICA';
    component.proveedores = component.proveedores || {};
    component.proveedores.push = jest.fn();
    component.updateProveedorTablaDatos = component.updateProveedorTablaDatos || {};
    component.updateProveedorTablaDatos.emit = jest.fn();
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.guardarProveedor();
    expect(component.agregarProveedorForm.getRawValue).toHaveBeenCalled();
    expect(component.agregarProveedorForm.reset).toHaveBeenCalled();
    expect(component.proveedores.push).toHaveBeenCalled();
    expect(component.updateProveedorTablaDatos.emit).toHaveBeenCalled();
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });

  it('should run #limpiarFormulario()', async () => {
    component.agregarProveedorForm = component.agregarProveedorForm || {};
    component.agregarProveedorForm.reset = jest.fn();
    component.limpiarFormulario();
    expect(component.agregarProveedorForm.reset).toHaveBeenCalled();
  });

  it('should run #cancelar()', async () => {
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.cancelar();
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });

  it('should run #esInvalido()', async () => {
    component.agregarProveedorForm = component.agregarProveedorForm || {};
    component.agregarProveedorForm.get = jest.fn().mockReturnValue({
      dirty: {},
      touched: {},
      invalid: {}
    });
    component.esInvalido({});
    expect(component.agregarProveedorForm.get).toHaveBeenCalled();
  });

  it('should run #changeNacionalidad()', async () => {
    const mockControl = {
      disable: jest.fn(),
      enable: jest.fn()
    };
    
    component.agregarProveedorForm = {
      value: { tipoPersona: '' },
      controls: { 
        tipoPersona: mockControl,
        otherControl: mockControl 
      },
      get: jest.fn().mockReturnValue(mockControl)
    };
    
    component.changeNacionalidad();
    expect(component.agregarProveedorForm.get).toHaveBeenCalled();
    expect(mockControl.disable).toHaveBeenCalled();
    expect(mockControl.enable).toHaveBeenCalled();
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