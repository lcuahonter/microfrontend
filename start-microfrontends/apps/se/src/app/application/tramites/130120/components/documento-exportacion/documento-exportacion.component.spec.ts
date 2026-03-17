import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DocumentoExportacionComponent } from './documento-exportacion.component';
import { FormBuilder } from '@angular/forms';
import { PermisoImportacionStore } from '../../estados/permiso-importacion.store';
import { Tramite130120Query } from '../../estados/permiso-importacion.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

@Injectable()
class MockPermisoImportacionStore {}

@Injectable()
class MockTramite130120Query {}

describe('DocumentoExportacionComponent', () => {
  let fixture: ComponentFixture<DocumentoExportacionComponent>;
  let component: { ngOnDestroy: () => void; query: { selectDatos$?: any; }; initActionFormBuild: jest.Mock<any, any, any> | (() => void); consultaQuery: { selectConsultaioState$?: any; }; ngOnInit: () => any; fb: { group?: any; }; datosState: { datosExporta?: any; }; datosExporta: { patchValue?: any; }; store: { setFecha_documento?: any; metodoNombre?: any; }; fechaDocumento: (arg0: {}) => void; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DocumentoExportacionComponent ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: PermisoImportacionStore, useClass: MockPermisoImportacionStore },
        { provide: Tramite130120Query, useClass: MockTramite130120Query },
        ConsultaioQuery
      ]
    }).overrideComponent(DocumentoExportacionComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DocumentoExportacionComponent);
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
    component.query = component.query || {};
    component.query.selectDatos$ = observableOf({});
    component.initActionFormBuild = jest.fn();
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    await component.ngOnInit();
    expect(component.initActionFormBuild).toHaveBeenCalled();
  });

  it('should run #initActionFormBuild()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.datosState = component.datosState || {};
    component.datosState.datosExporta = {
      número_documento: {},
      fecha_documento: {},
      descripcionExportacion: {},
      codigo_arancelario: {},
      cantidad_umt: {},
      valor_usd: {},
      precio_unitario_usd: {}
    };
    component.initActionFormBuild();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #fechaDocumento()', async () => {
    component.datosExporta = component.datosExporta || {};
    component.datosExporta.patchValue = jest.fn();
    component.store = component.store || {};
    component.store.setFecha_documento = jest.fn();
    component.fechaDocumento({});
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});