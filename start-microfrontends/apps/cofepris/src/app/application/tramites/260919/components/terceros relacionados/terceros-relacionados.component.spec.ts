import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import {TercerosrelacionadosComponent} from './terceros-relacionados.component'
import { ImportarDeRemediosHerbalsService } from '../../services/importar-de-remedios-herbals.service';
import { FormBuilder } from '@angular/forms';
import { Solicitud260919Store } from '../../estados/tramites260919.store';
import { Solicitud260919Query } from '../../estados/tramites260919.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockImportarDeRemediosHerbalsService {
  
}

@Injectable()
class MockSolicitud260919Store {}

@Injectable()
class MockSolicitud260919Query {}

describe('TercerosrelacionadosComponent', () => {
  let fixture: ComponentFixture<TercerosrelacionadosComponent>;
  let component: {
    esFormularioVisible(esFormularioVisible: any): unknown; ngOnDestroy: () => void; agregarDestinatario: { get?: any; disable?: any; enable?: any; }; selectedTipoPersona: any; selectedNacionalidad: any; destinatarioForm: { get?: any; disable?: any; enable?: any; patchValue?: any; reset?: any; value?: any; }; solicitud260919Query: { selectSolicitud$?: any; }; crearFormTransporte: jest.Mock<any, any, any> | (() => void); getFabricanteData: jest.Mock<any, any, any> | (() => void); getDestinatarioData: jest.Mock<any, any, any> | (() => void); getFacturadorData: jest.Mock<any, any, any> | (() => void); getProveedorData: jest.Mock<any, any, any> | (() => void); getPaisData: jest.Mock<any, any, any> | (() => void); consultaioQuery: { selectConsultaioState$?: any; }; inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; fb: { group?: any; }; agregarDestinatarioState: { tipoPersona?: any; nacionalidad?: any; nombre?: any; primerApellido?: any; segundoApellido?: any; denominacion?: any; pais?: any; domicilio?: any; estado?: any; codigopostal?: any; calle?: any; numeroExterior?: any; numeroInterior?: any; lada?: any; telefono?: any; correoElectronico?: any; rfc?: any; curp?: any; }; importarDeRemediosHerbals: { getFabricanteData?: any; getDestinatarioData?: any; getProveedorData?: any; getFacturadorData?: any; getPaisData?: any; }; pedimentos: { splice?: any; }; eliminarMercancias: jest.Mock<any, any, any> | (() => void); abrirModal: jest.Mock<any, any, any> | (() => void); eliminarPedimento: (arg0: {}) => void; selectedRows: { size?: any; has?: any; clear?: any; }; onSelectedRowsChange: (arg0: { id: {}; }[]) => void; onDeleted: () => void; tableData: string[]; openModificarMercancias: () => void; agregarMercancias: () => void; paisData: { catalogos?: any; }; setTipoPersona: (arg0: { toString: () => void; }) => void; setNacionalidad: (arg0: { toString: () => void; }) => void; selectedRow: { id?: any; }; getPaisName: jest.Mock<any, any, any> | ((arg0: {}) => void); fabricanteDatos: string[]; onGuardar: () => void; limpiarFormulario: () => void; cancelarFormulario: () => void; solicitud260919Store: { metodoNombre?: any; }; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; destroyed$: { next?: any; complete?: any; }; 
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,TercerosrelacionadosComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ImportarDeRemediosHerbalsService, useClass: MockImportarDeRemediosHerbalsService },
        FormBuilder,
        { provide: Solicitud260919Store, useClass: MockSolicitud260919Store },
        { provide: Solicitud260919Query, useClass: MockSolicitud260919Query },
        ConsultaioQuery
      ]
    }).overrideComponent(TercerosrelacionadosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TercerosrelacionadosComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #selectedTipoPersona', async () => {
    jest.spyOn(component, 'agregarDestinatario', 'get').mockReturnValue({
      get: jest.fn().mockReturnValue({
        value: 'mockTipoPersona',
      }),
    });
  
    const selectedTipoPersona = component.selectedTipoPersona;
  
    expect(component.agregarDestinatario.get).toHaveBeenCalledWith('tipoPersona'); 
    expect(selectedTipoPersona).toBe('mockTipoPersona');
  });

  it('should run GetterDeclaration #selectedNacionalidad', async () => {
    jest.spyOn(component, 'agregarDestinatario', 'get').mockReturnValue({
      get: jest.fn().mockReturnValue({
        value: 'mockNacionalidad',
      }),
    });
  
    const selectedNacionalidad = component.selectedNacionalidad;
  
    expect(component.agregarDestinatario.get).toHaveBeenCalledWith('nacionalidad'); 
    expect(selectedNacionalidad).toBe('mockNacionalidad');
  });

  it('should run GetterDeclaration #agregarDestinatario', async () => {
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.get = jest.fn();
    const agregarDestinatario = component.agregarDestinatario;
     expect(component.destinatarioForm.get).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.solicitud260919Query = component.solicitud260919Query || {};
    component.solicitud260919Query.selectSolicitud$ = observableOf({});
    component.crearFormTransporte = jest.fn();
    component.getFabricanteData = jest.fn();
    component.getDestinatarioData = jest.fn();
    component.getFacturadorData = jest.fn();
    component.getProveedorData = jest.fn();
    component.getPaisData = jest.fn();
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
     expect(component.crearFormTransporte).toHaveBeenCalled();
     expect(component.getFabricanteData).toHaveBeenCalled();
     expect(component.getDestinatarioData).toHaveBeenCalled();
     expect(component.getFacturadorData).toHaveBeenCalled();
     expect(component.getProveedorData).toHaveBeenCalled();
     expect(component.getPaisData).toHaveBeenCalled();
     expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #crearFormTransporte()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.agregarDestinatarioState = component.agregarDestinatarioState || {};
    component.agregarDestinatarioState.tipoPersona = 'tipoPersona';
    component.agregarDestinatarioState.nacionalidad = 'nacionalidad';
    component.agregarDestinatarioState.nombre = 'nombre';
    component.agregarDestinatarioState.primerApellido = 'primerApellido';
    component.agregarDestinatarioState.segundoApellido = 'segundoApellido';
    component.agregarDestinatarioState.denominacion = 'denominacion';
    component.agregarDestinatarioState.pais = 'pais';
    component.agregarDestinatarioState.domicilio = 'domicilio';
    component.agregarDestinatarioState.estado = 'estado';
    component.agregarDestinatarioState.codigopostal = 'codigopostal';
    component.agregarDestinatarioState.calle = 'calle';
    component.agregarDestinatarioState.numeroExterior = 'numeroExterior';
    component.agregarDestinatarioState.numeroInterior = 'numeroInterior';
    component.agregarDestinatarioState.lada = 'lada';
    component.agregarDestinatarioState.telefono = 'telefono';
    component.agregarDestinatarioState.correoElectronico = 'correoElectronico';
    component.agregarDestinatarioState.rfc = 'rfc';
    component.agregarDestinatarioState.curp = 'curp';
    component.crearFormTransporte();
     expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #getFabricanteData()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getFabricanteData = jest.fn().mockReturnValue(observableOf({}));
    component.getFabricanteData();
     expect(component.importarDeRemediosHerbals.getFabricanteData).toHaveBeenCalled();
  });

  it('should run #getDestinatarioData()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getDestinatarioData = jest.fn().mockReturnValue(observableOf({}));
    component.getDestinatarioData();
     expect(component.importarDeRemediosHerbals.getDestinatarioData).toHaveBeenCalled();
  });

  it('should run #getProveedorData()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getProveedorData = jest.fn().mockReturnValue(observableOf({}));
    component.getProveedorData();
     expect(component.importarDeRemediosHerbals.getProveedorData).toHaveBeenCalled();
  });

  it('should run #getFacturadorData()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getFacturadorData = jest.fn().mockReturnValue(observableOf({}));
    component.getFacturadorData();
     expect(component.importarDeRemediosHerbals.getFacturadorData).toHaveBeenCalled();
  });

  it('should run #eliminarPedimento()', async () => {
    component.pedimentos = component.pedimentos || {};
    component.pedimentos.splice = jest.fn();
    component.eliminarMercancias = jest.fn();
    component.abrirModal = jest.fn();
    component.eliminarPedimento({});
     expect(component.pedimentos.splice).toHaveBeenCalled();
     expect(component.eliminarMercancias).toHaveBeenCalled();
     expect(component.abrirModal).toHaveBeenCalled();
  });

  it('should run #abrirModal()', async () => {
    const mockItem = { id: 1 };
    component.selectedRows = new Set([mockItem]);
  
   
    component.abrirModal = jest.fn();
  
   
    component.abrirModal();
  
   
    expect(component.abrirModal).toHaveBeenCalled();
  });

  it('should run #onSelectedRowsChange()', async () => {

    component.onSelectedRowsChange([{
      id: {}
    }]);

  });
  it('should run #onDeleted()', async () => {
    const mockItem = { id: 1 };
    component.selectedRows = new Set([mockItem]);
    component.abrirModal = jest.fn();
    component.onDeleted();
    expect(component.abrirModal).toHaveBeenCalled(); 
    expect(component.selectedRows.size).toBe(1); 
  });

  it('should run #agregarMercancias()', async () => {
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.reset = jest.fn();
    component.agregarMercancias();
     expect(component.destinatarioForm.reset).toHaveBeenCalled();
  });

  it('should run #getPaisData()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getPaisData = jest.fn().mockReturnValue(observableOf({}));
    component.paisData = component.paisData || {};
    component.paisData.catalogos = 'catalogos';
    component.getPaisData();
     expect(component.importarDeRemediosHerbals.getPaisData).toHaveBeenCalled();
  });

  it('should run #setTipoPersona()', async () => {

    component.setTipoPersona({
      toString: function() {}
    });

  });

  it('should run #setNacionalidad()', async () => {

    component.setNacionalidad({
      toString: function() {}
    });

  });it('should run #onGuardar()', async () => {
    component.destinatarioForm = component.fb.group({
      agregarDestinatario: component.fb.group({
        tipoPersona: ['fisica'],
        nacionalidad: ['mexicana'],
      }),
      datosPersonales: component.fb.group({
        nombre: ['John'],
        primerApellido: ['Doe'],
        segundoApellido: ['Smith'],
        denominacion: ['Company'],
        pais: ['1'],
        domicilio: ['Address'],
        estado: ['State'],
        codigopostal: ['12345'],
        calle: ['Street'],
        numeroExterior: ['123'],
        numeroInterior: ['456'],
        lada: ['55'],
        telefono: ['1234567890'],
        correoElectronico: ['test@example.com'],
        rfc: ['RFC123'],
        curp: ['CURP123'],
      }),
    });
  
    component.tableData = [];
    component.fabricanteDatos = [];
  
    jest.spyOn(component, 'getPaisName').mockReturnValue('Mexico');
    const resetSpy = jest.spyOn(component.destinatarioForm, 'reset');
  
    component.onGuardar();
  

    expect(component.getPaisName).toHaveBeenCalledWith('1');
    expect(component.tableData.length).toBe(1);
    expect(component.fabricanteDatos.length).toBe(1);
    expect(resetSpy).toHaveBeenCalled();
    expect(component.esFormularioVisible).toBe(false);
  });
  it('should run #getPaisName()', async () => {
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
    component.getPaisName({});

  });

  it('should run #limpiarFormulario()', async () => {
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.reset = jest.fn();
    component.limpiarFormulario();
     expect(component.destinatarioForm.reset).toHaveBeenCalled();
  });

  it('should run #cancelarFormulario()', async () => {

    component.cancelarFormulario();

  });

  it('should run #setValoresStore()', async () => {
    component.solicitud260919Store = {
      metodoNombre: jest.fn(), 
    };
  
  
    const mockForm = {
      get: jest.fn().mockReturnValue({ value: 'mockValue' }),
    };
  
    component.setValoresStore(mockForm as any, 'campo', 'metodoNombre');
    expect(component.solicitud260919Store.metodoNombre).toHaveBeenCalledWith('mockValue');
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