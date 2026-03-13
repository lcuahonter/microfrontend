// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosMercanciaContenedoraComponent } from './datos-mercancia-contenedora.component';
import { Tramite240108Store } from '../../estados/tramite240108Store.store';
import { Router, ActivatedRoute } from '@angular/router';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite240108Store {
  updateMercanciaTablaDatos(){}
}

describe('DatosMercanciaContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule , HttpClientTestingModule],

      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240108Store, useClass: MockTramite240108Store },
        DatosSolicitudService,
         {
                          provide: ActivatedRoute,
                          useValue: {
                            snapshot: {url: 'url', params: {}, queryParams: {}, data: {}},
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

  it('should run #updateMercanciaDetalle()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateMercanciaTablaDatos = jest.fn();
    component.updateMercanciaDetalle({});
    expect(component.tramiteStore.updateMercanciaTablaDatos).toHaveBeenCalled();
  });

});