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
import { ProyectoImmexComponent } from './proyecto-immex.component';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';

describe('ProyectoImmexComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],

      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [FormBuilder, Location],
    })
      .overrideComponent(ProyectoImmexComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(ProyectoImmexComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.crearProyectoForm = jest.fn();
    component.ngOnInit();
    expect(component.crearProyectoForm).toHaveBeenCalled();
  });

  it('should run #crearProyectoForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.proyectoImmexDatos = component.proyectoImmexDatos || {};
    component.proyectoImmexDatos.descripcion = 'descripcion';
    component.proyectoImmexDatos.fechaDeFirma = 'fechaDeFirma';
    component.proyectoImmexDatos.fechaDeVigencia = 'fechaDeVigencia';
    component.crearProyectoForm();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #setProyectpLista()', async () => {
    component.obtenerProyectoTablaDevolverLaLlamada =
      component.obtenerProyectoTablaDevolverLaLlamada || {};
    component.obtenerProyectoTablaDevolverLaLlamada.emit = jest.fn();
    component.setProyectpLista({});
    expect(
      component.obtenerProyectoTablaDevolverLaLlamada.emit
    ).toHaveBeenCalled();
  });

  it('should run #aggregar()', async () => {
    component.seleccionList = component.seleccionList || {};
    component.seleccionList[0] = {
      estatus: {},
      ENCABEZADO_FRACCION: {},
    };
    component.proyectoForm = component.proyectoForm || {};
    component.proyectoForm.get = jest.fn().mockReturnValue({
      value: {},
    });
    component.proyectoForm.reset = jest.fn();
    component.proyectoImmexTablaLista = component.proyectoImmexTablaLista || {};
    component.proyectoImmexTablaLista.findIndex = jest.fn().mockReturnValue([
      {
        ENCABEZADO_RFC: {},
      },
    ]);
    component.proyectoImmexTablaLista.splice = jest.fn();
    component.proyectoImmexTablaLista.push = jest.fn();
    component.obtenerProyectoTablaDevolverLaLlamada =
      component.obtenerProyectoTablaDevolverLaLlamada || {};
    component.obtenerProyectoTablaDevolverLaLlamada.emit = jest.fn();
    component.aggregar();
    expect(
      component.obtenerProyectoTablaDevolverLaLlamada.emit
    ).toHaveBeenCalled();
  });

  it('should run #limpar()', async () => {
    component.proyectoForm = component.proyectoForm || {};
    component.proyectoForm.reset = jest.fn();
    component.limpar();
    expect(component.proyectoForm.reset).toHaveBeenCalled();
  });

  it('should run #elimiar()', async () => {
    component.proyectoImmexTablaLista = component.proyectoImmexTablaLista || {};
    component.proyectoImmexTablaLista = ['proyectoImmexTablaLista'];
    component.elimiar();
  });

  it('should run #eidtar()', async () => {
    component.proyectoImmexTablaLista = [
      {
        ENCABEZADO_DESCRIPCION_OTRO: '',
        ENCABEZADO_TIPO_DOCUMENT: '',
        ENCABEZADO_FECHA_FIRMA: '',
        ENCABEZADO_FECHA_VIGENCIA: '',
        ENCABEZADO_RFC: '',
        ENCABEZADO_RAZON_FIRMANTE: '',
        estatus: true,
      },
    ];
    component.seleccionList = [];
    component.proyectoForm = component.proyectoForm || {};
    component.proyectoForm.patchValue = jest.fn();
    component.eidtar();
    expect(component.proyectoForm.patchValue).toHaveBeenCalled();
  });

  it('should run #goBack()', async () => {
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.regresar();
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });
});
