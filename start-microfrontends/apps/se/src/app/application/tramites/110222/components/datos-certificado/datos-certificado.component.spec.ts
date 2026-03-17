// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError,Subject } from 'rxjs';
import { Component } from '@angular/core';
import { DatosCertificadoComponent } from './datos-certificado.component';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';
import { Tramite110222Store } from '../../estados/tramite110222.store';
import { Tramite110222Query } from '../../estados/tramite110222.query';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
@Injectable()
class MockValidarInicialmenteCertificadoService {}




class MockTramite110222Store {
  setFormDatosCertificado = jest.fn();
  setIdiomaSeleccion = jest.fn();
  setRepresentacionFederalDatosSeleccion = jest.fn();
  setFormValida = jest.fn();
}
class MockTramite110222Query {
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
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [DatosCertificadoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: Tramite110222Store, useClass: MockTramite110222Store },
        { provide: Tramite110222Query, useClass: MockTramite110222Query },
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(DatosCertificadoComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Tramite110222Store);
    tramiteQuery = TestBed.inject(Tramite110222Query);
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
    component.setValoresStore({ campo: 'foo', valor: 'bar' });
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
    component.obtenerDatosFormulario({ foo: 'bar' });
    expect(spy).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should call representacionFederalSeleccion', () => {
    const spy = jest.spyOn(store, 'setRepresentacionFederalDatosSeleccion');
    component.store = store;
    component.representacionFederalSeleccion({ id: 2 });
    expect(spy).toHaveBeenCalledWith({ id: 2 });
  });

  it('should call setFormValida', () => {
    const spy = jest.spyOn(store, 'setFormValida');
    component.store = store;
    component.setFormValida(true);
    expect(spy).toHaveBeenCalledWith({ datos: true });
  });

  it('should get childForm as null if no ref', () => {
    component.datosCertificadoDeRef = undefined;
    expect(component.childForm).toBeNull();
  });

  it('should get childForm as FormGroup if ref exists', () => {
    const fg = new FormGroup({ test: new FormControl('') });
    component.datosCertificadoDeRef = { formDatosCertificado: fg };
    expect(component.childForm).toBe(fg);
  });

  it('should call isChildFormValid true/false', () => {
    component.datosCertificadoDeRef = { validarFormularios: jest.fn(() => true) };
    expect(component.isChildFormValid()).toBe(true);
    component.datosCertificadoDeRef = { validarFormularios: jest.fn(() => false) };
    expect(component.isChildFormValid()).toBe(false);
    component.datosCertificadoDeRef = undefined;
    expect(component.isChildFormValid()).toBe(false);
  });

  it('should getChildFormControl return null if no childForm', () => {
    component.datosCertificadoDeRef = undefined;
    expect(component.getChildFormControl('foo')).toBeNull();
  });

  it('should getChildFormControl return FormControl if exists', () => {
    const fc = new FormControl('bar');
    const fg = new FormGroup({ foo: fc });
    component.datosCertificadoDeRef = { formDatosCertificado: fg };
    expect(component.getChildFormControl('foo')).toBe(fc);
  });

  it('should setChildFormValues if childForm exists', () => {
    const fg = new FormGroup({ foo: new FormControl('') });
    const spy = jest.spyOn(fg, 'patchValue');
    component.datosCertificadoDeRef = { formDatosCertificado: fg };
    component.setChildFormValues({ foo: 'bar' });
    expect(spy).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should not setChildFormValues if no childForm', () => {
    component.datosCertificadoDeRef = undefined;
    expect(() => component.setChildFormValues({ foo: 'bar' })).not.toThrow();
  });

  it('should validateAll true/false and call setFormValida', () => {
    const spy = jest.spyOn(component, 'setFormValida');
    component.datosCertificadoDeRef = { validarFormularios: jest.fn(() => true) };
    expect(component.validateAll()).toBe(true);
    expect(spy).toHaveBeenCalledWith(true);
    component.datosCertificadoDeRef = { validarFormularios: jest.fn(() => false) };
    expect(component.validateAll()).toBe(false);
    expect(spy).toHaveBeenCalledWith(false);
    component.datosCertificadoDeRef = undefined;
    expect(component.validateAll()).toBe(true);
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