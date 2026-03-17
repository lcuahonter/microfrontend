// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitanteComponent } from './solicitante.component';
import { FormBuilder } from '@angular/forms';
import { Tramite6402Store } from '../../estados/tramite6402.store';
import { Tramite6402Query } from '../../estados/tramite6402.query';
import { AutorizacionImportacionService } from '../../services/autorizacion-importacion.service';

@Injectable()
class MockTramite6402Store {}

@Injectable()
class MockTramite6402Query {}

@Injectable()
class MockAutorizacionImportacionService {}

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

describe('SolicitanteComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ SolicitanteComponent, FormsModule, ReactiveFormsModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Tramite6402Store, useClass: MockTramite6402Store },
        { provide: Tramite6402Query, useClass: MockTramite6402Query },
        { provide: AutorizacionImportacionService, useClass: MockAutorizacionImportacionService }
      ]
    }).overrideComponent(SolicitanteComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SolicitanteComponent);
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
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.selectSolicitud$ = observableOf({});
    component.cargarDatosSolicitante = jest.fn();
    component.inicializarFormulario = jest.fn();
    component.ngOnInit();
    expect(component.cargarDatosSolicitante).toHaveBeenCalled();
    expect(component.inicializarFormulario).toHaveBeenCalled();
  });

  it('should run #inicializarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.datosSolicitante = 'datosSolicitante';
    component.inicializarFormulario();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #cargarDatosSolicitante()', async () => {
    component.autorizacionImportacionService = component.autorizacionImportacionService || {};
    component.autorizacionImportacionService.obtenerDatosSolicitante = jest.fn().mockReturnValue(observableOf({}));
    component.store = component.store || {};
    component.store.setDatosSolicitante = jest.fn();
    component.inicializarFormulario = jest.fn();
    component.cargarDatosSolicitante();
    expect(component.autorizacionImportacionService.obtenerDatosSolicitante).toHaveBeenCalled();
    expect(component.store.setDatosSolicitante).toHaveBeenCalled();
    expect(component.inicializarFormulario).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});