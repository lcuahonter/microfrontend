// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { CartificadoValidacionPageComponent } from './cartificado-validacion-page.component';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { Tramite110202Query } from '../../estados/tramite110202.query';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {CertificadoValidacionService} from '../../services/certificado-validacion.service'
@Injectable()
class MockTramite110202Query {
  FormaValida$ = observableOf({});
  seleccionaTab$ = observableOf({});
  selectSolicitud$ = observableOf({});
}

class MockCertificadoValidacionService {
  guardarDatosPost() {
    return observableOf({});
  }
  buildCertificado() {}
  buildDatosCertificado() {}
  buildDestinatario() {}
  buildDetallesCertificado() {}
  getAllState() {
    return observableOf({});
  }
}
describe('CartificadoValidacionPageComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,CartificadoValidacionPageComponent,HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        SeccionLibStore,
        { provide: Tramite110202Query, useClass: MockTramite110202Query },
        { provide: CertificadoValidacionService, useClass: MockCertificadoValidacionService }
      ]
    }).overrideComponent(CartificadoValidacionPageComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(CartificadoValidacionPageComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

  it('should run #getValorIndice()', async () => {
    component.datosPasos = component.datosPasos || {};
    component.datosPasos.indice = 'indice';
    component.validarTodosFormulariosPasoUno = jest.fn();
    component.obtenerDatosDelStore = jest.fn();
    component.pasos = component.pasos || {};
    component.pasoNavegarPor = jest.fn();
    component.getValorIndice({
      accion: {},
      valor: {}
    });
  });
    it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });


});