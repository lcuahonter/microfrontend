import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ProsecComponent } from './prosec.component';

describe('ProsecComponent', () => {
  let fixture: ComponentFixture<ProsecComponent>;
  let component: { ngOnDestroy: () => void; validarTodosFormulariosPasoUno: jest.Mock<any, any, any> | (() => void); pasos: {}; datosPasos: { indice?: any; }; wizardComponent: { siguiente?: any; atras?: any; }; getValorIndice: (arg0: { accion: {}; valor: {}; }) => void; pasoUnoComponent: { validarFormularios?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        ProsecComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [

      ]
    }).overrideComponent(ProsecComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ProsecComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #getValorIndice()', async () => {
    component.validarTodosFormulariosPasoUno = jest.fn();
    component.pasos = component.pasos || {};
    component.datosPasos = component.datosPasos || {};
    component.datosPasos.indice = 'indice';
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({
      accion: {},
      valor: {}
    });
  });

  it('should run #validarTodosFormulariosPasoUno()', async () => {
    component.pasoUnoComponent = component.pasoUnoComponent || {};
    component.pasoUnoComponent.validarFormularios = jest.fn();
    component.validarTodosFormulariosPasoUno();
  });

});