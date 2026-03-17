// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AvisoRetornoComponent } from './aviso-retorno.component';
import { AdaceService } from '../services/aviso-retorno.service';
import { FormBuilder } from '@angular/forms';
import { Tramite32514Store } from '../state/Tramite32514.store';
import { Tramite32514Query } from '../state/Tramite32514.query';

@Injectable()
class MockAdaceService {}

@Injectable()
class MockTramite32514Store {}

@Injectable()
class MockTramite32514Query {}


describe('AvisoRetornoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AdaceService, useClass: MockAdaceService },
        FormBuilder,
        { provide: Tramite32514Store, useClass: MockTramite32514Store },
        { provide: Tramite32514Query, useClass: MockTramite32514Query }
      ]
    }).overrideComponent(AvisoRetornoComponent, {

      set: { providers: [{ provide: AdaceService, useClass: MockAdaceService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(AvisoRetornoComponent);
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
    component.query = component.query || {};
    component.query.selectSolicitud$ = observableOf({});
    component.donanteDomicilio = jest.fn();
    component.obtenerDatosAnoPeriodo = jest.fn();
    component.ngOnInit();
    expect(component.donanteDomicilio).toHaveBeenCalled();
  });

  it('should run #obtenerDatosAnoPeriodo()', async () => {
    component.adace = component.adace || {};
    component.adace.obtenerDatosAno = jest.fn().mockReturnValue(observableOf({}));
    component.anoCatalogo = component.anoCatalogo || {};
    component.anoCatalogo.catalogos = 'catalogos';
    component.obtenerDatosAnoPeriodo();
    expect(component.adace.obtenerDatosAno).toHaveBeenCalled();
  });

  it('should run #validarDestinatarioFormulario()', async () => {
    component.avisoForm = component.avisoForm || {};
    component.avisoForm.invalid = 'invalid';
    component.avisoForm.markAllAsTouched = jest.fn();
    component.validarDestinatarioFormulario();
    expect(component.avisoForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should run #setValoresStore()', async () => {
    component.avisoForm = component.avisoForm || {};
    component.avisoForm.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.store = component.store || {};
    component.store.setEstado = jest.fn();
    component.setValoresStore({});
    expect(component.avisoForm.get).toHaveBeenCalled();
    expect(component.store.setEstado).toHaveBeenCalled();
  });

  it('should run #donanteDomicilio()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn().mockReturnValue({
      patchValue: function() {}
    });
    component.query = component.query || {};
    component.query.selectSolicitud$ = observableOf({});
    component.donanteDomicilio();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyed$ = component.destroyed$ || {};
    component.destroyed$.next = jest.fn();
    component.destroyed$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyed$.next).toHaveBeenCalled();
  });

});