// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitantePageComponent } from './solicitante-page.component';
import { Tramite110212Store } from '../../../../estados/tramites/tramite110212.store';
import { Tramite110212Query } from '../../../../estados/queries/tramite110212.query';
import { ValidacionPosterioriService } from '../../service/validacion-posteriori.service';

@Injectable()
class MockTramite110212Store {}

@Injectable()
class MockTramite110212Query {
  selectSolicitud$ = observableOf({});
}

@Injectable()
class MockValidacionPosterioriService {}


describe('SolicitantePageComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        SolicitantePageComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite110212Store, useClass: MockTramite110212Store },
        { provide: Tramite110212Query, useClass: MockTramite110212Query },
        { provide: ValidacionPosterioriService, useClass: MockValidacionPosterioriService }
      ]
    }).overrideComponent(SolicitantePageComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SolicitantePageComponent);
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
    component.validacionPosterioriService = component.validacionPosterioriService || {};
    component.validacionPosterioriService.getAllState = jest.fn().mockReturnValue(observableOf({}));
    component.guardar = jest.fn();
    component.obtenerDatosDelStore();
  });

  it('should run #guardar()', async () => {
    component.validacionPosterioriService = component.validacionPosterioriService || {};
    component.validacionPosterioriService.buildCertificado = jest.fn();
    component.validacionPosterioriService.buildDatosCertificado = jest.fn();
    component.validacionPosterioriService.buildDestinatario = jest.fn();
    component.validacionPosterioriService.guardarDatosPost = jest.fn().mockReturnValue(observableOf({}));
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
    component.pasoUnoComponent.validarFormularios = jest.fn();
    component.validarTodosFormulariosPasoUno();
  });

  it('should run #alCambiarPestana()', async () => {

    component.alCambiarPestana();

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

});