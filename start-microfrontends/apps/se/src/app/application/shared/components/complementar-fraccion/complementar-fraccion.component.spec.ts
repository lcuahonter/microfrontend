// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Pipe,
  PipeTransform,
  Injectable,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  Directive,
  Input,
  Output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ComplementarFraccionComponent } from './complementar-fraccion.component';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';

describe('ComplementarFraccionComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [FormBuilder, Location],
    })
      .overrideComponent(ComplementarFraccionComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(ComplementarFraccionComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.crearFormularioComplimentar = jest.fn();
    component.ngOnInit();
    expect(component.crearFormularioComplimentar).toHaveBeenCalled();
  });

  it('should run #crearFormularioComplimentar()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.complimentarFraccionDatos =
      component.complimentarFraccionDatos || {};
    component.complimentarFraccionDatos.catagoria = 'catagoria';
    component.complimentarFraccionDatos.descripcion = 'descripcion';
    component.complimentarFraccionDatos.monedaNacionalMensual =
      'monedaNacionalMensual';
    component.complimentarFraccionDatos.monedaNacionalDeDosPeriodos =
      'monedaNacionalDeDosPeriodos';
    component.complimentarFraccionDatos.volumenMensual = 'volumenMensual';
    component.complimentarFraccionDatos.twoPeriodVolume = 'twoPeriodVolume';
    component.crearFormularioComplimentar();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #seleccionGuardar()', async () => {
    component.emitirComplimentarFraccionDatos =
      component.emitirComplimentarFraccionDatos || {};
    component.emitirComplimentarFraccionDatos.emit = jest.fn();
    component.complimentarForm = component.complimentarForm || {};
    component.complimentarForm.value = 'value';
    component.seleccionGuardar();
    expect(component.emitirComplimentarFraccionDatos.emit).toHaveBeenCalled();
  });

  it('should run #regresar()', async () => {
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.regresar();
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });
});
