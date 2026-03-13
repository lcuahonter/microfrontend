// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AgregarProveedorContenedoraComponent } from './agregar-proveedor-contenedora.component';
import { Tramite240106Store } from '../../estados/tramite240106Store.store';
import { Tramite240106Query } from '../../estados/tramite240106Query.query';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

@Injectable()
class MockTramite240106Store {}

@Injectable()
class MockTramite240106Query {}

@Injectable()
class MockDatosSolicitudService {}

describe('AgregarProveedorContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ AgregarProveedorContenedoraComponent, FormsModule, ReactiveFormsModule ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240106Store, useClass: MockTramite240106Store },
        { provide: Tramite240106Query, useClass: MockTramite240106Query },
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
    component.tramite240106Store = component.tramite240106Store || {};
    component.tramite240106Store.updateProveedorTablaDatos = jest.fn();
    component.updateProveedorTablaDatos({});
    // expect(component.tramite240106Store.updateProveedorTablaDatos).toHaveBeenCalled();
  });

});