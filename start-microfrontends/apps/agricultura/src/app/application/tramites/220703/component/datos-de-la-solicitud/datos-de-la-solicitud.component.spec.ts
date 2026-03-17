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
import { AcuicolaService } from '../../service/acuicola.service';
import { TramiteStoreQuery } from '../../estados/tramite220703.query';
import { TramiteStore } from '../../estados/tramite220703.store';
import { SeccionLibQuery, SeccionLibStore } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockAcuicolaService {}

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
      imports: [ FormsModule, ReactiveFormsModule, DatosDeLaSolicitudComponent, ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: AcuicolaService, useClass: MockAcuicolaService },
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

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
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
    component.getMercanciaDatos = jest.fn();
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({});
    component.datosDeLaSolicitudForm = {
      patchValue: jest.fn()
    };
    component.ngOnInit();
    expect(component.getHoraDeInspeccion).toHaveBeenCalled();
    expect(component.cargarDatos).toHaveBeenCalled();
    expect(component.getAduanaDeIngreso).toHaveBeenCalled();
    expect(component.getOficinaDeInspeccion).toHaveBeenCalled();
    expect(component.getPuntoDeInspeccion).toHaveBeenCalled();
    expect(component.getTipoContenedor).toHaveBeenCalled();
    expect(component.obtenerResponsableDatos).toHaveBeenCalled();
    expect(component.getMedioDeTransporte).toHaveBeenCalled();
    expect(component.getMercanciaDatos).toHaveBeenCalled();
  });

  it('should run #iniciarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.justificacion = 'justificacion';
    component.tramiteState.certificadosAutorizados = 'certificadosAutorizados';
    component.tramiteState.fechaInspeccionInput = 'fechaInspeccionInput';
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
    expect(component.fb.group).toHaveBeenCalled();
  });
  it('should run #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.iniciarFormulario = jest.fn();
    expect(component.guardarDatosFormulario).not.toHaveBeenCalled();
  });
  it('should run #guardarDatosFormulario()', async () => {
    component.iniciarFormulario = jest.fn();
    component.datosDeLaSolicitudForm = component.datosDeLaSolicitudForm || {};
    component.datosDeLaSolicitudForm.disable = jest.fn();
    component.datosDeLaSolicitudForm.enable = jest.fn();
    component.datosDeLaSolicitudForm.get = jest.fn().mockReturnValue({
      disable: jest.fn()
    });
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.datosDeLaSolicitudForm.disable).not.toHaveBeenCalled();
    expect(component.datosDeLaSolicitudForm.enable).toHaveBeenCalled();
  });

  it('should run #mostrarColapsable()', async () => {

    component.mostrarColapsable();

  });

  it('should run #cambioFechaInspeccion()', async () => {
    component.datosDeLaSolicitudForm = component.datosDeLaSolicitudForm || {};
    component.datosDeLaSolicitudForm.get = jest.fn().mockReturnValue({
      markAsUntouched: function() {},
      setValue: function() {}
    });
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setFechaInicio = jest.fn();
    component.tramiteStore.setFechaDeInspeccion = jest.fn();
    component.cambioFechaInspeccion({});
    expect(component.datosDeLaSolicitudForm.get).toHaveBeenCalled();
    expect(component.tramiteStore.setFechaDeInspeccion).toHaveBeenCalled();
  });

  it('should run #cambioAduanaDeIngreso()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setAduanaDeIngreso = jest.fn();
    component.cambioAduanaDeIngreso({
      id: {}
    });
    expect(component.tramiteStore.setAduanaDeIngreso).toHaveBeenCalled();
  });

  it('should run #cambioFechaInicio()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setFechaDeInspeccion = jest.fn();
    component.cambioFechaInicio({});
    expect(component.tramiteStore.setFechaDeInspeccion).toHaveBeenCalled();
  });

  it('should run #cambioPuntoDeInspeccion()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setPuntoDeInspeccion = jest.fn();
    component.cambioPuntoDeInspeccion({
      id: {}
    });
    expect(component.tramiteStore.setPuntoDeInspeccion).toHaveBeenCalled();
  });

  it('should run #cambioTipoContenedor()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setTipoContenedor = jest.fn();
    component.cambioTipoContenedor({
      id: {}
    });
    expect(component.tramiteStore.setTipoContenedor).toHaveBeenCalled();
  });

  it('should run #cambioIdentificacionTransporte()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setIdentificacionTransporte = jest.fn();
    component.cambioIdentificacionTransporte({
      target: {
        value: {}
      }
    });
    expect(component.tramiteStore.setIdentificacionTransporte).toHaveBeenCalled();
  });

  it('should run #cambioJustificacion()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setJustificacion = jest.fn();
    component.cambioJustificacion({
      target: {
        value: {}
      }
    });
    expect(component.tramiteStore.setJustificacion).toHaveBeenCalled();
  });

  it('should run #cambioEsSolicitudFerros()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setEsSolicitudFerros = jest.fn();
    component.cambioEsSolicitudFerros({
      target: {
        value: {}
      }
    });
    expect(component.tramiteStore.setEsSolicitudFerros).toHaveBeenCalled();
  });

  it('should run #cargarDatos()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.obtenerDatosCertificados = jest.fn().mockReturnValue(observableOf({}));
    component.datosDeLaSolicitudForm = component.datosDeLaSolicitudForm || {};
    component.datosDeLaSolicitudForm.patchValue = jest.fn();
    component.cargarDatos();
    expect(component.acuicolaService.obtenerDatosCertificados).toHaveBeenCalled();
    expect(component.datosDeLaSolicitudForm.patchValue).toHaveBeenCalled();
  });

  it('should run #getMercanciaDatos()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.getDatosMercancia = jest.fn().mockReturnValue(observableOf({}));
    component.getMercanciaDatos();
    expect(component.acuicolaService.getDatosMercancia).toHaveBeenCalled();
  });

  it('should run #cambiarFechaInicio()', async () => {
    component.datosDeLaSolicitudForm = component.datosDeLaSolicitudForm || {};
    component.datosDeLaSolicitudForm.patchValue = jest.fn();
    component.datosDeLaSolicitudForm.get = jest.fn().mockReturnValue({
      markAsUntouched: function() {},
      setValue: function() {}
    });
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setFechaDeInspeccion = jest.fn();
    component.cambiarFechaInicio({});
    expect(component.datosDeLaSolicitudForm.patchValue).toHaveBeenCalled();
    expect(component.datosDeLaSolicitudForm.get).toHaveBeenCalled();
    expect(component.tramiteStore.setFechaDeInspeccion).toHaveBeenCalled();
  });

  it('should run #getHoraDeInspeccion()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.getHoraDeInspeccion = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getHoraDeInspeccion();
    expect(component.acuicolaService.getHoraDeInspeccion).toHaveBeenCalled();
  });

  it('should run #getAduanaDeIngreso()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.getAduanaDeIngreso = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getAduanaDeIngreso();
    expect(component.acuicolaService.getAduanaDeIngreso).toHaveBeenCalled();
  });

  it('should run #getOficinaDeInspeccion()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.getOficinaDeInspeccion = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getOficinaDeInspeccion();
    expect(component.acuicolaService.getOficinaDeInspeccion).toHaveBeenCalled();
  });

  it('should run #getPuntoDeInspeccion()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.getPuntoDeInspeccion = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getPuntoDeInspeccion();
    expect(component.acuicolaService.getPuntoDeInspeccion).toHaveBeenCalled();
  });

  it('should run #getTipoContenedor()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.getTipoContenedor = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getTipoContenedor();
    expect(component.acuicolaService.getTipoContenedor).toHaveBeenCalled();
  });

  it('should run #getMedioDeTransporte()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.getMedioDeTransporte = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getMedioDeTransporte();
    expect(component.acuicolaService.getMedioDeTransporte).toHaveBeenCalled();
  });

  it('should run #obtenerResponsableDatos()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.obtenerResponsableDatos = jest.fn().mockReturnValue(observableOf({}));
    component.datosDeLaSolicitudForm = component.datosDeLaSolicitudForm || {};
    component.datosDeLaSolicitudForm.patchValue = jest.fn();
    component.obtenerResponsableDatos();
    expect(component.acuicolaService.obtenerResponsableDatos).toHaveBeenCalled();
    expect(component.datosDeLaSolicitudForm.patchValue).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.unsubscribe = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.unsubscribe).toHaveBeenCalled();
  });

  it('should run #inicializarEstadoFormulario() when esFormularioSoloLectura is true', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.iniciarFormulario = jest.fn();
    component.datosDeLaSolicitudForm = {
      disable: jest.fn(),
      enable: jest.fn(),
      get: jest.fn().mockReturnValue({
        disable: jest.fn()
      })
    };
    component.aplicarModoFormulario = jest.fn();
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.aplicarModoFormulario).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario() when esFormularioSoloLectura is true', async () => {
    component.iniciarFormulario = jest.fn();
    component.datosDeLaSolicitudForm = component.datosDeLaSolicitudForm || {};
    component.datosDeLaSolicitudForm.disable = jest.fn();
    component.datosDeLaSolicitudForm.enable = jest.fn();
    component.datosDeLaSolicitudForm.get = jest.fn().mockReturnValue({
      disable: jest.fn()
    });
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.iniciarFormulario).toHaveBeenCalled();
    expect(component.datosDeLaSolicitudForm.disable).toHaveBeenCalled();
    expect(component.datosDeLaSolicitudForm.enable).not.toHaveBeenCalled();
  });
});