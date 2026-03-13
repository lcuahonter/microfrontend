// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {  Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { MercanciasModalComponent } from './mercancias-modal.component';
import { FormBuilder } from '@angular/forms';
import { Tramite110202Store } from '../../estados/tramite110202.store';
import { Tramite110202Query } from '../../estados/tramite110202.query';
import { CertificadoValidacionService } from '../../services/certificado-validacion.service';

@Injectable()
class MockTramite110202Store {}

@Injectable()
class MockTramite110202Query {
  formMercancia$ = observableOf({});
  selectFactura$ = {};
  selectUmc$ = {};
  selectMasaBruta$ = {};
}

@Injectable()
class MockCertificadoValidacionService {}



describe('MercanciasModalComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,MercanciasModalComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Tramite110202Store, useClass: MockTramite110202Store },
        { provide: Tramite110202Query, useClass: MockTramite110202Query },
        { provide: CertificadoValidacionService, useClass: MockCertificadoValidacionService }
      ]
    }).overrideComponent(MercanciasModalComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(MercanciasModalComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.parchearValoresDelFormulario = jest.fn();
    component.cargarFactura = jest.fn();
    component.cargarUmc = jest.fn();
    component.ngOnInit();
  });

  it('should run #parchearValoresDelFormulario()', async () => {
    component.datosSeleccionados = component.datosSeleccionados || {};
    component.datosSeleccionados.fraccionArancelaria = 'fraccionArancelaria';
    component.datosSeleccionados.nombreComercial = 'nombreComercial';
    component.datosSeleccionados.nombreTecnico = 'nombreTecnico';
    component.datosSeleccionados.nombreIngles = 'nombreIngles';
    component.datosSeleccionados.criterioClasificacion = 'criterioClasificacion';
    component.datosSeleccionados.marca = 'marca';
    component.datosSeleccionados.cantidad = 'cantidad';
    component.datosSeleccionados.umc = 'umc';
    component.datosSeleccionados.valorMercancia = 'valorMercancia';
    component.datosSeleccionados.complementoClasificacion = 'complementoClasificacion';
    component.datosSeleccionados.masaBruta = 'masaBruta';
    component.datosSeleccionados.unidadMedidaMasaBruta = 'unidadMedidaMasaBruta';
    component.datosSeleccionados.numeroFactura = 'numeroFactura';
    component.datosSeleccionados.tipoFactura = 'tipoFactura';
    component.datosSeleccionados.fechaFinalInput = 'fechaFinalInput';
    component.datosSeleccionados.normaOrigen = 'normaOrigen';
    component.datosSeleccionados.id = 'id';
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.patchValue = jest.fn();
    component.parchearValoresDelFormulario();
  });

  it('should run #tipoFacturasSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setFacturasSeleccion = jest.fn();
    component.tipoFacturasSeleccion({});
  });

  it('should run #tipoUmcSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setUmcSeleccion = jest.fn();
    component.tipoUmcSeleccion({});
  });

  it('should run #tipoMasaBrutaSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setMasaBrutaSeleccion = jest.fn();
    component.tipoMasaBrutaSeleccion({});
  });

  it('should run #cargarFactura()', async () => {
    component.certificadoService = component.certificadoService || {};
    component.certificadoService.obtenerFacturas = jest.fn().mockReturnValue(observableOf({}));
    component.store = component.store || {};
    component.store.setFactura = jest.fn();
    component.cargarFactura();
  });

  it('should run #cambioFechaFinal()', async () => {
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.get = jest.fn().mockReturnValue({
      markAsUntouched: function() {},
      setValue: function() {}
    });
    component.cambioFechaFinal({});
  });

  it('should run #cargarUmc()', async () => {
    component.certificadoService = component.certificadoService || {};
    component.certificadoService.obtenerUmc = jest.fn().mockReturnValue(observableOf({}));
    component.store = component.store || {};
    component.store.setUmc = jest.fn();
    component.store.setMasaBruta = jest.fn();
    component.cargarUmc();;
  });

  it('should run #activarModal()', async () => {

    component.activarModal();

  });

  it('should run #aceptar()', async () => {
    component.store = component.store || {};
    component.store.setFormMercancia = jest.fn();
    component.store.setmercanciaTabla = jest.fn();
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.value = 'value';
    component.guardarClicado = component.guardarClicado || {};
    component.guardarClicado.emit = jest.fn();
    component.cerrarModal = jest.fn();
    component.tablaSeleccionEvent = component.tablaSeleccionEvent || {};
    component.tablaSeleccionEvent.emit = jest.fn();
    component.aceptar();
  });

  it('should run #cerrarModal()', async () => {
    component.cerrarClicado = component.cerrarClicado || {};
    component.cerrarClicado.emit = jest.fn();
    component.cerrarModal();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

});