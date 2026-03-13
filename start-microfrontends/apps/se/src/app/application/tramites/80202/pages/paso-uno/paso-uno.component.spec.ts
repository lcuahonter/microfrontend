// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { SeccionLibStore, ConsultaioQuery } from '@ng-mf/data-access-user';
import { PermisoImmexDatosService } from '../../services/permiso-immex-datos.service';

@Injectable()
class MockPermisoImmexDatosService {}

describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        SeccionLibStore,
        ConsultaioQuery,
        { provide: PermisoImmexDatosService, useClass: MockPermisoImmexDatosService }
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
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.guardarDatosFormulario = jest.fn();
    component.ngOnInit();
    expect(component.guardarDatosFormulario).not.toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab(2);
    expect(component.indice).toBe(2)

  });

  it('should run #guardarDatosFormulario()', async () => {
    component.permisoImmexDatosService = component.permisoImmexDatosService || {};
    component.permisoImmexDatosService.getRegistroTomaMuestrasMercanciasData = jest.fn().mockReturnValue(observableOf({}));
    component.permisoImmexDatosService.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
    expect(component.permisoImmexDatosService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
  });

});