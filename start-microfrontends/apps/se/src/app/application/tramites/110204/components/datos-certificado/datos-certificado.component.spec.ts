// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosCertificadoComponent } from './datos-certificado.component';
import { FormBuilder } from '@angular/forms';
import { Tramite110204Store } from '../../estados/tramite110204.store';
import { Tramite110204Query } from '../../estados/tramite110204.query';
import { CertificadosOrigenGridService } from '../../services/certificadosOrigenGrid.service';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { SeccionLibQuery, SeccionLibStore } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite110204Store {
  setFormDatosCertificado = jest.fn();
  setEntidadFederativaDatosSeleccion = jest.fn();
  setRepresentacionFederalDatosSeleccion = jest.fn();
  setIdiomaDatos = jest.fn();
  setIdiomaSeleccion = jest.fn();
   _select = jest.fn().mockReturnValue(observableOf({}));
  select = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockTramite110204Query {
  formDatosCertificado$ = observableOf({});
  selectIdioma$ = {};
  selectEntidadFederativa$ = {};
  selectrepresentacionFederal$ = {};
  selectState$ = observableOf({});
}

@Injectable()
class MockCertificadosOrigenGridService {}

describe('DatosCertificadoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,DatosCertificadoComponent,HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Tramite110204Store, useClass: MockTramite110204Store },
        { provide: Tramite110204Query, useClass: MockTramite110204Query },
        { provide: CertificadosOrigenGridService, useClass: MockCertificadosOrigenGridService },
        ToastrService,
        SeccionLibQuery,
        SeccionLibStore,
                provideToastr({
                  positionClass: 'toast-top-right',
                }),
      ]
    }).overrideComponent(DatosCertificadoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosCertificadoComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #formularioControl', async () => {
    component.formDatosCertificado = component.formDatosCertificado || {};
    component.formDatosCertificado.get = jest.fn();
    const formularioControl = component.formularioControl;
    expect(component.formDatosCertificado.get).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.cargarEntidadFederativa = jest.fn();
    component.formDatosCertificado = component.formDatosCertificado || {};
    component.formDatosCertificado.valueChanges = observableOf({});
    component.store = component.store || {};
    component.store.setFormDatosCertificado = jest.fn();
    component.ngOnInit();
  });


  it('should run #idiomaSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setIdiomaDatos = jest.fn();
    component.idiomaSeleccion({});
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

  it('should call store.setFormDatosCertificado with correct params in setValoresStore()', () => {
    component.store = component.store || {};
    component.store.setFormDatosCertificado = jest.fn();
    const event = {
      formGroupName: 'testGroup',
      campo: 'testField',
      valor: 'testValue',
      storeStateName: 'testState'
    };
    component.setValoresStore(event);
    expect(component.store.setFormDatosCertificado).toHaveBeenCalledWith({ [event.campo]: event.valor });
  });

  it('should handle undefined valor in setValoresStore()', () => {
    component.store = component.store || {};
    component.store.setFormDatosCertificado = jest.fn();
    const event = {
      formGroupName: 'group',
      campo: 'field',
      valor: undefined,
      storeStateName: 'state'
    };
    component.setValoresStore(event);
    expect(component.store.setFormDatosCertificado).toHaveBeenCalledWith({ [event.campo]: undefined });
  });

});