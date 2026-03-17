// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { FitosanitarioService } from '../../service/fitosanitario.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockFitosanitarioService {}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('TercerosRelacionadosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,TercerosRelacionadosComponent, ],
      declarations: [
        
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: FitosanitarioService, useClass: MockFitosanitarioService },
        ConsultaioQuery
      ]
    }).overrideComponent(TercerosRelacionadosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TercerosRelacionadosComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.inicializarEstadoFormulario();
   });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.getDatos = jest.fn();
    component.getDatosDestinatario = jest.fn();
    component.ngOnInit();
    });

  it('should run #guardarDatosFormulario()', async () => {

    component.guardarDatosFormulario();

  });

  it('should run #getDatos()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.getDatosExportador = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getDatos();
    });

  it('should run #getDatosDestinatario()', async () => {
    component.fitosanitarioService = component.fitosanitarioService || {};
    component.fitosanitarioService.getDatosDestinatarioInfo = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    component.getDatosDestinatario();
    });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.unsubscribe = jest.fn();
    component.ngOnDestroy();
   });

});