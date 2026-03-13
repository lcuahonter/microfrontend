// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitantePageComponent } from './solicitante-page.component';

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

describe('SolicitantePageComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        SolicitantePageComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [

      ]
    }).overrideComponent(SolicitantePageComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SolicitantePageComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });
  it('should run #seleccionaTab()', async () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });
  it('should run #getValorIndice()', async () => {
    component.obtenerNombreDelTítulo = jest.fn();
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({
      valor: 2,
      accion: 'cont'
    });
    expect(component.obtenerNombreDelTítulo).toHaveBeenCalled();
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should run #getValorIndice() with atras action', async () => {
    component.obtenerNombreDelTítulo = jest.fn();
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({
      valor: 3,
      accion: 'atras'
    });
    expect(component.obtenerNombreDelTítulo).toHaveBeenCalled();
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not call methods when valor is out of range in #getValorIndice()', async () => {
    component.obtenerNombreDelTítulo = jest.fn();
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({
      valor: 0,
      accion: 'cont'
    });
    expect(component.obtenerNombreDelTítulo).not.toHaveBeenCalled();
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
  it('should run #obtenerNombreDelTítulo()', async () => {
    component.pasos = component.pasos || {};
    component.pasos[1] = {
      titulo: 'Step 2 Title'
    };
    component.pasos[2] = {
      titulo: 'Step 3 Title'
    };
    
    const result1 = component.obtenerNombreDelTítulo(1);
    const result2 = component.obtenerNombreDelTítulo(2);
    const result3 = component.obtenerNombreDelTítulo(3);
    const resultDefault = component.obtenerNombreDelTítulo(999);
    
    expect(result2).toBe('Step 2 Title');
    expect(result3).toBe('Step 3 Title');
  });
});