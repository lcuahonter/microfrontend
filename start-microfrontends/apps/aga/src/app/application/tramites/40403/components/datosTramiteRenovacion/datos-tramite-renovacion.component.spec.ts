import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosTramiteRenovacionComponent } from './datosTramiteRenovacion.component';
import { FormBuilder } from '@angular/forms';
import { Tramite40403Service } from '../../estados/tramite40403.service';
import { Tramite40403Store } from '../../estados/tramite40403.store';
import { Tramite40403Query } from '../../estados/tramite40403.query';
import { CatalogoSelectComponent, ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientModule } from '@angular/common/http';

@Injectable()
class MockTramite40403Service {}

@Injectable()
class MockTramite40403Store {}

@Injectable()
class MockTramite40403Query {}


describe('DatosTramiteRenovacionComponent', () => {
  let fixture: ComponentFixture<unknown>;
  let component: { ngOnDestroy: () => void; tramite40403Query: { selectSeccionState$?: any; getValue?: any; }; consultaioQuery: { selectConsultaioState$?: any; }; inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); inicializarFormulario: jest.Mock<any, any, any> | (() => void); tipoDeCaatAereaData: jest.Mock<any, any, any> | (() => void); ideCodTransportacionAereaData: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; ngAfterViewInit: () => void; formulario: { disable?: any; get?: any; patchValue?: any; }; fb: { group?: any; }; atencionRenovacionState: { claveFolioCAAT?: any; cveFolioCaat?: any; descripcionTipoCaat?: any; tipoDeCaatAerea?: any; ideCodTransportacionAerea?: any; codIataIcao?: any; }; caatConMayusculas: (arg0: { target: { value: {}; }; }) => void; tramite40403Store: { setMostrarError?: any; establecerCveFolioCaat?: any; establecerDescripcionTipoCaat?: any; establecerTipoDeCaatAerea?: any; establecerIdeCodTransportacionAerea?: any; establecerCodIataIcao?: any; metodoNombre?: any; }; tramite40403Service: { buscarSolicitudPorCAATe?: any; getTipoDeCaatAerea?: any; geTideCodTransportacionAerea?: any; }; establecerCampoValor: jest.Mock<any, any, any> | ((arg0: { cveFolioCaat: {}; descripcionTipoCaat: {}; tipoDeCaatAerea: {}; ideCodTransportacionAerea: {}; codIataIcao: {}; }) => void); buscarSolicitudPorCAAT: () => void; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        CatalogoSelectComponent, 
        DatosTramiteRenovacionComponent,
        ReactiveFormsModule,
        HttpClientModule],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Tramite40403Service, useClass: MockTramite40403Service },
        { provide: Tramite40403Store, useClass: MockTramite40403Store },
        { provide: Tramite40403Query, useClass: MockTramite40403Query },
        ConsultaioQuery
      ]
    }).overrideComponent(DatosTramiteRenovacionComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosTramiteRenovacionComponent);
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
    component.tramite40403Query = component.tramite40403Query || {};
    component.tramite40403Query.selectSeccionState$ = observableOf({});
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.inicializarFormulario = jest.fn();
    component.tipoDeCaatAereaData = jest.fn();
    component.ideCodTransportacionAereaData = jest.fn();
    component.ngOnInit();
  });

  it('should run #ngAfterViewInit()', async () => {
    component.tramite40403Query = component.tramite40403Query || {};
    component.tramite40403Query.getValue = jest.fn().mockReturnValue({
      mostrarError: {}
    });
    component.ngAfterViewInit();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.formulario = component.formulario || {};
    component.formulario.disable = jest.fn();
    component.inicializarEstadoFormulario();
  });

  it('should run #inicializarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.atencionRenovacionState = component.atencionRenovacionState || {};
    component.atencionRenovacionState.claveFolioCAAT = 'claveFolioCAAT';
    component.atencionRenovacionState.cveFolioCaat = 'cveFolioCaat';
    component.atencionRenovacionState.descripcionTipoCaat = 'descripcionTipoCaat';
    component.atencionRenovacionState.tipoDeCaatAerea = 'tipoDeCaatAerea';
    component.atencionRenovacionState.ideCodTransportacionAerea = 'ideCodTransportacionAerea';
    component.atencionRenovacionState.codIataIcao = 'codIataIcao';
    component.inicializarEstadoFormulario = jest.fn();
    component.inicializarFormulario();
  });

  it('should run #caatConMayusculas()', async () => {
    component.formulario = component.formulario || {};
    component.formulario.get = jest.fn().mockReturnValue({
      setValue: function() {}
    });
    component.caatConMayusculas({
      target: {
        value: "testValue"
      }
    });
  });

  it('should run #buscarSolicitudPorCAAT()', async () => {
    component.formulario = component.formulario || {};
    component.formulario.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.formulario.patchValue = jest.fn();
    component.tramite40403Store = component.tramite40403Store || {};
    component.tramite40403Store.setMostrarError = jest.fn();
    component.tramite40403Service = component.tramite40403Service || {};
    component.tramite40403Service.buscarSolicitudPorCAATe = jest.fn().mockReturnValue(observableOf({
      data: {
        0: {}
      }
    }));
    component.establecerCampoValor = jest.fn();
    component.buscarSolicitudPorCAAT();
  });

  it('should run #establecerCampoValor()', async () => {
    component.tramite40403Store = component.tramite40403Store || {};
    component.tramite40403Store.establecerCveFolioCaat = jest.fn();
    component.tramite40403Store.establecerDescripcionTipoCaat = jest.fn();
    component.tramite40403Store.establecerTipoDeCaatAerea = jest.fn();
    component.tramite40403Store.establecerIdeCodTransportacionAerea = jest.fn();
    component.tramite40403Store.establecerCodIataIcao = jest.fn();
    component.establecerCampoValor({
      cveFolioCaat: {},
      descripcionTipoCaat: {},
      tipoDeCaatAerea: {},
      ideCodTransportacionAerea: {},
      codIataIcao: {}
    });
  });

  it('should run #tipoDeCaatAereaData()', async () => {
    component.tramite40403Service = component.tramite40403Service || {};
    component.tramite40403Service.getTipoDeCaatAerea = jest.fn().mockReturnValue(observableOf({}));
    component.tipoDeCaatAereaData();
  });

  it('should run #ideCodTransportacionAereaData()', async () => {
    component.tramite40403Service = component.tramite40403Service || {};
    component.tramite40403Service.geTideCodTransportacionAerea = jest.fn().mockReturnValue(observableOf({}));
    component.ideCodTransportacionAereaData();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

});