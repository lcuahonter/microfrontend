import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosDeReporteAnualComponent } from './datos-de-reporte-anual.component';
import { FormBuilder } from '@angular/forms';
import { Solicitud150103Store } from '../../estados/solicitud150103.store';
import { Solicitud150103Query } from '../../estados/solicitud150103.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { InformeAnualProgramaService } from '../../services/informe-anual-programa.service';
import { provideHttpClient } from '@angular/common/http';
@Injectable()
class MockSolicitud150103Store {}

@Injectable()
class MockSolicitud150103Query {}

@Injectable()
class MockInformeAnualProgramaService {}


describe('DatosDeReporteAnualComponent', () => {
  let fixture: ComponentFixture<DatosDeReporteAnualComponent>;
  let component: {
    esFormularioSoloLectura: boolean; ngOnDestroy: () => void; fb: { group?: any; }; solicitud150103State: { ventasTotales?: any; totalExportaciones?: any; totalImportaciones?: any; saldo?: any; porcentajeExportacion?: any; }; solicitud150103Query: { seleccionarSolicitud$?: any; }; consultaioQuery: { selectConsultaioState$?: any; }; inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; formReporteAnnual: { get?: any; disable?: any; enable?: any; }; solicitud150103Store: { actualizarPorcentajeExportacion?: any; actualizarSaldo?: any; actualizarTotalExportaciones?: any; actualizarVentasTotales?: any; actualizarTotalImportaciones?: any; }; calcularReporteAnnual: jest.Mock<any, any, any> | (() => void); obtenerTotalExportaciones: (arg0: { target: { value: {}; }; }) => void; obtenerVentasTotales: (arg0: { target: { value: {}; }; }) => void; obtenerTotalImportaciones: (arg0: { target: { value: {}; }; }) => void; destroyed$: { next?: any; complete?: any; }; 
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,DatosDeReporteAnualComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        provideHttpClient(),
        FormBuilder,
        { provide: Solicitud150103Store, useClass: MockSolicitud150103Store },
        { provide: Solicitud150103Query, useClass: MockSolicitud150103Query },
        ConsultaioQuery,
        { provide: InformeAnualProgramaService, useClass: MockInformeAnualProgramaService }
      ]
    }).overrideComponent(DatosDeReporteAnualComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosDeReporteAnualComponent);
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
    component.fb = component.fb || {};
    component.fb.group = jest.fn().mockReturnValue({
      patchValue: function() {}
    });
    component.solicitud150103State = component.solicitud150103State || {};
    component.solicitud150103State.ventasTotales = 'ventasTotales';
    component.solicitud150103State.totalExportaciones = 'totalExportaciones';
    component.solicitud150103State.totalImportaciones = 'totalImportaciones';
    component.solicitud150103State.saldo = 'saldo';
    component.solicitud150103State.porcentajeExportacion = 'porcentajeExportacion';
    component.solicitud150103Query = component.solicitud150103Query || {};
    component.solicitud150103Query.seleccionarSolicitud$ = observableOf({});
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
     expect(component.fb.group).toHaveBeenCalled();
     expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #calcularReporteAnnual()', async () => {
    component.formReporteAnnual = component.formReporteAnnual || {};
    component.formReporteAnnual.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.solicitud150103Store = component.solicitud150103Store || {};
    component.solicitud150103Store.actualizarPorcentajeExportacion = jest.fn();
    component.solicitud150103Store.actualizarSaldo = jest.fn();
    component.calcularReporteAnnual();
     expect(component.formReporteAnnual.get).toHaveBeenCalled();
     expect(component.solicitud150103Store.actualizarPorcentajeExportacion).toHaveBeenCalled();
     expect(component.solicitud150103Store.actualizarSaldo).toHaveBeenCalled();
  });

  it('should run #obtenerTotalExportaciones()', async () => {
    component.solicitud150103Store = component.solicitud150103Store || {};
    component.solicitud150103Store.actualizarTotalExportaciones = jest.fn();
    component.calcularReporteAnnual = jest.fn();
    component.obtenerTotalExportaciones({
      target: {
        value: {}
      }
    });
     expect(component.solicitud150103Store.actualizarTotalExportaciones).toHaveBeenCalled();
     expect(component.calcularReporteAnnual).toHaveBeenCalled();
  });

  it('should run #obtenerVentasTotales()', async () => {
    component.solicitud150103Store = component.solicitud150103Store || {};
    component.solicitud150103Store.actualizarVentasTotales = jest.fn();
    component.calcularReporteAnnual = jest.fn();
    component.obtenerVentasTotales({
      target: {
        value: {}
      }
    });
     expect(component.solicitud150103Store.actualizarVentasTotales).toHaveBeenCalled();
     expect(component.calcularReporteAnnual).toHaveBeenCalled();
  });

  it('should run #obtenerTotalImportaciones()', async () => {
    component.solicitud150103Store = component.solicitud150103Store || {};
    component.solicitud150103Store.actualizarTotalImportaciones = jest.fn();
    component.calcularReporteAnnual = jest.fn();
    component.obtenerTotalImportaciones({
      target: {
        value: {}
      }
    });
     expect(component.solicitud150103Store.actualizarTotalImportaciones).toHaveBeenCalled();
     expect(component.calcularReporteAnnual).toHaveBeenCalled();
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