// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ModificacionSociosComponent } from './modificacion-socios.component';
import { FormBuilder } from '@angular/forms';
import { AvisoModifyService } from '../../services/aviso-modify.service';
import { Tramite32301Store } from '../../estados/tramite32301.store';
import { Tramite32301Query } from '../../estados/tramite32301.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockAvisoModifyService {}

@Injectable()
class MockTramite32301Store {}

@Injectable()
class MockTramite32301Query {
  selectState$ = observableOf({
    modificacionSociosHeader: {}
  });
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('ModificacionSociosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,ModificacionSociosComponent,HttpClientTestingModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: AvisoModifyService, useClass: MockAvisoModifyService },
        { provide: Tramite32301Store, useClass: MockTramite32301Store },
        { provide: Tramite32301Query, useClass: MockTramite32301Query },
        ConsultaioQuery
      ]
    }).overrideComponent(ModificacionSociosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ModificacionSociosComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
     expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.inicializarFormulario = jest.fn();
    component.inicializarEstadoFormulario();
     expect(component.inicializarFormulario).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.inicializarFormulario = jest.fn();
    component.agregarMiembroDeLaEmpresaFrom = component.agregarMiembroDeLaEmpresaFrom || {};
    component.agregarMiembroDeLaEmpresaFrom.disable = jest.fn();
    component.agregarMiembroDeLaEmpresaFrom.enable = jest.fn();
    component.guardarDatosFormulario();
     expect(component.inicializarFormulario).toHaveBeenCalled();
  });

  it('should run #inicializarFormulario()', async () => {
    component.initAgregarMiembroDeLaEmpresaForm = jest.fn();
    component.getSeccionMiembrosRevocados = jest.fn();
    component.getEnSuCaracterDe = jest.fn();
    component.getNacionalidad = jest.fn();
    component.getPreOperativo = jest.fn();
    component.getGridMiembrosEmpresas = jest.fn();
    component.inicializarFormulario();
     expect(component.initAgregarMiembroDeLaEmpresaForm).toHaveBeenCalled();
     expect(component.getSeccionMiembrosRevocados).toHaveBeenCalled();
     expect(component.getEnSuCaracterDe).toHaveBeenCalled();
     expect(component.getNacionalidad).toHaveBeenCalled();
     expect(component.getPreOperativo).toHaveBeenCalled();
     expect(component.getGridMiembrosEmpresas).toHaveBeenCalled();
  });

  it('should run #initAgregarMiembroDeLaEmpresaForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.initAgregarMiembroDeLaEmpresaForm();
     expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #setValoresStore()', async () => {
    component.store = component.store || {};
    component.store.metodoNombre = jest.fn();
  });

  it('should run #getValorStore()', async () => {
    component.Tramite32301Query = component.Tramite32301Query || {};
    component.Tramite32301Query.selectModificacionSocios$ = observableOf({});
    component.declareData = component.declareData || {};
    component.declareData.push = jest.fn();
    component.closeAgregarModal = jest.fn();
    component.getValorStore();
     expect(component.declareData.push).toHaveBeenCalled();
     expect(component.closeAgregarModal).toHaveBeenCalled();
  });

  it('should run #getEnSuCaracterDe()', async () => {
    component.AvisoModifyService = component.AvisoModifyService || {};
    component.AvisoModifyService.getEnSuCaracterDe = jest.fn().mockReturnValue(observableOf({}));
    component.getEnSuCaracterDe();
     expect(component.AvisoModifyService.getEnSuCaracterDe).toHaveBeenCalled();
  });

  it('should run #getNacionalidad()', async () => {
    component.AvisoModifyService = component.AvisoModifyService || {};
    component.AvisoModifyService.getNacionalidad = jest.fn().mockReturnValue(observableOf({}));
    component.getNacionalidad();
     expect(component.AvisoModifyService.getNacionalidad).toHaveBeenCalled();
  });

  it('should run #getPreOperativo()', async () => {
    component.AvisoModifyService = component.AvisoModifyService || {};
    component.AvisoModifyService.getPreOperativo = jest.fn().mockReturnValue(observableOf({}));
    component.getPreOperativo();
     expect(component.AvisoModifyService.getPreOperativo).toHaveBeenCalled();
  });

  it('should run #getGridMiembrosEmpresas()', async () => {
    component.AvisoModifyService = component.AvisoModifyService || {};
    component.AvisoModifyService.getGridMiembrosEmpresas = jest.fn().mockReturnValue(observableOf({
      tableHeader: {},
      tableBody: {}
    }));
    component.getGridMiembrosEmpresas();
     expect(component.AvisoModifyService.getGridMiembrosEmpresas).toHaveBeenCalled();
  });

  it('should run #getSeccionMiembrosRevocados()', async () => {
    component.AvisoModifyService = component.AvisoModifyService || {};
    component.AvisoModifyService.getSeccionMiembrosRevocados = jest.fn().mockReturnValue(observableOf({
      tableHeader: {}
    }));
    component.getSeccionMiembrosRevocados();
     expect(component.AvisoModifyService.getSeccionMiembrosRevocados).toHaveBeenCalled();
  });

  it('should run #updatePagination()', async () => {
    component.mercanciasData = component.mercanciasData || {};
    component.mercanciasData = ['mercanciasData'];
    component.updatePagination();

  });

  it('should run #onItemsPerPageChange()', async () => {
    component.updatePagination = jest.fn();
    component.onItemsPerPageChange({});
     expect(component.updatePagination).toHaveBeenCalled();
  });

  it('should run #onPageChange()', async () => {
    component.updatePagination = jest.fn();
    component.onPageChange({});
     expect(component.updatePagination).toHaveBeenCalled();
  });

  it('should run #openAgregarModal()', async () => {
    component.agregarModelInstance = component.agregarModelInstance || {};
    component.agregarModelInstance.show = jest.fn();
    component.openAgregarModal();
     expect(component.agregarModelInstance.show).toHaveBeenCalled();
  });

  it('should run #seleccionDeFilas()', async () => {

    component.seleccionDeFilas({});

  });

  it('should run #eliminarModificacionSociosSeleccionada()', async () => {
    component.modificacionSociosHeader = component.modificacionSociosHeader || {};
    component.modificacionSociosHeader.findIndex = jest.fn().mockReturnValue([
      {
        "id": {}
      }
    ]);
    component.modificacionSociosHeader = ['modificacionSociosHeader'];
    component.store = component.store || {};
    component.store.setModificacionSociosHeader = jest.fn();
    component.eliminarModificacionSociosSeleccionada({});
  });

  it('should run #aggregarModificacionSocios()', async () => {
    component.seleccionadasFila = component.seleccionadasFila || {};
    component.seleccionadasFila.id = 'id';
    component.modificacionSociosHeader = component.modificacionSociosHeader || {};
    component.modificacionSociosHeader.findIndex = jest.fn().mockReturnValue([
      {
        "id": {}
      }
    ]);
    component.modificacionSociosHeader = ['modificacionSociosHeader'];
    component.store = component.store || {};
    component.store.setModificacionSociosHeader = jest.fn();
    component.agregarModelInstance = component.agregarModelInstance || {};
    component.agregarModelInstance.hide = jest.fn();
    component.agregarMiembroDeLaEmpresaFrom = component.agregarMiembroDeLaEmpresaFrom || {};
    component.agregarMiembroDeLaEmpresaFrom.reset = jest.fn();
    component.aggregarModificacionSocios({
      getRawValue: function() {
        return {
          nombreEmpresa: {},
          obligadoaTributarenMéxico: {},
          nacionalidad: {},
          ensucarácterde: {},
          rfc: {},
          nombreCompleto: {},
          id: {}
        };
      }
    });
     expect(component.store.setModificacionSociosHeader).toHaveBeenCalled();
     expect(component.agregarModelInstance.hide).toHaveBeenCalled();
     expect(component.agregarMiembroDeLaEmpresaFrom.reset).toHaveBeenCalled();
  });

  it('should run #openRaticarModal()', async () => {

    component.openRaticarModal();

  });

  it('should run #openRevocarModal()', async () => {

    component.openRevocarModal();

  });

  it('should run #openCorrectamenteModel()', async () => {

    component.openCorrectamenteModel();

  });

  it('should run #closeAgregarModal()', async () => {
    component.agregarModelInstance = component.agregarModelInstance || {};
    component.agregarModelInstance.hide = jest.fn();
    component.openCorrectamenteModel = jest.fn();
    component.closeAgregarModal();
     expect(component.agregarModelInstance.hide).toHaveBeenCalled();
     expect(component.openCorrectamenteModel).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
     expect(component.destroy$.next).toHaveBeenCalled();
     expect(component.destroy$.complete).toHaveBeenCalled();
  });

});