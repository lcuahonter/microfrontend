import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TramiteRealizerComponent } from './tramite_realizer.component';
import { FormBuilder } from '@angular/forms';
import { PermisoImportacionStore } from '../../estados/permiso-importacion.store';
import { Tramite130120Query } from '../../estados/permiso-importacion.query';
import { SeccionLibStore, CatalogosService, ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { PermisoImportacionService } from '../../services/permiso-importacion.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockPermisoImportacionStore {}

@Injectable()
class MockTramite130120Query {}

@Injectable()
class MockPermisoImportacionService {}

describe('TramiteRealizerComponent', () => {
  let fixture: ComponentFixture<TramiteRealizerComponent>;
  let component: TramiteRealizerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, TramiteRealizerComponent, HttpClientTestingModule ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: PermisoImportacionStore, useClass: MockPermisoImportacionStore },
        { provide: Tramite130120Query, useClass: MockTramite130120Query },
        SeccionLibStore,
        CatalogosService,
        { provide: PermisoImportacionService, useClass: MockPermisoImportacionService },
        ConsultaioQuery
      ]
    }).overrideComponent(TramiteRealizerComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TramiteRealizerComponent);
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
    component.obtenerRegimenSelectList = jest.fn();
    component.obtenerClassificionRegimenSelectList = jest.fn();
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({
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
    } as any); 
    component.ngOnInit();
    expect(component.initActionFormBuild).toHaveBeenCalled();
  });

  it('should run #initActionFormBuild()', async () => {
    jest.spyOn(component.fb, 'group').mockImplementation(jest.fn());
    component.realizarState = component.realizarState || {};
    component.realizarState.datosRealizer = {
      regimen: '',
      classificion_regimen: ''
    };
    component.initActionFormBuild();
    expect(component.fb.group).toHaveBeenCalled();
  });
  


  it('should run #obtenerRegimenSelectList()', async () => {
    component.permisoImportacionService = component.permisoImportacionService || {};
    component.permisoImportacionService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.obtenerRegimenSelectList();
    expect(component.permisoImportacionService.obtenerMenuDesplegable).toHaveBeenCalled();
  });

  it('should run #obtenerClassificionRegimenSelectList()', async () => {
    component.permisoImportacionService = component.permisoImportacionService || {};
    component.permisoImportacionService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.obtenerClassificionRegimenSelectList();
    expect(component.permisoImportacionService.obtenerMenuDesplegable).toHaveBeenCalled();
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