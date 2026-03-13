// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TipoDeAvisoComponent } from './tipoDeAviso.component';
import { FormBuilder } from '@angular/forms';
import { Solicitud32301Service } from '../../services/solicitud.service';
import { Tramite33302Store } from '../../estados/tramite33302.store';
import { Tramite33302Query } from '../../estados/tramite33302.query';

@Injectable()
class MockSolicitud32301Service {}

@Injectable()
class MockTramite33302Store {}

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

describe('TipoDeAvisoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, TipoDeAvisoComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Solicitud32301Service, useClass: MockSolicitud32301Service },
        { provide: Tramite33302Store, useClass: MockTramite33302Store },
        { provide: Tramite33302Query, useClass: MockTramite33302Query }
      ]
    }).overrideComponent(TipoDeAvisoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TipoDeAvisoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('debería ejecutar #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('debería ejecutar #ngOnInit()', async () => {
    component.inicializamiFormulario = jest.fn();
    component.Tramite32301Query = component.Tramite32301Query || {};
    component.Tramite32301Query.select = jest.fn().mockReturnValue(observableOf({}));
    component.crearFormMiFormulario = jest.fn();
    component.miFormulario = component.miFormulario || {};
    component.miFormulario.disable = jest.fn();
    component.ngOnInit();
  });

  it('debería ejecutar #inicializamiFormulario()', async () => {
    component.AvisoModifyService = component.AvisoModifyService || {};
    component.AvisoModifyService.getAvisoModify = jest.fn().mockReturnValue(observableOf({}));
    component.store = component.store || {};
    component.store.setModalidadCertificacion = jest.fn();
    component.inicializamiFormulario();
  });

  it('debería ejecutar #crearFormMiFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.tipoDevAviso = component.tipoDevAviso || {};
    component.tipoDevAviso.modalidadCertificacion = 'modalidadCertificacion';
    component.tipoDevAviso.foreignClientsSuppliers = 'foreignClientsSuppliers';
    component.tipoDevAviso.nationalSuppliers = 'nationalSuppliers';
    component.tipoDevAviso.modificationsMembers = 'modificationsMembers';
    component.tipoDevAviso.changesToLegalDocuments = 'changesToLegalDocuments';
    component.tipoDevAviso.mergerOrSplitNotice = 'mergerOrSplitNotice';
    component.tipoDevAviso.additionFractions = 'additionFractions';
    component.tipoDevAviso.acepto253 = 'acepto253';
    component.tipoDevAviso.presenten = 'presenten';
    component.tipoDevAviso.contratados = 'contratados';
    component.tipoDevAviso.expirado = 'expirado';
    component.tipoDevAviso.derechos = 'derechos';
    component.crearFormMiFormulario();
  });

  it('debería ejecutar #aiEnviar()', async () => {
    component.tabEnabledData = component.tabEnabledData || {};
    component.tabEnabledData.emit = jest.fn();
    component.miFormulario = component.miFormulario || {};
    component.miFormulario.value = 'value';
    component.aiEnviar();
  });

  it('debería ejecutar #setClientesProveedoresExtranjeros()', async () => {
    component.miFormulario = component.miFormulario || {};
    component.miFormulario.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.store = component.store || {};
    component.store.actualizarEstado = jest.fn();
    component.setClientesProveedoresExtranjeros();
  });

  it('debería ejecutar #setProveedoresNacionales()', async () => {
    component.miFormulario = component.miFormulario || {};
    component.miFormulario.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.store = component.store || {};
    component.store.actualizarEstado = jest.fn();
    component.setProveedoresNacionales();
  });

  it('debería ejecutar #setModificacionesMiembros()', async () => {
    component.miFormulario = component.miFormulario || {};
    component.miFormulario.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.store = component.store || {};
    component.store.actualizarEstado = jest.fn();
    component.setModificacionesMiembros();
  });

  it('debería ejecutar #setCambiosDocumentosLegales()', async () => {
    component.miFormulario = component.miFormulario || {};
    component.miFormulario.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.store = component.store || {};
    component.store.actualizarEstado = jest.fn();
    component.setCambiosDocumentosLegales();
  });

  it('debería ejecutar #setNotifiFusionOescision()', async () => {
    component.miFormulario = component.miFormulario || {};
    component.miFormulario.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.store = component.store || {};
    component.store.actualizarEstado = jest.fn();
    component.setNotifiFusionOescision();
  });

  it('debería ejecutar #setAdicionalesFractions()', async () => {
    component.miFormulario = component.miFormulario || {};
    component.miFormulario.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.store = component.store || {};
    component.store.actualizarEstado = jest.fn();
    component.setAdicionalesFractions();
  });

  it('debería ejecutar #setPresenten()', async () => {
    component.miFormulario = component.miFormulario || {};
    component.miFormulario.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.store = component.store || {};
    component.store.actualizarEstado = jest.fn();
    component.setPresenten();
  });

  it('debería ejecutar #setContratados()', async () => {
    component.miFormulario = component.miFormulario || {};
    component.miFormulario.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.store = component.store || {};
    component.store.actualizarEstado = jest.fn();
    component.setContratados();
  });

  it('debería ejecutar #setExpirado()', async () => {
    component.miFormulario = component.miFormulario || {};
    component.miFormulario.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.store = component.store || {};
    component.store.actualizarEstado = jest.fn();
    component.setExpirado();
  });

  it('debería ejecutar #setDerechos()', async () => {
    component.miFormulario = component.miFormulario || {};
    component.miFormulario.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.store = component.store || {};
    component.store.actualizarEstado = jest.fn();
    component.setDerechos();
  });

  it('debería ejecutar #setAceptacion253()', async () => {
    component.miFormulario = component.miFormulario || {};
    component.miFormulario.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.store = component.store || {};
    component.store.actualizarEstado = jest.fn();
    component.setAceptacion253();
  });

  it('debería ejecutar #handleValores()', async () => {
    component.tabEnabledData = component.tabEnabledData || {};
    component.tabEnabledData.emit = jest.fn();
    component.handleValores();
  });

  it('debería ejecutar #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
  });
});