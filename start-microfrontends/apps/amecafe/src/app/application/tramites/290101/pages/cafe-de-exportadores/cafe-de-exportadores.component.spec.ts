// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { CafeDeExportadoresComponent } from './cafe-de-exportadores.component';
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

describe('CafeDeExportadoresComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule, FormsModule, ReactiveFormsModule ],
      declarations: [CafeDeExportadoresComponent],
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
    }).overrideComponent(CafeDeExportadoresComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(CafeDeExportadoresComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy = () => {}; 
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionaTab()', async () => {
    component.cafeExportForm = component.cafeExportForm || {};
    component.cafeExportForm.value = {
      descripcionMercancia: {},
      clasificacion: {},
      porcentajeConcentracion: {}
    };
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setCafeExportacionTabla = jest.fn();
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.seleccionaTab({});
    // expect(component.tramiteStore.setCafeExportacionTabla).toHaveBeenCalled();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({
      CafeExportFormState: {}
    });
    component.iniciarFormulario = jest.fn();
    component.cargarClasificacion = jest.fn();
    component.cafeExportForm = component.cafeExportForm || {};
    component.cafeExportForm.patchValue = jest.fn();
    component.cafeExportForm.statusChanges = observableOf({});
    component.cafeExportForm.value = 'value';
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setCafExportTramite = jest.fn();
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.ngOnInit();
    // expect(component.iniciarFormulario).toHaveBeenCalled();
    // expect(component.cargarClasificacion).toHaveBeenCalled();
    // expect(component.cafeExportForm.patchValue).toHaveBeenCalled();
    // expect(component.tramiteStore.setCafExportTramite).toHaveBeenCalled();
  });

  it('should run #iniciarFormulario()', async () => {
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({});
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.inicializarFormulario();
    // expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #cargarClasificacion()', async () => {
    component.catalogosService = component.catalogosService || {};
    component.catalogosService.cargarClasificacion = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.cargarClasificacion();
    // expect(component.catalogosService.cargarClasificacion).toHaveBeenCalled();
  });

  it('should run #cancelarBodega()', async () => {
    component.cafeExportForm = component.cafeExportForm || {};
    component.cafeExportForm.reset = jest.fn();
    component.cancelarBodega();
    // expect(component.cafeExportForm.reset).toHaveBeenCalled();
  });

});