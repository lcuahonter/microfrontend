// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TercerosRelacionadosContenedoraComponent } from './terceros-relacionados-contenedora.component';
import { Tramite240120Store } from '../../estados/tramite240120Store.store';
import { Tramite240120Query } from '../../estados/tramite240120Query.query';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

@Injectable()
class MockTramite240120Store {}

@Injectable()
class MockTramite240120Query {}

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
        { provide: Tramite240120Store, useClass: MockTramite240120Store },
        { provide: Tramite240120Query, useClass: MockTramite240120Query },
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
        },
        ConsultaioQuery
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
    component.tramiteQuery.getDestinatarioFinalTablaDatos$ = observableOf([[{tableIndex: 2}]]);
    component.tramiteQuery.getProveedorTablaDatos$ = observableOf([{tableIndex: 2}]);
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #modificarDestinarioDatos()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.actualizarDatosDestinatario = jest.fn();
    component.irAAcciones = jest.fn();
    component.modificarDestinarioDatos({test: 1});
    expect(component.tramiteStore.actualizarDatosDestinatario).toHaveBeenCalled();
  });

  it('should run #modificarProveedorDatos()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.actualizarDatosProveedor = jest.fn();
    component.irAAcciones = jest.fn();
    component.modificarProveedorDatos({test: 1});
    expect(component.tramiteStore.actualizarDatosProveedor).toHaveBeenCalled();
  });


  it('should run #eliminarDestinatarioFinal()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.eliminarDestinatarioFinal = jest.fn();
    component.eliminarDestinatarioFinal({test: 1});
  });

  it('should run #eliminarProveedor()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.eliminarProveedorFinal = jest.fn();
    component.eliminarProveedor({test: 1});
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });

  
  it('should run #openModal()', async () => {
    component.modalComponent = component.modalComponent || {};
    component.modalComponent.abrir = jest.fn();
    component.cerrarModal = component.cerrarModal || {};
    component.cerrarModal.bind = jest.fn();
    component.openModal('agregar-destino-final');
    expect(component.modalComponent.abrir).toHaveBeenCalled();
    component.openModal('agregar-proveedor');
    expect(component.modalComponent.abrir).toHaveBeenCalled();
  });

  it('should run #cerrarModal()', async () => {
    component.modalComponent = component.modalComponent || {};
    component.modalComponent.cerrar = jest.fn();
    component.cerrarModal();
    expect(component.modalComponent.cerrar).toHaveBeenCalled();
  });


});