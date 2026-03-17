// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ContenedorDeDatosSolicitudComponent } from './contenedor-de-datos-solicitud.component';
import { Tramite230501Query } from '../../estados/queries/tramite230501Query.query';
import { Tramite230501Store } from '../../estados/stores/tramite230501Store.store';
import { MaterialesPeligrososService } from '../../services/materiales-peligrosos.service';
import { SeccionLibStore, SeccionLibQuery, ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
class MockTramite230501Query {}

@Injectable()
class MockTramite230501Store {}

@Injectable()
class MockMaterialesPeligrososService {
  obtenerRespuestaPorUrl = function() {};
}

@Injectable()
class MockRouter {
  navigate() {};
}

describe('ContenedorDeDatosSolicitudComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite230501Query, useClass: MockTramite230501Query },
        { provide: Tramite230501Store, useClass: MockTramite230501Store },
        { provide: MaterialesPeligrososService, useClass: MockMaterialesPeligrososService },
        SeccionLibStore,
        SeccionLibQuery,
        FormBuilder,
        { provide: Router, useClass: MockRouter },
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
    }).overrideComponent(ContenedorDeDatosSolicitudComponent, {

      set: { providers: [{ provide: MaterialesPeligrososService, useClass: MockMaterialesPeligrososService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(ContenedorDeDatosSolicitudComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramite230501Query = component.tramite230501Query || {};
    component.tramite230501Query.selectTramiteState$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.pestanaValidar = jest.fn();
    component.ngOnInit();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.disable = jest.fn();
    component.crearDatosSolicitudForm = jest.fn();
    component.inicializarEstadoFormulario();
  });

  it('should run #setFormValida()', async () => {
    component.tramite230501Store = component.tramite230501Store || {};
    component.tramite230501Store.setFormValida = jest.fn();
    component.setFormValida({});
  });

  it('should run #crearDatosSolicitudForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.datosSolicitudFormType = {
      nombreComun: {}
    };
    component.crearDatosSolicitudForm();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #onCambioDeTiempo()', async () => {
    component.materialesPeligrososService = component.materialesPeligrososService || {};
    component.materialesPeligrososService.convertirNumeroALetras = jest.fn();
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.get = jest.fn().mockReturnValue({
      setValue: function() {}
    });
    component.actualizarElValorDeLaTienda = jest.fn();
    component.onCambioDeTiempo({});
    expect(component.materialesPeligrososService.convertirNumeroALetras).toHaveBeenCalled();
    expect(component.datosSolicitudForm.get).toHaveBeenCalled();
    expect(component.actualizarElValorDeLaTienda).toHaveBeenCalled();
  });

  it('should run #pestanaValidar()', async () => {
    component.isDatosEspecificosValid = jest.fn();
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.numeroCasTablaDatos = {
      length: {}
    };
    component.tramiteState.composicionTablaDatos = {
      length: {}
    };
    component.setFormValida = jest.fn();
    component.pestanaValidar();
    expect(component.isDatosEspecificosValid).toHaveBeenCalled();
    expect(component.setFormValida).toHaveBeenCalled();
  });

  it('should run #areSpecificControlsValid()', async () => {
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.get = jest.fn().mockReturnValue({
      valid: {}
    });
    component.areSpecificControlsValid();
    expect(component.datosSolicitudForm.get).toHaveBeenCalled();
  });

  it('should run #isDatosEspecificosValid()', async () => {
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.get = jest.fn();
    component.isDatosEspecificosValid();
    expect(component.datosSolicitudForm.get).toHaveBeenCalled();
  });

  it('should run #actualizarElValorDeLaTienda()', async () => {
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.tramite230501Store = component.tramite230501Store || {};
    component.tramite230501Store.setDatosSolicitudFormTypeProperty = jest.fn();
    component.pestanaValidar = jest.fn();
    component.actualizarElValorDeLaTienda({}, {});
  });

  it('should run #onFechaCambiada()', async () => {
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.patchValue = jest.fn();
    component.actualizarElValorDeLaTienda = jest.fn();
    component.onFechaCambiada({});
  });

  it('should run #estadoFisicoSeleccione()', async () => {
    component.actualizarElValorDeLaTienda = jest.fn();
    component.estadoFisicoSeleccione();
  });

  it('should run #unidadMedidaSeleccione()', async () => {
    component.actualizarElValorDeLaTienda = jest.fn();
    component.unidadMedidaSeleccione();
  });

  it('should run #agregarNumero()', async () => {
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.datosSolicitudForm.reset = jest.fn();
    component.tramite230501Store = component.tramite230501Store || {};
    component.tramite230501Store.update = jest.fn().mockReturnValue([
      {
        "numeroCasTablaDatos": {}
      }
    ]);
    component.actualizarElValorDeLaTienda = jest.fn();
    component.pestanaValidar = jest.fn();
    component.agregarNumero();
  });

  it('should run #eliminarNumeroCas()', async () => {
    component.numeroCasSellecionLista = component.numeroCasSellecionLista || {};
    component.numeroCasSellecionLista.some = jest.fn().mockReturnValue([
      {
        "numeroCas": {}
      }
    ]);
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.numeroCasTablaDatos = [
      {
        "numeroCas": {}
      }
    ];
    component.tramite230501Store = component.tramite230501Store || {};
    component.tramite230501Store.update = jest.fn().mockReturnValue([
      null
    ]);
    component.pestanaValidar = jest.fn();
    component.eliminarNumeroCas();
  });

  it('should run #fraccionArancelariaSeleccione()', async () => {
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.get = jest.fn().mockReturnValue({
      setValue: function() {},
      value: {}
    });
    component.actualizarElValorDeLaTienda = jest.fn();
    component.fraccionArancelariaSeleccione();
  });

  it('should run #numeroCasSeleccione()', async () => {
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.get = jest.fn().mockReturnValue({
      setValue: function() {},
      value: {}
    });
    component.actualizarElValorDeLaTienda = jest.fn();
    component.numeroCasSeleccione();
  });

  it('should run #datasolicituActualizar()', async () => {
    component.seccion = component.seccion || {};
    component.esFormValido = jest.fn();
    component.seccionStore = component.seccionStore || {};
    component.seccionStore.establecerFormaValida = jest.fn();
    component.datasolicituActualizar();
  });

  it('should run #esFormValido()', async () => {
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.numeroCasTablaDatos = {
      length: {}
    };
    component.tramiteState.composicionTablaDatos = {
      length: {}
    };
    component.esFormValido();

  });

  it('should run #agregarcomposicion()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.agregarcomposicion();
  });

  it('should run #eliminarComposicion()', async () => {
    component.composicionSeleccionLista = component.composicionSeleccionLista || {};
    component.composicionSeleccionLista.some = jest.fn().mockReturnValue([
      {
        "componente": {}
      }
    ]);
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.composicionTablaDatos = [
      {
        "componente": {}
      }
    ];
    component.tramite230501Store = component.tramite230501Store || {};
    component.tramite230501Store.update = jest.fn().mockReturnValue([
      null
    ]);
    component.pestanaValidar = jest.fn();
    component.eliminarComposicion();
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