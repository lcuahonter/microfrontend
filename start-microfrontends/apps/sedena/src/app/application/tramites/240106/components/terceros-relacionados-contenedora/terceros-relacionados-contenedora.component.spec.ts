// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TercerosRelacionadosContenedoraComponent } from './terceros-relacionados-contenedora.component';
import { Tramite240106Store } from '../../estados/tramite240106Store.store';
import { Tramite240106Query } from '../../estados/tramite240106Query.query';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
class MockTramite240106Store {}

@Injectable()
class MockTramite240106Query {}

@Injectable()
class MockRouter {
  navigate() {};
}


@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('TercerosRelacionadosContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ TercerosRelacionadosContenedoraComponent, FormsModule, ReactiveFormsModule ],
      declarations: [],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240106Store, useClass: MockTramite240106Store },
        { provide: Tramite240106Query, useClass: MockTramite240106Query },
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
    // expect(component.irAAcciones).toHaveBeenCalled();
  });

  it('should run #modificarProveedorDatos()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.actualizarDatosProveedor = jest.fn();
    component.irAAcciones = jest.fn();
    component.modificarProveedorDatos({});
    // expect(component.tramiteStore.actualizarDatosProveedor).toHaveBeenCalled();
    // expect(component.irAAcciones).toHaveBeenCalled();
  });

  it('should run #eliminarDestinatarioFinal()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.eliminarDestinatarioFinal = jest.fn();
    component.eliminarDestinatarioFinal({});
    // expect(component.tramiteStore.eliminarDestinatarioFinal).toHaveBeenCalled();
  });

  it('should run #eliminarProveedor()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.eliminareliminarProveedorFinal = jest.fn();
    component.eliminarProveedor({});
    // expect(component.tramiteStore.eliminareliminarProveedorFinal).toHaveBeenCalled();
  });

  it('should run #irAAcciones()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.irAAcciones({});
    // expect(component.router.navigate).toHaveBeenCalled();
  });

});