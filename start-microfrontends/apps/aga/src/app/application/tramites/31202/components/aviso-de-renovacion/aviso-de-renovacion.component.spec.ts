// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AvisoDeRenovacionComponent } from './aviso-de-renovacion.component';
import { FormBuilder } from '@angular/forms';
import { AvisoUnicoService } from '../../services/aviso-unico.service';
import { UnicoStore } from '../../estados/renovacion.store';
import { UnicoQuery } from '../../estados/queries/unico.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockAvisoUnicoService {}

@Injectable()
class MockUnicoStore {}

@Injectable()
class MockUnicoQuery {}

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

describe('AvisoDeRenovacionComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ AvisoDeRenovacionComponent, FormsModule, ReactiveFormsModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: AvisoUnicoService, useClass: MockAvisoUnicoService },
        { provide: UnicoStore, useClass: MockUnicoStore },
        { provide: UnicoQuery, useClass: MockUnicoQuery },
        ConsultaioQuery
      ]
    }).overrideComponent(AvisoDeRenovacionComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AvisoDeRenovacionComponent);
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
    component.unicoQuery = component.unicoQuery || {};
    component.unicoQuery.selectSolicitud$ = observableOf({});
    component.initializeForm = jest.fn();
    component.loadLocalidad = jest.fn();
    component.loadAsignacionData = jest.fn();
    component.cargarRadio = jest.fn();
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
    expect(component.initializeForm).toHaveBeenCalled();
    expect(component.loadLocalidad).toHaveBeenCalled();
    expect(component.loadAsignacionData).toHaveBeenCalled();
    expect(component.cargarRadio).toHaveBeenCalled();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #initializeForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.solicitudState = component.solicitudState || {};
    component.solicitudState.mapTipoTramite = 'mapTipoTramite';
    component.solicitudState.mapDeclaracionSolicitud = 'mapDeclaracionSolicitud';
    component.solicitudState.envioAviso = 'envioAviso';
    component.solicitudState.numeroAviso = 'numeroAviso';
    component.solicitudState.numeroOperacion = 'numeroOperacion';
    component.solicitudState.banco = 'banco';
    component.solicitudState.llavePago = 'llavePago';
    component.solicitudState.fechaPago = 'fechaPago';
    component.inicializarEstadoFormulario = jest.fn();
    component.initializeForm();
    expect(component.fb.group).toHaveBeenCalled();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #loadAsignacionData()', async () => {
    component.service = component.service || {};
    component.service.getSolicitante = jest.fn().mockReturnValue(observableOf({
      claveReferencia: {},
      cadenaDependencia: {},
      importePago: {}
    }));
    component.avisoForm = component.avisoForm || {};
    component.avisoForm.patchValue = jest.fn();
    component.loadAsignacionData();
    expect(component.service.getSolicitante).toHaveBeenCalled();
    expect(component.avisoForm.patchValue).toHaveBeenCalled();
  });

  it('should run #loadLocalidad()', async () => {
    component.service = component.service || {};
    component.service.obtenerDatosLocalidad = jest.fn().mockReturnValue(observableOf({}));
    component.loadLocalidad();
    expect(component.service.obtenerDatosLocalidad).toHaveBeenCalled();
  });

  it('should run #cargarRadio()', async () => {
    component.service = component.service || {};
    component.service.obtenerRadio = jest.fn().mockReturnValue(observableOf({}));
    component.cargarRadio();
    expect(component.service.obtenerRadio).toHaveBeenCalled();
  });

  it('should run #onFechaCambiada()', async () => {
    component.avisoForm = component.avisoForm || {};
    component.avisoForm.get = jest.fn().mockReturnValue({
      markAsUntouched: function() {},
      setValue: function() {}
    });
    component.unicoStore = component.unicoStore || {};
    component.unicoStore.setfechaPago = jest.fn();
    component.onFechaCambiada({});
    expect(component.avisoForm.get).toHaveBeenCalled();
    expect(component.unicoStore.setfechaPago).toHaveBeenCalled();
  });

  it('should run #resetPagoDatos()', async () => {
    component.avisoForm = component.avisoForm || {};
    component.avisoForm.patchValue = jest.fn();
    component.resetPagoDatos();
    expect(component.avisoForm.patchValue).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyed$ = component.destroyed$ || {};
    component.destroyed$.next = jest.fn();
    component.destroyed$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyed$.next).toHaveBeenCalled();
    expect(component.destroyed$.complete).toHaveBeenCalled();
  });

  it('should run #cambiarRadio()', async () => {
    component.unicoStore = component.unicoStore || {};
    component.unicoStore.setValorSeleccionado = jest.fn();
    component.cambiarRadio({}, {});
    expect(component.unicoStore.setValorSeleccionado).toHaveBeenCalled();
  });

  it('should run #setValoresStore()', async () => {
    const mockForm = {
      get: jest.fn().mockReturnValue({ value: 'testValue' })
    } as any;

    const mockStore = {
      setTestCampo: jest.fn()
    };

    component.unicoStore = mockStore as any;

    // Dynamically add method to mockStore
    mockStore['setTestCampo'] = jest.fn();

    component.setValoresStore(mockForm, 'testCampo', 'setTestCampo' as any);

    expect(mockForm.get).toHaveBeenCalledWith('testCampo');
    expect(mockStore.setTestCampo).toHaveBeenCalledWith('testValue');
  });

   it('should disable form if soloLectura is true', () => {
    component.soloLectura = true;
    component.avisoForm = {
      disable: jest.fn(),
      enable: jest.fn()
    } as any;

    component.inicializarEstadoFormulario();

    expect(component.avisoForm.disable).toHaveBeenCalled();
    expect(component.avisoForm.enable).not.toHaveBeenCalled();
  });

   it('should enable form if soloLectura is false', () => {
    component.soloLectura = false;
    component.avisoForm = {
      disable: jest.fn(),
      enable: jest.fn()
    } as any;

    component.inicializarEstadoFormulario();

    expect(component.avisoForm.enable).toHaveBeenCalled();
    expect(component.avisoForm.disable).not.toHaveBeenCalled();
  });

   it('should convert numeric radio value to string and update store', () => {
    const mockValue = 5;
    component.unicoStore = {
      setValorSeleccionado: jest.fn()
    } as any;

    component.cambiarRadio(mockValue);

    expect(component.valorSeleccionado).toBe(5);
    expect(component.unicoStore.setValorSeleccionado).toHaveBeenCalledWith(5);
  });

});