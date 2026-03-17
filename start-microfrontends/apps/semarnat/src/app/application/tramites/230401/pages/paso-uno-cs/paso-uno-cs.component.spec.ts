// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoCsComponent } from './paso-uno-cs.component';
import { SeccionLibStore } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { PantallasActionService } from '../../services/pantallas-action.service';

@Injectable()
class MockPantallasActionService {}





describe('PasoUnoCsComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoUnoCsComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        SeccionLibStore,
        ConsultaioQuery,
        { provide: PantallasActionService, useClass: MockPantallasActionService }
      ]
    }).overrideComponent(PasoUnoCsComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoCsComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

  it('should run #asignarSecciones()', async () => {
    component.seccionStore = component.seccionStore || {};
    component.seccionStore.establecerSeccion = jest.fn();
    component.seccionStore.establecerFormaValida = jest.fn();
    component.asignarSecciones();
    // expect(component.seccionStore.establecerSeccion).toHaveBeenCalled();
    // expect(component.seccionStore.establecerFormaValida).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.pantallasActionService = component.pantallasActionService || {};
    component.pantallasActionService.getRegistroTomaMuestrasMercanciasData = jest.fn().mockReturnValue(observableOf({}));
    component.pantallasActionService.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
    // expect(component.pantallasActionService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    // expect(component.pantallasActionService.actualizarEstadoFormulario).toHaveBeenCalled();
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