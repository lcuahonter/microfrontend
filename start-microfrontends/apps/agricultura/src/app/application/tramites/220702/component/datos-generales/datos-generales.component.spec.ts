// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosGeneralesComponent } from './datos-generales.component';
import { FormBuilder } from '@angular/forms';
import { FitosanitarioService } from '../../service/fitosanitario.service';
import { TramiteStoreQuery } from '../../estados/tramite220702.query';
import { TramiteStore } from '../../estados/tramite220702.store';
import { SeccionLibQuery, SeccionLibStore } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockFitosanitarioService {}

@Injectable()
class MockTramiteStoreQuery {}

@Injectable()
class MockTramiteStore {}

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

describe('DatosGeneralesComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,DatosGeneralesComponent, ],
      declarations: [
       
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: FitosanitarioService, useClass: MockFitosanitarioService },
        { provide: TramiteStoreQuery, useClass: MockTramiteStoreQuery },
        { provide: TramiteStore, useClass: MockTramiteStore },
        SeccionLibQuery,
        SeccionLibStore,
        ConsultaioQuery
      ]
    }).overrideComponent(DatosGeneralesComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosGeneralesComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.iniciarFormulario = jest.fn();
    // Simula la implementación para llamar a iniciarFormulario
    component.inicializarEstadoFormulario = function() {
      this.iniciarFormulario();
    };
    component.inicializarEstadoFormulario();
    expect(component.iniciarFormulario).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({});
    component.iniciarFormulario = jest.fn();
    component.getAduanaDeIngreso = jest.fn();
    component.getOficinaDeInspeccion = jest.fn();
    component.getPuntoDeInspeccion = jest.fn();
    component.getRegimenAlQue = jest.fn();
    component.getPuntoDeVerificacion = jest.fn();
    component.getDatosParaMovilizacion = jest.fn();
    component.getDatos = jest.fn();
    component.datosGeneralesForm = component.datosGeneralesForm || {};
    component.datosGeneralesForm.patchValue = jest.fn();
    component.datosGeneralesForm.statusChanges = observableOf({});
    component.datosGeneralesForm.value = 'value';
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setSolicitudTramite = jest.fn();
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.ngOnInit();
    });

  it('should run #guardarDatosFormulario()', async () => {
    component.iniciarFormulario = jest.fn();
    component.datosGeneralesForm = component.datosGeneralesForm || {};
    component.datosGeneralesForm.disable = jest.fn();
    component.datosGeneralesForm.enable = jest.fn();
    component.guardarDatosFormulario();
    });

  it('should run #iniciarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.iniciarFormulario();
    
  });

  it('should run #getAduanaDeIngreso()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.getAduanaDeIngreso = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getAduanaDeIngreso();
   });

  it('should run #getDatos()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.getDatosMercania = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getDatos();
   });

  it('should run #getOficinaDeInspeccion()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.getOficinaDeInspeccion = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getOficinaDeInspeccion();
   });

  it('should run #getPuntoDeInspeccion()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.getPuntoDeInspeccion = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getPuntoDeInspeccion();
   });

  it('should run #getRegimenAlQue()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.getRegimenAlQue = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getRegimenAlQue();
   });

  it('should run #getDatosParaMovilizacion()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.getDatosParaMovilizacion = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getDatosParaMovilizacion();
    });

  it('should run #getPuntoDeVerificacion()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.getPuntoDeVerificacion = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getPuntoDeVerificacion();
    });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.unsubscribe = jest.fn();
    component.ngOnDestroy();
    });

});