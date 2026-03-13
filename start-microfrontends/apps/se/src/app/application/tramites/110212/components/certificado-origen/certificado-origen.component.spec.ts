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
import { Tramite110212Store } from '../../../../estados/tramites/tramite110212.store';
import { Tramite110212Query } from '../../../../estados/queries/tramite110212.query';
import { ValidacionPosterioriService } from '../../service/validacion-posteriori.service';
import { ToastrService, TOAST_CONFIG } from 'ngx-toastr';
import { SeccionLibQuery, SeccionLibStore } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite110212Store {
  setFormCertificado = jest.fn();
  setbuscarMercancia = jest.fn();
    _select = jest.fn().mockReturnValue(observableOf({}));
  select = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockToastrService { 
}


@Injectable()
class MockTramite110212Query {
  selectState$ = observableOf({});
  formCertificado$ = observableOf({});
  selectAltaPlanta$ = observableOf({});
  selectPaisBloque$ = observableOf({});
  selectBuscarMercancia$ = observableOf({});
  actualizarEstadoFormulario = jest.fn();
}

@Injectable()
class MockValidacionPosterioriService {
  buscarMercanciasCert = jest.fn().mockReturnValue(observableOf({ datos: [] }));

}


describe('CertificadoOrigenComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,CertificadoOrigenComponent,HttpClientTestingModule ],

      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Tramite110212Store, useClass: MockTramite110212Store },
        { provide: Tramite110212Query, useClass: MockTramite110212Query },
        { provide: MockValidacionPosterioriService, useClass: MockValidacionPosterioriService },
        { provide: ValidacionPosterioriService, useClass: MockValidacionPosterioriService },
        ToastrService,
        SeccionLibQuery,
        SeccionLibStore,
        { provide: TOAST_CONFIG, useValue: {
          iconClasses: {
            error: 'toast-error',
            info: 'toast-info',
            success: 'toast-success',
            warning: 'toast-warning'
          },
          newestOnTop: false,
          progressBar: false,
          positionClass: 'toast-top-right',
          preventDuplicates: false,
          closeButton: false,
          timeOut: 5000,
          extendedTimeOut: 1000,
          tapToDismiss: true,
          toastClass: 'ngx-toastr',
          titleClass: 'toast-title',
          messageClass: 'toast-message',
          easing: 'ease-in',
          easeTime: 300,
          enableHtml: false,
          rtl: false,
          onActivateTick: false
        } }
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


  it('should run #inicializarEstadoFormulario()', async () => {
    component.formCertificado = component.formCertificado || {};
    component.formCertificado.disable = jest.fn();
    component.formCertificado.enable = jest.fn();
  });
  it('should run #validarFormulario()', async () => {
    component.certificadoDeOrigen = component.certificadoDeOrigen || {};
    component.certificadoDeOrigen.validarFormularios = jest.fn();
    component.validarFormulario();
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
  it('should run #guardarClicado()', async () => {
    component.guardarClicado({});
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

  it('should run #conseguirDisponiblesDatos()', async () => {
    component.certificadoState = component.certificadoState || {};
    component.certificadoState.formCertificado = {
      'entidadFederativa': {},
      'bloque': {}
    };
    component.peruCertificadoService = component.peruCertificadoService || {};
    component.peruCertificadoService.buscarMercanciasCert = jest.fn().mockReturnValue(observableOf({}));
    component.store = component.store || {};
    component.store.setDisponsiblesDatos = jest.fn();
    component.conseguirDisponiblesDatos();

  });
  it('should run #abrirModificarModal()', async () => {
    component.store = component.store || {};
    component.store.setFormMercancia = jest.fn();
    component.store.setMercanciaTablaDatos = jest.fn();
    component.cdr = { detectChanges: jest.fn() };
    component.modalInstance = component.modalInstance || {};
    component.modalInstance.show = jest.fn();
    component.abrirModificarModal({});
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