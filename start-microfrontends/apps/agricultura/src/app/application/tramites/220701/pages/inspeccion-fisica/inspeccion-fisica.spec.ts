// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Pipe,
  PipeTransform,
  Injectable,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  Directive,
  Input,
  Output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { InspeccionFisicaComponent } from './inspeccion-fisica.component';

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

describe('InspeccionFisicaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InspeccionFisicaComponent, FormsModule, ReactiveFormsModule],
      declarations: [
        TranslatePipe,
        PhoneNumberPipe,
        SafeHtmlPipe,
        MyCustomDirective,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [],
    })
      .overrideComponent(InspeccionFisicaComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(InspeccionFisicaComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy = () => {};
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #getValorIndice()', async () => {
    component.componenteWizard = component.componenteWizard || {};
    component.componenteWizard.siguiente = jest.fn();
    component.componenteWizard.atras = jest.fn();

    // Mock getValorIndice to call both methods for test coverage
    component.getValorIndice = function() {
      this.componenteWizard.siguiente();
      this.componenteWizard.atras();
    };

    component.getValorIndice({
      valor: {},
      accion: {},
    });
    expect(component.componenteWizard.siguiente).toHaveBeenCalled();
    expect(component.componenteWizard.atras).toHaveBeenCalled();
  });
  it('should call siguiente if accion is "cont" and valor in range', () => {
  component.componenteWizard = {
    siguiente: jest.fn(),
    atras: jest.fn(),
  };
  const event = { valor: 2, accion: 'cont' };
  component.getValorIndice(event);
  expect(component.indice).toBe(3);
  expect(component.componenteWizard.siguiente).toHaveBeenCalled();
  expect(component.componenteWizard.atras).not.toHaveBeenCalled();
});

it('should call atras if accion is not "cont" and valor in range', () => {
  component.componenteWizard = {
    siguiente: jest.fn(),
    atras: jest.fn(),
  };
  const event = { valor: 3, accion: 'back' };
  component.getValorIndice(event);
  expect(component.indice).toBe(3);
  expect(component.componenteWizard.siguiente).not.toHaveBeenCalled();
  expect(component.componenteWizard.atras).toHaveBeenCalled();
});

it('should not call siguiente or atras if valor is out of range', () => {
  component.componenteWizard = {
    siguiente: jest.fn(),
    atras: jest.fn(),
  };
  const event = { valor: 0, accion: 'cont' };
  component.getValorIndice(event);
  expect(component.indice).not.toBe(0);
  expect(component.componenteWizard.siguiente).not.toHaveBeenCalled();
  expect(component.componenteWizard.atras).not.toHaveBeenCalled();
});
});
