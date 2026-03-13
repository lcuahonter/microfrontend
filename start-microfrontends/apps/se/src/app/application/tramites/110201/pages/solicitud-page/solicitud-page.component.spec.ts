// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitudPageComponent } from '../solicitud-page/solicitud-page.component';
import { Tramites110201Store } from '../../state/tramites110201.store';
import { Tramites110201Query } from '../../state/tramites110201.query';
import { Solocitud110201Service } from '../../services/service110201.service';

@Injectable()
class MockTramites110201Store {}

@Injectable()
class MockTramite110201Query {
  selectSolicitud$ = observableOf({});
}

@Injectable()
class MockSolocitud110201Service {
  guardarDatosPost() {
    return observableOf({});
  }
  buildCertificado() {}
  buildDatosCertificado() {}
  buildDestinatario() {}
  buildDetallesCertificado() {}
  getAllState() {
    return observableOf({});
  }
}


describe('SolicitudPageComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        SolicitudPageComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramites110201Store, useClass: MockTramites110201Store },
        { provide: Tramites110201Query, useClass: MockTramite110201Query },
        { provide: Solocitud110201Service, useClass: MockSolocitud110201Service }
      ]
    }).overrideComponent(SolicitudPageComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.selectSolicitud$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #getValorIndice()', async () => {
    component.datosPasos = component.datosPasos || {};
    component.datosPasos.indice = 'indice';
    component.validarTodosFormulariosPasoUno = jest.fn();
    component.obtenerDatosDelStore = jest.fn();
    component.pasos = component.pasos || {};
    component.pasoNavegarPor = jest.fn();
    component.getValorIndice({
      accion: {},
      valor: {}
    });
  });

  it('should run #obtenerDatosDelStore()', async () => {
    component.Solocitud110201Service = component.Solocitud110201Service || {};
    component.Solocitud110201Service.getAllState = jest.fn().mockReturnValue(observableOf({}));
    component.guardar = jest.fn();
    component.obtenerDatosDelStore();
  });

  it('should run #guardar()', async () => {
    component.Solocitud110201Service = component.Solocitud110201Service || {};
    component.Solocitud110201Service.buildCertificado = jest.fn();
    component.Solocitud110201Service.buildDatosCertificado = jest.fn();
    component.Solocitud110201Service.buildDestinatario = jest.fn();
    component.Solocitud110201Service.guardarDatosPost = jest.fn().mockReturnValue(observableOf({}));
    component.solicitudState = component.solicitudState || {};
    component.solicitudState.idSolicitud = 'idSolicitud';
    component.store = component.store || {};
    component.store.setIdSolicitud = jest.fn();
    component.pasoNavegarPor = jest.fn();
    component.guardar({});
  });

  it('should run #pasoNavegarPor()', async () => {
    component.datosPasos = component.datosPasos || {};
    component.datosPasos.indice = 'indice';
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.pasoNavegarPor({
      valor: {},
      accion: {}
    });
  });

  it('should run #validarTodosFormulariosPasoUno()', async () => {
    component.pasoUnoComponent = component.pasoUnoComponent || {};
    component.pasoUnoComponent.validateAll = jest.fn();
    component.validarTodosFormulariosPasoUno();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

});