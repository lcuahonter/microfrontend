import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { FormBuilder } from '@angular/forms';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { SolicitudService } from '../../service/solicitud.service';

@Injectable()
class MockSolicitudService {}

describe('PasoUnoComponent', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: { ngOnDestroy: () => void; consultaQuery: { selectConsultaioState$?: any; }; guardarDatosFormularios: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; solicitud: { getRegistroTomaMuestrasMercanciasData?: any; actualizarEstadoFormulario?: any; }; solicitante: { obtenerTipoPersona?: any; }; ngAfterViewInit: () => void; indiceNombre: { emit?: any; }; seleccionaTab: (arg0: {}, arg1: {}) => void; destroyed$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoUnoComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        ConsultaioQuery,
        { provide: SolicitudService, useClass: MockSolicitudService }
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
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.guardarDatosFormularios = jest.fn();
    component.ngOnInit();
    // expect(component.guardarDatosFormularios).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormularios()', async () => {
    component.solicitud = component.solicitud || {};
    component.solicitud.getRegistroTomaMuestrasMercanciasData = jest.fn().mockReturnValue(observableOf({}));
    component.solicitud.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormularios();
    // expect(component.solicitud.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    // expect(component.solicitud.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #ngAfterViewInit()', async () => {
    component.solicitante = component.solicitante || {};
    component.solicitante.obtenerTipoPersona = jest.fn();
    component.ngAfterViewInit();
    // expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {
    component.indiceNombre = component.indiceNombre || {};
    component.indiceNombre.emit = jest.fn();
    component.seleccionaTab({}, {});
    // expect(component.indiceNombre.emit).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyed$ = component.destroyed$ || {};
    component.destroyed$.next = jest.fn();
    component.destroyed$.complete = jest.fn();
    component.ngOnDestroy();
    // expect(component.destroyed$.next).toHaveBeenCalled();
    // expect(component.destroyed$.complete).toHaveBeenCalled();
  });

});