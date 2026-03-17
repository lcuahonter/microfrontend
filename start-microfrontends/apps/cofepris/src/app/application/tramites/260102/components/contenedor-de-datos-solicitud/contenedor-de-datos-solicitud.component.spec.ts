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
import { Tramite260102Query } from '../../estados/queries/tramite260102Query.query';
import { tramite260102Store } from '../../estados/stores/tramite260102Store.store';
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
    component.Tramite260102Query = component.Tramite260102Query || {};
    component.Tramite260102Query.selectTramiteState$ = observableOf({});
    component.opcionConfig = component.opcionConfig || {};
    component.opcionConfig.datos = 'datos';
    component.scianConfig = component.scianConfig || {};
    component.scianConfig.datos = 'datos';
    component.tablaMercanciasConfig = component.tablaMercanciasConfig || {};
    component.tablaMercanciasConfig.datos = 'datos';
    component.ngOnInit();

  });

  it('should run #opcionSeleccionado()', async () => {
    component.tramite260102Store = component.tramite260102Store || {};
    component.tramite260102Store.updateOpcionConfigDatos = jest.fn();
    component.opcionSeleccionado({});
    // expect(component.tramite260102Store.updateOpcionConfigDatos).toHaveBeenCalled();
  });

  it('should run #scianSeleccionado()', async () => {
    component.tramite260102Store = component.tramite260102Store || {};
    component.tramite260102Store.updateScianConfigDatos = jest.fn();
    component.scianSeleccionado({});
  });

  it('should run #mercanciasSeleccionado()', async () => {
    component.tramite260102Store = component.tramite260102Store || {};
    component.tramite260102Store.updateTablaMercanciasConfigDatos = jest.fn();
    component.mercanciasSeleccionado({});
  });

  it('should run #datasolicituActualizar()', async () => {
    component.tramite260102Store = component.tramite260102Store || {};
    component.tramite260102Store.updateDatosSolicitudFormState = jest.fn();
    // component.datasolicituActualizar({});
  });

  it('should run #datosDeTablaSeleccionados()', async () => {
    component.tramite260102Store = component.tramite260102Store || {};
    component.tramite260102Store.update = jest.fn().mockReturnValue([
      null
    ]);
    component.datosDeTablaSeleccionados({
      opcionSeleccionados: {},
      scianSeleccionados: {},
      mercanciasSeleccionados: {},
      opcionesColapsableState: {}
    });
    expect(component.tramite260102Store.update).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
  });

  describe('#esFormValido', () => {
    it('should return true if tramiteState.datosSolicitudFormState.rfcSanitario is truthy', () => {
      component.tramiteState = {
        datosSolicitudFormState: {
          rfcSanitario: 'RFC123'
        }
      } as any;
      expect(component.esFormValido()).toBe(true);
    });

    it('should return false if tramiteState.datosSolicitudFormState.rfcSanitario is falsy', () => {
      component.tramiteState = {
        datosSolicitudFormState: {
          rfcSanitario: ''
        }
      } as any;
      expect(component.esFormValido()).toBe(false);
    });

    it('should return false if tramiteState.datosSolicitudFormState.rfcSanitario is undefined', () => {
      component.tramiteState = {
        datosSolicitudFormState: {
          rfcSanitario: undefined
        }
      } as any;
      expect(component.esFormValido()).toBe(false);
    });
  });

});