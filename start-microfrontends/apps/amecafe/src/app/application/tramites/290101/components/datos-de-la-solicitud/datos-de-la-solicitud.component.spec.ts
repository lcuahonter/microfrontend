// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { FormBuilder } from '@angular/forms';
import { ProductoTablaServicios } from '../../servicios/regiones-compra.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TramiteStoreQuery } from '../../estados/tramite290101.query';
import { TramiteStore } from '../../estados/tramite290101.store';
import { SeccionLibQuery, SeccionLibStore, ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { CatalogosService } from '../../servicios/catalogos.service';

@Injectable()
class MockProductoTablaServicios {}

@Injectable()
class MockRouter {
  navigate() {};
}

@Injectable()
class MockTramiteStoreQuery {}

@Injectable()
class MockTramiteStore {
  clearBodegasTramite() {}
  clearCafExportTramite() {}
  clearBeneficiosTramite() {}
  clearRegionTramite() {}
  setSolicitudTramite() {}
  setRegionesTabla() {}
  setBeneficiosTabla() {}
  setBodegasTabla() {}
  setCafeExportacionTabla() {}
  updateRegionesTabla() {}
  updateBeneficiosTabla() {}
  updateBodegasTabla() {}
  updateCafeExportacionTabla() {}
}

@Injectable()
class MockCatalogosService {}

describe('DatosDeLaSolicitudComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ DatosDeLaSolicitudComponent, FormsModule, ReactiveFormsModule ],
      declarations: [],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: ProductoTablaServicios, useClass: MockProductoTablaServicios },
        { provide: Router, useClass: MockRouter },
        { provide: TramiteStoreQuery, useClass: MockTramiteStoreQuery },
        { provide: TramiteStore, useClass: MockTramiteStore },
        SeccionLibQuery,
        SeccionLibStore,
        { provide: CatalogosService, useClass: MockCatalogosService },
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
        },
        ConsultaioQuery
      ]
    }).overrideComponent(DatosDeLaSolicitudComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
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

  it('should run #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.inicializarFormulario = jest.fn();
    component.inicializarEstadoFormulario();
    // expect(component.guardarDatosFormulario).toHaveBeenCalled();
    // expect(component.inicializarFormulario).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.inicializarFormulario = jest.fn();
    component.datosSolicitudForma = component.datosSolicitudForma || {};
    component.datosSolicitudForma.disable = jest.fn();
    component.datosSolicitudForma.enable = jest.fn();
    component.guardarDatosFormulario();
    // expect(component.inicializarFormulario).toHaveBeenCalled();
    // expect(component.datosSolicitudForma.disable).toHaveBeenCalled();
    // expect(component.datosSolicitudForma.enable).toHaveBeenCalled();
  });

  it('should run #inicializarFormulario()', async () => {
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({});
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.inicializarFormulario();
    // expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #redirigirBodegas()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.clearBodegasTramite = jest.fn();
    component.redirigirBodegas();
    expect(component.tramiteStore.clearBodegasTramite).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #redirigirCafeExportadores()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.clearCafExportTramite = jest.fn();
    component.redirigirCafeExportadores();
    expect(component.tramiteStore.clearCafExportTramite).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #redirigirBeneficios()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.clearBeneficiosTramite = jest.fn();
    component.redirigirBeneficios();
    expect(component.tramiteStore.clearBeneficiosTramite).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #redirigirRegiones()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.clearRegionTramite = jest.fn();
    component.redirigirRegiones();
    expect(component.tramiteStore.clearRegionTramite).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({});
    component.catalogosService = component.catalogosService || {};
    component.catalogosService.RadioOpcion = 'RadioOpcion';
    component.datosSolicitudForma = component.datosSolicitudForma || {};
    component.datosSolicitudForma.get = jest.fn().mockReturnValue({
      enable: function() {},
      disable: function() {},
      valueChanges: observableOf({})
    });
    component.datosSolicitudForma.patchValue = jest.fn();
    component.datosSolicitudForma.statusChanges = observableOf({});
    component.datosSolicitudForma.value = 'value';
    component.subscriptions = component.subscriptions || {};
    component.subscriptions.push = jest.fn();
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setSolicitudTramite = jest.fn();
    component.buscarDatos = jest.fn();
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.ngOnInit();
  });

  it('should run #buscarDatos()', async () => {
    component.productoTablaServicios = component.productoTablaServicios || {};
    component.productoTablaServicios.obtenerDatos = jest.fn().mockReturnValue(observableOf({}));
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({});
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setRegionesTabla = jest.fn();
    component.tramiteStore.setBeneficiosTabla = jest.fn();
    component.tramiteStore.setBodegasTabla = jest.fn();
    component.tramiteStore.setCafeExportacionTabla = jest.fn();
    component.buscarDatos();
  });

  it('should run #borrarRegiones()', async () => {
    component.regionesTableDatos = component.regionesTableDatos || {};
    component.regionesTableDatos.findIndex = jest.fn().mockReturnValue([
      {
        "TABLA_Columna_1": {}
      }
    ]);
    component.regionesTableDatos.splice = jest.fn();
    component.regionesSeleccionadas = component.regionesSeleccionadas || {};
    component.regionesSeleccionadas[0] = {
      TABLA_Columna_1: {}
    };
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateRegionesTabla = jest.fn();
    component.borrarRegiones();
  });

  it('should run #seleccionarRegiones()', async () => {

    component.seleccionarRegiones({});

  });

  it('should run #borrarBeneficios()', async () => {
    component.beneficiosTableDatos = component.beneficiosTableDatos || {};
    component.beneficiosTableDatos.findIndex = jest.fn().mockReturnValue([
      {
        "TABLA_Columna_1": {}
      }
    ]);
    component.beneficiosTableDatos.splice = jest.fn();
    component.beneficiosSeleccionados = component.beneficiosSeleccionados || {};
    component.beneficiosSeleccionados[0] = {
      TABLA_Columna_1: {}
    };
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateBeneficiosTabla = jest.fn();
    component.borrarBeneficios();
  });

  it('should run #seleccionarBeneficios()', async () => {

    component.seleccionarBeneficios({});

  });

  it('should run #borrarBodegas()', async () => {
    component.bodegasTableDatos = component.bodegasTableDatos || {};
    component.bodegasTableDatos.findIndex = jest.fn().mockReturnValue([
      {
        "TABLA_Columna_1": {}
      }
    ]);
    component.bodegasTableDatos.splice = jest.fn();
    component.bodegasSeleccionadas = component.bodegasSeleccionadas || {};
    component.bodegasSeleccionadas[0] = {
      TABLA_Columna_1: {}
    };
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateBodegasTabla = jest.fn();
    component.borrarBodegas();
  });

  it('should run #seleccionarBodega()', async () => {

    component.seleccionarBodega({});

  });

  it('should run #borrarCafe()', async () => {
    component.cafeExporacionTableDatos = component.cafeExporacionTableDatos || {};
    component.cafeExporacionTableDatos.findIndex = jest.fn().mockReturnValue([
      {
        "TABLA_Columna_1": {}
      }
    ]);
    component.cafeExporacionTableDatos.splice = jest.fn();
    component.cafeSeleccionado = component.cafeSeleccionado || {};
    component.cafeSeleccionado[0] = {
      TABLA_Columna_1: {}
    };
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateCafeExportacionTabla = jest.fn();
    component.borrarCafe();
  });

  it('should run #seleccionarCafe()', async () => {

    component.seleccionarCafe({});

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });
it('should call setSolicitudTramite with form value on status change', () => {
  component.datosSolicitudForma = {
    value: { test: 'value' },
    statusChanges: observableOf({}),
    patchValue: jest.fn(),
    get: jest.fn().mockReturnValue({
      enable: jest.fn(),
      disable: jest.fn(),
      valueChanges: observableOf({})
    })
  };
  component.tramiteStore = {
    setSolicitudTramite: jest.fn()
  };
  component.tramiteStoreQuery = {
    selectSolicitudTramite$: observableOf({})
  };
  component.catalogosService = { RadioOpcion: [] };
  component.seccionQuery = { selectSeccionState$: observableOf({}) };
  component.buscarDatos = jest.fn();
  component.inicializarEstadoFormulario = jest.fn();

  component.ngOnInit();
});
it('should set all table data arrays when response arrays are present', () => {
  const mockResponse = {
    regionesCompraApiDatos: [{ id: 1 }],
    beneficiosApiDatos: [{ id: 2 }],
    bodegasApiDatos: [{ id: 3 }],
    cafeExportacionApiDatos: [{ id: 4 }]
  };
  component.productoTablaServicios = {
    obtenerDatos: jest.fn().mockReturnValue(observableOf(mockResponse))
  };
  component.tramiteStoreQuery = { selectSolicitudTramite$: observableOf({}) };
  component.tramiteStore = {
    setRegionesTabla: jest.fn(),
    setBeneficiosTabla: jest.fn(),
    setBodegasTabla: jest.fn(),
    setCafeExportacionTabla: jest.fn()
  };

  component.buscarDatos();

  expect(component.regionesTableDatos).toEqual(mockResponse.regionesCompraApiDatos);
  expect(component.beneficiosTableDatos).toEqual(mockResponse.beneficiosApiDatos);
  expect(component.bodegasTableDatos).toEqual(mockResponse.bodegasApiDatos);
  expect(component.cafeExporacionTableDatos).toEqual(mockResponse.cafeExportacionApiDatos);
});
});