// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BooleanoSiNoPipe } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PedimentoComponent } from './pedimento.component';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { SharedModule } from '@ng-mf/data-access-user';

describe('PedimentoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ PedimentoComponent, FormsModule, ReactiveFormsModule, CommonModule, SharedModule, BooleanoSiNoPipe ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        ValidacionesFormularioService
      ]
    }).overrideComponent(PedimentoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PedimentoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #isValid', async () => {
    component.pedimentoForm = component.pedimentoForm || {};
    component.pedimentoForm.errors = 'errors';
    component.pedimentoForm.touched = 'touched';
    const isValid = component.isValid;

  });

  it('should run #ngOnChanges()', async () => {

    component.ngOnChanges({});

  });

  it('should run #agregaPedimento()', async () => {
    component.validaCampos = component.validaCampos || {};
    component.validaCampos.emit = jest.fn();
    component.acciones = jest.fn();
    component.agregaPedimento();
    expect(component.validaCampos.emit).toHaveBeenCalled();
    expect(component.acciones).toHaveBeenCalled();
  });

it('should run #acciones()', async () => {
  component.validacion = true;
  component.pedimentoForm = new FormControl('1234567'); 
  component.datosNroPedimento = {
    patente: 'patente123',
    idAduana: 'aduana456'
  } as any;

  component.pedimentos = [];
  const pushSpy = jest.spyOn(component.pedimentos, 'push');

  component.acciones();

  expect(pushSpy).toHaveBeenCalled();
});


  it('should run #eliminar()', async () => {
    component.pedimentos = component.pedimentos || {};
    component.pedimentos.splice = jest.fn();
    component.eliminar({});
    expect(component.pedimentos.splice).toHaveBeenCalled();
  });

});