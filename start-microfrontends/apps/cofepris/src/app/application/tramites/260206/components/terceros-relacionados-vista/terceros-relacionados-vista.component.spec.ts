// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TercerosRelacionadosVistaComponent } from './terceros-relacionados-vista.component';
import { Tramite260206Store } from '../../estados/stores/tramite260206Store.store';
import { Tramite260206Query } from '../../estados/queries/tramite260206Query.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

@Injectable()
class MockTramite260206Store {}

@Injectable()
class MockTramite260206Query {}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('TercerosRelacionadosVistaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, TercerosRelacionadosVistaComponent, HttpClientTestingModule],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite260206Store, useClass: MockTramite260206Store },
        { provide: Tramite260206Query, useClass: MockTramite260206Query },
        ConsultaioQuery,
        { 
          provide: ActivatedRoute, 
          useValue: {
            params: observableOf({}),
            queryParams: observableOf({}),
            snapshot: { params: {}, queryParams: {} }
          }
        }
      ]
    }).overrideComponent(TercerosRelacionadosVistaComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TercerosRelacionadosVistaComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.getFabricanteTablaDatos$ = observableOf({});
    component.tramiteQuery.getDestinatarioFinalTablaDatos$ = observableOf({});
    component.tramiteQuery.getProveedorTablaDatos$ = observableOf({});
    component.tramiteQuery.getFacturadorTablaDatos$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #addFabricantes()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateFabricanteTablaDatos = jest.fn();
    component.addFabricantes({});
    expect(component.tramiteStore.updateFabricanteTablaDatos).toHaveBeenCalled();
  });

  it('should run #addDestinatarios()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateDestinatarioFinalTablaDatos = jest.fn();
    component.addDestinatarios({});
    expect(component.tramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalled();
  });

  it('should run #addProveedores()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateProveedorTablaDatos = jest.fn();
    component.addProveedores({});
    expect(component.tramiteStore.updateProveedorTablaDatos).toHaveBeenCalled();
  });

  it('should run #addFacturadores()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateFacturadorTablaDatos = jest.fn();
    component.addFacturadores({});
    expect(component.tramiteStore.updateFacturadorTablaDatos).toHaveBeenCalled();
  });

  it('should run #fabricanteEventoModificar()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateSeleccionadoTablaFabricanteDatos = jest.fn();
    component.fabricanteEventoModificar({});
    expect(component.tramiteStore.updateSeleccionadoTablaFabricanteDatos).toHaveBeenCalled();
  });

  it('should run #destinatarioEventoModificar()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateSeleccionadoTablaDestinatarioDatos = jest.fn();
    component.destinatarioEventoModificar({});
    expect(component.tramiteStore.updateSeleccionadoTablaDestinatarioDatos).toHaveBeenCalled();
  });

  it('should run #proveedorEventoModificar()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateSeleccionadoTablaProveedorDatos = jest.fn();
    component.proveedorEventoModificar({});
    expect(component.tramiteStore.updateSeleccionadoTablaProveedorDatos).toHaveBeenCalled();
  });

  it('should run #facturadorEventoModificar()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateSeleccionadoTablaFacturadorDatos = jest.fn();
    component.facturadorEventoModificar({});
    expect(component.tramiteStore.updateSeleccionadoTablaFacturadorDatos).toHaveBeenCalled();
  });

  it('should run #eliminarFabricante()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateFabricanteTablaDatos = jest.fn();
    component.eliminarFabricante({});
    expect(component.tramiteStore.updateFabricanteTablaDatos).toHaveBeenCalled();
  });

  it('should run #eliminarDestinatario()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateDestinatarioFinalTablaDatos = jest.fn();
    component.eliminarDestinatario({});
    expect(component.tramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalled();
  });

  it('should run #eliminarProveedor()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateProveedorTablaDatos = jest.fn();
    component.eliminarProveedor({});
    expect(component.tramiteStore.updateProveedorTablaDatos).toHaveBeenCalled();
  });

  it('should run #eliminarFacturador()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateFacturadorTablaDatos = jest.fn();
    component.eliminarFacturador({});
    expect(component.tramiteStore.updateFacturadorTablaDatos).toHaveBeenCalled();
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