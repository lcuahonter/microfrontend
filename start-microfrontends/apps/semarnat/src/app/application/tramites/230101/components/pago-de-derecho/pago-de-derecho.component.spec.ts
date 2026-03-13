
import {ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PagoDeDerechoComponent } from './pago-de-derecho.component';
import { FormBuilder } from '@angular/forms';
import { CapturaSolicitudeService } from '../../services/captura-solicitud.service';
import { Solicitud230101Store } from '../../estados/tramites/tramites230101.store';
import { Solicitud230101Query } from '../../estados/queries/tramites230101.query';
import { ValidacionesFormularioService, ConsultaioQuery } from '@ng-mf/data-access-user';
import{MediodetransporteService} from '../../services/medio-de-transporte.service'
@Injectable()
class MockCapturaSolicitudeService {
  

}

@Injectable()
class MockSolicitud230101Store {}

@Injectable()
class MockSolicitud230101Query {}

@Injectable()
class MockMediodetransporteService {
  getMedioDeTransporte = jest.fn().mockReturnValue(observableOf({}));
}

describe('PagoDeDerechoComponent', () => {
  let fixture: ComponentFixture<PagoDeDerechoComponent>;
  let component: {
    esFormularioSoloLectura: boolean; ngOnDestroy: () => void; FormSolicitud: { get?: any; disable?: any; enable?: any; }; pagodeDerechos: any; mediodetransporteService: { getMedioDeTransporte?: any; }; bancoCatalogo: { catalogos?: any; }; fetchBancoData: () => void; solicitud230101Query: { selectSolicitud$?: any; }; derechoState: { claveDeReferencia?: any; cadenaPagoDependencia?: any; banco?: any; llaveDePago?: any; fecPago?: any; impPago?: any; }; fb: { group?: any; }; consultaioQuery: { selectConsultaioState$?: any; }; inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; validacionesService: { isValid?: any; }; isValid: (arg0: {}, arg1: {}) => void; solicitud230101Store: { metodoNombre?: any; }; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; destroyed$: { next?: any; complete?: any; }; 
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PagoDeDerechoComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: CapturaSolicitudeService, useClass: MockCapturaSolicitudeService },
        { provide: Solicitud230101Store, useClass: MockSolicitud230101Store },
        { provide: Solicitud230101Query, useClass: MockSolicitud230101Query },
        ValidacionesFormularioService,
        { provide: MediodetransporteService, useClass: MockMediodetransporteService },
        ConsultaioQuery
      ]
    }).overrideComponent(PagoDeDerechoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PagoDeDerechoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #pagodeDerechos', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn();
    const pagodeDerechos = component.pagodeDerechos;
     expect(component.FormSolicitud.get).toHaveBeenCalled();
  });

  it('should run #fetchBancoData()', async () => {
    component.mediodetransporteService = component.mediodetransporteService || {};
    component.mediodetransporteService.getMedioDeTransporte = jest.fn().mockReturnValue(observableOf({}));
    component.bancoCatalogo = component.bancoCatalogo || {};
    component.bancoCatalogo.catalogos = 'catalogos';
    component.fetchBancoData();
     expect(component.mediodetransporteService.getMedioDeTransporte).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.solicitud230101Query = component.solicitud230101Query || {};
    component.solicitud230101Query.selectSolicitud$ = observableOf({});
    component.derechoState = component.derechoState || {};
    component.derechoState.claveDeReferencia = 'claveDeReferencia';
    component.derechoState.cadenaPagoDependencia = 'cadenaPagoDependencia';
    component.derechoState.banco = 'banco';
    component.derechoState.llaveDePago = 'llaveDePago';
    component.derechoState.fecPago = 'fecPago';
    component.derechoState.impPago = 'impPago';
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
     expect(component.fb.group).toHaveBeenCalled();
     expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.FormSolicitud = {
      disable: jest.fn(),
      enable: jest.fn(),
    };
  
    component.esFormularioSoloLectura = true;
  
    component.inicializarEstadoFormulario();
  
    expect(component.FormSolicitud.disable).toHaveBeenCalled();
    expect(component.FormSolicitud.enable).not.toHaveBeenCalled();
  
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
  
    expect(component.FormSolicitud.enable).toHaveBeenCalled();
  });

  it('should run #isValid()', async () => {
    component.validacionesService = component.validacionesService || {};
    component.validacionesService.isValid = jest.fn();
    component.isValid({}, {});
     expect(component.validacionesService.isValid).toHaveBeenCalled();
  });


  it('should run #ngOnDestroy()', async () => {
    component.destroyed$ = {
      next: jest.fn(),
      complete: jest.fn(),
    };
  
    component.ngOnDestroy();
  
    expect(component.destroyed$.next).toHaveBeenCalled();
    expect(component.destroyed$.complete).toHaveBeenCalled();
  });

});