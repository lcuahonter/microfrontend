// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { InternaPagoDeDerechosComponent } from './interna-pago-de-derechos.component';
import { FormBuilder } from '@angular/forms';
import { ImportacionDeAcuiculturaService } from '../../servicios/importacion-de-agricultura.service';
import { TramiteStoreQuery } from '../../estados/tramite220701.query';
import { TramiteStore } from '../../estados/tramite220701.store';
import { SeccionLibQuery, SeccionLibStore, ConsultaioQuery } from '@libs/shared/data-access-user/src';

@Injectable()
class MockImportacionDeAcuiculturaService {
  obtenerDatos = function() {
    return observableOf({
      formularioPago: {}
    });
  };
}

@Injectable()
class MockTramiteStoreQuery {}

@Injectable()
class MockTramiteStore {}

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

describe('InternaPagoDeDerechosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ InternaPagoDeDerechosComponent, FormsModule, ReactiveFormsModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: ImportacionDeAcuiculturaService, useClass: MockImportacionDeAcuiculturaService },
        { provide: TramiteStoreQuery, useClass: MockTramiteStoreQuery },
        { provide: TramiteStore, useClass: MockTramiteStore },
        SeccionLibQuery,
        SeccionLibStore,
        ConsultaioQuery
      ]
    }).overrideComponent(InternaPagoDeDerechosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(InternaPagoDeDerechosComponent);
    component = fixture.debugElement.componentInstance;
    component.formatearFecha = jest.fn().mockImplementation((date) => {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    });
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });


  it('should run #guardarDatosFormulario()', async () => {
    component.inicializarFormulario = jest.fn();
    component.formularioPago = component.formularioPago || {};
    component.formularioPago.disable = jest.fn();
    component.formularioPago.enable = jest.fn();
    component.formularioPago.get = jest.fn();
    component.guardarDatosFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
  });

  it('should run #inicializarFormulario()', async () => {
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({});
    component.formularioPagoStore = component.formularioPagoStore || {};
    component.formularioPagoStore.exentoPago = 'exentoPago';
    component.formularioPagoStore.justificacion = 'justificacion';
    component.formularioPagoStore.claveReferencia = 'claveReferencia';
    component.formularioPagoStore.cadenaDependencia = 'cadenaDependencia';
    component.formularioPagoStore.banco = 'banco';
    component.formularioPagoStore.llavePago = 'llavePago';
    component.formularioPagoStore.fechaPago = 'fechaPago';
    component.formularioPagoStore.importePago = 'importePago';
    component.fb = component.fb || {};
    component.fb.group = jest.fn().mockReturnValue({
      statusChanges: observableOf({}),
      patchValue: jest.fn(),
      get: jest.fn(),
      value: {},
      valid: true,
      disable: jest.fn(),
      enable: jest.fn()
    });
    component.inicializarFormulario();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #actualizarEstadoSeccion()', async () => {
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.getValue = jest.fn().mockReturnValue({
      formaValida: [false, false] 
    });
    component.formularioPago = component.formularioPago || {};
    component.formularioPago.valid = 'valid';
    component.seccionStore = component.seccionStore || {};
    component.seccionStore.establecerFormaValida = jest.fn();
    component.actualizarEstadoSeccion();
      expect(component.seccionQuery.getValue).toHaveBeenCalled();
      expect(component.seccionStore.establecerFormaValida).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({});
    component.formularioPago = component.formularioPago || {};
    component.formularioPago.statusChanges = observableOf({});
    component.formularioPago.patchValue = jest.fn();
    component.formularioPago.value = 'value';
    component.formularioPago.get = jest.fn().mockReturnValue({
      status: {}
    });
    component.formularioPago.valid = 'valid';
    component.verificarEstadoDelBoton = jest.fn();
    component.obtenerListaJustificacion = jest.fn();
    component.obtenerListaBanco = jest.fn();
    component.inicializarEstadoFormulario = jest.fn();
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setInternaPagoDeDerechosTramite = jest.fn();
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.seccionQuery.getValue = jest.fn();
    component.seccionStore = component.seccionStore || {};
    component.seccionStore.establecerFormaValida = jest.fn();
    component.ngOnInit();
      expect(component.formularioPago.patchValue).toHaveBeenCalled();
      expect(component.obtenerListaJustificacion).toHaveBeenCalled();
      expect(component.obtenerListaBanco).toHaveBeenCalled();
      expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #cambioFechaFinal()', async () => {
    component.formularioPago = component.formularioPago || {};
    component.formularioPago.patchValue = jest.fn();
    component.cambioFechaFinal({});
    expect(component.formularioPago.patchValue).toHaveBeenCalled();
  });

  it('should run #obtenerListaBanco()', async () => {
    component.importacionAcuiculturaServicio = component.importacionAcuiculturaServicio || {};
    component.importacionAcuiculturaServicio.obtenerDetallesDelCatalogo = jest.fn().mockReturnValue(observableOf({}));
    component.obtenerListaBanco();
    expect(component.importacionAcuiculturaServicio.obtenerDetallesDelCatalogo).toHaveBeenCalled();
  });

  it('should run #verificarEstadoDelBoton()', async () => {
    component.formularioPago = component.formularioPago || {};
    component.formularioPago.valid = 'valid';
    component.importacionAcuiculturaServicio = component.importacionAcuiculturaServicio || {};
    component.importacionAcuiculturaServicio.actualizarFormaValida = jest.fn();
    component.verificarEstadoDelBoton();
    expect(component.importacionAcuiculturaServicio.actualizarFormaValida).toHaveBeenCalled();
  });

  it('should run #obtenerListaJustificacion()', async () => {
    component.importacionAcuiculturaServicio = component.importacionAcuiculturaServicio || {};
    component.importacionAcuiculturaServicio.obtenerDetallesDelCatalogo = jest.fn().mockReturnValue(observableOf({}));
    component.obtenerListaJustificacion();
    expect(component.importacionAcuiculturaServicio.obtenerDetallesDelCatalogo).toHaveBeenCalled();
  });

  it('should run #setValoresStore()', async () => {
    component.actualizarValorAleatorio = jest.fn();
    component.formularioPago = component.formularioPago || {};
    component.formularioPago.value = 'value';
    component.importacionAcuiculturaServicio = component.importacionAcuiculturaServicio || {};
    component.importacionAcuiculturaServicio.actualizarFormularioPago = jest.fn();
    component.setValoresStore({}, {});
      expect(component.actualizarValorAleatorio).toHaveBeenCalled();
      expect(component.importacionAcuiculturaServicio.actualizarFormularioPago).toHaveBeenCalled();
  });

  it('should run #actualizarValorAleatorio()', async () => {
    component.formularioPago = component.formularioPago || {};
    component.formularioPago.value = {
      justificacion: 'some value',
      banco: ''
    };
    component.formularioPago.patchValue = jest.fn();
    component.formularioPagoStore = component.formularioPagoStore || {};
    component.formularioPagoStore.exentoPago = 'Si';
    component.actualizarValorAleatorio();
    expect(component.formularioPago.patchValue).toHaveBeenCalled();
  });

  it('should run #formatearFecha()', async () => {

    component.formatearFecha({
      getDate: function() {
        return {
          toString: function() {
            return {
              padStart: function() {}
            };
          }
        };
      },
      getMonth: function() {},
      getFullYear: function() {}
    });

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