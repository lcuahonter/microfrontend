import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CertificadoOrigenComponent, FECHA_INICIO, FECHA_FINAL } from './certificado-origen.component';
import { Tramite110223Store, TramiteState } from '../../estados/Tramite110223.store';
import { Tramite110223Query } from '../../query/tramite110223.query';
import { CertificadosOrigenService } from '../../services/certificado-origen.service';
import { 
  Catalogo, 
  ConsultaioQuery, 
  SeccionLibQuery, 
  SeccionLibStore, 
  CatalogoServices,
  TablaSeleccion 
} from '@libs/shared/data-access-user/src';
import { Mercancia } from '../../../../shared/models/modificacion.enum';
import { provideHttpClient } from '@angular/common/http';

describe('CertificadoOrigenComponent', () => {
  let component: CertificadoOrigenComponent;
  let fixture: ComponentFixture<CertificadoOrigenComponent>;
  let mockStore: jest.Mocked<Tramite110223Store>;
  let mockQuery: jest.Mocked<Tramite110223Query>;
  let mockCertificadoService: jest.Mocked<CertificadosOrigenService>;
  let mockToastr: jest.Mocked<ToastrService>;
  let mockSeccionQuery: jest.Mocked<SeccionLibQuery>;
  let mockSeccionStore: jest.Mocked<SeccionLibStore>;
  let mockConsultaQuery: jest.Mocked<ConsultaioQuery>;
  let mockCatalogoServices: jest.Mocked<CatalogoServices>;

  const mockCatalogo: Catalogo = {
    id: 1,
    clave: 'TEST',
    descripcion: 'Test Catalogo'
  };

  const mockMercancia: Mercancia = {
    id: 123,
    fraccionArancelaria: '123456',
    numeroDeRegistrodeProductos: 'REG001',
    numeroRegistroProducto: 'REG001',
    fechaExpedicion: '2023-01-01',
    fechaVencimiento: '2024-01-01',
    nombreTecnico: 'Producto Técnico',
    nombreComercial: 'Producto Comercial',
    nombreIngles: 'Technical Product',
    fraccionNaladi: '123',
    fraccionNaladiSa93: '456',
    fraccionNaladiSa96: '789',
    fraccionNaladiSa02: '012',
    criterioParaConferirOrigen: 'A',
    valorDeContenidoRegional: '60%',
    normaOrigen: 'Norma Test',
    otrasInstancias: 'Instancia Test',
    criterioParaTratoPreferencial: 'B',
    cantidad: '100',
    umc: 'KG',
    tipoFactura: 'Comercial',
    valorMercancia: '1000',
    fechaFinalInput: '2024-12-31',
    numeroFactura: 'FAC001',
    unidadMedidaMasaBruta: 'KG',
    complementoClasificacion: 'Complemento',
    complementoDescripcion: 'Descripción complemento',
    nalad: 'NALAD001',
    fechaFactura: '2023-06-01',
    marca: 'Marca Test',
    numeroDeSerie: 'SER001'
  };

  const mockGrupoRepresentativo = {
    lugar: 'Lugar Test',
    nombreExportador: 'Exportador Test',
    empresa: 'Empresa Test',
    cargo: 'Cargo Test',
    rfc: 'RFC123456',
    pais: 'Pais Test',
    domicilio: 'Domicilio Test',
    telefono: '1234567890',
    registroFiscal: 'REGFISCAL123',
    correoElectronico: 'test@example.com',
    fax: '555-1234'
  };

  const mockTramiteState: TramiteState = {
    estado: mockCatalogo,
    paisBloques: [mockCatalogo],
    formCertificado: {},
    selectedMercancia: mockMercancia,
    mercanciaTabla: [mockMercancia],
    buscarMercancia: [mockMercancia],
    altaPlanta: [mockCatalogo],
    formaValida: { certificado: true },
    idSolicitud: null,
    destinatarioForm: {} as any,
    domicilioForm: {} as any,
    representanteLegalForm: {} as any,
    idiomaDatos: [],
    entidadFederativaDatos: [],
    representacionFederalDatos: [],
    factura: [],
    facturas: mockCatalogo,
    umc: mockCatalogo,
    umcs: [],
    formDatosCertificado: {},
    formDatosDelDestinatario: {},
    formDestinatario: {},
    formExportor: {},
    grupoRepresentativo: mockGrupoRepresentativo,
    mercanciaForm: {},
    representacionFederal: '',
    idiomaDatosSeleccion: mockCatalogo,
    entidadFederativaSeleccion: mockCatalogo,
    representacionFederalSeleccion: mockCatalogo,
    formulario: {},
    datosConfidencialesProductor: false,
    agregarDatosProductorFormulario: {},
    optionsTipoFactura: [],
    productoresExportador: [],
    agregarProductoresExportador: [],
    disponiblesDatos: [],
    mercanciaProductores: [],
    grupoReceptor: {} as any,
    grupoDeDirecciones: {
      ciudad: '',
      numeroLetra: '',
      lada: '',
      telefono: '',
      fax: null,
      correoElectronico: '',
      calle: undefined,
      numeroExterior: undefined,
      numeroInterior: undefined,
      colonia: undefined,
      localidad: undefined,
      municipio: undefined,
      estado: undefined,
      pais: undefined,
      cp: undefined
    }
  };

  beforeEach(async () => {
    // Create mocks
    mockStore = {
      setFormCertificado: jest.fn(),
      setaltaPlanta: jest.fn(),
      setEstado: jest.fn(),
      setBloque: jest.fn(),
      setMercanciaTabla: jest.fn(),
      setbuscarMercancia: jest.fn(),
      setSelectedMercancia: jest.fn(),
      setFormMercancia: jest.fn(),
      setFormValida: jest.fn()
    } as any;

    mockQuery = {
      formCertificado$: of({}),
      select: jest.fn().mockReturnValue(of(mockTramiteState)),
      selectAltaPlanta$: of([mockCatalogo]),
      selectBuscarMercancia$: of([mockMercancia]),
      selectmercanciaTablaUno$: of([mockMercancia])
    } as any;

    mockCertificadoService = {
      obtenerListaEstado: jest.fn().mockReturnValue(of([mockCatalogo])),
      obtenerMenuDesplegable: jest.fn().mockReturnValue(of([mockCatalogo])),
      buscarMercanciasCert: jest.fn().mockReturnValue(of({
        datos: [{
          idMercancia: '123',
          fraccionArancelaria: '123456',
          numeroRegistroProducto: 'REG001',
          fechaExpedicion: '2023-01-01',
          fechaVencimiento: '2024-01-01',
          nombreTecnico: 'Producto Técnico',
          nombreComercial: 'Producto Comercial',
          nombreIngles: 'Technical Product',
          fraccionNaladi: '123',
          fraccionNaladiSa93: '456',
          fraccionNaladiSa96: '789',
          fraccionNaladiSa02: '012',
          criterioOrigen: 'A',
          valorDeContenidoRegional: '60%',
          normaOrigen: 'Norma Test',
          otrasInstancias: 'Instancia Test',
          criterioParaTratoPreferencial: 'B'
        }]
      }))
    } as any;

    mockToastr = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn()
    } as any;

    mockSeccionQuery = {
      selectSeccionState$: of({
        id: '1',
        estado: 'activo',
        datos: {}
      })
    } as any;

    mockSeccionStore = {
      update: jest.fn(),
      set: jest.fn()
    } as any;

    mockConsultaQuery = {
      selectConsultaioState$: of({
        readonly: false,
        consulta: {}
      })
    } as any;

    mockCatalogoServices = {
      obtenerCatalogo: jest.fn().mockReturnValue(of([mockCatalogo]))
    } as any;    await TestBed.configureTestingModule({
      imports: [
        CertificadoOrigenComponent,
        ReactiveFormsModule,
        CommonModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()
      ],
      providers: [
        provideHttpClient(),
        FormBuilder,
        { provide: Tramite110223Store, useValue: mockStore },
        { provide: Tramite110223Query, useValue: mockQuery },
        { provide: CertificadosOrigenService, useValue: mockCertificadoService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: SeccionLibQuery, useValue: mockSeccionQuery },
        { provide: SeccionLibStore, useValue: mockSeccionStore },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
        { provide: CatalogoServices, useValue: mockCatalogoServices },
        { provide: 'ToastConfig', useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).overrideTemplate(CertificadoOrigenComponent, '<div>Test Template</div>')
    .compileComponents();

    fixture = TestBed.createComponent(CertificadoOrigenComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.operador).toBe(true);
      expect(component.formularioDeshabilitado).toBe(false);
      expect(component.cargoDeMercancias).toBe(true);
      expect(component.mercanciasDisponibles).toBe(true);
      expect(component.mercanciasDisponiblesTabla).toBe(false);
      expect(component.busquedaRealizada).toBe(false);
      expect(component.seleccionTabla).toBe(TablaSeleccion.UNDEFINED);
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.tablaSeleccionEvent).toBe(false);
      expect(component.domicilio).toBe(false);
      expect(component.fromMercanciasDisponibles).toBe(false);
      expect(component.TramitesID).toBe('110223');
      expect(component.tratadoAsociado).toBe('TITRAC.TA');
    });

    it('should initialize fecha inputs with correct configuration', () => {
      expect(component.fechaInicioInput).toEqual(FECHA_INICIO);
      expect(component.fechaFinalInput).toEqual(FECHA_FINAL);
    });

    it('should initialize destroyNotifier$ as Subject', () => {
      expect(component.destroyNotifier$).toBeInstanceOf(Subject);
    });

    it('should set up subscriptions in constructor', () => {
      fixture.detectChanges();
      expect(mockQuery.formCertificado$).toBeDefined();
      expect(mockQuery.select).toHaveBeenCalled();
      expect(mockSeccionQuery.selectSeccionState$).toBeDefined();
      expect(mockQuery.selectAltaPlanta$).toBeDefined();
      expect(mockQuery.selectBuscarMercancia$).toBeDefined();
    });

  });

  describe('ngOnInit', () => {

    it('should set up consultaQuery subscription', () => {
      component.ngOnInit();
      
      expect(component.esFormularioSoloLectura).toBe(false);
    });

    it('should initialize datosTablaUno$ observable', () => {
      component.ngOnInit();
      
      expect(component.datosTablaUno$).toBe(mockQuery.selectmercanciaTablaUno$);
    });
  });

  describe('guardarClicado', () => {
    it('should update datosTabla$ and call store method', () => {
      const testMercancias = [mockMercancia];
      
      component.guardarClicado(testMercancias);
      
      expect(component.datosTabla$).toEqual(testMercancias);
      expect(mockStore.setMercanciaTabla).toHaveBeenCalledWith(testMercancias);
    });

    it('should handle empty array', () => {
      const emptyArray: Mercancia[] = [];
      
      component.guardarClicado(emptyArray);
      
      expect(component.datosTabla$).toEqual(emptyArray);
      expect(mockStore.setMercanciaTabla).toHaveBeenCalledWith(emptyArray);
    });
  });

  describe('processBuscarMercancias', () => {
    beforeEach(() => {
      (component as any).certificadoState = mockTramiteState;
    });

    it('should return early if certificadoState is not available', () => {
      (component as any).certificadoState = null;
      
      (component as any).processBuscarMercancias();
      
      expect(mockCertificadoService.buscarMercanciasCert).not.toHaveBeenCalled();
    });

    it('should return early if estado is not available', () => {
      (component as any).certificadoState = { ...mockTramiteState, estado: null };
      
      (component as any).processBuscarMercancias();
      
      expect(mockCertificadoService.buscarMercanciasCert).not.toHaveBeenCalled();
    });

    it('should return early if paisBloques is not available', () => {
      (component as any).certificadoState = { ...mockTramiteState, paisBloques: null };
      
      (component as any).processBuscarMercancias();
      
      expect(mockCertificadoService.buscarMercanciasCert).not.toHaveBeenCalled();
    });

    it('should process service response correctly', () => {
      (component as any).processBuscarMercancias();
      
      expect(mockStore.setbuscarMercancia).toHaveBeenCalled();
      expect(component.busquedaRealizada).toBe(true);
      expect(component.mercanciasDisponibles).toBe(true);
    });

    it('should handle empty response data', () => {
      mockCertificadoService.buscarMercanciasCert.mockReturnValue(of({ datos: [] }));
      
      (component as any).processBuscarMercancias();
      
      expect(mockStore.setbuscarMercancia).toHaveBeenCalledWith([]);
    });

    it('should handle response without datos property', () => {
      mockCertificadoService.buscarMercanciasCert.mockReturnValue(of({}));
      
      (component as any).processBuscarMercancias();
      
      expect(mockStore.setbuscarMercancia).toHaveBeenCalledWith([]);
    });
  });

  describe('abrirModalCargaPorArchivo', () => {
    it('should call buscarModel.show() if buscarModel exists', () => {
      const mockModal = { show: jest.fn() };
      component.buscarModel = mockModal as any;
      
      component.abrirModalCargaPorArchivo();
      
      expect(mockModal.show).toHaveBeenCalled();
    });

    it('should handle case when buscarModel is not available', () => {
      component.buscarModel = undefined as any;
      
      expect(() => component.abrirModalCargaPorArchivo()).not.toThrow();
    });
  });

  describe('abrirModificarModal', () => {
    it('should set properties and show modal', () => {
      const mockModal = { show: jest.fn() };
      component.modalInstance = mockModal as any;
      
      component.abrirModificarModal(mockMercancia, true);
      
      expect(component.datosSeleccionados).toBe(mockMercancia);
      expect(component.fromMercanciasDisponibles).toBe(true);
      expect(mockStore.setFormMercancia).toHaveBeenCalledWith(mockMercancia);
      expect(mockModal.show).toHaveBeenCalled();
    });

    it('should handle case when modalInstance is not available', () => {
      component.modalInstance = undefined as any;
      
      expect(() => component.abrirModificarModal(mockMercancia, false)).not.toThrow();
    });
  });

  describe('onMercanciaSeleccionada', () => {
    it('should call setSelectedMercancia on store', () => {
      component.onMercanciaSeleccionada(mockMercancia);
      
      expect(mockStore.setSelectedMercancia).toHaveBeenCalledWith(mockMercancia);
    });
  });

  describe('validarFormulario', () => {
    it('should return true when certificadoDeOrigen validates successfully', () => {
      const mockCertificadoComponent = {
        validarFormularios: jest.fn().mockReturnValue(true)
      };
      component.certificadoDeOrigen = mockCertificadoComponent as any;
      
      const result = component.validarFormulario();
      
      expect(result).toBe(true);
      expect(mockCertificadoComponent.validarFormularios).toHaveBeenCalled();
    });

    it('should return false when certificadoDeOrigen validation fails', () => {
      const mockCertificadoComponent = {
        validarFormularios: jest.fn().mockReturnValue(false)
      };
      component.certificadoDeOrigen = mockCertificadoComponent as any;
      
      const result = component.validarFormulario();
      
      expect(result).toBe(false);
    });

    it('should return false when certificadoDeOrigen is not available', () => {
      component.certificadoDeOrigen = undefined as any;
      
      const result = component.validarFormulario();
      
      expect(result).toBe(false);
    });
  });

  describe('cerrarModificarModal', () => {
    it('should reset datosSeleccionados and hide modal', () => {
      const mockModal = { hide: jest.fn() };
      component.modalInstance = mockModal as any;
      component.datosSeleccionados = mockMercancia;
      
      component.cerrarModificarModal();
      
      expect(component.datosSeleccionados).toEqual({} as Mercancia);
      expect(component.tablaSeleccionEvent).toBe(true);
      expect(mockModal.hide).toHaveBeenCalled();
    });

    it('should handle case when modalInstance is not available', () => {
      component.modalInstance = undefined as any;
      
      expect(() => component.cerrarModificarModal()).not.toThrow();
    });
  });

  describe('setFormValida', () => {
    it('should call setFormValida on store with correct parameter', () => {
      component.setFormValida(true);
      
      expect(mockStore.setFormValida).toHaveBeenCalledWith({ certificado: true });
    });

    it('should handle false value', () => {
      component.setFormValida(false);
      
      expect(mockStore.setFormValida).toHaveBeenCalledWith({ certificado: false });
    });
  });

  describe('setValoresStore', () => {
    it('should call setFormCertificado with correct field and value', () => {
      const event = {
        formGroupName: 'certificado',
        campo: 'testField',
        valor: 'testValue' as unknown as undefined,
        storeStateName: 'formCertificado'
      };
      
      component.setValoresStore(event);
      
      expect(mockStore.setFormCertificado).toHaveBeenCalledWith({ testField: 'testValue' });
    });

    it('should handle undefined value', () => {
      const event = {
        formGroupName: 'certificado',
        campo: 'testField',
        valor: undefined,
        storeStateName: 'formCertificado'
      };
      
      component.setValoresStore(event);
      
      expect(mockStore.setFormCertificado).toHaveBeenCalledWith({ testField: undefined });
    });
  });

  describe('emitmercaniasDatos', () => {
    it('should call setMercanciaTabla with mercancia wrapped in array', () => {
      component.emitmercaniasDatos(mockMercancia);
      
      expect(mockStore.setMercanciaTabla).toHaveBeenCalledWith([mockMercancia]);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should initialize modalInstance when modifyModal is available', () => {
      const mockElementRef = {
        nativeElement: document.createElement('div')
      };
      component.modifyModal = mockElementRef as any;
      
      component.ngAfterViewInit();
      
      expect(component.modalInstance).toBeDefined();
    });

    it('should initialize buscarModel when buscarMercanciaModal is available', () => {
      const mockElementRef = {
        nativeElement: document.createElement('div')
      };
      component.buscarMercanciaModal = mockElementRef as any;
      
      component.ngAfterViewInit();
      
      expect(component.buscarModel).toBeDefined();
    });

    it('should handle case when modal references are not available', () => {
      component.modifyModal = undefined as any;
      component.buscarMercanciaModal = undefined as any;
      
      expect(() => component.ngAfterViewInit()).not.toThrow();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyNotifier$ subject', () => {
      const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
      const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Input Properties', () => {
    it('should accept formularioDeshabilitado input', () => {
      component.formularioDeshabilitado = true;
      fixture.detectChanges();
      
      expect(component.formularioDeshabilitado).toBe(true);
    });
  });

  describe('Constants', () => {
    it('should have correct FECHA_INICIO configuration', () => {
      expect(FECHA_INICIO.labelNombre).toBe('Fecha inicio');
      expect(FECHA_INICIO.required).toBe(true);
      expect(FECHA_INICIO.habilitado).toBe(true);
    });

    it('should have correct FECHA_FINAL configuration', () => {
      expect(FECHA_FINAL.labelNombre).toBe('Fecha fin');
      expect(FECHA_FINAL.required).toBe(true);
      expect(FECHA_FINAL.habilitado).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle subscription errors gracefully', () => {
      mockQuery.formCertificado$ = new Observable(subscriber => 
        subscriber.error('Test error')
      );
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });

  });

  describe('Integration Tests', () => {
    it('should handle complete mercancia selection workflow', () => {
      component.onMercanciaSeleccionada(mockMercancia);
      component.abrirModificarModal(mockMercancia, true);
      
      expect(mockStore.setSelectedMercancia).toHaveBeenCalledWith(mockMercancia);
      expect(component.datosSeleccionados).toBe(mockMercancia);
      expect(component.fromMercanciasDisponibles).toBe(true);
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle null values in tipoEstadoSeleccion', () => {
      component.tipoEstadoSeleccion(null as any);
      
      expect(mockStore.setEstado).toHaveBeenCalledWith(null);
    });

    it('should handle empty arrays in guardarClicado', () => {
      component.guardarClicado([]);
      
      expect(component.datosTabla$).toEqual([]);
      expect(mockStore.setMercanciaTabla).toHaveBeenCalledWith([]);
    });

    it('should handle undefined certificadoDeOrigen in validarFormulario', () => {
      component.certificadoDeOrigen = null as any;
      
      const result = component.validarFormulario();
      
      expect(result).toBe(false);
    });
  });

  describe('Component State Management', () => {
    it('should track mercanciasDisponibles state correctly', () => {
      expect(component.mercanciasDisponibles).toBe(true);
      
      // After processBuscarMercancias with data
      (component as any).certificadoState = mockTramiteState;
      (component as any).processBuscarMercancias();
      
      expect(component.mercanciasDisponibles).toBe(true);
    });

    it('should track busquedaRealizada state correctly', () => {
      expect(component.busquedaRealizada).toBe(false);
      
      (component as any).certificadoState = mockTramiteState;
      (component as any).processBuscarMercancias();
      
      expect(component.busquedaRealizada).toBe(true);
    });

    it('should update tablaSeleccionEvent correctly', () => {
      const mockModal = { hide: jest.fn() };
      component.modalInstance = mockModal as any;
      
      component.cerrarModificarModal();
      
      expect(component.tablaSeleccionEvent).toBe(true);
    });
  });
});