// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { Component } from '@angular/core';
import { SolicitudPageComponent } from './solicitud-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('SolicitudPageComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [

      ]
    }).overrideComponent(SolicitudPageComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SolicitudPageComponent);
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
      valor: 2,
      accion: 'cont'
    });
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    component.getValorIndice({
      valor: 2,
      accion: 'test'
    });
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  describe('obtenerNombreDelTítulo', () => {
    it('should return TITULOMENSAJE for valor 1', () => {
      expect(SolicitudPageComponent.obtenerNombreDelTítulo(1)).toBe(component.tituloMensaje);
    });

    it('should return "Cargar requisitos" for valor 2', () => {
      expect(SolicitudPageComponent.obtenerNombreDelTítulo(2)).toBe('Cargar requisitos');
    });

    it('should return "Firmar" for valor 3', () => {
      expect(SolicitudPageComponent.obtenerNombreDelTítulo(3)).toBe('Firmar');
    });

    it('should return TITULOMENSAJE for other values', () => {
      expect(SolicitudPageComponent.obtenerNombreDelTítulo(0)).toBe(component.tituloMensaje);
      expect(SolicitudPageComponent.obtenerNombreDelTítulo(99)).toBe(component.tituloMensaje);
      expect(SolicitudPageComponent.obtenerNombreDelTítulo(-1)).toBe(component.tituloMensaje);
    });
  });

});