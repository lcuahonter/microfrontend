// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PeruHistoricoProductoresComponent } from './peru-historico-productores.component';
import { FormBuilder } from '@angular/forms';
import { PeruCertificadoService } from '../../services/peru-certificado.service';
import { Tramite110205Store } from '../../estados/tramite110205.store';
import { Tramite110205Query } from '../../estados/tramite110205.query';

@Injectable()
class MockPeruCertificadoService {
  getTipoFactura = jest.fn().mockReturnValue(observableOf({
    datos: []
  }));
  obtenerProductorPorExportador = jest.fn().mockReturnValue(observableOf({
    datos: {}
  }));
  obtenerMercancia = jest.fn().mockReturnValue(observableOf({
    datos: {}
  }));
}

@Injectable()
class MockTramite110205Store {}

@Injectable()
class MockTramite110205Query {
  formulario$ = observableOf({});
  agregarDatosProductorFormulario$ = observableOf({});
  selectPeru$ = observableOf({
    optionsTipoFactura: [],
    optionsPaises: [],
    optionsUnidadMedida: []
  });
  selectMercanciaProductores$ = observableOf([]);
  selectProductoresExportador$ = observableOf([]);
  selectAgregarProductoresExportador$ = observableOf([]);
}


describe('PeruHistoricoProductoresComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PeruHistoricoProductoresComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: PeruCertificadoService, useClass: MockPeruCertificadoService },
        { provide: Tramite110205Store, useClass: MockTramite110205Store },
        { provide: Tramite110205Query, useClass: MockTramite110205Query }
      ]

    }).compileComponents();
    fixture = TestBed.createComponent(PeruHistoricoProductoresComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    // Test that ngOnInit runs without throwing errors
    expect(() => component.ngOnInit()).not.toThrow();
    
    // Test that the component has the expected properties after ngOnInit
    expect(component.mercanciaProductores$).toBeDefined();
    // expect(component.productoresExportador$).toBeDefined();
    expect(component.agregarProductoresExportador$).toBeDefined();
  });

  it('should run #cargarProductorPorExportador()', async () => {
    component.cargarProductorPorExportador();
    expect(component.peruCertificadoService.obtenerProductorPorExportador).toHaveBeenCalled();
  });

  it('should run #cargarMercancia()', async () => {
    component.cargarMercancia();
    expect(component.peruCertificadoService.obtenerMercancia).toHaveBeenCalled();
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