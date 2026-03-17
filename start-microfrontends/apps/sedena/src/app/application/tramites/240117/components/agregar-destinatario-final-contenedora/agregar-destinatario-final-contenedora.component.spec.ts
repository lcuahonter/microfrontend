// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Injectable,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  Input,
  Output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AgregarDestinatarioFinalContenedoraComponent } from './agregar-destinatario-final-contenedora.component';
import { Tramite240117Store } from '../../estados/tramite240117Store.store';
import { Tramite240117Query } from '../../estados/tramite240117Query.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

@Injectable()
class MockTramite240117Store {}

@Injectable()
class MockTramite240117Query {
  obtenerTercerosDatos$ = {};
}

@Injectable()
class MockDatosSolicitudService {}

describe('AgregarDestinatarioFinalContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        AgregarDestinatarioFinalContenedoraComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Tramite240117Store, useClass: MockTramite240117Store },
        { provide: Tramite240117Query, useClass: MockTramite240117Query },
        { provide: DatosSolicitudService, useClass: MockDatosSolicitudService },
        ConsultaioQuery,
      ],
    })
      .overrideComponent(AgregarDestinatarioFinalContenedoraComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(
      AgregarDestinatarioFinalContenedoraComponent
    );
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #updateDestinatarioFinalTablaDatos()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateDestinatarioFinalTablaDatos = jest.fn();
    component.updateDestinatarioFinalTablaDatos({});
    expect(
      component.tramiteStore.updateDestinatarioFinalTablaDatos
    ).toHaveBeenCalled();
  });
});
