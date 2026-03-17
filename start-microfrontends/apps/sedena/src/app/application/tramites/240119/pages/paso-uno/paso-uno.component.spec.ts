// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite240119Query } from '../../estados/tramite240119Query.query';
import { Tramite240119Store } from '../../estados/tramite240119Store.store';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { ArtefactosPirotecnicosOrdinariosService } from '../../services/artefactos-pirotecnicos-ordinarios.service';

@Injectable()
class MockTramite240119Query {}

@Injectable()
class MockTramite240119Store {}

@Injectable()
class MockArtefactosPirotecnicosOrdinariosService {}


describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240119Query, useClass: MockTramite240119Query },
        { provide: Tramite240119Store, useClass: MockTramite240119Store },
        ConsultaioQuery,
        { provide: ArtefactosPirotecnicosOrdinariosService, useClass: MockArtefactosPirotecnicosOrdinariosService }
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
    component.tramite240119Query = component.tramite240119Query || {};
    component.tramite240119Query.getTabSeleccionado$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.guardarDatosFormulario = jest.fn();
    component.ngOnInit();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.artefactosPirotecnicosOrdinariosService = component.artefactosPirotecnicosOrdinariosService || {};
    component.artefactosPirotecnicosOrdinariosService.obtenerRegistroTomarMuestrasDatos = jest.fn().mockReturnValue(observableOf({}));
    component.artefactosPirotecnicosOrdinariosService.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
    expect(component.artefactosPirotecnicosOrdinariosService.obtenerRegistroTomarMuestrasDatos).toHaveBeenCalled();
    expect(component.artefactosPirotecnicosOrdinariosService.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {
    component.tramite240119Store = component.tramite240119Store || {};
    component.tramite240119Store.updateTabSeleccionado = jest.fn();
    component.seleccionaTab({});
    expect(component.tramite240119Store.updateTabSeleccionado).toHaveBeenCalled();
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