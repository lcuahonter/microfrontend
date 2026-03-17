// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AgregarFacturadorComponent } from './agregar-facturador.component';
import { FormBuilder } from '@angular/forms';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { Location } from '@angular/common';

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

describe('AgregarFacturadorComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, AgregarFacturadorComponent ],
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
    }).overrideComponent(AgregarFacturadorComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AgregarFacturadorComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.cargarDatos = jest.fn();
    component.crearAgregarFormularioFacturador = jest.fn();
    component.changeNacionalidad = jest.fn();
    component.ngOnInit();
    expect(component.cargarDatos).toHaveBeenCalled();
    expect(component.crearAgregarFormularioFacturador).toHaveBeenCalled();
    expect(component.changeNacionalidad).toHaveBeenCalled();
  });

  it('should run #crearAgregarFormularioFacturador()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.obtenerValor = jest.fn();
    component.elementosDeshabilitados = component.elementosDeshabilitados || {};
    component.elementosDeshabilitados.includes = jest.fn();
    component.crearAgregarFormularioFacturador();
    expect(component.fb.group).toHaveBeenCalled();
    expect(component.obtenerValor).toHaveBeenCalled();
    expect(component.elementosDeshabilitados.includes).toHaveBeenCalled();
  });

  it('should run #obtenerValor()', async () => {

    component.obtenerValor({});

  });

  it('should run #cargarDatos()', async () => {
    component.datosSolicitudService = component.datosSolicitudService || {};
    component.datosSolicitudService.obtenerListaPaises = jest.fn().mockReturnValue(observableOf({}));
    component.cargarDatos();
    expect(component.datosSolicitudService.obtenerListaPaises).toHaveBeenCalled();
  });

  it('should run #guardarFacturador()', async () => {
    component.agregarFacturadorForm = component.agregarFacturadorForm || {};
    component.agregarFacturadorForm.getRawValue = jest.fn().mockReturnValue({
      lada: {},
      razonSocial: {},
      segundoApellido: {},
      primerApellido: {},
      nombres: {},
      codigoPostal: {},
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
    component.agregarFacturadorForm.reset = jest.fn();
    component.tipoPersona = component.tipoPersona || {};
    component.tipoPersona.MORAL = 'MORAL';
    component.tipoPersona.FISICA = 'FISICA';
    component.facturadores = component.facturadores || {};
    component.facturadores.push = jest.fn();
    component.updateFacturadorTablaDatos = component.updateFacturadorTablaDatos || {};
    component.updateFacturadorTablaDatos.emit = jest.fn();
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.guardarFacturador();
    expect(component.agregarFacturadorForm.getRawValue).toHaveBeenCalled();
    expect(component.agregarFacturadorForm.reset).toHaveBeenCalled();
    expect(component.facturadores.push).toHaveBeenCalled();
    expect(component.updateFacturadorTablaDatos.emit).toHaveBeenCalled();
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });

  it('should run #limpiarFormulario()', async () => {
    component.agregarFacturadorForm = component.agregarFacturadorForm || {};
    component.agregarFacturadorForm.reset = jest.fn();
    component.limpiarFormulario();
    expect(component.agregarFacturadorForm.reset).toHaveBeenCalled();
  });

  it('should run #cancelar()', async () => {
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.cancelar();
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });

  it('should run #esInvalido()', async () => {
    component.agregarFacturadorForm = component.agregarFacturadorForm || {};
    component.agregarFacturadorForm.get = jest.fn().mockReturnValue({
      dirty: {},
      touched: {},
      invalid: {}
    });
    component.esInvalido({});
    expect(component.agregarFacturadorForm.get).toHaveBeenCalled();
  });

  it('should run #changeNacionalidad()', async () => {
    const mockControl = {
      enable: jest.fn(),
      disable: jest.fn()
    };
    
    component.agregarFacturadorForm = {
      value: { tipoPersona: 'someValue' },
      controls: {
        tipoPersona: mockControl,
        nombres: mockControl,
        primerApellido: mockControl
      },
      get: jest.fn().mockReturnValue(mockControl)
    };
    
    component.estaDeshabilitadoDesplegable = true;
    component.changeNacionalidad();
    
    expect(mockControl.enable).toHaveBeenCalled();
    expect(component.estaDeshabilitadoDesplegable).toBe(false);
  });

  it('should run #changeNacionalidad() when tipoPersona is empty', async () => {
    const mockControl = {
      enable: jest.fn(),
      disable: jest.fn()
    };
    
    component.agregarFacturadorForm = {
      value: { tipoPersona: '' },
      controls: {
        tipoPersona: mockControl,
        nombres: mockControl,
        primerApellido: mockControl
      },
      get: jest.fn().mockReturnValue(mockControl)
    };
    
    component.changeNacionalidad();
    
    expect(mockControl.disable).toHaveBeenCalled();
    expect(mockControl.enable).toHaveBeenCalled(); // tipoPersona should be enabled
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