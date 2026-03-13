// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AgregarProveedorContenedoraComponent } from './agregar-proveedor-contenedora.component';
import { Tramite240119Store } from '../../estados/tramite240119Store.store';
import { Tramite240119Query } from '../../estados/tramite240119Query.query';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

@Injectable()
class MockTramite240119Store {}

@Injectable()
class MockTramite240119Query {
  obtenerTercerosDatos$ = {};
}

@Injectable()
class MockDatosSolicitudService {
  obtenerDatosSolicitud() {
    return observableOf({});
  }
}

describe('AgregarProveedorContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ AgregarProveedorContenedoraComponent, FormsModule, ReactiveFormsModule ],
      declarations: [],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240119Store, useClass: MockTramite240119Store },
        { provide: Tramite240119Query, useClass: MockTramite240119Query },
        { provide: DatosSolicitudService, useClass: MockDatosSolicitudService },
        
      ]
    }).overrideComponent(AgregarProveedorContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AgregarProveedorContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #updateProveedorTablaDatos()', async () => {
    component.tramite240119Store = component.tramite240119Store || {};
    component.tramite240119Store.updateProveedorTablaDatos = jest.fn();
    component.updateProveedorTablaDatos({});
    expect(component.tramite240119Store.updateProveedorTablaDatos).toHaveBeenCalled();
  });

});