// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { MaterialesPeligrososService } from '../../services/materiales-peligrosos.service';
import { FormBuilder } from '@angular/forms';
import { Tramite230501Store } from '../../estados/stores/tramite230501Store.store';
import { Tramite230501Query } from '../../estados/queries/tramite230501Query.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockMaterialesPeligrososService {
  inicializaPagoDerechosCatalogo = function() {};
}

@Injectable()
class MockTramite230501Store {}

@Injectable()
class MockTramite230501Query {}

describe('PagoDeDerechosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MaterialesPeligrososService, useClass: MockMaterialesPeligrososService },
        FormBuilder,
        { provide: Tramite230501Store, useClass: MockTramite230501Store },
        { provide: Tramite230501Query, useClass: MockTramite230501Query },
        ConsultaioQuery
      ]
    }).overrideComponent(PagoDeDerechosComponent, {

      set: { providers: [{ provide: MaterialesPeligrososService, useClass: MockMaterialesPeligrososService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramite230501Query = component.tramite230501Query || {};
    component.tramite230501Query.seletPagoDerechosState$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.pagoDerechos = component.pagoDerechos || {};
    component.pagoDerechos.disable = jest.fn();
    component.createPagoDerechos = jest.fn();
    component.inicializarEstadoFormulario();
  });

  it('should run #setFormValida()', async () => {
    component.tramite230501Store = component.tramite230501Store || {};
    component.tramite230501Store.setFormValida = jest.fn();
    component.setFormValida({});
    expect(component.tramite230501Store.setFormValida).toHaveBeenCalled();
  });

  it('should run #createPagoDerechos()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.pagoDerechosState = component.pagoDerechosState || {};
    component.pagoDerechosState.clave = 'clave';
    component.pagoDerechosState.dependencia = 'dependencia';
    component.pagoDerechosState.banco = 'banco';
    component.pagoDerechosState.llavePago = 'llavePago';
    component.pagoDerechosState.fecha = 'fecha';
    component.pagoDerechosState.importePago = 'importePago';
    component.createPagoDerechos();
  });

  it('should run #onCambioDeTiempo()', async () => {
    component.setFormValida = jest.fn();
    component.pagoDerechos = component.pagoDerechos || {};
    component.pagoDerechos.valid = 'valid';
    component.tramite230501Store = component.tramite230501Store || {};
    component.tramite230501Store.setPagoDerechosStateProperty = jest.fn();
    component.onCambioDeTiempo({});
    expect(component.setFormValida).toHaveBeenCalled();
    expect(component.tramite230501Store.setPagoDerechosStateProperty).toHaveBeenCalled();
  });

  it('should run #clasificacionSeleccione()', async () => {
    component.pagoDerechos = component.pagoDerechos || {};
    component.pagoDerechos.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.pagoDerechos.valid = 'valid';
    component.setFormValida = jest.fn();
    component.tramite230501Store = component.tramite230501Store || {};
    component.tramite230501Store.setPagoDerechosStateProperty = jest.fn();
    component.clasificacionSeleccione();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });
});