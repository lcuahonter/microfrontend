// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

import { Component } from '@angular/core';
import { DatosDelTramiteContenedoraComponent } from './datos-del-tramite-contenedora.component';
import { Tramite240105Query } from '../../estados/tramite240105Query.query';
import { Tramite240105Store } from '../../estados/tramite240105Store.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockTramite240105Query {}

@Injectable()
class MockTramite240105Store {}


describe('DatosDelTramiteContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, ModalComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240105Query, useClass: MockTramite240105Query },
        { provide: Tramite240105Store, useClass: MockTramite240105Store },
        ConsultaioQuery,
          { provide: ActivatedRoute, useValue: { snapshot: {}, params: {}, queryParams: {} } }
        
      ]
    }).overrideComponent(DatosDelTramiteContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosDelTramiteContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.getMercanciaTablaDatos$ = observableOf({});
    component.tramiteQuery.getDatosDelTramite$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalled();
  });

  it('should run #updateDatosDelTramiteFormulario()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateDatosDelTramiteFormState = jest.fn();
    component.updateDatosDelTramiteFormulario({});
    expect(component.tramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalled();
  });

  it('should run #openModal()', async () => {
    component.modalComponent = component.modalComponent || {};
    component.modalComponent.abrir = jest.fn();
    component.cerrarModal = component.cerrarModal || {};
    component.cerrarModal.bind = jest.fn();
    component.openModal('Datosmercancia');
    expect(component.modalComponent.abrir).toHaveBeenCalled();
  });

  it('should run #cerrarModal()', async () => {
    component.modalComponent = component.modalComponent || {};
    component.modalComponent.cerrar = jest.fn();
    component.cerrarModal();
    expect(component.modalComponent.cerrar).toHaveBeenCalled();
  });

  it('should run #eliminarMercanciasDatos()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.eliminarMercancias = jest.fn();
    component.eliminarMercanciasDatos({test: 1});
    expect(component.tramiteStore.eliminarMercancias).toHaveBeenCalled();
  });

});