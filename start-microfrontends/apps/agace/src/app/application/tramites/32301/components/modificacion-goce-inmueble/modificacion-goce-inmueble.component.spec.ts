// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ModificacionGoceInmuebleComponent } from './modificacion-goce-inmueble.component';
import { FormBuilder } from '@angular/forms';
import { AvisoModifyService } from '../../services/aviso-modify.service';
import { Tramite32301Store } from '../../estados/tramite32301.store';
import { Tramite32301Query } from '../../estados/tramite32301.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockAvisoModifyService { }

@Injectable()
class MockTramite32301Store { }

@Injectable()
class MockTramite32301Query { }

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('ModificacionGoceInmuebleComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ModificacionGoceInmuebleComponent, HttpClientTestingModule],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: AvisoModifyService, useClass: MockAvisoModifyService },
        { provide: Tramite32301Store, useClass: MockTramite32301Store },
        { provide: Tramite32301Query, useClass: MockTramite32301Query },
        ConsultaioQuery
      ]
    }).overrideComponent(ModificacionGoceInmuebleComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ModificacionGoceInmuebleComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.Tramite32301Query = component.Tramite32301Query || {};
    component.Tramite32301Query.selectState$ = observableOf({
      mostrarGridNuevoHeaderData: {},
      modificacionGoceForm: {}
    });
    component.modificacionGoceForm = component.modificacionGoceForm || {};
    component.modificacionGoceForm.patchValue = jest.fn();
    component.verificaRadioTipoSem = jest.fn();
    component.ngOnInit();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
    expect(component.modificacionGoceForm.patchValue).toHaveBeenCalled();
    expect(component.verificaRadioTipoSem).toHaveBeenCalled();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.inicializarFormulario = jest.fn();
    component.inicializarEstadoFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.inicializarFormulario = jest.fn();
    component.direccionGrid = component.direccionGrid || {};
    component.direccionGrid.disable = jest.fn();
    component.direccionGrid.enable = jest.fn();
    component.modificacionGoceForm = component.modificacionGoceForm || {};
    component.modificacionGoceForm.disable = jest.fn();
    component.modificacionGoceForm.enable = jest.fn();
    component.guardarDatosFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
  });

  it('should run #inicializarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.initializeForm = jest.fn();
    component.getEntidadFederativa = jest.fn();
    component.inicializarFormulario();
    expect(component.fb.group).toHaveBeenCalled();
    expect(component.initializeForm).toHaveBeenCalled();
    expect(component.getEntidadFederativa).toHaveBeenCalled();
  });

  it('should run #getEntidadFederativa()', async () => {
    component.AvisoModifyService = component.AvisoModifyService || {};
    component.AvisoModifyService.getEntidadFederativa = jest.fn().mockReturnValue(observableOf({}));
    component.getEntidadFederativa();
    expect(component.AvisoModifyService.getEntidadFederativa).toHaveBeenCalled();
  });

  it('should run #initializeForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.initializeForm();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #verificaRadioTipoSem()', async () => {
    component.openModificarModel = jest.fn();
    component.verificaRadioTipoSem({});
  });

  it('should run #abrirModalDomiciliosNvo()', async () => {
    component.openModalDomiciliosInmuebleNuevoModel = jest.fn();
    component.abrirModalDomiciliosNvo();
  });

  it('should run #cargarDatosRfcPartesC()', async () => {
    component.direccionGrid = component.direccionGrid || {};
    component.direccionGrid.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.direccionGrid.patchValue = jest.fn();
    component.cargarDatosRfcPartesC();
    expect(component.direccionGrid.get).toHaveBeenCalled();
    expect(component.direccionGrid.patchValue).toHaveBeenCalled();
  });

  it('should run #limpiaCamposParteC()', async () => {
    component.direccionGrid = component.direccionGrid || {};
    component.direccionGrid.patchValue = jest.fn();
    component.limpiaCamposParteC();
    expect(component.direccionGrid.patchValue).toHaveBeenCalled();
  });

  it('should run #eliminarParteC()', async () => {
    component.modificacionPartes = component.modificacionPartes || {};
    component.modificacionPartesData = component.modificacionPartesData || {};
    component.modificacionPartesData = {
      tbodyData: {
        pop: function () { }
      }
    };
    component.eliminarParteC();

  });

  it('should run #setValoresStore()', async () => {
    component.store = component.store || {};
    component.store.metodoNombre = jest.fn();
  });

  it('should run #getValorStore()', async () => {
    component.Tramite32301Query = component.Tramite32301Query || {};
    component.Tramite32301Query.selectModificacionGoceInmueble$ = observableOf({});
    component.getValorStore();

  });

  it('should run #guardarDomInmuebleNvo()', async () => {
    component.seleccionadasFila = component.seleccionadasFila || {};
    component.seleccionadasFila.id = 'id';
    component.mostrarGridNuevoHeaderData = component.mostrarGridNuevoHeaderData || {};
    component.mostrarGridNuevoHeaderData.findIndex = jest.fn().mockReturnValue([
      {
        "id": {}
      }
    ]);
    component.mostrarGridNuevoHeaderData = ['mostrarGridNuevoHeaderData'];
    component.store = component.store || {};
    component.store.setMostrarGridNuevoHeaderData = jest.fn();
    component.modalDomiciliosInmuebleNuevoInstance = component.modalDomiciliosInmuebleNuevoInstance || {};
    component.modalDomiciliosInmuebleNuevoInstance.hide = jest.fn();
    component.direccionGrid = component.direccionGrid || {};
    component.direccionGrid.reset = jest.fn();
    component.guardarDomInmuebleNvo({
      getRawValue: function () {
        return {
          observaciones: {},
          fechaFinVigencia: {},
          fechaInicioDeVigencia: {},
          cveTipoDoc: {},
          tipoDeDocumentoConElQueSeAcreditaElUsoYGoce: {},
          cveMunicipio: {},
          alcaldiaOMunicipio: {},
          cveEntidad: {},
          codigoPostal: {},
          domicilio: {},
          idAviInmueble: {},
          id: {}
        };
      }
    });
    expect(component.store.setMostrarGridNuevoHeaderData).toHaveBeenCalled();
    expect(component.modalDomiciliosInmuebleNuevoInstance.hide).toHaveBeenCalled();
    expect(component.direccionGrid.reset).toHaveBeenCalled();
  });

  it('should run #cerrarDialogoDomInmuebleNvo()', async () => {
    component.closeModalDomiciliosInmuebleNuevoModel = jest.fn();
    component.cerrarDialogoDomInmuebleNvo();
    expect(component.closeModalDomiciliosInmuebleNuevoModel).toHaveBeenCalled();
  });

  it('should run #openModificarModel()', async () => {

    component.openModificarModel();

  });

  it('should run #openModalDomiciliosInmuebleNuevoModel()', async () => {
    component.modalDomiciliosInmuebleNuevoInstance = component.modalDomiciliosInmuebleNuevoInstance || {};
    component.modalDomiciliosInmuebleNuevoInstance.show = jest.fn();
    component.openModalDomiciliosInmuebleNuevoModel();
    expect(component.modalDomiciliosInmuebleNuevoInstance.show).toHaveBeenCalled();
  });

  it('should run #closeModalDomiciliosInmuebleNuevoModel()', async () => {
    component.modalDomiciliosInmuebleNuevoInstance = component.modalDomiciliosInmuebleNuevoInstance || {};
    component.modalDomiciliosInmuebleNuevoInstance.hide = jest.fn();
    component.closeModalDomiciliosInmuebleNuevoModel();
    expect(component.modalDomiciliosInmuebleNuevoInstance.hide).toHaveBeenCalled();
  });

  it('should run #openModificarRecordModel()', async () => {

    component.openModificarRecordModel();

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });

  it('should run #seleccionDeFilas()', async () => {

    component.seleccionDeFilas({});

  });

  it('should run #modificarDomicilioSeleccionado()', async () => {
    component.modalDomiciliosInmuebleNuevoInstance = component.modalDomiciliosInmuebleNuevoInstance || {};
    component.modalDomiciliosInmuebleNuevoInstance.show = jest.fn();
    component.seleccionadasFila = component.seleccionadasFila || {};
    component.seleccionadasFila.id = 'id';
    component.direccionGrid = component.direccionGrid || {};
    component.direccionGrid.patchValue = jest.fn();
    component.mostrarGridNuevoHeaderData = component.mostrarGridNuevoHeaderData || {};
    component.modificarDomicilioSeleccionado({});
    expect(component.modalDomiciliosInmuebleNuevoInstance.show).toHaveBeenCalled();
    expect(component.direccionGrid.patchValue).toHaveBeenCalled();
  });

  it('should run #eliminaDomicilioSeleccionado()', async () => {
    component.gridDomiciliosModificadosData = component.gridDomiciliosModificadosData || {};
    component.gridDomiciliosModificadosData.findIndex = jest.fn().mockReturnValue([
      {
        "id": {}
      }
    ]);
    component.gridDomiciliosModificadosData = ['gridDomiciliosModificadosData'];
    component.store = component.store || {};
    component.store.setMostrarGridNuevoHeaderData = jest.fn();
    component.eliminaDomicilioSeleccionado({});
  });

});