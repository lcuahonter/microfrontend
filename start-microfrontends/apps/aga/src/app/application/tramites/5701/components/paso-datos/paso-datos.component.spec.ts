import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoDatosComponent } from './paso-datos.component';
import { Tramite5701Query } from '../../../../core/queries/tramite5701.query';
import { Tramite5701Store } from '../../../../core/estados/tramites/tramite5701.store';
import { EstadoPedimentoService } from '../../../../core/services/5701/pedimento/estado-pedimento.service';
import { TipoPedimentoService } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockToastrService {}

@Injectable()
class MockTramite5701Query {}

@Injectable()
class MockTramite5701Store {}

@Injectable()
class MockEstadoPedimentoService {}

describe('PasoDatosComponent', () => {
  let fixture: ComponentFixture<PasoDatosComponent>;
  let component: { ngOnDestroy: () => void; pedimentoForm: { errors?: any; touched?: any; value?: any; reset?: any; }; isValid: any; getTiposPedimento: jest.Mock<any, any, any> | (() => void); tramite5701Query: { selectSolicitud$?: any; }; ngOnInit: () => void; tipoPedimentoService: { getListaTipoPedimento?: any; }; acciones: jest.Mock<any, any, any> | (() => void); ngOnChanges: (arg0: {}) => void; validaCampos: { emit?: any; }; agregaPedimento: () => void; pedimentos: string[]; solicitudState: { idAduanaDespacho?: any; }; estadoPedimentoService: { postEstadoPedimento?: any; }; datosTablaPedimento: { emit?: any; }; datosNroPedimento: { patente?: any; idAduanaDespacho?: any; }; selected: { includes?: any; }; abrirModalEliminar: () => void; destroyNotifier$: { next?: any; complete?: any; }; tiposPedimento: { find?: any; }; actualizarValor: (arg0: { target: { value: {}; }; }, arg1: {}, arg2: {}) => void; editarCelda: (arg0: {}) => void; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, PasoDatosComponent, HttpClientTestingModule ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite5701Query, useClass: MockTramite5701Query },
        { provide: Tramite5701Store, useClass: MockTramite5701Store },
        { provide: EstadoPedimentoService, useClass: MockEstadoPedimentoService },
        TipoPedimentoService
      ]
    }).overrideComponent(PasoDatosComponent, {

      set: { providers: [{ provide: ToastrService, useClass: MockToastrService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(PasoDatosComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #isValid', async () => {
    component.pedimentoForm = component.pedimentoForm || {};
    component.pedimentoForm.errors = 'errors';
    component.pedimentoForm.touched = 'touched';
    const isValid = component.isValid;

  });

  it('should run #ngOnInit()', async () => {
    component.getTiposPedimento = jest.fn();
    component.tramite5701Query = component.tramite5701Query || {};
    component.tramite5701Query.selectSolicitud$ = observableOf({});
    component.ngOnInit();
    // expect(component.getTiposPedimento).toHaveBeenCalled();
  });

  it('should run #getTiposPedimento()', async () => {
    component.tipoPedimentoService = component.tipoPedimentoService || {};
    component.tipoPedimentoService.getListaTipoPedimento = jest.fn().mockReturnValue(observableOf({}));
    component.getTiposPedimento();
    // expect(component.tipoPedimentoService.getListaTipoPedimento).toHaveBeenCalled();
  });

  it('should run #ngOnChanges()', async () => {
    component.acciones = jest.fn();
    component.ngOnChanges({});
    // expect(component.acciones).toHaveBeenCalled();
  });

  it('should run #agregaPedimento()', async () => {
    component.validaCampos = component.validaCampos || {};
    component.validaCampos.emit = jest.fn();
    component.acciones = jest.fn();
    component.agregaPedimento();
    // expect(component.validaCampos.emit).toHaveBeenCalled();
    // expect(component.acciones).toHaveBeenCalled();
  });

  it('should set userHasInteracted to true when agregaPedimento is called', async () => {
    // Arrange
    component.userHasInteracted = false;
    component.validaCampos = component.validaCampos || {};
    component.validaCampos.emit = jest.fn();
    component.acciones = jest.fn();

    // Act
    component.agregaPedimento();

    // Assert
    expect(component.userHasInteracted).toBe(true);
  });

  it('should run #acciones()', async () => {
    component.pedimentoForm = component.pedimentoForm || {};
    component.pedimentoForm.value = 'value';
    component.pedimentoForm.reset = jest.fn();
    component.pedimentos = component.pedimentos || {};
    component.pedimentos.every = ((predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any) => true) as typeof component.pedimentos.every;
    component.pedimentos.some = jest.fn().mockReturnValue([
      {
        "pedimento": {}
      }
    ]);
    component.pedimentos.push = jest.fn();
    component.solicitudState = component.solicitudState || {};
    component.solicitudState.idAduanaDespacho = 'idAduanaDespacho';
    component.estadoPedimentoService = component.estadoPedimentoService || {};
    component.estadoPedimentoService.postEstadoPedimento = jest.fn().mockReturnValue(observableOf({}));
    component.datosTablaPedimento = component.datosTablaPedimento || {};
    component.datosTablaPedimento.emit = jest.fn();
    component.datosNroPedimento = component.datosNroPedimento || {};
    component.datosNroPedimento.patente = 'patente';
    component.datosNroPedimento.idAduanaDespacho = 'idAduanaDespacho';
    component.acciones();
    // expect(component.pedimentoForm.reset).toHaveBeenCalled();
    // expect(component.pedimentos.every).toHaveBeenCalled();
    // expect(component.pedimentos.some).toHaveBeenCalled();
    // expect(component.pedimentos.push).toHaveBeenCalled();
    // expect(component.estadoPedimentoService.postEstadoPedimento).toHaveBeenCalled();
    // expect(component.datosTablaPedimento.emit).toHaveBeenCalled();
  });

  it('should run #abrirModalEliminar()', async () => {
    component.pedimentos = component.pedimentos || {};
    component.pedimentos = ['pedimentos'];
    component.selected = component.selected || {};
    component.selected.includes = jest.fn();
    component.datosTablaPedimento = component.datosTablaPedimento || {};
    component.datosTablaPedimento.emit = jest.fn();
    component.abrirModalEliminar();
    // expect(component.selected.includes).toHaveBeenCalled();
    // expect(component.datosTablaPedimento.emit).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    // expect(component.destroyNotifier$.next).toHaveBeenCalled();
    // expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

  it('should run #undefined()', async () => {
    // Error: ERROR Util.getNode JS code is invalid, "(...undefined)"
    //     at Util.getNode (/var/task/lib/util.js:181:13)
    //     at Util.getObjectFromExpression (/var/task/lib/util.js:290:25)
    //     at FuncTestGen.setPropsOrParams (/var/task/lib/func-test-gen.js:243:18)
    //     at FuncTestGen.setMockData (/var/task/lib/func-test-gen.js:161:12)
    //     at FuncTestGen.setMockData (/var/task/lib/func-test-gen.js:90:12)
    //     at /var/task/lib/func-test-gen.js:80:14
    //     at Array.forEach (<anonymous>)
    //     at FuncTestGen.setMockData (/var/task/lib/func-test-gen.js:79:17)
    //     at FuncTestGen.setMockData (/var/task/lib/func-test-gen.js:104:12)
    //     at /var/task/lib/index.js:188:17
  });

  it('should run #actualizarValor()', async () => {
    component.pedimentos = [
      'pedimento1'
    ];
    component.tiposPedimento = component.tiposPedimento || {};
    component.tiposPedimento.find = jest.fn().mockReturnValue([
      {
        "descripcion": {}
      }
    ]);
    component.actualizarValor({
      target: {
        value: {}
      }
    }, {}, {});
    // expect(component.tiposPedimento.find).toHaveBeenCalled();
  });

  it('should preserve numero when changing tipoPedimento', async () => {
    // Setup: Create a pedimento with a numero value
    const mockPedimento = {
      idPedimento: 1,
      patente: '3061',
      pedimento: '3838292',
      aduana: 20,
      tipoPedimento: 1,
      descTipoPedimento: 'Normal',
      numero: '1020',
      comprobanteValor: 'Si',
      pedimentoValidado: false
    };
    component.pedimentos = [mockPedimento];
    
    // Setup: Mock tiposPedimento to return a valid tipo when searching
    component.tiposPedimento = [
      { id: 1, descripcion: 'Normal' },
      { id: 2, descripcion: 'Copia simple' }
    ];
    
    // Setup: Mock the editar object
    component.editar = {};
    
    // Act: Change tipoPedimento from 'Normal' to 'Copia simple'
    const mockEvent = {
      target: { value: 'Copia simple' }
    };
    
    component.actualizarValor(mockEvent as any, 'descTipoPedimento', 0);
    
    // Assert: The numero should be preserved (not cleared)
    expect(component.pedimentos[0].numero).toBe('1020');
    expect(component.pedimentos[0].descTipoPedimento).toBe('Copia simple');
    expect(component.pedimentos[0].tipoPedimento).toBe(2);
  });

});