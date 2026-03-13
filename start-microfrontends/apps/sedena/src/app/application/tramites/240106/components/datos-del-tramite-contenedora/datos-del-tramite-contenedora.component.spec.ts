// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosDelTramiteContenedoraComponent } from './datos-del-tramite-contenedora.component';
import { Tramite240106Query } from '../../estados/tramite240106Query.query';
import { Tramite240106Store } from '../../estados/tramite240106Store.store';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { ActivatedRoute } from '@angular/router';

@Injectable()
class MockTramite240106Query {}

@Injectable()
class MockTramite240106Store {}

@Injectable()
class MockDatosSolicitudService {}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

describe('DatosDelTramiteContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ DatosDelTramiteContenedoraComponent, FormsModule, ReactiveFormsModule ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240106Query, useClass: MockTramite240106Query },
        { provide: Tramite240106Store, useClass: MockTramite240106Store },
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
    }).overrideComponent(DatosDelTramiteContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosDelTramiteContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.getMercanciaTablaDatos$ = observableOf({});
    component.tramiteQuery.getDatosDelTramite$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #ngOnDestroy()', async () => {
    component.unsubscribe$ = component.unsubscribe$ || {};
    component.unsubscribe$.next = jest.fn();
    component.unsubscribe$.complete = jest.fn();
    component.ngOnDestroy();
    // expect(component.unsubscribe$.next).toHaveBeenCalled();
    // expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('should run #updateDatosDelTramiteFormulario()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateDatosDelTramiteFormState = jest.fn();
    component.updateDatosDelTramiteFormulario({});
    // expect(component.tramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalled();
  });

});