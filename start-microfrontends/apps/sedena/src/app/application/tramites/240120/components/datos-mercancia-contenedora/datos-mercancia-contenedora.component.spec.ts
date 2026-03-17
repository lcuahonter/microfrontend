// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosMercanciaContenedoraComponent } from './datos-mercancia-contenedora.component';
import { Tramite240120Store } from '../../estados/tramite240120Store.store';
import { Tramite240120Query } from '../../estados/tramite240120Query.query';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { ActivatedRoute } from '@angular/router';

@Injectable()
class MockTramite240120Store {}

@Injectable()
class MockTramite240120Query {}

@Injectable()
class MockDatosSolicitudService {}

describe('DatosMercanciaContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240120Store, useClass: MockTramite240120Store },
        { provide: Tramite240120Query, useClass: MockTramite240120Query },
         { provide: DatosSolicitudService, useClass: MockDatosSolicitudService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { url: 'url', params: {}, queryParams: {}, data: {} },
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        }
      ]
    }).overrideComponent(DatosMercanciaContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosMercanciaContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.getMercanciaTablaDatos = jest.fn();
    component.ngOnInit();
  });

  it('should run #updateMercanciaDetalle()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateMercanciaTablaDatos = jest.fn();
    component.updateMercanciaDetalle({});
  });

  it('should run #actualizaExistenteEnDatosMercancias()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.actualizarMercanciasdatos = jest.fn();
    component.actualizaExistenteEnDatosMercancias({});
  });

  it('should run #cancelarClickeado()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.setModificarMercanciasDatos = jest.fn();
    component.cancelarClickeado();
  });

  it('should run #getMercanciaTablaDatos()', async () => {
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.getmodificarMercanciaTablaDatos$ = observableOf({});
    component.getMercanciaTablaDatos();

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

});