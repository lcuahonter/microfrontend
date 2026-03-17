import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, throwError, Subject } from 'rxjs';

import { AmpliacionAnexoComponent } from './ampliacion-anexo.component';
import { AmpliacionServiciosService } from '../../services/ampliacion-servicios.service';
import { AmpliacionServiciosQuery } from '../../estados/tramite80206.query';
import { Tramite80206Store } from '../../estados/tramite80206.store';
import { 
  Arancelaria, 
  ArancelariaImportacion, 
  ApiResponse,
  Sector,
  Servicios
} from '../../models/datos-info.model';
import { AmpliacionServiciosState } from '../../estados/tramite80206.store';
import { TablaSeleccion, Catalogo } from '@ng-mf/data-access-user';

describe('AmpliacionAnexoComponent', () => {
  let component: AmpliacionAnexoComponent;
  let fixture: ComponentFixture<AmpliacionAnexoComponent>;
  let mockAmpliacionServiciosService: jest.Mocked<AmpliacionServiciosService>;
  let mockAmpliacionServiciosQuery: jest.Mocked<AmpliacionServiciosQuery>;
  let mockTramite80206Store: jest.Mocked<Tramite80206Store>;

  const mockApiResponse: ApiResponse = {
    code: 200,
    data: {
      idsubmanufacturer: 'SUB123456',
      infoServicios: {
        seleccionaLaModalidad: 'Test Modalidad',
        folio: '12345',
        ano: '2023'
      }
    },
    infoServicios: {
      seleccionaLaModalidad: 'Test Modalidad',
      folio: '12345',
      ano: '2023'
    }
  };

  const mockTramiteState: AmpliacionServiciosState = {
    idSolicitud: 202785257,
    
    infoRegistro: {
      seleccionaLaModalidad: 'Test Modalidad',
      folio: '12345',
      ano: '2023'
    },

    datosImmex: [
      {
        fraccion: '12345678',
        fraccionArancelaria: '12345678',
        descripcionComercial: 'Test Description IMMEX',
        anexoII: 'Anexo II Test',
        tipo: 'EXPORTACION',
        umt: 'KG',
        categoria: 'A',
        valorMensual: '1000.00',
        valorAnual: '12000.00',
        volumenrMensual: '100.00',
        volumenAnual: '1200.00'
      }
    ],

    datosImportacion: [
      {
        fraccion: '87654321',
        fraccionArancelaria: '12345678',
        fraccionArancelariaImportacion: '87654321',
        descripcionComercialImportacion: '',
        descripcionFraccionPadre: '',
        anexoII: '',
        tipo: '',
        umt: '',
        categoria: '',
        valorMensual: '',
        valorAnual: '',
        volumenrMensual: '',
        volumenAnual: ''
      }
    ],

    datosSector: [
      {
        clave: 'SEC001',
        descripcion: 'Sector Automotriz'
      }
    ],

    datos: [
      {
        fraccion: '11111111',
        fraccionArancelaria: '11111111',
        descripcionComercial: 'General Data Description',
        anexoII: 'Anexo II General',
        tipo: 'GENERAL',
        umt: 'MT',
        categoria: 'C',
        valorMensual: '500.00',
        valorAnual: '6000.00',
        volumenrMensual: '50.00',
        volumenAnual: '600.00'
      }
    ],

    aduanaDeIngresoSelecion: 'ADU001',
    sectorSelecion: 'SEC001',
    formaValida: {
      'fraccionArancelaria': true,
      'importacion': true,
      'cantidad': false,
      'valor': true,
      'modalidad': true
    },
    fraccion: '12345678',
    importacion: '11223344',
    fraccionArancelaria: '87654321',
    cantidad: '100',
    valor: '1000',
    seleccionaLaModalidad: 'IMMEX',
    seleccionarRegla: 'REGLA_001',
    sector: 'Automotriz',
    isSelectedRegla: true,
    sectorDesplegable: [],
    reglaSeleccionada: []
  };

  const mockArancelaria: Arancelaria = {
    fraccion: '12345678',
    fraccionArancelaria: '12345678',
    descripcionComercial: 'Test Description',
    anexoII: 'Anexo II Test',
    tipo: 'EXPORTACION',
    umt: 'KG',
    categoria: 'A',
    valorMensual: '1000.00',
    valorAnual: '12000.00',
    volumenrMensual: '100.00',
    volumenAnual: '1200.00'
  };

  const mockArancelariaImportacion: ArancelariaImportacion = {
    fraccion: '87654321',
    fraccionArancelaria: '12345678',
    fraccionArancelariaImportacion: '87654321',
    descripcionComercialImportacion: '',
    descripcionFraccionPadre: '',
    anexoII: '',
    tipo: '',
    umt: '',
    categoria: '',
    valorMensual: '',
    valorAnual: '',
    volumenrMensual: '',
    volumenAnual: ''
  };

  beforeEach(async () => {
    const mockService = {
      getDatos: jest.fn().mockReturnValue(of(mockApiResponse)),
      obtenerInformacionFraccion: jest.fn().mockReturnValue(of({
        codigo: '00',
        datos: mockArancelaria
      })),
      obtenerFraccionImportacion: jest.fn().mockReturnValue(of({
        codigo: '00',
        datos: mockArancelariaImportacion
      })),
      mapApiResponseToFraccionArancelaria: jest.fn().mockReturnValue([mockArancelaria]),
      mapApiResponseToFraccionArancelariaImportacion: jest.fn().mockReturnValue([mockArancelariaImportacion])
    };

    const mockQuery = {
      selectSolicitudTramite$: of(mockTramiteState)
    };

    const mockStore = {
      setFraccionArancelaria: jest.fn(),
      setRfcEmpresa: jest.fn(),
      setCantidad: jest.fn(),
      setValor: jest.fn(),
      setImportacion: jest.fn(),
      setInfoRegistro: jest.fn(),
      setDatosImmex: jest.fn(),
      setDatosImportacion: jest.fn(),
      setAduanaDeIngresoSeleccion: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [AmpliacionAnexoComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: AmpliacionServiciosService, useValue: mockService },
        { provide: AmpliacionServiciosQuery, useValue: mockQuery },
        { provide: Tramite80206Store, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AmpliacionAnexoComponent);
    component = fixture.componentInstance;
    
    mockAmpliacionServiciosService = TestBed.inject(AmpliacionServiciosService) as jest.Mocked<AmpliacionServiciosService>;
    mockAmpliacionServiciosQuery = TestBed.inject(AmpliacionServiciosQuery) as jest.Mocked<AmpliacionServiciosQuery>;
    mockTramite80206Store = TestBed.inject(Tramite80206Store) as jest.Mocked<Tramite80206Store>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize with correct default values', () => {
      expect(component.mostrarAlerta).toBe(false);
      expect(component.mensajeDeAlerta).toBe('Debe seleccionar una fracción de exportación');
      expect(component.tablaSeleccion).toBe(TablaSeleccion.RADIO);
      expect(component.fraccion).toBe('');
      expect(component.cantidad).toBe('');
      expect(component.fraccionArancelaria).toBe('');
      expect(component.importacion).toBe('');
      expect(component.valor).toBe('');
      expect(component.datos).toEqual([]);
      expect(component.datosImmex).toEqual([]);
      expect(component.datosImportacion).toEqual([]);
      expect(component.domiciliosSeleccionados).toEqual([]);
      expect(component.esFormularioSoloLectura).toBe(false);
    });

    it('should initialize formularioInfoRegistro in constructor', () => {
      expect(component.formularioInfoRegistro).toBeDefined();
      expect(component.formularioInfoRegistro.get('seleccionaLaModalidad')).toBeTruthy();
      expect(component.formularioInfoRegistro.get('folio')).toBeTruthy();
      expect(component.formularioInfoRegistro.get('ano')).toBeTruthy();
    });
  });

  describe('ngOnInit', () => {
    it('should call required methods on initialization', () => {
      jest.spyOn(component, 'getDatos');
      jest.spyOn(component, 'suscribirseADatosImmex');
      jest.spyOn(component, 'suscribirseAFields');

      component.ngOnInit();

      expect(component.getDatos).toHaveBeenCalled();
      expect(component.suscribirseADatosImmex).toHaveBeenCalled();
      expect(component.suscribirseAFields).toHaveBeenCalled();
    });
  });

  describe('Modal functionality', () => {
    it('should activate modal', () => {
      component.activarModal();
      expect(component.mostrarAlerta).toBe(true);
    });

    it('should close modal on aceptar', () => {
      component.mostrarAlerta = true;
      component.aceptar();
      expect(component.mostrarAlerta).toBe(false);
    });

    it('should close modal on cerrarModal', () => {
      component.mostrarAlerta = true;
      component.cerrarModal();
      expect(component.mostrarAlerta).toBe(false);
    });
  });

  describe('Field changes', () => {
    it('should update fraccionArancelaria in store', () => {
      component.enCambioDeCampo('fraccionArancelaria', '12345678');
      expect(mockTramite80206Store.setFraccionArancelaria).toHaveBeenCalledWith('12345678');
    });

    it('should update fraccion in store', () => {
      component.enCambioDeCampo('fraccion', '87654321');
      expect(mockTramite80206Store.setRfcEmpresa).toHaveBeenCalledWith('87654321');
    });

    it('should update cantidad in store', () => {
      component.enCambioDeCampo('cantidad', '100');
      expect(mockTramite80206Store.setCantidad).toHaveBeenCalledWith('100');
    });

    it('should update valor in store', () => {
      component.enCambioDeCampo('valor', '1000');
      expect(mockTramite80206Store.setValor).toHaveBeenCalledWith('1000');
    });

    it('should update importacion in store', () => {
      component.enCambioDeCampo('importacion', '11223344');
      expect(mockTramite80206Store.setImportacion).toHaveBeenCalledWith('11223344');
    });

    it('should handle unknown field name', () => {
      component.enCambioDeCampo('unknownField', 'value');
      // Should not throw error and not call any store method
      expect(mockTramite80206Store.setFraccionArancelaria).not.toHaveBeenCalled();
    });
  });

  describe('API calls', () => {
    it('should get data successfully', () => {
      component.getDatos();

      expect(mockAmpliacionServiciosService.getDatos).toHaveBeenCalled();
      expect(mockTramite80206Store.setInfoRegistro).toHaveBeenCalledWith(mockApiResponse.data.infoServicios);
    });

    it('should handle API error in getDatos', () => {
      mockAmpliacionServiciosService.getDatos.mockReturnValue(throwError(() => new Error('API Error')));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      component.getDatos();

      expect(mockAmpliacionServiciosService.getDatos).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Form initialization methods', () => {
    it('should initialize formularioInfoRegistro with empty values', () => {
      component.inicializarFormularioInfoRegistro();

      expect(component.formularioInfoRegistro).toBeDefined();
      expect(component.formularioInfoRegistro.get('seleccionaLaModalidad')?.value).toBe('');
      expect(component.formularioInfoRegistro.get('folio')?.value).toBe('');
      expect(component.formularioInfoRegistro.get('ano')?.value).toBe('');
    });

    it('should initialize form from store data', () => {
      component.tramiteState = mockTramiteState;
      component.inicializarFormularioDesdeAlmacen();

      expect(component.formularioInfoRegistro.get('seleccionaLaModalidad')?.value).toBe('Test Modalidad');
      expect(component.formularioInfoRegistro.get('folio')?.value).toBe('12345');
      expect(component.formularioInfoRegistro.get('ano')?.value).toBe('2023');
    });
  });

  describe('Subscribe methods', () => {
    it('should subscribe to fields changes', () => {
      component.suscribirseAFields();

      expect(component.tramiteState).toEqual(mockTramiteState);
      expect(component.fraccion).toBe(mockTramiteState.fraccion);
      expect(component.cantidad).toBe(mockTramiteState.cantidad);
      expect(component.fraccionArancelaria).toBe(mockTramiteState.fraccionArancelaria);
      expect(component.importacion).toBe(mockTramiteState.importacion);
      expect(component.valor).toBe(mockTramiteState.valor);
    });

    it('should subscribe to datos immex', () => {
      component.suscribirseADatosImmex();
      
      expect(component.datosImmex).toEqual(mockTramiteState.datosImmex);
      expect(component.datosImportacion).toEqual(mockTramiteState.datosImportacion);
    });
  });

  describe('Grid operations', () => {
    beforeEach(() => {
      component.datosImmex = [mockArancelaria];
      component.datosImportacion = [mockArancelariaImportacion];
      component.domiciliosSeleccionados = [mockArancelaria];
    });

    it('should eliminate services from grid', () => {
      component.eliminarServiciosGrid();

      expect(mockTramite80206Store.setDatosImmex).toHaveBeenCalled();
      expect(component.domiciliosSeleccionados).toEqual([]);
    });

    it('should eliminate importacion from grid', () => {
      component.eliminarImportacion();

      expect(mockTramite80206Store.setDatosImportacion).toHaveBeenCalled();
      expect(component.domiciliosSeleccionados).toEqual([]);
    });

    it('should return correct condition for delete', () => {
      expect(component.condicion).toBe(true);

      component.domiciliosSeleccionados = [];
      expect(component.condicion).toBe(false);
    });
  });

  describe('Validation methods', () => {
    it('should validate fraccion format correctly', () => {
      expect(AmpliacionAnexoComponent.validarFormatoFraccion('12345678')).toBe(true);
      expect(AmpliacionAnexoComponent.validarFormatoFraccion('123')).toBe(false);
      expect(AmpliacionAnexoComponent.validarFormatoFraccion('1234567890')).toBe(false);
      expect(AmpliacionAnexoComponent.validarFormatoFraccion('abcd1234')).toBe(false);
    });

    it('should return false when formulario is null', () => {
      component.formularioInfoRegistro = null as any;
      const result = component.validarFormulario();

      expect(result).toBe(false);
    });
  });

  describe('Selection handlers', () => {
    it('should select domicilios', () => {
      component.seleccionarDomicilios(mockArancelaria);
      expect(component.domiciliosSeleccionados).toEqual([mockArancelaria]);
    });

    it('should process data from child component', () => {
      const mockCatalogo: Catalogo = { id: 123, nombre: 'Test' } as unknown as Catalogo;
      component.procesarDatosDelHijo(mockCatalogo);

      expect(mockTramite80206Store.setAduanaDeIngresoSeleccion).toHaveBeenCalledWith('123');
    });
  });

  describe('Grid update methods', () => {
    it('should show alert if fraccionArancelaria is empty in actualizaGridEmpresasNacionales', () => {
      component.fraccionArancelaria = '';
      component.actualizaGridEmpresasNacionales();

      expect(component.mostrarAlerta).toBe(true);
      expect(component.mensajeDeAlerta).toBe('Tiene que introducir la Fracción arancelaria');
    });

    it('should call obtenerInformacionFraccion when fraccionArancelaria is valid', () => {
      component.fraccionArancelaria = '12345678';
      jest.spyOn(component, 'obtenerInformacionFraccion');
      
      component.actualizaGridEmpresasNacionales();

      expect(component.obtenerInformacionFraccion).toHaveBeenCalled();
    });
  });

  describe('obtenerInformacionFraccion', () => {
    beforeEach(() => {
      component.fraccionArancelaria = '12345678';
      component.datosImmex = [];
    });

    it('should show alert if fraccionArancelaria is empty', () => {
      component.fraccionArancelaria = '';
      component.obtenerInformacionFraccion();

      expect(component.mostrarAlerta).toBe(true);
      expect(component.mensajeDeAlerta).toBe('Debe introducir una fracción arancelaria válida.');
    });

    it('should show alert if fraccion format is invalid', () => {
      component.fraccionArancelaria = '123';
      component.obtenerInformacionFraccion();

      expect(component.mostrarAlerta).toBe(true);
      expect(component.mensajeDeAlerta).toBe('La fracción arancelaria no es válida o no esta vigente.');
    });

    it('should show alert if fraccion already exists', () => {
      component.datosImmex = [mockArancelaria];
      component.fraccionArancelaria = '12345678';
      component.obtenerInformacionFraccion();

      expect(component.mostrarAlerta).toBe(true);
      expect(component.mensajeDeAlerta).toBe('La fracción arancelaria que desea agregar a la lista ya existe.');
    });

    it('should successfully add fraccion when valid', () => {
      component.fraccionArancelaria = '87654321';
      component.obtenerInformacionFraccion();

      expect(mockAmpliacionServiciosService.obtenerInformacionFraccion).toHaveBeenCalledWith({
        "fraccion": "87654321",
        "tipoSolicitud": 471
      });
    });
  });

  describe('agregarImportacion', () => {
    beforeEach(() => {
      component.importacion = '87654321';
      component.domiciliosSeleccionados = [mockArancelaria];
      component.datosImportacion = [];
    });

    it('should show alert if importacion is empty', () => {
      component.importacion = '';
      component.agregarImportacion();

      expect(component.mostrarAlerta).toBe(true);
      expect(component.mensajeDeAlerta).toBe('Tiene que introducir la Fracción arancelaria');
    });

    it('should show alert if no domicilio is selected', () => {
      component.domiciliosSeleccionados = [];
      component.agregarImportacion();

      expect(component.mostrarAlerta).toBe(true);
      expect(component.mensajeDeAlerta).toBe('Debe seleccionar una fracción de exportación');
    });

    it('should show alert if fraccion format is invalid', () => {
      component.importacion = '123';
      component.agregarImportacion();

      expect(component.mostrarAlerta).toBe(true);
      expect(component.mensajeDeAlerta).toBe('La fracción arancelaria no es válida o no esta vigente.');
    });

    it('should call obtenerInformacionFraccionImportacion when valid', () => {
      jest.spyOn(component, 'obtenerInformacionFraccionImportacion');
      component.agregarImportacion();

      expect(component.obtenerInformacionFraccionImportacion).toHaveBeenCalled();
    });
  });

  describe('obtenerInformacionFraccionImportacion', () => {
    beforeEach(() => {
      component.importacion = '87654321';
      component.fraccionArancelaria = '12345678';
      component.datosImmex = [];
    });

    it('should show alert if importacion is empty', () => {
      component.importacion = '';
      component.obtenerInformacionFraccionImportacion();

      expect(component.mostrarAlerta).toBe(true);
      expect(component.mensajeDeAlerta).toBe('Debe introducir una fracción arancelaria válida.');
    });

    it('should successfully call service with correct payload', () => {
      component.obtenerInformacionFraccionImportacion();

      expect(mockAmpliacionServiciosService.obtenerFraccionImportacion).toHaveBeenCalledWith({
        "fraccion": "87654321",
        "fraccionPadre": "12345678",
        "tipoSolicitud": "14",
        "idPrograma": "121517",
        "idSolicitud": "202785257",
        "idProductoPadre": ""
      });
    });
  });

  describe('onIntentarEliminar', () => {
    it('should show alert when trying to delete without selection', () => {
      component.domiciliosSeleccionados = [];
      component.onIntentarEliminar();

      expect(component.mensajeDeAlerta).toBe('Seleccione la(s) Fracción(es) de Exportación a eliminar.');
      expect(component.mostrarAlerta).toBe(true);
    });

    it('should not show alert when condition is met', () => {
      component.domiciliosSeleccionados = [mockArancelaria];
      component.datosImmex = [mockArancelaria];
      component.onIntentarEliminar();

      expect(component.mostrarAlerta).toBe(false);
    });
  });

  describe('Component lifecycle', () => {
    it('should complete destroyNotifier on destroy', () => {
      const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});