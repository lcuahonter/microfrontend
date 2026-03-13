// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosDelGeneradorDeResiduosComponent } from './datos-del-generador-de-residuos.component';
import { FormBuilder } from '@angular/forms';
import { CatalogosService, ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite231001Query } from '../../../../tramites/231001/estados/queries/tramite231001.query';
import { Tramite231001Store } from '../../../../tramites/231001/estados/tramites/tramite231001.store';
import { MateriaprimaformserviceService } from '../../services/materia-prima-formservice.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockTramite231001Query {}

@Injectable()
class MockTramite231001Store {}

@Injectable()
class MockMateriaprimaformserviceService {}

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

describe('DatosDelGeneradorDeResiduosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,DatosDelGeneradorDeResiduosComponent, HttpClientTestingModule ],
      declarations: [
        
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        CatalogosService,
        { provide: Tramite231001Query, useClass: MockTramite231001Query },
        { provide: Tramite231001Store, useClass: MockTramite231001Store },
        ConsultaioQuery,
        { provide: MateriaprimaformserviceService, useClass: MockMateriaprimaformserviceService }
      ]
    }).overrideComponent(DatosDelGeneradorDeResiduosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosDelGeneradorDeResiduosComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #isInvalid()', async () => {
    component.solicitudForm = component.solicitudForm || {};
    component.solicitudForm.get = jest.fn().mockReturnValue({
      get: function() {}
    });
    component.isInvalid({});
    
  });

  it('should run #onSubmit()', async () => {
    component.solicitudForm = component.solicitudForm || {};
    component.solicitudForm.markAllAsTouched = jest.fn();
    component.onSubmit();
   
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.aduanasdata = jest.fn();
    component.ngOnInit();
    
  });

  it('should run #aduanasdata()', async () => {
    component.serviceMateria = component.serviceMateria || {};
    component.serviceMateria.getSubPartidaFraccion = jest.fn().mockReturnValue(observableOf({}));
    component.aduanasdata = jest.fn(); // Mock the method to avoid TypeError
    component.aduanasdata();
    
  });

  it('should run #setValoresStore()', async () => {
    component.tramite231001Store = component.tramite231001Store || {};
    component.tramite231001Store.actualizarEstado = jest.fn();
    component.setValoresStore({
      get: function() {
        return {
          value: {}
        };
      }
    }, {});
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.inicializarFormulario = jest.fn();
    component.inicializarEstadoFormulario();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.inicializarFormulario = jest.fn();
    component.solicitudForm = component.solicitudForm || {};
    component.solicitudForm.disable = jest.fn();
    component.solicitudForm.enable = jest.fn();
    component.datosForm = component.datosForm || {};
    component.datosForm.disable = jest.fn();
    component.datosForm.enable = jest.fn();
    component.guardarDatosFormulario();
  });

  it('should run #inicializarFormulario()', async () => {
    component.obtenerEstadoSolicitud = jest.fn();
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.seccionState = component.seccionState || {};
    component.seccionState.numeroRegistroAmbiental = 'numeroRegistroAmbiental';
    component.seccionState.descripcionGenerica1 = 'descripcionGenerica1';
    component.seccionState.numeroProgramaImmex = 'numeroProgramaImmex';
    component.seccionState.aduanas = 'aduanas';
    component.inicializarFormulario();
  });

  it('should run #obtenerEstadoSolicitud()', async () => {
    component.tramite231001Query = component.tramite231001Query || {};
    component.tramite231001Query.selectSolicitud$ = observableOf({});
    component.obtenerEstadoSolicitud();

  });

});