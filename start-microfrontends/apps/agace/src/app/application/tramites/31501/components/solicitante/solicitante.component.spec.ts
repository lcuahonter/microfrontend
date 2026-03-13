// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitanteComponent } from './solicitante.component';
import { SolicitanteService } from '@libs/shared/data-access-user/src/core/services/shared/solicitante/solicitante.service';
import { FormBuilder } from '@angular/forms';
import { FormulariosService } from '@libs/shared/data-access-user/src/core/services/shared/formularios/formularios.service';
import { HttpClientModule } from '@angular/common/http';

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

describe('SolicitanteComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ SolicitanteComponent, FormsModule, ReactiveFormsModule, HttpClientModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        SolicitanteService,
        FormBuilder,
        FormulariosService
      ]
    }).overrideComponent(SolicitanteComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SolicitanteComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #datosGeneralesForm', async () => {
    component.form = component.form || {};
    component.form.get = jest.fn();
    const datosGeneralesForm = component.datosGeneralesForm;
    expect(component.form.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #domicilioFiscalForm', async () => {
    component.form = component.form || {};
    component.form.get = jest.fn();
    const domicilioFiscalForm = component.domicilioFiscalForm;
    expect(component.form.get).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.getDatosGenerales = jest.fn();
    component.ngOnInit();
    expect(component.getDatosGenerales).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });

  it('should run #obtenerTipoPersona()', async () => {

    component.obtenerTipoPersona({});

  });

  it('should run #crearFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.crearFormulario();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #inicializarFormGroup()', () => {
    component.form = {
      get: jest.fn().mockReturnValue({
        addControl: jest.fn(),
      }),
    } as any;

    component.fb = {
      control: jest.fn(),
    } as any;

    const campoMock = [{
      validators: ['required'],
      campo: 'nombreCampo',
      disabled: false,
    }];

    component.inicializarFormGroup(campoMock, 'grupoNombre');

    expect(component.form.get).toHaveBeenCalledWith('grupoNombre');
    expect(component.fb.control).toHaveBeenCalled();
  });

  it('should run #getValidators()', () => {
    const validators = SolicitanteComponent.getValidators(['required', 'maxLength:10', 'pattern:^\\d+$']);
    expect(validators.length).toBe(3);
  });

  it('should run #getDatosGenerales()', async () => {
    component.solicitanteServicio = component.solicitanteServicio || {};
    component.solicitanteServicio.getDatosGenerales = jest.fn().mockReturnValue(observableOf({}));
    component.getDatosGenerales();
    expect(component.solicitanteServicio.getDatosGenerales).toHaveBeenCalled();
  });

});