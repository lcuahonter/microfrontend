// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AsignacionComponent } from './asignacion.component';
import { RepresentacionFederalComponent } from '../../components/representacion-federal/representacion-federal.component';
import { SeleccionDelCupoComponent } from '../../components/seleccion-del-cupo/seleccion-del-cupo.component';
import { CantidadSolicitadaComponent } from '../../components/cantidad-solicitada/cantidad-solicitada.component';
import { HttpClientModule } from '@angular/common/http';
import { WizardComponent } from '@libs/shared/data-access-user/src';


describe('AsignacionComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, SeleccionDelCupoComponent , RepresentacionFederalComponent ,CantidadSolicitadaComponent, HttpClientModule, WizardComponent
       ],
      declarations: [
        AsignacionComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [

      ]
    }).overrideComponent(AsignacionComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AsignacionComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionarAsignacion()', async () => {
    component.actualizarMensajeEstado = jest.fn();
    component.seleccionarAsignacion({});
    // expect(component.actualizarMensajeEstado).toHaveBeenCalled();
  });

  it('should run #resetAsignacion()', async () => {
    component.actualizarMensajeEstado = jest.fn();
    component.resetAsignacion();
    // expect(component.actualizarMensajeEstado).toHaveBeenCalled();
  });

  it('should run #actualizarMensajeEstado()', async () => {

    component.actualizarMensajeEstado();

  });

});