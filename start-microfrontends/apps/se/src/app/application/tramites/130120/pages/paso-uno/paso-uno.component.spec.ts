import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { PermisoImportacionService } from '../../services/permiso-importacion.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockPermisoImportacionService {
  obtenerRegistroTomarMuestrasDatos() {
    return observableOf(null);
  }
  actualizarEstadoFormulario() {}
}

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, PasoUnoComponent, HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        ConsultaioQuery,
        { provide: PermisoImportacionService, useClass: MockPermisoImportacionService }
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

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    // expect(component.destroyNotifier$.next).toHaveBeenCalled();
    // expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });
  it('should call guardarDatosFormulario if consultaState.update is true', () => {
    component.consultaState = { update: true } as any;
    const guardarDatosFormularioSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false', () => {
    component.consultaState = { update: false } as any;
    component.esDatosRespuesta = false;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });
  it('should change indice when seleccionaTab is called', () => {
    component.indice = 1;
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });
  it('should call next and complete on destroyNotifier$ when ngOnDestroy is called', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
  it('should set esDatosRespuesta to true and call actualizarEstadoFormulario when guardarDatosFormulario receives a response', () => {
    const mockResp = { foo: 'bar' };
    // Mock the permisoImportacionService methods
    const permisoImportacionService = TestBed.inject(PermisoImportacionService) as any;
    permisoImportacionService.obtenerRegistroTomarMuestrasDatos = jest.fn(() => observableOf(mockResp));
    permisoImportacionService.actualizarEstadoFormulario = jest.fn();

    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();

    expect(permisoImportacionService.obtenerRegistroTomarMuestrasDatos).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
    expect(permisoImportacionService.actualizarEstadoFormulario).toHaveBeenCalledWith(mockResp);
  });

  it('should not call actualizarEstadoFormulario if guardarDatosFormulario receives a falsy response', () => {
    const permisoImportacionService = TestBed.inject(PermisoImportacionService) as any;
    permisoImportacionService.obtenerRegistroTomarMuestrasDatos = jest.fn(() => observableOf(null));
    permisoImportacionService.actualizarEstadoFormulario = jest.fn();

    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();

    expect(permisoImportacionService.obtenerRegistroTomarMuestrasDatos).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(false);
    expect(permisoImportacionService.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });
});