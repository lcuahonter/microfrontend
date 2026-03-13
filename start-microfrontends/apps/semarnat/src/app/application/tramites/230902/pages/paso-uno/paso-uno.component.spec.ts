// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite230902Query } from '../../estados/tramite230902.query';
import { PermisoCitesService } from '../../services/permiso-cites.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockTramite230902Query {}

@Injectable()
class MockPermisoCitesService {}

describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoUnoComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite230902Query, useClass: MockTramite230902Query },
        { provide: PermisoCitesService, useClass: MockPermisoCitesService },
        ConsultaioQuery
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
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
    component.tramite230901Query = component.tramite230901Query || {};
    component.tramite230901Query.selectSolicitud$ = observableOf({
      tipodeMovimiento: {}
    });
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.guardarDatosFormulario = jest.fn();
    component.ngOnInit();
    // expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.permisoCitesService = component.permisoCitesService || {};
    component.permisoCitesService.getRegistroTomaMuestrasMercanciasData = jest.fn().mockReturnValue(observableOf({}));
    component.permisoCitesService.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
    // expect(component.permisoCitesService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    // expect(component.permisoCitesService.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #ngAfterViewInit()', async () => {
    component.solicitante = component.solicitante || {};
    component.solicitante.obtenerTipoPersona = jest.fn();
    component.ngAfterViewInit();
    // expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    // expect(component.destroyNotifier$.next).toHaveBeenCalled();
    // expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

});