// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitudComponent } from './solicitud.component';
import { ConsultaAvisoAcreditacionService } from '../../services/consulta-aviso-acreditacion.service';
import { FormBuilder } from '@angular/forms';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Tramite32101Store } from '../../../../estados/tramites/tramite32101.store';
import { Tramite32101Query } from '../../../../estados/queries/tramite32101.query';
import { Router } from '@angular/router';

@Injectable()
class MockConsultaAvisoAcreditacionService {}

@Injectable()
class MockTramite32101Store {}

@Injectable()
class MockTramite32101Query {}

@Injectable()
class MockRouter {
  navigate() {};
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

describe('SolicitudComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SolicitudComponent, FormsModule, ReactiveFormsModule ],
      declarations: [
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ConsultaAvisoAcreditacionService, useClass: MockConsultaAvisoAcreditacionService },
        FormBuilder,
        ValidacionesFormularioService,
        { provide: Tramite32101Store, useClass: MockTramite32101Store },
        { provide: Tramite32101Query, useClass: MockTramite32101Query },
        { provide: Router, useClass: MockRouter }
      ]
    }).overrideComponent(SolicitudComponent, {

      set: { providers: [{ provide: ConsultaAvisoAcreditacionService, useClass: MockConsultaAvisoAcreditacionService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #tipoDeInversion', async () => {
    component.registroForm = component.registroForm || {};
    component.registroForm.get = jest.fn();
    const tipoDeInversion = component.tipoDeInversion;
  });

  it('should run GetterDeclaration #valorEnPesos', async () => {
    component.registroForm = component.registroForm || {};
    component.registroForm.get = jest.fn();
    const valorEnPesos = component.valorEnPesos;
  });

  it('should run GetterDeclaration #claveDeReferencia', async () => {
    component.registroForm = component.registroForm || {};
    component.registroForm.get = jest.fn();
    const claveDeReferencia = component.claveDeReferencia;
  });

  it('should run GetterDeclaration #importeDePago', async () => {
    component.registroForm = component.registroForm || {};
    component.registroForm.get = jest.fn();
    const importeDePago = component.importeDePago;
  });

  it('should run GetterDeclaration #cadenaDeLaDependencia', async () => {
    component.registroForm = component.registroForm || {};
    component.registroForm.get = jest.fn();
    const cadenaDeLaDependencia = component.cadenaDeLaDependencia;
  });

  it('should run GetterDeclaration #llaveDePago', async () => {
    component.registroForm = component.registroForm || {};
    component.registroForm.get = jest.fn();
    const llaveDePago = component.llaveDePago;
  });

  it('should run GetterDeclaration #numeroDeOperacion', async () => {
    component.registroForm = component.registroForm || {};
    component.registroForm.get = jest.fn();
    const numeroDeOperacion = component.numeroDeOperacion;
  });

  it('should run GetterDeclaration #descripcionGeneral', async () => {
    component.registroForm = component.registroForm || {};
    component.registroForm.get = jest.fn();
    const descripcionGeneral = component.descripcionGeneral;
  });

  it('should run #inicializarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.solicitudState = component.solicitudState || {};
    component.solicitudState.listaDeDocumentos = 'listaDeDocumentos';
    component.solicitudState.valorEnPesos = 'valorEnPesos';
    component.solicitudState.descripcionGeneral = 'descripcionGeneral';
    component.solicitudState.manifiesto1 = 'manifiesto1';
    component.solicitudState.manifiesto2 = 'manifiesto2';
    component.solicitudState.manifiesto3 = 'manifiesto3';
    component.solicitudState.claveDeReferencia = 'claveDeReferencia';
    component.solicitudState.cadenaDeLaDependencia = 'cadenaDeLaDependencia';
    component.solicitudState.numeroDeOperacion = 'numeroDeOperacion';
    component.solicitudState.banco = 'banco';
    component.solicitudState.llaveDePago = 'llaveDePago';
    component.solicitudState.fechaInicialInput = 'fechaInicialInput';
    component.solicitudState.importeDePago = 'importeDePago';
    component.inicializarFormulario();
  });

  it('should run #setValoresStore()', async () => {
    const mockForm = {
      get: jest.fn().mockReturnValue({ value: 'mockValue' })
    } as any;

    component.tramite32101Store = {
      metodoNombre: jest.fn()
    };

    component.setValoresStore(mockForm, 'someField', 'metodoNombre');
    
    expect(component.tramite32101Store.metodoNombre).toHaveBeenCalledWith('mockValue');
  });

  it('should run #isValid()', async () => {
    component.validacionesService = component.validacionesService || {};
    component.validacionesService.isValid = jest.fn();
    component.isValid({}, {});
  });

  it('should run #fetchListaDeDocumentos()', async () => {
    component.consultaAvisoAcreditacionService = component.consultaAvisoAcreditacionService || {};
    component.consultaAvisoAcreditacionService.getListaDeDocumentos = jest.fn().mockReturnValue(observableOf({
      data: {}
    }));
    component.tramiteList = component.tramiteList || {};
    component.tramiteList.catalogos = 'catalogos';
    component.fetchListaDeDocumentos();
  });

  it('should run #fetchListaDeInversion()', async () => {
    component.consultaAvisoAcreditacionService = component.consultaAvisoAcreditacionService || {};
    component.consultaAvisoAcreditacionService.getListaDeDocumentos = jest.fn().mockReturnValue(observableOf({
      data: {}
    }));
    component.aduana = component.aduana || {};
    component.aduana.catalogos = 'catalogos';
    component.fetchListaDeInversion();
  });

  it('should run #fetchBancoList()', async () => {
    component.consultaAvisoAcreditacionService = component.consultaAvisoAcreditacionService || {};
    component.consultaAvisoAcreditacionService.getListaDeDocumentos = jest.fn().mockReturnValue(observableOf({
      data: {}
    }));
    component.banco = component.banco || {};
    component.banco.catalogos = 'catalogos';
    component.fetchBancoList();
  });

  it('should run #onCheckboxClicked()', async () => {
    component.selectedRows = component.selectedRows || {};
    component.selectedRows.includes = jest.fn();
    component.selectedRows.push = jest.fn();
    component.selectedRows = ['selectedRows'];
    component.onCheckboxClicked({});
  });

  it('should run #modificarFilaSeleccionada()', async () => {
    component.selectedRows = component.selectedRows || {};
    component.selectedRows[0] = '0';
    component.consultaAvisoAcreditacionService = component.consultaAvisoAcreditacionService || {};
    component.consultaAvisoAcreditacionService.setUpdatedRow = jest.fn();
    component.tramite32101Store = component.tramite32101Store || {};
    component.tramite32101Store.setAbc = jest.fn();
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    window.alert = jest.fn();
    component.modificarFilaSeleccionada();
  });

  it('should run #eliminarFilasSeleccionadas()', async () => {
    component.selectedRows = component.selectedRows || {};
    component.selectedRows.includes = jest.fn();
    component.configuracionTablaDatos = component.configuracionTablaDatos || {};
    component.configuracionTablaDatos = ['configuracionTablaDatos'];
    component.tramite32101Store = component.tramite32101Store || {};
    component.tramite32101Store.setDatosDelContenedor = jest.fn();
    component.abrirEleminarModal = jest.fn();
    window.alert = jest.fn();
    component.eliminarFilasSeleccionadas();
  });

  it('should run #cambioFechaIngreso()', () => {
    const mockControl = {
      markAsUntouched: jest.fn(),
      setValue: jest.fn()
    };

    component.registroForm = {
      get: jest.fn().mockReturnValue(mockControl)
    } as any;

    component.tramite32101Store = {
      setFechaInicialInput: jest.fn()
    } as any;

    component.cambioFechaIngreso('2024-06-25');

    expect(component.registroForm.get).toHaveBeenCalledWith('fechaInicialInput');
    expect(mockControl.setValue).toHaveBeenCalledWith('2024-06-25');
    expect(mockControl.markAsUntouched).toHaveBeenCalled();
    expect(component.tramite32101Store.setFechaInicialInput).toHaveBeenCalledWith('2024-06-25');
  });

  it('should run #updateTableRow()', async () => {
    component.configuracionTablaDatos = component.configuracionTablaDatos || {};
    component.configuracionTablaDatos.findIndex = jest.fn().mockReturnValue([
      {
        "id": {}
      }
    ]);
    component.configuracionTablaDatos.INDEX = 'INDEX';
    component.updateTableRow({
      id: {}
    });
  });

  it('should run #abrirModal()', async () => {

    component.abrirModal();

  });

  it('should run #abrirEleminarModal()', async () => {

    component.abrirEleminarModal();

  });

});