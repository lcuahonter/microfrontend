// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ProveedorPorArchivoVistaComponent } from './proveedor-por-archivo-vista.component';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('ProveedorPorArchivoVistaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ProveedorPorArchivoVistaComponent, FormsModule, ReactiveFormsModule , HttpClientTestingModule],
      declarations: [
        
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        Location
      ]
    }).overrideComponent(ProveedorPorArchivoVistaComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ProveedorPorArchivoVistaComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #regrsarAnnexoI()', async () => {
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.regrsarAnnexoI();
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });

});