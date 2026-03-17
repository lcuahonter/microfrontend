// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { ContenedorDeDatosSolicitudComponent } from './contenedor-de-datos-solicitud.component';
import { Tramite260205Query } from '../../estados/queries/tramite260205.query';
import { Tramite260205Store } from '../../estados/stores/tramite260205.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite260205Query {}

@Injectable()
class MockTramite260205Store {}


describe('ContenedorDeDatosSolicitudComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite260205Query, useClass: MockTramite260205Query },
        { provide: Tramite260205Store, useClass: MockTramite260205Store },
         {
                  provide: ActivatedRoute,
                  useValue: {
                    snapshot: {
                      params: {},
                      queryParams: {},
                    },
                  },
                },
      ]
    }).overrideComponent(ContenedorDeDatosSolicitudComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ContenedorDeDatosSolicitudComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.Tramite260205Query = component.Tramite260205Query || {};
    component.Tramite260205Query.selectTramiteState$ = observableOf({});
    component.opcionConfig = component.opcionConfig || {};
    component.opcionConfig.datos = 'datos';
    component.scianConfig = component.scianConfig || {};
    component.scianConfig.datos = 'datos';
    component.tablaMercanciasConfig = component.tablaMercanciasConfig || {};
    component.tablaMercanciasConfig.datos = 'datos';
    component.ngOnInit();

  });

  it('should run #opcionSeleccionado()', async () => {
    component.Tramite260205Store = component.Tramite260205Store || {};
    component.Tramite260205Store.updateOpcionConfigDatos = jest.fn();
    component.opcionSeleccionado({});
    // expect(component.Tramite260205Store.updateOpcionConfigDatos).toHaveBeenCalled();
  });

  it('should run #scianSeleccionado()', async () => {
    component.Tramite260205Store = component.Tramite260205Store || {};
    component.Tramite260205Store.updateScianConfigDatos = jest.fn();
    component.scianSeleccionado({});
  });

  it('should run #mercanciasSeleccionado()', async () => {
    component.Tramite260205Store = component.Tramite260205Store || {};
    component.Tramite260205Store.updateTablaMercanciasConfigDatos = jest.fn();
    component.mercanciasSeleccionado({});
  });

  it('should run #datasolicituActualizar()', async () => {
    component.Tramite260205Store = component.Tramite260205Store || {};
    component.Tramite260205Store.updateDatosSolicitudFormState = jest.fn();
    component.datasolicituActualizar({});
  });

  it('should run #datosDeTablaSeleccionados()', async () => {
    component.Tramite260205Store = component.Tramite260205Store || {};
    component.Tramite260205Store.update = jest.fn().mockReturnValue([
      null
    ]);
    component.datosDeTablaSeleccionados({
      opcionSeleccionados: {},
      scianSeleccionados: {},
      mercanciasSeleccionados: {},
      opcionesColapsableState: {}
    });
    expect(component.Tramite260205Store.update).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
  });

});