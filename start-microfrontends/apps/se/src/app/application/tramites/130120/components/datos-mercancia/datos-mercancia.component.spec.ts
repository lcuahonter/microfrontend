import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosMercanciaComponent } from './datos-mercancia.component';
import { FormBuilder } from '@angular/forms';
import { PermisoImportacionStore } from '../../estados/permiso-importacion.store';
import { Tramite130120Query } from '../../estados/permiso-importacion.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { PermisoImportacionService } from '../../services/permiso-importacion.service';

@Injectable()
class MockPermisoImportacionStore {}

@Injectable()
class MockTramite130120Query {}

@Injectable()
class MockPermisoImportacionService {}

describe('DatosMercanciaComponent', () => {
  let fixture: ComponentFixture<DatosMercanciaComponent>;
  let component: { ngOnDestroy: () => void; query: { selectDatos$?: any; }; initActionFormBuild: jest.Mock<any, any, any> | (() => void); ObtenerTipoEntradaOpcion: jest.Mock<any, any, any> | (() => void); ObtenerFraccionOpcion: jest.Mock<any, any, any> | (() => void); obtenerNicoOpcion: jest.Mock<any, any, any> | (() => void); obtenerUmtOpcion: jest.Mock<any, any, any> | (() => void); obtenerUmcOpcion: jest.Mock<any, any, any> | (() => void); obtenerMonedaComercializacionOpcion: jest.Mock<any, any, any> | (() => void); obternerPaisExportadorOpcion: jest.Mock<any, any, any> | (() => void); obtenerPaisOrigenOpcion: jest.Mock<any, any, any> | (() => void); consultaQuery: { selectConsultaioState$?: any; }; ngOnInit: () => any; fb: { group?: any; }; DatosState: { datosMercanica?: any; }; permisoImportacionService: { obtenerMenuDesplegable?: any; }; datosMercanica: { patchValue?: any; get?: any; }; store: { setFacturaFecha?: any; metodoNombre?: any; }; fechaCambiado: (arg0: {}) => void; setTotalMercanciaImportar: () => void; setMercanciaImportar: () => void; setValoresStore: jest.Mock<any, any, any> | ((arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void); umcOpcion: { find?: any; }; onUmcChange: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; onCantidadUmcOrFactorChange: () => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DatosMercanciaComponent ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: PermisoImportacionStore, useClass: MockPermisoImportacionStore },
        { provide: Tramite130120Query, useClass: MockTramite130120Query },
        ConsultaioQuery,
        { provide: PermisoImportacionService, useClass: MockPermisoImportacionService }
      ]
    }).overrideComponent(DatosMercanciaComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosMercanciaComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.query = component.query || {};
    component.query.selectDatos$ = observableOf({});
    component.initActionFormBuild = jest.fn();
    component.ObtenerTipoEntradaOpcion = jest.fn();
    component.ObtenerFraccionOpcion = jest.fn();
    component.obtenerNicoOpcion = jest.fn();
    component.obtenerUmtOpcion = jest.fn();
    component.obtenerUmcOpcion = jest.fn();
    component.obtenerMonedaComercializacionOpcion = jest.fn();
    component.obternerPaisExportadorOpcion = jest.fn();
    component.obtenerPaisOrigenOpcion = jest.fn();
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    await component.ngOnInit();
  });

  it('should run #initActionFormBuild()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.DatosState = component.DatosState || {};
    component.DatosState.datosMercanica = {
      descripcion: {},
      marca: {},
      tipo_entrada: {},
      fraccion: {},
      nico: {},
      umt: {},
      factura_numero: {},
      factura_fecha: {},
      umc: {},
      otro_umc: {},
      cantidad_umc: {},
      factor_conversion: {},
      cantidad_umt: {},
      valor_factura: {},
      moneda_comercializacion: {},
      valor_factura_usd: {},
      precio_unitario_usd: {},
      pais_exportador: {},
      pais_origen: {},
      valor_total_factura: {},
      valor_total_factura_usd: {}
    };
    component.initActionFormBuild();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #ObtenerTipoEntradaOpcion()', async () => {
    component.permisoImportacionService = component.permisoImportacionService || {};
    component.permisoImportacionService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.ObtenerTipoEntradaOpcion();
    expect(component.permisoImportacionService.obtenerMenuDesplegable).toHaveBeenCalled();
  });

  it('should run #ObtenerFraccionOpcion()', async () => {
    component.permisoImportacionService = component.permisoImportacionService || {};
    component.permisoImportacionService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.ObtenerFraccionOpcion();
    expect(component.permisoImportacionService.obtenerMenuDesplegable).toHaveBeenCalled();
  });

  it('should run #obtenerNicoOpcion()', async () => {
    component.permisoImportacionService = component.permisoImportacionService || {};
    component.permisoImportacionService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.obtenerNicoOpcion();
    expect(component.permisoImportacionService.obtenerMenuDesplegable).toHaveBeenCalled();
  });

  it('should run #obtenerUmtOpcion()', async () => {
    component.permisoImportacionService = component.permisoImportacionService || {};
    component.permisoImportacionService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.obtenerUmtOpcion();
    expect(component.permisoImportacionService.obtenerMenuDesplegable).toHaveBeenCalled();
  });

  it('should run #obtenerUmcOpcion()', async () => {
    component.permisoImportacionService = component.permisoImportacionService || {};
    component.permisoImportacionService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.obtenerUmcOpcion();
    expect(component.permisoImportacionService.obtenerMenuDesplegable).toHaveBeenCalled();
  });

  it('should run #obtenerMonedaComercializacionOpcion()', async () => {
    component.permisoImportacionService = component.permisoImportacionService || {};
    component.permisoImportacionService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.obtenerMonedaComercializacionOpcion();
    expect(component.permisoImportacionService.obtenerMenuDesplegable).toHaveBeenCalled();
  });

  it('should run #obternerPaisExportadorOpcion()', async () => {
    component.permisoImportacionService = component.permisoImportacionService || {};
    component.permisoImportacionService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.obternerPaisExportadorOpcion();
    expect(component.permisoImportacionService.obtenerMenuDesplegable).toHaveBeenCalled();
  });

  it('should run #obtenerPaisOrigenOpcion()', async () => {
    component.permisoImportacionService = component.permisoImportacionService || {};
    component.permisoImportacionService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.obtenerPaisOrigenOpcion();
    expect(component.permisoImportacionService.obtenerMenuDesplegable).toHaveBeenCalled();
  });

  it('should run #fechaCambiado()', async () => {
    component.datosMercanica = component.datosMercanica || {};
    component.datosMercanica.patchValue = jest.fn();
    component.store = component.store || {};
    component.store.setFacturaFecha = jest.fn();
    component.fechaCambiado({});
  });

  it('should run #setTotalMercanciaImportar()', async () => {
    component.datosMercanica = component.datosMercanica || {};
    component.datosMercanica.get = jest.fn().mockReturnValue({
      markAsTouched: function() {},
      markAsDirty: function() {},
      setValue: function() {}
    });
    component.setTotalMercanciaImportar();
    expect(component.datosMercanica.get).toHaveBeenCalled();
  });

  it('should run #setMercanciaImportar()', async () => {
    component.datosMercanica = component.datosMercanica || {};
    component.datosMercanica.get = jest.fn().mockReturnValue({
      markAsTouched: function() {},
      markAsDirty: function() {},
      setValue: function() {}
    });
    component.setMercanciaImportar();
    expect(component.datosMercanica.get).toHaveBeenCalled();
  });

  it('should run #onUmcChange()', async () => {
    component.setValoresStore = jest.fn();
    component.umcOpcion = component.umcOpcion || {};
    component.umcOpcion.find = jest.fn().mockReturnValue([
      {
        "id": {}
      }
    ]);
    component.datosMercanica = component.datosMercanica || {};
    component.datosMercanica.get = jest.fn();
    component.onUmcChange({
      get: function() {
        return {
          value: {}
        };
      }
    }, {}, {});
  });

  it('should run #onCantidadUmcOrFactorChange()', async () => {
    component.datosMercanica = component.datosMercanica || {};
    component.datosMercanica.get = jest.fn().mockReturnValue({
      markAsTouched: function() {},
      markAsDirty: function() {},
      setValue: function() {}
    });
    component.onCantidadUmcOrFactorChange();
    expect(component.datosMercanica.get).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});