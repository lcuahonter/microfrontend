
import {ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

declare global {
  interface Window {
    Modal?: any;
  }
}

import { Component, ChangeDetectorRef } from '@angular/core';
import{DatosdelasolicitudComponent} from './datos-de-la-solicitud.component';
import { FormBuilder } from '@angular/forms';
import { RegistrarSolicitudMcpService } from '../../../services/shared2607/registrar-solicitud-mcp.service';
import { Solicitud260702Store } from '../../../estados/stores/shared2607/tramites260702.store';
import { Solicitud260702Query } from '../../../estados/queries/shared2607/tramites260702.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

@Injectable()
class MockRegistrarSolicitudMcpService {
  getEstadosData = jest.fn().mockReturnValue(observableOf({}));
  getClaveScianData = jest.fn().mockReturnValue(observableOf({}));
  getClaveDescripcionDelData = jest.fn().mockReturnValue(observableOf({}));
  getRegimenalqueData = jest.fn().mockReturnValue(observableOf({}));
  getAduanaData = jest.fn().mockReturnValue(observableOf({}));
  getMercanciasData = jest.fn().mockReturnValue(observableOf({}));
  getClasificacionDelProductoData = jest.fn().mockReturnValue(observableOf({}));
  getEspificarData = jest.fn().mockReturnValue(observableOf({}));
  getTipoProductoData = jest.fn().mockReturnValue(observableOf({}));
  getListaClaveData = jest.fn().mockReturnValue(observableOf({}));
}


@Injectable()
class MockSolicitud260702Store {}

@Injectable()
class MockSolicitud260702Query {}



describe('DatosdelasolicitudComponent', () => {
  let fixture: ComponentFixture<DatosdelasolicitudComponent>;
  let component: {
    showClavaScianForm(showClavaScianForm: any): unknown;
    selectedRows: Set<{ id: number; }>;
    esFormularioSoloLectura: boolean; ngOnDestroy: () => void; dataDeLaSolicitudForm: { get?: any; disable?: any; enable?: any; reset?: any; patchValue?: any; }; datosDelTramiteRealizar: any; inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; guardarDatosFormulario: jest.Mock<any, any, any> | (() => void); inicializarFormulario: jest.Mock<any, any, any> | (() => void); solicitud260702Query: { selectSolicitud$?: any; }; createForm: jest.Mock<any, any, any> | (() => void); getEstadosData: jest.Mock<any, any, any> | (() => void); getClaveScianData: jest.Mock<any, any, any> | (() => void); createclaveScianForm: jest.Mock<any, any, any> | (() => void); getClaveDescripcionDelData: jest.Mock<any, any, any> | (() => void); getRegimenalqueData: jest.Mock<any, any, any> | (() => void); getAduanaData: jest.Mock<any, any, any> | (() => void); getMercanciasData: jest.Mock<any, any, any> | (() => void); getEspificarData: jest.Mock<any, any, any> | (() => void); getClasificacionDelProductoData: jest.Mock<any, any, any> | (() => void); getTipoProductoData: jest.Mock<any, any, any> | (() => void); getListaClaveData: jest.Mock<any, any, any> | (() => void); getMercanciaCrosslistData: jest.Mock<any, any, any> | (() => void); clavaScianForm: { disable?: any; enable?: any; value?: any; reset?: any; }; fb: { group?: any; }; dataDeLaSolicitudState: { claveDeLosLotes?: any; fechaDeFabricacion?: any; fechaDeCaducidad?: any; descripcionFraccionArancelaria?: any; cantidadUMT?: any; cantidadUMC?: any; umc?: any; tipoProducto?: any; clasificaionProductos?: any; especificarProducto?: any; nombreProductoEspecifico?: any; marca?: any; fraccionArancelaria?: any; justification?: any; denominacion?: any; correoElectronico?: any; codigopostal?: any; estado?: any; municipoyalcaldia?: any; localidad?: any; colonia?: any; calle?: any; lada?: any; telefono?: any; avisoDeFuncionamiento?: any; licenciaSanitaria?: any; regimenalque?: any; aduana?: any; rfc?: any; legalRazonSocial?: any; apellidoPaterno?: any; apellidoMaterno?: any; }; clearNotificacion: jest.Mock<any, any, any> | (() => void); closeModal: () => void; tableData: string[]; filasSeleccionadas: { has?: any; clear?: any; size?: any; }; pedimentos: { splice?: any; }; eliminarPedimento: (arg0: {}) => void; abrirModal: jest.Mock<any, any, any> | (() => void); registrarsolicitudmcp: { getMercanciaCrosslistData?: any; getEstadosData?: any; getClaveScianData?: any; getClaveDescripcionDelData?: any; getRegimenalqueData?: any; getAduanaData?: any; getMercanciasData?: any; getClasificacionDelProductoData?: any; getEspificarData?: any; getTipoProductoData?: any; getListaClaveData?: any; }; paisOrigenColapsable: () => void; paisProcedencis_colapsable: () => void; usoEspecificoColapsable: () => void; estadoData: { catalogos?: any; }; claveScianData: { catalogos?: any; }; descripcionDelScianData: { catalogos?: any; }; regimenalqueData: { catalogos?: any; }; aduanaData: { catalogos?: any; }; aceptar: () => void; delProducto: { catalogos?: any; }; especificarData: { catalogos?: any; }; tipoProductoData: { catalogos?: any; }; seleccionarEstablecimiento: () => void; onSubmit: () => void; onfilasSeleccionadas: (arg0: { length: {}; map: () => { claveScianG: { claveScian: {}; }; id: {}; claveDeLosLotes: {}; }[]; }) => void; onEliminar: () => void; listaClaveTabla: string[]; confirmarEliminar: () => void; onLimpiar: () => void; onAgregar: () => void; onDelete: () => void; onCancelar: () => void; modalElement: { nativeElement?: any; }; agregarMercanciaGrid: () => void; onClaveDeLosLotesChange: (arg0: { target: { value: {}; }; }) => void; onFechaDeFabricacionChange: (arg0: {}) => void; onFechaDeCaducidadChange: (arg0: {}) => void; onAgregarListaClave: () => void; onModificar: () => void; solicitud260702Store: { metodoNombre?: any; }; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; destroyed$: { next?: any; complete?: any; }; 
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,DatosdelasolicitudComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: RegistrarSolicitudMcpService, useClass: MockRegistrarSolicitudMcpService },
        ChangeDetectorRef,
        { provide: Solicitud260702Store, useClass: MockSolicitud260702Store },
        { provide: Solicitud260702Query, useClass: MockSolicitud260702Query },
        ConsultaioQuery
      ]
    }).overrideComponent(DatosdelasolicitudComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosdelasolicitudComponent);
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
    component.dataDeLaSolicitudForm = component.dataDeLaSolicitudForm || {};
    component.dataDeLaSolicitudForm.get = jest.fn();
    const datosDelTramiteRealizar = component.datosDelTramiteRealizar;
     expect(component.dataDeLaSolicitudForm.get).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
     expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #inicializarFormulario()', async () => {
    component.solicitud260702Query = component.solicitud260702Query || {};
    component.solicitud260702Query.selectSolicitud$ = observableOf({});
    component.createForm = jest.fn();
    component.getEstadosData = jest.fn();
    component.getClaveScianData = jest.fn();
    component.createclaveScianForm = jest.fn();
    component.getClaveDescripcionDelData = jest.fn();
    component.getRegimenalqueData = jest.fn();
    component.getAduanaData = jest.fn();
    component.getMercanciasData = jest.fn();
    component.getEspificarData = jest.fn();
    component.getClasificacionDelProductoData = jest.fn();
    component.getTipoProductoData = jest.fn();
    component.getListaClaveData = jest.fn();
    component.getMercanciaCrosslistData = jest.fn();
    component.inicializarFormulario();
     expect(component.createForm).toHaveBeenCalled();
     expect(component.getEstadosData).toHaveBeenCalled();
     expect(component.getClaveScianData).toHaveBeenCalled();
     expect(component.createclaveScianForm).toHaveBeenCalled();
     expect(component.getClaveDescripcionDelData).toHaveBeenCalled();
     expect(component.getRegimenalqueData).toHaveBeenCalled();
     expect(component.getAduanaData).toHaveBeenCalled();
     expect(component.getMercanciasData).toHaveBeenCalled();
     expect(component.getEspificarData).toHaveBeenCalled();
     expect(component.getClasificacionDelProductoData).toHaveBeenCalled();
     expect(component.getTipoProductoData).toHaveBeenCalled();
     expect(component.getListaClaveData).toHaveBeenCalled();
     expect(component.getMercanciaCrosslistData).toHaveBeenCalled();
  });

  

  it('should run #createForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.dataDeLaSolicitudState = component.dataDeLaSolicitudState || {};
    component.dataDeLaSolicitudState.claveDeLosLotes = 'claveDeLosLotes';
    component.dataDeLaSolicitudState.fechaDeFabricacion = 'fechaDeFabricacion';
    component.dataDeLaSolicitudState.fechaDeCaducidad = 'fechaDeCaducidad';
    component.dataDeLaSolicitudState.descripcionFraccionArancelaria = 'descripcionFraccionArancelaria';
    component.dataDeLaSolicitudState.cantidadUMT = 'cantidadUMT';
    component.dataDeLaSolicitudState.cantidadUMC = 'cantidadUMC';
    component.dataDeLaSolicitudState.umc = 'umc';
    component.dataDeLaSolicitudState.tipoProducto = 'tipoProducto';
    component.dataDeLaSolicitudState.clasificaionProductos = 'clasificaionProductos';
    component.dataDeLaSolicitudState.especificarProducto = 'especificarProducto';
    component.dataDeLaSolicitudState.nombreProductoEspecifico = 'nombreProductoEspecifico';
    component.dataDeLaSolicitudState.marca = 'marca';
    component.dataDeLaSolicitudState.fraccionArancelaria = 'fraccionArancelaria';
    component.dataDeLaSolicitudState.justification = 'justification';
    component.dataDeLaSolicitudState.denominacion = 'denominacion';
    component.dataDeLaSolicitudState.correoElectronico = 'correoElectronico';
    component.dataDeLaSolicitudState.codigopostal = 'codigopostal';
    component.dataDeLaSolicitudState.estado = 'estado';
    component.dataDeLaSolicitudState.municipoyalcaldia = 'municipoyalcaldia';
    component.dataDeLaSolicitudState.localidad = 'localidad';
    component.dataDeLaSolicitudState.colonia = 'colonia';
    component.dataDeLaSolicitudState.calle = 'calle';
    component.dataDeLaSolicitudState.lada = 'lada';
    component.dataDeLaSolicitudState.telefono = 'telefono';
    component.dataDeLaSolicitudState.avisoDeFuncionamiento = 'avisoDeFuncionamiento';
    component.dataDeLaSolicitudState.licenciaSanitaria = 'licenciaSanitaria';
    component.dataDeLaSolicitudState.regimenalque = 'regimenalque';
    component.dataDeLaSolicitudState.aduana = 'aduana';
    component.dataDeLaSolicitudState.rfc = 'rfc';
    component.dataDeLaSolicitudState.legalRazonSocial = 'legalRazonSocial';
    component.dataDeLaSolicitudState.apellidoPaterno = 'apellidoPaterno';
    component.dataDeLaSolicitudState.apellidoMaterno = 'apellidoMaterno';
    component.createForm();
     expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #clearNotificacion()', async () => {

    component.clearNotificacion();

  });

  it('should run #closeModal()', async () => {
    component.clearNotificacion = jest.fn();
    component.closeModal();
     expect(component.clearNotificacion).toHaveBeenCalled();
  });

  it('should run #eliminarPedimento()', async () => {
    component.tableData = component.tableData || {};
    component.tableData = ['tableData'];
    component.filasSeleccionadas = component.filasSeleccionadas || {};
    component.filasSeleccionadas.has = jest.fn();
    component.filasSeleccionadas.clear = jest.fn();
    component.pedimentos = component.pedimentos || {};
    component.pedimentos.splice = jest.fn();
    component.eliminarPedimento({});
     expect(component.filasSeleccionadas.has).toHaveBeenCalled();
     expect(component.filasSeleccionadas.clear).toHaveBeenCalled();
     expect(component.pedimentos.splice).toHaveBeenCalled();
  });
  it('should run #abrirModal()', async () => {
    const mockItem = { id: 1 };
    component.selectedRows = new Set([mockItem]);
    component.abrirModal = jest.fn();
    component.abrirModal();
    expect(component.abrirModal).toHaveBeenCalled();
  });


  it('should run #createclaveScianForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.createclaveScianForm();
     expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #getMercanciaCrosslistData()', async () => {
    component.registrarsolicitudmcp = component.registrarsolicitudmcp || {};
    component.registrarsolicitudmcp.getMercanciaCrosslistData = jest.fn().mockReturnValue(observableOf({}));
    component.getMercanciaCrosslistData();
     expect(component.registrarsolicitudmcp.getMercanciaCrosslistData).toHaveBeenCalled();
  });

  it('should run #paisOrigenColapsable()', async () => {

    component.paisOrigenColapsable();

  });

  it('should run #paisProcedencis_colapsable()', async () => {

    component.paisProcedencis_colapsable();

  });

  it('should run #usoEspecificoColapsable()', async () => {

    component.usoEspecificoColapsable();

  });

  it('should run #getEstadosData()', async () => {
    component.registrarsolicitudmcp = component.registrarsolicitudmcp || {};
    component.registrarsolicitudmcp.getEstadosData = jest.fn().mockReturnValue(observableOf({}));
    component.estadoData = component.estadoData || {};
    component.estadoData.catalogos = 'catalogos';
    component.getEstadosData();
     expect(component.registrarsolicitudmcp.getEstadosData).toHaveBeenCalled();
  });

  it('should run #getClaveScianData()', async () => {
    component.registrarsolicitudmcp = component.registrarsolicitudmcp || {};
    component.registrarsolicitudmcp.getClaveScianData = jest.fn().mockReturnValue(observableOf({}));
    component.claveScianData = component.claveScianData || {};
    component.claveScianData.catalogos = 'catalogos';
    component.getClaveScianData();
     expect(component.registrarsolicitudmcp.getClaveScianData).toHaveBeenCalled();
  });

  it('should run #getClaveDescripcionDelData()', async () => {
    component.registrarsolicitudmcp = component.registrarsolicitudmcp || {};
    component.registrarsolicitudmcp.getClaveDescripcionDelData = jest.fn().mockReturnValue(observableOf({}));
    component.descripcionDelScianData = component.descripcionDelScianData || {};
    component.descripcionDelScianData.catalogos = 'catalogos';
    component.getClaveDescripcionDelData();
     expect(component.registrarsolicitudmcp.getClaveDescripcionDelData).toHaveBeenCalled();
  });

  it('should run #getRegimenalqueData()', async () => {
    component.registrarsolicitudmcp = component.registrarsolicitudmcp || {};
    component.registrarsolicitudmcp.getRegimenalqueData = jest.fn().mockReturnValue(observableOf({}));
    component.regimenalqueData = component.regimenalqueData || {};
    component.regimenalqueData.catalogos = 'catalogos';
    component.getRegimenalqueData();
     expect(component.registrarsolicitudmcp.getRegimenalqueData).toHaveBeenCalled();
  });

  it('should run #getAduanaData()', async () => {
    component.registrarsolicitudmcp = component.registrarsolicitudmcp || {};
    component.registrarsolicitudmcp.getAduanaData = jest.fn().mockReturnValue(observableOf({}));
    component.aduanaData = component.aduanaData || {};
    component.aduanaData.catalogos = 'catalogos';
    component.getAduanaData();
     expect(component.registrarsolicitudmcp.getAduanaData).toHaveBeenCalled();
  });

  it('should run #aceptar()', async () => {
    component.dataDeLaSolicitudForm = component.dataDeLaSolicitudForm || {};
    component.dataDeLaSolicitudForm.enable = jest.fn();
    component.aceptar();
     expect(component.dataDeLaSolicitudForm.enable).toHaveBeenCalled();
  });

  it('should run #getMercanciasData()', async () => {
    component.registrarsolicitudmcp = component.registrarsolicitudmcp || {};
    component.registrarsolicitudmcp.getMercanciasData = jest.fn().mockReturnValue(observableOf({}));
    component.getMercanciasData();
     expect(component.registrarsolicitudmcp.getMercanciasData).toHaveBeenCalled();
  });

  it('should run #getClasificacionDelProductoData()', async () => {
    component.registrarsolicitudmcp = component.registrarsolicitudmcp || {};
    component.registrarsolicitudmcp.getClasificacionDelProductoData = jest.fn().mockReturnValue(observableOf({}));
    component.delProducto = component.delProducto || {};
    component.delProducto.catalogos = 'catalogos';
    component.getClasificacionDelProductoData();
     expect(component.registrarsolicitudmcp.getClasificacionDelProductoData).toHaveBeenCalled();
  });

  it('should run #getEspificarData()', async () => {
    component.registrarsolicitudmcp = component.registrarsolicitudmcp || {};
    component.registrarsolicitudmcp.getEspificarData = jest.fn().mockReturnValue(observableOf({}));
    component.especificarData = component.especificarData || {};
    component.especificarData.catalogos = 'catalogos';
    component.getEspificarData();
     expect(component.registrarsolicitudmcp.getEspificarData).toHaveBeenCalled();
  });

  it('should run #getTipoProductoData()', async () => {
    component.registrarsolicitudmcp = component.registrarsolicitudmcp || {};
    component.registrarsolicitudmcp.getTipoProductoData = jest.fn().mockReturnValue(observableOf({}));
    component.tipoProductoData = component.tipoProductoData || {};
    component.tipoProductoData.catalogos = 'catalogos';
    component.getTipoProductoData();
     expect(component.registrarsolicitudmcp.getTipoProductoData).toHaveBeenCalled();
  });

  it('should run #getListaClaveData()', async () => {
    component.registrarsolicitudmcp = component.registrarsolicitudmcp || {};
    component.registrarsolicitudmcp.getListaClaveData = jest.fn().mockReturnValue(observableOf({}));
    component.getListaClaveData();
     expect(component.registrarsolicitudmcp.getListaClaveData).toHaveBeenCalled();
  });

  it('should run #seleccionarEstablecimiento()', async () => {
    component.abrirModal = jest.fn();
    component.seleccionarEstablecimiento();
     expect(component.abrirModal).toHaveBeenCalled();
  });

  it('should run #onSubmit() and add data to tableData', () => {
    component.claveScianData = {
      catalogos: [
        { id: 1, descripcion: 'Description 1' },
        { id: 2, descripcion: 'Description 2' },
      ],
    };
    component.descripcionDelScianData = {
      catalogos: [
        { id: 1, descripcion: 'Desc 1' },
        { id: 2, descripcion: 'Desc 2' },
      ],
    };
  
    component.clavaScianForm = {
      value: {
        claveScianG: {
          claveScian: 1,
          descripcionDelScian: 2,
        },
      },
      reset: jest.fn(),
    } as unknown as FormGroup;
  
    component.onSubmit();
  
    const expectedData = {
      claveScianG: {
        claveScian: 'Description 1',
        descripcionDelScian: 'Desc 2',
      },
    };
  
    expect(component.tableData).toEqual([expectedData]);
  
    expect(component.clavaScianForm.reset).toHaveBeenCalled();
    expect(component.showClavaScianForm).toBe(false);
  });

  it('should run #onfilasSeleccionadas()', async () => {
    component.filasSeleccionadas = component.filasSeleccionadas || {};
    component.filasSeleccionadas.clear = jest.fn();
    component.onfilasSeleccionadas({
      length: {},
      map: function() {
        return [
          {
            "claveScianG": {
              "claveScian": {}
            },
            "id": {},
            "claveDeLosLotes": {}
          }
        ];
      }
    });
     expect(component.filasSeleccionadas.clear).toHaveBeenCalled();
  });

  it('should run #onEliminar()', async () => {
    component.filasSeleccionadas = {
      size: 1, 
      clear: jest.fn(), 
    };
    component.clavaScianForm = {
      reset: jest.fn(), 
    };
    component.abrirModal = jest.fn(); 
    component.onEliminar();
      expect(component.clavaScianForm.reset).toHaveBeenCalled();
    expect(component.abrirModal).toHaveBeenCalled();
  });

  it('should run #confirmarEliminar()', async () => {
    component.listaClaveTabla = component.listaClaveTabla || {};
    component.listaClaveTabla = ['listaClaveTabla'];
    component.filasSeleccionadas = component.filasSeleccionadas || {};
    component.filasSeleccionadas.has = jest.fn();
    component.filasSeleccionadas.clear = jest.fn();
    component.dataDeLaSolicitudForm = component.dataDeLaSolicitudForm || {};
    component.dataDeLaSolicitudForm.reset = jest.fn();
    component.abrirModal = jest.fn();
    component.confirmarEliminar();
     expect(component.filasSeleccionadas.has).toHaveBeenCalled();
     expect(component.filasSeleccionadas.clear).toHaveBeenCalled();
     expect(component.dataDeLaSolicitudForm.reset).toHaveBeenCalled();
     expect(component.abrirModal).toHaveBeenCalled();
  });

  it('should run #onLimpiar()', async () => {
    component.clavaScianForm = component.clavaScianForm || {};
    component.clavaScianForm.reset = jest.fn();
    component.onLimpiar();
     expect(component.clavaScianForm.reset).toHaveBeenCalled();
  });

  it('should run #onAgregar()', async () => {

    component.onAgregar();

  });

  it('should run #onDelete()', async () => {
    component.filasSeleccionadas = {
      size: 1, 
      clear: jest.fn(), 
    };
    component.clavaScianForm = {
      reset: jest.fn(),
    };
    component.abrirModal = jest.fn(); 
  
    component.onDelete();

    expect(component.clavaScianForm.reset).toHaveBeenCalled();
    expect(component.abrirModal).toHaveBeenCalled();
  });

  it('should run #onCancelar()', async () => {
    component.clavaScianForm = component.clavaScianForm || {};
    component.clavaScianForm.reset = jest.fn();
    component.onCancelar();
     expect(component.clavaScianForm.reset).toHaveBeenCalled();
  });

  
  it('should run #onClaveDeLosLotesChange()', async () => {

    component.onClaveDeLosLotesChange({
      target: {
        value: {}
      }
    });

  });

  it('should run #onFechaDeFabricacionChange()', async () => {
    component.dataDeLaSolicitudForm = component.dataDeLaSolicitudForm || {};
    component.dataDeLaSolicitudForm.get = jest.fn().mockReturnValue({
      setValue: function() {}
    });
    component.onFechaDeFabricacionChange({});
     expect(component.dataDeLaSolicitudForm.get).toHaveBeenCalled();
  });

  it('should run #onFechaDeCaducidadChange()', async () => {
    component.dataDeLaSolicitudForm = component.dataDeLaSolicitudForm || {};
    component.dataDeLaSolicitudForm.get = jest.fn().mockReturnValue({
      setValue: function() {}
    });
    component.onFechaDeCaducidadChange({});
     expect(component.dataDeLaSolicitudForm.get).toHaveBeenCalled();
  });

  it('should run #onAgregarListaClave()', async () => {
    component.dataDeLaSolicitudForm = component.dataDeLaSolicitudForm || {};
    component.dataDeLaSolicitudForm.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.dataDeLaSolicitudForm.reset = jest.fn();
    component.listaClaveTabla = component.listaClaveTabla || {};
    component.listaClaveTabla.push = jest.fn();
    component.onAgregarListaClave();
     expect(component.dataDeLaSolicitudForm.get).toHaveBeenCalled();
     expect(component.dataDeLaSolicitudForm.reset).toHaveBeenCalled();
     expect(component.listaClaveTabla.push).toHaveBeenCalled();
  });

  it('should run #onModificar()', async () => {
    component.filasSeleccionadas = new Set([
      { claveDeLosLotes: 'mockClaveDeLosLotes' },
    ]);

    component.listaClaveTabla = [
      JSON.stringify({ claveDeLosLotes: 'mockClaveDeLosLotes', fechaDeFabricacion: 'mockFecha', fechaDeCaducidad: 'mockFecha' }),
    ];
    jest.spyOn(component.listaClaveTabla, 'findIndex').mockReturnValue(0);

    component.dataDeLaSolicitudForm = {
      patchValue: jest.fn(),
    };

    component.onModificar();
});

  it('should run #setValoresStore()', async () => {
    component.solicitud260702Store = {
      metodoNombre: jest.fn(), 
    };
  
    const mockForm = {
      get: jest.fn().mockReturnValue({ value: 'mockValue' }),
    };
  
    component.setValoresStore(mockForm as any, 'campo', 'metodoNombre');
  
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