
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, of, throwError } from 'rxjs';

import { Component, ChangeDetectorRef } from '@angular/core';
import{DatosdelasolicitudComponent} from './datos-de-la-solicitud.component'
import { FormBuilder } from '@angular/forms';
import { ImportarDeRemediosHerbalsService } from '../../services/importar-de-remedios-herbals.service';
import { Solicitud260919Store } from '../../estados/tramites260919.store';
import { Solicitud260919Query } from '../../estados/tramites260919.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockImportarDeRemediosHerbalsService {
  getSolicitudData = jest.fn().mockReturnValue(observableOf([])); 

}

@Injectable()
class MockSolicitud260919Store {}

@Injectable()
class MockSolicitud260919Query {}

describe('DatosdelasolicitudComponent', () => {
  let fixture: ComponentFixture<DatosdelasolicitudComponent>;
  let component: {
    showClavaScianForm: any; ngOnDestroy: () => void; dataDeLaSolicitudForm: { get?: any; enable?: any; value?: any; reset?: any; patchValue?: any; disable?: any; }; datosDelTramiteRealizar: { patchValue?: any; get?: any; disable?: any; enable?: any; }; solicitud260919Query: { selectSolicitud$?: any; }; createForm: jest.Mock<any, any, any> | (() => void); getEstadosData: jest.Mock<any, any, any> | (() => void); getClaveScianData: jest.Mock<any, any, any> | (() => void); getRegimenalqueData: jest.Mock<any, any, any> | (() => void); getAduanaData: jest.Mock<any, any, any> | (() => void); getMercanciasData: jest.Mock<any, any, any> | (() => void); getClaveDescripcionDelData: jest.Mock<any, any, any> | (() => void); createclaveScianForm: jest.Mock<any, any, any> | (() => void); getTipoProductoData: jest.Mock<any, any, any> | (() => void); getClasificacionDelProductoData: jest.Mock<any, any, any> | (() => void); getEspificarData: jest.Mock<any, any, any> | (() => void); getEstadoFisicoData: jest.Mock<any, any, any> | (() => void); consultaioQuery: { selectConsultaioState$?: any; }; inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; tableData: string[]; filasSeleccionadas: { has?: any; clear?: any; size?: any; }; eliminarPedimento: (arg0: {}) => void; abrirModal: jest.Mock<any, any, any> | (() => void); fb: { group?: any; }; dataDeLaSolicitudState: { tipoOperacion?: any; justification?: any; rfcDel?: any; denominacion?: any; correoElectronico?: any; codigopostal?: any; estado?: any; municipoyalcaldia?: any; localidad?: any; colonia?: any; calle?: any; lada?: any; telefono?: any; avisoDeFuncionamiento?: any; licenciaSanitaria?: any; regimenalque?: any; aduana?: any; rfc?: any; legalRazonSocial?: any; apellidoPaterno?: any; apellidoMaterno?: any; descripcionFraccionArancelaria?: any; cantidadUMT?: any; umt?: any; cantidadUMC?: any; umc?: any; tipoProducto?: any; clasificaionProductos?: any; especificarProducto?: any; nombreProductoEspecifico?: any; denominacionDistintiva?: any; denominacionNombre?: any; estadoFisico?: any; presentacionFarmaceutica?: any; fraccionArancelaria?: any; formaFarmaceutica?: any; numeroDeRegistroSanitario?: any; fechadepago?: any; cumplocon?: any; hacerlosRadioOptions?: any; }; solicitud260919Store: { setFechadePago?: any; metodoNombre?: any; }; seleccionarFechaInicio: (arg0: {}) => void; toggleLicenciaSanitaria: () => void; changeEvent: () => void; importarDeRemediosHerbals: { getEstadosData?: any; getClaveScianData?: any; getClasificacionDelProductoData?: any; getEspificarData?: any; getMercanciasData?: any; getEstadoFisicoData?: any; getRegimenalqueData?: any; getAduanaData?: any; getSolicitudData?: any; getClaveDescripcionDelData?: any; getTipoProductoData?: any; }; estadoData: { catalogos?: any; }; claveScianData: { catalogos?: any; }; delProducto: { catalogos?: any; }; especificarData: { catalogos?: any; }; estadoFisicoData: { catalogos?: any; }; regimenalqueData: { catalogos?: any; }; aduanaData: { catalogos?: any; }; aceptar: () => void; seleccionarEstablecimiento: () => void; getSolicitudData: () => void; onAdd: () => void; descripcionDelScianData: { catalogos?: any; }; tipoProductoData: { catalogos?: any; }; paisOrigenColapsable: () => void; paisProcedencis_colapsable: () => void; usoEspecificoColapsable: () => void; onfilasSeleccionadas: (arg0: { length: {}; map: () => { claveScianG: { claveScian: {}; }; id: {}; }[]; }) => void; clavaScianForm: { reset?: any; value?: any; disable?: any; enable?: any; }; onDelete: () => void; onAgregar: () => void; onSubmit: () => void; onCancelar: () => void; onLimpiar: () => void; mercanciasData: string[]; onSave: () => void; onModificar: () => void; onEliminar: () => void; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; destroyed$: { next?: any; complete?: any; }; 
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,DatosdelasolicitudComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: ImportarDeRemediosHerbalsService, useClass: MockImportarDeRemediosHerbalsService },
        ChangeDetectorRef,
        { provide: Solicitud260919Store, useClass: MockSolicitud260919Store },
        { provide: Solicitud260919Query, useClass: MockSolicitud260919Query },
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
    component.solicitud260919Query = component.solicitud260919Query || {};
    component.solicitud260919Query.selectSolicitud$ = observableOf({});
    component.createForm = jest.fn();
    component.getEstadosData = jest.fn();
    component.getClaveScianData = jest.fn();
    component.getRegimenalqueData = jest.fn();
    component.getAduanaData = jest.fn();
    component.getMercanciasData = jest.fn();
    component.getClaveDescripcionDelData = jest.fn();
    component.createclaveScianForm = jest.fn();
    component.getTipoProductoData = jest.fn();
    component.getClasificacionDelProductoData = jest.fn();
    component.getEspificarData = jest.fn();
    component.getEstadoFisicoData = jest.fn();
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
     expect(component.createForm).toHaveBeenCalled();
     expect(component.getEstadosData).toHaveBeenCalled();
     expect(component.getClaveScianData).toHaveBeenCalled();
     expect(component.getRegimenalqueData).toHaveBeenCalled();
     expect(component.getAduanaData).toHaveBeenCalled();
     expect(component.getMercanciasData).toHaveBeenCalled();
     expect(component.getClaveDescripcionDelData).toHaveBeenCalled();
     expect(component.createclaveScianForm).toHaveBeenCalled();
     expect(component.getTipoProductoData).toHaveBeenCalled();
     expect(component.getClasificacionDelProductoData).toHaveBeenCalled();
     expect(component.getEspificarData).toHaveBeenCalled();
     expect(component.getEstadoFisicoData).toHaveBeenCalled();
     expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #eliminarPedimento()', async () => {
    component.tableData = component.tableData || {};
    component.tableData = ['tableData'];
    component.filasSeleccionadas = component.filasSeleccionadas || {};
    component.filasSeleccionadas.has = jest.fn();
    component.filasSeleccionadas.clear = jest.fn();
    component.eliminarPedimento({});
     expect(component.filasSeleccionadas.has).toHaveBeenCalled();
     expect(component.filasSeleccionadas.clear).toHaveBeenCalled();
  });

  it('should run #abrirModal()', async () => {
    component.filasSeleccionadas = new Set([{ id: 1 }]); 
    component.abrirModal();
      expect(component.filasSeleccionadas.size).toBeGreaterThan(0);
  });

  it('should run #createForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.dataDeLaSolicitudState = component.dataDeLaSolicitudState || {};
    component.dataDeLaSolicitudState.tipoOperacion = 'tipoOperacion';
    component.dataDeLaSolicitudState.justification = 'justification';
    component.dataDeLaSolicitudState.rfcDel = 'rfcDel';
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
    component.dataDeLaSolicitudState.descripcionFraccionArancelaria = 'descripcionFraccionArancelaria';
    component.dataDeLaSolicitudState.cantidadUMT = 'cantidadUMT';
    component.dataDeLaSolicitudState.umt = 'umt';
    component.dataDeLaSolicitudState.cantidadUMC = 'cantidadUMC';
    component.dataDeLaSolicitudState.umc = 'umc';
    component.dataDeLaSolicitudState.tipoProducto = 'tipoProducto';
    component.dataDeLaSolicitudState.clasificaionProductos = 'clasificaionProductos';
    component.dataDeLaSolicitudState.especificarProducto = 'especificarProducto';
    component.dataDeLaSolicitudState.nombreProductoEspecifico = 'nombreProductoEspecifico';
    component.dataDeLaSolicitudState.denominacionDistintiva = 'denominacionDistintiva';
    component.dataDeLaSolicitudState.denominacionNombre = 'denominacionNombre';
    component.dataDeLaSolicitudState.estadoFisico = 'estadoFisico';
    component.dataDeLaSolicitudState.presentacionFarmaceutica = 'presentacionFarmaceutica';
    component.dataDeLaSolicitudState.fraccionArancelaria = 'fraccionArancelaria';
    component.dataDeLaSolicitudState.formaFarmaceutica = 'formaFarmaceutica';
    component.dataDeLaSolicitudState.numeroDeRegistroSanitario = 'numeroDeRegistroSanitario';
    component.dataDeLaSolicitudState.fechadepago = 'fechadepago';
    component.dataDeLaSolicitudState.cumplocon = 'cumplocon';
    component.dataDeLaSolicitudState.hacerlosRadioOptions = 'hacerlosRadioOptions';
    component.createForm();
     expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #createclaveScianForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.createclaveScianForm();
     expect(component.fb.group).toHaveBeenCalled();
  });
  it('should run #seleccionarFechaInicio() and set the payment date', () => {
   
    component.dataDeLaSolicitudForm = {
      get: jest.fn().mockReturnValue({
        patchValue: jest.fn(),
      }),
    } as unknown as FormGroup;
  
  
    component.solicitud260919Store = {
      setFechadePago: jest.fn(),
    } as unknown as Solicitud260919Store;
  
    const testDate = '2025-06-23';
    component.seleccionarFechaInicio(testDate);
  
    expect(component.dataDeLaSolicitudForm.get).toHaveBeenCalledWith('datosDelTramiteRealizar');
    expect(component.dataDeLaSolicitudForm.get('datosDelTramiteRealizar')?.patchValue).toHaveBeenCalledWith({
      fechadepago: testDate,
    });
  
    expect(component.solicitud260919Store.setFechadePago).toHaveBeenCalledWith(testDate);
  });
  
  it('should run #toggleLicenciaSanitaria()', async () => {
    component.dataDeLaSolicitudForm = component.dataDeLaSolicitudForm || {};
    component.dataDeLaSolicitudForm.get = jest.fn().mockReturnValue({
      enable: function() {},
      disable: function() {}
    });
    component.toggleLicenciaSanitaria();
     expect(component.dataDeLaSolicitudForm.get).toHaveBeenCalled();
  });

  it('should run #changeEvent()', async () => {
    component.dataDeLaSolicitudForm = component.dataDeLaSolicitudForm || {};
    component.dataDeLaSolicitudForm.get = jest.fn().mockReturnValue({
      setValue: function() {},
      disable: function() {},
      enable: function() {}
    });
    component.changeEvent();
     expect(component.dataDeLaSolicitudForm.get).toHaveBeenCalled();
  });

  it('should run #getEstadosData()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getEstadosData = jest.fn().mockReturnValue(observableOf({}));
    component.estadoData = component.estadoData || {};
    component.estadoData.catalogos = 'catalogos';
    component.getEstadosData();
     expect(component.importarDeRemediosHerbals.getEstadosData).toHaveBeenCalled();
  });

  it('should run #getClaveScianData()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getClaveScianData = jest.fn().mockReturnValue(observableOf({}));
    component.claveScianData = component.claveScianData || {};
    component.claveScianData.catalogos = 'catalogos';
    component.getClaveScianData();
     expect(component.importarDeRemediosHerbals.getClaveScianData).toHaveBeenCalled();
  });

  it('should run #getClasificacionDelProductoData()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getClasificacionDelProductoData = jest.fn().mockReturnValue(observableOf({}));
    component.delProducto = component.delProducto || {};
    component.delProducto.catalogos = 'catalogos';
    component.getClasificacionDelProductoData();
     expect(component.importarDeRemediosHerbals.getClasificacionDelProductoData).toHaveBeenCalled();
  });

  it('should run #getEspificarData()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getEspificarData = jest.fn().mockReturnValue(observableOf({}));
    component.especificarData = component.especificarData || {};
    component.especificarData.catalogos = 'catalogos';
    component.getEspificarData();
     expect(component.importarDeRemediosHerbals.getEspificarData).toHaveBeenCalled();
  });

  it('should run #getMercanciasData()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getMercanciasData = jest.fn().mockReturnValue(observableOf({}));
    component.getMercanciasData();
     expect(component.importarDeRemediosHerbals.getMercanciasData).toHaveBeenCalled();
  });

  it('should run #getEstadoFisicoData()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getEstadoFisicoData = jest.fn().mockReturnValue(observableOf({}));
    component.estadoFisicoData = component.estadoFisicoData || {};
    component.estadoFisicoData.catalogos = 'catalogos';
    component.getEstadoFisicoData();
     expect(component.importarDeRemediosHerbals.getEstadoFisicoData).toHaveBeenCalled();
  });

  it('should run #getRegimenalqueData()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getRegimenalqueData = jest.fn().mockReturnValue(observableOf({}));
    component.regimenalqueData = component.regimenalqueData || {};
    component.regimenalqueData.catalogos = 'catalogos';
    component.getRegimenalqueData();
     expect(component.importarDeRemediosHerbals.getRegimenalqueData).toHaveBeenCalled();
  });

  it('should run #getAduanaData()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getAduanaData = jest.fn().mockReturnValue(observableOf({}));
    component.aduanaData = component.aduanaData || {};
    component.aduanaData.catalogos = 'catalogos';
    component.getAduanaData();
     expect(component.importarDeRemediosHerbals.getAduanaData).toHaveBeenCalled();
  });

  it('should run #aceptar()', async () => {
    component.dataDeLaSolicitudForm = component.dataDeLaSolicitudForm || {};
    component.dataDeLaSolicitudForm.enable = jest.fn();
    component.aceptar();
     expect(component.dataDeLaSolicitudForm.enable).toHaveBeenCalled();
  });

  it('should run #seleccionarEstablecimiento()', async () => {
    component.abrirModal = jest.fn();
    component.seleccionarEstablecimiento();
     expect(component.abrirModal).toHaveBeenCalled();
  });
  it('should run #getSolicitudData() and patch form values', () => {
    const mockSolicitudData = [
      {
        nombreORazónSocial: 'Mock Razon Social',
        apellidoPaterno: 'Mock Paterno',
        apellidoMaterno: 'Mock Materno',
      },
    ];
    jest.spyOn(component.importarDeRemediosHerbals, 'getSolicitudData').mockReturnValue({
      subscribe: (callback: (data: any) => void) => callback(mockSolicitudData),
    });
  
    component.dataDeLaSolicitudForm = {
      get: jest.fn().mockReturnValue({
        patchValue: jest.fn(),
        disable: jest.fn(),
        get: jest.fn().mockReturnValue({
          disable: jest.fn(),
        }),
      }),
    } as unknown as FormGroup;
  
    component.getSolicitudData();
  
   expect(component.dataDeLaSolicitudForm.get).toHaveBeenCalledWith('datosDelTramiteRealizar');
    expect(component.dataDeLaSolicitudForm.get('datosDelTramiteRealizar')?.patchValue).toHaveBeenCalledWith({
      legalRazonSocial: 'Mock Razon Social',
      apellidoPaterno: 'Mock Paterno',
      apellidoMaterno: 'Mock Materno',
    });
  
    expect(component.dataDeLaSolicitudForm.get('datosDelTramiteRealizar')?.get('legalRazonSocial')?.disable).toHaveBeenCalled();
    expect(component.dataDeLaSolicitudForm.get('datosDelTramiteRealizar')?.get('apellidoPaterno')?.disable).toHaveBeenCalled();
    expect(component.dataDeLaSolicitudForm.get('datosDelTramiteRealizar')?.get('apellidoMaterno')?.disable).toHaveBeenCalled();
  });
  it('should run #onAdd()', async () => {

    component.onAdd();

  });

  it('should run #getClaveDescripcionDelData()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getClaveDescripcionDelData = jest.fn().mockReturnValue(observableOf({}));
    component.descripcionDelScianData = component.descripcionDelScianData || {};
    component.descripcionDelScianData.catalogos = 'catalogos';
    component.getClaveDescripcionDelData();
     expect(component.importarDeRemediosHerbals.getClaveDescripcionDelData).toHaveBeenCalled();
  });

  it('should run #getTipoProductoData()', async () => {
    component.importarDeRemediosHerbals = component.importarDeRemediosHerbals || {};
    component.importarDeRemediosHerbals.getTipoProductoData = jest.fn().mockReturnValue(observableOf({}));
    component.tipoProductoData = component.tipoProductoData || {};
    component.tipoProductoData.catalogos = 'catalogos';
    component.getTipoProductoData();
     expect(component.importarDeRemediosHerbals.getTipoProductoData).toHaveBeenCalled();
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
            "id": {}
          }
        ];
      }
    });
     expect(component.filasSeleccionadas.clear).toHaveBeenCalled();
  });

  it('should run #onDelete()', async () => {
    const mockItem = { id: 1 };
    component.filasSeleccionadas = new Set([mockItem]);
  
    component.clavaScianForm = {
      reset: jest.fn(),
    };
    component.abrirModal = jest.fn();
  
    component.onDelete();
  
    expect(component.clavaScianForm.reset).toHaveBeenCalled();
    expect(component.abrirModal).toHaveBeenCalled();
  });

  it('should run #onAgregar()', async () => {

    component.onAgregar();

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

  it('should run #onCancelar()', async () => {
    component.clavaScianForm = component.clavaScianForm || {};
    component.clavaScianForm.reset = jest.fn();
    component.onCancelar();
     expect(component.clavaScianForm.reset).toHaveBeenCalled();
  });

  it('should run #onLimpiar()', async () => {
    component.clavaScianForm = component.clavaScianForm || {};
    component.clavaScianForm.reset = jest.fn();
    component.onLimpiar();
     expect(component.clavaScianForm.reset).toHaveBeenCalled();
  });

  it('should run #onSave()', async () => {
    component.dataDeLaSolicitudForm = component.dataDeLaSolicitudForm || {};
    component.dataDeLaSolicitudForm.value = 'value';
    component.dataDeLaSolicitudForm.reset = jest.fn();
    component.tipoProductoData = component.tipoProductoData || {};
    component.tipoProductoData.catalogos = {
      find: function() {
        return [
          {
            "id": {}
          }
        ];
      }
    };
    component.delProducto = component.delProducto || {};
    component.delProducto.catalogos = {
      find: function() {
        return [
          {
            "id": {}
          }
        ];
      }
    };
    component.especificarData = component.especificarData || {};
    component.especificarData.catalogos = {
      find: function() {
        return [
          {
            "id": {}
          }
        ];
      }
    };
    component.estadoFisicoData = component.estadoFisicoData || {};
    component.estadoFisicoData.catalogos = {
      find: function() {
        return [
          {
            "id": {}
          }
        ];
      }
    };
    component.mercanciasData = component.mercanciasData || {};
    component.mercanciasData.push = jest.fn();
    component.onSave();
     expect(component.dataDeLaSolicitudForm.reset).toHaveBeenCalled();
     expect(component.mercanciasData.push).toHaveBeenCalled();
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