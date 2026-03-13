// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { CertificadoOrigenComponent } from './certificado-origen.component';
import { FormBuilder } from '@angular/forms';
import { Tramite110204Store } from '../../estados/tramite110204.store';
import { Tramite110204Query } from '../../estados/tramite110204.query';
import { CertificadosOrigenGridService } from '../../services/certificadosOrigenGrid.service';
import { ToastrService } from 'ngx-toastr';
import { SeccionLibQuery, SeccionLibStore } from '@libs/shared/data-access-user/src';

@Injectable()
class MockTramite110204Store {}

@Injectable()
class MockToastrService { }


@Injectable()
class MockTramite110204Query {
  formCertificado$ = observableOf({});
  selectAltaPlanta$ = observableOf({});
  selectPaisBloque$ = observableOf({});
  selectBuscarMercancia$ = observableOf({});
}

@Injectable()
class MockCertificadosOrigenGridService {}


describe('CertificadoOrigenComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,CertificadoOrigenComponent ],

      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Tramite110204Store, useClass: MockTramite110204Store },
        { provide: Tramite110204Query, useClass: MockTramite110204Query },
        { provide: CertificadosOrigenGridService, useClass: MockCertificadosOrigenGridService },
        ToastrService,
        SeccionLibQuery,
        SeccionLibStore
      ]
    }).overrideComponent(CertificadoOrigenComponent, {

      set: { providers: [{ provide: ToastrService, useClass: MockToastrService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(CertificadoOrigenComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #formularioControl', async () => {
    component.formCertificado = component.formCertificado || {};
    component.formCertificado.get = jest.fn();
    const formularioControl = component.formularioControl;
  });

  it('should run #ngOnInit()', async () => {
    component.cargarEstados = jest.fn();
    component.cargarBloque = jest.fn();
    component.formCertificado = component.formCertificado || {};
    component.formCertificado.valueChanges = observableOf({});
    component.store = component.store || {};
    component.store.setFormCertificado = jest.fn();
    component.validarFormulario = jest.fn();
    component.inicializarEstadoFormulario = jest.fn();

    component.ngOnInit();

    expect(component.cargarEstados).toHaveBeenCalled();
    expect(component.cargarBloque).toHaveBeenCalled();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.formCertificado = component.formCertificado || {};
    component.formCertificado.disable = jest.fn();
    component.formCertificado.enable = jest.fn();
  });

  it('should run #cargarEstados()', async () => {
    component.certificadoService = component.certificadoService || {};
    component.certificadoService.obtenerListaEstado = jest.fn().mockReturnValue(observableOf({}));
    component.store = component.store || {};
    component.store.setaltaPlanta = jest.fn();
    component.cargarEstados();
    expect(component.certificadoService.obtenerListaEstado).toHaveBeenCalled();
    expect(component.store.setaltaPlanta).toHaveBeenCalled();
  });

  it('should run #cargarBloque()', async () => {
    component.certificadoService = component.certificadoService || {};
    component.certificadoService.obtenerPaisBloque = jest.fn().mockReturnValue(observableOf({}));
    component.store = component.store || {};
    component.store.setBloque = jest.fn();
    component.cargarBloque();
    expect(component.certificadoService.obtenerPaisBloque).toHaveBeenCalled();
    expect(component.store.setBloque).toHaveBeenCalled();
  });

  it('should run #tipoEstadoSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setEstado = jest.fn();
    component.tipoEstadoSeleccion({});
    expect(component.store.setEstado).toHaveBeenCalled();
  });

  it('should run #tipoSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setBloque = jest.fn();
    component.tipoSeleccion({});
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

  it('should run #buscarrMercancia()', async () => {
    component.formCertificado = component.formCertificado || {};
    component.formCertificado.value = 'value';
    component.certificadoService = component.certificadoService || {};
    component.certificadoService.obtenerMercancia = jest.fn().mockReturnValue(observableOf({}));
    component.store = component.store || {};
    component.store.setbuscarMercancia = jest.fn();
    component.toastr = component.toastr || {};
    component.toastr.error = jest.fn();
    component.buscarrMercancia();
  });

  it('should run #abrirModificarModal()', async () => {
    component.store = component.store || {};
    component.store.setFormMercancia = jest.fn();
    component.modalInstance = component.modalInstance || {};
    component.modalInstance.show = jest.fn();
    component.abrirModificarModal({});
  });

  it('should run #setValoresStore()',  () => {
    component.store = component.store || {};
    component.store.setFormCertificadoGenric = jest.fn();
    component.setValoresStore({});
    expect(component.store.setFormCertificadoGenric).toHaveBeenCalled();
  });


  it('should run #conseguirDisponiblesDatos()',  () => {
    component.ValidarInicialmenteCertificadoService = component.ValidarInicialmenteCertificadoService || {};
  component.ValidarInicialmenteCertificadoService.obtenerTablaDatos = jest.fn().mockReturnValue(of({}));
    component.conseguirDisponiblesDatos();
  });
  it('should run #cerrarModificarModal()', async () => {
    component.modalInstance = component.modalInstance || {};
    component.modalInstance.hide = jest.fn();
    component.cerrarModificarModal();
  });

  it('should run #ngAfterViewInit()', async () => {
    component.ngAfterViewInit();

  });

});