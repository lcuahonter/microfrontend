
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component, ChangeDetectorRef } from '@angular/core';
import { PagoDeDerechoComponent } from './pago-de-derecho.component';
import { RegistrarSolicitudMcpService } from '../../../services/shared2607/registrar-solicitud-mcp.service';
import { FormBuilder } from '@angular/forms';
import { Solicitud260702Store } from '../../../estados/stores/shared2607/tramites260702.store';
import { Solicitud260702Query } from '../../../estados/queries/shared2607/tramites260702.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

@Injectable()
class MockRegistrarSolicitudMcpService {}

@Injectable()
class MockSolicitud260702Store {}

@Injectable()
class MockSolicitud260702Query {}


describe('PagoDeDerechoComponent', () => {
  let fixture: ComponentFixture<PagoDeDerechoComponent>;
  let component: { ngOnDestroy: () => void; pagoDeDerechosForm: { get?: any; disable?: any; enable?: any; reset?: any; }; pagoDeDerechos: any; inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; guardarDatosFormulario: jest.Mock<any, any, any> | (() => void); inicializarFormulario: jest.Mock<any, any, any> | (() => void); solicitud260702Query: { selectSolicitud$?: any; }; crearFormulario: jest.Mock<any, any, any> | (() => void); getBancoData: jest.Mock<any, any, any> | (() => void); registrarsolicitudmcp: { getBancoData?: any; }; bancoData: { catalogos?: any; }; fb: { group?: any; }; pagoDeDerechosState: { clavedereferencia?: any; cadenadeladependencia?: any; banco?: any; llavedepago?: any; fechadepago?: any; importedepago?: any; }; solicitud260702Store: { setFechadePago?: any; metodoNombre?: any; }; seleccionarFechaInicio: (arg0: {}) => void; clearForm: () => void; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; destroyed$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,PagoDeDerechoComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: RegistrarSolicitudMcpService, useClass: MockRegistrarSolicitudMcpService },
        FormBuilder,
        ChangeDetectorRef,
        { provide: Solicitud260702Store, useClass: MockSolicitud260702Store },
        { provide: Solicitud260702Query, useClass: MockSolicitud260702Query },
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

  it('should run GetterDeclaration #pagoDeDerechos', async () => {
    component.pagoDeDerechosForm = component.pagoDeDerechosForm || {};
    component.pagoDeDerechosForm.get = jest.fn();
    const pagoDeDerechos = component.pagoDeDerechos;
     expect(component.pagoDeDerechosForm.get).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
     expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });


  it('should run #inicializarFormulario()', async () => {
    component.solicitud260702Query = component.solicitud260702Query || {};
    component.solicitud260702Query.selectSolicitud$ = observableOf({});
    component.crearFormulario = jest.fn();
    component.getBancoData = jest.fn();
    component.inicializarFormulario();
     expect(component.crearFormulario).toHaveBeenCalled();
     expect(component.getBancoData).toHaveBeenCalled();
  });


  it('should run #getBancoData()', async () => {
    component.registrarsolicitudmcp = component.registrarsolicitudmcp || {};
    component.registrarsolicitudmcp.getBancoData = jest.fn().mockReturnValue(observableOf({}));
    component.bancoData = component.bancoData || {};
    component.bancoData.catalogos = 'catalogos';
    component.getBancoData();
     expect(component.registrarsolicitudmcp.getBancoData).toHaveBeenCalled();
  });

  it('should run #crearFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.pagoDeDerechosState = component.pagoDeDerechosState || {};
    component.pagoDeDerechosState.clavedereferencia = 'clavedereferencia';
    component.pagoDeDerechosState.cadenadeladependencia = 'cadenadeladependencia';
    component.pagoDeDerechosState.banco = 'banco';
    component.pagoDeDerechosState.llavedepago = 'llavedepago';
    component.pagoDeDerechosState.fechadepago = 'fechadepago';
    component.pagoDeDerechosState.importedepago = 'importedepago';
    component.crearFormulario();
     expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #seleccionarFechaInicio()', async () => {
    component.solicitud260702Store = component.solicitud260702Store || {};
    component.solicitud260702Store.setFechadePago = jest.fn();
    component.seleccionarFechaInicio({});
     expect(component.solicitud260702Store.setFechadePago).toHaveBeenCalled();
  });

  it('should run #clearForm()', async () => {
    component.pagoDeDerechosForm = component.pagoDeDerechosForm || {};
    component.pagoDeDerechosForm.reset = jest.fn();
    component.clearForm();
     expect(component.pagoDeDerechosForm.reset).toHaveBeenCalled();
  });

  it('should run #setValoresStore()', async () => {
    component.solicitud260702Store = {
      metodoNombre: jest.fn(),
    };
  
    const mockForm = {
      get: jest.fn().mockReturnValue({ value: 'mockValue' }),
    };
  
    component.setValoresStore(mockForm as any, 'campo', 'metodoNombre');
  
    expect(component.solicitud260702Store.metodoNombre).toHaveBeenCalledWith('mockValue');
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