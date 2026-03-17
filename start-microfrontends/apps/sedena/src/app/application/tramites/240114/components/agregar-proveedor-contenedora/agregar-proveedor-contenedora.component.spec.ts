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
import { AgregarProveedorContenedoraComponent } from './agregar-proveedor-contenedora.component';
import { Tramite240114Store } from '../../estados/tramite240114Store.store';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { Tramite240114Query } from '../../estados/tramite240114Query.query';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

@Injectable()
class MockTramite240114Store {}

@Injectable()
class MockTramite240114Query {}
@Injectable()
class MockDatosSolicitudService {}

describe('AgregarProveedorContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AgregarProveedorContenedoraComponent,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Tramite240114Store, useClass: MockTramite240114Store },
        { provide: Tramite240114Query, useClass: MockTramite240114Query },
        { provide: DatosSolicitudService, useClass: MockDatosSolicitudService },
        ConsultaioQuery,
      ],
    })
      .overrideComponent(AgregarProveedorContenedoraComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(AgregarProveedorContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #updateProveedorTablaDatos()', async () => {
    component.tramite240114Store = component.tramite240114Store || {};
    component.tramite240114Store.updateProveedorTablaDatos = jest.fn();
    component.updateProveedorTablaDatos({});
    expect(
      component.tramite240114Store.updateProveedorTablaDatos
    ).toHaveBeenCalled();
  });
});
