
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitudComponent } from './solicitud.component';
import { CorreccionInternaDeLaCofeprisService } from '../../services/correccion-interna-de-la-cofepris.service';
import { Solicitud261601Store } from '../../estados/tramites261601.store';
import { Solicitud261601Query } from '../../estados/tramites261601.query';
import { FormBuilder } from '@angular/forms';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

@Injectable()
class MockCorreccionInternaDeLaCofeprisService {}

@Injectable()
class MockSolicitud261601Store {}

@Injectable()
class MockSolicitud261601Query {}

describe('SolicitudComponent', () => {
  let fixture: ComponentFixture<SolicitudComponent>;
  let component: { ngOnDestroy: () => void; solicitud261601Query: { selectSolicitud$?: any; }; createForm: jest.Mock<any, any, any> | (() => void); loadFolioDelTramite: jest.Mock<any, any, any> | (() => void); consultaioQuery: { selectConsultaioState$?: any; }; inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; fb: { group?: any; }; solicitudState: { detalledelaSolicitud?: any; cumplocon?: any; rfc?: any; legalRazonSocial?: any; apellidoPaterno?: any; apellidoMaterno?: any; }; correccionService: { getTramitesAsociados?: any; getSolicitudData?: any; }; solicitudForm: { patchValue?: any; get?: any; disable?: any; enable?: any; }; getSolicitudData: () => void; solicitud261601Store: { metodoNombre?: any; }; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; destroyed$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,SolicitudComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: CorreccionInternaDeLaCofeprisService, useClass: MockCorreccionInternaDeLaCofeprisService },
        { provide: Solicitud261601Store, useClass: MockSolicitud261601Store },
        { provide: Solicitud261601Query, useClass: MockSolicitud261601Query },
        FormBuilder,
        ConsultaioQuery
      ]
    }).overrideComponent(SolicitudComponent, {

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

  it('should run #ngOnInit()', async () => {
    component.solicitud261601Query = component.solicitud261601Query || {};
    component.solicitud261601Query.selectSolicitud$ = observableOf({});
    component.createForm = jest.fn();
    component.loadFolioDelTramite = jest.fn();
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
     expect(component.createForm).toHaveBeenCalled();
     expect(component.loadFolioDelTramite).toHaveBeenCalled();
     expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #createForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.solicitudState = component.solicitudState || {};
    component.solicitudState.detalledelaSolicitud = 'detalledelaSolicitud';
    component.solicitudState.cumplocon = 'cumplocon';
    component.solicitudState.rfc = 'rfc';
    component.solicitudState.legalRazonSocial = 'legalRazonSocial';
    component.solicitudState.apellidoPaterno = 'apellidoPaterno';
    component.solicitudState.apellidoMaterno = 'apellidoMaterno';
    component.createForm();
     expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #loadFolioDelTramite()', async () => {
    component.correccionService = component.correccionService || {};
    component.correccionService.getTramitesAsociados = jest.fn().mockReturnValue(observableOf({
      length: {}
    }));
    component.loadFolioDelTramite();
     expect(component.correccionService.getTramitesAsociados).toHaveBeenCalled();
  });

  it('should run #getSolicitudData()', async () => {
    component.correccionService = {
      getSolicitudData: jest.fn().mockReturnValue(
        observableOf([
          {
            legalRazonSocial: 'Test Razon Social',
            apellidoPaterno: 'Test Paterno',
            apellidoMaterno: 'Test Materno',
          },
        ])
      ),
    };
  
    component.solicitudForm = {
      patchValue: jest.fn(),
      get: jest.fn().mockReturnValue({
        disable: jest.fn(),
      }),
    };
  
    component.getSolicitudData();
  
    expect(component.correccionService.getSolicitudData).toHaveBeenCalled();
  
    expect(component.solicitudForm.patchValue).toHaveBeenCalledWith({
      legalRazonSocial: 'Test Razon Social',
      apellidoPaterno: 'Test Paterno',
      apellidoMaterno: 'Test Materno',
    });
  
    expect(component.solicitudForm.get).toHaveBeenCalledWith('legalRazonSocial');
    expect(component.solicitudForm.get('legalRazonSocial')?.disable).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyed$ = component.destroyed$ || {};
    component.destroyed$.next = jest.fn();
    component.destroyed$.complete = jest.fn();
    component.ngOnDestroy();
     expect(component.destroyed$.next).toHaveBeenCalled();
     expect(component.destroyed$.complete).toHaveBeenCalled();
  });

});