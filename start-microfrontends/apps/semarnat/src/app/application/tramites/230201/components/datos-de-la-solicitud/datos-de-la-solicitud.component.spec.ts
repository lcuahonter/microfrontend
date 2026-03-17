// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { PhytosanitaryExportacionService } from '../../services/phytosanitary-exportacion.service';
import { Tramite230201Store } from '../../estados/tramite230201.store';
import { Tramite230201Query } from '../../estados/tramite230201.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormBuilder } from '@angular/forms';

@Injectable()
class MockPhytosanitaryExportacionService {}

@Injectable()
class MockTramite230201Store {}

@Injectable()
class MockTramite230201Query {}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('DatosDeLaSolicitudComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DatosDeLaSolicitudComponent, ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: PhytosanitaryExportacionService, useClass: MockPhytosanitaryExportacionService },
        { provide: Tramite230201Store, useClass: MockTramite230201Store },
        { provide: Tramite230201Query, useClass: MockTramite230201Query },
        ConsultaioQuery,
        FormBuilder
      ]
    }).overrideComponent(DatosDeLaSolicitudComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #inicializaCatalogos() and execute all observable pipelines', async () => {
   
    component.phytosanitaryExportacionService.getPaisDeProcedencia = jest.fn().mockReturnValue(
      observableOf({ data: [{ id: 1, descripcion: 'Mexico' }] })
    );
    component.phytosanitaryExportacionService.getAduana = jest.fn().mockReturnValue(
      observableOf({ data: [{ id: 1, descripcion: 'Aduana 1' }] })
    );
    component.phytosanitaryExportacionService.getEntidades = jest.fn().mockReturnValue(
      observableOf({ data: [{ id: 1, descripcion: 'Entidad 1' }] })
    );
    component.phytosanitaryExportacionService.getDescripcionProducto = jest.fn().mockReturnValue(
      observableOf({ data: [{ id: 1, descripcion: 'Producto 1' }] })
    );
    component.phytosanitaryExportacionService.getFraccionArancelaria = jest.fn().mockReturnValue(
      observableOf({ data: [{ id: 1, descripcion: 'Fraccion 1' }] })
    );
    component.phytosanitaryExportacionService.getGenero = jest.fn().mockReturnValue(
      observableOf({ data: [{ id: 1, descripcion: 'Genero 1' }] })
    );
    component.phytosanitaryExportacionService.getEspecie = jest.fn().mockReturnValue(
      observableOf({ data: [{ id: 1, descripcion: 'Especie 1' }] })
    );
    component.phytosanitaryExportacionService.getNombreComun = jest.fn().mockReturnValue(
      observableOf({ data: [{ id: 1, descripcion: 'Nombre 1' }] })
    );
    component.phytosanitaryExportacionService.getUnidadDeMedida = jest.fn().mockReturnValue(
      observableOf({ data: [{ id: 1, descripcion: 'Unidad 1' }] })
    );
    component.phytosanitaryExportacionService.getMedioDeTransporte = jest.fn().mockReturnValue(
      observableOf({ data: [{ id: 1, descripcion: 'Transporte 1' }] })
    );
    component.phytosanitaryExportacionService.getEstado = jest.fn().mockReturnValue(
      observableOf({ data: [{ id: 1, descripcion: 'Estado 1' }] })
    );
    

    component.solicitudForm = {
      patchValue: jest.fn(),
      get: jest.fn().mockReturnValue({
        setControl: jest.fn()
      })
    };
    
    component.inicializaCatalogos();
    
  
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(component.phytosanitaryExportacionService.getPaisDeProcedencia).toHaveBeenCalled();
    expect(component.phytosanitaryExportacionService.getAduana).toHaveBeenCalled();
    expect(component.phytosanitaryExportacionService.getEntidades).toHaveBeenCalled();
    expect(component.phytosanitaryExportacionService.getDescripcionProducto).toHaveBeenCalled();
    expect(component.phytosanitaryExportacionService.getFraccionArancelaria).toHaveBeenCalled();
    expect(component.phytosanitaryExportacionService.getGenero).toHaveBeenCalled();
    expect(component.phytosanitaryExportacionService.getEspecie).toHaveBeenCalled();
    expect(component.phytosanitaryExportacionService.getNombreComun).toHaveBeenCalled();
    expect(component.phytosanitaryExportacionService.getUnidadDeMedida).toHaveBeenCalled();
    expect(component.phytosanitaryExportacionService.getMedioDeTransporte).toHaveBeenCalled();
    expect(component.phytosanitaryExportacionService.getEstado).toHaveBeenCalled();
    
    expect(component.paisDeProcedencia).toBeDefined();
    expect(component.aduana).toBeDefined();
    expect(component.entidades).toBeDefined();
    expect(component.descripcionProducto).toBeDefined();
    expect(component.fraccionArancelaria).toBeDefined();
    expect(component.genero).toBeDefined();
    expect(component.especie).toBeDefined();
    expect(component.nombreComun).toBeDefined();
    expect(component.unidadDeMedida).toBeDefined();
    expect(component.medioDeTransporte).toBeDefined();
    expect(component.estado).toBeDefined();
  });

  it('should run #inicializaCatalogos() with empty paisDeProcedencia', async () => {
    component.phytosanitaryExportacionService.getPaisDeProcedencia = jest.fn().mockReturnValue(
      observableOf({ data: [] })
    );
    component.phytosanitaryExportacionService.getAduana = jest.fn().mockReturnValue(
      observableOf({ data: [] })
    );
    component.phytosanitaryExportacionService.getEntidades = jest.fn().mockReturnValue(
      observableOf({ data: [] })
    );
    component.phytosanitaryExportacionService.getDescripcionProducto = jest.fn().mockReturnValue(
      observableOf({ data: [] })
    );
    component.phytosanitaryExportacionService.getFraccionArancelaria = jest.fn().mockReturnValue(
      observableOf({ data: [] })
    );
    component.phytosanitaryExportacionService.getGenero = jest.fn().mockReturnValue(
      observableOf({ data: [] })
    );
    component.phytosanitaryExportacionService.getEspecie = jest.fn().mockReturnValue(
      observableOf({ data: [] })
    );
    component.phytosanitaryExportacionService.getNombreComun = jest.fn().mockReturnValue(
      observableOf({ data: [] })
    );
    component.phytosanitaryExportacionService.getUnidadDeMedida = jest.fn().mockReturnValue(
      observableOf({ data: [] })
    );
    component.phytosanitaryExportacionService.getMedioDeTransporte = jest.fn().mockReturnValue(
      observableOf({ data: [] })
    );
    component.phytosanitaryExportacionService.getEstado = jest.fn().mockReturnValue(
      observableOf({ data: [] })
    );
    
    component.solicitudForm = {
      patchValue: jest.fn(),
      get: jest.fn().mockReturnValue({
        setControl: jest.fn()
      })
    };
    
    component.inicializaCatalogos();
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(component.solicitudForm.patchValue).not.toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializaCatalogos = jest.fn();
    component.query = component.query || {};
    component.query.selectSolicitud$ = observableOf({});
    component.inicializarFormulario = jest.fn();
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.updateEstadoFormulario = jest.fn();
    component.ngOnInit();
    expect(component.inicializaCatalogos).toHaveBeenCalled();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.updateEstadoFormulario).toHaveBeenCalled();
  });

  it('should run SetterDeclaration #fechasSeleccionadas', async () => {
    const mockExportacionForm = {
      setControl: jest.fn(),
      get: jest.fn()
    };
    
    component.solicitudForm = {
      get: jest.fn().mockReturnValue(mockExportacionForm)
    };
    
    const mockFechasArray = {} as any;
    
    component.fechasSeleccionadas = mockFechasArray;
    
    expect(component.solicitudForm.get).toHaveBeenCalledWith('exportacionForm');
    expect(mockExportacionForm.setControl).toHaveBeenCalledWith('fechasSeleccionadas', mockFechasArray);
  });

  it('should run GetterDeclaration #exportacionForm', async () => {
    component.solicitudForm = component.solicitudForm || {};
    component.solicitudForm.get = jest.fn();
    const exportacionForm = component.exportacionForm;
    expect(component.solicitudForm.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #datosMercancia', async () => {
    component.solicitudForm = component.solicitudForm || {};
    component.solicitudForm.get = jest.fn();
    const datosMercancia = component.datosMercancia;
    expect(component.solicitudForm.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #datosMercancia with correct path', async () => {
    component.solicitudForm = {
      get: jest.fn().mockReturnValue({} as any)
    };
    const datosMercancia = component.datosMercancia;
    expect(component.solicitudForm.get).toHaveBeenCalledWith('datosMercancia');
  });

  it('should run GetterDeclaration #fechasSeleccionadas', async () => {
    const mockExportacionForm = {
      get: jest.fn().mockReturnValue({}) 
    };
    
    component.solicitudForm = {
      get: jest.fn().mockReturnValue(mockExportacionForm)
    };
    
    const fechasSeleccionadas = component.fechasSeleccionadas;
    
    expect(component.solicitudForm.get).toHaveBeenCalledWith('exportacionForm');
    expect(mockExportacionForm.get).toHaveBeenCalledWith('fechasSeleccionadas');
  });

  it('should run #ngOnInit()', async () => {
    component.inicializaCatalogos = jest.fn();
    component.query = component.query || {};
    component.query.selectSolicitud$ = observableOf({});
    component.inicializarFormulario = jest.fn();
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.updateEstadoFormulario = jest.fn();
    component.ngOnInit();
    expect(component.inicializaCatalogos).toHaveBeenCalled();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.updateEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #ngOnInit() with proper observable subscriptions', async () => {
    component.inicializaCatalogos = jest.fn();
    
    const mockSolicitudState = {
      datosSolicitud: [{ id: 1, descripcion: 'Test' }]
    };
    
    component.query = {
      selectSolicitud$: observableOf(mockSolicitudState)
    } as any;
    
    const mockConsultaioState = {
      readonly: true
    };
    
    component.consultaioQuery = {
      selectConsultaioState$: observableOf(mockConsultaioState)
    } as any;
    
    component.inicializarFormulario = jest.fn();
    component.updateEstadoFormulario = jest.fn();
    
    component.ngOnInit();
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(component.inicializaCatalogos).toHaveBeenCalled();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.updateEstadoFormulario).toHaveBeenCalled();
    expect(component.solicitudState).toEqual(mockSolicitudState);
    expect(component.consultaDatos).toEqual(mockConsultaioState);
    expect(component.soloLectura).toBe(true);
    expect(component.datosSolicitud).toEqual(mockSolicitudState.datosSolicitud);
  });

  it('should run #inicializaCatalogos() and set correct catalogs', async () => {
    const mockData = [{ id: 1, descripcion: 'Test' }];
    
    component.phytosanitaryExportacionService = {
      getPaisDeProcedencia: jest.fn().mockReturnValue(observableOf({ data: mockData })),
      getAduana: jest.fn().mockReturnValue(observableOf({ data: mockData })),
      getEntidades: jest.fn().mockReturnValue(observableOf({ data: mockData })),
      getDescripcionProducto: jest.fn().mockReturnValue(observableOf({ data: mockData })),
      getFraccionArancelaria: jest.fn().mockReturnValue(observableOf({ data: mockData })),
      getGenero: jest.fn().mockReturnValue(observableOf({ data: mockData })),
      getEspecie: jest.fn().mockReturnValue(observableOf({ data: mockData })),
      getNombreComun: jest.fn().mockReturnValue(observableOf({ data: mockData })),
      getUnidadDeMedida: jest.fn().mockReturnValue(observableOf({ data: mockData })),
      getMedioDeTransporte: jest.fn().mockReturnValue(observableOf({ data: mockData })),
      getEstado: jest.fn().mockReturnValue(observableOf({ data: mockData }))
    } as any;
    
    component.solicitudForm = {
      patchValue: jest.fn()
    } as any;
    
    component.inicializaCatalogos();
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(component.paisDeProcedencia).toEqual(mockData);
    expect(component.aduana).toEqual(mockData);
    expect(component.entidades).toEqual(mockData);
    expect(component.descripcionProducto).toEqual(mockData);
    expect(component.fraccionArancelaria).toEqual(mockData);
    expect(component.genero).toEqual(mockData);
    expect(component.especie).toEqual(mockData);
    expect(component.nombreComun).toEqual(mockData);
    expect(component.unidadDeMedida).toEqual(mockData);
    expect(component.medioDeTransporte).toEqual(mockData);
    expect(component.estado).toEqual(mockData);
    expect(component.selectEntidades).toEqual(['Test']);
    expect(component.solicitudForm.patchValue).toHaveBeenCalledWith({
      "exportacionForm.paisDeProcedencia": 1,
    });
  });

  it('should run #inicializaCatalogos() with empty paisDeProcedencia array', async () => {
    const emptyData = [];
    
    component.phytosanitaryExportacionService = {
      getPaisDeProcedencia: jest.fn().mockReturnValue(observableOf({ data: emptyData })),
      getAduana: jest.fn().mockReturnValue(observableOf({ data: emptyData })),
      getEntidades: jest.fn().mockReturnValue(observableOf({ data: emptyData })),
      getDescripcionProducto: jest.fn().mockReturnValue(observableOf({ data: emptyData })),
      getFraccionArancelaria: jest.fn().mockReturnValue(observableOf({ data: emptyData })),
      getGenero: jest.fn().mockReturnValue(observableOf({ data: emptyData })),
      getEspecie: jest.fn().mockReturnValue(observableOf({ data: emptyData })),
      getNombreComun: jest.fn().mockReturnValue(observableOf({ data: emptyData })),
      getUnidadDeMedida: jest.fn().mockReturnValue(observableOf({ data: emptyData })),
      getMedioDeTransporte: jest.fn().mockReturnValue(observableOf({ data: emptyData })),
      getEstado: jest.fn().mockReturnValue(observableOf({ data: emptyData }))
    } as any;
    
    component.solicitudForm = {
      patchValue: jest.fn()
    } as any;
    
    component.inicializaCatalogos();
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(component.paisDeProcedencia).toEqual(emptyData);
    expect(component.solicitudForm.patchValue).not.toHaveBeenCalled();
  });





  it('should run #eliminar() with selected rows', async () => {
    component.selectedRows = [1, 2];
    component.datosSolicitud = [
      { id: 1, descripcion: 'Test 1' },
      { id: 2, descripcion: 'Test 2' },
      { id: 3, descripcion: 'Test 3' }
    ] as any;
    
    component.store = {
      setDatosSolicitud: jest.fn()
    } as any;
    
    component.eliminar();
    
    expect(component.datosSolicitud).toHaveLength(1);
    expect(component.datosSolicitud[0].id).toBe(3);
    expect(component.store.setDatosSolicitud).toHaveBeenCalledWith(component.datosSolicitud);
    expect(component.selectedRows).toEqual([]);
  });

  it('should run #eliminarDetalle() with selected rows', async () => {
    component.selectedRowsDetalle = [1, 2];
    component.datosDetalle = [
      { id: 1, descripcion: 'Test 1' },
      { id: 2, descripcion: 'Test 2' },
      { id: 3, descripcion: 'Test 3' }
    ] as any;
    
    component.store = {
      setDatosDetalle: jest.fn()
    } as any;
    
    component.eliminarDetalle();
    
    expect(component.datosDetalle).toHaveLength(1);
    expect(component.datosDetalle[0].id).toBe(3);
    expect(component.store.setDatosDetalle).toHaveBeenCalledWith(component.datosDetalle);
    expect(component.selectedRowsDetalle).toEqual([]);
  });


  it('should run #cerrarModal()', async () => {
    component.closeModal = component.closeModal || {};
    component.closeModal.nativeElement = {
      click: function() {}
    };
    component.cerrarModal();
  });

  it('should run #inicializarFormulario() correctly', async () => {
    const mockFormBuilder = {
      group: jest.fn().mockReturnValue({
        patchValue: jest.fn(),
        get: jest.fn()
      }),
      array: jest.fn().mockReturnValue({
        push: jest.fn()
      })
    };
    
    component.fb = mockFormBuilder;
    component.inicializarFormulario();
    
    expect(mockFormBuilder.group).toHaveBeenCalled();
    expect(component.solicitudForm).toBeDefined();
    expect(component.agregarMercanciasForm).toBeDefined();
  });


  it('should handle ngOnDestroy correctly', async () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    
    component.ngOnDestroy();
    
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should call cerrarModal with proper click event', async () => {
    const mockClick = jest.fn();
    component.closeModal = {
      nativeElement: {
        click: mockClick
      }
    } as any;
    
    component.cerrarModal();
    
    expect(mockClick).toHaveBeenCalled();
  });

  it('should run #paisDeProcedenciaSeleccion() correctly', async () => {
    component.solicitudForm = {
      get: jest.fn().mockReturnValue({ value: 'test-value' })
    } as any;
    
    component.store = {
      setpaisDeProcedencia: jest.fn()
    } as any;
    
    component.paisDeProcedenciaSeleccion();
    
    expect(component.solicitudForm.get).toHaveBeenCalledWith('exportacionForm.paisDeProcedencia');
    expect(component.store.setpaisDeProcedencia).toHaveBeenCalledWith('test-value');
  });

  it('should run #aduanaSeleccion() correctly', async () => {
    component.solicitudForm = {
      get: jest.fn().mockReturnValue({ value: 'test-aduana' })
    } as any;
    
    component.store = {
      setAduana: jest.fn()
    } as any;
    
    component.aduanaSeleccion();
    
    expect(component.solicitudForm.get).toHaveBeenCalledWith('exportacionForm.aduana');
    expect(component.store.setAduana).toHaveBeenCalledWith('test-aduana');
  });

  it('should run #paisSeleccion() correctly', async () => {
    component.solicitudForm = {
      get: jest.fn().mockReturnValue({ value: 'test-pais' })
    } as any;
    
    component.store = {
      setPais: jest.fn()
    } as any;
    
    component.paisSeleccion();
    
    expect(component.solicitudForm.get).toHaveBeenCalledWith('exportacionForm.pais');
    expect(component.store.setPais).toHaveBeenCalledWith('test-pais');
  });

  it('should run #entidadesSeleccion() correctly', async () => {
    component.solicitudForm = {
      get: jest.fn().mockReturnValue({ value: 'test-entidades' })
    } as any;
    
    component.store = {
      setEntidades: jest.fn()
    } as any;
    
    component.entidadesSeleccion();
    
    expect(component.solicitudForm.get).toHaveBeenCalledWith('exportacionForm.entidades');
    expect(component.store.setEntidades).toHaveBeenCalledWith('test-entidades');
  });

  it('should run #descripcionProductoSeleccion() correctly', async () => {
    component.solicitudForm = {
      get: jest.fn().mockReturnValue({ value: 'test-descripcion' })
    } as any;
    
    component.store = {
      setDescripcionProducto: jest.fn()
    } as any;
    
    component.descripcionProductoSeleccion();
    
    expect(component.solicitudForm.get).toHaveBeenCalledWith('exportacionForm.descripcionProducto');
    expect(component.store.setDescripcionProducto).toHaveBeenCalledWith('test-descripcion');
  });

  it('should run #fraccionArancelariaSeleccion() correctly', async () => {
    component.agregarMercanciasForm = {
      get: jest.fn().mockReturnValue({ value: 'test-fraccion' })
    } as any;
    
    component.store = {
      setFraccionArancelaria: jest.fn()
    } as any;
    
    component.fraccionArancelaria = [
      { id: 1, descripcion: 'Test Fraccion' }
    ];
    
    component.fraccionArancelariaSeleccion();
    
    expect(component.agregarMercanciasForm.get).toHaveBeenCalledWith('datosMercancia.fraccionArancelaria');
  });

  it('should run #generoSeleccion() correctly', async () => {
    component.solicitudForm = {
      get: jest.fn().mockReturnValue({ value: 'test-genero' })
    } as any;
    
    component.store = {
      setGenero: jest.fn()
    } as any;
    
    component.generoSeleccion();
    
    expect(component.solicitudForm.get).toHaveBeenCalledWith('datosMercancia.genero');
    expect(component.store.setGenero).toHaveBeenCalledWith('test-genero');
  });

  it('should run #especieSeleccion() correctly', async () => {
    component.solicitudForm = {
      get: jest.fn().mockReturnValue({ value: 'test-especie' })
    } as any;
    
    component.store = {
      setEspecie: jest.fn()
    } as any;
    
    component.especieSeleccion();
    
    expect(component.solicitudForm.get).toHaveBeenCalledWith('datosMercancia.especie');
    expect(component.store.setEspecie).toHaveBeenCalledWith('test-especie');
  });

  it('should run #nombreComunSeleccion() correctly', async () => {
    component.solicitudForm = {
      get: jest.fn().mockReturnValue({ value: 'test-nombre' })
    } as any;
    
    component.store = {
      setNombreComun: jest.fn()
    } as any;
    
    component.nombreComunSeleccion();
    
    expect(component.solicitudForm.get).toHaveBeenCalledWith('datosMercancia.nombreComun');
    expect(component.store.setNombreComun).toHaveBeenCalledWith('test-nombre');
  });

  it('should run #unidadDeMedidaSeleccion() correctly', async () => {
    component.solicitudForm = {
      get: jest.fn().mockReturnValue({ value: 'test-unidad' })
    } as any;
    
    component.store = {
      setUnidadDeMedida: jest.fn()
    } as any;
    
    component.unidadDeMedidaSeleccion();
    
    expect(component.solicitudForm.get).toHaveBeenCalledWith('exportacionForm.unidadDeMedida');
    expect(component.store.setUnidadDeMedida).toHaveBeenCalledWith('test-unidad');
  });

  it('should run #medioDeTransporteSeleccion() correctly', async () => {
    component.solicitudForm = {
      get: jest.fn().mockReturnValue({ value: 'test-transporte' })
    } as any;
    
    component.store = {
      setMedioDeTransporte: jest.fn()
    } as any;
    
    component.medioDeTransporteSeleccion();
    
    expect(component.solicitudForm.get).toHaveBeenCalledWith('exportacionForm.medioDeTransporte');
    expect(component.store.setMedioDeTransporte).toHaveBeenCalledWith('test-transporte');
  });

  it('should run #estadoSeleccion() correctly', async () => {
    component.solicitudForm = {
      get: jest.fn().mockReturnValue({ value: 'test-estado' })
    } as any;
    
    component.store = {
      setEstado: jest.fn()
    } as any;
    
    component.estadoSeleccion();
    
    expect(component.solicitudForm.get).toHaveBeenCalledWith('exportacionForm.estado');
    expect(component.store.setEstado).toHaveBeenCalledWith('test-estado');
  });


  it('should run #agregarDetalle() with successful response', async () => {
    const mockResponse = {
      success: true,
      datos: { id: 1, descripcion: 'Test Detail' }
    };
    
    component.phytosanitaryExportacionService = {
      agregarDetalle: jest.fn().mockReturnValue(observableOf(mockResponse))
    } as any;
    
    component.datosDetalle = [];
    component.store = {
      setDatosDetalle: jest.fn()
    } as any;
    
    component.agregarDetalle();
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(component.datosDetalle).toHaveLength(1);
    expect(component.datosDetalle[0].id).toBe(1);
    expect(component.store.setDatosDetalle).toHaveBeenCalledWith(component.datosDetalle);
  });

  it('should run #agregarSolicitud() with successful response', async () => {
    const mockResponse = {
      success: true,
      datos: { id: 1, descripcion: 'Test Solicitud' }
    };
    
    component.phytosanitaryExportacionService = {
      agregarSolicitud: jest.fn().mockReturnValue(observableOf(mockResponse))
    } as any;
    
    component.solicitudState = {
      fraccionArancelaria: 'test-fraccion',
      cantidad: 100,
      cantidadLetra: 'cien'
    } as any;
    
    component.datosSolicitud = [];
    component.store = {
      setDatosSolicitud: jest.fn()
    } as any;
    
    component.solicitudForm = {
      patchValue: jest.fn(),
      reset: jest.fn(),
      markAsUntouched: jest.fn(),
      markAsPristine: jest.fn()
    } as any;
    
    component.cerrarModal = jest.fn();
    
    component.agregarSolicitud();
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(component.datosSolicitud).toHaveLength(1);
    expect(component.store.setDatosSolicitud).toHaveBeenCalledWith(component.datosSolicitud);
    expect(component.solicitudForm.patchValue).toHaveBeenCalled();
    expect(component.solicitudForm.reset).toHaveBeenCalled();
    expect(component.solicitudForm.markAsUntouched).toHaveBeenCalled();
    expect(component.solicitudForm.markAsPristine).toHaveBeenCalled();
    expect(component.cerrarModal).toHaveBeenCalled();
  });

  it('should run #onSelectedRowsChange() correctly', async () => {
    const mockRows = [{ id: 1 }, { id: 2 }] as any;
    component.onSelectedRowsChange(mockRows);
    
    expect(component.selectedRows).toEqual([1, 2]);
  });

  it('should run #onSelectedRows() correctly', async () => {
    const mockRows = [{ id: 1 }, { id: 2 }] as any;
    component.onSelectedRows(mockRows);
    
    expect(component.selectedRowsDetalle).toEqual([1, 2]);
  });

  it('should run #cerrarModal() when closeModal is null', async () => {
    component.closeModal = null;
    
    expect(() => component.cerrarModal()).not.toThrow();
  });


  it('should run #eliminarDetalle() with successful deletion', async () => {
    component.selectedRowsDetalle = [1, 2];
    component.datosDetalle = [
      { id: 1, descripcion: 'Test 1' },
      { id: 2, descripcion: 'Test 2' },
      { id: 3, descripcion: 'Test 3' }
    ] as any;
    
    component.store = {
      setDatosDetalle: jest.fn()
    } as any;
    
    component.eliminarDetalle();
    
    expect(component.datosDetalle).toHaveLength(1);
    expect(component.datosDetalle[0].id).toBe(3);
    expect(component.store.setDatosDetalle).toHaveBeenCalledWith(component.datosDetalle);
    expect(component.selectedRowsDetalle).toEqual([]);
  });


});