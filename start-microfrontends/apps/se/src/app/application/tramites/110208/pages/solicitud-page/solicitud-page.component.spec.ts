// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitudPageComponent } from './solicitud-page.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Solocitud110208Service } from '../../services/service110208.service';
import { Tramite110208Store } from '../../../../estados/tramites/tramite110208.store';
import { Tramite110208Query } from '../../../../estados/queries/tramite110208.query';

@Injectable()
class MockSolocitud110208Service {
  getRegistroTomaMuestrasMercanciasData() {
    return observableOf({});
  }
  actualizarEstadoFormulario() {
    return observableOf({});
  }
  buildCertificado() {}
  buildDatosCertificado() {}
  buildDestinatario() {}
  guardarDatosPost() {
    return observableOf({});
  }
}

@Injectable()
class MockTramite110208Store {
  setIdSolicitud() {}
  setSolicitud() {}
  setEstado() {}
}

@Injectable()
class MockTramite110208Query {
  selectSolicitud$ = observableOf({});
  selectEstado$ = observableOf({});
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
        ConsultaioQuery,
        { provide: Solocitud110208Service, useClass: MockSolocitud110208Service },
        { provide: Tramite110208Store, useClass: MockTramite110208Store },
        { provide: Tramite110208Query, useClass: MockTramite110208Query }
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
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.guardarDatosFormulario = jest.fn();
    component.ngOnInit();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.solocitud110208Service = component.solocitud110208Service || {};
    component.solocitud110208Service.getRegistroTomaMuestrasMercanciasData = jest.fn().mockReturnValue(observableOf({}));
    component.solocitud110208Service.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
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
    component.solocitud110208Service = component.solocitud110208Service || {};
    component.solocitud110208Service.getAllState = jest.fn().mockReturnValue(observableOf({}));
    component.guardar = jest.fn();
    component.obtenerDatosDelStore();
  });

  it('should run #guardar()', async () => {
    component.solocitud110208Service = component.solocitud110208Service || {};
    component.solocitud110208Service.buildCertificado = jest.fn();
    component.solocitud110208Service.buildDatosCertificado = jest.fn();
    component.solocitud110208Service.buildDestinatario = jest.fn();
    component.solocitud110208Service.guardarDatosPost = jest.fn().mockReturnValue(observableOf({}));
    component.solicitudState = component.solicitudState || {};
    component.solicitudState.idSolicitud = 'idSolicitud';
    component.tramite110208Store = component.tramite110208Store || {};
    component.tramite110208Store.setIdSolicitud = jest.fn();
    component.pasoNavegarPor = jest.fn();
    component.guardar({});
  });

  it('should run #pasoNavegarPor()', async () => {
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