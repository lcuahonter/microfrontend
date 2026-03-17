import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { Component } from '@angular/core';
import { DatosExportadorComponent } from './datos-exportador.component';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { PermisoImportacionStore } from '../../estados/permiso-importacion.store';
import { Tramite130120Query } from '../../estados/permiso-importacion.query';
import { ConsultaioQuery, ConsultaioState } from '@libs/shared/data-access-user/src';

@Injectable()
class MockPermisoImportacionStore {}

@Injectable()
class MockTramite130120Query {}

describe('DatosExportadorComponent', () => {
  let fixture: ComponentFixture<DatosExportadorComponent>;
  let component: DatosExportadorComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DatosExportadorComponent ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: PermisoImportacionStore, useClass: MockPermisoImportacionStore },
        { provide: Tramite130120Query, useClass: MockTramite130120Query },
        ConsultaioQuery
      ]
    }).overrideComponent(DatosExportadorComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosExportadorComponent);
    component = fixture.debugElement.componentInstance;
    component.ngOnDestroy = function() {};
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.query = component.query || {};
    component.query.selectDatos$ = observableOf({
    datosRealizer: {
      regimen: '',
      classificion_regimen: ''
    },
    datosMercanica: {
      descripcion: '',
      marca: '',
      tipo_entrada: '',
      fraccion: '',
      nico: '',
      umt: '',
      factura_numero: '',
      factura_fecha: '',
      umc: '',
      otro_umc: '',
      cantidad_umc: '',
      factor_conversion: '1',
      cantidad_umt: '0.00',
      valor_factura: '',
      moneda_comercializacion: '',
      valor_factura_usd: '',
      precio_unitario_usd: '',
      pais_exportador: '',
      pais_origen: '',
      valor_total_factura: '',
      valor_total_factura_usd: '',
    },
    datosExporta: {
      número_documento: '',
      fecha_documento: '',
      descripcionExportacion: '',
      codigo_arancelario: '',
      cantidad_umt: '',
      valor_usd: '',
      precio_unitario_usd: '',
    },
    datosProductor: {
      persona_tipo: 'Física',
      personales_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      denominación_razón_social: '',
      domicilio: '',
    },
    datosExportador: {
      persona_tipo: 'Física',
      personales_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      razón_social: '',
      denominación_razón_social_exportador: '',
      domicilio: '',

      observaciones: '',
    },
    datosFederal: {
      entidad_federativa: '',
      representacion_federal: '',
    }
  });
    component.initActionFormBuild = jest.fn();
    component.consultaquery = component.consultaquery || {};
    component.consultaquery.selectConsultaioState$ = observableOf({
      procedureId: '',
      parameter: '',
      department: '',
      folioTramite: '',
      someField1: '',
      someField2: '',
      someField3: '',
      someField4: '',
      someField5: '',
      someField6: '',
      tipoDeTramite: '',
      estadoDeTramite: '',
      readonly: false,
      create: false,
      update: false, 
      consultaioSolicitante: {
        folioDelTramite: '',
        fechaDeInicio: '',
        estadoDelTramite: ''
      },
      action_id: '',
      current_user: '',
      id_solicitud: '',
      nombre_pagina: ''
    }) as Observable<ConsultaioState>;
    await component.ngOnInit();
  });

  it('should run #initActionFormBuild()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.datosState = component.datosState || {};
    component.datosState.datosExportador = {
      persona_tipo: '',
      personales_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      razón_social: '',
      denominación_razón_social_exportador: '',
      domicilio: '',
      observaciones: ''
    };
    component.initActionFormBuild();
  });

  it('should run #onTipoPersonaExportadorChange()', async () => {
  component.datosExportador = component.fb.group({
    persona_tipo: [''],
    personales_nombre: [''],
    primer_apellido: [''],
    segundo_apellido: [''],
    denominación_razón_social: [''],
    domicilio: [''],
    observaciones: ['']
  });

  component.store = component.store || {};
  component.store.setExportadorPersona_tipo = jest.fn();
  component.store.setExportadorDenominación_razón_social = jest.fn();
  component.store.setExportadorPersonales_nombre = jest.fn();
  component.store.setExportadorPrimer_apellido = jest.fn();
  component.store.setExportadorSegundo_apellido = jest.fn();

 component.onTipoPersonaExportadorChange('Física');
});

});