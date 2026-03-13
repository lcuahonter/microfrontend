// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PagoDerechosComponent } from './pago-derechos.component';
import { FormBuilder } from '@angular/forms';
import { Tramite33302Store } from '../../estados/tramite33302.store';
import { Solicitud32301Service } from '../../services/solicitud.service';
import { Tramite33302Query } from '../../estados/tramite33302.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientModule } from '@angular/common/http';

@Injectable()
class MockTramite33302Store {}

@Injectable()
class MockSolicitud32301Service {}

@Injectable()
class MockTramite33302Query {}

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

describe('PagoDerechosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, PagoDerechosComponent, HttpClientModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Tramite33302Store, useClass: MockTramite33302Store },
        { provide: Solicitud32301Service, useClass: MockSolicitud32301Service },
        { provide: Tramite33302Query, useClass: MockTramite33302Query },
        ConsultaioQuery
      ]
    }).overrideComponent(PagoDerechosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PagoDerechosComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('debería ejecutar #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('debería ejecutar #cambioFechaDePago()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.actualizarEstado = jest.fn();
    component.cambioFechaDePago({});
  });

  it('debería ejecutar #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.iniciarFormulario = jest.fn();
    component.inicializarEstadoFormulario();
  });

  it('debería ejecutar #ngOnInit()', async () => {
    component.obtenerBancoList = jest.fn();
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectTramite33302$ = observableOf({});
    component.pagosDerechosForm = component.pagosDerechosForm || {};
    component.pagosDerechosForm.patchValue = jest.fn();
    component.ngOnInit();
  });

  it('debería ejecutar #setValoresStore()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.actualizarEstado = jest.fn();
    component.pagosDerechosForm = component.pagosDerechosForm || {};
    component.pagosDerechosForm.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.setValoresStore({});
  });

  it('debería ejecutar #guardarDatosFormulario()', async () => {
    component.iniciarFormulario = jest.fn();
    component.pagosDerechosForm = component.pagosDerechosForm || {};
    component.pagosDerechosForm.disable = jest.fn();
    component.pagosDerechosForm.enable = jest.fn();
    component.guardarDatosFormulario();
  });

  it('debería ejecutar #iniciarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.claveDeReferencia = 'claveDeReferencia';
    component.tramiteState.numeroDe = 'numeroDe';
    component.tramiteState.banco = 'banco';
    component.tramiteState.llaveDePago = 'llaveDePago';
    component.tramiteState.fechaDePago = 'fechaDePago';
    component.tramiteState.importeDePago = 'importeDePago';
    component.tramiteState.cadenaDependencia = 'cadenaDependencia';
    component.iniciarFormulario();
  });

  it('debería ejecutar #obtenerBancoList()', async () => {
    component.solicitudService = component.solicitudService || {};
    component.solicitudService.onBancoList = jest.fn().mockReturnValue(observableOf({}));
    component.obtenerBancoList();
  });

  it('debería ejecutar #borrarDatosDelPago()', async () => {
    component.pagosDerechosForm = component.pagosDerechosForm || {};
    component.pagosDerechosForm.reset = jest.fn();
    component.borrarDatosDelPago();
  });

  it('debería ejecutar #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.unsubscribe = jest.fn();
    component.ngOnDestroy();
  });
});