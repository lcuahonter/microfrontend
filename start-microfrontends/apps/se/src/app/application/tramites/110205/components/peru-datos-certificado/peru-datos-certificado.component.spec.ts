import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PeruDatosCertificadoComponent } from './peru-datos-certificado.component';
import { FormBuilder } from '@angular/forms';
import { PeruCertificadoService } from '../../services/peru-certificado.service';
import { Tramite110205Store } from '../../estados/tramite110205.store';
import { Tramite110205Query } from '../../estados/tramite110205.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockPeruCertificadoService {}

@Injectable()
class MockTramite110205Store {}

@Injectable()
class MockTramite110205Query {
  formDatosCertificado$ = observableOf({});
}

describe('PeruDatosCertificadoComponent', () => {
  let fixture: ComponentFixture<PeruDatosCertificadoComponent>;
  let component: { ngOnDestroy: () => void; idiomOpcion: jest.Mock<any, any, any> | (() => void); entidadFederativasOpcion: jest.Mock<any, any, any> | (() => void); representacionFederalOpcion: jest.Mock<any, any, any> | (() => void); consultaQuery: { selectConsultaioState$?: any; }; ngOnInit: () => void; store: { setFormDatosCertificado?: any; setIdiomaSeleccion?: any; setEntidadFederativaSeleccion?: any; setRepresentacionFederalDatosSeleccion?: any; setFormValida?: any; }; setValoresStore: (arg0: {}) => void; peruCertificadoService: { obtenerMenuDesplegable?: any; }; idiomaSeleccion: (arg0: {}) => void; entidadFederativaSeleccion: (arg0: {}) => void; representacionFederalSeleccion: (arg0: {}) => void; setFormValida: (arg0: {}) => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PeruDatosCertificadoComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: PeruCertificadoService, useClass: MockPeruCertificadoService },
        { provide: Tramite110205Store, useClass: MockTramite110205Store },
        { provide: Tramite110205Query, useClass: MockTramite110205Query },
        ConsultaioQuery
      ]
    }).overrideComponent(PeruDatosCertificadoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PeruDatosCertificadoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.idiomOpcion = jest.fn();
    component.entidadFederativasOpcion = jest.fn();
    component.representacionFederalOpcion = jest.fn();
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.ngOnInit();
    // expect(component.idiomOpcion).toHaveBeenCalled();
    // expect(component.entidadFederativasOpcion).toHaveBeenCalled();
    // expect(component.representacionFederalOpcion).toHaveBeenCalled();
  });

  it('should run #setValoresStore()', async () => {
    component.store = component.store || {};
    component.store.setFormDatosCertificado = jest.fn();
    component.setValoresStore({});
    // expect(component.store.setFormDatosCertificado).toHaveBeenCalled();
  });

  it('should run #idiomaSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setIdiomaSeleccion = jest.fn();
    component.idiomaSeleccion({});
    // expect(component.store.setIdiomaSeleccion).toHaveBeenCalled();
  });

  it('should run #entidadFederativaSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setEntidadFederativaSeleccion = jest.fn();
    component.entidadFederativaSeleccion({});
    // expect(component.store.setEntidadFederativaSeleccion).toHaveBeenCalled();
  });

  it('should run #representacionFederalSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setRepresentacionFederalDatosSeleccion = jest.fn();
    component.representacionFederalSeleccion({});
    // expect(component.store.setRepresentacionFederalDatosSeleccion).toHaveBeenCalled();
  });

  it('should run #setFormValida()', async () => {
    component.store = component.store || {};
    component.store.setFormValida = jest.fn();
    component.setFormValida({});
    // expect(component.store.setFormValida).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    // expect(component.destroyNotifier$.next).toHaveBeenCalled();
    // expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});