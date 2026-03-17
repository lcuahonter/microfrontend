
import {  ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import{DatosTramiteComponent} from './datosTramite.component'
import { RegistrarSolicitudService } from '../services/registrar-solicitud.service';
import { FormBuilder } from '@angular/forms';
import { Solicitud290201Store } from '../../../estados/tramites/tramites290201.store';
import { Solicitud290201Query } from '../../../estados/queries/tramites290201.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
@Injectable()
class MockRegistrarSolicitudService {
  getEnvasadoenData = jest.fn().mockReturnValue(observableOf([]));
  getUtilicoCafeComoData = jest.fn().mockReturnValue(observableOf([]));
  getPaisDeImportacionData = jest.fn().mockReturnValue(observableOf([]));
  getFraccionArancelariaData = jest.fn().mockReturnValue(observableOf([]));
  getUnidadDeMedidaData = jest.fn().mockReturnValue(observableOf([]));
  getDollarData = jest.fn().mockReturnValue(observableOf([]));
  getMediaDeTransporte = jest.fn().mockReturnValue(observableOf([]));
  metodoNombre = jest.fn();
}
@Injectable()
class MockSolicitud290201Store {}

@Injectable()
class MockSolicitud290201Query {}


describe('DatosTramiteComponent', () => {
  let fixture: ComponentFixture<DatosTramiteComponent>;
  let component: {
    esFormularioSoloLectura: boolean; ngOnDestroy: () => void; informationCafeForm: { get?: any; disable?: any; enable?: any; }; datosDelTramiteRealizar: any; fb: { group?: any; }; informationCafeState: { formasdelcafe?: any; tipos?: any; calidad?: any; procesos?: any; certifications?: any; adunadesalida?: any; paisdestino?: any; entidaddeprocedencia?: any; ciclocafetalero?: any; }; createForm: jest.Mock<any, any, any> | (() => void); solicitud290201Query: { selectSolicitud$?: any; }; getTiposData: jest.Mock<any, any, any> | (() => void); getFormasdelcafeData: jest.Mock<any, any, any> | (() => void); getCalidadData: jest.Mock<any, any, any> | (() => void); getProcesosData: jest.Mock<any, any, any> | (() => void); getAduanadesalidaData: jest.Mock<any, any, any> | (() => void); getEntidadDeProcedenciaData: jest.Mock<any, any, any> | (() => void); getCiclocafetaleroData: jest.Mock<any, any, any> | (() => void); getPaisDestinoData: jest.Mock<any, any, any> | (() => void); getCertificacionData: jest.Mock<any, any, any> | (() => void); consultaioQuery: { selectConsultaioState$?: any; }; inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; registrarsolicitud: { getTiposData?: any; getFormasdelcafeData?: any; getCalidadData?: any; getProcesosData?: any; getAduanadesalidaData?: any; getEntidadDeProcedenciaData?: any; getCiclocafetaleroData?: any; getPaisDestinoData?: any; getCertificacionData?: any; }; tiposData: { catalogos?: any; }; formasdelcafeData: { catalogos?: any; }; calidadData: { catalogos?: any; }; procesosData: { catalogos?: any; }; adunadesalidaData: { catalogos?: any; }; entidaddeprocedenciaData: { catalogos?: any; }; ciclocafetaleroData: { catalogos?: any; }; paisdestinoData: { catalogos?: any; }; certificacionsData: { catalogos?: any; }; solicitud290201Store: { metodoNombre?: any; }; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; destroyed$: { next?: any; complete?: any; }; 
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,DatosTramiteComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: RegistrarSolicitudService, useClass: MockRegistrarSolicitudService },
        FormBuilder,
        { provide: Solicitud290201Store, useClass: MockSolicitud290201Store },
        { provide: Solicitud290201Query, useClass: MockSolicitud290201Query },
        ConsultaioQuery
      ]
    }).overrideComponent(DatosTramiteComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosTramiteComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #datosDelTramiteRealizar', async () => {
    component.informationCafeForm = component.informationCafeForm || {};
    component.informationCafeForm.get = jest.fn();
    const datosDelTramiteRealizar = component.datosDelTramiteRealizar;
     expect(component.informationCafeForm.get).toHaveBeenCalled();
  });

  it('should run #createForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.informationCafeState = component.informationCafeState || {};
    component.informationCafeState.formasdelcafe = 'formasdelcafe';
    component.informationCafeState.tipos = 'tipos';
    component.informationCafeState.calidad = 'calidad';
    component.informationCafeState.procesos = 'procesos';
    component.informationCafeState.certifications = 'certifications';
    component.informationCafeState.adunadesalida = 'adunadesalida';
    component.informationCafeState.paisdestino = 'paisdestino';
    component.informationCafeState.entidaddeprocedencia = 'entidaddeprocedencia';
    component.informationCafeState.ciclocafetalero = 'ciclocafetalero';
    component.createForm();
     expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.solicitud290201Query = component.solicitud290201Query || {};
    component.solicitud290201Query.selectSolicitud$ = observableOf({});
    component.createForm = jest.fn();
    component.getTiposData = jest.fn();
    component.getFormasdelcafeData = jest.fn();
    component.getCalidadData = jest.fn();
    component.getProcesosData = jest.fn();
    component.getAduanadesalidaData = jest.fn();
    component.getEntidadDeProcedenciaData = jest.fn();
    component.getCiclocafetaleroData = jest.fn();
    component.getPaisDestinoData = jest.fn();
    component.getCertificacionData = jest.fn();
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
     expect(component.createForm).toHaveBeenCalled();
     expect(component.getTiposData).toHaveBeenCalled();
     expect(component.getFormasdelcafeData).toHaveBeenCalled();
     expect(component.getCalidadData).toHaveBeenCalled();
     expect(component.getProcesosData).toHaveBeenCalled();
     expect(component.getAduanadesalidaData).toHaveBeenCalled();
     expect(component.getEntidadDeProcedenciaData).toHaveBeenCalled();
     expect(component.getCiclocafetaleroData).toHaveBeenCalled();
     expect(component.getPaisDestinoData).toHaveBeenCalled();
     expect(component.getCertificacionData).toHaveBeenCalled();
     expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #getTiposData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getTiposData = jest.fn().mockReturnValue(observableOf({}));
    component.tiposData = component.tiposData || {};
    component.tiposData.catalogos = 'catalogos';
    component.getTiposData();
     expect(component.registrarsolicitud.getTiposData).toHaveBeenCalled();
  });

  it('should run #getFormasdelcafeData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getFormasdelcafeData = jest.fn().mockReturnValue(observableOf({}));
    component.formasdelcafeData = component.formasdelcafeData || {};
    component.formasdelcafeData.catalogos = 'catalogos';
    component.getFormasdelcafeData();
     expect(component.registrarsolicitud.getFormasdelcafeData).toHaveBeenCalled();
  });

  it('should run #getCalidadData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getCalidadData = jest.fn().mockReturnValue(observableOf({}));
    component.calidadData = component.calidadData || {};
    component.calidadData.catalogos = 'catalogos';
    component.getCalidadData();
     expect(component.registrarsolicitud.getCalidadData).toHaveBeenCalled();
  });

  it('should run #getProcesosData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getProcesosData = jest.fn().mockReturnValue(observableOf({}));
    component.procesosData = component.procesosData || {};
    component.procesosData.catalogos = 'catalogos';
    component.getProcesosData();
     expect(component.registrarsolicitud.getProcesosData).toHaveBeenCalled();
  });

  it('should run #getAduanadesalidaData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getAduanadesalidaData = jest.fn().mockReturnValue(observableOf({}));
    component.adunadesalidaData = component.adunadesalidaData || {};
    component.adunadesalidaData.catalogos = 'catalogos';
    component.getAduanadesalidaData();
     expect(component.registrarsolicitud.getAduanadesalidaData).toHaveBeenCalled();
  });

  it('should run #getEntidadDeProcedenciaData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getEntidadDeProcedenciaData = jest.fn().mockReturnValue(observableOf({}));
    component.entidaddeprocedenciaData = component.entidaddeprocedenciaData || {};
    component.entidaddeprocedenciaData.catalogos = 'catalogos';
    component.getEntidadDeProcedenciaData();
     expect(component.registrarsolicitud.getEntidadDeProcedenciaData).toHaveBeenCalled();
  });

  it('should run #getCiclocafetaleroData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getCiclocafetaleroData = jest.fn().mockReturnValue(observableOf({}));
    component.ciclocafetaleroData = component.ciclocafetaleroData || {};
    component.ciclocafetaleroData.catalogos = 'catalogos';
    component.getCiclocafetaleroData();
     expect(component.registrarsolicitud.getCiclocafetaleroData).toHaveBeenCalled();
  });

  it('should run #getPaisDestinoData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getPaisDestinoData = jest.fn().mockReturnValue(observableOf({}));
    component.paisdestinoData = component.paisdestinoData || {};
    component.paisdestinoData.catalogos = 'catalogos';
    component.getPaisDestinoData();
     expect(component.registrarsolicitud.getPaisDestinoData).toHaveBeenCalled();
  });

  it('should run #getCertificacionData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getCertificacionData = jest.fn().mockReturnValue(observableOf({}));
    component.certificacionsData = component.certificacionsData || {};
    component.certificacionsData.catalogos = 'catalogos';
    component.getCertificacionData();
     expect(component.registrarsolicitud.getCertificacionData).toHaveBeenCalled();
  });

 
  it('should run #inicializarEstadoFormulario()', async () => {
    component.informationCafeForm = {
      disable: jest.fn(),
      enable: jest.fn(),
    };
  
    component.esFormularioSoloLectura = true;
  
    component.inicializarEstadoFormulario();
  
    expect(component.informationCafeForm.disable).toHaveBeenCalled();
    expect(component.informationCafeForm.enable).not.toHaveBeenCalled();
  
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
  
    expect(component.informationCafeForm.enable).toHaveBeenCalled();
  });


  it('should run #setValoresStore()', async () => {
  
    component.solicitud290201Store = {
      metodoNombre: jest.fn(), 
    };
  
    const mockForm = {
      get: jest.fn().mockReturnValue({ value: 'mockValue' }), 
    } as unknown as FormGroup;
  
    component.setValoresStore(
      { get: () => ({ value: mockForm.get('campo')?.value }) },
      'campo',
      'metodoNombre' as keyof typeof component.solicitud290201Store
    );
  
  
    expect(mockForm.get).toHaveBeenCalledWith('campo'); 
    expect(component.solicitud290201Store.metodoNombre).toHaveBeenCalledWith('mockValue'); 
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