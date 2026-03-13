import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { FormBuilder } from '@angular/forms';
import { NacionalRegistroDelCafeExportadoresService } from '../../services/nacional-registro-del-cafe-exportadores.service';
import { Solicitud290301Store } from '../../estados/tramite290301.store';
import { Solicitud290301Query } from '../../estados/tramite290301.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockNacionalRegistroDelCafeExportadoresService {}

@Injectable()
class MockSolicitud290301Store {
  metodoNombre = jest.fn();
}

@Injectable()
class MockSolicitud290301Query {}

describe('DatosDeLaSolicitudComponent', () => {
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
  let component: {
    esFormularioSoloLectura: boolean; ngOnDestroy: () => void; solicitud290301Query: { selectSolicitud$?: any; }; createForm: jest.Mock<any, any, any> | (() => void); getRegionsData: jest.Mock<any, any, any> | (() => void); getBeneficiosData: jest.Mock<any, any, any> | (() => void); getBodegasData: jest.Mock<any, any, any> | (() => void); getCafeExportadoresData: jest.Mock<any, any, any> | (() => void); consultaioQuery: { selectConsultaioState$?: any; }; inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; fb: { group?: any; }; dataDeLaSolicitudState: { justificacion?: any; productorDeCafe?: any; claveDelPadron?: any; observaciones?: any; requiereInspeccionInmediata?: any; informacionConfidencial?: any; }; datosSolicitudForma: { get?: any; disable?: any; enable?: any; }; handleProductorDeCafeChange: (arg0: {}) => void; nacionalRegistroDelCafeExportadoresService: { getRegionsData?: any; getBeneficiosData?: any; getBodegasData?: any; getCafeExportadoresData?: any; }; solicitud290301Store: { metodoNombre?: any; }; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; destroyed$: { next?: any; complete?: any; }; 
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,DatosDeLaSolicitudComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: NacionalRegistroDelCafeExportadoresService, useClass: MockNacionalRegistroDelCafeExportadoresService },
        { provide: Solicitud290301Store, useClass: MockSolicitud290301Store },
        { provide: Solicitud290301Query, useClass: MockSolicitud290301Query },
        ConsultaioQuery
      ]
    }).overrideComponent(DatosDeLaSolicitudComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
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
    component.solicitud290301Query = component.solicitud290301Query || {};
    component.solicitud290301Query.selectSolicitud$ = observableOf({});
    component.createForm = jest.fn();
    component.getRegionsData = jest.fn();
    component.getBeneficiosData = jest.fn();
    component.getBodegasData = jest.fn();
    component.getCafeExportadoresData = jest.fn();
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
     expect(component.createForm).toHaveBeenCalled();
     expect(component.getRegionsData).toHaveBeenCalled();
     expect(component.getBeneficiosData).toHaveBeenCalled();
     expect(component.getBodegasData).toHaveBeenCalled();
     expect(component.getCafeExportadoresData).toHaveBeenCalled();
     expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #createForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.dataDeLaSolicitudState = component.dataDeLaSolicitudState || {};
    component.dataDeLaSolicitudState.justificacion = 'justificacion';
    component.dataDeLaSolicitudState.productorDeCafe = 'productorDeCafe';
    component.dataDeLaSolicitudState.claveDelPadron = 'claveDelPadron';
    component.dataDeLaSolicitudState.observaciones = 'observaciones';
    component.dataDeLaSolicitudState.requiereInspeccionInmediata = 'requiereInspeccionInmediata';
    component.dataDeLaSolicitudState.informacionConfidencial = 'informacionConfidencial';
    component.createForm();
     expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #handleProductorDeCafeChange()', async () => {
    component.datosSolicitudForma = component.datosSolicitudForma || {};
    component.datosSolicitudForma.get = jest.fn().mockReturnValue({
      setValue: function() {},
      disable: function() {},
      enable: function() {}
    });
    component.handleProductorDeCafeChange({});
     expect(component.datosSolicitudForma.get).toHaveBeenCalled();
  });

  it('should run #getRegionsData()', async () => {
    component.nacionalRegistroDelCafeExportadoresService = component.nacionalRegistroDelCafeExportadoresService || {};
    component.nacionalRegistroDelCafeExportadoresService.getRegionsData = jest.fn().mockReturnValue(observableOf({}));
    component.getRegionsData();
     expect(component.nacionalRegistroDelCafeExportadoresService.getRegionsData).toHaveBeenCalled();
  });

  it('should run #getBeneficiosData()', async () => {
    component.nacionalRegistroDelCafeExportadoresService = component.nacionalRegistroDelCafeExportadoresService || {};
    component.nacionalRegistroDelCafeExportadoresService.getBeneficiosData = jest.fn().mockReturnValue(observableOf({}));
    component.getBeneficiosData();
     expect(component.nacionalRegistroDelCafeExportadoresService.getBeneficiosData).toHaveBeenCalled();
  });

  it('should run #getBodegasData()', async () => {
    component.nacionalRegistroDelCafeExportadoresService = component.nacionalRegistroDelCafeExportadoresService || {};
    component.nacionalRegistroDelCafeExportadoresService.getBodegasData = jest.fn().mockReturnValue(observableOf({}));
    component.getBodegasData();
     expect(component.nacionalRegistroDelCafeExportadoresService.getBodegasData).toHaveBeenCalled();
  });

  it('should run #getCafeExportadoresData()', async () => {
    component.nacionalRegistroDelCafeExportadoresService = component.nacionalRegistroDelCafeExportadoresService || {};
    component.nacionalRegistroDelCafeExportadoresService.getCafeExportadoresData = jest.fn().mockReturnValue(observableOf({}));
    component.getCafeExportadoresData();
     expect(component.nacionalRegistroDelCafeExportadoresService.getCafeExportadoresData).toHaveBeenCalled();
  });
 
  it('should run #inicializarEstadoFormulario()', async () => {
    component.datosSolicitudForma = {
      disable: jest.fn(),
      enable: jest.fn(),
    };
  
    component.esFormularioSoloLectura = true;
  
    component.inicializarEstadoFormulario();
  
    expect(component.datosSolicitudForma.disable).toHaveBeenCalled();
    expect(component.datosSolicitudForma.enable).not.toHaveBeenCalled();
  
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
  
    expect(component.datosSolicitudForma.enable).toHaveBeenCalled();
  });
  it('should run #setValoresStore()', () => {
    const mockForm = {
      get: jest.fn().mockReturnValue({ value: 'mockValue' })
    };
    const mockCampo = 'mockCampo';
    const mockMetodoNombre = 'metodoNombre'; 
    const mockArg1 = {};
  
    component.solicitud290301Store[mockMetodoNombre] = jest.fn();
  
    component.setValoresStore(mockForm, mockCampo, mockMetodoNombre);
  
    expect(mockForm.get).toHaveBeenCalledWith(mockCampo);
  
    expect(component.solicitud290301Store[mockMetodoNombre]).toHaveBeenCalledWith('mockValue');
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyed$ = component.destroyed$ || {};
    component.destroyed$.next = jest.fn();
    component.destroyed$.complete = jest.fn();
    component.ngOnDestroy();
     expect(component.destroyed$.next).toHaveBeenCalled();
     expect(component.destroyed$.complete).toHaveBeenCalled();
  });

});