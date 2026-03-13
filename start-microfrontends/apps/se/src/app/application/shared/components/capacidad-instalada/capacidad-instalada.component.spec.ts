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
import { CapacidadInstaladaComponent } from './capacidad-instalada.component';
import { Location } from '@angular/common';

describe('CapacidadInstaladaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],

      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [Location],
    })
      .overrideComponent(CapacidadInstaladaComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(CapacidadInstaladaComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #regrasar()', async () => {
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.regrasar();
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });
});
