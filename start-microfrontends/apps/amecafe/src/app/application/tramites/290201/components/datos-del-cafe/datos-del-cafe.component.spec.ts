
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component, ChangeDetectorRef } from '@angular/core';
import { DatosDelCafeComponent } from './datos-del-cafe.component';
import { RegistrarSolicitudService } from '../../services/registrar-solicitud.service';
import { FormBuilder } from '@angular/forms';
import { Solicitud290201Store } from '../../../../estados/tramites/tramites290201.store';
import { Solicitud290201Query } from '../../../../estados/queries/tramites290201.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import {  } from 'ngx-toastr';

@Injectable()
class MockRegistrarSolicitudService {
  getEnvasadoenData = jest.fn().mockReturnValue(observableOf({}));
  getUtilicoCafeComoData = jest.fn().mockReturnValue(observableOf({}));
  getPaisDeImportacionData = jest.fn().mockReturnValue(observableOf({}));
  getFraccionArancelariaData = jest.fn().mockReturnValue(observableOf({}));
  getUnidadDeMedidaData = jest.fn().mockReturnValue(observableOf({}));
  getDollarData = jest.fn().mockReturnValue(observableOf({}));
  getMediaDeTransporte = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockSolicitud290201Store {}

@Injectable()
class MockSolicitud290201Query {}


describe('DatosDelCafeComponent', () => {
  let fixture: ComponentFixture<DatosDelCafeComponent>;
  let component: {
    esFormularioVisible(esFormularioVisible: any): unknown;
    esFormularioSoloLectura: boolean; ngOnDestroy: () => void; dataCafeForm: { get?: any; value?: any; patchValue?: any; reset?: any; disable?: any; enable?: any; }; destinatarioForm: FormGroup; datosDelTramiteRealizar: { patchValue?: any; }; solicitud290201Store: { setFechaexportacion?: any; metodoNombre?: any; }; cambioFechaFinal: (arg0: {}) => void; fb: { group?: any; }; dataCafeState: { envasadoen?: any; utilizoCafeComo?: any; cantidadutilizada?: any; numerodepedimento?: any; paisdeimportacion?: any; fraccionarancelaria?: any; cantidad?: any; unidaddemedida?: any; precioapplicable?: any; dolar?: any; lote?: any; otrasmarcas?: any; elcafe?: any; fechaexportacion?: any; paisdetransbordo?: any; mediodetransporte?: any; Identificadordel?: any; observaciones?: any; }; createForm: jest.Mock<any, any, any> | (() => void); solicitud290201Query: { selectSolicitud$?: any; }; consultaioQuery: { selectConsultaioState$?: any; }; inicializarEstadoFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; registrarsolicitud: { getEnvasadoenData?: any; getUtilicoCafeComoData?: any; getPaisDeImportacionData?: any; getFraccionArancelariaData?: any; getUnidadDeMedidaData?: any; getDollarData?: any; getMediaDeTransporte?: any; }; envasadoenData: { catalogos?: any; }; getEnvasadoenData: () => void; utilizoCafeComoData: { catalogos?: any; }; getUtilicoCafeComoData: () => void; paisdeimportacionData: { catalogos?: any; }; getPaisDeImportacionData: () => void; fraccionarancelariaData: { catalogos?: any; }; getFraccionArancelariaData: () => void; unidaddemedidaData: { catalogos?: any; }; getUnidadDeMedidaData: () => void; dolarData: { catalogos?: any; }; getDollarData: () => void; elcafeData: { catalogos?: any; }; getElcafeData: () => void; paisdetransbordoData: { catalogos?: any; }; getPaisDeTransbordoData: () => void; mediodetransporteData: { catalogos?: any; }; getMediaDeTransporte: () => void; tableData: string[]; onSubmit: () => void; onAgregar: () => void; onRowClick: (arg0: { datosDelTramiteRealizar: { envasadoen: {}; utilizoCafeComo: {}; paisdeimportacion: {}; fraccionarancelaria: {}; unidaddemedida: {}; dolar: {}; elcafe: {}; paisdetransbordo: {}; mediodetransporte: {}; }; }) => void; selectedRows: { size?: any; has?: any; clear?: any; }; onDeleteSelectedRows: () => void; onSelectedRowsChange: (arg0: { id: {}; }[]) => void; setValoresStore: (arg0: { get: () => { value: {}; }; }, arg1: {}, arg2: {}) => void; destroyed$: { next?: any; complete?: any; }; 
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      
      imports: [ FormsModule, ReactiveFormsModule,DatosDelCafeComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: RegistrarSolicitudService, useClass: MockRegistrarSolicitudService },
        FormBuilder,
        { provide: Solicitud290201Store, useClass: MockSolicitud290201Store },
        { provide: Solicitud290201Query, useClass: MockSolicitud290201Query },
        ChangeDetectorRef,
        ConsultaioQuery
      ]
    }).overrideComponent(DatosDelCafeComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosDelCafeComponent);
    component = fixture.debugElement.componentInstance;

    component.registrarsolicitud = {
      getEnvasadoenData: jest.fn().mockReturnValue(observableOf({})),
      getUtilicoCafeComoData: jest.fn().mockReturnValue(observableOf({})),
      getPaisDeImportacionData: jest.fn().mockReturnValue(observableOf({})),
      getFraccionArancelariaData: jest.fn().mockReturnValue(observableOf({})),
      getUnidadDeMedidaData: jest.fn().mockReturnValue(observableOf({})),
      getDollarData: jest.fn().mockReturnValue(observableOf({})),
      getMediaDeTransporte: jest.fn().mockReturnValue(observableOf({})),
    };
  
    component.destroyed$ = {
      next: jest.fn(),
      complete: jest.fn(),
    };

    component.destinatarioForm = {
      reset: jest.fn(),
    } as unknown as FormGroup;
  });

 afterEach(() => {
  if (component) {
    component.destroyed$ = component.destroyed$ || {
      next: jest.fn(),
      complete: jest.fn(),
    };

    if (component.ngOnDestroy) {
      component.ngOnDestroy();
    }
  }
  fixture.destroy();
});

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #datosDelTramiteRealizar', async () => {
    component.dataCafeForm = component.dataCafeForm || {};
    component.dataCafeForm.get = jest.fn();
    const datosDelTramiteRealizar = component.datosDelTramiteRealizar;
     expect(component.dataCafeForm.get).toHaveBeenCalled();
  });
  it('should run #cambioFechaFinal()', async () => {
    component.dataCafeForm = {
      get: jest.fn().mockReturnValue({
        patchValue: jest.fn(),
      }),
    } as any;
  
    component.solicitud290201Store = {
      setFechaexportacion: jest.fn(),
    } as any;
  
    const newDate = '2025-06-24';
    component.cambioFechaFinal(newDate);
  
    expect(component.dataCafeForm.get).toHaveBeenCalledWith('datosDelTramiteRealizar');
    expect(component.dataCafeForm.get('datosDelTramiteRealizar')?.patchValue).toHaveBeenCalledWith({
      fechaexportacion: newDate,
    });
    expect(component.solicitud290201Store.setFechaexportacion).toHaveBeenCalledWith(newDate);
  });

  it('should run #createForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.dataCafeState = component.dataCafeState || {};
    component.dataCafeState.envasadoen = 'envasadoen';
    component.dataCafeState.utilizoCafeComo = 'utilizoCafeComo';
    component.dataCafeState.cantidadutilizada = 'cantidadutilizada';
    component.dataCafeState.numerodepedimento = 'numerodepedimento';
    component.dataCafeState.paisdeimportacion = 'paisdeimportacion';
    component.dataCafeState.fraccionarancelaria = 'fraccionarancelaria';
    component.dataCafeState.cantidad = 'cantidad';
    component.dataCafeState.unidaddemedida = 'unidaddemedida';
    component.dataCafeState.precioapplicable = 'precioapplicable';
    component.dataCafeState.dolar = 'dolar';
    component.dataCafeState.lote = 'lote';
    component.dataCafeState.otrasmarcas = 'otrasmarcas';
    component.dataCafeState.elcafe = 'elcafe';
    component.dataCafeState.fechaexportacion = 'fechaexportacion';
    component.dataCafeState.paisdetransbordo = 'paisdetransbordo';
    component.dataCafeState.mediodetransporte = 'mediodetransporte';
    component.dataCafeState.Identificadordel = 'Identificadordel';
    component.dataCafeState.observaciones = 'observaciones';
    component.createForm();
     expect(component.fb.group).toHaveBeenCalled();
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

  it('should run #getEnvasadoenData()', async () => {
    component.registrarsolicitud = {
      getEnvasadoenData: jest.fn().mockReturnValue(observableOf({})),
    };
    component.envasadoenData = { catalogos: [] };
    component.getEnvasadoenData();
    expect(component.registrarsolicitud.getEnvasadoenData).toHaveBeenCalled();
  });

  it('should run #getUtilicoCafeComoData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getUtilicoCafeComoData = jest.fn().mockReturnValue(observableOf({}));
    component.utilizoCafeComoData = component.utilizoCafeComoData || {};
    component.utilizoCafeComoData.catalogos = 'catalogos';
    component.getUtilicoCafeComoData();
     expect(component.registrarsolicitud.getUtilicoCafeComoData).toHaveBeenCalled();
  });

  it('should run #getPaisDeImportacionData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getPaisDeImportacionData = jest.fn().mockReturnValue(observableOf({}));
    component.paisdeimportacionData = component.paisdeimportacionData || {};
    component.paisdeimportacionData.catalogos = 'catalogos';
    component.getPaisDeImportacionData();
     expect(component.registrarsolicitud.getPaisDeImportacionData).toHaveBeenCalled();
  });

  it('should run #getFraccionArancelariaData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getFraccionArancelariaData = jest.fn().mockReturnValue(observableOf({}));
    component.fraccionarancelariaData = component.fraccionarancelariaData || {};
    component.fraccionarancelariaData.catalogos = 'catalogos';
    component.getFraccionArancelariaData();
     expect(component.registrarsolicitud.getFraccionArancelariaData).toHaveBeenCalled();
  });

  it('should run #getUnidadDeMedidaData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getUnidadDeMedidaData = jest.fn().mockReturnValue(observableOf({}));
    component.unidaddemedidaData = component.unidaddemedidaData || {};
    component.unidaddemedidaData.catalogos = 'catalogos';
    component.destroyed$ = {
      next: jest.fn(),
      complete: jest.fn(),
    }; 
    component.getUnidadDeMedidaData();
    expect(component.registrarsolicitud.getUnidadDeMedidaData).toHaveBeenCalled();
  });
  it('should run #getDollarData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getDollarData = jest.fn().mockReturnValue(observableOf({}));
    component.dolarData = component.dolarData || {};
    component.dolarData.catalogos = 'catalogos';
    component.getDollarData();
     expect(component.registrarsolicitud.getDollarData).toHaveBeenCalled();
  });

  it('should run #getElcafeData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getUtilicoCafeComoData = jest.fn().mockReturnValue(observableOf({}));
    component.elcafeData = component.elcafeData || {};
    component.elcafeData.catalogos = 'catalogos';
    component.getElcafeData();
     expect(component.registrarsolicitud.getUtilicoCafeComoData).toHaveBeenCalled();
  });

  it('should run #getPaisDeTransbordoData()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getPaisDeImportacionData = jest.fn().mockReturnValue(observableOf({}));
    component.paisdetransbordoData = component.paisdetransbordoData || {};
    component.paisdetransbordoData.catalogos = 'catalogos';
    component.getPaisDeTransbordoData();
     expect(component.registrarsolicitud.getPaisDeImportacionData).toHaveBeenCalled();
  });

  it('should run #getMediaDeTransporte()', async () => {
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getMediaDeTransporte = jest.fn().mockReturnValue(observableOf({}));
    component.mediodetransporteData = component.mediodetransporteData || {};
    component.mediodetransporteData.catalogos = 'catalogos';
    component.getMediaDeTransporte();
     expect(component.registrarsolicitud.getMediaDeTransporte).toHaveBeenCalled();
  });

  it('should run #onSubmit()', async () => {
    component.dataCafeForm = {
      value: {
        datosDelTramiteRealizar: {
          envasadoen: '1',
          utilizoCafeComo: '2',
          paisdeimportacion: '3',
          fraccionarancelaria: '4',
          unidaddemedida: '5',
          dolar: '6',
          elcafe: '7',
          paisdetransbordo: '8',
          mediodetransporte: '9',
        },
      },
    } as any;
  
    component.envasadoenData = {
      catalogos: [{ id: '1', descripcion: 'Envasado Mock' }],
    };
    component.utilizoCafeComoData = {
      catalogos: [{ id: '2', descripcion: 'Utilizó Café Mock' }],
    };
    component.paisdeimportacionData = {
      catalogos: [{ id: '3', descripcion: 'País Mock' }],
    };
    component.fraccionarancelariaData = {
      catalogos: [{ id: '4', descripcion: 'Fracción Mock' }],
    };
    component.unidaddemedidaData = {
      catalogos: [{ id: '5', descripcion: 'Unidad Mock' }],
    };
    component.dolarData = {
      catalogos: [{ id: '6', descripcion: 'Dólar Mock' }],
    };
    component.elcafeData = {
      catalogos: [{ id: '7', descripcion: 'El Café Mock' }],
    };
    component.paisdetransbordoData = {
      catalogos: [{ id: '8', descripcion: 'Transbordo Mock' }],
    };
    component.mediodetransporteData = {
      catalogos: [{ id: '9', descripcion: 'Transporte Mock' }],
    };
  
    component.tableData = [];
    const pushSpy = jest.spyOn(component.tableData, 'push');
  
    component.onSubmit();
  
    expect(pushSpy).toHaveBeenCalledWith({
      datosDelTramiteRealizar: {
        envasadoen: 'Envasado Mock',
        utilizoCafeComo: 'Utilizó Café Mock',
        paisdeimportacion: 'País Mock',
        fraccionarancelaria: 'Fracción Mock',
        unidaddemedida: 'Unidad Mock',
        dolar: 'Dólar Mock',
        elcafe: 'El Café Mock',
        paisdetransbordo: 'Transbordo Mock',
        mediodetransporte: 'Transporte Mock',
      },
    });
    expect(component.esFormularioVisible).toBe(false);
  });

  it('should run #onAgregar()', async () => {

    component.onAgregar();

  });

  it('should run #onRowClick()', async () => {
    component.dataCafeForm = component.dataCafeForm || {};
    component.dataCafeForm.patchValue = jest.fn();
    component.envasadoenData = component.envasadoenData || {};
    component.envasadoenData.catalogos = {
      find: function() {
        return [
          {
            "descripcion": {}
          }
        ];
      }
    };
    component.utilizoCafeComoData = component.utilizoCafeComoData || {};
    component.utilizoCafeComoData.catalogos = {
      find: function() {
        return [
          {
            "descripcion": {}
          }
        ];
      }
    };
    component.paisdeimportacionData = component.paisdeimportacionData || {};
    component.paisdeimportacionData.catalogos = {
      find: function() {
        return [
          {
            "descripcion": {}
          }
        ];
      }
    };
    component.fraccionarancelariaData = component.fraccionarancelariaData || {};
    component.fraccionarancelariaData.catalogos = {
      find: function() {
        return [
          {
            "descripcion": {}
          }
        ];
      }
    };
    component.unidaddemedidaData = component.unidaddemedidaData || {};
    component.unidaddemedidaData.catalogos = {
      find: function() {
        return [
          {
            "descripcion": {}
          }
        ];
      }
    };
    component.dolarData = component.dolarData || {};
    component.dolarData.catalogos = {
      find: function() {
        return [
          {
            "descripcion": {}
          }
        ];
      }
    };
    component.elcafeData = component.elcafeData || {};
    component.elcafeData.catalogos = {
      find: function() {
        return [
          {
            "descripcion": {}
          }
        ];
      }
    };
    component.paisdetransbordoData = component.paisdetransbordoData || {};
    component.paisdetransbordoData.catalogos = {
      find: function() {
        return [
          {
            "descripcion": {}
          }
        ];
      }
    };
    component.mediodetransporteData = component.mediodetransporteData || {};
    component.mediodetransporteData.catalogos = {
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
        envasadoen: {},
        utilizoCafeComo: {},
        paisdeimportacion: {},
        fraccionarancelaria: {},
        unidaddemedida: {},
        dolar: {},
        elcafe: {},
        paisdetransbordo: {},
        mediodetransporte: {}
      }
    });
     expect(component.dataCafeForm.patchValue).toHaveBeenCalled();
  });
  it('should run #onDeleteSelectedRows()', async () => {
    component.selectedRows = new Set([1, 2]);
  
    component.tableData = [
      { id: 1, name: 'row1' },
      { id: 2, name: 'row2' },
      { id: 3, name: 'row3' },
    ] as any[];
  
    component.dataCafeForm = {
      reset: jest.fn(),
    } as unknown as FormGroup;
  
    component.onDeleteSelectedRows();
  
    expect(component.tableData).toEqual([{ id: 3, name: 'row3' }]); 
    expect(component.selectedRows.size).toBe(0);
    expect(component.dataCafeForm.reset).toHaveBeenCalled(); 
    expect(component.esFormularioVisible).toBe(false); 
  });
  it('should run #onSelectedRowsChange()', async () => {

    component.onSelectedRowsChange([{
      id: {}
    }]);

  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.dataCafeForm = {
      disable: jest.fn(),
      enable: jest.fn(),
    };
  
    component.esFormularioSoloLectura = true;
  
    component.inicializarEstadoFormulario();
  
    expect(component.dataCafeForm.disable).toHaveBeenCalled();
    expect(component.dataCafeForm.enable).not.toHaveBeenCalled();
  
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
  
    expect(component.dataCafeForm.enable).toHaveBeenCalled();
  });

  it('should run #setValoresStore()', async () => {
    component.destroyed$ = {
      next: jest.fn(),
      complete: jest.fn(),
    };
  
    component.solicitud290201Store = component.solicitud290201Store || {};
    component.solicitud290201Store.metodoNombre = jest.fn();
  
    component.setValoresStore(
      {
        get: function () {
          return {
            value: {},
          };
        },
      },
      'campo',
      'metodoNombre' as keyof typeof component.solicitud290201Store
    );
  
    
    expect(component.solicitud290201Store.metodoNombre).toHaveBeenCalled();
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