// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
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

describe('DatosDeLaSolicitudComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,DatosDeLaSolicitudComponent, ],
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

  it('should run #cambiarRadio()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setEsSolicitudFerros = jest.fn();
    component.cambiarRadio({}, {});
    expect(component.tramiteStore.setEsSolicitudFerros).toHaveBeenCalled();
  });

  it('should run #cambioFechaInicio()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setFechaDeInspeccion = jest.fn();
    component.cambioFechaInicio({});
    expect(component.tramiteStore.setFechaDeInspeccion).toHaveBeenCalled();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.iniciarFormulario = jest.fn();
    component.inicializarEstadoFormulario();
    
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.getHoraDeInspeccion = jest.fn();
    component.cargarDatos = jest.fn();
    component.getAduanaDeIngreso = jest.fn();
    component.getOficinaDeInspeccion = jest.fn();
    component.getPuntoDeInspeccion = jest.fn();
    component.getTipoContenedor = jest.fn();
    component.obtenerResponsableDatos = jest.fn();
    component.getMedioDeTransporte = jest.fn();
    component.getDatos = jest.fn();
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({});
    component.datosDeLaSolicitudForm = component.datosDeLaSolicitudForm || {};
    component.datosDeLaSolicitudForm.patchValue = jest.fn();
    component.ngOnInit();
    });

  it('should run #guardarDatosFormulario()', async () => {
    component.iniciarFormulario = jest.fn();
    component.datosDeLaSolicitudForm = component.datosDeLaSolicitudForm || {};
    component.datosDeLaSolicitudForm.disable = jest.fn();
    component.datosDeLaSolicitudForm.enable = jest.fn();
    component.guardarDatosFormulario();
    });

  it('should run #iniciarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.justificacion = 'justificacion';
    component.tramiteState.certificadosAutorizados = 'certificadosAutorizados';
    component.tramiteState.horaDeInspeccion = 'horaDeInspeccion';
    component.tramiteState.aduanaDeIngreso = 'aduanaDeIngreso';
    component.tramiteState.oficinaDeInspeccion = 'oficinaDeInspeccion';
    component.tramiteState.puntoDeInspeccion = 'puntoDeInspeccion';
    component.tramiteState.nombreInspector = 'nombreInspector';
    component.tramiteState.primerApellido = 'primerApellido';
    component.tramiteState.segundoApellido = 'segundoApellido';
    component.tramiteState.cantidadContenedores = 'cantidadContenedores';
    component.tramiteState.tipoContenedor = 'tipoContenedor';
    component.tramiteState.medioDeTransporte = 'medioDeTransporte';
    component.tramiteState.identificacionTransporte = 'identificacionTransporte';
    component.tramiteState.esSolicitudFerros = 'esSolicitudFerros';
    component.iniciarFormulario();
   
  });

  it('should run #mostrarColapsable()', async () => {

    component.mostrarColapsable();

  });

  it('should run #cargarDatos()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.obtenerDatosCertificados = jest.fn().mockReturnValue(observableOf({
      data: {
        certificadosAutorizados: {}
      }
    }));
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setCertificadosAutorizados = jest.fn();
    component.cargarDatos();
    });

  it('should run #getHoraDeInspeccion()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.getHoraDeInspeccion = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getHoraDeInspeccion();
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
    component.fitosanitarioService.getDatosDeLaMercancia = jest.fn().mockReturnValue(observableOf({
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

  it('should run #getTipoContenedor()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.getTipoContenedor = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getTipoContenedor();
   });

  it('should run #getMedioDeTransporte()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.getMedioDeTransporte = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getMedioDeTransporte();
    });

  it('should run #obtenerResponsableDatos()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.obtenerResponsableDatos = jest.fn().mockReturnValue(observableOf({
      data: {
        nombreInspector: {},
        primerApellido: {},
        segundoApellido: {},
        cantidadContenedores: {}
      }
    }));
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setNombreInspector = jest.fn();
    component.tramiteStore.setPrimerApellido = jest.fn();
    component.tramiteStore.setSegundoApellido = jest.fn();
    component.tramiteStore.setCantidadContenedores = jest.fn();
    component.obtenerResponsableDatos();
    });

  it('should run #cambioIdentificacionTransporte()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setIdentificacionTransporte = jest.fn();
    component.cambioIdentificacionTransporte({
      target: {
        value: {}
      }
    });
    });

  it('should run #cambioTipoContenedor()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setTipoContenedor = jest.fn();
    component.cambioTipoContenedor({
      id: {}
    });
    });

  it('should run #cambioJustificacion()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setJustificacion = jest.fn();
    component.cambioJustificacion({
      target: {
        value: {}
      }
    });
   });

  it('should run #cambioAduanaDeIngreso()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setAduanaDeIngreso = jest.fn();
    component.cambioAduanaDeIngreso({
      id: {}
    });
    });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.unsubscribe = jest.fn();
    component.ngOnDestroy();
    });

});