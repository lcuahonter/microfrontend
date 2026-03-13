// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TercerosrelacionadosComponent } from './tercerosrelacionados.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Injectable()
class MockRouter {
  navigate() {};
}

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

describe('TercerosrelacionadosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, TercerosrelacionadosComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {url: 'url', params: {}, queryParams: {}, data: {}},
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        },
        FormBuilder
      ]
    }).overrideComponent(TercerosrelacionadosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TercerosrelacionadosComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #goToAgregarDestinatario()', async () => {
    component.abrirModalDestinatario = component.abrirModalDestinatario || {};
    component.abrirModalDestinatario.emit = jest.fn();
    component.goToAgregarDestinatario();
    expect(component.abrirModalDestinatario.emit).toHaveBeenCalled();
  });

  it('should run #goToAgregarExportador()', async () => {
    component.abrirModalExportador = component.abrirModalExportador || {};
    component.abrirModalExportador.emit = jest.fn();
    component.goToAgregarExportador();
    expect(component.abrirModalExportador.emit).toHaveBeenCalled();
  });

  it('should run #modificarDestinatario()', async () => {
    component.listaDeFilaSeleccionada = component.listaDeFilaSeleccionada || {};
    component.listaDeFilaSeleccionada[0] = '0';
    component.abrirModalDestinatario = component.abrirModalDestinatario || {};
    component.abrirModalDestinatario.emit = jest.fn();
    component.modificarDestinatario();
    expect(component.abrirModalDestinatario.emit).toHaveBeenCalled();
  });

  it('should run #modificarExportador()', async () => {
    component.listaDeFilaSeleccionadaFinal = component.listaDeFilaSeleccionadaFinal || {};
    component.listaDeFilaSeleccionadaFinal[0] = '0';
    component.abrirModalExportador = component.abrirModalExportador || {};
    component.abrirModalExportador.emit = jest.fn();
    component.modificarExportador();
    expect(component.abrirModalExportador.emit).toHaveBeenCalled();
  });

  it('should run #onSeleccionDestinatario()', async () => {

    component.onSeleccionDestinatario({});

  });

  it('should run #onSeleccionDestinatarioFinal()', async () => {

    component.onSeleccionDestinatarioFinal({});

  });

  it('should run #emitEliminar()', async () => {
    component.eliminarSeleccion = component.eliminarSeleccion || {};
    component.eliminarSeleccion.emit = jest.fn();
    component.emitEliminar();
    expect(component.eliminarSeleccion.emit).toHaveBeenCalled();
  });

  it('should run #emitEliminarFinal()', async () => {
    component.eliminarSeleccionEstinoTable = component.eliminarSeleccionEstinoTable || {};
    component.eliminarSeleccionEstinoTable.emit = jest.fn();
    component.emitEliminarFinal();
    expect(component.eliminarSeleccionEstinoTable.emit).toHaveBeenCalled();
  });

  it('should run #buscarDestinatario()', async () => {
    component.nextField = component.nextField || {};
    component.nextField.nativeElement = {
      focus: function() {}
    };
    component.buscarDestinatario();

  });

  it('should run #limpiarFormulario()', async () => {
    component.buscarForm = component.buscarForm || {};
    component.buscarForm.reset = jest.fn();
    component.buscarForm.patchValue = jest.fn();
    component.limpiarFormulario();
    expect(component.buscarForm.reset).toHaveBeenCalled();
    expect(component.buscarForm.patchValue).toHaveBeenCalled();
  });

  it('should run #eliminarPedimentoDatos()', async () => {
    component.eliminarSeleccion = component.eliminarSeleccion || {};
    component.eliminarSeleccion.emit = jest.fn();
    component.eliminarPedimentoDatos({});
    expect(component.eliminarSeleccion.emit).toHaveBeenCalled();
  });

  it('should run #eliminarExportador()', async () => {
    component.eliminarSeleccionEstinoTable = component.eliminarSeleccionEstinoTable || {};
    component.eliminarSeleccionEstinoTable.emit = jest.fn();
    component.eliminarExportador({});
    expect(component.eliminarSeleccionEstinoTable.emit).toHaveBeenCalled();
  });

});