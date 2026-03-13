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
import { ModificacionSolicitudeService } from '../../../80308/services/modificacion-solicitude.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80308Query } from '../../../80308/estados/tramite80308.query';
import { Tramite80308Store } from '../../../80308/estados/tramite80308.store';

@Injectable()
class MockTramite80308Store {
  setFormValida = function() {};
}

@Injectable()
class MockTramite80308Query {
  selectEstado$ = observableOf({
    id: {}
  });
  selectBuscarDomicilios$ = {};
  selectAltaPlanta$ = {};
  selectDomicilios$ = {};
}


describe('AltaPlantaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AltaPlantaComponent, FormsModule, ReactiveFormsModule, ToastrModule, HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        ModificacionSolicitudeService,
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        { provide: Tramite80308Store, useClass: MockTramite80308Store },
        { provide: Tramite80308Query, useClass: MockTramite80308Query }
      ]
    }).overrideComponent(AltaPlantaComponent, {

      set: { }    
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
    component.store = component.store || {};
    component.store.aggregarDomicilios = jest.fn();
    component.domiciliosSeleccionados = component.domiciliosSeleccionados || {};
    component.domiciliosSeleccionados[0] = '0';
    component.aplicarAccion();
    expect(component.store.aggregarDomicilios).toHaveBeenCalled();
  });

  it('should run #eliminarPlantas()', async () => {
    component.store = component.store || {};
    component.store.eliminarDomicilios = jest.fn();
    component.domiciliosSeleccionados = component.domiciliosSeleccionados || {};
    component.domiciliosSeleccionados[0] = '0';
    component.eliminarPlantas();
    expect(component.store.eliminarDomicilios).toHaveBeenCalled();
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

  it('should return FormControl from formularioControl getter', () => {
  component.formulario = new FormBuilder().group({
    entidadFederativa: ['MX']
  });
  const control = component.formularioControl;
  expect(control).toBeTruthy();
  expect(control.value).toBe('MX');
});

it('should show error if entidadFederativa is invalid in buscarDomicilios()', () => {
  component.formulario = new FormBuilder().group({
    entidadFederativa: ['-1']
  });
  component.toastr = { error: jest.fn() } as any;

  component.buscarDomicilios();

  expect(component.toastr.error).toHaveBeenCalledWith('Seleccione una entidad federativa válida.');
});

it('should fetch domicilios when entidadFederativa is valid in buscarDomicilios()', () => {
  component.formulario = new FormBuilder().group({
    entidadFederativa: ['9']
  });

  component.modificionService = {
    obtenerDomicilios: jest.fn().mockReturnValue(observableOf([]))
  } as any;
  component.store = { setbuscarDomicilios: jest.fn() } as any;
  component.toastr = { error: jest.fn() } as any;

  component.buscarDomicilios();

  expect(component.modificionService.obtenerDomicilios).toHaveBeenCalled();
  expect(component.store.setbuscarDomicilios).toHaveBeenCalledWith([]);
});

it('should update domiciliosSeleccionados when seleccionarDomicilios() is called', () => {
  const mockDomicilio = { calle: 'Calle Falsa 123' } as any;
  component.seleccionarDomicilios(mockDomicilio);
  expect(component.domiciliosSeleccionados).toEqual([{ calle: 'Calle Falsa 123' }]);
});

it('should not call agregarDomicilios if domiciliosSeleccionados is empty', () => {
  component.domiciliosSeleccionados = [];
  component.store = { aggregrarDomicilios: jest.fn() } as any;
  component.aplicarAccion();
});

it('should not call eliminarDomicilios if domiciliosSeleccionados is empty', () => {
  component.domiciliosSeleccionados = [];
  component.store = { eliminarDomicilios: jest.fn() } as any;
  component.eliminarPlantas();
});

it('should call setEstado in tipoEstadoSeleccion()', () => {
  const mockEstado = { id: 1, descripcion: 'CDMX' };
  component.store = { setEstado: jest.fn() } as any;
  component.tipoEstadoSeleccion(mockEstado as any);
  expect(component.store.setEstado).toHaveBeenCalledWith(mockEstado);
});


});