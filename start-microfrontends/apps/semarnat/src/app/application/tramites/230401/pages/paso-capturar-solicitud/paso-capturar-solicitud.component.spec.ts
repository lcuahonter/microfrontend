// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoCapturarSolicitudComponent } from './paso-capturar-solicitud.component';



describe('PasoCapturarSolicitudComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoCapturarSolicitudComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [

      ]
    }).overrideComponent(PasoCapturarSolicitudComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoCapturarSolicitudComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #getValorIndice() siguiente', async () => {
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({
      valor: 2,
      accion: 'cont'
    });
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });
  it('should run #getValorIndice() atras', async () => {
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({
      valor: 2,
      accion: 'nonto'
    });
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not call any wizardComponent methods if valor is out of range', async () => {
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({
      valor: 0,
      accion: 'cont'
    });
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();

    component.getValorIndice({
      valor: 5,
      accion: 'cont'
    });
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should update indice correctly when valor is valid', async () => {
    component.wizardComponent = component.wizardComponent || {};
    component.indice = 1;
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({
      valor: 3,
      accion: 'cont'
    });
    expect(component.indice).toBe(3);
  });

  it('should not update indice when valor is out of range', async () => {
    component.wizardComponent = component.wizardComponent || {};
    component.indice = 1;
    component.getValorIndice({
      valor: 0,
      accion: 'cont'
    });
    expect(component.indice).toBe(1);

    component.getValorIndice({
      valor: 5,
      accion: 'cont'
    });
    expect(component.indice).toBe(1);
  });

  it('should handle undefined wizardComponent gracefully', async () => {
    component.wizardComponent = undefined;
    expect(() => {
      component.getValorIndice({
        valor: 2,
        accion: 'cont'
      });
    }).toThrow();
  });
});