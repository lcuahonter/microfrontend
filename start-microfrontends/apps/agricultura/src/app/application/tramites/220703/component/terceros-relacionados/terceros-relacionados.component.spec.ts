// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { AcuicolaService } from '../../service/acuicola.service';

@Injectable()
class MockAcuicolaService { }


describe('TercerosRelacionadosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TercerosRelacionadosComponent],
      declarations: [

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: AcuicolaService, useClass: MockAcuicolaService }
      ]
    }).overrideComponent(TercerosRelacionadosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TercerosRelacionadosComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function () { };
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.getExportadorDatos = jest.fn();
    component.getDestinoDatos = jest.fn();
    component.ngOnInit();
    expect(component.getExportadorDatos).toHaveBeenCalled();
    expect(component.getDestinoDatos).toHaveBeenCalled();
  });

  it('should run #getExportadorDatos()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.getExportadorDatos = jest.fn().mockReturnValue(observableOf({}));
    component.getExportadorDatos();
    expect(component.acuicolaService.getExportadorDatos).toHaveBeenCalled();
  });

  it('should run #getDestinoDatos()', async () => {
    component.acuicolaService = component.acuicolaService || {};
    component.acuicolaService.getDestinoDatos = jest.fn().mockReturnValue(observableOf({}));
    component.getDestinoDatos();
    expect(component.acuicolaService.getDestinoDatos).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.unsubscribe = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.unsubscribe).toHaveBeenCalled();
  });

});