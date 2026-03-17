// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { ActivatedRoute } from '@angular/router';
import { SeccionLibStore } from '@libs/shared/data-access-user/src';


describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientModule ],
      declarations: [
        PasoUnoComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
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
        },
        SeccionLibStore,
        {
          provide: 'HttpClientMock',
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn()
          }
        }
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy = () => {}; 
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.route = component.route || {};
    component.route.queryParams = observableOf({});
    component.seccionesDeLaSolicitud = component.seccionesDeLaSolicitud || {};
    component.ngOnInit();

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
      expect(component.destroyNotifier$.next).toHaveBeenCalled();
      expect(component.destroyNotifier$.complete).toHaveBeenCalled();
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

});