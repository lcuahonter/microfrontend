// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { AmpliacionServiciosService } from '../../services/ampliacion-servicios.service';

@Injectable()
class MockAmpliacionServiciosService {
  getServiciosData = jest.fn().mockReturnValue(observableOf({}));
  actualizarEstadoFormulario = jest.fn();
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

describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoUnoComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ConsultaioQuery, useValue: { selectConsultaioState$: observableOf({ update: false }) } },
        { provide: AmpliacionServiciosService, useClass: MockAmpliacionServiciosService }
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
    expect(component.indice).toBe(1);
    expect(component.esDatosRespuesta).toBe(false);
  });

  it('debería seleccionar pestaña correctamente', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
    
    component.seleccionaTab(1);
    expect(component.indice).toBe(1);
  });

  it('debería inicializar correctamente en ngOnInit', () => {
    jest.spyOn(component, 'guardarDatosFormulario');
    const mockConsultaQuery = TestBed.inject(ConsultaioQuery);
    mockConsultaQuery.selectConsultaioState$ = observableOf({ update: true });
    
    component.ngOnInit();
    
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('debería establecer esDatosRespuesta cuando update es false', () => {
    const mockConsultaQuery = TestBed.inject(ConsultaioQuery);
    mockConsultaQuery.selectConsultaioState$ = observableOf({ update: false });
    
    component.ngOnInit();
    
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería guardar datos del formulario correctamente', () => {
    const mockService = TestBed.inject(AmpliacionServiciosService);
    const mockResponse = { data: 'test' };
    mockService.getServiciosData.mockReturnValue(observableOf(mockResponse));
    
    component.guardarDatosFormulario();
    
    expect(mockService.getServiciosData).toHaveBeenCalled();
    expect(mockService.actualizarEstadoFormulario).toHaveBeenCalledWith(mockResponse);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería validar formularios cuando índice es menor a 2', () => {
    component.indice = 1;
    
    const result = component.validarTodosLosFormularios();
    
    expect(result).toBe(true);
  });

  it('debería validar formularios cuando índice es >= 2 pero no hay solicitudComponent', () => {
    component.indice = 2;
    component.solicitudComponent = undefined;
    
    const result = component.validarTodosLosFormularios();
    
    expect(result).toBe(true);
  });

  it('debería validar formularios cuando índice es >= 2 y solicitudComponent tiene datos IMMEX', () => {
    component.indice = 2;
    component.solicitudComponent = {
      datosImmex: [{ id: 1, data: 'test' }]
    } as any;
    
    const result = component.validarTodosLosFormularios();
    
    expect(result).toBe(true);
  });

  it('debería fallar validación cuando índice es >= 2 y solicitudComponent no tiene datos IMMEX', () => {
    component.indice = 3;
    component.solicitudComponent = {
      datosImmex: []
    } as any;
    
    const result = component.validarTodosLosFormularios();
    
    expect(result).toBe(false);
  });

  it('debería validar formularios con múltiples escenarios de índice', () => {
    // Escenario 1: índice = 2, sin datos
    component.indice = 2;
    component.solicitudComponent = { datosImmex: [] } as any;
    expect(component.validarTodosLosFormularios()).toBe(false);
    
    // Escenario 2: índice = 5, con datos
    component.indice = 5;
    component.solicitudComponent = { datosImmex: [{ id: 1 }, { id: 2 }] } as any;
    expect(component.validarTodosLosFormularios()).toBe(true);
    
    // Escenario 3: índice = 1, sin importar datos
    component.indice = 1;
    component.solicitudComponent = { datosImmex: [] } as any;
    expect(component.validarTodosLosFormularios()).toBe(true);
  });

  it('debería limpiar recursos en ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    
    component.ngOnDestroy();
    
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

});