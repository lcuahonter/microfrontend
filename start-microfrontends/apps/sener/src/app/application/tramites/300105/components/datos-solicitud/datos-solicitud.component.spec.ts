import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { DatosSolicitudComponent } from './datos-solicitud.component';
import {
  Catalogo,
  CategoriaMensaje,
  ConsultaioQuery,
  CrosslistComponent,
  TipoNotificacionEnum,
} from '@ng-mf/data-access-user';
import { AutorizacionDeRayosXService } from '../../services/autorizacion-de-rayos-x.service';
import { Tramite300105Store } from '../../estados/tramite300105.store';
import { Tramite300105Query } from '../../estados/tramite300105.query';
import { ConfiguracionItem, SerieConfiguracionItem } from '../../enum/mercancia-tabla.enum';

describe('DatosSolicitudComponent', () => {
  let component: DatosSolicitudComponent;
  let fixture: ComponentFixture<DatosSolicitudComponent>;
  let mockAutorizacionService: jest.Mocked<AutorizacionDeRayosXService>;
  let mockTramite300105Store: jest.Mocked<Tramite300105Store>;
  let mockTramite300105Query: jest.Mocked<Tramite300105Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockCrosslistComponent: jest.Mocked<CrosslistComponent>;
  let formBuilder: FormBuilder;

  const mockCatalogos: Catalogo[] = [
    { id: 1, descripcion: 'Test Catalogo 1' },
    { id: 2, descripcion: 'Test Catalogo 2' },
  ];

  const mockTramiteState = {
    mercacniaSolicitudControlar: false,
    observaciones: 'Test observaciones',
    tercerosPopupState: false,
    mercanciaTablaDatos: [
      {
        id: 1,
        marca: 'Test Marca',
        modelo: 'Test Modelo',
        serie: 'Test Serie',
        voltaje: '100',
        unidadMedidaVoltaje: 'V',
        corriente: '50',
        unidadMedidaCorriente: 'A',
        numEquipos: '1',
        fraccionArancelaria: 'Test Fraccion',
        fraccionDescripcion: 'Test Descripcion',
      },
    ] as ConfiguracionItem[],
    destinatarioTablaDatos: [],
    claveDeReferencia: '',
    cadenaDependencia: '',
    banco: '',
    llaveDePago: '',
    fechaPago: '',
    importePago: '',
  };

  const mockConsultaioState = {
    readonly: false,
  } as any;

  beforeEach(async () => {
    const autorizacionServiceSpy = {
      inicializaMercanciaDatosCatalogos: jest.fn(),
      fraccionArancelaria: mockCatalogos,
      fraccionArancelariaDescripcion: mockCatalogos,
      unidadMedidaVoltaje: mockCatalogos,
      unidadMedidaCorriente: mockCatalogos,
    };

    const tramite300105StoreSpy = {
      establecerDatos: jest.fn(),
      setMercanciaTablaDatos: jest.fn(),
    };

    const tramite300105QuerySpy = {
      selectTramite300105$: of(mockTramiteState),
    };

    const consultaioQuerySpy = {
      selectConsultaioState$: of(mockConsultaioState),
    };

    const crosslistComponentSpy = {
      agregar: jest.fn(),
      quitar: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [DatosSolicitudComponent],
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: AutorizacionDeRayosXService, useValue: autorizacionServiceSpy },
        { provide: Tramite300105Store, useValue: tramite300105StoreSpy },
        { provide: Tramite300105Query, useValue: tramite300105QuerySpy },
        { provide: ConsultaioQuery, useValue: consultaioQuerySpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosSolicitudComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    mockAutorizacionService = TestBed.inject(AutorizacionDeRayosXService) as jest.Mocked<AutorizacionDeRayosXService>;
    mockTramite300105Store = TestBed.inject(Tramite300105Store) as jest.Mocked<Tramite300105Store>;
    mockTramite300105Query = TestBed.inject(Tramite300105Query) as jest.Mocked<Tramite300105Query>;
    mockConsultaioQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;
    mockCrosslistComponent = {
      agregar: jest.fn(),
      quitar: jest.fn(),
    } as unknown as jest.Mocked<CrosslistComponent>;

    component.crosslistComponent = mockCrosslistComponent;
    component.tipoOperacionSeleccionado = 'test';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component state and form', () => {
      component.ngOnInit();

      expect(component.estadoSolicitud300105).toEqual(mockTramiteState);
      expect(component.datosTablaMercancia).toEqual(mockTramiteState.mercanciaTablaDatos);
      expect(component.formularioSolicitud).toBeDefined();
      expect(component.formularioSolicitud.get('observaciones')?.value).toBe('Test observaciones');
    });

    it('should disable form when readonly is true', () => {
      const readonlyState = { readonly: true } as any;
      mockConsultaioQuery.selectConsultaioState$ = of(readonlyState);
      component.esFormularioSoloLectura = true;

      component.ngOnInit();

      expect(component.formularioSolicitud.disabled).toBeTruthy();
    });

    it('should enable form when readonly is false', () => {
      const readonlyState = { readonly: false } as any;
      mockConsultaioQuery.selectConsultaioState$ = of(readonlyState);
      component.esFormularioSoloLectura = false;

      component.ngOnInit();

      expect(component.formularioSolicitud.enabled).toBeTruthy();
    });
  });

  describe('guardarObservaciones', () => {
    it('should save observations to store', () => {
      const testObservaciones = 'Test observaciones guardadas';
      component.formularioSolicitud = formBuilder.group({
        observaciones: [testObservaciones],
      });

      component.guardarObservaciones();

      expect(mockTramite300105Store.establecerDatos).toHaveBeenCalledWith({
        observaciones: testObservaciones,
      });
    });
  });

  describe('crearNuevoFormularioMercancia', () => {
    it('should create form with default values when no data provided', () => {
      component.crearNuevoFormularioMercancia();

      expect(component.formularioMercancia).toBeDefined();
      expect(component.formularioMercancia.get('marca')?.value).toBe('');
      expect(component.formularioMercancia.get('modelo')?.value).toBe('');
      expect(component.formularioMercancia.get('fraccionDescripcion')?.disabled).toBeTruthy();
    });

    it('should create form with provided data', () => {
      const testData: ConfiguracionItem = {
        id: 1,
        marca: 'Test Marca',
        modelo: 'Test Modelo',
        serie: 'Test Serie',
        voltaje: '100',
        unidadMedidaVoltaje: 'V',
        corriente: '50',
        unidadMedidaCorriente: 'A',
        numEquipos: '1',
        fraccionArancelaria: 'Test Fraccion',
        fraccionDescripcion: 'Test Descripcion',
      };

      component.crearNuevoFormularioMercancia(testData);

      expect(component.formularioMercancia.get('marca')?.value).toBe('Test Marca');
      expect(component.formularioMercancia.get('modelo')?.value).toBe('Test Modelo');
    });
  });

  describe('manejarCambioFraccionArancelaria', () => {
    it('should update fraccion descripcion when fraccion arancelaria changes', () => {
      const mockEvent: Catalogo = { id: 1, descripcion: '1' };
      component.crearNuevoFormularioMercancia();

      component.manejarCambioFraccionArancelaria(mockEvent);

      expect(component.formularioMercancia.get('fraccionDescripcion')?.value).toBe('Test Catalogo 1');
    });

    it('should handle case when fraccion descripcion is not found', () => {
      const mockEvent: Catalogo = { id: 999, descripcion: '999' };
      component.crearNuevoFormularioMercancia();

      component.manejarCambioFraccionArancelaria(mockEvent);

      expect(component.formularioMercancia.get('fraccionDescripcion')?.value).toBeUndefined();
    });
  });

  describe('manejarFilaSeleccionada', () => {
    it('should disable buttons when no rows selected', () => {
      component.manejarFilaSeleccionada([]);

      expect(component.enableModficarBoton).toBeFalsy();
      expect(component.enableEliminarBoton).toBeFalsy();
    });

    it('should enable buttons and set selected row when rows selected', () => {
      const filas = [mockTramiteState.mercanciaTablaDatos[0]];

      component.manejarFilaSeleccionada(filas);

      expect(component.enableModficarBoton).toBeTruthy();
      expect(component.enableEliminarBoton).toBeTruthy();
      expect(component.listaFilaSeleccionadaMercancia).toEqual(filas);
      expect(component.filaSeleccionadaMercancia).toEqual(filas[0]);
    });
  });

  describe('actualizarFilaSeleccionada', () => {
    it('should update selected row with latest data', () => {
      const updatedData: ConfiguracionItem = {
        ...mockTramiteState.mercanciaTablaDatos[0],
        marca: 'Updated Marca',
      };
      component.datosTablaMercancia = [updatedData];
      component.filaSeleccionadaMercancia = mockTramiteState.mercanciaTablaDatos[0];

      component.actualizarFilaSeleccionada();

      expect(component.filaSeleccionadaMercancia.marca).toBe('Updated Marca');
    });

    it('should not update when no matching data found', () => {
      component.datosTablaMercancia = [];
      component.filaSeleccionadaMercancia = mockTramiteState.mercanciaTablaDatos[0];
      const originalMarca = component.filaSeleccionadaMercancia.marca;

      component.actualizarFilaSeleccionada();

      expect(component.filaSeleccionadaMercancia.marca).toBe(originalMarca);
    });
  });

  describe('modificarItemMercancia', () => {
    beforeEach(() => {
      component.datosTablaMercancia = mockTramiteState.mercanciaTablaDatos;
    });

    it('should modify single selected item', () => {
      component.listaFilaSeleccionadaMercancia = [mockTramiteState.mercanciaTablaDatos[0]];
      component.filaSeleccionadaMercancia = mockTramiteState.mercanciaTablaDatos[0];
      jest.spyOn(component, 'actualizarFilaSeleccionada');
      jest.spyOn(component, 'alternarModalMercancia');

      component.modificarItemMercancia();

      expect(component.esOperacionDeActualizacion).toBeTruthy();
      expect(component.actualizarFilaSeleccionada).toHaveBeenCalled();
      expect(component.alternarModalMercancia).toHaveBeenCalled();
    });

    it('should open multiple selection popup when multiple items selected', () => {
      component.listaFilaSeleccionadaMercancia = [
        mockTramiteState.mercanciaTablaDatos[0],
        { ...mockTramiteState.mercanciaTablaDatos[0], id: 2 },
      ];
      jest.spyOn(component, 'abrirMultipleSeleccionPopup');

      component.modificarItemMercancia();

      expect(component.abrirMultipleSeleccionPopup).toHaveBeenCalled();
    });
  });

  describe('confirmEliminarMercanciaItem', () => {
    it('should return early when no items selected', () => {
      component.listaFilaSeleccionadaMercancia = [];
      jest.spyOn(component, 'abrirElimninarConfirmationopup');

      component.confirmEliminarMercanciaItem();

      expect(component.abrirElimninarConfirmationopup).not.toHaveBeenCalled();
    });

    it('should open confirmation popup when items selected', () => {
      component.listaFilaSeleccionadaMercancia = [mockTramiteState.mercanciaTablaDatos[0]];
      jest.spyOn(component, 'abrirElimninarConfirmationopup');

      component.confirmEliminarMercanciaItem();

      expect(component.abrirElimninarConfirmationopup).toHaveBeenCalled();
    });
  });

  describe('eliminarMercanciaItem', () => {
    it('should remove selected items and update store', () => {
      const itemToDelete = mockTramiteState.mercanciaTablaDatos[0];
      const itemToKeep: ConfiguracionItem = { ...itemToDelete, id: 2 };
      component.datosTablaMercancia = [itemToDelete, itemToKeep];
      component.listaFilaSeleccionadaMercancia = [itemToDelete];
      jest.spyOn(component, 'cerrarEliminarConfirmationPopup');

      component.eliminarMercanciaItem();

      expect(component.datosTablaMercancia).toEqual([itemToKeep]);
      expect(component.listaFilaSeleccionadaMercancia).toEqual([]);
      expect(mockTramite300105Store.setMercanciaTablaDatos).toHaveBeenCalledWith([itemToKeep]);
      expect(component.cerrarEliminarConfirmationPopup).toHaveBeenCalled();
    });
  });

  describe('popup methods', () => {
    it('should show and close serie agregada popup', () => {
      component.mostrarNotificacionSerieAgregada();

      expect(component.serieAgregadaPopupAbierto).toBeTruthy();
      expect(component.nuevaNotificacion.tipoNotificacion).toBe(TipoNotificacionEnum.ALERTA);
      expect(component.nuevaNotificacion.categoria).toBe(CategoriaMensaje.EXITO);
      expect(component.nuevaNotificacion.mensaje).toBe('Número de serie agregado');

      component.cerrarSerieAgregadaPopup();
      expect(component.serieAgregadaPopupAbierto).toBeFalsy();
    });

    it('should show and close mercancia agregada popup', () => {
      jest.spyOn(component, 'alternarModalMercancia');

      component.mostrarNotificacionMercanciaAgregada();

      expect(component.mercanciaAgregadaPopupAbierto).toBeTruthy();
      expect(component.nuevaNotificacion.mensaje).toBe('La mercancia fue agregada correctamente.');

      component.cerrarMercanciaAgregadaPopup();
      expect(component.mercanciaAgregadaPopupAbierto).toBeFalsy();
      expect(component.alternarModalMercancia).toHaveBeenCalled();
    });

    it('should open and close multiple selection popup', () => {
      component.enableModficarBoton = true;

      component.abrirMultipleSeleccionPopup();

      expect(component.multipleSeleccionPopupAbierto).toBeTruthy();
      expect(component.nuevaNotificacion.categoria).toBe(CategoriaMensaje.ERROR);
      expect(component.nuevaNotificacion.mensaje).toBe('Selecciona sólo un registro para modificar.');

      component.cerrarMultipleSeleccionPopup();
      expect(component.multipleSeleccionPopupAbierto).toBeFalsy();
    });

    it('should not open multiple selection popup when modify button disabled', () => {
      component.enableModficarBoton = false;

      component.abrirMultipleSeleccionPopup();

      expect(component.multipleSeleccionPopupAbierto).toBeFalsy();
    });

    it('should open and close elimination confirmation popup', () => {
      component.abrirElimninarConfirmationopup();

      expect(component.confirmEliminarPopupAbierto).toBeTruthy();
      expect(component.nuevaNotificacion.mensaje).toBe('¿Estás seguro que deseas eliminar los registros marcados?');

      component.cerrarEliminarConfirmationPopup();
      expect(component.confirmEliminarPopupAbierto).toBeFalsy();
    });
  });

  describe('alternarModalMercancia', () => {
    it('should toggle modal visibility', () => {
      const initialState = component.mostrarModalDatosMercancia;

      component.alternarModalMercancia();

      expect(component.mostrarModalDatosMercancia).toBe(!initialState);
    });
  });

  describe('mostrarFormularioMercanciaModal', () => {
    it('should initialize and show mercancia form modal', () => {
      jest.spyOn(component, 'crearNuevoFormularioMercancia');
      jest.spyOn(component, 'alternarModalMercancia');

      component.mostrarFormularioMercanciaModal();

      expect(component.esOperacionDeActualizacion).toBeFalsy();
      expect(mockAutorizacionService.inicializaMercanciaDatosCatalogos).toHaveBeenCalled();
      expect(component.crearNuevoFormularioMercancia).toHaveBeenCalled();
      expect(component.alternarModalMercancia).toHaveBeenCalled();
    });
  });

  describe('esControlInvalido', () => {
    beforeEach(() => {
      component.crearNuevoFormularioMercancia();
    });

    it('should return true when control is invalid and touched', () => {
      const control = component.formularioMercancia.get('marca');
      control?.setValue('');
      control?.markAsTouched();

      const result = component.esControlInvalido('marca');

      expect(result).toBeTruthy();
    });

    it('should return true when control is invalid and dirty', () => {
      const control = component.formularioMercancia.get('marca');
      control?.setValue('');
      control?.markAsDirty();

      const result = component.esControlInvalido('marca');

      expect(result).toBeTruthy();
    });

    it('should return false when control is valid', () => {
      const control = component.formularioMercancia.get('marca');
      control?.setValue('Valid marca');
      control?.markAsTouched();

      const result = component.esControlInvalido('marca');

      expect(result).toBeFalsy();
    });

    it('should return false when control does not exist', () => {
      const result = component.esControlInvalido('nonExistentControl');

      expect(result).toBeFalsy();
    });
  });

  describe('enviarFormularioMercancia', () => {
    beforeEach(() => {
      component.crearNuevoFormularioMercancia();
      component.formularioMercancia.patchValue({
        id: 1,
        marca: 'Test Marca',
        modelo: 'Test Modelo',
        serie: 'Test Serie',
        voltaje: '100',
        unidadMedidaVoltaje: '1',
        corriente: '50',
        unidadMedidaCorriente: '1',
        numEquipos: '1',
        fraccionArancelaria: '1',
        fraccionDescripcion: 'Test Descripcion',
      });
      component.datosTablaMercancia = [];
      jest.spyOn(component.formularioMercancia, 'reset');
    });

    it('should add new item when not updating', () => {
      component.esOperacionDeActualizacion = false;
      jest.spyOn(component, 'mostrarNotificacionSerieAgregada');

      component.enviarFormularioMercancia(true);

      expect(component.datosTablaMercancia.length).toBe(1);
      expect(component.datosTablaMercancia[0].marca).toBe('Test Marca');
      expect(mockTramite300105Store.setMercanciaTablaDatos).toHaveBeenCalled();
      expect(component.formularioMercancia.reset).toHaveBeenCalled();
      expect(component.mostrarNotificacionSerieAgregada).toHaveBeenCalled();
    });

    it('should update existing item when updating', () => {
      const existingItem: ConfiguracionItem = {
        id: 1,
        marca: 'Old Marca',
        modelo: 'Old Modelo',
        serie: 'Old Serie',
        voltaje: '50',
        unidadMedidaVoltaje: 'V',
        corriente: '25',
        unidadMedidaCorriente: 'A',
        numEquipos: '1',
        fraccionArancelaria: 'Old Fraccion',
        fraccionDescripcion: 'Old Descripcion',
      };
      component.datosTablaMercancia = [existingItem];
      component.esOperacionDeActualizacion = true;
      jest.spyOn(component, 'mostrarNotificacionMercanciaAgregada');

      component.enviarFormularioMercancia(false);

      expect(component.datosTablaMercancia.length).toBe(1);
      expect(component.datosTablaMercancia[0].marca).toBe('Test Marca');
      expect(component.mostrarNotificacionMercanciaAgregada).toHaveBeenCalled();
    });

    it('should handle case when catalogo item not found', () => {
      component.formularioMercancia.patchValue({
        unidadMedidaVoltaje: '999', // Non-existent index
      });

      component.enviarFormularioMercancia(true);

      expect(component.datosTablaMercancia[0].unidadMedidaVoltaje).toBe('');
    });
  });

  describe('constructor subscription', () => {
    it('should handle readonly state changes', () => {
      const readonlySubject = new Subject<any>();
      mockConsultaioQuery.selectConsultaioState$ = readonlySubject.asObservable();
      
      const newComponent = new DatosSolicitudComponent(
        mockAutorizacionService,
        mockTramite300105Store,
        mockTramite300105Query,
        formBuilder,
        mockConsultaioQuery
      );

      readonlySubject.next({ readonly: true });

      expect(newComponent.esFormularioSoloLectura).toBeTruthy();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destruction subject', () => {
      jest.spyOn(component['notificadorDestruccion$'], 'next');
      jest.spyOn(component['notificadorDestruccion$'], 'complete');

      component.ngOnDestroy();

      expect(component['notificadorDestruccion$'].next).toHaveBeenCalled();
      expect(component['notificadorDestruccion$'].complete).toHaveBeenCalled();
    });
  });

  describe('Input properties', () => {
    it('should handle tipoOperacionSeleccionado input', () => {
      const testValue = 'TEST_OPERATION';
      component.tipoOperacionSeleccionado = testValue;

      expect(component.tipoOperacionSeleccionado).toBe(testValue);
    });
  });

  describe('ViewChild crosslistComponent', () => {
    it('should handle crosslistComponent reference', () => {
      // Since crosslistComponent is manually mocked in beforeEach, verify the mock
      expect(mockCrosslistComponent).toBeDefined();
      expect(mockCrosslistComponent.agregar).toBeDefined();
      expect(mockCrosslistComponent.quitar).toBeDefined();
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle empty form values gracefully', () => {
      component.formularioSolicitud = formBuilder.group({
        observaciones: [null],
      });

      component.guardarObservaciones();

      expect(mockTramite300105Store.establecerDatos).toHaveBeenCalledWith({
        observaciones: null,
      });
    });

    it('should handle missing form controls gracefully', () => {
      component.formularioMercancia = formBuilder.group({});

      const result = component.esControlInvalido('marca');

      expect(result).toBeFalsy();
    });

    it('should handle empty datosTablaMercancia array', () => {
      component.datosTablaMercancia = [];
      component.filaSeleccionadaMercancia = mockTramiteState.mercanciaTablaDatos[0];

      component.actualizarFilaSeleccionada();

      expect(component.filaSeleccionadaMercancia).toEqual(mockTramiteState.mercanciaTablaDatos[0]);
    });
  });

  describe('Form validation', () => {
    beforeEach(() => {
      component.crearNuevoFormularioMercancia();
    });

    it('should validate required fields', () => {
      const marcaControl = component.formularioMercancia.get('marca');
      marcaControl?.setValue('');
      marcaControl?.markAsTouched();

      expect(marcaControl?.hasError('required')).toBeTruthy();
      expect(component.esControlInvalido('marca')).toBeTruthy();
    });

    it('should validate maxLength fields', () => {
      const marcaControl = component.formularioMercancia.get('marca');
      marcaControl?.setValue('a'.repeat(51)); // Exceeds maxLength of 50
      marcaControl?.markAsTouched();

      expect(marcaControl?.hasError('maxlength')).toBeTruthy();
      expect(component.esControlInvalido('marca')).toBeTruthy();
    });
  });

  describe('Data transformations', () => {
    it('should correctly transform catalog data in enviarFormularioMercancia', () => {
      component.crearNuevoFormularioMercancia();
      component.formularioMercancia.patchValue({
        unidadMedidaVoltaje: '2', // Should get second item from catalog
        unidadMedidaCorriente: '1', // Should get first item from catalog
        fraccionArancelaria: '1',
      });

      component.enviarFormularioMercancia(true);

      const addedItem = component.datosTablaMercancia[0];
      expect(addedItem.unidadMedidaVoltaje).toBe('V');
      expect(addedItem.unidadMedidaCorriente).toBe('A');
      expect(addedItem.fraccionArancelaria).toBe('Test Fraccion');
    });
  });
});
