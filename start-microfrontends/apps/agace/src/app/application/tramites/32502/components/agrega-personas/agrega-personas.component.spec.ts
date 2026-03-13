// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AgregaPersonasComponent } from './agrega-personas.component';
import { FormBuilder } from '@angular/forms';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { Tramite32502Store } from '../../../../estados/tramites/tramite32502.store';
import { Tramite32502Query, Tramite32502Query } from '../../../../estados/queries/tramite32502.query';
import { NotificacionesComponent } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite32502Store {}

@Injectable()
class MockTramite32502Query {}

describe('AgregaPersonasComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AgregaPersonasComponent, FormsModule, ReactiveFormsModule, CommonModule, NotificacionesComponent, HttpClientTestingModule],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        ValidacionesFormularioService,
        { provide: Tramite32502Store, useClass: MockTramite32502Store },
        { provide: Tramite32502Query, useClass: MockTramite32502Query },
        { provide: Tramite32502Query, useClass: MockTramite32502Query }
      ]
    }).overrideComponent(AgregaPersonasComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AgregaPersonasComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #gafeteIsValid', async () => {
    component.gafete = component.gafete || {};
    component.gafete.errors = 'errors';
    component.gafete.touched = 'touched';
    const gafeteIsValid = component.gafeteIsValid;

  });

  it('should run #isValid()', async () => {
    component.validacionesService = component.validacionesService || {};
    component.validacionesService.isValid = jest.fn();
    component.isValid({});
    expect(component.validacionesService.isValid).toHaveBeenCalled();
  });

  it('should run #buscarGafete()', async () => {
    component.gafete = component.gafete || {};
    component.gafete.value = 'value';
    component.habilitarCamposFormulario = jest.fn();
    component.buscarGafete();
    expect(component.habilitarCamposFormulario).toHaveBeenCalled();
  });

  it('should run #habilitarCamposFormulario()', async () => {
    component.personaForm = component.personaForm || {};
    component.personaForm.controls = 'controls';
    component.personaForm.get = jest.fn().mockReturnValue({
      updateValueAndValidity: function() {},
      setValidators: function() {},
      enable: function() {}
    });
    component.habilitarCamposFormulario();
    expect(component.personaForm.get).toHaveBeenCalled();
  });

  it('should run #deshabilitarCamposFormulario()', async () => {
    component.personaForm = component.personaForm || {};
    component.personaForm.controls = 'controls';
    component.personaForm.get = jest.fn().mockReturnValue({
      disable: function() {}
    });
    component.deshabilitarCamposFormulario();
    expect(component.personaForm.get).toHaveBeenCalled();
  });

  it('should run #agregarPersona()', () => {
  const mockNombre = 'Juan';
  const mockPrimerApellido = 'Pérez';
  const mockSegundoApellido = 'Gómez';
  const gafeteValue = '12345';

  // Mock the gafete control
  component.gafete = {
    setValidators: jest.fn(),
    updateValueAndValidity: jest.fn(),
    markAllAsTouched: jest.fn(),
    get value() {
      return gafeteValue;
    },
    get invalid() {
      return false; // control is valid
    }
  } as any;

  // Mock the personaForm with necessary controls
  component.personaForm = {
    markAllAsTouched: jest.fn(),
    reset: jest.fn(),
    get: jest.fn().mockImplementation((field: string) => {
      const values = {
        nombre: { value: mockNombre },
        primerApellido: { value: mockPrimerApellido },
        segundoApellido: { value: mockSegundoApellido },
      };
      return values[field];
    }),
    get invalid() {
      return false; // form is valid
    }
  } as any;

  // Mock personas array
  component.personas = {
    length: 0,
    push: jest.fn()
  } as any;

  // Mock other dependent methods
  component.habilitarCamposFormulario = jest.fn();
  component.deshabilitarCamposFormulario = jest.fn();

  // Run the method
  component.agregarPersona();

  // Expectations
  expect(component.gafete.setValidators).toHaveBeenCalled();
  expect(component.gafete.updateValueAndValidity).toHaveBeenCalled();
  expect(component.personaForm.get).toHaveBeenCalledWith('nombre');
  expect(component.personaForm.get).toHaveBeenCalledWith('primerApellido');
  expect(component.personaForm.get).toHaveBeenCalledWith('segundoApellido');
  expect(component.personas.push).toHaveBeenCalledWith({
    gafete: gafeteValue,
    nombre: mockNombre,
    primerApellido: mockPrimerApellido,
    segundoApellido: mockSegundoApellido
  });
  expect(component.personaForm.reset).toHaveBeenCalledWith({});
  expect(component.deshabilitarCamposFormulario).toHaveBeenCalled();
});


  it('should run #eliminar()', async () => {
    component.personas = component.personas || {};
    component.personas.splice = jest.fn();
    component.eliminar({});
    expect(component.personas.splice).toHaveBeenCalled();
  });

});