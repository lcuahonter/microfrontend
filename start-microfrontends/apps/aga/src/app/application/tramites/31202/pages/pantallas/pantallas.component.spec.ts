// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PantallasComponent } from './pantallas.component';

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

describe('PantallasComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PantallasComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [

      ]
    }).overrideComponent(PantallasComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #getValorIndice() with accion = "cont"', () => {
  component.wizardComponent = {
    siguiente: jest.fn(),
    atras: jest.fn()
  } as any;

  component.getValorIndice({
    valor: 2,
    accion: 'cont'
  });

  expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  expect(component.wizardComponent.atras).not.toHaveBeenCalled();
});

it('should run #getValorIndice() with accion = "back"', () => {
  component.wizardComponent = {
    siguiente: jest.fn(),
    atras: jest.fn()
  } as any;

  component.getValorIndice({
    valor: 2,
    accion: 'back'
  });

  expect(component.wizardComponent.atras).toHaveBeenCalled();
  expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
});

});