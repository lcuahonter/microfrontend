// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { RepresentacionFederalComponent } from './representacion-federal.component';
import { FormBuilder } from '@angular/forms';
import { AsignacionDirectaCupoPersonasFisicasPrimeraVezService } from '../../services/asignacion-directa-cupo-personas-fisicas-primera-vez.service';
import { Tramite120402Store } from '../../estados/tramites/tramite120402.store';
import { Tramite120402Query } from '../../estados/queries/tramite120402.query';
import { HttpClientModule } from '@angular/common/http';

@Injectable()
class MockAsignacionDirectaCupoPersonasFisicasPrimeraVezService {}

@Injectable()
class MockTramite120402Store {}

@Injectable()
class MockTramite120402Query {
  entidad$ = {};
  representacion$ = {};
}

describe('RepresentacionFederalComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule , RepresentacionFederalComponent,HttpClientModule],
      declarations: [
    
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: AsignacionDirectaCupoPersonasFisicasPrimeraVezService, useClass: MockAsignacionDirectaCupoPersonasFisicasPrimeraVezService },
        { provide: Tramite120402Store, useClass: MockTramite120402Store },
        { provide: Tramite120402Query, useClass: MockTramite120402Query }
      ]
    }).overrideComponent(RepresentacionFederalComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(RepresentacionFederalComponent);
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
    component.initializeForm = jest.fn();
    component.loadEntidad = jest.fn();
    component.loadRepresentacion = jest.fn();
    component.service = component.service || {};
    component.service.getEntidad = jest.fn().mockReturnValue(observableOf({}));
    component.service.getRepresentacion = jest.fn().mockReturnValue(observableOf({}));
    component.tramite120402Query = component.tramite120402Query || {};
    component.tramite120402Query.tramiteState$ = observableOf({
      entidad: {},
      representacion: {}
    });
    component.representacionForm = component.representacionForm || {};
    component.representacionForm.patchValue = jest.fn();
    component.ngOnInit();
    // expect(component.initializeForm).toHaveBeenCalled();
    // expect(component.loadEntidad).toHaveBeenCalled();
    // expect(component.loadRepresentacion).toHaveBeenCalled();
    // expect(component.service.getEntidad).toHaveBeenCalled();
    // expect(component.service.getRepresentacion).toHaveBeenCalled();
    // expect(component.representacionForm.patchValue).toHaveBeenCalled();
  });

    it('should run #inicializarEstadoFormulario() and enable/disable form', async () => {
      component.representacionForm = {
        disable: jest.fn(),
      };
      component.esFormularioSoloLectura = true;
      component.inicializarEstadoFormulario();
      expect(component.representacionForm.disable).toHaveBeenCalled();
    });

    it('should run #validarFormulario() and return true for valid form', async () => {
      component.representacionForm = {
        invalid: false,
        markAllAsTouched: jest.fn(),
        get: jest.fn().mockReturnValue({ touched: false }),
      };
      expect(component.validarFormulario()).toBe(true);
      expect(component.representacionForm.markAllAsTouched).not.toHaveBeenCalled();
    });

    it('should run #validarFormulario() and return false for invalid form', async () => {
      component.representacionForm = {
        invalid: true,
        markAllAsTouched: jest.fn(),
        get: jest.fn()
          .mockImplementation((name) => name === 'entidad' ? { touched: true } : { touched: false }),
      };
      expect(component.validarFormulario()).toBe(false);
      expect(component.representacionForm.markAllAsTouched).toHaveBeenCalled();
      expect(component.formTouched).toBe(true);
    });

    it('should run #getEntidad() and call store/setEntidad and loadRepresentacion', async () => {
      const setEntidadMock = jest.fn();
      const loadRepresentacionMock = jest.fn();
      component.representacionForm = {
        get: jest.fn().mockReturnValue({ value: 'MX' }),
      };
      component.tramite120402Store = { setEntidad: setEntidadMock };
      component.loadRepresentacion = loadRepresentacionMock;
      component.getEntidad();
      expect(setEntidadMock).toHaveBeenCalledWith('MX');
      expect(loadRepresentacionMock).toHaveBeenCalledWith('MX');
    });

    it('should run #getRepresentacionValor() and call store/setRepresentacion', async () => {
      const setRepresentacionMock = jest.fn();
      component.representacionForm = {
        get: jest.fn().mockReturnValue({ value: 'FED' }),
      };
      component.tramite120402Store = { setRepresentacion: setRepresentacionMock };
      component.getRepresentacionValor();
      expect(setRepresentacionMock).toHaveBeenCalledWith('FED');
    });

    it('should run #loadEntidad() and assign entidad array', async () => {
      const mockData = { datos: [{ id: 1, nombre: 'Entidad1' }] };
      component.service = {
        getEntidad: jest.fn().mockReturnValue(observableOf(mockData)),
      };
      component.entidad = [];
      component.loadEntidad();
      setTimeout(() => {
        expect(component.entidad).toEqual(mockData.datos);
      }, 0);
    });

    it('should run #loadRepresentacion() and assign representacion array', async () => {
      const mockData = { datos: [{ id: 2, nombre: 'Rep1' }] };
      component.service = {
        getRepresentacion: jest.fn().mockReturnValue(observableOf(mockData)),
      };
      component.representacion = [];
      component.loadRepresentacion('MX');
      setTimeout(() => {
        expect(component.representacion).toEqual(mockData.datos);
      }, 0);
    });

  it('should run #ngOnDestroy()', async () => {
    component.destroyed$ = component.destroyed$ || {};
    component.destroyed$.next = jest.fn();
    component.destroyed$.complete = jest.fn();
    component.ngOnDestroy();
    // expect(component.destroyed$.next).toHaveBeenCalled();
    // expect(component.destroyed$.complete).toHaveBeenCalled();
  });

  it('should run #initializeForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.initializeForm();
    // expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #loadEntidad()', async () => {
    component.service = component.service || {};
    component.service.getEntidad = jest.fn().mockReturnValue(observableOf({}));
    component.loadEntidad();
    // expect(component.service.getEntidad).toHaveBeenCalled();
  });

  it('should run #loadRepresentacion()', async () => {
    component.service = component.service || {};
    component.service.getRepresentacion = jest.fn().mockReturnValue(observableOf({}));
    component.loadRepresentacion();
    // expect(component.service.getRepresentacion).toHaveBeenCalled();
  });

  it('should run #getEntidad()', async () => {
    component.representacionForm = component.representacionForm || {};
    component.representacionForm.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.tramite120402Store = component.tramite120402Store || {};
    component.tramite120402Store.setEntidad = jest.fn();
    component.getEntidad();
    // expect(component.representacionForm.get).toHaveBeenCalled();
    // expect(component.tramite120402Store.setEntidad).toHaveBeenCalled();
  });

  it('should run #getRepresentacion()', async () => {
    component.representacionForm = component.representacionForm || {};
    component.representacionForm.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.tramite120402Store = component.tramite120402Store || {};
    component.tramite120402Store.setRepresentacion = jest.fn();
    component.getRepresentacion();
    // expect(component.representacionForm.get).toHaveBeenCalled();
    // expect(component.tramite120402Store.setRepresentacion).toHaveBeenCalled();
  });



});