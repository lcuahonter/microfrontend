// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite260202Query } from '../../estados/tramite260202Query.query';
import { Tramite260202Store } from '../../estados/tramite260202Store.store';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable()
class MockTramite260202Query {}

@Injectable()
class MockTramite260202Store {}


describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientModule ],
      declarations: [
        PasoUnoComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite260202Query, useClass: MockTramite260202Query },
        { provide: Tramite260202Store, useClass: MockTramite260202Store }
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramite260202Query = component.tramite260202Query || {};
    component.tramite260202Query.getTabSeleccionado$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #seleccionaTab()', async () => {
    component.tramite260202Store = component.tramite260202Store || {};
    component.tramite260202Store.updateTabSeleccionado = jest.fn();
    component.seleccionaTab({});
    expect(component.tramite260202Store.updateTabSeleccionado).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.getRegistroTomaMuestrasMercanciasData = jest.fn().mockReturnValue(observableOf({}));
    component.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
    expect(component.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(component.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    const mockData = { key: 'value' };
    component.tramite260202Store = component.tramite260202Store || {};
    component.tramite260202Store.update = jest.fn();
    component.actualizarEstadoFormulario(mockData);
    expect(component.tramite260202Store.update).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should run #getRegistroTomaMuestrasMercanciasData()', async () => {
    const mockHttpClient = TestBed.inject(HttpClient);
    jest.spyOn(mockHttpClient, 'get').mockReturnValue(observableOf({}));
    const result = component.getRegistroTomaMuestrasMercanciasData();
    expect(mockHttpClient.get).toHaveBeenCalledWith('assets/json/260202/respuestaDeActualizacionDe.json');
    result.subscribe((data) => {
      expect(data).toEqual({});
    });
  });
});