// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosDelTramiteContenedoraComponent } from './datos-del-tramite-contenedora.component';
import { Tramite240120Query } from '../../estados/tramite240120Query.query';
import { Tramite240120Store } from '../../estados/tramite240120Store.store';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Injectable()
class MockTramite240120Query { }

@Injectable()
class MockTramite240120Store { }

describe('DatosDelTramiteContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule,ModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Tramite240120Query, useClass: MockTramite240120Query },
        { provide: Tramite240120Store, useClass: MockTramite240120Store },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              queryParams: {}
            }
          }
        },
        ConsultaioQuery
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

  it('should run #updateDatosDelTramiteFormulario()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateDatosDelTramiteFormState = jest.fn();
    component.updateDatosDelTramiteFormulario({});
    expect(component.tramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
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