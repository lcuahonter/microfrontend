// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosMercanciaContenedoraComponent } from './datos-mercancia-contenedora.component';
import { Tramite260203Query } from '../../estados/queries/tramite260203Query.query';
import { Tramite260203Store } from '../../estados/stores/tramite260203Store.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite260203Query {}

@Injectable()
class MockTramite260203Store {}


describe('DatosMercanciaContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule ],

      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite260203Query, useClass: MockTramite260203Query },
        { provide: Tramite260203Store, useClass: MockTramite260203Store }
      ]
    }).overrideComponent(DatosMercanciaContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosMercanciaContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramite260203Query = component.tramite260203Query || {};
    component.tramite260203Query.selectTramiteState$ = observableOf({});
    component.tramite260203Query.getDetalleMercancia$ = 'getDetalleMercancia$';
    component.ngOnInit();

  });

  it('should run #mercanciaSeleccionado()', async () => {
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.tablaMercanciasConfigDatos = {
      findIndex: function() {
        return [
          {
            "clasificacionProducto": {}
          }
        ];
      },
      splice: function() {}
    };
    component.tramite260203Store = component.tramite260203Store || {};
    component.tramite260203Store.update = jest.fn().mockReturnValue([
      null
    ]);
    component.mercanciaSeleccionado({
      clasificacionProducto: {},
      especificarClasificacionProducto: {},
      denominacionEspecificaProducto: {},
      denominacionComun: {},
      formaFarmaceutica: {},
      estadoFisico: {},
      fraccionArancelaria: {},
      descripcionFraccion: {},
      unidadMedidaComercializacion: {},
      cantidadUMC: {},
      unidadMedidaTarifa: {},
      cantidadUMT: {},
      presentacion: {},
      numeroRegistroSanitario: {},
      paisOrigen: {},
      paisProcedencia: {},
      tipoProducto: {},
      usoEspecifico: {}
    });
    expect(component.tramite260203Store.update).toHaveBeenCalled();
  });

  it('should run #aggregarMercancia()', async () => {
    component.tramite260203Store = component.tramite260203Store || {};
    component.tramite260203Store.aggregarDetalleMercancia = jest.fn();
    component.aggregarMercancia({});
    expect(component.tramite260203Store.aggregarDetalleMercancia).toHaveBeenCalled();
  });

  it('should run #eliminarMercancia()', async () => {
    component.tramite260203Store = component.tramite260203Store || {};
    component.tramite260203Store.eliminarDetalleMercancia = jest.fn();
    component.eliminarMercancia({});
    expect(component.tramite260203Store.eliminarDetalleMercancia).toHaveBeenCalled();
  });

});