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

describe('DatosGeneralesComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DatosGeneralesComponent, ],
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
    }).overrideComponent(DatosGeneralesComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosGeneralesComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.iniciarFormulario = jest.fn();
    component.getAduanaDeIngreso = jest.fn();
    component.getOficinaDeInspeccion = jest.fn();
    component.getPuntoDeInspeccion = jest.fn();
    component.getRegimenAlQueSeDestinara = jest.fn();
    component.getPuntoDeVerificacion = jest.fn();
    component.getDatosParaMovilizacion = jest.fn();
    component.getMercanciaTablaDatos = jest.fn();
    component.tramiteStoreQuery = component.tramiteStoreQuery || {};
    component.tramiteStoreQuery.selectSolicitudTramite$ = observableOf({});
    component.datosGeneralesForm = component.datosGeneralesForm || {};
    component.datosGeneralesForm.patchValue = jest.fn();
    component.ngOnInit();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
    expect(component.iniciarFormulario).toHaveBeenCalled();
    expect(component.getAduanaDeIngreso).toHaveBeenCalled();
    expect(component.getOficinaDeInspeccion).toHaveBeenCalled();
    expect(component.getPuntoDeInspeccion).toHaveBeenCalled();
    expect(component.getRegimenAlQueSeDestinara).toHaveBeenCalled();
    expect(component.getPuntoDeVerificacion).toHaveBeenCalled();
    expect(component.getDatosParaMovilizacion).toHaveBeenCalled();
    expect(component.getMercanciaTablaDatos).toHaveBeenCalled();
    expect(component.datosGeneralesForm.patchValue).toHaveBeenCalled();
  });
  it('should run #inicializarEstadoFormulario() when esFormularioSoloLectura is false', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.iniciarFormulario = jest.fn();
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.guardarDatosFormulario).not.toHaveBeenCalled();
    expect(component.iniciarFormulario).toHaveBeenCalled();
  });

  it('should run #inicializarEstadoFormulario() when esFormularioSoloLectura is true', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.iniciarFormulario = jest.fn();
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
    expect(component.iniciarFormulario).not.toHaveBeenCalled();
  });
  it('should run #guardarDatosFormulario() when esFormularioSoloLectura is false', async () => {
    component.iniciarFormulario = jest.fn();
    component.datosGeneralesForm = component.datosGeneralesForm || {};
    component.datosGeneralesForm.disable = jest.fn();
    component.datosGeneralesForm.enable = jest.fn();
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.iniciarFormulario).toHaveBeenCalled();
    expect(component.datosGeneralesForm.disable).not.toHaveBeenCalled();
    expect(component.datosGeneralesForm.enable).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario() when esFormularioSoloLectura is true', async () => {
    component.iniciarFormulario = jest.fn();
    component.datosGeneralesForm = component.datosGeneralesForm || {};
    component.datosGeneralesForm.disable = jest.fn();
    component.datosGeneralesForm.enable = jest.fn();
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.iniciarFormulario).toHaveBeenCalled();
    expect(component.datosGeneralesForm.disable).toHaveBeenCalled();
    expect(component.datosGeneralesForm.enable).not.toHaveBeenCalled();
  });

  it('should run #iniciarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.folioDelTramite = 'folioDelTramite';
    component.tramiteState.aduanaDeIngreso = 'aduanaDeIngreso';
    component.tramiteState.oficinaDeInspeccion = 'oficinaDeInspeccion';
    component.tramiteState.puntoDeInspeccion = 'puntoDeInspeccion';
    component.tramiteState.numeroDeGuia = 'numeroDeGuia';
    component.tramiteState.regimenAlQueDestina = 'regimenAlQueDestina';
    component.tramiteState.datosParaMovilizacion = 'datosParaMovilizacion';
    component.tramiteState.puntoDeVerificacion = 'puntoDeVerificacion';
    component.tramiteState.identificacionDelTransporte = 'identificacionDelTransporte';
    component.tramiteState.nombreDeLaEmpresaTransportista = 'nombreDeLaEmpresaTransportista';
    component.iniciarFormulario();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #cambioAduanaDeIngreso()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setAduanaDeIngreso = jest.fn();
    component.cambioAduanaDeIngreso({
      id: {}
    });
    expect(component.tramiteStore.setAduanaDeIngreso).toHaveBeenCalled();
  });

  it('should run #cambioOficinaDeInspeccion()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setOficinaDeInspeccion = jest.fn();
    component.cambioOficinaDeInspeccion({
      id: {}
    });
    expect(component.tramiteStore.setOficinaDeInspeccion).toHaveBeenCalled();
  });

  it('should run #cambioPuntoDeInspeccion()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setPuntoDeInspeccion = jest.fn();
    component.cambioPuntoDeInspeccion({
      id: {}
    });
    expect(component.tramiteStore.setPuntoDeInspeccion).toHaveBeenCalled();
  });

  it('should run #cambioRegimenAlQueDestina()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setRegimenAlQueDestina = jest.fn();
    component.cambioRegimenAlQueDestina({
      id: {}
    });
    expect(component.tramiteStore.setRegimenAlQueDestina).toHaveBeenCalled();
  });

  it('should run #cambioDatosParaMovilizacion()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setDatosParaMovilizacion = jest.fn();
    component.cambioDatosParaMovilizacion({
      id: {}
    });
    expect(component.tramiteStore.setDatosParaMovilizacion).toHaveBeenCalled();
  });

  it('should run #cambioPuntoDeVerificacion()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setPuntoDeVerificacion = jest.fn();
    component.cambioPuntoDeVerificacion({
      id: {}
    });
    expect(component.tramiteStore.setPuntoDeVerificacion).toHaveBeenCalled();
  });

  it('should run #getMercanciaTablaDatos()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.getMercanciaDatos = jest.fn().mockReturnValue(observableOf({}));
    component.getMercanciaTablaDatos();
    expect(component.acuicolaService.getMercanciaDatos).toHaveBeenCalled();
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

  it('should run #getRegimenAlQueSeDestinara()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.getRegimenAlQueSeDestinara = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getRegimenAlQueSeDestinara();
    expect(component.acuicolaService.getRegimenAlQueSeDestinara).toHaveBeenCalled();
  });

  it('should run #getDatosParaMovilizacion()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.getDatosParaMovilizacion = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getDatosParaMovilizacion();
    expect(component.acuicolaService.getDatosParaMovilizacion).toHaveBeenCalled();
  });

  it('should run #getPuntoDeVerificacion()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.getPuntoDeVerificacion = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getPuntoDeVerificacion();
    expect(component.acuicolaService.getPuntoDeVerificacion).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.unsubscribe = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.unsubscribe).toHaveBeenCalled();
  });

});