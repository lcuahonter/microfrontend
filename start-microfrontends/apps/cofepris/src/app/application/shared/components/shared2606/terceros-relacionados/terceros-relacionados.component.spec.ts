// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TercerosRelacionadosFebService } from '../../../services/shared2606/tereceros-relacionados-feb.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';

@Injectable()
class MockRouter {
  navigate() { };
}

@Injectable()
class MockTercerosRelacionadosFebService { }

describe('TercerosRelacionadosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        TercerosRelacionadosComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { url: 'url', params: {}, queryParams: {}, data: {} },
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        },
        { provide: TercerosRelacionadosFebService, useClass: MockTercerosRelacionadosFebService },
        ConsultaioQuery
      ]
    }).overrideComponent(TercerosRelacionadosComponent, {

      set: {
        providers: [{ provide: TercerosRelacionadosFebService, useClass: MockTercerosRelacionadosFebService },
        { provide: ToastrService, useClass: MockToastrService }]
      }
    }).compileComponents();
    fixture = TestBed.createComponent(TercerosRelacionadosComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #tramiteIDNumber', async () => {

    const tramiteIDNumber = component.tramiteIDNumber;

  });

  it('should run #irAAcciones()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {

    component.ngOnInit();

  });

  it('should run #onAgregarFabricante()', async () => {
    component.abrirFabricanteModal = jest.fn();
    component.onAgregarFabricante();
    expect(component.abrirFabricanteModal).toHaveBeenCalled();
  });

  it('should run #onAgregarProveedorFinal()', async () => {
    component.abrirProveedorModal = jest.fn();
    component.onAgregarProveedorFinal();
    expect(component.abrirProveedorModal).toHaveBeenCalled();
  });

  it('should run #abrirProveedorModal()', async () => {

    component.abrirProveedorModal();

  });

  it('should run #onFacturadorAgregar()', async () => {
    component.abrirFacturadorModal = jest.fn();
    component.onFacturadorAgregar();
    expect(component.abrirFacturadorModal).toHaveBeenCalled();
  });

  it('should run #abrirFabricanteModal()', async () => {

    component.abrirFabricanteModal();

  });

  it('should run #abrirFacturadorModal()', async () => {

    component.abrirFacturadorModal();

  });

  it('should run #cerrarFabricanteModal()', async () => {
    window.bootstrap.Modal = {
      getInstance: function () {
        return {
          hide: function () { }
        };
      }
    };
    component.cerrarFabricanteModal();

  });

  it('should run #cerrarProveedorModal()', async () => {
    window.bootstrap.Modal = {
      getInstance: function () {
        return {
          hide: function () { }
        };
      }
    };
    component.cerrarProveedorModal();

  });

  it('should run #onFabricanteUpdated()', async () => {
    component.updateFabricanteTablaDatos = component.updateFabricanteTablaDatos || {};
    component.updateFabricanteTablaDatos.emit = jest.fn();
    component.onFabricanteUpdated({});
    expect(component.updateFabricanteTablaDatos.emit).toHaveBeenCalled();
  });

  it('should run #onProveedorUpdated()', async () => {
    component.updateProveedorTablaDatos = component.updateProveedorTablaDatos || {};
    component.updateProveedorTablaDatos.emit = jest.fn();
    component.onProveedorUpdated({});
    expect(component.updateProveedorTablaDatos.emit).toHaveBeenCalled();
  });

  it('should run #onFacturadorUpdated()', async () => {
    component.updateFacturadorTablaDatos = component.updateFacturadorTablaDatos || {};
    component.updateFacturadorTablaDatos.emit = jest.fn();
    component.onFacturadorUpdated({});
    expect(component.updateFacturadorTablaDatos.emit).toHaveBeenCalled();
  });

  it('should run #cerrarFacturadorModal()', async () => {
    window.bootstrap.Modal = {
      getInstance: function () {
        return {
          hide: function () { }
        };
      }
    };
    component.cerrarFacturadorModal();

  });

  it('should run #esCampoRequerido()', async () => {
    component.elementosRequeridos = component.elementosRequeridos || {};
    component.elementosRequeridos.includes = jest.fn();
    component.esCampoRequerido({});
    expect(component.elementosRequeridos.includes).toHaveBeenCalled();
  });

  it('should run #modificarFabricante()', async () => {
    component.fabricanteSeleccionadoDatos = component.fabricanteSeleccionadoDatos || {};
    component.fabricanteSeleccionadoDatos = ['fabricanteSeleccionadoDatos'];
    component.modificarFabricante();

  });

  it('should run #modificarProveedor()', async () => {
    component.proveedorSeleccionadoDatos = component.proveedorSeleccionadoDatos || {};
    component.proveedorSeleccionadoDatos = ['proveedorSeleccionadoDatos'];
    component.modificarProveedor();

  });

  it('should run #modificarFacturador()', async () => {
    component.facturadorSeleccionadoDatos = component.facturadorSeleccionadoDatos || {};
    component.facturadorSeleccionadoDatos = ['facturadorSeleccionadoDatos'];
    component.modificarFacturador();

  });

  it('should run #eliminarFabricante()', async () => {
    component.fabricanteSeleccionadoDatos = component.fabricanteSeleccionadoDatos || {};
    component.seleccionarFilaNotificacion = component.seleccionarFilaNotificacion || {};
    component.seleccionarFilaNotificacion.mensaje = 'mensaje';
    component.seleccionarFilaNotificacion.txtBtnCancelar = 'txtBtnCancelar';
    component.eliminarFabricante();

  });

  it('should run #eliminarAlertaConfirmation()', async () => {
    component.seleccionarFilaNotificacion = component.seleccionarFilaNotificacion || {};
    component.seleccionarFilaNotificacion.mensaje = 'mensaje';
    component.seleccionarFilaNotificacion.txtBtnCancelar = 'txtBtnCancelar';
    component.eliminarAlertaConfirmation({});

  });

  it('should run #eliminarDotosAlerta()', async () => {
    component.fabricanteTablaDatos = component.fabricanteTablaDatos || {};
    component.fabricanteTablaDatos = ['fabricanteTablaDatos'];
    component.fabricanteSeleccionadoDatos = component.fabricanteSeleccionadoDatos || {};
    component.fabricanteSeleccionadoDatos.some = jest.fn().mockReturnValue([
      {
        "rfc": {}
      }
    ]);
    component.fabricanteEliminar = component.fabricanteEliminar || {};
    component.fabricanteEliminar.emit = jest.fn();
    component.proveedorTablaDatos = component.proveedorTablaDatos || {};
    component.proveedorTablaDatos = ['proveedorTablaDatos'];
    component.proveedorSeleccionadoDatos = component.proveedorSeleccionadoDatos || {};
    component.proveedorSeleccionadoDatos.some = jest.fn().mockReturnValue([
      {
        "nombreRazonSocial": {},
        "razonSocial": {}
      }
    ]);
    component.proveedorEliminar = component.proveedorEliminar || {};
    component.proveedorEliminar.emit = jest.fn();
    component.facturadorTablaDatos = component.facturadorTablaDatos || {};
    component.facturadorTablaDatos = ['facturadorTablaDatos'];
    component.facturadorSeleccionadoDatos = component.facturadorSeleccionadoDatos || {};
    component.facturadorSeleccionadoDatos.some = jest.fn().mockReturnValue([
      {
        "nombreRazonSocial": {},
        "razonSocial": {}
      }
    ]);
    component.facturadorEliminar = component.facturadorEliminar || {};
    component.facturadorEliminar.emit = jest.fn();
    component.eliminarDotosAlerta({});
    expect(component.fabricanteSeleccionadoDatos.some).toHaveBeenCalled();
    expect(component.fabricanteEliminar.emit).toHaveBeenCalled();
    expect(component.proveedorSeleccionadoDatos.some).toHaveBeenCalled();
    expect(component.proveedorEliminar.emit).toHaveBeenCalled();
    expect(component.facturadorSeleccionadoDatos.some).toHaveBeenCalled();
    expect(component.facturadorEliminar.emit).toHaveBeenCalled();
  });

  it('should run #eliminarProveedor()', async () => {
    component.proveedorSeleccionadoDatos = component.proveedorSeleccionadoDatos || {};
    component.seleccionarFilaNotificacion = component.seleccionarFilaNotificacion || {};
    component.seleccionarFilaNotificacion.mensaje = 'mensaje';
    component.seleccionarFilaNotificacion.txtBtnCancelar = 'txtBtnCancelar';
    component.eliminarProveedor();
    expect(component.eliminarProveedorAlerta).toBe(true);
    expect(component.eliminarAlerta).toBe(true);
  });

  it('should run #eliminarFacturador()', async () => {
    component.facturadorSeleccionadoDatos = component.facturadorSeleccionadoDatos || {};
    component.seleccionarFilaNotificacion = component.seleccionarFilaNotificacion || {};
    component.seleccionarFilaNotificacion.mensaje = 'mensaje';
    component.seleccionarFilaNotificacion.txtBtnCancelar = 'txtBtnCancelar';
    component.eliminarFacturador();

  });

  it('should run #formularioSolicitudValidacion()', async () => {
    component.esCampoRequerido = jest.fn();
    component.proveedorTablaDatos = component.proveedorTablaDatos || {};
    component.formularioSolicitudValidacion();
    expect(component.esCampoRequerido).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });

});