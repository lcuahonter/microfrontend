// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite240112Query } from '../../estados/tramite240112Query.query';
import { Tramite240112Store } from '../../estados/tramite240112Store.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { AgregarDestinatarioService } from '../../service/agregar-destinatario.service';

@Injectable()
class MockTramite240112Query {}

@Injectable()
class MockTramite240112Store {}

@Injectable()
class MockAgregarDestinatarioService {}

describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, PasoUnoComponent ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240112Query, useClass: MockTramite240112Query },
        { provide: Tramite240112Store, useClass: MockTramite240112Store },
        ConsultaioQuery,
        { provide: AgregarDestinatarioService, useClass: MockAgregarDestinatarioService }
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
    component.tramite240112Query = component.tramite240112Query || {};
    component.tramite240112Query.getTabSeleccionado$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({
      update: {},
      readonly: {}
    });
    component.guardarDatosFormulario = jest.fn();
    component.ngOnInit();
    // expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.agregarDestinatarioService = component.agregarDestinatarioService || {};
    component.agregarDestinatarioService.getAcuiculturaData = jest.fn().mockReturnValue(observableOf({}));
    component.agregarDestinatarioService.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
    // expect(component.agregarDestinatarioService.getAcuiculturaData).toHaveBeenCalled();
    // expect(component.agregarDestinatarioService.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {
    component.tramite240112Store = component.tramite240112Store || {};
    component.tramite240112Store.updateTabSeleccionado = jest.fn();
    component.seleccionaTab({});
    // expect(component.tramite240112Store.updateTabSeleccionado).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    // expect(component.destroyNotifier$.next).toHaveBeenCalled();
    // expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});