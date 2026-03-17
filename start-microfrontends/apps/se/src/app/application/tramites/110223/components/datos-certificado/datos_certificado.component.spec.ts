// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError,Subject } from 'rxjs';
import { Component } from '@angular/core';
import { DatosCertificadoComponent } from './datos_certificado.component';
import { Tramite110223Store } from '../../estados/Tramite110223.store';
import { Tramite110223Query } from '../../query/tramite110223.query';
import { CertificadosOrigenService } from '../../services/certificado-origen.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

class MockTramite110223Store {
  setFormDatosCertificado = jest.fn();
  setIdiomaSeleccion = jest.fn();
  setFormValida = jest.fn();
}

class MockCertificadosOrigenService {}
class MockTramite110223Query {
  formDatosCertificado$ = observableOf({});
  selectEntidadFederativa$ = observableOf([]);
  selectrepresentacionFederal$ = observableOf([]);
}
class MockConsultaioQuery {
  selectConsultaioState$ = observableOf({ readonly: false });
}

describe('DatosCertificadoComponent', () => {
  let fixture;
  let component;
  let store;
  let tramiteQuery;
  let consultaQuery;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, DatosCertificadoComponent, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Tramite110223Store, useClass: MockTramite110223Store },
        { provide: Tramite110223Query, useClass: MockTramite110223Query },
        { provide: CertificadosOrigenService, useClass: MockCertificadosOrigenService },
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(DatosCertificadoComponent);
    component = fixture.componentInstance;    store = TestBed.inject(Tramite110223Store);
    tramiteQuery = TestBed.inject(Tramite110223Query);
    consultaQuery = TestBed.inject(ConsultaioQuery);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit and set esFormularioSoloLectura', () => {
    component.consultaQuery = consultaQuery;
    component.ngOnInit();
    expect(component.esFormularioSoloLectura).toBe(false);
  });
  it('should call setValoresStore', () => {
    const spy = jest.spyOn(store, 'setFormDatosCertificado');
    component.store = store;
    component.setValoresStore({ formGroupName: 'test', campo: 'foo', valor: 'bar', storeStateName: 'test' });
    expect(spy).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should call idiomaSeleccion', () => {
    const spy = jest.spyOn(store, 'setIdiomaSeleccion');
    component.store = store;
    component.idiomaSeleccion({ id: 1 });
    expect(spy).toHaveBeenCalledWith({ id: 1 });
  });
  it('should call obtenerDatosFormulario', () => {
    const spy = jest.spyOn(store, 'setFormDatosCertificado');
    component.store = store;
    component.obtenerDatosFormulario({ formGroupName: 'test', campo: 'foo', valor: 'bar', storeStateName: 'test' });
    expect(spy).toHaveBeenCalledWith({ foo: 'bar' });
  });
  it('should call validarFormulario', () => {
    const mockRef = { validarFormularios: jest.fn().mockReturnValue(true) };
    component.datosCertificadoDeRef = mockRef as any;
    const result = component.validarFormulario();
    expect(result).toBe(true);
    expect(mockRef.validarFormularios).toHaveBeenCalled();
  });

  it('should call setFormValida', () => {
    const spy = jest.spyOn(store, 'setFormValida');
    component.store = store;
    component.setFormValida(true);
    expect(spy).toHaveBeenCalledWith({ datos: true });
  });
  it('should initialize properties correctly', () => {
    expect(component.idioma).toBe(false);
    expect(component.idiomaDatos).toEqual([]);
    expect(component.esFormularioSoloLectura).toBe(false);
    expect(component.idProcedimiento).toBe(110223);
  });

  it('should have observables initialized in constructor', () => {
    expect(component.entidadFederativas$).toBeDefined();
    expect(component.representacionFederal$).toBeDefined();
  });

  it('should call ngOnDestroy and complete notifier', () => {
    component.destroyNotifier$ = new Subject();
    const spyNext = jest.spyOn(component.destroyNotifier$, 'next');
    const spyComplete = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});