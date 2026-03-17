// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { CargaDeMercanciasComponent } from './cargaDeMercancias.component';
import { FormBuilder } from '@angular/forms';
import { ValidarInicalmenteService } from '../../services/validar-inicalmente/validar-inicalmente.service';
import { Tramite110208Store } from '../../../../estados/tramites/tramite110208.store';
import { Tramite110208Query } from '../../../../estados/queries/tramite110208.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';

@Injectable()
class MockValidarInicalmenteService {
  obtenerTablaDatos = jest.fn().mockReturnValue(observableOf({}));
  obtenerFormDatos = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockTramite110208Store {
  setUmc = jest.fn();
  setCantidad = jest.fn()
  setValorDeLa = jest.fn();
  setComplementoDescripcion = jest.fn();
  setNFactura = jest.fn();
  setTipoDeFactura = jest.fn()
  setFechaFactura = jest.fn();

}

@Injectable()
class MockTramite110208Query {
  selectSolicitud$ = observableOf({});
  actualizarEstadoFormulario = jest.fn();
}


describe('CargaDeMercanciasComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,CargaDeMercanciasComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: ValidarInicalmenteService, useClass: MockValidarInicalmenteService },
        { provide: Tramite110208Store, useClass: MockTramite110208Store },
        { provide: Tramite110208Query, useClass: MockTramite110208Query },
        ConsultaioQuery,
        ValidacionesFormularioService
      ]
    }).overrideComponent(CargaDeMercanciasComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(CargaDeMercanciasComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });



  it('should run #cargarArchivo()', async () => {
    component.cargarArchivoInstance = component.cargarArchivoInstance || {};
    component.cargarArchivoInstance.show = jest.fn();
    component.cargarArchivo();
  });

  it('should run #cerrar()', async () => {
    component.cargarArchivoInstance = component.cargarArchivoInstance || {};
    component.cargarArchivoInstance.hide = jest.fn();
    component.cerrar();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.obtenerTablaDatos = jest.fn();
    component.obtenerEstadoList = jest.fn();
    component.obtenerFormDatos = jest.fn();
    component.ngOnInit();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.tramite110208Query = component.tramite110208Query || {};
    component.tramite110208Query.selectSolicitud$ = observableOf({});
    component.solicitudState = component.solicitudState || {};
    component.solicitudState.umc = 'umc';
    component.solicitudState.cantidad = 'cantidad';
    component.solicitudState.valorDeLa = 'valorDeLa';
    component.solicitudState.complementoDescripcion = 'complementoDescripcion';
    component.solicitudState.nFactura = 'nFactura';
    component.solicitudState.tipoDeFactura = 'tipoDeFactura';
    component.solicitudState.fechaFactura = 'fechaFactura';
    component.solicitudState.disable = jest.fn();
    component.fb = component.fb || {};
    component.fb.group = jest.fn().mockReturnValue({
      get: function() {},
      controls: {}
    });
    component.inicializarEstadoFormulario();
  });

  it('should run #obtenerTablaDatos()', async () => {
    component.service = component.service || {};
    component.service.obtenerTablaDatos = jest.fn().mockReturnValue(observableOf({
      data: {}
    }));
    component.obtenerTablaDatos();
  });

  it('should run #obtenerFormDatos()', async () => {
    component.service = component.service || {};
    component.service.obtenerFormDatos = jest.fn().mockReturnValue(observableOf({
      data: {}
    }));
    component.mercanciasFormaDatos = component.mercanciasFormaDatos || {};
    component.mercanciasFormaDatos = {
      fraccionArancelaria: {},
      nombreComercial: {},
      nombreTecnio: {},
      nombreEnIngles: {},
      criterioPara: {}
    };
    component.formMercancia = component.formMercancia || {};
    component.formMercancia.patchValue = jest.fn();
    component.obtenerFormDatos();
  });



  it('should run #cerrarModal()', async () => {
    component.closeModal = component.closeModal || {};
    component.closeModal.nativeElement = {
      click: function() {}
    };
    component.cerrarModal();

  });

  it('should run #obtenerEstadoList()', async () => {
    component.service = component.service || {};
    component.service.obtenerEstadoList = jest.fn().mockReturnValue(observableOf({
      data: {}
    }));
    component.obtenerEstadoList();
  });



  it('should run #esValido()', async () => {
    component.validacionesService = component.validacionesService || {};
    component.validacionesService.isValid = jest.fn();
    component.esValido({});
  });


  it('should run #formatearACuatroDecimales()', async () => {
    component.formMercancia = component.formMercancia || {};
    component.formMercancia.get = jest.fn().mockReturnValue({
      setValue: function() {},
      value: {}
    });
    component.formatearACuatroDecimales({});
  });

  it('should run #buscarAgregar()', async () => {

    component.buscarAgregar();

  });

  it('should run #eventoDeCambioDeValor()', async () => {

    component.eventoDeCambioDeValor({
      target: {
        files: {},
        value: {}
      }
    }, {});

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

});