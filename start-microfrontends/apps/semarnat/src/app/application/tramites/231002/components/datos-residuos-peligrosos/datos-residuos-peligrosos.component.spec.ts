// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component, ChangeDetectorRef } from '@angular/core';
import { DatosResiduosPeligrososComponent } from './datos-residuos-peligrosos.component';
import { FormBuilder } from '@angular/forms';
import { FormularioResiduoStore } from '../../estados/tramites/datos-residuos.store';
import { FormularioResiduoQuery } from '../../estados/queries/datos-residuos.query';

@Injectable()
class MockFormularioResiduoStore {}

@Injectable()
class MockFormularioResiduoQuery {}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}


describe('DatosResiduosPeligrososComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DatosResiduosPeligrososComponent ],
      declarations: [
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: FormularioResiduoStore, useClass: MockFormularioResiduoStore },
        { provide: FormularioResiduoQuery, useClass: MockFormularioResiduoQuery },
        ChangeDetectorRef
      ]
    }).overrideComponent(DatosResiduosPeligrososComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosResiduosPeligrososComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #agregarHabilitado', async () => {
    component.formularioDatos = component.formularioDatos || {};
    component.formularioDatos.get = jest.fn().mockReturnValue({
      value: {}
    });
    const agregarHabilitado = component.agregarHabilitado;
    expect(component.formularioDatos.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #claveResiduoDisabled', async () => {
    component.formularioResiduo = component.formularioResiduo || {};
    component.formularioResiduo.get = jest.fn();
    const claveResiduoDisabled = component.claveResiduoDisabled;
    expect(component.formularioResiduo.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #nombreDisabled', async () => {
    component.formularioResiduo = component.formularioResiduo || {};
    component.formularioResiduo.get = jest.fn();
    const nombreDisabled = component.nombreDisabled;
    expect(component.formularioResiduo.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #descripcionDisabled', async () => {
    component.formularioResiduo = component.formularioResiduo || {};
    component.formularioResiduo.get = jest.fn();
    const descripcionDisabled = component.descripcionDisabled;
    expect(component.formularioResiduo.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #claveResiduoValue', async () => {
    component.formularioResiduo = component.formularioResiduo || {};
    component.formularioResiduo.getRawValue = jest.fn();
    const claveResiduoValue = component.claveResiduoValue;
    expect(component.formularioResiduo.getRawValue).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #nombreValue', async () => {
    component.formularioResiduo = component.formularioResiduo || {};
    component.formularioResiduo.getRawValue = jest.fn();
    const nombreValue = component.nombreValue;
    expect(component.formularioResiduo.getRawValue).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #descripcionValue', async () => {
    component.formularioResiduo = component.formularioResiduo || {};
    component.formularioResiduo.getRawValue = jest.fn();
    const descripcionValue = component.descripcionValue;
    expect(component.formularioResiduo.getRawValue).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarFormulario = jest.fn();
    component.crearFormularioResiduo = jest.fn();
    component.recuperarValoresDesdeStore = jest.fn();
    component.etiquetasForm = component.etiquetasForm || {};
    component.etiquetasForm.nombre = 'nombre';
    component.etiquetasForm.nico = 'nico';
    component.formularioResiduo = component.formularioResiduo || {};
    component.formularioResiduo.get = jest.fn().mockReturnValue({
      disable: function() {}
    });
    component.verificarEstadoDropdowns = jest.fn();
    component.ngOnInit();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.crearFormularioResiduo).toHaveBeenCalled();
    expect(component.recuperarValoresDesdeStore).toHaveBeenCalled();
    expect(component.formularioResiduo.get).toHaveBeenCalled();

  });

  it('should run #inicializarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.inicializarFormulario();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #crearFormularioResiduo()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.crearFormularioResiduo();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #recuperarValoresDesdeStore()', async () => {
    component.formularioQuery = component.formularioQuery || {};
    component.formularioQuery.getValue = jest.fn().mockReturnValue({
      formularioResiduo: {},
      formularioDatos: {}
    });
    component.formularioResiduo = component.formularioResiduo || {};
    component.formularioResiduo.get = jest.fn().mockReturnValue({
      disable: function() {},
      disabled: {}
    });
    component.formularioResiduo.patchValue = jest.fn();
    component.formularioDatos = component.formularioDatos || {};
    component.formularioDatos.patchValue = jest.fn();
    component.recuperarValoresDesdeStore();
    expect(component.formularioQuery.getValue).toHaveBeenCalled();
    expect(component.formularioResiduo.get).toHaveBeenCalled();
    expect(component.formularioResiduo.patchValue).toHaveBeenCalled();
    expect(component.formularioDatos.patchValue).toHaveBeenCalled();
  });



  it('should run #actualizarCampoFormularioDatos()', async () => {
    component.formularioDatos = component.formularioDatos || {};
    component.formularioDatos.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.formularioDatos.getRawValue = jest.fn();
    component.formularioStore = component.formularioStore || {};
    component.formularioStore.actualizarFormularioDatos = jest.fn();
    component.actualizarCampoFormularioDatos({});
    expect(component.formularioDatos.get).toHaveBeenCalled();
    expect(component.formularioDatos.getRawValue).toHaveBeenCalled();
    expect(component.formularioStore.actualizarFormularioDatos).toHaveBeenCalled();
  });

  it('should run #actualizarCampoFormularioResiduo()', async () => {
    component.formularioResiduo = component.formularioResiduo || {};
    component.formularioResiduo.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.formularioResiduo.getRawValue = jest.fn();
    component.formularioStore = component.formularioStore || {};
    component.formularioStore.actualizarFormularioResiduo = jest.fn();
    component.actualizarCampoFormularioResiduo({});
    expect(component.formularioResiduo.get).toHaveBeenCalled();
    expect(component.formularioResiduo.getRawValue).toHaveBeenCalled();
    expect(component.formularioStore.actualizarFormularioResiduo).toHaveBeenCalled();
  });


  it('should run #onNombreMateriaPrimaChange()', async () => {
    component.formularioDatos = component.formularioDatos || {};
    component.formularioDatos.get = jest.fn().mockReturnValue({
      setValue: function() {},
      value: {}
    });
    component.formularioDatos.getRawValue = jest.fn();
    component.materiasDisponibles = component.materiasDisponibles || {};
    component.materiasDisponibles.find = jest.fn().mockReturnValue([
      {
        "id": {}
      }
    ]);
    component.formularioStore = component.formularioStore || {};
    component.formularioStore.actualizarFormularioDatos = jest.fn();
    component.onNombreMateriaPrimaChange();
    expect(component.formularioDatos.get).toHaveBeenCalled();
    expect(component.formularioDatos.getRawValue).toHaveBeenCalled();
    expect(component.materiasDisponibles.find).toHaveBeenCalled();
    expect(component.formularioStore.actualizarFormularioDatos).toHaveBeenCalled();
  });





  it('should run #onCantidadChange()', async () => {
    component.formularioResiduo = component.formularioResiduo || {};
    component.formularioResiduo.get = jest.fn().mockReturnValue({
      setValue: function() {},
      value: {}
    });
    component.onCantidadChange();
    expect(component.formularioResiduo.get).toHaveBeenCalled();
  });

  it('should run #onClasificacionChange()', async () => {
    component.formularioResiduo = component.formularioResiduo || {};
    component.formularioResiduo.get = jest.fn().mockReturnValue({
      disable: function() {},
      value: {}
    });
    component.manejarCambioClasificacion = jest.fn();
    component.onClasificacionChange();
    expect(component.formularioResiduo.get).toHaveBeenCalled();
    expect(component.manejarCambioClasificacion).toHaveBeenCalled();
  });

  it('should run #verificarEstadoDropdowns()', async () => {
    component.formularioResiduo = component.formularioResiduo || {};
    component.formularioResiduo.get = jest.fn().mockReturnValue({
      disable: function() {},
      value: {}
    });
    component.verificarEstadoDropdowns();
    expect(component.formularioResiduo.get).toHaveBeenCalled();
  });

  it('should run #manejarCambioClasificacion()', async () => {
    component.formularioResiduo = component.formularioResiduo || {};
    component.formularioResiduo.get = jest.fn().mockReturnValue({
      enable: function() {},
      setValue: function() {},
      disable: function() {},
      value: {}
    });
    component.formularioResiduo.getRawValue = jest.fn();
    component.cdr = component.cdr || {};
    component.cdr.detectChanges = jest.fn();
    component.formularioStore = component.formularioStore || {};
    component.formularioStore.actualizarFormularioResiduo = jest.fn();
    component.manejarCambioClasificacion({});
    expect(component.formularioResiduo.get).toHaveBeenCalled();
    expect(component.formularioResiduo.getRawValue).toHaveBeenCalled();
    expect(component.cdr.detectChanges).toHaveBeenCalled();
    expect(component.formularioStore.actualizarFormularioResiduo).toHaveBeenCalled();
  });

  it('should run #mostrarNotificacionDuplicado()', async () => {

    component.mostrarNotificacionDuplicado();

  });

  it('should run #agregarMateriaPrima()', async () => {
    component.formularioDatos = component.formularioDatos || {};
    component.formularioDatos.valid = 'valid';
    component.formularioDatos.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.formularioDatos.reset = jest.fn();
    component.materiasPrimas = component.materiasPrimas || {};
    component.materiasPrimas.push = jest.fn();
    component.agregarMateriaPrima();
    expect(component.formularioDatos.get).toHaveBeenCalled();
    expect(component.formularioDatos.reset).toHaveBeenCalled();
    expect(component.materiasPrimas.push).toHaveBeenCalled();
  });


});