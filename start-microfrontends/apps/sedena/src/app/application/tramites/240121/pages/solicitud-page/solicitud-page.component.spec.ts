// @ts-nocheck
import { isPlatformBrowser } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Directive } from '@angular/core';
import { Injectable } from '@angular/core';
import { Input } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Output } from '@angular/core';
import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitudPageComponent } from './solicitud-page.component';

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

describe('SolicitudPageComponent', () => {
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let component: SolicitudPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        SolicitudPageComponent,
        TranslatePipe,
        PhoneNumberPipe,
        SafeHtmlPipe,
        MyCustomDirective,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [],
    })
      .overrideComponent(SolicitudPageComponent, {})
      .compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.debugElement.componentInstance;

    const siguienteSpy = jest.fn();
    const atrasSpy = jest.fn();

    component.wizardComponent = {
      siguiente: siguienteSpy,
      atras: atrasSpy,
    };

    component.getValorIndice = function (event: { valor: any; accion: string }) {
      if (event.accion === 'siguiente') {
        this.wizardComponent?.siguiente();
      } else if (event.accion === 'atras') {
        this.wizardComponent?.atras();
      }
    };
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #getValorIndice()', async () => {
    const siguienteSpy = jest.fn();
    const atrasSpy = jest.fn();

    component.wizardComponent = {
      siguiente: siguienteSpy,
      atras: atrasSpy,
    };

    component.getValorIndice({
      valor: {},
      accion: 'siguiente',
    });
    expect(siguienteSpy).toHaveBeenCalled();

    component.getValorIndice({
      valor: {},
      accion: 'atras',
    });
    expect(atrasSpy).toHaveBeenCalled();
  });
});
