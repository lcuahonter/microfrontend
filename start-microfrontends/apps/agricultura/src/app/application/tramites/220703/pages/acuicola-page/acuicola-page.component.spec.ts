// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AcuicolaPageComponent } from './acuicola-page.component';
import { SeccionQuery } from '../../../../estados/queries/seccion.query';
import { SeccionStore } from '../../../../estados/seccion.store';

@Injectable()
class MockSeccionQuery { }

@Injectable()
class MockSeccionStore { }

describe('AcuicolaPageComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, AcuicolaPageComponent],
      declarations: [
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: SeccionQuery, useClass: MockSeccionQuery },
        { provide: SeccionStore, useClass: MockSeccionStore }
      ]
    }).overrideComponent(AcuicolaPageComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AcuicolaPageComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.asignarSecciones = jest.fn();
    component.ngOnInit();
    expect(component.asignarSecciones).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

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