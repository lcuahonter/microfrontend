// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ModificacionSolicitudeService } from '../../services/modificacion-solicitude.service';
import { Tramite80308Store } from '../../estados/tramite80308.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockModificacionSolicitudeService {}

@Injectable()
class MockTramite80308Store {}

describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        ConsultaioQuery,
        { provide: ModificacionSolicitudeService, useClass: MockModificacionSolicitudeService },
        { provide: Tramite80308Store, useClass: MockTramite80308Store }
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

  it('should run #guardarDatosFormulario()', async () => {
    component.modificionService = component.modificionService || {};
    component.modificionService.obtenerTramiteDatos = jest.fn().mockReturnValue(observableOf({}));
    component.store = component.store || {};
    component.store.update = jest.fn();
    component.guardarDatosFormulario();
    expect(component.modificionService.obtenerTramiteDatos).toHaveBeenCalled();
  });

});