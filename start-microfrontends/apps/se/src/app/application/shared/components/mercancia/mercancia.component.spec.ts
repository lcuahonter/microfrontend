// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { MercanciaComponent } from './mercancia.component';
import { FormBuilder } from '@angular/forms';
import { PeruCertificadoService } from '../../services/peru-certificado.service';
import { Tramite110205Store } from '../../estados/tramite110205.store';
import { Tramite110205Query } from '../../estados/tramite110205.query';
import { SeccionLibQuery, ConsultaioQuery } from '@libs/shared/data-access-user/src';

@Injectable()
class MockPeruCertificadoService {}

@Injectable()
class MockTramite110205Store {}

@Injectable()
class MockTramite110205Query {}

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

describe('MercanciaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        MercanciaComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: PeruCertificadoService, useClass: MockPeruCertificadoService },
        { provide: Tramite110205Store, useClass: MockTramite110205Store },
        { provide: Tramite110205Query, useClass: MockTramite110205Query },
        SeccionLibQuery,
        ConsultaioQuery
      ]
    }).overrideComponent(MercanciaComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(MercanciaComponent);
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
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.query = component.query || {};
    component.query.selectPeru$ = observableOf({});
    component.initActionFormBuild = jest.fn();
    component.umcOpcion = jest.fn();
    component.facturasOpcion = jest.fn();
    component.ngOnInit();
   
  });

  it('should run #initActionFormBuild()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.mercanciaState = component.mercanciaState || {};
    component.mercanciaState.mercanciaForm = {
      'fraccionArancelaria': {},
      'nombreComercialMercancia': {},
      'nombreTecnico': {},
      'nombreIngles': {},
      'otrasInstancias': {},
      'criterioParaConferirOrigen': {}
    };
    component.mercanciaState.cantidad = 'cantidad';
    component.mercanciaState.umc = 'umc';
    component.mercanciaState.valorMercancia = 'valorMercancia';
    component.mercanciaState.complementoDescripcion = 'complementoDescripcion';
    component.mercanciaState.numeroFactura = 'numeroFactura';
    component.mercanciaState.tipoFactura = 'tipoFactura';
    component.initActionFormBuild();
    
  });

  it('should run #cerrarModal()', async () => {
    component.cerrarClicado = component.cerrarClicado || {};
    component.cerrarClicado.emit = jest.fn();
    component.cerrarModal();
    
  });

  it('should run #activarModal()', async () => {
    component.abrirModal = jest.fn();
    component.activarModal();
    
  });

  it('should run #markAllFieldsAsTouched()', async () => {
    component.markAllFieldsAsTouched = jest.fn();
    component.markAllFieldsAsTouched({
      controls: {}
    });
    
  });

  it('should run #umcOpcion()', async () => {
    component.peruCertificadoService = component.peruCertificadoService || {};
    component.peruCertificadoService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.umcOpcion();
  });

  it('should run #facturasOpcion()', async () => {
    component.peruCertificadoService = component.peruCertificadoService || {};
    component.peruCertificadoService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.facturasOpcion();
   });

  it('should run #acceptar()', async () => {
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.valid = 'valid';
    component.mercanciaForm.value = 'value';
    component.guardarClicado = component.guardarClicado || {};
    component.guardarClicado.emit = jest.fn();
    component.store = component.store || {};
    component.store.setmercanciaTabla = jest.fn();
    component.cerrarModal = jest.fn();
    component.tablaSeleccionEvent = component.tablaSeleccionEvent || {};
    component.tablaSeleccionEvent.emit = jest.fn();
    component.markAllFieldsAsTouched = jest.fn();
    component.acceptar({});
    
  });

 

  it('should run #abrirModal()', async () => {

    component.abrirModal();

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
   
  });

});