// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { RegionesComponent } from './regiones.component';
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
class MockTramiteStore {
  setRegionesTabla() {}
  setRegionTramite() {}
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('RegionesComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule],
      declarations: [
        RegionesComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
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
    }).overrideComponent(RegionesComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(RegionesComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionaTab() with valid form', async () => {
    component.regionForm = {
      valid: true,
      value: {
        estado: 'test_estado',
        productoCafe: 'test_producto',
        descRegionCompra: 'test_region',
        descripTipoCafe: 'test_tipo',
        volumen: 'test_volumen'
      },
      markAllAsTouched: jest.fn()
    };
    component.estado = { catalogos: [] };
    component.productoCafe = { catalogos: [] };
    component.descripTipoCafe = { catalogos: [] };
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setRegionesTabla = jest.fn();
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.activateRoute = {};
    
    component.seleccionaTab(2);
    
    // When form is valid, markAllAsTouched should NOT be called
    expect(component.regionForm.markAllAsTouched).not.toHaveBeenCalled();
    expect(component.tramiteStore.setRegionesTabla).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #seleccionaTab() with invalid form', async () => {
    component.regionForm = {
      valid: false,
      value: {
        estado: '',
        productoCafe: '',
        descRegionCompra: '',
        descripTipoCafe: '',
        volumen: ''
      },
      markAllAsTouched: jest.fn()
    };
    component.estado = { catalogos: [] };
    component.productoCafe = { catalogos: [] };
    component.descripTipoCafe = { catalogos: [] };
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setRegionesTabla = jest.fn();
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.activateRoute = {};
    
    component.seleccionaTab(2);
    
    // When form is invalid, markAllAsTouched should be called
    expect(component.regionForm.markAllAsTouched).toHaveBeenCalled();
    expect(component.tramiteStore.setRegionesTabla).not.toHaveBeenCalled();
    expect(component.router.navigate).not.toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    // Mock destroyNotifier$ properly as a Subject
    component.destroyNotifier$ = {
      next: jest.fn(),
      complete: jest.fn(),
      pipe: jest.fn().mockReturnValue(observableOf({}))
    };
    
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({
      RegionFormatState: {}
    });
    component.iniciarFormulario = jest.fn();
    component.cargarEstadoCatalog = jest.fn();
    component.cargarProductoCafe = jest.fn();
    component.cargarTipoDeCafe = jest.fn();
    component.regionForm = {
      patchValue: jest.fn(),
      valueChanges: observableOf({}),
      valid: true,
      value: 'test_value'
    };
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setRegionTramite = jest.fn();
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    
    component.ngOnInit();
    
    expect(component.iniciarFormulario).toHaveBeenCalled();
    expect(component.cargarEstadoCatalog).toHaveBeenCalled();
    expect(component.cargarProductoCafe).toHaveBeenCalled();
    expect(component.cargarTipoDeCafe).toHaveBeenCalled();
  });

  it('should run #iniciarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.iniciarFormulario();
    // expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #cargarProductoCafe()', async () => {
    component.catalogosService = component.catalogosService || {};
    component.catalogosService.cargarBodegaPropiaAlquilad = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.cargarProductoCafe();
    // expect(component.catalogosService.cargarBodegaPropiaAlquilad).toHaveBeenCalled();
  });

  it('should run #cargarTipoDeCafe()', async () => {
    component.catalogosService = component.catalogosService || {};
    component.catalogosService.cargarTipoDeCafe = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.cargarTipoDeCafe();
    // expect(component.catalogosService.cargarTipoDeCafe).toHaveBeenCalled();
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
    component.regionForm = {
      reset: jest.fn()
    };
    component.router = {
      navigate: jest.fn()
    };
    component.activateRoute = {};
    
    component.cancelarBodega();
    
    expect(component.regionForm.reset).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = {
      next: jest.fn(),
      complete: jest.fn()
    };
    
    component.ngOnDestroy();
    
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});