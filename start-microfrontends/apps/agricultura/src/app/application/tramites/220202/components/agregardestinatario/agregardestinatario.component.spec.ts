// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AgregardestinatarioComponent } from './agregardestinatario.component';
import { FormBuilder } from '@angular/forms';
import { TercerosrelacionadosService } from '../../../../shared/components/services/tercerosrelacionados/tercerosrelacionados.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { FitosanitarioQuery } from '../../queries/fitosanitario.query';

@Injectable()
class MockTercerosrelacionadosService {
  obtenerSelectorList = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockRouter {
  navigate() {};
}

@Injectable()
class MockAgriculturaApiService {
  getAllDatosForma = jest.fn().mockReturnValue(observableOf({
    seletedTerceros: {}
  }));
  updateTercerosRelacionado = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockFitosanitarioQuery {}

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

describe('AgregardestinatarioComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, AgregardestinatarioComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: TercerosrelacionadosService, useClass: MockTercerosrelacionadosService },
        { provide: Router, useClass: MockRouter },
        { provide: AgriculturaApiService, useClass: MockAgriculturaApiService },
        { provide: FitosanitarioQuery, useClass: MockFitosanitarioQuery },
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
    }).overrideComponent(AgregardestinatarioComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AgregardestinatarioComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn().mockReturnValue({
      patchValue: function() {}
    });
    component.agriculturaApiService = component.agriculturaApiService || {};
    component.agriculturaApiService.getAllDatosForma = jest.fn().mockReturnValue(observableOf({
      seletedTerceros: {}
    }));
    component.ngOnInit();
    expect(component.fb.group).toHaveBeenCalled();
    expect(component.agriculturaApiService.getAllDatosForma).toHaveBeenCalled();
  });

  it('should run #ngAfterViewInit()', async () => {
    component.pairsCatalogChange = jest.fn();
    component.estadoCatalogChange = jest.fn();
    component.municipioCatalogChange = jest.fn();
    component.coloniaCatalogChange = jest.fn();
    component.ngAfterViewInit();
    expect(component.pairsCatalogChange).toHaveBeenCalled();
    expect(component.estadoCatalogChange).toHaveBeenCalled();
    expect(component.municipioCatalogChange).toHaveBeenCalled();
    expect(component.coloniaCatalogChange).toHaveBeenCalled();
  });

  it('should run #pairsCatalogChange()', async () => {
    component.tercerosrelacionadosService = component.tercerosrelacionadosService || {};
    component.tercerosrelacionadosService.obtenerSelectorList = jest.fn().mockReturnValue(observableOf({}));
    component.pairsCatalogChange();
    expect(component.tercerosrelacionadosService.obtenerSelectorList).toHaveBeenCalled();
  });

  it('should run #estadoCatalogChange()', async () => {
    component.tercerosrelacionadosService = component.tercerosrelacionadosService || {};
    component.tercerosrelacionadosService.obtenerSelectorList = jest.fn().mockReturnValue(observableOf({}));
    component.estadoCatalogChange();
    expect(component.tercerosrelacionadosService.obtenerSelectorList).toHaveBeenCalled();
  });

  it('should run #municipioCatalogChange()', async () => {
    component.tercerosrelacionadosService = component.tercerosrelacionadosService || {};
    component.tercerosrelacionadosService.obtenerSelectorList = jest.fn().mockReturnValue(observableOf({}));
    component.municipioCatalogChange();
    expect(component.tercerosrelacionadosService.obtenerSelectorList).toHaveBeenCalled();
  });

  it('should run #coloniaCatalogChange()', async () => {
    component.tercerosrelacionadosService = component.tercerosrelacionadosService || {};
    component.tercerosrelacionadosService.obtenerSelectorList = jest.fn().mockReturnValue(observableOf({}));
    component.coloniaCatalogChange();
    expect(component.tercerosrelacionadosService.obtenerSelectorList).toHaveBeenCalled();
  });

  it('should run #onGuardarDestinatario()', async () => {
    const mockControl = {
      valid: true,
      value: 'yes'
    };

    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.valid = true;
    component.destinatarioForm.value = { test: 'value' };
    component.destinatarioForm.markAllAsTouched = jest.fn();
    component.destinatarioForm.get = jest.fn().mockReturnValue(mockControl);
    component.agriculturaApiService = component.agriculturaApiService || {};
    component.agriculturaApiService.updateTercerosRelacionado = jest.fn().mockReturnValue(observableOf({}));
    component.cerrar = component.cerrar || {};
    component.cerrar.emit = jest.fn();
    
    component.onGuardarDestinatario();
    
    expect(component.agriculturaApiService.updateTercerosRelacionado).toHaveBeenCalled();
    expect(component.cerrar.emit).toHaveBeenCalled();
  });

  it('should run #onGuardarDestinatario() when form is invalid', async () => {
    const mockControl = {
      valid: false,
      value: 'no'
    };

    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.valid = false;
    component.destinatarioForm.markAllAsTouched = jest.fn();
    component.destinatarioForm.get = jest.fn().mockReturnValue(mockControl);
    component.agriculturaApiService = component.agriculturaApiService || {};
    component.agriculturaApiService.updateTercerosRelacionado = jest.fn();
    component.cerrar = component.cerrar || {};
    component.cerrar.emit = jest.fn();
    
    component.onGuardarDestinatario();
    
    expect(component.destinatarioForm.markAllAsTouched).toHaveBeenCalled();
    expect(component.agriculturaApiService.updateTercerosRelacionado).not.toHaveBeenCalled();
    expect(component.cerrar.emit).not.toHaveBeenCalled();
  });

  it('should run #onLimpiarDestinatario()', async () => {
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.reset = jest.fn();
    component.destinatarioForm.markAsPristine = jest.fn();
    component.destinatarioForm.markAsUntouched = jest.fn();
    component.destinatarioForm.patchValue = jest.fn();
    component.onLimpiarDestinatario();
    expect(component.destinatarioForm.reset).toHaveBeenCalled();
    expect(component.destinatarioForm.markAsPristine).toHaveBeenCalled();
    expect(component.destinatarioForm.markAsUntouched).toHaveBeenCalled();
    expect(component.destinatarioForm.patchValue).toHaveBeenCalled();
  });

  it('should run #onCancelarDestinatario()', async () => {
    component.cerrar = component.cerrar || {};
    component.cerrar.emit = jest.fn();
    component.onCancelarDestinatario();
    expect(component.cerrar.emit).toHaveBeenCalled();
  });

  it('should run #enCambioValorRadio()', async () => {
    const mockControl = {
      updateValueAndValidity: jest.fn(),
      setValue: jest.fn(),
      clearValidators: jest.fn(),
      setValidators: jest.fn(),
      markAsUntouched: jest.fn(),
      value: 'no'
    };

    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.get = jest.fn().mockReturnValue(mockControl);
    component.destinatarioForm.value = {
      tipoMercancia: 'no'
    };
    component.enCambioValorRadio();
    expect(component.destinatarioForm.get).toHaveBeenCalledWith('razonSocial');
    expect(component.destinatarioForm.get).toHaveBeenCalledWith('nombre');
    expect(component.destinatarioForm.get).toHaveBeenCalledWith('primerApellido');
    expect(component.destinatarioForm.get).toHaveBeenCalledWith('tipoMercancia');
    expect(mockControl.markAsUntouched).toHaveBeenCalled();
  });

});