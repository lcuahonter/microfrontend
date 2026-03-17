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
import { AcuicolaService } from '../../service/acuicola.service';
import { TramiteStoreQuery } from '../../estados/tramite220703.query';
import { TramiteStore } from '../../estados/tramite220703.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockAcuicolaService {}

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
      imports: [ FormsModule, ReactiveFormsModule, PagoDeDerechosComponent, ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: AcuicolaService, useClass: MockAcuicolaService },
        { provide: TramiteStoreQuery, useClass: MockTramiteStoreQuery },
        { provide: TramiteStore, useClass: MockTramiteStore },
        ConsultaioQuery
      ]
    }).overrideComponent(PagoDeDerechosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.getBancoDatos = jest.fn();
    component.pagoDeCargarDatos = jest.fn();
    component.pagoDerechosRevision = jest.fn();
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({});
    component.pagosDeDerechosForm = component.pagosDeDerechosForm || {};
    component.pagosDeDerechosForm.patchValue = jest.fn();
    component.ngOnInit();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
    expect(component.getBancoDatos).toHaveBeenCalled();
    expect(component.pagoDeCargarDatos).toHaveBeenCalled();
    expect(component.pagoDerechosRevision).toHaveBeenCalled();
    expect(component.pagosDeDerechosForm.patchValue).toHaveBeenCalled();
  });

  it('should run #iniciarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
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
    component.iniciarFormulario();
    expect(component.fb.group).toHaveBeenCalled();
  });
  it('should run #inicializarEstadoFormulario() when esFormularioSoloLectura is false', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.iniciarFormulario = jest.fn();
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.guardarDatosFormulario).not.toHaveBeenCalled();
    expect(component.iniciarFormulario).toHaveBeenCalled();
  });

  it('should run #inicializarEstadoFormulario() when esFormularioSoloLectura is true', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.iniciarFormulario = jest.fn();
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
    expect(component.iniciarFormulario).not.toHaveBeenCalled();
  });
  it('should run #guardarDatosFormulario() when esFormularioSoloLectura is false', async () => {
    component.iniciarFormulario = jest.fn();
    component.pagosDeDerechosForm = component.pagosDeDerechosForm || {};
    component.pagosDeDerechosForm.disable = jest.fn();
    component.pagosDeDerechosForm.enable = jest.fn();
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.iniciarFormulario).toHaveBeenCalled();
    expect(component.pagosDeDerechosForm.disable).not.toHaveBeenCalled();
    expect(component.pagosDeDerechosForm.enable).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario() when esFormularioSoloLectura is true', async () => {
    component.iniciarFormulario = jest.fn();
    component.pagosDeDerechosForm = component.pagosDeDerechosForm || {};
    component.pagosDeDerechosForm.disable = jest.fn();
    component.pagosDeDerechosForm.enable = jest.fn();
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.iniciarFormulario).toHaveBeenCalled();
    expect(component.pagosDeDerechosForm.disable).toHaveBeenCalled();
    expect(component.pagosDeDerechosForm.enable).not.toHaveBeenCalled();
  });

  it('should run #selectBancoCatalogo()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setBanco = jest.fn();
    component.selectBancoCatalogo({
      id: {}
    });
    expect(component.tramiteStore.setBanco).toHaveBeenCalled();
  });

  it('should run #cambioFechaPagoDeDerechos()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setFechaPagoDeDerechos = jest.fn();
    component.cambioFechaPagoDeDerechos({});
    expect(component.tramiteStore.setFechaPagoDeDerechos).toHaveBeenCalled();
  });

  it('should run #cambioFechaPagoDeDerechosRevision()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setFechaPagoDeDerechosRevision = jest.fn();
    component.cambioFechaPagoDeDerechosRevision({});
    expect(component.tramiteStore.setFechaPagoDeDerechosRevision).toHaveBeenCalled();
  });

  it('should run #setllaveDePago()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setLlaveDePago = jest.fn();
    component.setllaveDePago({
      target: {
        value: {}
      }
    });
    expect(component.tramiteStore.setLlaveDePago).toHaveBeenCalled();
  });

  it('should run #pagoDeCargarDatos()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.pagoDeCargarDatos = jest.fn().mockReturnValue(observableOf({
      claveDeReferencia: {},
      cadenaDependencia: {},
      importeDePago: {}
    }));
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setClaveDeReferencia = jest.fn();
    component.tramiteStore.setCadenaDependencia = jest.fn();
    component.tramiteStore.setImporteDePago = jest.fn();
    component.pagoDeCargarDatos();
    expect(component.acuicolaService.pagoDeCargarDatos).toHaveBeenCalled();
    expect(component.tramiteStore.setClaveDeReferencia).toHaveBeenCalled();
    expect(component.tramiteStore.setCadenaDependencia).toHaveBeenCalled();
    expect(component.tramiteStore.setImporteDePago).toHaveBeenCalled();
  });

  it('should run #getBancoDatos()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.getBancoDatos = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getBancoDatos();
    expect(component.acuicolaService.getBancoDatos).toHaveBeenCalled();
  });

  it('should run #pagoDerechosRevision()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.getPagoDerechosRevision = jest.fn().mockReturnValue(observableOf({}));
    component.pagosDeDerechosForm = component.pagosDeDerechosForm || {};
    component.pagosDeDerechosForm.patchValue = jest.fn();
    component.pagoDerechosRevision();
    expect(component.acuicolaService.getPagoDerechosRevision).toHaveBeenCalled();
    expect(component.pagosDeDerechosForm.patchValue).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.unsubscribe = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.unsubscribe).toHaveBeenCalled();
  });

});