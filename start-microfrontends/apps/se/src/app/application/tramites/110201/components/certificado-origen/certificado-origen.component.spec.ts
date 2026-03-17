// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { CertificadoOrigenComponent } from './certificado-origen.component';
import { FormBuilder } from '@angular/forms';
import { Solocitud110201Service } from '../../services/service110201.service';
import { Tramites110201Store } from '../../state/tramites110201.store';
import { Tramites110201Query } from '../../state/tramites110201.query'
import { SeccionLibQuery } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockSolocitud110201Service {
  buscarMercanciasCert = jest.fn().mockReturnValue(observableOf({}));
  crearMercanciaCert = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockTramite110201Store {
  setFormCertificadoGenric = jest.fn();
  setDisponsiblesDatos = jest.fn()
  setEstado = jest.fn();
  setBloque = jest.fn()
  setFormMercancia = jest.fn();
  setmercanciaTabla = jest.fn();
  setFormValida = jest.fn();
     _select = jest.fn().mockReturnValue(observableOf({}));
  select = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockTramite110201Query {
  selectSolicitud$ = observableOf({});
  formCertificado$ = observableOf({});
  actualizarEstadoFormulario = jest.fn();
}

describe('CertificadoOrigenComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,CertificadoOrigenComponent,HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Solocitud110201Service, useClass: MockSolocitud110201Service },
        { provide: Tramites110201Store, useClass: MockTramite110201Store },
        { provide: Tramites110201Query, useClass: MockTramite110201Query },
        SeccionLibQuery,
        ConsultaioQuery
      ]
    }).overrideComponent(CertificadoOrigenComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(CertificadoOrigenComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.query = component.query || {};
    component.query.selectSolicitud$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #setValoresStore()', async () => {
    component.store = component.store || {};
    component.store.setFormCertificadoGenric = jest.fn();
    component.setValoresStore({});
  });

  it('should run #conseguirDisponiblesDatos()', async () => {
    component.certificadoState = component.certificadoState || {};
    component.certificadoState.formCertificado = {
      'entidadFederativa': {},
      'bloque': {}
    };
    component.solicitudService = component.solicitudService || {};
    component.solicitudService.buscarMercanciasCert = jest.fn().mockReturnValue(observableOf({}));
    component.store = component.store || {};
    component.store.setDisponsiblesDatos = jest.fn();
    component.conseguirDisponiblesDatos();
  });

  it('should run #tipoEstadoSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setEstado = jest.fn();
    component.tipoEstadoSeleccion({});
  });

  it('should run #tipoSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setBloque = jest.fn();
    component.tipoSeleccion({
      descripcion: {}
    });
  });

  it('should run #abrirModificarModal()', async () => {
    component.store = component.store || {};
    component.store.setFormMercancia = jest.fn();
    component.modalInstance = component.modalInstance || {};
    component.modalInstance.show = jest.fn();
    component.abrirModificarModal({}, {});
  });

  it('should run #cerrarModificarModal()', async () => {
    component.modalInstance = component.modalInstance || {};
    component.modalInstance.hide = jest.fn();
    component.cerrarModificarModal();
  });

  it('should run #emitmercaniasDatos()', async () => {
    component.store = component.store || {};
    component.store.setmercanciaTabla = jest.fn();
    component.emitmercaniasDatos({});
  });
  it('should run #setFormValida()', async () => {
    component.store = component.store || {};
    component.store.setFormValida = jest.fn();
    component.setFormValida({});
  });

  it('should run #guardarClicado()', async () => {

    component.guardarClicado({});

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

});