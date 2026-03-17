// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { CafeExportadoresComponent } from './cafe-exportadores.component';

describe('CafeExportadoresComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [ CafeExportadoresComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [

      ]
    }).overrideComponent(CafeExportadoresComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(CafeExportadoresComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy = () => {}; 
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #getValorIndice()', async () => {
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({
      valor: {},
      accion: {}
    });
  });
it('should call wizardComponent.siguiente when accion is "cont" and valor in range', () => {
  component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() };
  component.indice = 0;
  component.getValorIndice({ valor: 2, accion: 'cont' });
  expect(component.indice).toBe(2);
  expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  expect(component.wizardComponent.atras).not.toHaveBeenCalled();
});

it('should call wizardComponent.atras when accion is not "cont" and valor in range', () => {
  component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() };
  component.indice = 0;
  component.getValorIndice({ valor: 3, accion: 'back' });
  expect(component.indice).toBe(3);
  expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  expect(component.wizardComponent.atras).toHaveBeenCalled();
});

it('should not call wizardComponent methods when valor is out of range', () => {
  component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() };
  component.indice = 0;
  component.getValorIndice({ valor: 0, accion: 'cont' });
  expect(component.indice).toBe(0);
  expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  expect(component.wizardComponent.atras).not.toHaveBeenCalled();
});
});