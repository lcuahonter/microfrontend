// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DetalleMercanciaComponent } from './detalle-mercancia.component';
import { FormBuilder } from '@angular/forms';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockDatosSolicitudService {}

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

describe('DetalleMercanciaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DetalleMercanciaComponent, HttpClientTestingModule],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: DatosSolicitudService, useClass: MockDatosSolicitudService }
      ]
    }).overrideComponent(DetalleMercanciaComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DetalleMercanciaComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit() without datosDetalleMercancia', async () => {
    component.datosSolicitudService = component.datosSolicitudService || {};
    component.datosSolicitudService.obtenerRespuestaPorUrl = jest.fn();
    component.datosDetalleMercancia = null;
    component.ngOnInit();
    expect(component.datosSolicitudService.obtenerRespuestaPorUrl).toHaveBeenCalledWith(
      component,
      'datosFormFormaceutica',
      '/cofepris/formaFarmaceutica.json'
    );
  });

  it('should run #ngOnInit() with datosDetalleMercancia', async () => {
    const mockPatchValue = jest.fn();
    component.formaDetalleMercancia.patchValue = mockPatchValue;
    component.datosSolicitudService = component.datosSolicitudService || {};
    component.datosSolicitudService.obtenerRespuestaPorUrl = jest.fn();
    component.datosDetalleMercancia = {
      formaFormaceutica: 'test',
      numeroDeRegistro: '123',
      marcasDistintivas: 'test marca',
      tipoDeEnvase: 'test envase'
    };
    component.ngOnInit();
    expect(mockPatchValue).toHaveBeenCalledWith(component.datosDetalleMercancia);
    expect(component.datosSolicitudService.obtenerRespuestaPorUrl).toHaveBeenCalledWith(
      component,
      'datosFormFormaceutica',
      '/cofepris/formaFarmaceutica.json'
    );
  });

  it('should run #isValid() with AbstractControl', async () => {
    const mockControl = {
      errors: { required: true },
      touched: true
    };
    const result = component.isValid(mockControl);
    expect(result).toBe(true);
  });


  it('should run #eliminarMercancias() with tablaMercanciasLista', async () => {
    component.eliminarMercancia = component.eliminarMercancia || {};
    component.eliminarMercancia.emit = jest.fn();
    component.tablaMercanciasLista = [{ id: 1, nombre: 'test' }];
    component.eliminarMercancias();
    expect(component.eliminarMercancia.emit).toHaveBeenCalledWith(component.tablaMercanciasLista);
  });

  it('should run #eliminarMercancias() without tablaMercanciasLista', async () => {
    component.eliminarMercancia = component.eliminarMercancia || {};
    component.eliminarMercancia.emit = jest.fn();
    component.tablaMercanciasLista = null;
    component.eliminarMercancias();
    expect(component.eliminarMercancia.emit).not.toHaveBeenCalled();
  });

  it('should run #agregarMercancias() with valid form', async () => {
    // Mock the form with valid state
    const mockFormValue = {
      formaFormaceutica: '1',
      numeroDeRegistro: '123',
      marcasDistintivas: 'test marca',
      tipoDeEnvase: 'test envase'
    };
    
    Object.defineProperty(component.formaDetalleMercancia, 'valid', {
      get: () => true,
      configurable: true
    });
    
    Object.defineProperty(component.formaDetalleMercancia, 'value', {
      get: () => mockFormValue,
      configurable: true
    });
    
    component.formaDetalleMercancia.reset = jest.fn();
    component.formaDetalleMercancia.patchValue = jest.fn();
    
    component.datosFormFormaceutica = [
      { id: 1, descripcion: 'Forma Farmaceutica Test' }
    ];
    
    component.agregarMercanciaSellecion = component.agregarMercanciaSellecion || {};
    component.agregarMercanciaSellecion.emit = jest.fn();
    
    component.agregarMercancias();
    
    expect(component.formaDetalleMercancia.reset).toHaveBeenCalled();
    expect(component.formaDetalleMercancia.patchValue).toHaveBeenCalledWith({ formaFormaceutica: -1 });
    expect(component.agregarMercanciaSellecion.emit).toHaveBeenCalledWith({
      formaFormaceutica: 'Forma Farmaceutica Test',
      numeroDeRegistro: '123',
      marcasDistintivas: 'test marca',
      tipoDeEnvase: 'test envase'
    });
  });

  it('should run #agregarMercancias() with invalid form', async () => {
    // Mock the form with invalid state
    Object.defineProperty(component.formaDetalleMercancia, 'valid', {
      get: () => false,
      configurable: true
    });
    
    component.formaDetalleMercancia.reset = jest.fn();
    component.agregarMercanciaSellecion = component.agregarMercanciaSellecion || {};
    component.agregarMercanciaSellecion.emit = jest.fn();
    
    component.agregarMercancias();
    
    expect(component.formaDetalleMercancia.reset).not.toHaveBeenCalled();
    expect(component.agregarMercanciaSellecion.emit).not.toHaveBeenCalled();
  });

  it('should initialize component properties correctly', async () => {
    expect(component.tablaDetalleMercancia).toBeDefined();
    expect(component.tipoSeleccionTabla).toBeDefined();
    expect(component.datosFormFormaceutica).toEqual([]);
    expect(component.tablaMercanciasLista).toEqual([]);
    expect(component.formaDetalleMercancia).toBeDefined();
  });

  it('should have required form validators', async () => {
    const formaFormaceuticaControl = component.formaDetalleMercancia.get('formaFormaceutica');
    const marcasDistintivasControl = component.formaDetalleMercancia.get('marcasDistintivas');
    const tipoDeEnvaseControl = component.formaDetalleMercancia.get('tipoDeEnvase');
    const numeroDeRegistroControl = component.formaDetalleMercancia.get('numeroDeRegistro');

    expect(formaFormaceuticaControl?.hasError('required')).toBe(true);
    expect(marcasDistintivasControl?.hasError('required')).toBe(true);
    expect(tipoDeEnvaseControl?.hasError('required')).toBe(true);
    expect(numeroDeRegistroControl?.hasError('required')).toBe(false);
  });

  it('should validate form controls correctly', async () => {
    // Set valid values
    component.formaDetalleMercancia.patchValue({
      formaFormaceutica: '1',
      numeroDeRegistro: '123',
      marcasDistintivas: 'test marca',
      tipoDeEnvase: 'test envase'
    });

    expect(component.formaDetalleMercancia.valid).toBe(true);
  });

  it('should handle agregarMercancias when datosFormFormaceutica item not found', async () => {
    const mockFormValue = {
      formaFormaceutica: '999', // Non-existent ID
      numeroDeRegistro: '123',
      marcasDistintivas: 'test marca',
      tipoDeEnvase: 'test envase'
    };
    
    Object.defineProperty(component.formaDetalleMercancia, 'valid', {
      get: () => true,
      configurable: true
    });
    
    Object.defineProperty(component.formaDetalleMercancia, 'value', {
      get: () => mockFormValue,
      configurable: true
    });
    
    component.formaDetalleMercancia.reset = jest.fn();
    component.formaDetalleMercancia.patchValue = jest.fn();
    
    component.datosFormFormaceutica = [
      { id: 1, descripcion: 'Forma Farmaceutica Test' }
    ];
    
    component.agregarMercanciaSellecion = component.agregarMercanciaSellecion || {};
    component.agregarMercanciaSellecion.emit = jest.fn();
    
    component.agregarMercancias();
    
    expect(component.agregarMercanciaSellecion.emit).toHaveBeenCalledWith({
      formaFormaceutica: undefined, // Should be undefined when not found
      numeroDeRegistro: '123',
      marcasDistintivas: 'test marca',
      tipoDeEnvase: 'test envase'
    });
  });

  it('should handle isValid with FormGroup instance check', async () => {
    const mockFormGroup = component.formaDetalleMercancia;
    const result = component.isValid(mockFormGroup, 'formaFormaceutica');
    expect(typeof result).toBe('boolean');
  });

  it('should emit events correctly', async () => {
    const agregarSpy = jest.spyOn(component.agregarMercanciaSellecion, 'emit');
    const eliminarSpy = jest.spyOn(component.eliminarMercancia, 'emit');

    // Test eliminar event
    component.tablaMercanciasLista = [{ id: 1, nombre: 'test' }];
    component.eliminarMercancias();
    expect(eliminarSpy).toHaveBeenCalledWith(component.tablaMercanciasLista);

    // Test agregar event with valid form
    Object.defineProperty(component.formaDetalleMercancia, 'valid', {
      get: () => true,
      configurable: true
    });
    
    Object.defineProperty(component.formaDetalleMercancia, 'value', {
      get: () => ({
        formaFormaceutica: '1',
        numeroDeRegistro: '123',
        marcasDistintivas: 'test',
        tipoDeEnvase: 'test'
      }),
      configurable: true
    });

    component.datosFormFormaceutica = [{ id: 1, descripcion: 'Test Form' }];
    component.formaDetalleMercancia.reset = jest.fn();
    component.formaDetalleMercancia.patchValue = jest.fn();
    
    component.agregarMercancias();
    expect(agregarSpy).toHaveBeenCalled();
  });

  it('should handle constructor injection correctly', async () => {
    expect(component.datosSolicitudService).toBeDefined();
    expect(component.formaDetalleMercancia).toBeDefined();
    expect(component.formaDetalleMercancia.get('formaFormaceutica')).toBeDefined();
    expect(component.formaDetalleMercancia.get('numeroDeRegistro')).toBeDefined();
    expect(component.formaDetalleMercancia.get('marcasDistintivas')).toBeDefined();
    expect(component.formaDetalleMercancia.get('tipoDeEnvase')).toBeDefined();
  });

});