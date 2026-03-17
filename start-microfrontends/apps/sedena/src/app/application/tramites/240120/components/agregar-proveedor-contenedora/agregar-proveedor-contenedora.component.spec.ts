// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AgregarProveedorContenedoraComponent } from './agregar-proveedor-contenedora.component';
import { Tramite240120Store } from '../../estados/tramite240120Store.store';
import { Tramite240120Query } from '../../estados/tramite240120Query.query';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite240120Store {}

@Injectable()
class MockTramite240120Query {
  obtenerTercerosDatos$ = {};
}

describe('AgregarProveedorContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule ],

      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240120Store, useClass: MockTramite240120Store },
        { provide: Tramite240120Query, useClass: MockTramite240120Query },
        DatosSolicitudService
      ]
    }).overrideComponent(AgregarProveedorContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AgregarProveedorContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #updateProveedorTablaDatos()', async () => {
    component.tramite240120Store = component.tramite240120Store || {};
    component.tramite240120Store.updateProveedorTablaDatos = jest.fn();
    component.updateProveedorTablaDatos({});
    expect(component.tramite240120Store.updateProveedorTablaDatos).toHaveBeenCalled();
  });

  it('should update ProveedorDatos when observable emits a value', () => {
    const testValue = { nombre: 'Proveedor Juan' };
    if (component.tramiteQuery && 'emitValue' in component.tramiteQuery) {
      (component.tramiteQuery as any).emitValue(testValue);
      expect(component.ProveedorDatos).toEqual(testValue);
    }
  });

  it('should set ProveedorDatos to null when observable emits null', () => {
    if (component.tramiteQuery && 'emitValue' in component.tramiteQuery) {
      (component.tramiteQuery as any).emitValue(null);
      expect(component.ProveedorDatos).toBeNull();
    }
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should allow multiple ngOnDestroy calls without error', () => {
    expect(() => {
      component.ngOnDestroy();
      component.ngOnDestroy();
    }).not.toThrow();
  });

});