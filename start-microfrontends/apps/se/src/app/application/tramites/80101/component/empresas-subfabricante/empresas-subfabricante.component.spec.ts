// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { EmpresasSubfabricanteComponent } from './empresas-subfabricante.component';
import { NuevoProgramaIndustrialService } from '../../services/nuevo-programa-industrial.service';
import { FormBuilder } from '@angular/forms';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { Tramite80101Store } from '../../estados/tramite80101.store';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpresasSubfabricanteComponent } from '../../../../80102/components/empresas-subfabricante/empresas-subfabricante.component';
import { of, Subject } from 'rxjs';

@Injectable()
class MockNuevoProgramaIndustrialService {}

@Injectable()
class MockTramite80101Query {}

@Injectable()
class MockTramite80101Store {}

@Injectable()
class MockRouter {
  navigate() {};
}

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

describe('EmpresasSubfabricanteComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmpresasSubfabricanteComponent, FormsModule, ReactiveFormsModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: NuevoProgramaIndustrialService, useClass: MockNuevoProgramaIndustrialService },
        FormBuilder,
        { provide: Tramite80101Query, useClass: MockTramite80101Query },
        { provide: Tramite80101Store, useClass: MockTramite80101Store },
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {url: 'url', params: {}, queryParams: {}, data: {}},
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        }
      ]
    }).overrideComponent(EmpresasSubfabricanteComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(EmpresasSubfabricanteComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.obtenerDatosDelAlmacen = jest.fn();
    component.obtenerListaEstado = jest.fn();
    component.ngOnInit();
    expect(component.obtenerDatosDelAlmacen).toHaveBeenCalled();
    expect(component.obtenerListaEstado).toHaveBeenCalled();
  });

  it('should run #obtenerDatosDelAlmacen()', async () => {
    component.query = component.query || {};
    component.query.datosSubcontratistaEstado$ = observableOf({});
    component.query.plantasBuscadas$ = observableOf({
      length: {}
    });
    component.query.plantasSubfabricantesAgregar$ = observableOf({
      length: {}
    });
    component.formularioDatosSubcontratista = component.formularioDatosSubcontratista || {};
    component.formularioDatosSubcontratista.setValue = jest.fn();
    // Removed setting 'valid' as it is a read-only property
    component.store = component.store || {};
    component.store.setFormValida = jest.fn();
    component.obtenerDatosDelAlmacen();
    expect(component.formularioDatosSubcontratista.setValue).toHaveBeenCalled();
    expect(component.store.setFormValida).toHaveBeenCalled();
  });

  it('should run #enEstadoSeleccionado()', async () => {
    component.formularioDatosSubcontratista = component.formularioDatosSubcontratista || {};
    component.formularioDatosSubcontratista.patchValue = jest.fn();
    component.formularioDatosSubcontratista.value = 'value';
    component.store = component.store || {};
    component.store.setDatosSubcontratista = jest.fn();
    component.enEstadoSeleccionado({
      id: {
        toString: function() {}
      }
    });
    expect(component.formularioDatosSubcontratista.patchValue).toHaveBeenCalled();
    expect(component.store.setDatosSubcontratista).toHaveBeenCalled();
  });

  it('should run #alCambiarRFC()', async () => {
    component.store = component.store || {};
    component.store.setDatosSubcontratista = jest.fn();
    component.alCambiarRFC({data: 'dummy'});
    expect(component.store.setDatosSubcontratista).toHaveBeenCalled();
  });

  it('should run #inicializarFormularioDatosSubcontratista()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.inicializarFormularioDatosSubcontratista();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #obtenerListaEstado()', async () => {
    component.nuevoProgramaIndustrialService = component.nuevoProgramaIndustrialService || {};
    component.nuevoProgramaIndustrialService.obtenerListaEstado = jest.fn().mockReturnValue(observableOf({
      data: {}
    }));
    component.obtenerListaEstado();
    expect(component.nuevoProgramaIndustrialService.obtenerListaEstado).toHaveBeenCalled();
  });

  it('should run #obtenerSubfabricantesDisponibles()', async () => {
    component.nuevoProgramaIndustrialService = component.nuevoProgramaIndustrialService || {};
    component.nuevoProgramaIndustrialService.getSubfabricantesDisponibles = jest.fn().mockReturnValue(observableOf([{data:'dummy'}]));
    component.store = component.store || {};
    component.store.setPlantasBuscadas = jest.fn();
    component.obtenerSubfabricantesDisponibles();
    expect(component.nuevoProgramaIndustrialService.getSubfabricantesDisponibles).toHaveBeenCalled();
    expect(component.store.setPlantasBuscadas).toHaveBeenCalled();
  });

  it('should run #obtenerRegistroSeleccionado()', async () => {

    component.obtenerRegistroSeleccionado({
      length: {}
    });

  });

  it('should run #realizarBusqueda()', async () => {
    component.formularioDatosSubcontratista = component.formularioDatosSubcontratista || {};
    component.formularioDatosSubcontratista.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.obtenerSubfabricantesDisponibles = jest.fn();
    component.realizarBusqueda();
    expect(component.formularioDatosSubcontratista.get).toHaveBeenCalled();
  });

  it('should run #agregarPlantas()', async () => {
    component.store = component.store || {};
    component.store.setPlantasSubfabricantesAgregar = jest.fn();
    component.agregarPlantas([{data:'dummy'}]);
    expect(component.store.setPlantasSubfabricantesAgregar).toHaveBeenCalled();
  });

  it('should run #datosDelSubfabricantePorEliminar()', async () => {

    component.datosDelSubfabricantePorEliminar({});

  });

  it('should run #eliminarPlantas()', async () => {
    component.store = component.store || {};
    component.store.eliminarPlantas = jest.fn();
    component.eliminarPlantas([{data:'dummy'}]);
    expect(component.store.eliminarPlantas).toHaveBeenCalled();
  });

  it('should run #complementarPlantas()', async () => {
    component.store = component.store || {};
    component.store.setPlantasPorCompletar = jest.fn();
    component.store.setindicePrevioRuta = jest.fn();
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.tabIndex = 1;
    component.complementarPlantas([{data:'dummy'}]);
    expect(component.store.setPlantasPorCompletar).toHaveBeenCalled();
    expect(component.store.setindicePrevioRuta).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });
  describe('EmpresasSubfabricanteComponent (80102)', () => {
    let fixture;
    let component;

    // Mocks
    class MockAutorizacionProgrmaNuevoService {
      obtenerListaEstado = jest.fn().mockReturnValue(observableOf({ data: [{ clave: '01', nombre: 'Estado' }] }));
    }
    class MockComplimentosService {
      getSubfabricantesDisponibles = jest.fn().mockReturnValue(observableOf({ datos: [{ rfc: 'RFC', estado: '01' }] }));
      mapApiResponseToPlantasSubfabricante = jest.fn().mockReturnValue([{ rfc: 'RFC', estado: '01' }]);
    }
    class MockTramite80102Query {
      datosSubcontratistaEstado$ = observableOf({ rfc: 'RFC', estado: '01' });
      plantasBuscadas$ = observableOf([{ rfc: 'RFC', estado: '01' }]);
      plantasSubfabricantesAgregar$ = observableOf([{ rfc: 'RFC', estado: '01' }]);
    }
    class MockTramite80102Store {
      setFormValida = jest.fn();
      setDatosSubcontratista = jest.fn();
      setPlantasBuscadas = jest.fn();
      setPlantasSubfabricantesAgregar = jest.fn();
      eliminarPlantas = jest.fn();
      setPlantasPorCompletar = jest.fn();
      setindicePrevioRuta = jest.fn();
    }
    class MockRouter {
      navigate = jest.fn();
    }
    class MockActivatedRoute {}
    class MockConsultaioQuery {
      selectConsultaioState$ = observableOf({ readonly: false });
    }
    const mockFormBuilder = {
      group: jest.fn().mockReturnValue({
        get: jest.fn().mockImplementation((key) => ({
          value: key === 'rfc' ? 'RFC' : key === 'estado' ? '01' : '',
        })),
        setValue: jest.fn(),
        patchValue: jest.fn(),
        valid: true,
        value: { rfc: 'RFC', estado: '01' }
      })
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [],
        providers: [
          { provide: AutorizacionProgrmaNuevoService, useClass: MockAutorizacionProgrmaNuevoService },
          { provide: FormBuilder, useValue: mockFormBuilder },
          { provide: Tramite80102Query, useClass: MockTramite80102Query },
          { provide: Tramite80102Store, useClass: MockTramite80102Store },
          { provide: Router, useClass: MockRouter },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: ConsultaioQuery, useClass: MockConsultaioQuery },
          { provide: ComplimentosService, useClass: MockComplimentosService }
        ]
      });
      fixture = TestBed.createComponent(EmpresasSubfabricanteComponent);
      component = fixture.debugElement.componentInstance;
    });

    afterEach(() => {
      component.ngOnDestroy = function() {};
      fixture.destroy();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize formularioDatosSubcontratista in constructor', () => {
      expect(component.formularioDatosSubcontratista).toBeDefined();
    });

    it('should set esFormularioSoloLectura from consultaQuery', () => {
      expect(component.esFormularioSoloLectura).toBe(false);
    });

    it('should run ngOnInit and call obtenerDatosDelAlmacen and obtenerListaEstado', () => {
      const spyDatos = jest.spyOn(component, 'obtenerDatosDelAlmacen');
      const spyLista = jest.spyOn(component, 'obtenerListaEstado');
      component.ngOnInit();
      expect(spyDatos).toHaveBeenCalled();
      expect(spyLista).toHaveBeenCalled();
    });

    it('should run obtenerDatosDelAlmacen and set form values', () => {
      component.formularioDatosSubcontratista = mockFormBuilder.group();
      component.store = TestBed.inject(Tramite80102Store);
      component.query = TestBed.inject(Tramite80102Query);
      component.obtenerDatosDelAlmacen();
      expect(component.formularioDatosSubcontratista.setValue).toHaveBeenCalled();
      expect(component.store.setFormValida).toHaveBeenCalled();
      expect(component.datosTablaSubfabricantesDisponibles.length).toBeGreaterThan(0);
      expect(component.datosSubfabricanteParaSerAgregados.length).toBeGreaterThan(0);
    });

    it('should run enEstadoSeleccionado and update form and store', () => {
      component.formularioDatosSubcontratista = mockFormBuilder.group();
      component.store = TestBed.inject(Tramite80102Store);
      const estado = { clave: '02', nombre: 'Nuevo Estado' };
      component.enEstadoSeleccionado(estado as any);
      expect(component.formularioDatosSubcontratista.patchValue).toHaveBeenCalled();
      expect(component.store.setDatosSubcontratista).toHaveBeenCalled();
    });

    it('should run alCambiarRFC and call store.setDatosSubcontratista', () => {
      component.store = TestBed.inject(Tramite80102Store);
      component.alCambiarRFC({ rfc: 'RFC', estado: '01' });
      expect(component.store.setDatosSubcontratista).toHaveBeenCalled();
    });

    it('should not call store.setDatosSubcontratista if datosSubcontratista is falsy', () => {
      component.store = TestBed.inject(Tramite80102Store);
      component.alCambiarRFC(undefined as any);
      expect(component.store.setDatosSubcontratista).not.toHaveBeenCalledWith(undefined);
    });

    it('should run inicializarFormularioDatosSubcontratista and set formularioDatosSubcontratista', () => {
      component.fb = mockFormBuilder as any;
      component.inicializarFormularioDatosSubcontratista();
      expect(component.formularioDatosSubcontratista).toBeDefined();
    });

    it('should run obtenerListaEstado and set estadoCatalogo', () => {
      component.AutorizacionProgrmaNuevoServiceServicios = TestBed.inject(AutorizacionProgrmaNuevoService);
      component.obtenerListaEstado();
      expect(component.AutorizacionProgrmaNuevoServiceServicios.obtenerListaEstado).toHaveBeenCalled();
      expect(component.estadoCatalogo.length).toBeGreaterThan(0);
    });

    it('should run obtenerSubfabricantesDisponibles and set store.setPlantasBuscadas', () => {
      component.formularioDatosSubcontratista = mockFormBuilder.group();
      component._compartidaSvc = TestBed.inject(ComplimentosService);
      component.store = TestBed.inject(Tramite80102Store);
      component.obtenerSubfabricantesDisponibles();
      expect(component._compartidaSvc.getSubfabricantesDisponibles).toHaveBeenCalled();
      expect(component._compartidaSvc.mapApiResponseToPlantasSubfabricante).toHaveBeenCalled();
      expect(component.store.setPlantasBuscadas).toHaveBeenCalled();
    });

    it('should run obtenerRegistroSeleccionado and set datosDelSubfabricanteSeleccionado', () => {
      component.obtenerRegistroSeleccionado([{ rfc: 'RFC', estado: '01' }]);
      expect(component.datosDelSubfabricanteSeleccionado.length).toBe(1);
    });

    it('should not set datosDelSubfabricanteSeleccionado if event is empty', () => {
      component.datosDelSubfabricanteSeleccionado = [];
      component.obtenerRegistroSeleccionado([]);
      expect(component.datosDelSubfabricanteSeleccionado.length).toBe(0);
    });

    it('should run realizarBusqueda and call obtenerSubfabricantesDisponibles and store.setFormValida', () => {
      component.formularioDatosSubcontratista = mockFormBuilder.group();
      component.obtenerSubfabricantesDisponibles = jest.fn();
      component.store = TestBed.inject(Tramite80102Store);
      component.realizarBusqueda();
      expect(component.obtenerSubfabricantesDisponibles).toHaveBeenCalled();
      expect(component.store.setFormValida).toHaveBeenCalledWith({ submanufacturas: true });
    });

    it('should not call obtenerSubfabricantesDisponibles if form fields are empty', () => {
      component.formularioDatosSubcontratista = {
        get: jest.fn().mockReturnValue({ value: '' })
      } as any;
      component.obtenerSubfabricantesDisponibles = jest.fn();
      component.store = TestBed.inject(Tramite80102Store);
      component.realizarBusqueda();
      expect(component.obtenerSubfabricantesDisponibles).not.toHaveBeenCalled();
    });

    it('should run agregarPlantas and call store.setPlantasSubfabricantesAgregar', () => {
      component.store = TestBed.inject(Tramite80102Store);
      component.agregarPlantas([{ rfc: 'RFC', estado: '01' }]);
      expect(component.store.setPlantasSubfabricantesAgregar).toHaveBeenCalled();
    });

    it('should not call store.setPlantasSubfabricantesAgregar if plantasPorAgrupar is falsy', () => {
      component.store = TestBed.inject(Tramite80102Store);
      component.agregarPlantas(undefined as any);
      expect(component.store.setPlantasSubfabricantesAgregar).not.toHaveBeenCalled();
    });

    it('should run datosDelSubfabricantePorEliminar and set listaDeSubfabricantesPorEliminar', () => {
      component.datosDelSubfabricantePorEliminar([{ rfc: 'RFC', estado: '01' }]);
      expect(component.listaDeSubfabricantesPorEliminar.length).toBe(1);
    });

    it('should run eliminarPlantas and call store.eliminarPlantas', () => {
      component.store = TestBed.inject(Tramite80102Store);
      component.eliminarPlantas([{ rfc: 'RFC', estado: '01' }]);
      expect(component.store.eliminarPlantas).toHaveBeenCalled();
    });

    it('should not call store.eliminarPlantas if plantasPorEliminar is falsy', () => {
      component.store = TestBed.inject(Tramite80102Store);
      component.eliminarPlantas(undefined as any);
      expect(component.store.eliminarPlantas).not.toHaveBeenCalled();
    });

    it('should run complementarPlantas and call store.setPlantasPorCompletar and setindicePrevioRuta', () => {
      component.store = TestBed.inject(Tramite80102Store);
      component.tabIndex = 1;
      component.complementarPlantas([{ rfc: 'RFC', estado: '01' }]);
      expect(component.store.setPlantasPorCompletar).toHaveBeenCalled();
      expect(component.store.setindicePrevioRuta).toHaveBeenCalledWith(1);
    });

    it('should run complementarPlantas and not call setindicePrevioRuta if tabIndex is falsy', () => {
      component.store = TestBed.inject(Tramite80102Store);
      component.tabIndex = 0;
      component.complementarPlantas([{ rfc: 'RFC', estado: '01' }]);
      expect(component.store.setPlantasPorCompletar).toHaveBeenCalled();
      expect(component.store.setindicePrevioRuta).not.toHaveBeenCalled();
    });

    it('should run ngOnDestroy and complete destroyNotifier$', () => {
      const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
// Tests for EmpresasSubfabricanteComponent (80102) - 100% coverage


describe('EmpresasSubfabricanteComponent (80102) - Coverage', () => {
  let component: EmpresasSubfabricanteComponent;
  let mockAutorizacionProgrmaNuevoService: any;
  let mockFormBuilder: any;
  let mockQuery: any;
  let mockStore: any;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockConsultaQuery: any;
  let mockComplimentosService: any;

  beforeEach(() => {
    mockAutorizacionProgrmaNuevoService = {
      obtenerListaEstado: jest.fn().mockReturnValue(of({ data: [{ clave: '01', nombre: 'Estado' }] }))
    };
    mockFormBuilder = {
      group: jest.fn().mockReturnValue({
        get: jest.fn((key) => ({
          value: key === 'rfc' ? 'RFC' : key === 'estado' ? '01' : ''
        })),
        setValue: jest.fn(),
        patchValue: jest.fn(),
        valid: true,
        value: { rfc: 'RFC', estado: '01' }
      })
    };
    mockQuery = {
      datosSubcontratistaEstado$: of({ rfc: 'RFC', estado: '01' }),
      plantasBuscadas$: of([{ rfc: 'RFC', estado: '01' }]),
      plantasSubfabricantesAgregar$: of([{ rfc: 'RFC', estado: '01' }])
    };
    mockStore = {
      setFormValida: jest.fn(),
      setDatosSubcontratista: jest.fn(),
      setPlantasBuscadas: jest.fn(),
      setPlantasSubfabricantesAgregar: jest.fn(),
      eliminarPlantas: jest.fn(),
      setPlantasPorCompletar: jest.fn(),
      setindicePrevioRuta: jest.fn()
    };
    mockRouter = { navigate: jest.fn() };
    mockActivatedRoute = {};
    mockConsultaQuery = {
      selectConsultaioState$: of({ readonly: false })
    };
    mockComplimentosService = {
      getSubfabricantesDisponibles: jest.fn().mockReturnValue(of({ datos: [{ rfc: 'RFC', estado: '01' }] })),
      mapApiResponseToPlantasSubfabricante: jest.fn().mockReturnValue([{ rfc: 'RFC', estado: '01' }])
    };

    component = new EmpresasSubfabricanteComponent(
      mockAutorizacionProgrmaNuevoService,
      mockFormBuilder,
      mockQuery,
      mockStore,
      mockRouter,
      mockActivatedRoute,
      mockConsultaQuery,
      mockComplimentosService
    );
  });

  it('should create and initialize formularioDatosSubcontratista', () => {
    expect(component).toBeTruthy();
    expect(component.formularioDatosSubcontratista).toBeDefined();
  });

  it('should set esFormularioSoloLectura from consultaQuery', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should run ngOnInit and call obtenerDatosDelAlmacen and obtenerListaEstado', () => {
    const spyDatos = jest.spyOn(component, 'obtenerDatosDelAlmacen');
    const spyLista = jest.spyOn(component, 'obtenerListaEstado');
    component.ngOnInit();
    expect(spyDatos).toHaveBeenCalled();
    expect(spyLista).toHaveBeenCalled();
  });

  it('should run obtenerDatosDelAlmacen and set form values and arrays', () => {
    component.formularioDatosSubcontratista = mockFormBuilder.group();
    component.store = mockStore;
    component.query = mockQuery;
    component.obtenerDatosDelAlmacen();
    expect(component.formularioDatosSubcontratista.setValue).toHaveBeenCalled();
    expect(component.store.setFormValida).toHaveBeenCalled();
    expect(component.datosTablaSubfabricantesDisponibles.length).toBeGreaterThan(0);
    expect(component.datosSubfabricanteParaSerAgregados.length).toBeGreaterThan(0);
  });

  it('should run enEstadoSeleccionado and update form and store', () => {
    component.formularioDatosSubcontratista = mockFormBuilder.group();
    component.store = mockStore;
    const estado = { clave: '02', nombre: 'Nuevo Estado' };
    component.enEstadoSeleccionado(estado as any);
    expect(component.formularioDatosSubcontratista.patchValue).toHaveBeenCalled();
    expect(component.store.setDatosSubcontratista).toHaveBeenCalled();
  });

  it('should run alCambiarRFC and call store.setDatosSubcontratista', () => {
    component.store = mockStore;
    component.alCambiarRFC({ rfc: 'RFC', estado: '01' });
    expect(component.store.setDatosSubcontratista).toHaveBeenCalled();
  });

  it('should not call store.setDatosSubcontratista if datosSubcontratista is falsy', () => {
    component.store = mockStore;
    component.alCambiarRFC(undefined as any);
    expect(component.store.setDatosSubcontratista).not.toHaveBeenCalledWith(undefined);
  });

  it('should run inicializarFormularioDatosSubcontratista and set formularioDatosSubcontratista', () => {
    component.fb = mockFormBuilder as any;
    component.inicializarFormularioDatosSubcontratista();
    expect(component.formularioDatosSubcontratista).toBeDefined();
  });

  it('should run obtenerListaEstado and set estadoCatalogo', () => {
    component.AutorizacionProgrmaNuevoServiceServicios = mockAutorizacionProgrmaNuevoService;
    component.obtenerListaEstado();
    expect(component.AutorizacionProgrmaNuevoServiceServicios.obtenerListaEstado).toHaveBeenCalled();
    expect(component.estadoCatalogo.length).toBeGreaterThan(0);
  });

  it('should run obtenerSubfabricantesDisponibles and set store.setPlantasBuscadas', () => {
    component.formularioDatosSubcontratista = mockFormBuilder.group();
    component._compartidaSvc = mockComplimentosService;
    component.store = mockStore;
    component.obtenerSubfabricantesDisponibles();
    expect(component._compartidaSvc.getSubfabricantesDisponibles).toHaveBeenCalled();
    expect(component._compartidaSvc.mapApiResponseToPlantasSubfabricante).toHaveBeenCalled();
    expect(component.store.setPlantasBuscadas).toHaveBeenCalled();
  });

  it('should run obtenerRegistroSeleccionado and set datosDelSubfabricanteSeleccionado', () => {
    component.obtenerRegistroSeleccionado([{ rfc: 'RFC', estado: '01' }]);
    expect(component.datosDelSubfabricanteSeleccionado.length).toBe(1);
  });

  it('should not set datosDelSubfabricanteSeleccionado if event is empty', () => {
    component.datosDelSubfabricanteSeleccionado = [];
    component.obtenerRegistroSeleccionado([]);
    expect(component.datosDelSubfabricanteSeleccionado.length).toBe(0);
  });

  it('should run realizarBusqueda and call obtenerSubfabricantesDisponibles and store.setFormValida', () => {
    component.formularioDatosSubcontratista = mockFormBuilder.group();
    component.obtenerSubfabricantesDisponibles = jest.fn();
    component.store = mockStore;
    component.realizarBusqueda();
    expect(component.obtenerSubfabricantesDisponibles).toHaveBeenCalled();
    expect(component.store.setFormValida).toHaveBeenCalledWith({ submanufacturas: true });
  });

  it('should not call obtenerSubfabricantesDisponibles if form fields are empty', () => {
    component.formularioDatosSubcontratista = {
      get: jest.fn().mockReturnValue({ value: '' })
    } as any;
    component.obtenerSubfabricantesDisponibles = jest.fn();
    component.store = mockStore;
    component.realizarBusqueda();
    expect(component.obtenerSubfabricantesDisponibles).not.toHaveBeenCalled();
  });

  it('should run agregarPlantas and call store.setPlantasSubfabricantesAgregar', () => {
    component.store = mockStore;
    component.agregarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(component.store.setPlantasSubfabricantesAgregar).toHaveBeenCalled();
  });

  it('should not call store.setPlantasSubfabricantesAgregar if plantasPorAgrupar is falsy', () => {
    component.store = mockStore;
    component.agregarPlantas(undefined as any);
    expect(component.store.setPlantasSubfabricantesAgregar).not.toHaveBeenCalled();
  });

  it('should run datosDelSubfabricantePorEliminar and set listaDeSubfabricantesPorEliminar', () => {
    component.datosDelSubfabricantePorEliminar([{ rfc: 'RFC', estado: '01' }]);
    expect(component.listaDeSubfabricantesPorEliminar.length).toBe(1);
  });

  it('should run eliminarPlantas and call store.eliminarPlantas', () => {
    component.store = mockStore;
    component.eliminarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(component.store.eliminarPlantas).toHaveBeenCalled();
  });

  it('should not call store.eliminarPlantas if plantasPorEliminar is falsy', () => {
    component.store = mockStore;
    component.eliminarPlantas(undefined as any);
    expect(component.store.eliminarPlantas).not.toHaveBeenCalled();
  });

  it('should run complementarPlantas and call store.setPlantasPorCompletar and setindicePrevioRuta', () => {
    component.store = mockStore;
    component.tabIndex = 1;
    component.complementarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(component.store.setPlantasPorCompletar).toHaveBeenCalled();
    expect(component.store.setindicePrevioRuta).toHaveBeenCalledWith(1);
  });

  it('should run complementarPlantas and not call setindicePrevioRuta if tabIndex is falsy', () => {
    component.store = mockStore;
    component.tabIndex = 0;
    component.complementarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(component.store.setPlantasPorCompletar).toHaveBeenCalled();
    expect(component.store.setindicePrevioRuta).not.toHaveBeenCalled();
  });

  it('should run ngOnDestroy and complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn((component as any)['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn((component as any)['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
describe('EmpresasSubfabricanteComponent (80102) - Unit', () => {
  let component: EmpresasSubfabricanteComponent;
  let mockAutorizacionProgrmaNuevoService: any;
  let mockFormBuilder: any;
  let mockQuery: any;
  let mockStore: any;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockConsultaQuery: any;
  let mockComplimentosService: any;

  beforeEach(() => {
    mockAutorizacionProgrmaNuevoService = {
      obtenerListaEstado: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ data: [{ clave: '01', nombre: 'Estado' }] }))
      })
    };
    mockFormBuilder = {
      group: jest.fn().mockReturnValue({
        get: jest.fn((key) => ({
          value: key === 'rfc' ? 'RFC' : key === 'estado' ? '01' : ''
        })),
        setValue: jest.fn(),
        patchValue: jest.fn(),
        valid: true,
        value: { rfc: 'RFC', estado: '01' }
      })
    };
    mockQuery = {
      datosSubcontratistaEstado$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ rfc: 'RFC', estado: '01' }))
      },
      plantasBuscadas$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb([{ rfc: 'RFC', estado: '01' }]))
      },
      plantasSubfabricantesAgregar$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb([{ rfc: 'RFC', estado: '01' }]))
      }
    };
    mockStore = {
      setFormValida: jest.fn(),
      setDatosSubcontratista: jest.fn(),
      setPlantasBuscadas: jest.fn(),
      setPlantasSubfabricantesAgregar: jest.fn(),
      eliminarPlantas: jest.fn(),
      setPlantasPorCompletar: jest.fn(),
      setindicePrevioRuta: jest.fn()
    };
    mockRouter = { navigate: jest.fn() };
    mockActivatedRoute = {};
    mockConsultaQuery = {
      selectConsultaioState$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ readonly: false }))
      }
    };
    mockComplimentosService = {
      getSubfabricantesDisponibles: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ datos: [{ rfc: 'RFC', estado: '01' }] }))
      }),
      mapApiResponseToPlantasSubfabricante: jest.fn().mockReturnValue([{ rfc: 'RFC', estado: '01' }])
    };

    component = new EmpresasSubfabricanteComponent(
      mockAutorizacionProgrmaNuevoService,
      mockFormBuilder,
      mockQuery,
      mockStore,
      mockRouter,
      mockActivatedRoute,
      mockConsultaQuery,
      mockComplimentosService
    );
    component.formularioDatosSubcontratista = mockFormBuilder.group();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formularioDatosSubcontratista', () => {
    expect(component.formularioDatosSubcontratista).toBeDefined();
  });

  it('should set esFormularioSoloLectura from consultaQuery', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should call ngOnInit and call obtenerDatosDelAlmacen and obtenerListaEstado', () => {
    const datosSpy = jest.spyOn(component, 'obtenerDatosDelAlmacen');
    const listaSpy = jest.spyOn(component, 'obtenerListaEstado');
    component.ngOnInit();
    expect(datosSpy).toHaveBeenCalled();
    expect(listaSpy).toHaveBeenCalled();
  });

  it('should call obtenerDatosDelAlmacen and set form values and arrays', () => {
    component.obtenerDatosDelAlmacen();
    expect(component.formularioDatosSubcontratista.setValue).toHaveBeenCalled();
    expect(mockStore.setFormValida).toHaveBeenCalled();
    expect(component.datosTablaSubfabricantesDisponibles.length).toBeGreaterThan(0);
    expect(component.datosSubfabricanteParaSerAgregados.length).toBeGreaterThan(0);
  });

  it('should call enEstadoSeleccionado and update form and store', () => {
    const estado = { clave: '02', nombre: 'Nuevo Estado' };
    component.enEstadoSeleccionado(estado as any);
    expect(component.formularioDatosSubcontratista.patchValue).toHaveBeenCalled();
    expect(mockStore.setDatosSubcontratista).toHaveBeenCalled();
  });

  it('should call alCambiarRFC and call store.setDatosSubcontratista', () => {
    component.alCambiarRFC({ rfc: 'RFC', estado: '01' });
    expect(mockStore.setDatosSubcontratista).toHaveBeenCalled();
  });

  it('should not call store.setDatosSubcontratista if datosSubcontratista is falsy', () => {
    component.alCambiarRFC(undefined as any);
    expect(mockStore.setDatosSubcontratista).not.toHaveBeenCalledWith(undefined);
  });

  it('should call inicializarFormularioDatosSubcontratista and set formularioDatosSubcontratista', () => {
    component.fb = mockFormBuilder as any;
    component.inicializarFormularioDatosSubcontratista();
    expect(component.formularioDatosSubcontratista).toBeDefined();
  });

  it('should call obtenerListaEstado and set estadoCatalogo', () => {
    component.AutorizacionProgrmaNuevoServiceServicios = mockAutorizacionProgrmaNuevoService;
    component.obtenerListaEstado();
    expect(mockAutorizacionProgrmaNuevoService.obtenerListaEstado).toHaveBeenCalled();
    expect(component.estadoCatalogo.length).toBeGreaterThan(0);
  });

  it('should call obtenerSubfabricantesDisponibles and set store.setPlantasBuscadas', () => {
    component._compartidaSvc = mockComplimentosService;
    component.obtenerSubfabricantesDisponibles();
    expect(mockComplimentosService.getSubfabricantesDisponibles).toHaveBeenCalled();
    expect(mockComplimentosService.mapApiResponseToPlantasSubfabricante).toHaveBeenCalled();
    expect(mockStore.setPlantasBuscadas).toHaveBeenCalled();
  });

  it('should call obtenerRegistroSeleccionado and set datosDelSubfabricanteSeleccionado', () => {
    component.obtenerRegistroSeleccionado([{ rfc: 'RFC', estado: '01' }]);
    expect(component.datosDelSubfabricanteSeleccionado.length).toBe(1);
  });

  it('should not set datosDelSubfabricanteSeleccionado if event is empty', () => {
    component.datosDelSubfabricanteSeleccionado = [];
    component.obtenerRegistroSeleccionado([]);
    expect(component.datosDelSubfabricanteSeleccionado.length).toBe(0);
  });

  it('should call realizarBusqueda and call obtenerSubfabricantesDisponibles and store.setFormValida', () => {
    component.obtenerSubfabricantesDisponibles = jest.fn();
    component.store = mockStore;
    component.realizarBusqueda();
    expect(component.obtenerSubfabricantesDisponibles).toHaveBeenCalled();
    expect(mockStore.setFormValida).toHaveBeenCalledWith({ submanufacturas: true });
  });

  it('should not call obtenerSubfabricantesDisponibles if form fields are empty', () => {
    component.formularioDatosSubcontratista = {
      get: jest.fn().mockReturnValue({ value: '' })
    } as any;
    component.obtenerSubfabricantesDisponibles = jest.fn();
    component.store = mockStore;
    component.realizarBusqueda();
    expect(component.obtenerSubfabricantesDisponibles).not.toHaveBeenCalled();
  });

  it('should call agregarPlantas and call store.setPlantasSubfabricantesAgregar', () => {
    component.agregarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(mockStore.setPlantasSubfabricantesAgregar).toHaveBeenCalled();
  });

  it('should not call store.setPlantasSubfabricantesAgregar if plantasPorAgrupar is falsy', () => {
    component.agregarPlantas(undefined as any);
    expect(mockStore.setPlantasSubfabricantesAgregar).not.toHaveBeenCalled();
  });

  it('should call datosDelSubfabricantePorEliminar and set listaDeSubfabricantesPorEliminar', () => {
    component.datosDelSubfabricantePorEliminar([{ rfc: 'RFC', estado: '01' }]);
    expect(component.listaDeSubfabricantesPorEliminar.length).toBe(1);
  });

  it('should call eliminarPlantas and call store.eliminarPlantas', () => {
    component.eliminarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(mockStore.eliminarPlantas).toHaveBeenCalled();
  });

  it('should not call store.eliminarPlantas if plantasPorEliminar is falsy', () => {
    component.eliminarPlantas(undefined as any);
    expect(mockStore.eliminarPlantas).not.toHaveBeenCalled();
  });

  it('should call complementarPlantas and call store.setPlantasPorCompletar and setindicePrevioRuta', () => {
    component.tabIndex = 1;
    component.complementarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(mockStore.setPlantasPorCompletar).toHaveBeenCalled();
    expect(mockStore.setindicePrevioRuta).toHaveBeenCalledWith(1);
  });

  it('should call complementarPlantas and not call setindicePrevioRuta if tabIndex is falsy', () => {
    component.tabIndex = 0;
    component.complementarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(mockStore.setPlantasPorCompletar).toHaveBeenCalled();
    expect(mockStore.setindicePrevioRuta).not.toHaveBeenCalled();
  });

  it('should call ngOnDestroy and complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn((component as any)['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn((component as any)['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should have default values for properties', () => {
    expect(component.estadoCatalogo).toEqual([]);
    expect(component.tablaSeleccion).toBeDefined();
    expect(component.configuracionTabla).toBeDefined();
    expect(component.datosDelSubfabricanteSeleccionado).toEqual([]);
    expect(component.datosSubfabricanteParaSerAgregados).toEqual([]);
    expect(component.datosTablaSubfabricantesDisponibles).toEqual([]);
    expect(component.listaDeSubfabricantesPorEliminar).toEqual([]);
    expect(component.configuracionTablaDisponibles).toBeDefined();
    expect(component.configuracionTablaSeleccionadas).toBeDefined();
    expect(component.tabIndex).toBe(0);
  });
});
describe('EmpresasSubfabricanteComponent (80102) - Unit', () => {
  let component: EmpresasSubfabricanteComponent;
  let mockAutorizacionProgrmaNuevoService: any;
  let mockFormBuilder: any;
  let mockQuery: any;
  let mockStore: any;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockConsultaQuery: any;
  let mockComplimentosService: any;

  beforeEach(() => {
    mockAutorizacionProgrmaNuevoService = {
      obtenerListaEstado: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ data: [{ clave: '01', nombre: 'Estado' }] }))
      })
    };
    mockFormBuilder = {
      group: jest.fn().mockReturnValue({
        get: jest.fn((key) => ({ value: key === 'rfc' ? 'RFC' : key === 'estado' ? '01' : '' })),
        setValue: jest.fn(),
        patchValue: jest.fn(),
        valid: true,
        value: { rfc: 'RFC', estado: '01' }
      })
    };
    mockQuery = {
      datosSubcontratistaEstado$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ rfc: 'RFC', estado: '01' }))
      },
      plantasBuscadas$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb([{ rfc: 'RFC', estado: '01' }]))
      },
      plantasSubfabricantesAgregar$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb([{ rfc: 'RFC', estado: '01' }]))
      }
    };
    mockStore = {
      setFormValida: jest.fn(),
      setDatosSubcontratista: jest.fn(),
      setPlantasBuscadas: jest.fn(),
      setPlantasSubfabricantesAgregar: jest.fn(),
      eliminarPlantas: jest.fn(),
      setPlantasPorCompletar: jest.fn(),
      setindicePrevioRuta: jest.fn()
    };
    mockRouter = { navigate: jest.fn() };
    mockActivatedRoute = {};
    mockConsultaQuery = {
      selectConsultaioState$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ readonly: false }))
      }
    };
    mockComplimentosService = {
      getSubfabricantesDisponibles: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ datos: [{ rfc: 'RFC', estado: '01' }] }))
      }),
      mapApiResponseToPlantasSubfabricante: jest.fn().mockReturnValue([{ rfc: 'RFC', estado: '01' }])
    };

    component = new EmpresasSubfabricanteComponent(
      mockAutorizacionProgrmaNuevoService,
      mockFormBuilder,
      mockQuery,
      mockStore,
      mockRouter,
      mockActivatedRoute,
      mockConsultaQuery,
      mockComplimentosService
    );
    component.formularioDatosSubcontratista = mockFormBuilder.group();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formularioDatosSubcontratista in constructor', () => {
    expect(component.formularioDatosSubcontratista).toBeDefined();
  });

  it('should set esFormularioSoloLectura from consultaQuery', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should run ngOnInit and call obtenerDatosDelAlmacen and obtenerListaEstado', () => {
    const spyDatos = jest.spyOn(component, 'obtenerDatosDelAlmacen');
    const spyLista = jest.spyOn(component, 'obtenerListaEstado');
    component.ngOnInit();
    expect(spyDatos).toHaveBeenCalled();
    expect(spyLista).toHaveBeenCalled();
  });

  it('should run obtenerDatosDelAlmacen and set form values and arrays', () => {
    component.obtenerDatosDelAlmacen();
    expect(component.formularioDatosSubcontratista.setValue).toHaveBeenCalled();
    expect(mockStore.setFormValida).toHaveBeenCalled();
    expect(component.datosTablaSubfabricantesDisponibles.length).toBeGreaterThan(0);
    expect(component.datosSubfabricanteParaSerAgregados.length).toBeGreaterThan(0);
  });

  it('should run enEstadoSeleccionado and update form and store', () => {
    const estado = { clave: '02', nombre: 'Nuevo Estado' };
    component.enEstadoSeleccionado(estado as any);
    expect(component.formularioDatosSubcontratista.patchValue).toHaveBeenCalled();
    expect(mockStore.setDatosSubcontratista).toHaveBeenCalled();
  });

  it('should run alCambiarRFC and call store.setDatosSubcontratista', () => {
    component.alCambiarRFC({ rfc: 'RFC', estado: '01' });
    expect(mockStore.setDatosSubcontratista).toHaveBeenCalled();
  });

  it('should not call store.setDatosSubcontratista if datosSubcontratista is falsy', () => {
    component.alCambiarRFC(undefined as any);
    expect(mockStore.setDatosSubcontratista).not.toHaveBeenCalledWith(undefined);
  });

  it('should run inicializarFormularioDatosSubcontratista and set formularioDatosSubcontratista', () => {
    component.fb = mockFormBuilder as any;
    component.inicializarFormularioDatosSubcontratista();
    expect(component.formularioDatosSubcontratista).toBeDefined();
  });

  it('should run obtenerListaEstado and set estadoCatalogo', () => {
    component.AutorizacionProgrmaNuevoServiceServicios = mockAutorizacionProgrmaNuevoService;
    component.obtenerListaEstado();
    expect(mockAutorizacionProgrmaNuevoService.obtenerListaEstado).toHaveBeenCalled();
    expect(component.estadoCatalogo.length).toBeGreaterThan(0);
  });

  it('should run obtenerSubfabricantesDisponibles and set store.setPlantasBuscadas', () => {
    component._compartidaSvc = mockComplimentosService;
    component.obtenerSubfabricantesDisponibles();
    expect(mockComplimentosService.getSubfabricantesDisponibles).toHaveBeenCalled();
    expect(mockComplimentosService.mapApiResponseToPlantasSubfabricante).toHaveBeenCalled();
    expect(mockStore.setPlantasBuscadas).toHaveBeenCalled();
  });

  it('should run obtenerRegistroSeleccionado and set datosDelSubfabricanteSeleccionado', () => {
    component.obtenerRegistroSeleccionado([{ rfc: 'RFC', estado: '01' }]);
    expect(component.datosDelSubfabricanteSeleccionado.length).toBe(1);
  });

  it('should not set datosDelSubfabricanteSeleccionado if event is empty', () => {
    component.datosDelSubfabricanteSeleccionado = [];
    component.obtenerRegistroSeleccionado([]);
    expect(component.datosDelSubfabricanteSeleccionado.length).toBe(0);
  });

  it('should run realizarBusqueda and call obtenerSubfabricantesDisponibles and store.setFormValida', () => {
    component.obtenerSubfabricantesDisponibles = jest.fn();
    component.realizarBusqueda();
    expect(component.obtenerSubfabricantesDisponibles).toHaveBeenCalled();
    expect(mockStore.setFormValida).toHaveBeenCalledWith({ submanufacturas: true });
  });

  it('should not call obtenerSubfabricantesDisponibles if form fields are empty', () => {
    component.formularioDatosSubcontratista = {
      get: jest.fn().mockReturnValue({ value: '' })
    } as any;
    component.obtenerSubfabricantesDisponibles = jest.fn();
    component.realizarBusqueda();
    expect(component.obtenerSubfabricantesDisponibles).not.toHaveBeenCalled();
  });

  it('should run agregarPlantas and call store.setPlantasSubfabricantesAgregar', () => {
    component.agregarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(mockStore.setPlantasSubfabricantesAgregar).toHaveBeenCalled();
  });

  it('should not call store.setPlantasSubfabricantesAgregar if plantasPorAgrupar is falsy', () => {
    component.agregarPlantas(undefined as any);
    expect(mockStore.setPlantasSubfabricantesAgregar).not.toHaveBeenCalled();
  });

  it('should run datosDelSubfabricantePorEliminar and set listaDeSubfabricantesPorEliminar', () => {
    component.datosDelSubfabricantePorEliminar([{ rfc: 'RFC', estado: '01' }]);
    expect(component.listaDeSubfabricantesPorEliminar.length).toBe(1);
  });

  it('should run eliminarPlantas and call store.eliminarPlantas', () => {
    component.eliminarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(mockStore.eliminarPlantas).toHaveBeenCalled();
  });

  it('should not call store.eliminarPlantas if plantasPorEliminar is falsy', () => {
    component.eliminarPlantas(undefined as any);
    expect(mockStore.eliminarPlantas).not.toHaveBeenCalled();
  });

  it('should run complementarPlantas and call store.setPlantasPorCompletar and setindicePrevioRuta', () => {
    component.tabIndex = 1;
    component.complementarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(mockStore.setPlantasPorCompletar).toHaveBeenCalled();
    expect(mockStore.setindicePrevioRuta).toHaveBeenCalledWith(1);
  });

  it('should run complementarPlantas and not call setindicePrevioRuta if tabIndex is falsy', () => {
    component.tabIndex = 0;
    component.complementarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(mockStore.setPlantasPorCompletar).toHaveBeenCalled();
    expect(mockStore.setindicePrevioRuta).not.toHaveBeenCalled();
  });

  it('should run ngOnDestroy and complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn((component as any)['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn((component as any)['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
describe('EmpresasSubfabricanteComponent (80102) - Unit', () => {
  let component: EmpresasSubfabricanteComponent;
  let mockAutorizacionProgrmaNuevoService: any;
  let mockFormBuilder: any;
  let mockQuery: any;
  let mockStore: any;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockConsultaQuery: any;
  let mockComplimentosService: any;

  beforeEach(() => {
    mockAutorizacionProgrmaNuevoService = {
      obtenerListaEstado: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ data: [{ clave: '01', nombre: 'Estado' }] }))
      })
    };
    mockFormBuilder = {
      group: jest.fn().mockReturnValue({
        get: jest.fn((key) => ({
          value: key === 'rfc' ? 'RFC' : key === 'estado' ? '01' : ''
        })),
        setValue: jest.fn(),
        patchValue: jest.fn(),
        valid: true,
        value: { rfc: 'RFC', estado: '01' }
      })
    };
    mockQuery = {
      datosSubcontratistaEstado$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ rfc: 'RFC', estado: '01' }))
      },
      plantasBuscadas$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb([{ rfc: 'RFC', estado: '01' }]))
      },
      plantasSubfabricantesAgregar$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb([{ rfc: 'RFC', estado: '01' }]))
      }
    };
    mockStore = {
      setFormValida: jest.fn(),
      setDatosSubcontratista: jest.fn(),
      setPlantasBuscadas: jest.fn(),
      setPlantasSubfabricantesAgregar: jest.fn(),
      eliminarPlantas: jest.fn(),
      setPlantasPorCompletar: jest.fn(),
      setindicePrevioRuta: jest.fn()
    };
    mockRouter = { navigate: jest.fn() };
    mockActivatedRoute = {};
    mockConsultaQuery = {
      selectConsultaioState$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ readonly: false }))
      }
    };
    mockComplimentosService = {
      getSubfabricantesDisponibles: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn((cb) => cb({ datos: [{ rfc: 'RFC', estado: '01' }] }))
      }),
      mapApiResponseToPlantasSubfabricante: jest.fn().mockReturnValue([{ rfc: 'RFC', estado: '01' }])
    };

    component = new EmpresasSubfabricanteComponent(
      mockAutorizacionProgrmaNuevoService,
      mockFormBuilder,
      mockQuery,
      mockStore,
      mockRouter,
      mockActivatedRoute,
      mockConsultaQuery,
      mockComplimentosService
    );
    component.formularioDatosSubcontratista = mockFormBuilder.group();
    component.store = mockStore;
    component.query = mockQuery;
    component._compartidaSvc = mockComplimentosService;
    component.AutorizacionProgrmaNuevoServiceServicios = mockAutorizacionProgrmaNuevoService;
  });

  it('should create and initialize formularioDatosSubcontratista', () => {
    expect(component).toBeTruthy();
    expect(component.formularioDatosSubcontratista).toBeDefined();
  });

  it('should set esFormularioSoloLectura from consultaQuery', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should run ngOnInit and call obtenerDatosDelAlmacen and obtenerListaEstado', () => {
    const spyDatos = jest.spyOn(component, 'obtenerDatosDelAlmacen');
    const spyLista = jest.spyOn(component, 'obtenerListaEstado');
    component.ngOnInit();
    expect(spyDatos).toHaveBeenCalled();
    expect(spyLista).toHaveBeenCalled();
  });

  it('should run obtenerDatosDelAlmacen and set form values and arrays', () => {
    component.obtenerDatosDelAlmacen();
    expect(component.formularioDatosSubcontratista.setValue).toHaveBeenCalled();
    expect(component.store.setFormValida).toHaveBeenCalled();
    expect(component.datosTablaSubfabricantesDisponibles.length).toBeGreaterThan(0);
    expect(component.datosSubfabricanteParaSerAgregados.length).toBeGreaterThan(0);
  });

  it('should run enEstadoSeleccionado and update form and store', () => {
    const estado = { clave: '02', nombre: 'Nuevo Estado' };
    component.enEstadoSeleccionado(estado as any);
    expect(component.formularioDatosSubcontratista.patchValue).toHaveBeenCalled();
    expect(component.store.setDatosSubcontratista).toHaveBeenCalled();
  });

  it('should run alCambiarRFC and call store.setDatosSubcontratista', () => {
    component.alCambiarRFC({ rfc: 'RFC', estado: '01' });
    expect(component.store.setDatosSubcontratista).toHaveBeenCalled();
  });

  it('should not call store.setDatosSubcontratista if datosSubcontratista is falsy', () => {
    component.alCambiarRFC(undefined as any);
    expect(component.store.setDatosSubcontratista).not.toHaveBeenCalledWith(undefined);
  });

  it('should run inicializarFormularioDatosSubcontratista and set formularioDatosSubcontratista', () => {
    component.fb = mockFormBuilder as any;
    component.inicializarFormularioDatosSubcontratista();
    expect(component.formularioDatosSubcontratista).toBeDefined();
  });

  it('should run obtenerListaEstado and set estadoCatalogo', () => {
    component.obtenerListaEstado();
    expect(component.AutorizacionProgrmaNuevoServiceServicios.obtenerListaEstado).toHaveBeenCalled();
    expect(component.estadoCatalogo.length).toBeGreaterThan(0);
  });

  it('should run obtenerSubfabricantesDisponibles and set store.setPlantasBuscadas', () => {
    component.obtenerSubfabricantesDisponibles();
    expect(component._compartidaSvc.getSubfabricantesDisponibles).toHaveBeenCalled();
    expect(component._compartidaSvc.mapApiResponseToPlantasSubfabricante).toHaveBeenCalled();
    expect(component.store.setPlantasBuscadas).toHaveBeenCalled();
  });

  it('should run obtenerRegistroSeleccionado and set datosDelSubfabricanteSeleccionado', () => {
    component.obtenerRegistroSeleccionado([{ rfc: 'RFC', estado: '01' }]);
    expect(component.datosDelSubfabricanteSeleccionado.length).toBe(1);
  });

  it('should not set datosDelSubfabricanteSeleccionado if event is empty', () => {
    component.datosDelSubfabricanteSeleccionado = [];
    component.obtenerRegistroSeleccionado([]);
    expect(component.datosDelSubfabricanteSeleccionado.length).toBe(0);
  });

  it('should run realizarBusqueda and call obtenerSubfabricantesDisponibles and store.setFormValida', () => {
    component.obtenerSubfabricantesDisponibles = jest.fn();
    component.realizarBusqueda();
    expect(component.obtenerSubfabricantesDisponibles).toHaveBeenCalled();
    expect(component.store.setFormValida).toHaveBeenCalledWith({ submanufacturas: true });
  });

  it('should not call obtenerSubfabricantesDisponibles if form fields are empty', () => {
    component.formularioDatosSubcontratista = {
      get: jest.fn().mockReturnValue({ value: '' })
    } as any;
    component.obtenerSubfabricantesDisponibles = jest.fn();
    component.realizarBusqueda();
    expect(component.obtenerSubfabricantesDisponibles).not.toHaveBeenCalled();
  });

  it('should run agregarPlantas and call store.setPlantasSubfabricantesAgregar', () => {
    component.agregarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(component.store.setPlantasSubfabricantesAgregar).toHaveBeenCalled();
  });

  it('should not call store.setPlantasSubfabricantesAgregar if plantasPorAgrupar is falsy', () => {
    component.agregarPlantas(undefined as any);
    expect(component.store.setPlantasSubfabricantesAgregar).not.toHaveBeenCalled();
  });

  it('should run datosDelSubfabricantePorEliminar and set listaDeSubfabricantesPorEliminar', () => {
    component.datosDelSubfabricantePorEliminar([{ rfc: 'RFC', estado: '01' }]);
    expect(component.listaDeSubfabricantesPorEliminar.length).toBe(1);
  });

  it('should run eliminarPlantas and call store.eliminarPlantas', () => {
    component.eliminarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(component.store.eliminarPlantas).toHaveBeenCalled();
  });

  it('should not call store.eliminarPlantas if plantasPorEliminar is falsy', () => {
    component.eliminarPlantas(undefined as any);
    expect(component.store.eliminarPlantas).not.toHaveBeenCalled();
  });

  it('should run complementarPlantas and call store.setPlantasPorCompletar and setindicePrevioRuta', () => {
    component.tabIndex = 1;
    component.complementarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(component.store.setPlantasPorCompletar).toHaveBeenCalled();
    expect(component.store.setindicePrevioRuta).toHaveBeenCalledWith(1);
  });

  it('should run complementarPlantas and not call setindicePrevioRuta if tabIndex is falsy', () => {
    component.tabIndex = 0;
    component.complementarPlantas([{ rfc: 'RFC', estado: '01' }]);
    expect(component.store.setPlantasPorCompletar).toHaveBeenCalled();
    expect(component.store.setindicePrevioRuta).not.toHaveBeenCalled();
  });

  it('should run ngOnDestroy and complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn((component as any)['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn((component as any)['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
});