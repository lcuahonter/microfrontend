// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite240120Query } from '../../estados/tramite240120Query.query';
import { Tramite240120Store } from '../../estados/tramite240120Store.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { PermisoExportacionPirotecniaService } from '../../services/permiso-exportacion-pirotecnia.service';

@Injectable()
class MockTramite240120Query {}

@Injectable()
class MockTramite240120Store {}

@Injectable()
class MockPermisoExportacionPirotecniaService {}

describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240120Query, useClass: MockTramite240120Query },
        { provide: Tramite240120Store, useClass: MockTramite240120Store },
        ConsultaioQuery,
        { provide: PermisoExportacionPirotecniaService, useClass: MockPermisoExportacionPirotecniaService }
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
    component.tramite240120Query = component.tramite240120Query || {};
    component.tramite240120Query.getTabSeleccionado$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.guardarDatosFormulario = jest.fn();
    component.ngOnInit();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.permisoExportacionPirotecniaService = component.permisoExportacionPirotecniaService || {};
    component.permisoExportacionPirotecniaService.obtenerRegistroTomarMuestrasDatos = jest.fn().mockReturnValue(observableOf({}));
    component.permisoExportacionPirotecniaService.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
    expect(component.permisoExportacionPirotecniaService.obtenerRegistroTomarMuestrasDatos).toHaveBeenCalled();
    expect(component.permisoExportacionPirotecniaService.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {
    component.tramite240120Store = component.tramite240120Store || {};
    component.tramite240120Store.updateTabSeleccionado = jest.fn();
    component.seleccionaTab({});
    expect(component.tramite240120Store.updateTabSeleccionado).toHaveBeenCalled();
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