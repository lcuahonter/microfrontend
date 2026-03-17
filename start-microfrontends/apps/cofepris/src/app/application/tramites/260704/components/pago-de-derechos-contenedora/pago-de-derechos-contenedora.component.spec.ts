// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEM, Input, Output, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PagoDeDerechosContenedoraComponent } from './pago-de-derechos-contenedora.component';
import { Tramite260102Store } from '../../estados/stores/tramite260102Store.store';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite260102Store {
  getValue = function() {
    return {
      pagoDerechos: {}
    };
  };
}
@Injectable()
class MockTramite260102Query {}

@Injectable()
class MockDatosSolicitudService {}

describe('PagoDeDerechosContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, DatosDeLaSolicitudComponent, HttpClientTestingModule,PagoDeDerechosContenedoraComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite260102Store, useClass: MockTramite260102Store },
        ConsultaioQuery,
        DatosSolicitudService,
      ]
    }).overrideComponent(PagoDeDerechosContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PagoDeDerechosContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #updatePagoDerechos()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updatePagoDerechos = jest.fn();
    component.updatePagoDerechos({});
    expect(component.tramiteStore.updatePagoDerechos).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.idProcedimiento = component.idProcedimiento || {};
    component.ngOnInit();
  });

});