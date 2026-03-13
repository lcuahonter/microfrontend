// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosMercanciaContenedoraComponent } from './datos-mercancia-contenedora.component';
import { Tramite240119Store } from '../../estados/tramite240119Store.store';
import { ActivatedRoute } from '@angular/router';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

@Injectable()
class MockTramite240119Store {}

@Injectable()
class MockDatosSolicitudService {
  obtenerDatosSolicitud() {
    return observableOf({});
  }
}

describe('DatosMercanciaContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ DatosMercanciaContenedoraComponent, FormsModule, ReactiveFormsModule ],
      declarations: [],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240119Store, useClass: MockTramite240119Store },
        { provide: DatosSolicitudService, useClass: MockDatosSolicitudService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              queryParams: {}
            }
          }
        }
      ]
    }).overrideComponent(DatosMercanciaContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosMercanciaContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #updateMercanciaDetalle()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateMercanciaTablaDatos = jest.fn();
    component.updateMercanciaDetalle({});
    expect(component.tramiteStore.updateMercanciaTablaDatos).toHaveBeenCalled();
  });

});