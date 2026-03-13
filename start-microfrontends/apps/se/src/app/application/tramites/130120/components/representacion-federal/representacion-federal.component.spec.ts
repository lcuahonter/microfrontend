import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { RepresentacionFederalComponent } from './representacion-federal.component';
import { FormBuilder } from '@angular/forms';
import { PermisoImportacionStore } from '../../estados/permiso-importacion.store';
import { Tramite130120Query } from '../../estados/permiso-importacion.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { PermisoImportacionService } from '../../services/permiso-importacion.service';

@Injectable()
class MockPermisoImportacionStore {}

@Injectable()
class MockTramite130120Query {}

@Injectable()
class MockPermisoImportacionService {}

describe('RepresentacionFederalComponent', () => {
  let fixture: ComponentFixture<RepresentacionFederalComponent>;
  let component: { ngOnDestroy: () => void; query: { selectDatos$?: any; }; initActionFormBuild: jest.Mock<any, any, any> | (() => void); obtenerEntidadSelectList: jest.Mock<any, any, any> | (() => void); obtenerRepresentacionSelectList: jest.Mock<any, any, any> | (() => void); consultaQuery: { selectConsultaioState$?: any; }; ngOnInit: () => any; fb: { group?: any; }; datosState: { datosFederal?: any; }; permisoImportacionService: { obtenerMenuDesplegable?: any; }; store: { metodoNombre?: any; }; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,RepresentacionFederalComponent ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: PermisoImportacionStore, useClass: MockPermisoImportacionStore },
        { provide: Tramite130120Query, useClass: MockTramite130120Query },
        ConsultaioQuery,
        { provide: PermisoImportacionService, useClass: MockPermisoImportacionService }
      ]
    }).overrideComponent(RepresentacionFederalComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(RepresentacionFederalComponent);
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
    component.obtenerEntidadSelectList = jest.fn();
    component.obtenerRepresentacionSelectList = jest.fn();
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    await component.ngOnInit();
    expect(component.initActionFormBuild).toHaveBeenCalled();
  });

  it('should run #initActionFormBuild()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.datosState = component.datosState || {};
    component.datosState.datosFederal = {
      entidad_federativa: {},
      representacion_federal: {}
    };
    component.initActionFormBuild();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #obtenerEntidadSelectList()', async () => {
    component.permisoImportacionService = component.permisoImportacionService || {};
    component.permisoImportacionService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.obtenerEntidadSelectList();
    expect(component.permisoImportacionService.obtenerMenuDesplegable).toHaveBeenCalled();
  });

  it('should run #obtenerRepresentacionSelectList()', async () => {
    component.permisoImportacionService = component.permisoImportacionService || {};
    component.permisoImportacionService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.obtenerRepresentacionSelectList();
    expect(component.permisoImportacionService.obtenerMenuDesplegable).toHaveBeenCalled();
  });

});