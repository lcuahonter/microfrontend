// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { ImportacionDeAcuiculturaService } from '../../servicios/importacion-de-agricultura.service';
import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { HttpClientModule } from '@angular/common/http';

@Injectable()
class ConsultaioQuery {}

@Injectable()
class MockImportacionDeAcuiculturaService {}

describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,PasoUnoComponent, HttpClientModule],
      declarations: [],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        ConsultaioQuery,
        { provide: ImportacionDeAcuiculturaService, useClass: MockImportacionDeAcuiculturaService }
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

  it('should run #guardarDatosFormulario()', async () => {
    component.importacionDeAcuiculturaService = component.importacionDeAcuiculturaService || {};
    component.importacionDeAcuiculturaService.getDatosDeLaSolicitudData = jest.fn().mockReturnValue(observableOf({
      personas: {}
    }));
    component.importacionDeAcuiculturaService.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
 });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

  it('should run #seleccionaTab()', async () => {
    component.tabChanged = component.tabChanged || {};
    component.tabChanged.emit = jest.fn();
    component.seleccionaTab({});
  });

  it('should run #seleccionaPestana()', async () => {
    component.seleccionaPestana({});
  });
});