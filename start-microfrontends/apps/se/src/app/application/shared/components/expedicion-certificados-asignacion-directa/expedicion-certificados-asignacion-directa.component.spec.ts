// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ExpedicionCertificadosAsignacionDirectaComponent } from './expedicion-certificados-asignacion-directa.component';
import { FormBuilder } from '@angular/forms';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ExpedicionCertificadosAsignacionService } from '../../services/expedicion-certificados-asignacio.service';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';

@Injectable()
class MockExpedicionCertificadosAsignacionService {}


describe('ExpedicionCertificadosAsignacionDirectaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        ExpedicionCertificadosAsignacionDirectaComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        ConsultaioQuery,
        { provide: ExpedicionCertificadosAsignacionService, useClass: MockExpedicionCertificadosAsignacionService },
        ValidacionesFormularioService
      ]
    }).overrideComponent(ExpedicionCertificadosAsignacionDirectaComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ExpedicionCertificadosAsignacionDirectaComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #asignacionOficioNumeroForm', async () => {
    component.expedicionCertificadosAsignacionForm = component.expedicionCertificadosAsignacionForm || {};
    component.expedicionCertificadosAsignacionForm.get = jest.fn();
    const asignacionOficioNumeroForm = component.asignacionOficioNumeroForm;
   });

  it('should run GetterDeclaration #representacionFederalForm', async () => {
    component.expedicionCertificadosAsignacionForm = component.expedicionCertificadosAsignacionForm || {};
    component.expedicionCertificadosAsignacionForm.get = jest.fn();
    const representacionFederalForm = component.representacionFederalForm;
  });

  it('should run GetterDeclaration #controlMontosAsignacionForm', async () => {
    component.expedicionCertificadosAsignacionForm = component.expedicionCertificadosAsignacionForm || {};
    component.expedicionCertificadosAsignacionForm.get = jest.fn();
    const controlMontosAsignacionForm = component.controlMontosAsignacionForm;
  });

  it('should run GetterDeclaration #asignacionDatosForm', async () => {
    component.expedicionCertificadosAsignacionForm = component.expedicionCertificadosAsignacionForm || {};
    component.expedicionCertificadosAsignacionForm.get = jest.fn();
    const asignacionDatosForm = component.asignacionDatosForm;
  });

  it('should run GetterDeclaration #cupoDescripcionForm', async () => {
    component.expedicionCertificadosAsignacionForm = component.expedicionCertificadosAsignacionForm || {};
    component.expedicionCertificadosAsignacionForm.get = jest.fn();
    const cupoDescripcionForm = component.cupoDescripcionForm;
  });

  it('should run GetterDeclaration #distribucionSaldoForm', async () => {
    component.expedicionCertificadosAsignacionForm = component.expedicionCertificadosAsignacionForm || {};
    component.expedicionCertificadosAsignacionForm.get = jest.fn();
    const distribucionSaldoForm = component.distribucionSaldoForm;
  });

  it('should run GetterDeclaration #aniosAutorizacion', async () => {
    component.autorizacion = component.autorizacion || {};
    const aniosAutorizacion = component.aniosAutorizacion;

  });

  it('should run #sendAllValues()', async () => {
    component.distribucionSaldoForm = component.distribucionSaldoForm || {};
    component.distribucionSaldoForm.getRawValue = jest.fn();
    component.asignacionOficioNumeroForm = component.asignacionOficioNumeroForm || {};
    component.asignacionOficioNumeroForm.getRawValue = jest.fn();
    component.asignacionDatosForm = component.asignacionDatosForm || {};
    component.asignacionDatosForm.getRawValue = jest.fn();
    component.updateStore = component.updateStore || {};
    component.updateStore.emit = jest.fn();
    component.sendAllValues();

  });

  it('should run #ngOnInit()', async () => {
    component.inicializaCatalogos = jest.fn();
    component.crearExpedicionCertificadosAsignacionForm = jest.fn();
    component.expedicionCertificadoAsignacionState = component.expedicionCertificadoAsignacionState || {};
    component.expedicionCertificadoAsignacionState.mostrarDetalle = 'mostrarDetalle';
    component.aniosAutorizacionSeleccion = jest.fn();
    component.ngOnInit();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.expedicionCertificadosAsignacionForm = component.expedicionCertificadosAsignacionForm || {};
    component.expedicionCertificadosAsignacionForm.disable = jest.fn();
    component.inicializarEstadoFormulario();
  });

  it('should run #crearExpedicionCertificadosAsignacionForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.expedicionCertificadoAsignacionState = component.expedicionCertificadoAsignacionState || {};
    component.expedicionCertificadoAsignacionState.asignacionOficioNumeroForm = 'asignacionOficioNumeroForm';
    component.expedicionCertificadoAsignacionState.representacionFederalForm = 'representacionFederalForm';
    component.expedicionCertificadoAsignacionState.controlMontosAsignacionForm = 'controlMontosAsignacionForm';
    component.expedicionCertificadoAsignacionState.asignacionDatosForm = 'asignacionDatosForm';
    component.expedicionCertificadoAsignacionState.cupoDescripcionForm = 'cupoDescripcionForm';
    component.expedicionCertificadoAsignacionState.distribucionSaldoForm = 'distribucionSaldoForm';
    component.inicializarEstadoFormulario = jest.fn();
    component.crearExpedicionCertificadosAsignacionForm();
  });

  it('should run #inicializaCatalogos()', async () => {
    component.expedicionCertificadosAsignacionService = component.expedicionCertificadosAsignacionService || {};
    component.expedicionCertificadosAsignacionService.getAniosAutorizacionCatalogo = jest.fn().mockReturnValue(observableOf({}));
    component.idProcedimiento = component.idProcedimiento || {};
    component.idProcedimiento.toString = jest.fn();
    component.inicializaCatalogos();
  });

  it('should run #aniosAutorizacionSeleccion()', async () => {
    component.sendAllValues = jest.fn();
    component.aniosAutorizacionSeleccion();
  });

  it('should run #anoSeleccion()', async () => {
    component.anoSeleccionEvent = component.anoSeleccionEvent || {};
    component.anoSeleccionEvent.emit = jest.fn();
    component.anoSeleccion({});
  });

  it('should run #cambioFechaInicio()', async () => {
    component.asignacionDatosForm = component.asignacionDatosForm || {};
    component.asignacionDatosForm.patchValue = jest.fn();
    component.sendAllValues = jest.fn();
    component.cambioFechaInicio({});
  });

  it('should run #cambioFechaFinVigenciaAprobada()', async () => {
    component.asignacionDatosForm = component.asignacionDatosForm || {};
    component.asignacionDatosForm.patchValue = jest.fn();
    component.sendAllValues = jest.fn();
    component.cambioFechaFinVigenciaAprobada({});

  });

  it('should run #cambioFechaInicioVigencia()', async () => {
    component.cupoDescripcionForm = component.cupoDescripcionForm || {};
    component.cupoDescripcionForm.patchValue = jest.fn();
    component.sendAllValues = jest.fn();
    component.cambioFechaInicioVigencia({});
  });

  it('should run #cambioFechaFinVigencia()', async () => {
    component.cupoDescripcionForm = component.cupoDescripcionForm || {};
    component.cupoDescripcionForm.patchValue = jest.fn();
    component.sendAllValues = jest.fn();
    component.cambioFechaFinVigencia({});
  });

  it('should run #valorDeAlternancia()', async () => {

    component.valorDeAlternancia({});

  });

  it('should run #buscar()', async () => {
    component.sendAllValues = jest.fn();
    component.mostrarNumFolioAsignacionError = component.mostrarNumFolioAsignacionError || {};
    component.mostrarNumFolioAsignacionError.emit = jest.fn();
    component.mostrarError = component.mostrarError || {};
    component.mostrarError.emit = jest.fn();
    component.asignacionOficioNumeroForm = component.asignacionOficioNumeroForm || {};
    component.asignacionOficioNumeroForm.markAllAsTouched = jest.fn();
    component.asignacionOficioNumeroForm.get = jest.fn();
    component.asignacionOficioNumeroForm.reset = jest.fn();
    component.asignacionOficioNumeroForm.nombre = 'nombre';
    component.expedicionCertificadosAsignacionService = component.expedicionCertificadosAsignacionService || {};
    component.expedicionCertificadosAsignacionService.buscarAsignacion = jest.fn().mockReturnValue(observableOf({
      datos: {
        0: {}
      }
    }));
    component.idProcedimiento = component.idProcedimiento || {};
    component.idProcedimiento.toString = jest.fn();
    component.representacionFederalForm = component.representacionFederalForm || {};
    component.representacionFederalForm.patchValue = jest.fn();
    component.controlMontosAsignacionForm = component.controlMontosAsignacionForm || {};
    component.controlMontosAsignacionForm.patchValue = jest.fn();
    component.asignacionDatosForm = component.asignacionDatosForm || {};
    component.asignacionDatosForm.patchValue = jest.fn();
    component.cupoDescripcionForm = component.cupoDescripcionForm || {};
    component.cupoDescripcionForm.patchValue = jest.fn();
    component.distribucionSaldoForm = component.distribucionSaldoForm || {};
    component.distribucionSaldoForm.patchValue = jest.fn();
    component.setEstablecerDatosCampo = jest.fn();
    component.buscar({}, 'numFolioAsignacionAux');
  });

  it('should run #setEstablecerDatosCampo()', async () => {
    component.setValoresStore = jest.fn();
    component.setEstablecerDatosCampo();
  });

  it('should run #agregar()', async () => {
    component.mostrarAgregarError = component.mostrarAgregarError || {};
    component.mostrarAgregarError.emit = jest.fn();
    component.distribucionSaldoForm = component.distribucionSaldoForm || {};
    component.distribucionSaldoForm.get = jest.fn().mockReturnValue({
      markAsUntouched: function() {},
      markAsPristine: function() {},
      setValue: function() {},
      value: {}
    });
    component.cuerpoTabla = component.cuerpoTabla || {};
    component.cuerpoTabla = ['cuerpoTabla'];
    component.sendAllValues = jest.fn();
    component.agregar({
      length: {}
    });
  });

  it('should run #eliminar()', async () => {
    component.selectedMonto = component.selectedMonto || {};
    component.eliminar();

  });

  it('should run #confirmacionModal()', async () => {
    component.cuerpoTabla = component.cuerpoTabla || {};
    component.cuerpoTabla.findIndex = jest.fn().mockReturnValue([
      null
    ]);
    component.cuerpoTabla.splice = jest.fn();
    component.selectedMonto = component.selectedMonto || {};
    component.selectedMonto = '0';
    component.sendAllValues = jest.fn();
    component.confirmacionModal({});
  });

  it('should run #isValid()', async () => {
    component.validacionesService = component.validacionesService || {};
    component.validacionesService.isValid = jest.fn();
    component.isValid({}, {});
  });

  it('should run #validarFormulario()', async () => {
    component.expedicionCertificadosAsignacionForm = component.expedicionCertificadosAsignacionForm || {};
    component.expedicionCertificadosAsignacionForm.invalid = 'invalid';
    component.expedicionCertificadosAsignacionForm.markAllAsTouched = jest.fn();
    component.expedicionCertificadosAsignacionForm.valid = 'valid';
    component.cuerpoTabla = component.cuerpoTabla || {};
    component.validarFormulario();
  });

  it('should run #setValoresStore()', async () => {
    component.expedicionCertificadosAsignacionForm = component.expedicionCertificadosAsignacionForm || {};
    component.expedicionCertificadosAsignacionForm.get = jest.fn().mockReturnValue({
      get: function() {}
    });
    component.formExpedicionEvent = component.formExpedicionEvent || {};
    component.formExpedicionEvent.emit = jest.fn();
    component.setValoresStore({}, {}, {});
  });

  it('should run #ngOnDestroy()', async () => {
    component.destruirNotificador$ = component.destruirNotificador$ || {};
    component.destruirNotificador$.next = jest.fn();
    component.destruirNotificador$.complete = jest.fn();
    component.ngOnDestroy();
  });

});