// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite110212Store } from '../../../../estados/tramites/tramite110212.store';
import { Tramite110212Query } from '../../../../estados/queries/tramite110212.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ValidacionPosterioriService } from '../../service/validacion-posteriori.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite110212Store {}

@Injectable()
class MockTramite110212Query {}

@Injectable()
class MockValidacionPosterioriService {}

describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,PasoUnoComponent,HttpClientTestingModule ],

      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite110212Store, useClass: MockTramite110212Store },
        { provide: Tramite110212Query, useClass: MockTramite110212Query },
        ConsultaioQuery,
        { provide: ValidacionPosterioriService, useClass: MockValidacionPosterioriService }
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
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
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.selectSolicitud$ = observableOf({});
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.fetchGetDatosConsulta = jest.fn();
    component.ngOnInit();
  });

  it('should run #validateAllForms()', async () => {
    component.destinatarioTramiteComponent = component.destinatarioTramiteComponent || {};
    component.destinatarioTramiteComponent.validateAllForms = jest.fn();
    component.validateAllForms();
  });

  it('should run #seleccionaTab()', async () => {
    component.store = component.store || {};
    component.store.setPestanaActiva = jest.fn();
    component.cambioDePestana = component.cambioDePestana || {};
    component.cambioDePestana.emit = jest.fn();
    component.seleccionaTab({}, {});
    expect(component.store.setPestanaActiva).toHaveBeenCalled();
    expect(component.cambioDePestana.emit).toHaveBeenCalled();
  });

  it('should run #fetchGetDatosConsulta()', async () => {
    component.validacionPosterioriService = component.validacionPosterioriService || {};
    component.validacionPosterioriService.getDatosConsulta = jest.fn().mockReturnValue(observableOf({
      success: {},
      datos: {
        tercerOperador: {},
        grupoOperador: {},
        grupoTratado: {},
        mercanciaDisponsiblesTablaDatos: {},
        observaciones: {},
        idioma: {},
        entidadFederativa: {},
        representacionFederal: {},
        grupoReceptor: {},
        grupoDeDirecciones: {},
        grupoRepresentativo: {}
      }
    }));
    component.store = component.store || {};
    component.store.setTercerOperador = jest.fn();
    component.store.setGrupoOperador = jest.fn();
    component.store.setGrupoTratado = jest.fn();
    component.store.setMercanciaDisponsiblesTablaDatos = jest.fn();
    component.store.setObservaciones = jest.fn();
    component.store.setIdioma = jest.fn();
    component.store.setEntidadFederativa = jest.fn();
    component.store.setRepresentacionFederal = jest.fn();
    component.store.setGrupoReceptor = jest.fn();
    component.store.setGrupoDeDirecciones = jest.fn();
    component.store.setGrupoRepresentativo = jest.fn();
    component.fetchGetDatosConsulta();
    expect(component.validacionPosterioriService.getDatosConsulta).toHaveBeenCalled();
    expect(component.store.setTercerOperador).toHaveBeenCalled();
    expect(component.store.setGrupoOperador).toHaveBeenCalled();
    expect(component.store.setGrupoTratado).toHaveBeenCalled();
    expect(component.store.setMercanciaDisponsiblesTablaDatos).toHaveBeenCalled();
    expect(component.store.setObservaciones).toHaveBeenCalled();
    expect(component.store.setIdioma).toHaveBeenCalled();
    expect(component.store.setEntidadFederativa).toHaveBeenCalled();
    expect(component.store.setRepresentacionFederal).toHaveBeenCalled();
    expect(component.store.setGrupoReceptor).toHaveBeenCalled();
    expect(component.store.setGrupoDeDirecciones).toHaveBeenCalled();
    expect(component.store.setGrupoRepresentativo).toHaveBeenCalled();
  });

  it('should run #validarTodosLosFormularios()', async () => {
    component.destinatarioComp = component.destinatarioComp || {};
    component.destinatarioComp.registroFormulario = {
      markAllAsTouched: function() {},
      valid: {}
    };
    component.datosCertificadoComp = component.datosCertificadoComp || {};
    component.datosCertificadoComp.formDatosCertificado = {
      markAllAsTouched: function() {},
      valid: {}
    };
    component.validarTodosLosFormularios();

  });

  it('should run #validarFormularios()', async () => {
    component.solicitante = component.solicitante || {};
    component.solicitante.form = {
      invalid: {},
      markAllAsTouched: function() {}
    };
    component.certificadoOrigen = component.certificadoOrigen || {};
    component.certificadoOrigen.validarFormulario = jest.fn();
    component.destinatarioComp = component.destinatarioComp || {};
    component.destinatarioComp.validateAllForms = jest.fn();
    component.datosCertificadoComp = component.datosCertificadoComp || {};
    component.datosCertificadoComp.validateAll = jest.fn();
    component.validarFormularios();
    expect(component.certificadoOrigen.validarFormulario).toHaveBeenCalled();
    expect(component.destinatarioComp.validateAllForms).toHaveBeenCalled();
    expect(component.datosCertificadoComp.validateAll).toHaveBeenCalled();
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