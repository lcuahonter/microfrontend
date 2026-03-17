// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosComponent } from './datos.component';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { Tramite120201Store } from '../../../../estados/tramites/tramite120201.store';
import { Tramite120201Query } from '../../../../estados/queries/tramite120201.query';
import { CuposService } from '../../services/cupos/cupos.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite120201Store {
  setAsignacionOficioNumeroForm = function() {};
  setRepresentacionFederalForm = function() {};
  setControlMontosAsignacionForm = function() {};
  setAsignacionDatosForm = function() {};
  setCupoDescripcionForm = function() {};
  setDistribucionSaldoForm = function() {};
}

@Injectable()
class MockTramite120201Query {}

@Injectable()
class MockCuposService {}



describe('DatosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,HttpClientTestingModule ],
      declarations: [
        DatosComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        ConsultaioQuery,
        { provide: Tramite120201Store, useClass: MockTramite120201Store },
        { provide: Tramite120201Query, useClass: MockTramite120201Query },
        { provide: CuposService, useClass: MockCuposService }
      ]
    }).overrideComponent(DatosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.guardarDatosFormulario = jest.fn();
    component.tramite120201Query = component.tramite120201Query || {};
    component.tramite120201Query.selectSeccionState$ = observableOf({});
    component.ngOnInit();
  });

  it('should run #setValoresStore()', async () => {
    component.storeMethodMap = component.storeMethodMap || {};
    component.storeMethodMap.FORM_GROUP_NAME = 'FORM_GROUP_NAME';
    component.setValoresStore({});

  });

  it('should run #updateStoreValues()', async () => {
    component.tramite120201Store = component.tramite120201Store || {};
    component.tramite120201Store.SETTER_NAME = jest.fn();
    component.updateStoreValues({});
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.cuposService = component.cuposService || {};
    component.cuposService.getConsultaPersonaFisicaDatos = jest.fn().mockReturnValue(observableOf({}));
    component.guardarDatosFormulario();
    expect(component.cuposService.getConsultaPersonaFisicaDatos).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

  it('should run #mostrarErrorEvent()', async () => {
    component.mostrarErrorDirecto = component.mostrarErrorDirecto || {};
    component.mostrarErrorDirecto.emit = jest.fn();
    component.mostrarErrorEvent({});
    expect(component.mostrarErrorDirecto.emit).toHaveBeenCalled();
  });

  it('should run #mostrarNumFolioAsignacionErrorEvent()', async () => {
    component.mostrarNumFolioAsignacionErrorDirecto = component.mostrarNumFolioAsignacionErrorDirecto || {};
    component.mostrarNumFolioAsignacionErrorDirecto.emit = jest.fn();
    component.mostrarNumFolioAsignacionErrorEvent({});
    expect(component.mostrarNumFolioAsignacionErrorDirecto.emit).toHaveBeenCalled();
  });

  it('should run #validarFormularios()', async () => {
    component.solicitante = component.solicitante || {};
    component.solicitante.form = {
      invalid: {},
      markAllAsTouched: function() {}
    };
    component.expedicionCertificadosAsignacionDirectaComponent = component.expedicionCertificadosAsignacionDirectaComponent || {};
    component.expedicionCertificadosAsignacionDirectaComponent.validarFormulario = jest.fn();
    component.validarFormularios();
    expect(component.expedicionCertificadosAsignacionDirectaComponent.validarFormulario).toHaveBeenCalled();
  });

  it('should run #mostrarAgregarErrorEvento()', async () => {
    component.mostrarAgregarErrorDirecto = component.mostrarAgregarErrorDirecto || {};
    component.mostrarAgregarErrorDirecto.emit = jest.fn();
    component.mostrarAgregarErrorEvento({});
    expect(component.mostrarAgregarErrorDirecto.emit).toHaveBeenCalled();
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