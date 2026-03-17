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
import { CambioModalidadService } from '../../service/cambio-modalidad.service';

@Injectable()
class MockCambioModalidadService {}


describe('PasoUnoComponent', () => {
  let fixture;
  let component;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoUnoComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        SeccionLibStore,
        ConsultaioQuery,
        { provide: CambioModalidadService, useClass: MockCambioModalidadService }
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
    component.asignarSecciones = jest.fn();
    component.ngOnInit();
    
    expect(component.asignarSecciones).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.modalidadService = component.modalidadService || {};
    component.modalidadService.getDatosDeLaSolicitudData = jest.fn().mockReturnValue(observableOf({}));
    component.modalidadService.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
    expect(component.modalidadService.getDatosDeLaSolicitudData).toHaveBeenCalled();
    expect(component.modalidadService.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {
    component.tabChanged = component.tabChanged || {};
    component.tabChanged.emit = jest.fn();
    component.seleccionaTab({});
    expect(component.tabChanged.emit).toHaveBeenCalled();
  });

  it('should run #asignarSecciones()', async () => {
    component.seccionStore = component.seccionStore || {};
    component.seccionStore.establecerSeccion = jest.fn();
    component.seccionStore.establecerFormaValida = jest.fn();
    component.asignarSecciones();
    expect(component.seccionStore.establecerSeccion).toHaveBeenCalled();
    expect(component.seccionStore.establecerFormaValida).toHaveBeenCalled();
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