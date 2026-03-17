// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ContenedorDePasosComponent } from './contenedor-de-pasos.component';


const TITULOMENSAJE = 'Título del Mensaje';


describe('ContenedorDePasosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, ],
      declarations: [
        ContenedorDePasosComponent
       
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

  it('should initialize pasos and datosPasos correctly', () => {
    expect(component.pasos).toBeDefined();
    expect(Array.isArray(component.pasos)).toBe(true);
    expect(component.datosPasos).toBeDefined();
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
  });

  it('should call wizardComponent.siguiente when accion is "cont" and valor is valid', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    };
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should call wizardComponent.atras when accion is not "cont" and valor is valid', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    };
    component.getValorIndice({ valor: 3, accion: 'back' });
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should not change indice or call wizardComponent methods if valor is out of range', () => {
    component.indice = 1;
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    };
    component.getValorIndice({ valor: 0, accion: 'cont' });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();

    component.getValorIndice({ valor: 5, accion: 'cont' });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
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


    it('should return "Cargar archivos" when valor is 2', () => {
      expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(2)).toBe('Cargar archivos');
    });

    it('should return "Firmar" when valor is 3', () => {
      expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(3)).toBe('Firmar');
    });

  });