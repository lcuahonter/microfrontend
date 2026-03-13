// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosCertificadoComponent } from './datos-certificado.component';
import { FormBuilder } from '@angular/forms';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';
import { Tramite110221Store } from '../../estados/tramite110221.store';
import { Tramite110221Query } from '../../estados/tramite110221.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockValidarInicialmenteCertificadoService {}

@Injectable()
class MockTramite110221Store {}

@Injectable()
class MockTramite110221Query {
  formDatosCertificado$ = observableOf({});
}

describe('DatosCertificadoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        DatosCertificadoComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: ValidarInicialmenteCertificadoService, useClass: MockValidarInicialmenteCertificadoService },
        { provide: Tramite110221Store, useClass: MockTramite110221Store },
        { provide: Tramite110221Query, useClass: MockTramite110221Query },
        ConsultaioQuery
      ]
    }).overrideComponent(DatosCertificadoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosCertificadoComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.idiomOpcion = jest.fn();
    component.entidadFederativasOpcion = jest.fn();
    component.representacionFederalOpcion = jest.fn();
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.ngOnInit();
    expect(component.idiomOpcion).toHaveBeenCalled();
    expect(component.entidadFederativasOpcion).toHaveBeenCalled();
    expect(component.representacionFederalOpcion).toHaveBeenCalled();
  });

  it('should run #setValoresStore()', async () => {
    component.store = component.store || {};
    component.store.setFormDatosCertificado = jest.fn();
    component.setValoresStore({});
  });

  it('should run #idiomOpcion()', async () => {
    component.ValidarInicialmenteCertificadoService = component.ValidarInicialmenteCertificadoService || {};
    component.ValidarInicialmenteCertificadoService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.idiomOpcion();
  });

  it('should run #entidadFederativasOpcion()', async () => {
    component.ValidarInicialmenteCertificadoService = component.ValidarInicialmenteCertificadoService || {};
    component.ValidarInicialmenteCertificadoService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.entidadFederativasOpcion();
  });
it('should call setFormValida', () => {
    const spy = jest.spyOn(store, 'setFormValida');
    component.store = store;
    component.setFormValida(true);
    expect(spy).toHaveBeenCalledWith({ datos: true });
  });
  it('should run #representacionFederalOpcion()', async () => {
    component.ValidarInicialmenteCertificadoService = component.ValidarInicialmenteCertificadoService || {};
    component.ValidarInicialmenteCertificadoService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.representacionFederalOpcion();
  });

  it('should run #obtenerDatosFormulario()', async () => {
    component.store = component.store || {};
    component.store.setFormDatosCertificado = jest.fn();
    component.obtenerDatosFormulario({});
  });

  it('should validateAll true/false and call setFormValida', () => {
    const spy = jest.spyOn(component, 'setFormValida');
    component.datosCertificadoDeRef = { validarFormularios: jest.fn(() => true) };
    expect(component.validateAll()).toBe(true);
    expect(spy).toHaveBeenCalledWith(true);
    component.datosCertificadoDeRef = { validarFormularios: jest.fn(() => false) };
    expect(component.validateAll()).toBe(false);
    expect(spy).toHaveBeenCalledWith(false);
    component.datosCertificadoDeRef = undefined;
    expect(component.validateAll()).toBe(true);
  });

  it('should run #idiomaSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setIdiomaSeleccion = jest.fn();
    component.idiomaSeleccion({});
  });

  it('should run #entidadFederativaSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setEntidadFederativaSeleccion = jest.fn();
    component.entidadFederativaSeleccion({});
  });

  it('should run #representacionFederalSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setRepresentacionFederalDatosSeleccion = jest.fn();
    component.representacionFederalSeleccion({});
  });
  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

});