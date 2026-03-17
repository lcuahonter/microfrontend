// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TercerosRelacionadosContenedoraComponent } from './terceros-relacionados-contenedora.component';
import { Tramite240118Query } from '../../estados/tramite240118Query.query';
import { Tramite240118Store } from '../../estados/tramite240118Store.store';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
class MockTramite240118Query {}

@Injectable()
class MockTramite240118Store {}

@Injectable()
class MockRouter {
  navigate() {};
}


describe('TercerosRelacionadosContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240118Query, useClass: MockTramite240118Query },
        { provide: Tramite240118Store, useClass: MockTramite240118Store },
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {url: 'url', params: {}, queryParams: {}, data: {}},
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        }
      ]
    }).overrideComponent(TercerosRelacionadosContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TercerosRelacionadosContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.getDestinatarioFinalTablaDatos$ = observableOf({});
    component.tramiteQuery.getProveedorTablaDatos$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #modificarDestinarioDatos()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.actualizarDatosDestinatario = jest.fn();
    component.irAAcciones = jest.fn();
    component.modificarDestinarioDatos({});
    expect(component.tramiteStore.actualizarDatosDestinatario).toHaveBeenCalled();
    expect(component.irAAcciones).toHaveBeenCalled();
  });

  it('should run #modificarProveedorDatos()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.actualizarDatosProveedor = jest.fn();
    component.irAAccionesProveedor = jest.fn();
    component.modificarProveedorDatos({});
  });

  it('should run #irAAcciones()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.irAAcciones();
  });

  it('should run #irAAccionesProveedor()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.irAAccionesProveedor();
  });

  it('should run #eliminarDestinatarioFinal()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.eliminarDestinatarioFinal = jest.fn();
    component.eliminarDestinatarioFinal({});
    expect(component.tramiteStore.eliminarDestinatarioFinal).toHaveBeenCalled();
  });

  it('should run #eliminarProveedor()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.eliminareliminarProveedorFinal = jest.fn();
    component.eliminarProveedor({});
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
  });

});