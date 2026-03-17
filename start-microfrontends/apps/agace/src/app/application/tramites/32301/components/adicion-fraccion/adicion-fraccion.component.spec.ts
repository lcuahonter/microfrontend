// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {  Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AdicionFraccionComponent } from './adicion-fraccion.component';
import { FormBuilder } from '@angular/forms';
import { AvisoModifyService } from '../../services/aviso-modify.service';
import { Tramite32301Store } from '../../estados/tramite32301.store';
import { Tramite32301Query } from '../../estados/tramite32301.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockAvisoModifyService {}

@Injectable()
class MockTramite32301Store {}

@Injectable()
class MockTramite32301Query {}


describe('AdicionFraccionComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, AdicionFraccionComponent,HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: AvisoModifyService, useClass: MockAvisoModifyService },
        { provide: Tramite32301Store, useClass: MockTramite32301Store },
        { provide: Tramite32301Query, useClass: MockTramite32301Query },
        ConsultaioQuery
      ]
    }).overrideComponent(AdicionFraccionComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AdicionFraccionComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.query = component.query || {};
    component.query.selectState$ = observableOf({
      gridFraccionesHeader: {}
    });
    component.ngOnInit();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.inicializarFormulario = jest.fn();
    component.inicializarEstadoFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.inicializarFormulario = jest.fn();
    component.declaracionForm = component.declaracionForm || {};
    component.declaracionForm.disable = jest.fn();
    component.declaracionForm.enable = jest.fn();
    component.declaracionFormModel = component.declaracionFormModel || {};
    component.declaracionFormModel.disable = jest.fn();
    component.declaracionFormModel.enable = jest.fn();
    component.cargaManualForm = component.cargaManualForm || {};
    component.cargaManualForm.disable = jest.fn();
    component.cargaManualForm.enable = jest.fn();
    component.guardarDatosFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.declaracionForm.enable).toHaveBeenCalled();
    expect(component.declaracionFormModel.enable).toHaveBeenCalled();
  });

  it('should run #inicializarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.getAdicianFraccionOption = jest.fn();
    component.getAdicianFraccionNicoModOptions = jest.fn();
    component.getAdicianFraccionActivRelProcModOption = jest.fn();
    component.getAdicianFraccioncveFraccionCorrelacionModOption = jest.fn();
    component.getAdicianFraccionUnidadMedidaModOption = jest.fn();
    component.inicializarFormulario();
    expect(component.fb.group).toHaveBeenCalled();
    expect(component.getAdicianFraccionOption).toHaveBeenCalled();
    expect(component.getAdicianFraccionNicoModOptions).toHaveBeenCalled();
    expect(component.getAdicianFraccionActivRelProcModOption).toHaveBeenCalled();
    expect(component.getAdicianFraccioncveFraccionCorrelacionModOption).toHaveBeenCalled();
    expect(component.getAdicianFraccionUnidadMedidaModOption).toHaveBeenCalled();
  });

  it('should run #getAdicianFraccionOption()', async () => {
    component.AvisoModifyService = component.AvisoModifyService || {};
    component.AvisoModifyService.getAdicianFraccionOption = jest.fn().mockReturnValue(observableOf({}));
    component.getAdicianFraccionOption();
    expect(component.AvisoModifyService.getAdicianFraccionOption).toHaveBeenCalled();
  });

  it('should run #getAdicianFraccionNicoModOptions()', async () => {
    component.AvisoModifyService = component.AvisoModifyService || {};
    component.AvisoModifyService.getAdicianFraccionNicoModOptions = jest.fn().mockReturnValue(observableOf({}));
    component.getAdicianFraccionNicoModOptions();
    expect(component.AvisoModifyService.getAdicianFraccionNicoModOptions).toHaveBeenCalled();
  });

  it('should run #getAdicianFraccionUnidadMedidaModOption()', async () => {
    component.AvisoModifyService = component.AvisoModifyService || {};
    component.AvisoModifyService.getAdicianFraccionUnidadMedidaModOption = jest.fn().mockReturnValue(observableOf({}));
    component.getAdicianFraccionUnidadMedidaModOption();
    expect(component.AvisoModifyService.getAdicianFraccionUnidadMedidaModOption).toHaveBeenCalled();
  });

  it('should run #getAdicianFraccionActivRelProcModOption()', async () => {
    component.AvisoModifyService = component.AvisoModifyService || {};
    component.AvisoModifyService.getAdicianFraccionActivRelProcModOption = jest.fn().mockReturnValue(observableOf({}));
    component.getAdicianFraccionActivRelProcModOption();
    expect(component.AvisoModifyService.getAdicianFraccionActivRelProcModOption).toHaveBeenCalled();
  });

  it('should run #getAdicianFraccioncveFraccionCorrelacionModOption()', async () => {
    component.AvisoModifyService = component.AvisoModifyService || {};
    component.AvisoModifyService.getAdicianFraccioncveFraccionCorrelacionModOption = jest.fn().mockReturnValue(observableOf({}));
    component.getAdicianFraccioncveFraccionCorrelacionModOption();
    expect(component.AvisoModifyService.getAdicianFraccioncveFraccionCorrelacionModOption).toHaveBeenCalled();
  });


  it('should run #valorSeleccionadoTipoCarga()', async () => {

    component.valorSeleccionadoTipoCarga({});

  });

  it('should run #modalAgregaCarga()', async () => {
    component.openfraccionesModelModel = jest.fn();
    component.modalAgregaCarga();
  });

  it('should run #abrirModalCargaMasivaFr()', async () => {
    component.openCargaMasivaFrModal = jest.fn();
    component.abrirModalCargaMasivaFr();
  });

  it('should run #cargarArchivoProcesosAjax()', async () => {

    component.cargarArchivoProcesosAjax();
  });

  it('should run #openCargaMasivaFrModal()', async () => {
    component.cargaMasivaFrModalInstance = component.cargaMasivaFrModalInstance || {};
    component.cargaMasivaFrModalInstance.show = jest.fn();
    component.openCargaMasivaFrModal();
  });

  it('should run #closeCargaMasivaFrModal()', async () => {
    component.cargaMasivaFrModalInstance = component.cargaMasivaFrModalInstance || {};
    component.cargaMasivaFrModalInstance.hide = jest.fn();
    component.closeCargaMasivaFrModal();
  });

  it('should run #openfraccionesModelModel()', async () => {
    component.fraccionesModelInstance = component.fraccionesModelInstance || {};
    component.fraccionesModelInstance.show = jest.fn();
    component.openfraccionesModelModel();
    expect(component.fraccionesModelInstance.show).toHaveBeenCalled();
  });

  it('should run #closefraccionesModelModels()', async () => {
    component.fraccionesModelInstance = component.fraccionesModelInstance || {};
    component.fraccionesModelInstance.hide = jest.fn();
    component.closefraccionesModelModels();
    expect(component.fraccionesModelInstance.hide).toHaveBeenCalled();
  });

  it('should run #seleccionDeFilas()', async () => {

    component.seleccionDeFilas({});

  });

  it('should run #modificarSeleccionada()', async () => {
    component.fraccionesModelInstance = component.fraccionesModelInstance || {};
    component.fraccionesModelInstance.show = jest.fn();
    component.cargaManualForm = component.cargaManualForm || {};
    component.cargaManualForm.patchValue = jest.fn();
    component.gridFraccionesHeader = component.gridFraccionesHeader || {};
    component.fechasDatos = component.fechasDatos || {};
    component.fechasDatos.join = jest.fn();
    component.modificarSeleccionada({
      value: {
        id: {},
        fraccionDeclarada: {},
        actividadRelacionada: {},
        correlacionFraccionActual: {},
        descripcionFraccionActual: {},
        nico: {},
        descripcionNico: {},
        umt: {}
      }
    });
    expect(component.cargaManualForm.patchValue).toHaveBeenCalled();
    expect(component.fechasDatos.join).toHaveBeenCalled();
  });

  it('should run #eliminarFraccionSeleccionada()', async () => {
    component.gridFraccionesHeader = component.gridFraccionesHeader || {};
    component.gridFraccionesHeader.findIndex = jest.fn().mockReturnValue([
      {
        "id": {}
      }
    ]);
    component.gridFraccionesHeader = ['gridFraccionesHeader'];
    component.store = component.store || {};
    component.store.setCargaManual = jest.fn();
    component.eliminarFraccionSeleccionada({});
  });

  it('should run #aduanaSeleccionadasChange()', async () => {

    component.aduanaSeleccionadasChange({});

  });

  it('should run #closefraccionesModelModel()', async () => {
    component.seleccionadasFila = component.seleccionadasFila || {};
    component.seleccionadasFila.id = 'id';
    component.gridFraccionesHeader = component.gridFraccionesHeader || {};
    component.gridFraccionesHeader.findIndex = jest.fn().mockReturnValue([
      {
        "id": {}
      }
    ]);
    component.gridFraccionesHeader = ['gridFraccionesHeader'];
    component.fechasDatos = component.fechasDatos || {};
    component.fechasDatos.join = jest.fn();
    component.store = component.store || {};
    component.store.setCargaManual = jest.fn();
    component.fraccionesModelInstance = component.fraccionesModelInstance || {};
    component.fraccionesModelInstance.hide = jest.fn();
    component.cargaManualForm = component.cargaManualForm || {};
    component.cargaManualForm.reset = jest.fn();
    component.closefraccionesModelModel({
      value: {
        id: {},
        fraccionDeclarada: {},
        actividadRelacionada: {},
        correlacionFraccionActual: {},
        descripcionFraccionActual: {},
        nico: {},
        descripcionNico: {},
        umt: {}
      }
    });
    expect(component.fechasDatos.join).toHaveBeenCalled();
    expect(component.store.setCargaManual).toHaveBeenCalled();
    expect(component.fraccionesModelInstance.hide).toHaveBeenCalled();
    expect(component.cargaManualForm.reset).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });

  it('should run #onCambioDeArchivo()', async () => {
    component.abrirModal = jest.fn();
    component.onCambioDeArchivo({
      target: {
        files: {
          0: {
            name: {}
          },
          length: {}
        }
      }
    });
  });

  it('should run #abrirModal()', async () => {

    component.abrirModal();

  });

  it('should run #activarSeleccionArchivo()', async () => {

    component.activarSeleccionArchivo();

  });

});