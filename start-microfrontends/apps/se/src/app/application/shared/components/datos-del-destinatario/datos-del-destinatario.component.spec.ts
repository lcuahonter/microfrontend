// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosDelDestinatarioComponent } from './datos-del-destinatario.component';
import { FormBuilder } from '@angular/forms';


describe('DatosDelDestinatarioComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DatosDelDestinatarioComponent ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder
      ]
    }).overrideComponent(DatosDelDestinatarioComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosDelDestinatarioComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.formDatosDelDestinatario = component.formDatosDelDestinatario || {};
    component.formDatosDelDestinatario.valueChanges = observableOf({});
    component.formDatosDelDestinatario.value = 'value';
    component.formDatosDelDestinatarioEvent = component.formDatosDelDestinatarioEvent || {};



  });

});