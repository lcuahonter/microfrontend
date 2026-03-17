// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PeruDestinatarioComponent } from './peru-destinatario.component';
import { FormBuilder } from '@angular/forms';
import { Tramite110205Store } from '../../estados/tramite110205.store';
import { Tramite110205Query } from '../../estados/tramite110205.query';
import { SeccionLibQuery } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockTramite110205Store {}

@Injectable()
class MockTramite110205Query {
  selectFormDatosDelDestinatario$ = observableOf({});
  selectFormDestinatario$ = observableOf({});
  selectFormExportador$ = observableOf({});
}

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

describe('PeruDestinatarioComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        FormsModule, 
        ReactiveFormsModule
      ],
      declarations: [
        PeruDestinatarioComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Tramite110205Store, useClass: MockTramite110205Store },
        { provide: Tramite110205Query, useClass: MockTramite110205Query },
        SeccionLibQuery,
        ConsultaioQuery
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(PeruDestinatarioComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.query = component.query || {};
    component.query.selectPeru$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #setValoresStoreDatos()', async () => {
    component.store = component.store || {};
    component.store.setFormDatosDelDestinatario = jest.fn();
    component.setValoresStoreDatos({});
  });

  it('should run #setValoresStoreDe()', async () => {
    component.store = component.store || {};
    component.store.setFormDestinatario = jest.fn();
    component.setValoresStoreDe({});
  });

  it('should run #setFormValida()', async () => {
    component.store = component.store || {};
    component.store.setFormValida = jest.fn();
    component.setFormValida({});
  });

  it('should run #setFormValidaExportador()', async () => {
    component.store = component.store || {};
    component.store.setFormValida = jest.fn();
    component.setFormValidaExportador({});
  });

  it('should run #setFormValidaDestinatario()', async () => {
    component.store = component.store || {};
    component.store.setFormValida = jest.fn();
    component.setFormValidaDestinatario({});
  });

 

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    
  });

});