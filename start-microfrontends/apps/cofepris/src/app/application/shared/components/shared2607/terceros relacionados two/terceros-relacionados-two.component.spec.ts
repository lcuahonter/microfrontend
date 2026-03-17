
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import{TercerosrelacionadosComponent} from './terceros-relacionados.component';
import { FormBuilder } from '@angular/forms';
import { RegistrarSolicitudMcpService } from '../../../services/shared2607/registrar-solicitud-mcp.service';
import { Solicitud260702Store } from '../../../estados/stores/shared2607/tramites260702.store';
import { Solicitud260702Query } from '../../../estados/queries/shared2607/tramites260702.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
@Injectable()
class MockRegistrarSolicitudMcpService {
  getPaisData = jest.fn().mockReturnValue(observableOf({}));
  getConsultaData = jest.fn().mockReturnValue(observableOf({}));
  actualizarEstadoFormulario = jest.fn();
}

@Injectable()
class MockSolicitud260702Store {}

@Injectable()
class MockSolicitud260702Query {}


describe('TercerosrelacionadosComponent', () => {
  let fixture: ComponentFixture<TercerosrelacionadosComponent>;
  let component: {
    esFormularioSoloLectura: boolean; ngOnDestroy: () => void; agregarDestinatario: { get?: any; }; selectedTipoPersona: any; destinatarioForm: { get?: any; disable?: any; enable?: any; value?: any; reset?: any; patchValue?: any; }; fb: { group?: any; }; agregarDestinatarioState: { tipoPersona?: any; nombre?: any; primerApellido?: any; segundoApellido?: any; denominacion?: any; pais?: any; domicilio?: any; estado?: any; codigopostal?: any; calle?: any; numeroExterior?: any; numeroInterior?: any; lada?: any; telefono?: any; correoElectronico?: any; }; crearFormTransporte: jest.Mock<any, any, any> | (() => void); inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; guardarDatosFormulario: jest.Mock<any, any, any> | (() => void); inicializarFormulario: jest.Mock<any, any, any> | (() => void); solicitud260702Query: { selectSolicitud$?: any; }; getPaisData: jest.Mock<any, any, any> | (() => void); pedimentos: { splice?: any; }; eliminarMercancias: jest.Mock<any, any, any> | (() => void); abrirModal: jest.Mock<any, any, any> | (() => void); eliminarPedimento: (arg0: {}) => void; selectedRows: { size?: any; clear?: any; }; registrarsolicitudmcp: {
    actualizarEstadoFormulario: jest.Mock<any, any, any>;
    getConsultaData: jest.Mock<any, any, any>; getPaisData?: any; 
}; paisData: { catalogos?: any; }; tableData: string[]; getPaisName: jest.Mock<any, any, any> | ((arg0: {}) => void); onGuardar: () => void; onSelectedRowsChange: (arg0: { id: {}; }[]) => void; openModificarMercancias: () => void; agregarMercancias: () => void; cancelarFormulario: () => void; onConfirmarEliminacion: () => void; limpiarFormulario: () => void; onDeleted: () => void; solicitud260702Store: { metodoNombre?: any; }; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; setTipoPersona: (arg0: { toString: () => void; }) => void; destroyed$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,TercerosrelacionadosComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: RegistrarSolicitudMcpService, useClass: MockRegistrarSolicitudMcpService },
        { provide: Solicitud260702Store, useClass: MockSolicitud260702Store },
        { provide: Solicitud260702Query, useClass: MockSolicitud260702Query },
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

  it('should run GetterDeclaration #agregarDestinatario', async () => {
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.get = jest.fn();
    const agregarDestinatario = component.agregarDestinatario;
     expect(component.destinatarioForm.get).toHaveBeenCalled();
  });

  it('should run #crearFormTransporte()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.agregarDestinatarioState = component.agregarDestinatarioState || {};
    component.agregarDestinatarioState.tipoPersona = 'tipoPersona';
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
    component.crearFormTransporte();
     expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
     expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });
  
it('should run #inicializarFormulario()', async () => {
  component.solicitud260702Query = {
    selectSolicitud$: observableOf({}),
  } as any;

  component.destroyed$ = {
    next: jest.fn(),
    complete: jest.fn(),
  } as any;

  component.crearFormTransporte = jest.fn();
  component.getPaisData = jest.fn();

  component.inicializarFormulario();

  expect(component.crearFormTransporte).toHaveBeenCalled();
  expect(component.getPaisData).toHaveBeenCalled();
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

  it('should run #getPaisData()', async () => {
    component.registrarsolicitudmcp = component.registrarsolicitudmcp || {};
    component.registrarsolicitudmcp.getPaisData = jest.fn().mockReturnValue(observableOf({}));
    component.paisData = component.paisData || {};
    component.paisData.catalogos = 'catalogos';
    component.getPaisData();
     expect(component.registrarsolicitudmcp.getPaisData).toHaveBeenCalled();
  });

  it('should run #onGuardar()', async () => {
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.value = {
      agregarDestinatario: {},
      datosPersonales: {
        pais: {}
      }
    };
    component.destinatarioForm.reset = jest.fn();
    component.tableData = component.tableData || {};
    component.tableData.push = jest.fn();
    component.getPaisName = jest.fn();
    component.onGuardar();
     expect(component.destinatarioForm.reset).toHaveBeenCalled();
     expect(component.tableData.push).toHaveBeenCalled();
     expect(component.getPaisName).toHaveBeenCalled();
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

  it('should run #onSelectedRowsChange()', async () => {

    component.onSelectedRowsChange([{
      id: {}
    }]);

  });

  it('should run #eliminarMercancias()', async () => {
    component.selectedRows = new Set([{ id: 1 }]);
      jest.spyOn(component.selectedRows, 'clear');
    component.tableData = ['tableData'];
      component.eliminarMercancias();
    expect(component.selectedRows.clear).toHaveBeenCalled();
  });

  it('should run #agregarMercancias()', async () => {
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.reset = jest.fn();
    component.agregarMercancias();
     expect(component.destinatarioForm.reset).toHaveBeenCalled();
  });

  it('should run #cancelarFormulario()', async () => {

    component.cancelarFormulario();

  });

  it('should run #onConfirmarEliminacion()', async () => {
    component.eliminarMercancias = jest.fn();
    component.abrirModal = jest.fn();
    component.onConfirmarEliminacion();
     expect(component.eliminarMercancias).toHaveBeenCalled();
     expect(component.abrirModal).toHaveBeenCalled();
  });

  it('should run #limpiarFormulario()', async () => {
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.reset = jest.fn();
    component.limpiarFormulario();
     expect(component.destinatarioForm.reset).toHaveBeenCalled();
  });

  it('should run #onDeleted()', async () => {
    const mockItem = { id: 1 };
    component.selectedRows = new Set([mockItem]);
    component.abrirModal = jest.fn();
    component.onDeleted();
    expect(component.abrirModal).toHaveBeenCalled(); 
    expect(component.selectedRows.size).toBe(1); 
  });

  it('should run #setValoresStore()', async () => {

    component.solicitud260702Store = {
      metodoNombre: jest.fn(), 
    };
  
    const mockForm = {
      get: jest.fn().mockReturnValue({ value: 'mockValue' }), 
    } as unknown as FormGroup;
  
    component.setValoresStore(
      { get: () => ({ value: mockForm.get('campo')?.value }) },
      'campo',
      'metodoNombre' as keyof typeof component.solicitud260702Store
    );
  
    expect(mockForm.get).toHaveBeenCalledWith('campo'); 
    expect(component.solicitud260702Store.metodoNombre).toHaveBeenCalledWith('mockValue'); 
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