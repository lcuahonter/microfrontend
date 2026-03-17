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
import { Tramite260203Query } from '../../estados/queries/tramite260203Query.query';
import { tramite260203Store } from '../../estados/stores/tramite260203Store.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';



describe('ContenedorDeDatosSolicitudComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
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
    component.Tramite260203Query = component.Tramite260203Query || {};
    component.Tramite260203Query.selectTramiteState$ = observableOf({});
    component.opcionConfig = component.opcionConfig || {};
    component.opcionConfig.datos = 'datos';
    component.scianConfig = component.scianConfig || {};
    component.scianConfig.datos = 'datos';
    component.tablaMercanciasConfig = component.tablaMercanciasConfig || {};
    component.tablaMercanciasConfig.datos = 'datos';
    component.ngOnInit();

  });

  it('should run #opcionSeleccionado()', async () => {
    component.tramite260203Store = component.tramite260203Store || {};
    component.tramite260203Store.updateOpcionConfigDatos = jest.fn();
    component.opcionSeleccionado({});
    // expect(component.tramite260203Store.updateOpcionConfigDatos).toHaveBeenCalled();
  });

  it('should run #scianSeleccionado()', async () => {
    component.tramite260203Store = component.tramite260203Store || {};
    component.tramite260203Store.updateScianConfigDatos = jest.fn();
    component.scianSeleccionado({});
  });

  it('should run #mercanciasSeleccionado()', async () => {
    component.tramite260203Store = component.tramite260203Store || {};
    component.tramite260203Store.updateTablaMercanciasConfigDatos = jest.fn();
    component.mercanciasSeleccionado({});
  });

  it('should run #datasolicituActualizar()', async () => {
    component.tramite260203Store = component.tramite260203Store || {};
    component.tramite260203Store.updateDatosSolicitudFormState = jest.fn();
    component.datasolicituActualizar({});
  });

  it('should run #datosDeTablaSeleccionados()', async () => {
    component.tramite260203Store = component.tramite260203Store || {};
    component.tramite260203Store.update = jest.fn().mockReturnValue([
      null
    ]);
    component.datosDeTablaSeleccionados({
      opcionSeleccionados: {},
      scianSeleccionados: {},
      mercanciasSeleccionados: {},
      opcionesColapsableState: {}
    });
    expect(component.tramite260203Store.update).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
  });

});