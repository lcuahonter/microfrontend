// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { HistoricoDeProductoresComponent } from './historico-de-productores.component';
import { FormBuilder } from '@angular/forms';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';
import { Tramite110221Store } from '../../estados/tramite110221.store';
import { Tramite110221Query } from '../../estados/tramite110221.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockValidarInicialmenteCertificadoService {}

@Injectable()
class MockTramite110221Store {}

@Injectable()
class MockTramite110221Query {}


describe('HistoricoDeProductoresComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: ValidarInicialmenteCertificadoService, useClass: MockValidarInicialmenteCertificadoService },
        { provide: Tramite110221Store, useClass: MockTramite110221Store },
        { provide: Tramite110221Query, useClass: MockTramite110221Query }
      ]
    }).overrideComponent(HistoricoDeProductoresComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(HistoricoDeProductoresComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

    it('should run #ngOnInit()', async () => {
    component.cargarProductorPorExportador = jest.fn();
    component.cargarMercancia = jest.fn();
    component.facturaOpcion = jest.fn();
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.formulario$ = observableOf({});
    component.tramiteQuery.agregarDatosProductorFormulario$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.ngOnInit();
    expect(component.cargarProductorPorExportador).toHaveBeenCalled();
    expect(component.cargarMercancia).toHaveBeenCalled();
    expect(component.facturaOpcion).toHaveBeenCalled();
  });

  it('should run #cargarProductorPorExportador()', async () => {
    component.certificadoDeService = component.certificadoDeService || {};
    component.certificadoDeService.obtenerProductorPorExportador = jest.fn().mockReturnValue(observableOf({
      datos: {}
    }));
    component.cargarProductorPorExportador();
    expect(component.certificadoDeService.obtenerProductorPorExportador).toHaveBeenCalled();
  });

  it('should run #facturaOpcion()', async () => {
    component.certificadoDeService = component.certificadoDeService || {};
    component.certificadoDeService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.facturaOpcion();
    expect(component.certificadoDeService.obtenerMenuDesplegable).toHaveBeenCalled();
  });

  it('should run #cargarMercancia()', async () => {
    component.certificadoDeService = component.certificadoDeService || {};
    component.certificadoDeService.obtenerMercancia = jest.fn().mockReturnValue(observableOf({
      datos: {}
    }));
    component.cargarMercancia();
    expect(component.certificadoDeService.obtenerMercancia).toHaveBeenCalled();
  });

  it('should run #setValoresStore()', async () => {
    component.store = component.store || {};
    component.store.setFormHistorico = jest.fn();
    component.setValoresStore({});
    expect(component.store.setFormHistorico).toHaveBeenCalled();
  });

  it('should run #setValoresStoreAgregarForm()', async () => {
    component.store = component.store || {};
    component.store.setAgregarFormDatosProductor = jest.fn();
    component.setValoresStoreAgregarForm({});
    expect(component.store.setAgregarFormDatosProductor).toHaveBeenCalled();
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