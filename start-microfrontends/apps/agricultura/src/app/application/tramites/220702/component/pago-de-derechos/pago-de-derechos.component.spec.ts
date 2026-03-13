// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { FormBuilder } from '@angular/forms';
import { FitosanitarioService } from '../../service/fitosanitario.service';
import { TramiteStoreQuery } from '../../estados/tramite220702.query';
import { TramiteStore } from '../../estados/tramite220702.store';

@Injectable()
class MockFitosanitarioService {}

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

describe('PagoDeDerechosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,PagoDeDerechosComponent, ],
      declarations: [
        
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: FitosanitarioService, useClass: MockFitosanitarioService },
        { provide: TramiteStoreQuery, useClass: MockTramiteStoreQuery },
        { provide: TramiteStore, useClass: MockTramiteStore }
      ]
    }).overrideComponent(PagoDeDerechosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #cambioFechaPagoDeDerechos()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setFechaPagoDeDerechos = jest.fn();
    component.cambioFechaPagoDeDerechos({});
     });

  it('should run #cambioFechaPagoDeDerechosRevision()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setFechaPagoDeDerechosRevision = jest.fn();
    component.cambioFechaPagoDeDerechosRevision({});
   });

  it('should run #ngOnInit()', async () => {
    component.iniciarFormulario = jest.fn();
    component.pagosDeDerechosForm = component.pagosDeDerechosForm || {};
    component.pagosDeDerechosForm.disable = jest.fn();
    component.getBancoDatos = jest.fn();
    component.pagoDeCargarDatos = jest.fn();
    component.pagoDerechosRevision = jest.fn();
    component.ngOnInit();
    });

  it('should run #iniciarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn().mockReturnValue({
      patchValue: function() {}
    });
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.claveDeReferencia = 'claveDeReferencia';
    component.tramiteState.cadenaDependencia = 'cadenaDependencia';
    component.tramiteState.banco = 'banco';
    component.tramiteState.llaveDePago = 'llaveDePago';
    component.tramiteState.fechaPagoDeDerechos = 'fechaPagoDeDerechos';
    component.tramiteState.importeDePago = 'importeDePago';
    component.tramiteState.claveDeReferenciaRevision = 'claveDeReferenciaRevision';
    component.tramiteState.cadenaDependenciaRevision = 'cadenaDependenciaRevision';
    component.tramiteState.bancoRevision = 'bancoRevision';
    component.tramiteState.llaveDePagoRevision = 'llaveDePagoRevision';
    component.tramiteState.fechaPagoDeDerechosRevision = 'fechaPagoDeDerechosRevision';
    component.tramiteState.importeDePagoRevision = 'importeDePagoRevision';
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({});
    component.iniciarFormulario();
  
  });

  it('should run #pagoDeCargarDatos()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.pagoDeCargarDatos = jest.fn().mockReturnValue(observableOf({
      data: {
        claveDeReferencia: {},
        cadenaDependencia: {},
        importeDePago: {}
      }
    }));
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setClaveDeReferencia = jest.fn();
    component.tramiteStore.setCadenaDependencia = jest.fn();
    component.tramiteStore.setImporteDePago = jest.fn();
    component.pagoDeCargarDatos();
    });

  it('should run #getBancoDatos()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.getBancoDatos = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getBancoDatos();
    });

  it('should run #pagoDerechosRevision()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.getPagoDerechosRevision = jest.fn().mockReturnValue(observableOf({
      data: {
        claveDeReferenciaRevision: {},
        cadenaDependenciaRevision: {},
        bancoRevision: {},
        llaveDePagoRevision: {},
        importeDePagoRevision: {}
      }
    }));
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setClaveDeReferenciaRevision = jest.fn();
    component.tramiteStore.setCadenaDependenciaRevision = jest.fn();
    component.tramiteStore.setBancoRevision = jest.fn();
    component.tramiteStore.setLlaveDePagoRevision = jest.fn();
    component.tramiteStore.setImporteDePagoRevision = jest.fn();
    component.pagoDerechosRevision();
    });

  it('should run #cambioClaveDeReferencia()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setClaveDeReferencia = jest.fn();
    component.cambioClaveDeReferencia({
      target: {
        value: {}
      }
    });
   });

  it('should run #setllaveDePago()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setLlaveDePago = jest.fn();
    component.setllaveDePago({
      target: {
        value: {}
      }
    });
    });

  it('should run #selectBancoCatalogo()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setBanco = jest.fn();
    component.selectBancoCatalogo({
      id: {}
    });
    });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.unsubscribe = jest.fn();
    component.ngOnDestroy();
    });

});