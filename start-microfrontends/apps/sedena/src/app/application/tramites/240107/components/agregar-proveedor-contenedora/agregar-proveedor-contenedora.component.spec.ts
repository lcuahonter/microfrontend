// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AgregarProveedorContenedoraComponent } from './agregar-proveedor-contenedora.component';
import { Tramite240107Store } from '../../estados/tramite240107Store.store';
import { Tramite240107Query } from '../../estados/tramite240107Query.query';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

@Injectable()
class MockTramite240107Query {}

@Injectable()
class MockDatosSolicitudService {}

@Injectable()
class MockTramite240107Store {}

describe('AgregarProveedorContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, AgregarProveedorContenedoraComponent ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
      { provide: Tramite240107Store, useClass: MockTramite240107Store },
      { provide: Tramite240107Query, useClass: MockTramite240107Query },
      { provide: DatosSolicitudService, useClass: MockDatosSolicitudService }
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
    component.tramite240107Store = component.tramite240107Store || {};
    component.tramite240107Store.updateProveedorTablaDatos = jest.fn();
    component.updateProveedorTablaDatos({});
    // expect(component.tramite240107Store.updateProveedorTablaDatos).toHaveBeenCalled();
  });

});