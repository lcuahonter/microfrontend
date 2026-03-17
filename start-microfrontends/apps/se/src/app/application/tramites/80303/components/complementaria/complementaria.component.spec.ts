// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ComplementarioComponent } from './complementaria.component';
import { ModificacionProgramaImmexBajaSubmanufactureraService } from '../../services/modificacion-programa-immex-baja-submanufacturera.service';
import { Tramite80303Query } from '../../estados/tramite80303Query.query';

@Injectable()
class MockModificacionProgramaImmexBajaSubmanufactureraService {
  obtenerRespuestaPorUrl = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockTramite80303Query {
  selectTramiteState$ = observableOf({
    accionistasTablaDatos: {},
    federatariosTablaDatos: {},
    plantasIMMEXDatos: {},
    empresasSubmanufacturerasTablaDatos: {},
    plantasManufacturerasTablaDatos: {},
    serviciosImmexTablaDatos: {}
  });
}

describe('ComplementarioComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ComplementarioComponent, FormsModule, ReactiveFormsModule ],
      declarations: [],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ModificacionProgramaImmexBajaSubmanufactureraService, useClass: MockModificacionProgramaImmexBajaSubmanufactureraService },
        { provide: Tramite80303Query, useClass: MockTramite80303Query }
      ]
    }).overrideComponent(ComplementarioComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ComplementarioComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
    expect(component.modificacionProgramaImmexBajaSubmanufactureraService.obtenerRespuestaPorUrl).toHaveBeenCalledTimes(6);
  });

  it('should have proper data arrays initialized', () => {
    expect(component.accionistasTablaDatos).toEqual({});
    expect(component.federatariosTablaDatos).toEqual({});
    expect(component.plantasIMMEXDatos).toEqual({});
    expect(component.empresasSubmanufacturerasTablaDatos).toEqual({});
    expect(component.plantasManufacturerasTablaDatos).toEqual({});
    expect(component.serviciosImmexTablaDatos).toEqual({});
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.unsubscribe = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.unsubscribe).toHaveBeenCalled();
  });

});