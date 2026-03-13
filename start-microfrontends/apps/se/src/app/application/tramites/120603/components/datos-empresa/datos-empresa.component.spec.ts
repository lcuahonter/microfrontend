import {ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosEmpresaComponent } from './datos-empresa.component';
import { FormBuilder } from '@angular/forms';
import { RegistroComoEmpresaService } from '../../services/registro-como-empresa.service';
import { Solicitud120603Store } from '../../estados/tramite120603.store';
import { Solicitud120603Query } from '../../estados/tramite120603.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockRegistroComoEmpresaService {}

@Injectable()
class MockSolicitud120603Store {}

@Injectable()
class MockSolicitud120603Query {}

describe('DatosEmpresaComponent', () => {
  let fixture: ComponentFixture<DatosEmpresaComponent>;
  let component: {
    nuevaNotificacion: null;
    esFormularioVisible(esFormularioVisible: any): unknown;
    esFormularioSoloLectura: boolean; ngOnDestroy: () => void; formularioEmpresa: { get?: any; patchValue?: any; disable?: any; enable?: any; }; selectedNacionalidad: any; selectedTipoPersona: any; solicitud120603Query: { selectSolicitud$?: any; }; createForm: jest.Mock<any, any, any> | (() => void); getEstadoData: jest.Mock<any, any, any> | (() => void); getRepresentacionFederalData: jest.Mock<any, any, any> | (() => void); getTipoDeEmpresaData: jest.Mock<any, any, any> | (() => void); subscribeToTipoEmpresaChanges: jest.Mock<any, any, any> | (() => void); subscribeToActividadEconomicaChanges: jest.Mock<any, any, any> | (() => void); getSociosYAaccionistasData: jest.Mock<any, any, any> | (() => void); getSociosYAccionistasExtranjerosData: jest.Mock<any, any, any> | (() => void); getPaisData: jest.Mock<any, any, any> | (() => void); subscribeToEstadoDataChanges: jest.Mock<any, any, any> | (() => void); registroComoEmpresa: { getRepresentacionFederalData?: any; getEstadoData?: any; getTipoDeEmpresaData?: any; getSociosYAaccionistasData?: any; getSociosYAccionistasExtranjerosData?: any; getPaisData?: any; }; consultaioQuery: { selectConsultaioState$?: any; }; inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; fb: { group?: any; }; formularioEmpresaState: { estado?: any; representacionFederal?: any; tipoEmpresa?: any; especifique?: any; actividadEconomicaPreponderante?: any; descripcion?: any; pais?: any; codigoPostal?: any; estadoDomicilio?: any; municipioAlcaldia?: any; localidad?: any; colonia?: any; calle?: any; numeroExterior?: any; numeroInterior?: any; lada?: any; telefono?: any; nacionalidad?: any; registroFederal?: any; tipoDePersona?: any; nombre?: any; apellidoPaterno?: any; apellidoMaterno?: any; taxId?: any; razonSocial?: any; datosPais?: any; datosCodigoPostal?: any; datosEstado?: any; correoElectronico?: any; }; abrirModal: jest.Mock<any, any, any> | (() => void); pedimentos: { splice?: any; }; eliminarPedimento: (arg0: {}) => void; checkRFCValidation: () => void; setSelectedNacionalidad: (arg0: {}) => void; setSelectedTipoDePersona: (arg0: {}) => void; estadoData: { catalogos?: any; }; representacionFederalData: { catalogos?: any; }; tipoEmpresaData: { catalogos?: any; }; paisData: { catalogos?: any; }; datosTablaExtranjeros: string[]; onAgregar: () => void; onSelectedRowsChange: (arg0: { id: {}; }[]) => void; selectedRows: { size?: any; has?: any; clear?: any; }; datosGenerales: string[]; onDelete: () => void; onEliminar: () => void; solicitud120603Store: { metodoNombre?: any; }; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; destroyed$: { next?: any; complete?: any; }; 
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,DatosEmpresaComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: RegistroComoEmpresaService, useClass: MockRegistroComoEmpresaService },
        { provide: Solicitud120603Store, useClass: MockSolicitud120603Store },
        { provide: Solicitud120603Query, useClass: MockSolicitud120603Query },
        ConsultaioQuery
      ]
    }).overrideComponent(DatosEmpresaComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosEmpresaComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #selectedNacionalidad', async () => {
    component.formularioEmpresa = component.formularioEmpresa || {};
    component.formularioEmpresa.get = jest.fn().mockReturnValue({
      value: {}
    });
    const selectedNacionalidad = component.selectedNacionalidad;
     expect(component.formularioEmpresa.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #selectedTipoPersona', async () => {
    component.formularioEmpresa = component.formularioEmpresa || {};
    component.formularioEmpresa.get = jest.fn().mockReturnValue({
      value: {}
    });
    const selectedTipoPersona = component.selectedTipoPersona;
     expect(component.formularioEmpresa.get).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.solicitud120603Query = component.solicitud120603Query || {};
    component.solicitud120603Query.selectSolicitud$ = observableOf({});
    component.createForm = jest.fn();
    component.getEstadoData = jest.fn();
    component.getRepresentacionFederalData = jest.fn();
    component.getTipoDeEmpresaData = jest.fn();
    component.subscribeToTipoEmpresaChanges = jest.fn();
    component.subscribeToActividadEconomicaChanges = jest.fn();
    component.getSociosYAaccionistasData = jest.fn();
    component.getSociosYAccionistasExtranjerosData = jest.fn();
    component.getPaisData = jest.fn();
    component.subscribeToEstadoDataChanges = jest.fn();
    component.registroComoEmpresa = component.registroComoEmpresa || {};
    component.registroComoEmpresa.getRepresentacionFederalData = jest.fn().mockReturnValue(observableOf({}));
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
     expect(component.createForm).toHaveBeenCalled();
     expect(component.getEstadoData).toHaveBeenCalled();
     expect(component.getRepresentacionFederalData).toHaveBeenCalled();
     expect(component.getTipoDeEmpresaData).toHaveBeenCalled();
     expect(component.subscribeToTipoEmpresaChanges).toHaveBeenCalled();
     expect(component.subscribeToActividadEconomicaChanges).toHaveBeenCalled();
     expect(component.getSociosYAaccionistasData).toHaveBeenCalled();
     expect(component.getSociosYAccionistasExtranjerosData).toHaveBeenCalled();
     expect(component.getPaisData).toHaveBeenCalled();
     expect(component.subscribeToEstadoDataChanges).toHaveBeenCalled();
     expect(component.registroComoEmpresa.getRepresentacionFederalData).toHaveBeenCalled();
     expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #subscribeToTipoEmpresaChanges()', async () => {
    component.formularioEmpresa = component.formularioEmpresa || {};
    component.formularioEmpresa.get = jest.fn().mockReturnValue({
      disable: function() {},
      enable: function() {},
      valueChanges: observableOf({})
    });
    component.subscribeToTipoEmpresaChanges();
     expect(component.formularioEmpresa.get).toHaveBeenCalled();
  });

  it('should run #subscribeToActividadEconomicaChanges()', async () => {
    component.formularioEmpresa = component.formularioEmpresa || {};
    component.formularioEmpresa.get = jest.fn().mockReturnValue({
      setValue: function() {},
      valueChanges: observableOf({})
    });
    component.subscribeToActividadEconomicaChanges();
     expect(component.formularioEmpresa.get).toHaveBeenCalled();
  });

  it('should run #createForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.formularioEmpresaState = component.formularioEmpresaState || {};
    component.formularioEmpresaState.estado = 'estado';
    component.formularioEmpresaState.representacionFederal = 'representacionFederal';
    component.formularioEmpresaState.tipoEmpresa = 'tipoEmpresa';
    component.formularioEmpresaState.especifique = 'especifique';
    component.formularioEmpresaState.actividadEconomicaPreponderante = 'actividadEconomicaPreponderante';
    component.formularioEmpresaState.descripcion = 'descripcion';
    component.formularioEmpresaState.pais = 'pais';
    component.formularioEmpresaState.codigoPostal = 'codigoPostal';
    component.formularioEmpresaState.estadoDomicilio = 'estadoDomicilio';
    component.formularioEmpresaState.municipioAlcaldia = 'municipioAlcaldia';
    component.formularioEmpresaState.localidad = 'localidad';
    component.formularioEmpresaState.colonia = 'colonia';
    component.formularioEmpresaState.calle = 'calle';
    component.formularioEmpresaState.numeroExterior = 'numeroExterior';
    component.formularioEmpresaState.numeroInterior = 'numeroInterior';
    component.formularioEmpresaState.lada = 'lada';
    component.formularioEmpresaState.telefono = 'telefono';
    component.formularioEmpresaState.nacionalidad = 'nacionalidad';
    component.formularioEmpresaState.registroFederal = 'registroFederal';
    component.formularioEmpresaState.tipoDePersona = 'tipoDePersona';
    component.formularioEmpresaState.nombre = 'nombre';
    component.formularioEmpresaState.apellidoPaterno = 'apellidoPaterno';
    component.formularioEmpresaState.apellidoMaterno = 'apellidoMaterno';
    component.formularioEmpresaState.taxId = 'taxId';
    component.formularioEmpresaState.razonSocial = 'razonSocial';
    component.formularioEmpresaState.datosPais = 'datosPais';
    component.formularioEmpresaState.datosCodigoPostal = 'datosCodigoPostal';
    component.formularioEmpresaState.datosEstado = 'datosEstado';
    component.formularioEmpresaState.correoElectronico = 'correoElectronico';
    component.createForm();
     expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #abrirModal()', async () => {

    component.abrirModal();

  });

  it('should run #eliminarPedimento()', async () => {
    component.pedimentos = component.pedimentos || {};
    component.pedimentos.splice = jest.fn();
    component.eliminarPedimento({});
     expect(component.pedimentos.splice).toHaveBeenCalled();
  });
  it('should run #checkRFCValidation()', async () => {
    component.formularioEmpresa = {
      get: jest.fn().mockReturnValue({
        invalid: true, 
        errors: { minlength: true },
      }),
    } as unknown as FormGroup;
  
    component.nuevaNotificacion = null;
  
    component.abrirModal = jest.fn();
  
    component.checkRFCValidation();
  
    expect(component.formularioEmpresa.get).toHaveBeenCalledWith('registroFederal'); // Ensure the correct field is accessed
    expect(component.abrirModal).toHaveBeenCalledWith(0, 'El RFC debe tener al menos 13 caracteres de longitud.'); // Ensure abrirModal is called with the correct arguments
  });
  
  it('should run #setSelectedNacionalidad()', async () => {
    component.formularioEmpresa = component.formularioEmpresa || {};
    component.formularioEmpresa.get = jest.fn().mockReturnValue({
      setValue: function() {}
    });
    component.setSelectedNacionalidad({});
     expect(component.formularioEmpresa.get).toHaveBeenCalled();
  });

  it('should run #setSelectedTipoDePersona()', async () => {
    component.formularioEmpresa = component.formularioEmpresa || {};
    component.formularioEmpresa.get = jest.fn().mockReturnValue({
      setValue: function() {}
    });
    component.setSelectedTipoDePersona({});
     expect(component.formularioEmpresa.get).toHaveBeenCalled();
  });

  it('should run #getEstadoData()', async () => {
    component.registroComoEmpresa = component.registroComoEmpresa || {};
    component.registroComoEmpresa.getEstadoData = jest.fn().mockReturnValue(observableOf({}));
    component.estadoData = component.estadoData || {};
    component.estadoData.catalogos = 'catalogos';
    component.getEstadoData();
     expect(component.registroComoEmpresa.getEstadoData).toHaveBeenCalled();
  });

  it('should run #getRepresentacionFederalData()', async () => {
    component.registroComoEmpresa = component.registroComoEmpresa || {};
    component.registroComoEmpresa.getRepresentacionFederalData = jest.fn().mockReturnValue(observableOf({}));
    component.representacionFederalData = component.representacionFederalData || {};
    component.representacionFederalData.catalogos = 'catalogos';
    component.getRepresentacionFederalData();
     expect(component.registroComoEmpresa.getRepresentacionFederalData).toHaveBeenCalled();
  });

  it('should run #getTipoDeEmpresaData()', async () => {
    component.registroComoEmpresa = component.registroComoEmpresa || {};
    component.registroComoEmpresa.getTipoDeEmpresaData = jest.fn().mockReturnValue(observableOf({}));
    component.tipoEmpresaData = component.tipoEmpresaData || {};
    component.tipoEmpresaData.catalogos = 'catalogos';
    component.getTipoDeEmpresaData();
     expect(component.registroComoEmpresa.getTipoDeEmpresaData).toHaveBeenCalled();
  });

  it('should run #getSociosYAaccionistasData()', async () => {
    component.registroComoEmpresa = component.registroComoEmpresa || {};
    component.registroComoEmpresa.getSociosYAaccionistasData = jest.fn().mockReturnValue(observableOf({}));
    component.getSociosYAaccionistasData();
     expect(component.registroComoEmpresa.getSociosYAaccionistasData).toHaveBeenCalled();
  });

  it('should run #getSociosYAccionistasExtranjerosData()', async () => {
    component.registroComoEmpresa = component.registroComoEmpresa || {};
    component.registroComoEmpresa.getSociosYAccionistasExtranjerosData = jest.fn().mockReturnValue(observableOf({}));
    component.getSociosYAccionistasExtranjerosData();
     expect(component.registroComoEmpresa.getSociosYAccionistasExtranjerosData).toHaveBeenCalled();
  });

  it('should run #getPaisData()', async () => {
    component.registroComoEmpresa = component.registroComoEmpresa || {};
    component.registroComoEmpresa.getPaisData = jest.fn().mockReturnValue(observableOf({}));
    component.paisData = component.paisData || {};
    component.paisData.catalogos = 'catalogos';
    component.getPaisData();
     expect(component.registroComoEmpresa.getPaisData).toHaveBeenCalled();
  });

  it('should run #onAgregar()', async () => {
    component.formularioEmpresa = component.formularioEmpresa || {};
    component.formularioEmpresa.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.formularioEmpresa.patchValue = jest.fn();
    component.paisData = component.paisData || {};
    component.paisData.catalogos = {
      find: function() {
        return [
          {
            "id": {}
          }
        ];
      }
    };
    component.datosTablaExtranjeros = component.datosTablaExtranjeros || {};
    component.datosTablaExtranjeros.push = jest.fn();
    component.onAgregar();
     expect(component.formularioEmpresa.get).toHaveBeenCalled();
     expect(component.formularioEmpresa.patchValue).toHaveBeenCalled();
     expect(component.datosTablaExtranjeros.push).toHaveBeenCalled();
  });

  it('should run #subscribeToEstadoDataChanges()', async () => {
    component.formularioEmpresa = component.formularioEmpresa || {};
    component.formularioEmpresa.get = jest.fn().mockReturnValue({
      setValue: function() {},
      valueChanges: observableOf({})
    });
    component.representacionFederalData = component.representacionFederalData || {};
    component.representacionFederalData.catalogos = {
      find: function() {
        return [
          {
            "id": {}
          }
        ];
      }
    };
    component.abrirModal = jest.fn();
    component.subscribeToEstadoDataChanges();
     expect(component.formularioEmpresa.get).toHaveBeenCalled();
     expect(component.abrirModal).toHaveBeenCalled();
  });

  it('should run #onSelectedRowsChange()', async () => {

    component.onSelectedRowsChange([{
      id: {}
    }]);

  });
  
 
  it('should run #inicializarEstadoFormulario()', async () => {
    component.formularioEmpresa = {
      disable: jest.fn(),
      enable: jest.fn(),
    };
  
    component.esFormularioSoloLectura = true;
  
    component.inicializarEstadoFormulario();
  
    expect(component.formularioEmpresa.disable).toHaveBeenCalled();
    expect(component.formularioEmpresa.enable).not.toHaveBeenCalled();
  
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
  
    expect(component.formularioEmpresa.enable).toHaveBeenCalled();
  });
   it('should run #setValoresStore()', async () => {

     component.solicitud120603Store = {
       metodoNombre: jest.fn(), 
     };
   
     const mockForm = {
       get: jest.fn().mockReturnValue({ value: 'mockValue' }), 
     } as unknown as FormGroup;
   
     component.setValoresStore(
       { get: () => ({ value: mockForm.get('campo')?.value }) },
       'campo',
       'metodoNombre' as keyof typeof component.solicitud120603Store
     );
   
     expect(mockForm.get).toHaveBeenCalledWith('campo'); 
     expect(component.solicitud120603Store.metodoNombre).toHaveBeenCalledWith('mockValue'); 
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