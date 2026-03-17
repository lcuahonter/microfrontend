import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { TipoDeAvisoComponent } from './tipo-de-aviso.component';
import { CatalogosService } from '../../servicios/catalogo.service';
import { HechosTablaServicios } from '../../servicios/hechos-tabla.service';
import { TramiteStoreQuery } from '../../estados/tramite32516Query.query';
import { TramiteState, TramiteStore } from '../../estados/tramite32516Store.store';
import { Catalogo, SeccionLibQuery } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { HechosDatosTabla } from '../../modelos/acta-de-hechos.model';

describe('TipoDeAvisoComponent', () => {
  let component: TipoDeAvisoComponent;
  let fixture: ComponentFixture<TipoDeAvisoComponent>;
  let mockFormBuilder: jest.Mocked<FormBuilder>;
  let mockCatalogosService: jest.Mocked<CatalogosService>;
  let mockHechosTablaServicios: jest.Mocked<HechosTablaServicios>;
  let mockRouter: jest.Mocked<Router>;
  let mockTramiteStoreQuery: jest.Mocked<TramiteStoreQuery>;
  let mockTramiteStore: jest.Mocked<TramiteStore>;
  let mockSeccionQuery: jest.Mocked<SeccionLibQuery>;
  let mockChangeDetectorRef: jest.Mocked<ChangeDetectorRef>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockLocation: jest.Mocked<Location>;

  const mockCatalogos: Catalogo[] = [
    { id: 1, descripcion: 'Opción 1' },
    { id: 2, descripcion: 'Opción 2' }
  ];

  const mockTramiteState: TramiteState = {
    descripcionGenerica1: 'Descripción 1',
    descripcionGenerica2: 'Descripción 2',
    descripcionGenerica3: 'Descripción 3',
    capacidadAlmacenamiento: true,
    cantidadBienes: false,
    tableDatos: []
  };

  const mockHechosDatos: HechosDatosTabla = {
    consecutivo: '001',
    descripcion: 'Descripción test',
    descripcionDeMercancia: '100',
    cantidad: '100',
    unidadMedida: 'KG',
    peso: '50'
  };

  beforeEach(async () => {
    const catalogosServiceSpy = {
      obtenerMenuDesplegable: jest.fn(),
      obtenerLevantarActaDesplegable: jest.fn(),
      obtenerUnidadDesplegable: jest.fn(),
      RadioOpcion: [
        { label: 'Sí', value: 'si' },
        { label: 'No', value: 'no' }
      ]
    };

    const routerSpy = {
      navigate: jest.fn(),
      url: '/agace/test'
    };

    const tramiteStoreQuerySpy = {
      selectSolicitudTramite$: new BehaviorSubject(mockTramiteState)
    };

    const tramiteStoreSpy = {
      setHechosTablaDatos: jest.fn()
    };

    const consultaioQuerySpy = {
      selectConsultaioState$: new BehaviorSubject({ readonly: false })
    };

    const seccionQuerySpy = {
      selectAll: jest.fn()
    };

    const hechosTablaServiciosSpy = {
      getData: jest.fn()
    };

    const changeDetectorRefSpy = {
      detectChanges: jest.fn()
    };

    const locationSpy = {
      back: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TipoDeAvisoComponent],
      providers: [
        FormBuilder,
        { provide: CatalogosService, useValue: catalogosServiceSpy },
        { provide: HechosTablaServicios, useValue: hechosTablaServiciosSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TramiteStoreQuery, useValue: tramiteStoreQuerySpy },
        { provide: TramiteStore, useValue: tramiteStoreSpy },
        { provide: SeccionLibQuery, useValue: seccionQuerySpy },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy },
        { provide: ConsultaioQuery, useValue: consultaioQuerySpy },
        { provide: Location, useValue: locationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TipoDeAvisoComponent);
    component = fixture.componentInstance;
    
    mockFormBuilder = TestBed.inject(FormBuilder) as jest.Mocked<FormBuilder>;
    mockCatalogosService = TestBed.inject(CatalogosService) as jest.Mocked<CatalogosService>;
    mockHechosTablaServicios = TestBed.inject(HechosTablaServicios) as jest.Mocked<HechosTablaServicios>;
    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
    mockTramiteStoreQuery = TestBed.inject(TramiteStoreQuery) as jest.Mocked<TramiteStoreQuery>;
    mockTramiteStore = TestBed.inject(TramiteStore) as jest.Mocked<TramiteStore>;
    mockSeccionQuery = TestBed.inject(SeccionLibQuery) as jest.Mocked<SeccionLibQuery>;
    mockChangeDetectorRef = TestBed.inject(ChangeDetectorRef) as jest.Mocked<ChangeDetectorRef>;
    mockConsultaioQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;
    mockLocation = TestBed.inject(Location) as jest.Mocked<Location>;

    mockCatalogosService.obtenerMenuDesplegable.mockReturnValue(of(mockCatalogos));
    mockCatalogosService.obtenerLevantarActaDesplegable.mockReturnValue(of(mockCatalogos));
    mockCatalogosService.obtenerUnidadDesplegable.mockReturnValue(of(mockCatalogos));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.unidadMedida).toEqual([]);
      expect(component.datosTabla).toEqual([]);
      expect(component.actaDeHechos).toEqual([]);
      expect(component.levantarActa).toEqual([]);
      expect(component.tablaSeleccionCheckbox).toBe(TablaSeleccion.CHECKBOX);
      expect(component.hechosTableDatos).toEqual([]);
      expect(component.filasSeleccionadas).toEqual([]);
      expect(component.radioOpcion).toEqual([]);
    });

    it('should set esFormularioSoloLectura from consultaioQuery on construction', () => {
      expect(component.esFormularioSoloLectura).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      jest.spyOn(component, 'obtenerHechosSelectList').mockImplementation(() => {});
      jest.spyOn(component, 'obtenerLevantarActaDesplegables').mockImplementation(() => {});
      jest.spyOn(component, 'obtenerUnidadDesplegable').mockImplementation(() => {});
    });

    it('should initialize all required data on ngOnInit', () => {
      component.ngOnInit();

      expect(component.obtenerHechosSelectList).toHaveBeenCalled();
      expect(component.obtenerLevantarActaDesplegables).toHaveBeenCalled();
      expect(component.obtenerUnidadDesplegable).toHaveBeenCalled();
      expect(component.radioOpcion).toEqual(mockCatalogosService.RadioOpcion);
    });

    it('should subscribe to tramiteStoreQuery and update component state', () => {
      component.ngOnInit();

      expect(component.solicitudState).toEqual(mockTramiteState);
      expect(component.datosTabla).toEqual([]);
    });
  });

  describe('Form Initialization', () => {
    beforeEach(() => {
      component.solicitudState = mockTramiteState;
    });

    it('should initialize solicitudForm with correct validators', () => {
      component.inicializarFormulario();

      expect(component.solicitudForm).toBeDefined();
      expect(component.solicitudForm.get('descripcionGenerica1')?.hasError('required')).toBe(false);
      expect(component.solicitudForm.get('descripcionGenerica2')?.hasError('required')).toBe(false);
      expect(component.solicitudForm.get('descripcionGenerica3')?.hasError('required')).toBe(false);
      expect(component.solicitudForm.get('capacidadAlmacenamiento')?.hasError('required')).toBe(false);
      expect(component.solicitudForm.get('cantidadBienes')?.hasError('required')).toBe(false);
    });

    it('should initialize mercanciaForm with required validators', () => {
      component.inicializarFormulario();

      expect(component.mercanciaForm).toBeDefined();
      expect(component.mercanciaForm.get('consecutivo')?.hasError('required')).toBe(true);
      expect(component.mercanciaForm.get('descripcion')?.hasError('required')).toBe(true);
      expect(component.mercanciaForm.get('cantidad')?.hasError('required')).toBe(true);
      expect(component.mercanciaForm.get('unidadMedida')?.hasError('required')).toBe(true);
      expect(component.mercanciaForm.get('peso')?.hasError('required')).toBe(true);
    });
  });

  describe('Form State Management', () => {
    beforeEach(() => {
      component.solicitudState = mockTramiteState;
      component.inicializarFormulario();
    });

    it('should call guardarDatosFormulario when esFormularioSoloLectura is true', () => {
      jest.spyOn(component, 'guardarDatosFormulario');
      component.esFormularioSoloLectura = true;

      component.inicializarEstadoFormulario();

      expect(component.guardarDatosFormulario).toHaveBeenCalled();
    });

    it('should call inicializarFormulario when esFormularioSoloLectura is false', () => {
      jest.spyOn(component, 'inicializarFormulario');
      component.esFormularioSoloLectura = false;

      component.inicializarEstadoFormulario();

      expect(component.inicializarFormulario).toHaveBeenCalled();
    });

    it('should disable form when esFormularioSoloLectura is true in guardarDatosFormulario', () => {
      component.esFormularioSoloLectura = true;

      component.guardarDatosFormulario();

      expect(component.solicitudForm.disabled).toBe(true);
    });

    it('should enable form when esFormularioSoloLectura is false in guardarDatosFormulario', () => {
      component.esFormularioSoloLectura = false;

      component.guardarDatosFormulario();

      expect(component.solicitudForm.enabled).toBe(true);
    });
  });

  describe('Catalog Methods', () => {
    it('should obtain acta de hechos list', () => {
      component.obtenerHechosSelectList();

      expect(mockCatalogosService.obtenerMenuDesplegable).toHaveBeenCalledWith('acta-de-hechos.json');
    });

    it('should obtain levantar acta list', () => {
      component.obtenerLevantarActaSelectList();

      expect(mockCatalogosService.obtenerLevantarActaDesplegable).toHaveBeenCalledWith('levantar.json');
    });

    it('should obtain unidad medida list', () => {
      component.obtenerUnidadMedidaSelectList();

      expect(mockCatalogosService.obtenerUnidadDesplegable).toHaveBeenCalledWith('unidad-de-medida.json');
    });

    it('should update actaDeHechos when obtenerHechosSelectList succeeds', () => {
      component.obtenerHechosSelectList();

      expect(component.actaDeHechos).toEqual(mockCatalogos);
    });

    it('should update levantarActa when obtenerLevantarActaSelectList succeeds', () => {
      component.obtenerLevantarActaSelectList();

      expect(component.levantarActa).toEqual(mockCatalogos);
    });

    it('should update unidadMedida when obtenerUnidadMedidaSelectList succeeds', () => {
      component.obtenerUnidadMedidaSelectList();

      expect(component.unidadMedida).toEqual(mockCatalogos);
    });
  });

  describe('Navigation', () => {
    it('should navigate to pago route when URL contains pago', () => {
      Object.defineProperty(mockRouter, 'url', {
        value: '/pago/test',
        writable: true
      });

      component.irAPaginaAgregar();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/pago/acta-de-hechos/mercancias-destruidas-forma']);
    });

    it('should navigate to agace route when URL does not contain pago', () => {
      Object.defineProperty(mockRouter, 'url', {
        value: '/agace/test',
        writable: true
      });

      component.irAPaginaAgregar();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/agace/acta-de-hechos/mercancias-destruidas-forma']);
    });
  });

  describe('Table Management', () => {
    it('should update filasSeleccionadas when onSeleccionChange is called', () => {
      const testData = [mockHechosDatos];

      component.onSeleccionChange(testData);

      expect(component.filasSeleccionadas).toEqual(testData);
    });
  });

  describe('Mercancia Management', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      component.unidadMedida = mockCatalogos;
    });

    it('should reset mercanciaForm when cancelarMercancia is called', () => {
      component.mercanciaForm.patchValue({
        consecutivo: '001',
        descripcion: 'Test'
      });

      component.cancelarMercancia();

      expect(component.mercanciaForm.get('consecutivo')?.value).toBe(null);
      expect(component.mercanciaForm.get('descripcion')?.value).toBe(null);
    });

    it('should add mercancia when form is valid', () => {
      jest.spyOn(component as any, 'actualizarDatosEnStore');
      component.mercanciaForm.patchValue({
        consecutivo: '001',
        descripcion: 'Test descripción',
        cantidad: '100',
        unidadMedida: '1',
        peso: '50'
      });

      component.agregarMercancia();

      expect(component.datosTabla.length).toBe(1);
      expect((component as any).actualizarDatosEnStore).toHaveBeenCalled();
    });

    it('should reset form when mercanciaForm is valid', () => {
      jest.spyOn(component.mercanciaForm, 'reset');
      component.mercanciaForm.patchValue({
        consecutivo: '001',
        descripcion: 'Test descripción',
        cantidad: '100',
        unidadMedida: '1',
        peso: '50'
      });

      component.agregarMercancia();

      expect(component.mercanciaForm.reset).toHaveBeenCalled();
    });

    it('should eliminate selected rows', () => {
      jest.spyOn(component as any, 'actualizarDatosEnStore');
      component.datosTabla = [mockHechosDatos];
      component.filasSeleccionadas = [mockHechosDatos];

      component.eliminarFilasSeleccionadas();

      expect(component.datosTabla.length).toBe(0);
      expect(component.filasSeleccionadas.length).toBe(0);
      expect((component as any).actualizarDatosEnStore).toHaveBeenCalled();
    });

    it('should not eliminate rows when no rows are selected', () => {
      jest.spyOn(component as any, 'actualizarDatosEnStore');
      component.datosTabla = [mockHechosDatos];
      component.filasSeleccionadas = [];

      component.eliminarFilasSeleccionadas();

      expect(component.datosTabla.length).toBe(1);
      expect((component as any).actualizarDatosEnStore).not.toHaveBeenCalled();
    });
  });

  describe('Store Management', () => {
    it('should call tramiteStore.setHechosTablaDatos when actualizarDatosEnStore is called', () => {
      component.datosTabla = [mockHechosDatos];

      component['actualizarDatosEnStore']();

      expect(mockTramiteStore.setHechosTablaDatos).toHaveBeenCalledWith([mockHechosDatos]);
    });
  });

  describe('Component Cleanup', () => {
    it('should complete destroyNotifier$ on ngOnDestroy', () => {
      jest.spyOn(component['destroyNotifier$'], 'next');
      jest.spyOn(component['destroyNotifier$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroyNotifier$'].next).toHaveBeenCalled();
      expect(component['destroyNotifier$'].complete).toHaveBeenCalled();
    });
  });

  describe('Modal Management', () => {
    it('should click closeModal when adding mercancia if closeModal exists', () => {
      const mockElement = {
        click: jest.fn()
      };
      component.closeModal = { nativeElement: mockElement } as ElementRef;
      component.inicializarFormulario();
      component.unidadMedida = mockCatalogos;
      
      component.mercanciaForm.patchValue({
        consecutivo: '001',
        descripcion: 'Test',
        cantidad: '100',
        unidadMedida: '1',
        peso: '50'
      });

      component.agregarMercancia();

      expect(mockElement.click).toHaveBeenCalled();
    });
  });
});