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
import { SolicitudService } from '../../service/solicitud.service';
import { Tramite80302Store } from '../../../../estados/tramites/tramite80302.store';

@Injectable()
class MockSolicitudService {}

@Injectable()
class MockTramite80302Store {}


describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, PasoUnoComponent ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        ConsultaioQuery,
        { provide: SolicitudService, useClass: MockSolicitudService },
        { provide: Tramite80302Store, useClass: MockTramite80302Store }
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.solicitudService = component.solicitudService || {};
    component.solicitudService.obtenerTramiteDatos = jest.fn().mockReturnValue(observableOf({}));
    component.store = component.store || {};
    component.store.update = jest.fn();
    component.guardarDatosFormulario();
    // expect(component.solicitudService.obtenerTramiteDatos).toHaveBeenCalled();
    // expect(component.store.update).toHaveBeenCalled();
  });

  it('should run #ngAfterViewInit()', async () => {

    component.ngAfterViewInit();

  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

  it('should run #continuar()', async () => {
    component.continuarEvento = component.continuarEvento || {};
    component.continuarEvento.emit = jest.fn();
    component.continuar();
    // expect(component.continuarEvento.emit).toHaveBeenCalled();
  });

});