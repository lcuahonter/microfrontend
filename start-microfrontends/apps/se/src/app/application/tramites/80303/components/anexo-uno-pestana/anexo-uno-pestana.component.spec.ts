// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AnexoUnoPestanaComponent } from './anexo-uno-pestana.component';
import { ModificacionProgramaImmexBajaSubmanufactureraService } from '../../services/modificacion-programa-immex-baja-submanufacturera.service';
import { Tramite80303Query } from '../../estados/tramite80303Query.query';

@Injectable()
class MockModificacionProgramaImmexBajaSubmanufactureraService {
  obtenerRespuestaPorUrl = function() {};
}

@Injectable()
class MockTramite80303Query {
  selectTramiteState$ = observableOf({
    anexoExportacionTablaDatos: {},
    anexoImportacionTablaDatos: {},
    sensiblesTablaDatos: {}
  });
}

describe('AnexoUnoPestanaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ AnexoUnoPestanaComponent, FormsModule, ReactiveFormsModule ],
      declarations: [],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ModificacionProgramaImmexBajaSubmanufactureraService, useClass: MockModificacionProgramaImmexBajaSubmanufactureraService },
        { provide: Tramite80303Query, useClass: MockTramite80303Query }
      ]
    }).overrideComponent(AnexoUnoPestanaComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AnexoUnoPestanaComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
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