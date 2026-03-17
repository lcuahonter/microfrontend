// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { BodegasComponent } from './bodegas.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { CatalogosService } from '../../servicios/catalogos.service';
import { TramiteStoreQuery } from '../../estados/tramite290101.query';
import { TramiteStore } from '../../estados/tramite290101.store';
import { SeccionLibQuery, SeccionLibStore } from '@libs/shared/data-access-user/src';
import {HttpClientTestingModule } from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

@Injectable()
class MockRouter {
  navigate() {};
}

@Injectable()
class MockCatalogosService {}

@Injectable()
class MockTramiteStoreQuery {}

@Injectable()
class MockTramiteStore {}

describe('BodegasComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      declarations: [BodegasComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useClass: MockRouter },
        FormBuilder,
        { provide: CatalogosService, useClass: MockCatalogosService },
        { provide: TramiteStoreQuery, useClass: MockTramiteStoreQuery },
        { provide: TramiteStore, useClass: MockTramiteStore },
        SeccionLibQuery,
        SeccionLibStore,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {url: 'url', params: {}, queryParams: {}, data: {}},
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        }
      ]
    }).overrideComponent(BodegasComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(BodegasComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionaTab()', async () => {
    component.bodegaForm = component.bodegaForm || {};
    component.bodegaForm.value = {
      razonSocial: {},
      propAlquil: {},
      calle: {},
      numeroExterior: {},
      numeroInterior: {},
      colonia: {},
      estado: {},
      codigoPostal: {},
      capacidadAlmacenaje: {}
    };
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setBodegasTabla = jest.fn();
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.seleccionaTab({});
    // expect(component.tramiteStore.setBodegasTabla).toHaveBeenCalled();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({
      BodegasFormaState: {}
    });
    component.iniciarFormulario = jest.fn();
    component.cargarEstadoCatalog = jest.fn();
    component.cargarBodegaPropiaAlquilad = jest.fn();
    component.bodegaForm = component.bodegaForm || {};
    component.bodegaForm.patchValue = jest.fn();
    component.bodegaForm.statusChanges = observableOf({});
    component.bodegaForm.value = 'value';
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setBodegasTramite = jest.fn();
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.ngOnInit();
    // expect(component.iniciarFormulario).toHaveBeenCalled();
    // expect(component.cargarEstadoCatalog).toHaveBeenCalled();
    // expect(component.cargarBodegaPropiaAlquilad).toHaveBeenCalled();
    // expect(component.bodegaForm.patchValue).toHaveBeenCalled();
    // expect(component.tramiteStore.setBodegasTramite).toHaveBeenCalled();
  });

  it('should run #iniciarFormulario()', async () => {
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({});
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.inicializarFormulario();
    // expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #cargarBodegaPropiaAlquilad()', async () => {
    component.catalogosService = component.catalogosService || {};
    component.catalogosService.cargarBodegaPropiaAlquilad = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.cargarBodegaPropiaAlquilad();
    // expect(component.catalogosService.cargarBodegaPropiaAlquilad).toHaveBeenCalled();
  });

  it('should run #cargarEstadoCatalog()', async () => {
    component.catalogosService = component.catalogosService || {};
    component.catalogosService.cargarEstadoCatalog = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.cargarEstadoCatalog();
    // expect(component.catalogosService.cargarEstadoCatalog).toHaveBeenCalled();
  });

  it('should run #cancelarBodega()', async () => {
    component.bodegaForm = component.bodegaForm || {};
    component.bodegaForm.reset = jest.fn();
    component.cancelarBodega();
    // expect(component.bodegaForm.reset).toHaveBeenCalled();
  });

});