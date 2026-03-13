// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AgregarDestinatarioFinalContenedoraComponent } from './agregar-destinatario-final-contenedora.component';
import { Tramite240118Store } from '../../estados/tramite240118Store.store';
import { Tramite240118Query } from '../../estados/tramite240118Query.query';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

@Injectable()
class MockTramite240118Store {}

@Injectable()
class MockTramite240118Query {
  obtenerTercerosDatos$ = {};
}
@Injectable()
class MockDatosSolicitudService {
  obtenerDatosSolicitud() {
    return observableOf({});
  }
}



describe('AgregarDestinatarioFinalContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ AgregarDestinatarioFinalContenedoraComponent, FormsModule, ReactiveFormsModule ],
      declarations: [],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240118Store, useClass: MockTramite240118Store },
        { provide: Tramite240118Query, useClass: MockTramite240118Query },
        { provide: DatosSolicitudService, useClass: MockDatosSolicitudService },
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

  it('should have a default value for idProcedimiento', async () => {
    expect(component.idProcedimiento).toBe(240118);
  });

  it('should initialize terechosDatos$ observable from tramiteQuery', async () => {
    const mockObservable = {};
    component.tramiteQuery.obtenerTercerosDatos$ = mockObservable as any;
    component = new AgregarDestinatarioFinalContenedoraComponent(
      component.tramiteStore,
      component.tramiteQuery
    );
    expect(component.terechosDatos$).toBe(mockObservable);
  });

});