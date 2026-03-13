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
import { FitosanitarioService } from '../../service/fitosanitario.service';
import { TramiteStoreQuery } from '../../estados/tramite220702.query';
import { TramiteStore } from '../../estados/tramite220702.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

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

describe('PagoDerechosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ,PagoDerechosComponent,],
      declarations: [
        
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: FitosanitarioService, useClass: MockFitosanitarioService },
        { provide: TramiteStoreQuery, useClass: MockTramiteStoreQuery },
        { provide: TramiteStore, useClass: MockTramiteStore },
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

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #cambiarRadio()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setExentoDePago = jest.fn();
    component.cambiarRadio({}, {});
    // expect(component.tramiteStore.setExentoDePago).toHaveBeenCalled();
  });

  it('should run #cambioFechaDePago()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setFechaDePago = jest.fn();
    component.cambioFechaDePago({});
    
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.iniciarFormulario = jest.fn();
    component.inicializarEstadoFormulario();
    
  });

  it('should run #ngOnInit()', async () => {
    component.iniciarFormulario = jest.fn();
    component.pagoDeCargarDatos = jest.fn();
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({});
    component.pagosDerechosForm = component.pagosDerechosForm || {};
    component.pagosDerechosForm.patchValue = jest.fn();
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.getPuntoDeInspeccion = jest.fn().mockReturnValue(observableOf({}));
    component.fitosanitarioService.getPagoJustificacion = jest.fn().mockReturnValue(observableOf({}));
    component.ngOnInit();
    
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.iniciarFormulario = jest.fn();
    component.pagosDerechosForm = component.pagosDerechosForm || {};
    component.pagosDerechosForm.disable = jest.fn();
    component.pagosDerechosForm.enable = jest.fn();
    component.guardarDatosFormulario();
    
  });

  it('should run #iniciarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.claveDeReferenciaDerechos = 'claveDeReferenciaDerechos';
    component.tramiteState.cadenaDependenciaDerechos = 'cadenaDependenciaDerechos';
    component.tramiteState.bancoDerechos = 'bancoDerechos';
    component.tramiteState.llaveDePagoDerechos = 'llaveDePagoDerechos';
    component.tramiteState.fechaDePago = 'fechaDePago';
    component.tramiteState.importeDePagoDerechos = 'importeDePagoDerechos';
    component.tramiteState.exentoDePago = 'exentoDePago';
    component.iniciarFormulario();
    
  });

  it('should run #pagoDeCargarDatos()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.pagoDeCargarDatos = jest.fn().mockReturnValue(observableOf({
      data: {
        claveDeReferencia: {},
        cadenaDependencia: {},
        banco: {},
        llaveDePago: {},
        fechaInicio: {},
        importeDePago: {}
      }
    }));
    component.pagosDerechosForm = component.pagosDerechosForm || {};
    component.pagosDerechosForm.patchValue = jest.fn();
    component.pagoDeCargarDatos();
   
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.unsubscribe = jest.fn();
    component.ngOnDestroy();
  });

});