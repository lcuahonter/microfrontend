// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AgregarDestinatarioFinalContenedoraComponent } from './agregar-destinatario-final-contenedora.component';
import { Tramite240101Store } from '../../estados/tramite240101Store.store';
import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite240101Store {}

describe('AgregarDestinatarioFinalContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, AgregarDestinatarioFinalComponent, HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240101Store, useClass: MockTramite240101Store },
        DatosSolicitudService
      ]
    }).overrideComponent(AgregarDestinatarioFinalContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AgregarDestinatarioFinalContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #updateDestinatarioFinalTablaDatos()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateDestinatarioFinalTablaDatos = jest.fn();
    component.updateDestinatarioFinalTablaDatos({});
    expect(component.tramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalled();
  });

});