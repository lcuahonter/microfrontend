// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DesistimientoSolicitudComponent } from './desistimiento-solicitud.component';
import { SeccionLibStore } from '@ng-mf/data-access-user';

describe('DesistimientoSolicitudComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        DesistimientoSolicitudComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        SeccionLibStore
      ]
    }).overrideComponent(DesistimientoSolicitudComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DesistimientoSolicitudComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

  it('should run #getValorIndice()', async () => {
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({
      valor: {},
      accion: {}
    });
    // expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    // expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

});