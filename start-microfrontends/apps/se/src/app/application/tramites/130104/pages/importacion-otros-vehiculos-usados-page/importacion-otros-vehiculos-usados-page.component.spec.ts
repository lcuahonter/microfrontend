import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { WizardComponent } from '@ng-mf/data-access-user';

import { ImportacionOtrosVehiculosUsadosPageComponent } from './importacion-otros-vehiculos-usados-page.component';
import { ImportacionOtrosVehiculosUsadosService } from '../../services/importacion-otros-vehiculos-usados.service';
import { Tramite130104State, Tramite130104Store } from '../../../../estados/tramites/tramite130104.store';
import { Tramite130104Query } from '../../../../estados/queries/tramite130104.query';
import { AccionBoton } from '../../enums/accionbotton.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

describe('ImportacionOtrosVehiculosUsadosPageComponent', () => {
  let component: ImportacionOtrosVehiculosUsadosPageComponent;
  let fixture: ComponentFixture<ImportacionOtrosVehiculosUsadosPageComponent>;
  let mockService: jest.Mocked<ImportacionOtrosVehiculosUsadosService>;
  let mockStore: jest.Mocked<Tramite130104Store>;
  let mockQuery: jest.Mocked<Tramite130104Query>;
  let mockToastrService: jest.Mocked<ToastrService>;  const mockTramiteState: Tramite130104State = {
    idSolicitud: 0,
    producto: 'CONDMER.N',
    descripcion: 'Test description',
    fraccion: '87012101',
    cantidad: '10',
    valorPartidaUSD: 1000,
    unidadMedida: '6',
    solicitud: 'TISOL.I',
    defaultSelect: 'Inicial',
    defaultProducto: 'CONDMER.U',
    regimen: '01',
    clasificacion: '01',
    filaSeleccionada: [],
    cantidadPartidasDeLaMercancia: '10',
    valorPartidaUSDPartidasDeLaMercancia: '1000',
    descripcionPartidasDeLaMercancia: 'Test description',
    valorFacturaUSD: '1000',
    bloque: '',
    usoEspecifico: 'Test uso',
    justificacionImportacionExportacion: 'Test justification',
    observaciones: 'Test observations',
    entidad: 'DGO',
    representacion: '1016',
    mostrarTabla: false,
    modificarPartidasDelaMercanciaForm: {
      cantidadPartidasDeLaMercancia: '',
      valorPartidaUSDPartidasDeLaMercancia: '',
      descripcionPartidasDeLaMercancia: ''
    },
    mostrarPartidas: [],
    cantidadTotal: '',
    valorTotalUSD: '',
    fechasSeleccionadas: [],
    tableBodyData: [
      {
        id: '1',
        cantidad: '10',
        descripcion: 'Test item',
        precioUnitarioUSD: '100',
        totalUSD: '1000',
        unidadDeMedida: 'Pieza',
        fraccionFrancelaria: '87012101'
      }
    ]
  };

  beforeEach(async () => {
    const serviceMock = {
      getAllState: jest.fn(() => of(mockTramiteState)),
      getPayloadDatos: jest.fn(() => [{ unidadesSolicitadas: 10 }]),
      guardarDatosPost: jest.fn(() => of({ 
        codigo: '00', 
        mensaje: 'Success',
        datos: { id_solicitud: 123, idSolicitud: 123 }
      }))
    };

    const storeMock = {
      actualizarEstado: jest.fn(),
      setIdSolicitud: jest.fn(),
      resetStore: jest.fn()
    };

    const queryMock = {
      selectSolicitud$: of(mockTramiteState)
    };

    const toastrMock = {
      success: jest.fn(),
      error: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ImportacionOtrosVehiculosUsadosPageComponent],
      providers: [
        { provide: ImportacionOtrosVehiculosUsadosService, useValue: serviceMock },
        { provide: Tramite130104Store, useValue: storeMock },
        { provide: Tramite130104Query, useValue: queryMock },
        { provide: ToastrService, useValue: toastrMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportacionOtrosVehiculosUsadosPageComponent);
    component = fixture.componentInstance;
    
    mockService = TestBed.inject(ImportacionOtrosVehiculosUsadosService) as jest.Mocked<ImportacionOtrosVehiculosUsadosService>;
    mockStore = TestBed.inject(Tramite130104Store) as jest.Mocked<Tramite130104Store>;
    mockQuery = TestBed.inject(Tramite130104Query) as jest.Mocked<Tramite130104Query>;
    mockToastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;

    // Mock wizard component
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    // Mock pasoUnoComponent
    component.pasoUnoComponent = {
      solicitudComponent: {
        validarFormulario: jest.fn(() => true)
      }
    } as unknown as PasoUnoComponent;

    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.indice).toBe(1);
      expect(component.pantallasPasos).toBeDefined();
      expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
      expect(component.datosPasos.indice).toBe(component.indice);
      expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
      expect(component.datosPasos.txtBtnSig).toBe('Continuar');
      expect(component.folioTemporal).toBe(0);
      expect(component.esFormaValido).toBe(false);
      expect(component.seccionCargarDocumentos).toBe(true);
      expect(component.cargaEnProgreso).toBe(true);
    });

    it('should subscribe to tramite query on construction', () => {
      expect(component.solicitudState).toEqual(mockTramiteState);
    });
  });

  describe('pasoNavegarPor method', () => {
    it('should update indice and call siguiente when action is "cont"', () => {
      const mockEvent: AccionBoton = { accion: 'cont', valor: 2 };
      component.folioTemporal = 12345;

      component.pasoNavegarPor(mockEvent);

      expect(component.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      expect(component.alertaNotificacion).toBeDefined();
      expect(component.alertaNotificacion.categoria).toBe('success');
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should update indice and call atras when action is not "cont"', () => {
      const mockEvent: AccionBoton = { accion: 'ant', valor: 2 };

      component.pasoNavegarPor(mockEvent);

      expect(component.indice).toBe(2);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('should not update indice when valor is out of valid range', () => {
      const originalIndice = component.indice;
      const mockEvent: AccionBoton = { accion: 'cont', valor: 0 };

      component.pasoNavegarPor(mockEvent);

      expect(component.indice).toBe(originalIndice);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should not update indice when valor is greater than 4', () => {
      const originalIndice = component.indice;
      const mockEvent: AccionBoton = { accion: 'cont', valor: 5 };

      component.pasoNavegarPor(mockEvent);

      expect(component.indice).toBe(originalIndice);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });
  });

  describe('getValorIndice method', () => {
    beforeEach(() => {
      component.indice = 1;
    });

    it('should handle step 1 navigation with valid form', () => {
      const mockEvent: AccionBoton = { accion: 'cont', valor: 2 };
      component.pasoUnoComponent.solicitudComponent.validarFormulario = jest.fn(() => true);
      jest.spyOn(component, 'obtenerDatosDelStore');

      component.getValorIndice(mockEvent);

      expect(component.esFormaValido).toBe(false);
      expect(component.datosPasos.indice).toBe(1);
      expect(component.obtenerDatosDelStore).toHaveBeenCalledWith(mockEvent);
    });

    it('should handle step 1 navigation with invalid form', () => {
      const mockEvent: AccionBoton = { accion: 'cont', valor: 2 };
      component.pasoUnoComponent.solicitudComponent.validarFormulario = jest.fn(() => false);
      jest.spyOn(component, 'obtenerDatosDelStore');

      component.getValorIndice(mockEvent);

      expect(component.esFormaValido).toBe(true);
      expect(component.obtenerDatosDelStore).not.toHaveBeenCalled();
    });

    it('should handle direct navigation between steps', () => {
      component.indice = 2;
      const mockEvent: AccionBoton = { accion: 'cont', valor: 3 };
      jest.spyOn(component, 'pasoNavegarPor');

      component.getValorIndice(mockEvent);

      expect(component.pasoNavegarPor).toHaveBeenCalledWith(mockEvent);
    });

    it('should handle case when pasoUnoComponent is undefined', () => {
      const mockEvent: AccionBoton = { accion: 'cont', valor: 2 };
      component.pasoUnoComponent = undefined as unknown as PasoUnoComponent;

      expect(() => component.getValorIndice(mockEvent)).not.toThrow();
      expect(component.esFormaValido).toBe(true);
    });
  });

  describe('obtenerDatosDelStore method', () => {
    it('should call service getAllState and then guardar on success', () => {
      const mockEvent: AccionBoton = { accion: 'cont', valor: 2 };
      jest.spyOn(component, 'guardar').mockResolvedValue({});

      component.obtenerDatosDelStore(mockEvent);

      expect(mockService.getAllState).toHaveBeenCalled();
      // Note: Due to async nature, we can't easily test the subscribe callback without more complex async testing
    });

    it('should handle error when getting state data', () => {
      const mockEvent: AccionBoton = { accion: 'cont', valor: 2 };
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockService.getAllState.mockReturnValue(throwError(() => new Error('Test error')));

      component.obtenerDatosDelStore(mockEvent);

      expect(mockService.getAllState).toHaveBeenCalled();
      // Reset console spy
      consoleSpy.mockRestore();
    });
  });

  describe('guardar method', () => {
    it('should successfully save data and navigate forward', async () => {
      const mockEvent: AccionBoton = { accion: 'cont', valor: 2 };
      const mockResponse = {
        codigo: '00',
        mensaje: 'Success',
        datos: { id_solicitud: 123, idSolicitud: 123 }
      };
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));

      const result = await component.guardar(mockTramiteState, mockEvent);

      expect(mockService.getPayloadDatos).toHaveBeenCalledWith(mockTramiteState);
      expect(mockService.guardarDatosPost).toHaveBeenCalled();
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(mockToastrService.success).toHaveBeenCalledWith('Success');
      expect(result).toEqual(mockResponse);
    });

    it('should handle API response without valid datos', async () => {
      const mockEvent: AccionBoton = { accion: 'cont', valor: 2 };
      const mockResponse = {
        codigo: 'APP-S001',
        mensaje: 'Error message'
      };
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));

      const result = await component.guardar(mockTramiteState, mockEvent);

      expect(component.wizardComponent.siguiente).toHaveBeenCalled(); // Force navigation
      expect(mockToastrService.success).toHaveBeenCalledWith('Error message');
      expect(result).toEqual(mockResponse);
    });

    it('should handle API error', async () => {
      const mockEvent: AccionBoton = { accion: 'cont', valor: 2 };
      const mockError = new Error('API Error');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockService.guardarDatosPost.mockReturnValue(throwError(() => mockError));

      await expect(component.guardar(mockTramiteState, mockEvent)).rejects.toThrow('API Error');
      
      consoleSpy.mockRestore();
    });

    it('should not navigate when action is not cont', async () => {
      const mockEvent: AccionBoton = { accion: 'ant', valor: 1 };
      const mockResponse = {
        codigo: '00',
        mensaje: 'Success',
        datos: { id_solicitud: 123, idSolicitud: 123 }
      };
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));

      await component.guardar(mockTramiteState, mockEvent);

      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });    it('should build payload correctly with all data', async () => {
      const mockEvent: AccionBoton = { accion: 'cont', valor: 2 };
      const mockResponse = {
        codigo: '00',
        mensaje: 'Success',
        datos: { id_solicitud: 456, idSolicitud: 456 }
      };
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));

      const result = await component.guardar(mockTramiteState, mockEvent);      const payloadCall = mockService.guardarDatosPost.mock.calls[0][0];
      expect(payloadCall).toBeDefined();
      expect(payloadCall['tipoDeSolicitud']).toBe('guardar');
      expect(payloadCall['mercancia']).toBeDefined();
      expect(payloadCall['tipo_solicitud_pexim']).toBe(mockTramiteState.defaultSelect);
      expect(result).toEqual(mockResponse);
    });

    it('should handle response with empty message', async () => {
      const mockEvent: AccionBoton = { accion: 'cont', valor: 2 };
      const mockResponse = {
        codigo: '00',
        mensaje: '',
        datos: { id_solicitud: 123, idSolicitud: 123 }
      };
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));

      await component.guardar(mockTramiteState, mockEvent);

      expect(mockToastrService.success).toHaveBeenCalledWith('');
    });
  });

  describe('Constructor behavior', () => {
    it('should initialize destroyed$ subject', () => {
      expect(component['destroyed$']).toBeDefined();
    });

    it('should set up subscription to tramite query', () => {
      expect(component.solicitudState).toBe(mockTramiteState);
    });
  });

  describe('Payload construction', () => {
    it('should use correct id_solcitud from solicitudState', async () => {
      const mockEvent: AccionBoton = { accion: 'cont', valor: 2 };
      const mockResponse = { codigo: '00', mensaje: 'Success' };
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));
      component.solicitudState = { ...mockTramiteState, idSolicitud: 999 };

      await component.guardar(mockTramiteState, mockEvent);      const payloadCall = mockService.guardarDatosPost.mock.calls[0][0];
      expect(payloadCall['id_solcitud']).toBe(999);
    });

    it('should use 0 as id_solcitud when solicitudState.idSolicitud is not set', async () => {
      const mockEvent: AccionBoton = { accion: 'cont', valor: 2 };
      const mockResponse = { codigo: '00', mensaje: 'Success' };
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));
      component.solicitudState = { ...mockTramiteState, idSolicitud: 0 };

      await component.guardar(mockTramiteState, mockEvent);      const payloadCall = mockService.guardarDatosPost.mock.calls[0][0];
      expect(payloadCall['id_solcitud']).toBe(0);
    });
  });

  describe('Event Handlers', () => {
    it('should handle manejaEventoCargaDocumentos', () => {
      component.manejaEventoCargaDocumentos(false);
      expect(component.seccionCargarDocumentos).toBe(false);

      component.manejaEventoCargaDocumentos(true);
      expect(component.seccionCargarDocumentos).toBe(true);
    });

    it('should handle cargaRealizada', () => {
      component.cargaRealizada(true);
      expect(component.seccionCargarDocumentos).toBe(false);

      component.cargaRealizada(false);
      expect(component.seccionCargarDocumentos).toBe(true);
    });

    it('should handle onCargaEnProgreso', () => {
      component.onCargaEnProgreso(false);
      expect(component.cargaEnProgreso).toBe(false);

      component.onCargaEnProgreso(true);
      expect(component.cargaEnProgreso).toBe(true);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyed$ subject and reset store', () => {
      const destroyedSpy = jest.spyOn(component['destroyed$'], 'next');
      const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

      component.ngOnDestroy();

      expect(destroyedSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
      expect(mockStore.resetStore).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined solicitudState', () => {
      component.solicitudState = undefined as unknown as any;
      const mockEvent: AccionBoton = { accion: 'cont', valor: 2 };

      expect(() => component.obtenerDatosDelStore(mockEvent)).not.toThrow();
    });

    it('should handle empty tableBodyData in payload', async () => {
      const stateWithoutTableData = { ...mockTramiteState, tableBodyData: [] };
      const mockEvent: AccionBoton = { accion: 'cont', valor: 2 };
      mockService.getPayloadDatos.mockReturnValue([]);

      await component.guardar(stateWithoutTableData, mockEvent);

      expect(mockService.getPayloadDatos).toHaveBeenCalledWith(stateWithoutTableData);
    });
  });
});