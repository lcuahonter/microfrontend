// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { ToastrModule, provideToastr } from 'ngx-toastr';

import { Component } from '@angular/core';
import { AltaPlantaComponent } from './alta-planta.component';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ModificacionSolicitudeService } from '../../services/modificacion-solicitude.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80308Store } from '../../estados/tramite80308.store';
import { Tramite80308Query } from '../../estados/tramite80308.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockTramite80308Store {
  setFormValida = function() {};
}

@Injectable()
class MockTramite80308Query {
  selectEstado$ = observableOf({
    id: {}
  });
  selectBuscarDomicilios$ = observableOf([]);
  selectAltaPlanta$ = observableOf([]);
  selectDomicilios$ = observableOf([]);
}

@Injectable()
class MockConsultaioQuery {
  selectConsultaioState$ = observableOf({ readonly: false });
}


describe('AltaPlantaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ AltaPlantaComponent, FormsModule, ReactiveFormsModule, ToastrModule, HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        ModificacionSolicitudeService,
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        { provide: Tramite80308Store, useClass: MockTramite80308Store },
        { provide: Tramite80308Query, useClass: MockTramite80308Query },
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AltaPlantaComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #formularioControl', async () => {
    component.formulario = component.formulario || {};
    component.formulario.get = jest.fn();
    const formularioControl = component.formularioControl;
    expect(component.formulario.get).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.cargarEstados = jest.fn();
    component.ngOnInit();
    expect(component.cargarEstados).toHaveBeenCalled();
  });

    describe('#guardarDatosFormulario', () => {
      beforeEach(() => {
        component.formulario = {
          disable: jest.fn(),
          enable: jest.fn(),
        } as any;
      });

      it('should disable the form if esFormularioSoloLectura is true', () => {
        component.esFormularioSoloLectura = true;
        component.guardarDatosFormulario();
        expect(component.formulario.disable).toHaveBeenCalled();
        expect(component.formulario.enable).not.toHaveBeenCalled();
      });

      it('should enable the form if esFormularioSoloLectura is false', () => {
        component.esFormularioSoloLectura = false;
        component.guardarDatosFormulario();
        expect(component.formulario.enable).toHaveBeenCalled();
        expect(component.formulario.disable).not.toHaveBeenCalled();
      });

      it('should do nothing if esFormularioSoloLectura is undefined', () => {
        component.esFormularioSoloLectura = undefined;
        component.guardarDatosFormulario();
        expect(component.formulario.enable).not.toHaveBeenCalled();
        expect(component.formulario.disable).not.toHaveBeenCalled();
      });
    });

  it('should run #cargarEstados()', async () => {
    component.modificionService = component.modificionService || {};
    component.modificionService.obtenerListaEstado = jest.fn().mockReturnValue(observableOf({}));
    component.store = component.store || {};
    component.store.setaltaPlanta = jest.fn();
    component.cargarEstados();
    expect(component.modificionService.obtenerListaEstado).toHaveBeenCalled();
    expect(component.store.setaltaPlanta).toHaveBeenCalled();
  });

  it('should run #buscarDomicilios()', async () => {
    component.modificionService = component.modificionService || {};
    component.modificionService.obtenerDomicilios = jest.fn().mockReturnValue(observableOf({}));
    component.store = component.store || {};
    component.store.setbuscarDomicilios = jest.fn();
    component.toastr = component.toastr || {};
    component.toastr.error = jest.fn();
    component.buscarDomicilios();
    expect(component.modificionService.obtenerDomicilios).toHaveBeenCalled();
    expect(component.store.setbuscarDomicilios).toHaveBeenCalled();
  });

  it('should run #seleccionarDomicilios()', async () => {

    component.seleccionarDomicilios({});

  });

  it('should run #aplicarAccion()', async () => {
    component.domiciliosSeleccionados = [{ id: 1, calle: 'Test Street' }];
    
    component.aplicarAccion();
    
    expect(component.nuevaNotificacion).toBeTruthy();
    expect(component.nuevaNotificacion.categoria).toBe('info');
    expect(component.nuevaNotificacion.modo).toBe('confirmacion');
  });

  it('should run #aplicarAccion() with no selection', async () => {
    component.domiciliosSeleccionados = [];
    
    component.aplicarAccion();
    
    expect(component.nuevaNotificacion).toBeTruthy();
    expect(component.nuevaNotificacion.categoria).toBe('warning');
  });

  it('should run #confirmacionModal() and call store.aggregarDomicilios', async () => {
    component.store = component.store || {};
    component.store.aggregarDomicilios = jest.fn();
    component.toastr = component.toastr || {};
    component.toastr.success = jest.fn();
    component.domiciliosSeleccionados = [{ id: 1, calle: 'Test Street' }];
    component.nuevaNotificacion = { txtBtnAceptar: 'Aceptar' };
    
    component.confirmacionModal(true);
    
    expect(component.store.aggregarDomicilios).toHaveBeenCalledWith(component.domiciliosSeleccionados[0]);
    expect(component.toastr.success).toHaveBeenCalledWith('Planta agregada exitosamente');
  });

  it('should run #eliminarPlantas()', async () => {
    component.domiciliosSeleccionados = [{ id: 1, calle: 'Test Street' }];
    
    component.eliminarPlantas();
    
    expect(component.nuevaNotificacion).toBeTruthy();
    expect(component.nuevaNotificacion.categoria).toBe('warning');
    expect(component.nuevaNotificacion.txtBtnAceptar).toBe('Eliminar');
  });

  it('should run #eliminarPlantas() with no selection', async () => {
    component.domiciliosSeleccionados = [];
    
    component.eliminarPlantas();
    
    expect(component.nuevaNotificacion).toBeTruthy();
    expect(component.nuevaNotificacion.categoria).toBe('warning');
  });

  it('should run #confirmacionModal() for elimination and call store.eliminarDomicilios', async () => {
    component.store = component.store || {};
    component.store.eliminarDomicilios = jest.fn();
    component.toastr = component.toastr || {};
    component.toastr.success = jest.fn();
    component.domiciliosSeleccionados = [{ id: 1, calle: 'Test Street' }];
    component.nuevaNotificacion = { txtBtnAceptar: 'Eliminar' };
    
    component.confirmacionModal(true);
    
    expect(component.store.eliminarDomicilios).toHaveBeenCalledWith(component.domiciliosSeleccionados[0]);
    expect(component.toastr.success).toHaveBeenCalledWith('Planta eliminada exitosamente');
  });

  it('should run #tipoEstadoSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setEstado = jest.fn();
    component.tipoEstadoSeleccion({});
    expect(component.store.setEstado).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});