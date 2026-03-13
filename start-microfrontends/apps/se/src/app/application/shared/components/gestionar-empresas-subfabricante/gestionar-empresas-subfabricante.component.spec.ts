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
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GestionarEmpresasSubfabricantesComponent } from './gestionar-empresas-subfabricante.component';

@Injectable()
class MockRouter {
  navigate() {}
}

describe('GestionarEmpresasSubfabricantesComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [FormBuilder, { provide: Router, useClass: MockRouter }],
    })
      .overrideComponent(GestionarEmpresasSubfabricantesComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(GestionarEmpresasSubfabricantesComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run SetterDeclaration #estadoCatalogo', async () => {
    component.estadoCatalogo = {};
  });

  it('should run SetterDeclaration #datosTablaSubfabricantesDisponibles', async () => {
    component.datosTablaSubfabricantesDisponibles = {};
  });

  it('should run SetterDeclaration #configuracionTablaDisponibles', async () => {
    component.configuracionTablaDisponibles = {};
  });

  it('should run SetterDeclaration #configuracionTablaSeleccionadas', async () => {
    component.configuracionTablaSeleccionadas = {};
  });

  it('should run SetterDeclaration #datosTablaSubfabricantesSeleccionadas', async () => {
    component.datosTablaSubfabricantesSeleccionadas = {};
  });

  it('should run SetterDeclaration #formularioDatosSubcontratista', async () => {
    component._formularioDatosSubcontratista =
      component._formularioDatosSubcontratista || {};
    component._formularioDatosSubcontratista.setValue = jest.fn();
    component.formularioDatosSubcontratista = {
      value: {},
    };
    expect(
      component._formularioDatosSubcontratista.setValue
    ).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #estadoCatalogo', async () => {
    const estadoCatalogo = component.estadoCatalogo;
  });

  it('should run GetterDeclaration #datosTablaSubfabricantesDisponibles', async () => {
    const datosTablaSubfabricantesDisponibles =
      component.datosTablaSubfabricantesDisponibles;
  });

  it('should run GetterDeclaration #configuracionTablaDisponibles', async () => {
    const configuracionTablaDisponibles =
      component.configuracionTablaDisponibles;
  });

  it('should run GetterDeclaration #configuracionTablaSeleccionadas', async () => {
    const configuracionTablaSeleccionadas =
      component.configuracionTablaSeleccionadas;
  });

  it('should run GetterDeclaration #datosTablaSubfabricantesSeleccionadas', async () => {
    const datosTablaSubfabricantesSeleccionadas =
      component.datosTablaSubfabricantesSeleccionadas;
  });

  it('should run #inicializarFormularioDatosSubcontratista()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.inicializarFormularioDatosSubcontratista();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #cambiarRFC()', async () => {
    component.alCambiarRFC = component.alCambiarRFC || {};
    component.alCambiarRFC.emit = jest.fn();
    component.formularioDatosSubcontratista =
      component.formularioDatosSubcontratista || {};
    component.formularioDatosSubcontratista.get = jest.fn().mockReturnValue({
      value: {},
    });
    component.cambiarRFC();
    expect(component.alCambiarRFC.emit).toHaveBeenCalled();
    // expect(component.formularioDatosSubcontratista.get).toHaveBeenCalled();
  });

  it('should run #cambiarEstado()', async () => {
    component.formularioDatosSubcontratista =
      component.formularioDatosSubcontratista || {};
    component.formularioDatosSubcontratista.get = jest.fn().mockReturnValue({
      value: {},
    });
    component.alCambiarEstado = component.alCambiarEstado || {};
    component.alCambiarEstado.emit = jest.fn();
    component.cambiarEstado({});
    expect(component.formularioDatosSubcontratista.get).toHaveBeenCalled();
    // expect(component.alCambiarEstado.emit).toHaveBeenCalled();
  });

  it('should run #onBuscar()', async () => {
    component.buscar = component.buscar || {};
    component.buscar.emit = jest.fn();
    component.onBuscar();
    expect(component.buscar.emit).toHaveBeenCalled();
  });

  it('should run #onPlantasDisponiblesSeleccionadas()', async () => {
    component.onPlantasDisponiblesSeleccionadas({
      length: {},
    });
  });

  it('should run #agregarPlantas()', async () => {
    component.plantasPorAgrupar = component.plantasPorAgrupar || {};
    component.plantasPorAgrupar.emit = jest.fn();
    component.agregarPlantas();
    expect(component.plantasPorAgrupar.emit).toHaveBeenCalled();
  });

  it('should run #onPlantasSeleccionadas()', async () => {
    component.onPlantasSeleccionadas({
      length: {},
    });
  });

  it('should run #eliminarPlantas()', async () => {
    component.plantasSeleccionadas = [0];
    component.plantasPorEliminar = component.plantasPorEliminar || {};
    component.plantasPorEliminar.emit = jest.fn();
    component.eliminarPlantas();
    expect(component.plantasPorEliminar.emit).toHaveBeenCalled();
  });

  it('should run #complementarPlantas()', async () => {
    component.plantasSeleccionadas = [0];
    component.plantasPorComplementar = component.plantasPorComplementar || {};
    component.plantasPorComplementar.emit = jest.fn();
    component.complementarPlantas();
    expect(component.plantasPorComplementar.emit).toHaveBeenCalled();
  });
});
