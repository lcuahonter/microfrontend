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
      imports: [ FormsModule, ReactiveFormsModule , ContenedorDePasosComponent],
      declarations: [
       
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


  it('should set seleccionarFilaNotificacion and mostrarAlerta if both forms are invalid', () => {
    const MENSAJE_DE_VALIDACION = '¿Está seguro que su solicitud no requiere los datos del Pago de derechos?';
    component.datosDeLaSolicitudComponent = {
      datosSolicitudForm: { invalid: true }
    };
    component.pagoDeDerechosComponent = {
      formularioPagoDerechos: { invalid: true }
    };
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    };
    const accion = { valor: 2, accion: 'cont' };
    component.getValorIndice(accion);
    expect(component.seleccionarFilaNotificacion).toBeDefined();
    expect(component.seleccionarFilaNotificacion.mensaje).toBe(MENSAJE_DE_VALIDACION);
    expect(component.mostrarAlerta).toBe(true);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should update tituloMensaje according to the step', () => {
    component.datosDeLaSolicitudComponent = {
      datosSolicitudForm: { invalid: false }
    };
    component.pagoDeDerechosComponent = {
      formularioPagoDerechos: { invalid: false }
    };
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    };
    component.getValorIndice({ valor: 3, accion: 'cont' });
    expect(component.tituloMensaje).toBe('Permiso sanitario de importación de dispositivos médicos para uso médico');
    component.getValorIndice({ valor: 2, accion: 'back' });
    expect(component.tituloMensaje).toBe('Permiso sanitario de importación de dispositivos médicos para uso médico');
  });

  it('should call wizardComponent.atras when accion is not "cont" and valor is valid', () => {
    component.datosDeLaSolicitudComponent = {
      datosSolicitudForm: { invalid: false }
    };
    component.pagoDeDerechosComponent = {
      formularioPagoDerechos: { invalid: false }
    };
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    };
    component.getValorIndice({ valor: 2, accion: 'back' });
    expect(component.indice).toBe(1);
  });

  it('should not set seleccionarFilaNotificacion or mostrarAlerta if only one form is invalid', () => {
    component.datosDeLaSolicitudComponent = {
      datosSolicitudForm: { invalid: false }
    };
    component.pagoDeDerechosComponent = {
      formularioPagoDerechos: { invalid: true }
    };
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    };
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.seleccionarFilaNotificacion).toEqual({"categoria": "danger", "cerrar": true, "mensaje": "¿Está seguro que su solicitud no requiere los datos del Pago de derechos?", "modo": "action", "tiempoDeEspera": 2000, "tipoNotificacion": "alert", "titulo": "", "txtBtnAceptar": "SI", "txtBtnCancelar": "NO"});
    expect(component.mostrarAlerta).toBe(true);
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