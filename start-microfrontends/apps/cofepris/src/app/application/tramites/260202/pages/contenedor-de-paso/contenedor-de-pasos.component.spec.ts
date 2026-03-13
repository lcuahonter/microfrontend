// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ContenedorDePasosComponent } from './contenedor-de-pasos.component';


describe('ContenedorDePasosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        ContenedorDePasosComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [

      ]
    }).overrideComponent(ContenedorDePasosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ContenedorDePasosComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
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


  });
  it('should run #getValorIndice() with valid valor and accion "cont"', async () => {
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();

    component.getValorIndice({
      valor: 2,
      accion: 'cont'
    });

    expect(component.indice).toBe(2);
    expect(component.tituloMensaje).toBe('Cargar archivos');
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should run #getValorIndice() with valid valor and accion "atras"', async () => {
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();

    component.getValorIndice({
      valor: 2,
      accion: 'atras'
    });

    expect(component.indice).toBe(2);
    expect(component.tituloMensaje).toBe('Cargar archivos');
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not update indice or call wizard methods for invalid valor in #getValorIndice()', async () => {
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();

    component.getValorIndice({
      valor: 6,
      accion: 'cont'
    });

    expect(component.indice).toBe(1); // Default value
    expect(component.tituloMensaje).toBe('Permiso sanitario de importación de materias primas');
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should run #obtenerNombreDelTítulo() and return correct title', async () => {
    const title1 = ContenedorDePasosComponent.obtenerNombreDelTítulo(1);
    const title2 = ContenedorDePasosComponent.obtenerNombreDelTítulo(2);
    const title3 = ContenedorDePasosComponent.obtenerNombreDelTítulo(3);
    const titleDefault = ContenedorDePasosComponent.obtenerNombreDelTítulo(99);

    expect(title1).toBe('Permiso sanitario de importación de materias primas');
    expect(title2).toBe('Cargar archivos');
    expect(title3).toBe('Firmar');
    expect(titleDefault).toBe('Permiso sanitario de importación de materias primas'); 
  });

});