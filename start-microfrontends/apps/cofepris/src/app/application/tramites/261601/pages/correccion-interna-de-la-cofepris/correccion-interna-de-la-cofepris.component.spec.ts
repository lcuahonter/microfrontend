
import {  ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { CorreccionInternaDeLaCofeprisComponent } from './correccion-interna-de-la-cofepris.component';

describe('CorreccionInternaDeLaCofeprisComponent', () => {
  let fixture: ComponentFixture<CorreccionInternaDeLaCofeprisComponent>;
  let component: { ngOnDestroy: () => void; wizardComponent: { siguiente?: any; atras?: any; }; getValorIndice: (arg0: { valor: {}; accion: {}; }) => void; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        CorreccionInternaDeLaCofeprisComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [

      ]
    }).overrideComponent(CorreccionInternaDeLaCofeprisComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(CorreccionInternaDeLaCofeprisComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #getValorIndice()', async () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
  
    component.getValorIndice({
      valor: 2, 
      accion: 'cont', 
    });
  
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  
    component.getValorIndice({
      valor: 1, 
      accion: 'atras', 
    });
  
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

});