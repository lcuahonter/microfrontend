// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DestinatarioComponent } from './destinatario.component';
import { FormBuilder } from '@angular/forms';


describe('DestinatarioComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DestinatarioComponent ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder
      ]
    }).overrideComponent(DestinatarioComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DestinatarioComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.formDestinatario = component.formDestinatario || {};
    component.formDestinatario.valueChanges = observableOf({});
    component.formDestinatario.value = 'value';
    component.formDestinatarioEvent = component.formDestinatarioEvent || {};
 

    
  });

  it('should run #paisDestionSeleccion()', async () => {
    component.paisDestionSeleccionEvent = component.paisDestionSeleccionEvent || {};
    component.paisDestionSeleccionEvent.emit = jest.fn();
    component.paisDestionSeleccion({});
    expect(component.paisDestionSeleccionEvent.emit).toHaveBeenCalled();
  });

});