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
import { EmpresasSubfabricantesComponent } from './empresas-subfabricante.component';
import { ElementRef } from '@angular/core';
import { Modal } from 'bootstrap';

@Injectable()
class MockRouter {
  navigate() {}
}

describe('EmpresasSubfabricantesComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [FormBuilder, { provide: Router, useClass: MockRouter }],
    })
    .overrideComponent(EmpresasSubfabricantesComponent, {})
    .compileComponents();
    fixture = TestBed.createComponent(EmpresasSubfabricantesComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('debe ejecutar #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('debe ejecutar SetterDeclaration #estadoCatalogo', async () => {
    component.estadoCatalogo = {};
  });

  it('debe ejecutar SetterDeclaration #datosTablaSubfabricantesDisponibles', async () => {
    component.datosTablaSubfabricantesDisponibles = {};
  });

  it('debe ejecutar SetterDeclaration #configuracionTablaDisponibles', async () => {
    component.configuracionTablaDisponibles = {};
  });

  it('debe ejecutar SetterDeclaration #configuracionTablaSeleccionadas', async () => {
    component.configuracionTablaSeleccionadas = {};
  });

  it('debe ejecutar SetterDeclaration #datosTablaSubfabricantesSeleccionadas', async () => {
    component.datosTablaSubfabricantesSeleccionadas = {};
  });

  it('debe ejecutar SetterDeclaration #formularioDatosSubcontratista', async () => {
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

  it('debe ejecutar GetterDeclaration #estadoCatalogo', async () => {
    const estadoCatalogo = component.estadoCatalogo;
  });

  it('debe ejecutar GetterDeclaration #datosTablaSubfabricantesDisponibles', async () => {
    const datosTablaSubfabricantesDisponibles =
      component.datosTablaSubfabricantesDisponibles;
  });

  it('debe ejecutar GetterDeclaration #configuracionTablaDisponibles', async () => {
    const configuracionTablaDisponibles =
      component.configuracionTablaDisponibles;
  });

  it('debe ejecutar GetterDeclaration #configuracionTablaSeleccionadas', async () => {
    const configuracionTablaSeleccionadas =
      component.configuracionTablaSeleccionadas;
  });

  it('debe ejecutar GetterDeclaration #datosTablaSubfabricantesSeleccionadas', async () => {
    const datosTablaSubfabricantesSeleccionadas =
      component.datosTablaSubfabricantesSeleccionadas;
  });

  it('debe ejecutar #inicializarFormularioDatosSubcontratista()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.inicializarFormularioDatosSubcontratista();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('debe ejecutar #cambiarRFC()', async () => {
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

  it('debe ejecutar #cambiarEstado()', async () => {
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

  it('debe ejecutar #onBuscar()', async () => {
    component.buscar = component.buscar || {};
    component.buscar.emit = jest.fn();
    component.onBuscar();
    expect(component.buscar.emit).toHaveBeenCalled();
  });

  it('debe ejecutar #onPlantasDisponiblesSeleccionadas()', async () => {
    component.onPlantasDisponiblesSeleccionadas({
      length: {},
    });
  });

  it('debe ejecutar #agregarPlantas()', async () => {
    component.plantasPorAgrupar = component.plantasPorAgrupar || {};
    component.plantasPorAgrupar.emit = jest.fn();
    component.agregarPlantas();
    expect(component.plantasPorAgrupar.emit).toHaveBeenCalled();
  });

  it('debe ejecutar #onPlantasSeleccionadas()', async () => {
    component.onPlantasSeleccionadas({
      length: {},
    });
  });

  it('debe ejecutar #eliminarPlantas()', async () => {
    component.plantasSeleccionadas = [0];
    component.plantasPorEliminar = component.plantasPorEliminar || {};
    component.plantasPorEliminar.emit = jest.fn();
    component.eliminarPlantas();
    expect(component.plantasPorEliminar.emit).toHaveBeenCalled();
  });

  it('debe ejecutar #complementarPlantas()', async () => {
    component.plantasSeleccionadas = [0];
    component.plantasPorComplementar = component.plantasPorComplementar || {};
    component.plantasPorComplementar.emit = jest.fn();
    component.complementarPlantas();
    expect(component.plantasPorComplementar.emit).toHaveBeenCalled();
  });

  describe('GestionarEmpresasSubfabricantesComponent', () => {
    it('debe ejecutar #abrirDialogoComplementarPlanta() y mostrar modal', () => {
      const modalDiv = document.createElement('div');
      document.body.appendChild(modalDiv);
      component.modalElement = new ElementRef(modalDiv);
      const showSpy = jest.spyOn(Modal.prototype, 'show').mockImplementation(() => {});
      component.abrirDialogoComplementarPlanta();
      expect(showSpy).toHaveBeenCalled();
      showSpy.mockRestore();
    });
});
});
