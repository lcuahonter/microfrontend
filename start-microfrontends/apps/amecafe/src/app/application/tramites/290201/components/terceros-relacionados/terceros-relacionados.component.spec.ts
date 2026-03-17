
import {ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component, ChangeDetectorRef } from '@angular/core';
import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { RegistrarSolicitudService } from '../../services/registrar-solicitud.service';
import { FormBuilder } from '@angular/forms';
import { Solicitud290201Store } from '../../../../estados/tramites/tramites290201.store';
import { Solicitud290201Query } from '../../../../estados/queries/tramites290201.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

@Injectable()
class MockRegistrarSolicitudService {
  getPaisData() {
    return observableOf({});
  }
}
@Injectable()
class MockSolicitud290201Store {}

@Injectable()
class MockSolicitud290201Query {}

describe('TercerosRelacionadosComponent', () => {
  let fixture: ComponentFixture<TercerosRelacionadosComponent>;
  let component: { ngOnDestroy: () => void; destinatarioForm: { get?: any; value?: any; reset?: any; patchValue?: any; disable?: any; enable?: any; }; selectedTipoPersona: any; datosDelTramiteRealizar: any; solicitud290201Query: { selectSolicitud$?: any; }; createForm: jest.Mock<any, any, any> | (() => void); consultaioQuery: { selectConsultaioState$?: any; }; inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; fb: { group?: any; }; destinatarioState: { tipoPersona?: any; denominacion?: any; domicilio?: any; pais?: any; codigopostal?: any; telefono?: any; correoelectronico?: any; }; registrarsolicitud: { getPaisData?: any; }; paisData: { catalogos?: any; }; getPaisData: () => void; newDestinatarioData: any[]; changeDetectorRef: { markForCheck?: any; }; enEnviar: () => void; onLimpiar: () => void; onSelectedRowsChange: (arg0: { id: {}; }[]) => void; selectedRow: { datosDelTramiteRealizar?: any; }; enModificar: () => void; selectedRows: { size?: any; has?: any; clear?: any; }; tableData: string[]; onDeleteSelectedRows: () => void; onRowClick: (arg0: { datosDelTramiteRealizar: { tipoPersona: {}; denominacion: {}; domicilio: {}; pais: {}; codigopostal: {}; telefono: {}; correoelectronico: {}; }; }) => void; solicitud290201Store: { metodoNombre?: any; }; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; destroyed$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,TercerosRelacionadosComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: RegistrarSolicitudService, useClass: MockRegistrarSolicitudService },
        FormBuilder,
        ChangeDetectorRef,
        { provide: Solicitud290201Store, useClass: MockSolicitud290201Store },
        { provide: Solicitud290201Query, useClass: MockSolicitud290201Query },
        ConsultaioQuery
      ]
    }).overrideComponent(TercerosRelacionadosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TercerosRelacionadosComponent);
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
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.get = jest.fn().mockReturnValue({
      value: {}
    });
    const selectedTipoPersona = component.selectedTipoPersona;
     expect(component.destinatarioForm.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #datosDelTramiteRealizar', async () => {
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.get = jest.fn();
    const datosDelTramiteRealizar = component.datosDelTramiteRealizar;
     expect(component.destinatarioForm.get).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.solicitud290201Query = component.solicitud290201Query || {};
    component.solicitud290201Query.selectSolicitud$ = observableOf({});
    component.createForm = jest.fn();
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
     expect(component.createForm).toHaveBeenCalled();
     expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #createForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.destinatarioState = component.destinatarioState || {};
    component.destinatarioState.tipoPersona = 'tipoPersona';
    component.destinatarioState.denominacion = 'denominacion';
    component.destinatarioState.domicilio = 'domicilio';
    component.destinatarioState.pais = 'pais';
    component.destinatarioState.codigopostal = 'codigopostal';
    component.destinatarioState.telefono = 'telefono';
    component.destinatarioState.correoelectronico = 'correoelectronico';
    component.createForm();
     expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #getPaisData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getPaisData = jest.fn().mockReturnValue(observableOf({}));
    component.paisData = component.paisData || {};
    component.paisData.catalogos = 'catalogos';
    component.getPaisData();
     expect(component.registrarsolicitud.getPaisData).toHaveBeenCalled();
  });

  it('should run #enEnviar()', async () => {
    component.destinatarioForm = {
      value: {
        datosDelTramiteRealizar: {
          pais: '1', 
        },
      },
      reset: jest.fn(),
    } as unknown as FormGroup;
  
    component.paisData = {
      catalogos: [
        { id: '1', descripcion: 'Country 1' }, 
      ],
    };
  
    component.newDestinatarioData = [];
  
    component.changeDetectorRef = {
      markForCheck: jest.fn(),
    } as unknown as ChangeDetectorRef;
  
    component.enEnviar();
  

    expect(component.destinatarioForm.reset).toHaveBeenCalled();
    expect(component.newDestinatarioData.length).toBe(1); 
    expect(component.changeDetectorRef.markForCheck).toHaveBeenCalled();
  });

  it('should run #onLimpiar()', async () => {
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.reset = jest.fn();
    component.destinatarioForm.patchValue = jest.fn();
    component.onLimpiar();
     expect(component.destinatarioForm.reset).toHaveBeenCalled();
     expect(component.destinatarioForm.patchValue).toHaveBeenCalled();
  });

  it('should run #onSelectedRowsChange()', async () => {

    component.onSelectedRowsChange([{
      id: {}
    }]);

  });

  it('should run #enModificar()', async () => {
    component.selectedRow = component.selectedRow || {};
    component.selectedRow.datosDelTramiteRealizar = {
      tipoPersona: {},
      denominacion: {},
      domicilio: {},
      codigopostal: {},
      telefono: {},
      correoelectronico: {}
    };
    component.paisData = component.paisData || {};
    component.paisData.catalogos = {
      find: function() {
        return [
          {
            "descripcion": {}
          }
        ];
      }
    };
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.patchValue = jest.fn();
    component.enModificar();
     expect(component.destinatarioForm.patchValue).toHaveBeenCalled();
  });

  it('should run #onDeleteSelectedRows()', async () => {
    component.selectedRows = new Set([{ id: 1 }, { id: 2 }]);
    
    component.tableData = ['tableData'];
    component.destinatarioForm = {
      reset: jest.fn(),
    };
  
    component.onDeleteSelectedRows();
  
    expect(component.selectedRows.size).toBe(0); 
    expect(component.destinatarioForm.reset).toHaveBeenCalled();
  });

  it('should run #onRowClick()', async () => {
    component.destinatarioForm = component.destinatarioForm || {};
    component.destinatarioForm.patchValue = jest.fn();
    component.paisData = component.paisData || {};
    component.paisData.catalogos = {
      find: function() {
        return [
          {
            "descripcion": {}
          }
        ];
      }
    };
    component.onRowClick({
      datosDelTramiteRealizar: {
        tipoPersona: {},
        denominacion: {},
        domicilio: {},
        pais: {},
        codigopostal: {},
        telefono: {},
        correoelectronico: {}
      }
    });
     expect(component.destinatarioForm.patchValue).toHaveBeenCalled();
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