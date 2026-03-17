
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PermisoRemediosHerbalesComponent } from './permiso-remedios-herbales.component';

describe('PermisoRemediosHerbalesComponent', () => {
  let fixture: ComponentFixture<PermisoRemediosHerbalesComponent>;
  let component: { ngOnDestroy: () => void; wizardComponent: { siguiente?: any; atras?: any; }; getValorIndice: (arg0: { valor: {}; accion: {}; }) => void; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PermisoRemediosHerbalesComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [

      ]
    }).overrideComponent(PermisoRemediosHerbalesComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PermisoRemediosHerbalesComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

});