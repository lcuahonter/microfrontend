// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { HistoricoProductoresComponent } from './historico-productores.component';
import { FormBuilder } from '@angular/forms';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';

describe('HistoricoProductoresComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        ValidacionesFormularioService
      ]
    }).overrideComponent(HistoricoProductoresComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(HistoricoProductoresComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.initFormulario = jest.fn();
    component.initAgregarDatosProductorFormulario = jest.fn();
    component.formulario = component.formulario || {};
    component.formulario.patchValue = jest.fn();
    component.agregarDatosProductorFormulario = component.agregarDatosProductorFormulario || {};
    component.agregarDatosProductorFormulario.patchValue = jest.fn();
    component.ngOnInit();
  });

  it('should run #initFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.initFormulario();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #initAgregarDatosProductorFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.initAgregarDatosProductorFormulario();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #obtenerSeleccionadoProductores()', async () => {
    component.obtenerSeleccionadoProductores({});
  });

  it('should run #obtenerAnadirProductosSeleccionados()', async () => {
    component.obtenerAnadirProductosSeleccionados({});
  });


  it('should run #agregarExportador()', async () => {
    component.agregarDatosProductorFormulario = component.agregarDatosProductorFormulario || {};
    component.agregarDatosProductorFormulario.markAllAsTouched = jest.fn();
    component.agregarDatosProductorFormulario.valid = 'valid';
    component.agregarExportador();
    expect(component.agregarDatosProductorFormulario.markAllAsTouched).toHaveBeenCalled();
  });

  it('should run #isValid()', async () => {
    component.validacionesService = component.validacionesService || {};
    component.validacionesService.isValid = jest.fn();
    component.isValid({}, {});
    expect(component.validacionesService.isValid).toHaveBeenCalled();
  });

  it('should run #setValoresStore()', async () => {
    component.formulario = component.formulario || {};
    component.formulario.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.formulario.valid = 'valid';
    component.formaValida = component.formaValida || {};
    component.formaValida.emit = jest.fn();
    component.formHistoricoEvent = component.formHistoricoEvent || {};
    component.formHistoricoEvent.emit = jest.fn();
    component.setValoresStore({}, {}, {});
  });

  it('should run #setValoresStoreAgregarForm()', async () => {
    component.agregarDatosProductorFormulario = component.agregarDatosProductorFormulario || {};
    component.agregarDatosProductorFormulario.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.agregarDatosProductorFormulario.valid = 'valid';
    component.formaValida = component.formaValida || {};
    component.formaValida.emit = jest.fn();
    component.agregarDatosProductorFormularioEvent = component.agregarDatosProductorFormularioEvent || {};
    component.agregarDatosProductorFormularioEvent.emit = jest.fn();
    component.setValoresStoreAgregarForm({}, {}, {});
  });



  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

});