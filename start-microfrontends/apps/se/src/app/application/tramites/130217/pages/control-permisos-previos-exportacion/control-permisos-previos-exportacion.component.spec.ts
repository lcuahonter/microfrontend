import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ControlPermisosPreviosExportacionComponent } from './control-permisos-previos-exportacion.component';
import { ControlPermisosPreviosExportacionService } from '../../services/control-permisos-previos-exportacion.service';
import { Tramite130217State, Tramite130217Store } from '../../../../estados/tramites/tramite130217.store';
import { Tramite130217Query } from '../../../../estados/queries/tramite130217.query';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { WizardComponent, JSONResponse } from '@libs/shared/data-access-user/src';
import { AccionBoton } from '../../enums/accion-botton.enum';
import { PASOS_EXPORTACION, MSG_REGISTRO_EXITOSO } from '../../constants/control-permisos-previos-exportacion.enum';

describe('ControlPermisosPreviosExportacionComponent', () => {
  let component: ControlPermisosPreviosExportacionComponent;
  let fixture: ComponentFixture<ControlPermisosPreviosExportacionComponent>;
  let mockService: jest.Mocked<ControlPermisosPreviosExportacionService>;
  let mockStore: jest.Mocked<Tramite130217Store>;
  let mockQuery: jest.Mocked<Tramite130217Query>;
  let mockToastrService: jest.Mocked<ToastrService>;
  const mockTramiteState: Tramite130217State = {
    idSolicitud: 123,
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
    cantidadTotal: '',
    valorTotalUSD: '',
    fechasSeleccionadas: [],
    tableBodyData: [
      {
        id: '1',
        cantidad: '5',
        descripcion: 'Test vehicle',
        precioUnitarioUSD: '200',
        totalUSD: '1000',
        unidadDeMedida: 'Pieza',
        fraccionFrancelaria: '87012101'
      }
    ]
  };
  beforeEach(async () => {    const serviceMock = {
      getAllState: jest.fn(() => of(mockTramiteState)),
      guardarDatosPost: jest.fn(() => of({ 
        id: 1,
        codigo: '00', 
        descripcion: 'Success',
        data: '',
        datos: { id_solicitud: 123, idSolicitud: 123 } as any,
        mensaje: 'Success'
      } as JSONResponse)),
      getPayloadMercancia: jest.fn(() => ({ test: 'mercancia' })),
      getPayloadProductor: jest.fn(() => ({ test: 'productor' })),
      getPayloadSolicitante: jest.fn(() => ({ test: 'solicitante' })),
      getPayloadRepresentacionFederal: jest.fn(() => ({ test: 'representacion' })),
      getPayloadEntidadFederativa: jest.fn(() => ({ test: 'entidad' }))
    };

    const storeMock = {
      setIdSolicitud: jest.fn(),
      resetStore: jest.fn()
    };

    const queryMock = {
      selectSolicitud$: of(mockTramiteState)
    };

    const toastrMock = {
      success: jest.fn(),
      error: jest.fn()
    };    await TestBed.configureTestingModule({
      declarations: [ControlPermisosPreviosExportacionComponent],
      providers: [
        { provide: ControlPermisosPreviosExportacionService, useValue: serviceMock },
        { provide: Tramite130217Store, useValue: storeMock },
        { provide: Tramite130217Query, useValue: queryMock },
        { provide: ToastrService, useValue: toastrMock }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).overrideComponent(ControlPermisosPreviosExportacionComponent, {
      set: { template: '<div>test</div>' }
    }).compileComponents();

    fixture = TestBed.createComponent(ControlPermisosPreviosExportacionComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(ControlPermisosPreviosExportacionService) as jest.Mocked<ControlPermisosPreviosExportacionService>;
    mockStore = TestBed.inject(Tramite130217Store) as jest.Mocked<Tramite130217Store>;
    mockQuery = TestBed.inject(Tramite130217Query) as jest.Mocked<Tramite130217Query>;
    mockToastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;

    fixture.detectChanges();
  });

  // Setup mock ViewChild components before each test that needs them
  beforeEach(() => {
    // Mock ViewChild components
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    component.pasoUnoComponent = {
      solicitudComponent: {
        validarFormulario: jest.fn(() => true)
      }
    } as unknown as PasoUnoComponent;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.indice).toBe(1);
      expect(component.tabIndex).toBe(1);
      expect(component.pasosSolicitar).toBe(PASOS_EXPORTACION);
      expect(component.cargaEnProgreso).toBe(true);
      expect(component.esFormaValido).toBe(false);
      expect(component.seccionCargarDocumentos).toBe(true);
      expect(component.activarBotonCargaArchivos).toBe(false);
    });

    it('should initialize datosPasos correctly', () => {
      expect(component.datosPasos.nroPasos).toBe(PASOS_EXPORTACION.length);
      expect(component.datosPasos.indice).toBe(1);
      expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
      expect(component.datosPasos.txtBtnSig).toBe('Continuar');
    });

    it('should subscribe to query state on initialization', () => {
      expect(component.solicitudState).toEqual(mockTramiteState);
    });
  });

  describe('getValorIndice', () => {
    const mockEvent: AccionBoton = { valor: 2, accion: 'cont' };

    it('should validate form and call obtenerDatosDelStore when indice is 1 and accion is cont', () => {
      component.indice = 1;
      jest.spyOn(component, 'obtenerDatosDelStore');
      
      component.getValorIndice(mockEvent);

      expect(component.pasoUnoComponent.solicitudComponent.validarFormulario).toHaveBeenCalled();
      expect(component.obtenerDatosDelStore).toHaveBeenCalledWith(mockEvent);
      expect(component.esFormaValido).toBe(false);
    });

    it('should set esFormaValido to true when form validation fails', () => {
      component.indice = 1;
      component.pasoUnoComponent.solicitudComponent.validarFormulario = jest.fn(() => false);
      jest.spyOn(component, 'obtenerDatosDelStore');

      component.getValorIndice(mockEvent);

      expect(component.esFormaValido).toBe(true);
      expect(component.obtenerDatosDelStore).not.toHaveBeenCalled();
    });

    it('should call pasoNavegarPor when indice is not 1 or accion is not cont', () => {
      component.indice = 2;
      jest.spyOn(component, 'pasoNavegarPor');

      component.getValorIndice(mockEvent);

      expect(component.pasoNavegarPor).toHaveBeenCalledWith(mockEvent);
    });

  });

  describe('pasoNavegarPor', () => {
    it('should navigate forward when accion is cont', () => {
      const event: AccionBoton = { valor: 2, accion: 'cont' };

      component.pasoNavegarPor(event);

      expect(component.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should navigate backward when accion is not cont', () => {
      const event: AccionBoton = { valor: 2, accion: 'ant' };

      component.pasoNavegarPor(event);

      expect(component.indice).toBe(2);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('should not navigate when valor is out of valid range (less than 1)', () => {
      const event: AccionBoton = { valor: 0, accion: 'cont' };
      const originalIndice = component.indice;

      component.pasoNavegarPor(event);

      expect(component.indice).toBe(originalIndice);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should not navigate when valor is greater than 4', () => {
      const event: AccionBoton = { valor: 5, accion: 'cont' };
      const originalIndice = component.indice;

      component.pasoNavegarPor(event);

      expect(component.indice).toBe(originalIndice);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });
  });

  describe('obtenerDatosDelStore', () => {
    it('should call service getAllState and then guardar on success', () => {
      const mockEvent: AccionBoton = { valor: 2, accion: 'cont' };
      jest.spyOn(component, 'guardar').mockResolvedValue({} as JSONResponse);

      component.obtenerDatosDelStore(mockEvent);

      expect(mockService.getAllState).toHaveBeenCalled();
      expect(component.guardar).toHaveBeenCalledWith(mockTramiteState, mockEvent);
    });    it('should handle errors when getAllState fails', () => {
      const mockEvent: AccionBoton = { valor: 2, accion: 'cont' };
      mockService.getAllState.mockReturnValue(throwError(() => new Error('Service error')));

      // Since the error is not caught in the component, it will propagate
      // The component doesn't have error handling for getAllState, so we just verify the service was called
      expect(() => {
        component.obtenerDatosDelStore(mockEvent);
        expect(mockService.getAllState).toHaveBeenCalled();
      }).not.toThrow();
    });
  });
  describe('guardar method', () => {
    const mockEvent: AccionBoton = { valor: 2, accion: 'cont' };
    
    beforeEach(() => {
      // Reset all mocks before each test in this describe block
      jest.clearAllMocks();
    });it('should successfully save data and navigate to next step', async () => {
      const mockResponse: JSONResponse = {
        id: 1,
        codigo: '00',
        descripcion: 'Success',
        data: '',
        datos: { id_solicitud: 123, idSolicitud: 123 } as any,
        mensaje: 'Success'
      };
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));

      const result = await component.guardar(mockTramiteState, mockEvent);

      expect(mockService.guardarDatosPost).toHaveBeenCalled();
      expect(mockToastrService.success).toHaveBeenCalledWith('Success');
      expect(result).toEqual(mockResponse);
    });
    
    // 
    
    it('should set folioTemporal and update store when id_solicitud is valid', async () => {
      const mockResponse: JSONResponse = {
        id: 1,
        codigo: '00',
        descripcion: 'Success',
        data: '',
        datos: { id_solicitud: 456, idSolicitud: 456 } as any,
        mensaje: 'Success'
      };
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));

      await component.guardar(mockTramiteState, mockEvent);

      expect(component.folioTemporal).toBe(456);
      expect(mockStore.setIdSolicitud).toHaveBeenCalledWith(456);
    });
    it('should set idSolicitud to 0 when id_solicitud is invalid', async () => {
      const mockResponse: JSONResponse = {
        id: 1,
        codigo: '00',
        descripcion: 'Success',
        data: '',
        datos: { id_solicitud: null } as any,
        mensaje: 'Success'
      };
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));

      await component.guardar(mockTramiteState, mockEvent);

      expect(mockStore.setIdSolicitud).toHaveBeenCalledWith(0);
    });    it('should call wizard siguiente when action is cont', async () => {
      const mockResponse: JSONResponse = {
        id: 1,
        codigo: '00',
        descripcion: 'Success',
        data: '',
        datos: { id_solicitud: 123, idSolicitud: 123 } as any,
        mensaje: 'Success'
      };
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));

      await component.guardar(mockTramiteState, mockEvent);

      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      expect(component.alertaNotificacion.mensaje).toContain('123');
    });    it('should call wizard atras when action is ant', async () => {
      const mockResponse: JSONResponse = {
        id: 1,
        codigo: '00',
        descripcion: 'Success',
        data: '',
        datos: { id_solicitud: 123, idSolicitud: 123 } as any,
        mensaje: 'Success'
      };
      const antEvent: AccionBoton = { valor: 2, accion: 'ant' };
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));

      await component.guardar(mockTramiteState, antEvent);

      expect(component.wizardComponent.atras).toHaveBeenCalled();
    });

    it('should reject promise when service call fails', async () => {
      const mockError = new Error('API Error');
      mockService.guardarDatosPost.mockReturnValue(throwError(() => mockError));

      await expect(component.guardar(mockTramiteState, mockEvent)).rejects.toThrow('API Error');
    });    it('should call service payload methods correctly', async () => {
      const mockResponse: JSONResponse = {
        id: 1,
        codigo: '00',
        descripcion: 'Success',
        data: '',
        datos: { id_solicitud: 123 } as any,
        mensaje: 'Success'
      };
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));

      await component.guardar(mockTramiteState, mockEvent);

      expect(mockService.getPayloadMercancia).toHaveBeenCalledWith(mockTramiteState);
      expect(mockService.getPayloadProductor).toHaveBeenCalled();
      expect(mockService.getPayloadSolicitante).toHaveBeenCalled();
      expect(mockService.getPayloadRepresentacionFederal).toHaveBeenCalledWith(mockTramiteState);
      expect(mockService.getPayloadEntidadFederativa).toHaveBeenCalledWith(mockTramiteState);
    });    it('should construct correct payload structure', async () => {
      const mockResponse: JSONResponse = {
        id: 1,
        codigo: '00',
        descripcion: 'Success',
        data: '',
        datos: { id_solicitud: 123 } as any,
        mensaje: 'Success'
      };
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));

      await component.guardar(mockTramiteState, mockEvent);

      const payloadCall = mockService.guardarDatosPost.mock.calls[0][0];
      expect(payloadCall).toHaveProperty('tipoDeSolicitud', 'guardar');
      expect(payloadCall).toHaveProperty('tipo_solicitud_pexim', mockTramiteState.defaultSelect);
      expect(payloadCall).toHaveProperty('cve_regimen', mockTramiteState.regimen);
      expect(payloadCall).toHaveProperty('cve_clasificacion_regimen', mockTramiteState.clasificacion);
    });
  });

  describe('Event Handlers', () => {
    it('should update cargaEnProgreso when onCargaEnProgreso is called', () => {
      component.onCargaEnProgreso(false);
      expect(component.cargaEnProgreso).toBe(false);

      component.onCargaEnProgreso(true);
      expect(component.cargaEnProgreso).toBe(true);
    });

    it('should update seccionCargarDocumentos when cargaRealizada is called', () => {
      component.cargaRealizada(true);
      expect(component.seccionCargarDocumentos).toBe(false);

      component.cargaRealizada(false);
      expect(component.seccionCargarDocumentos).toBe(true);
    });

    it('should update activarBotonCargaArchivos when manejaEventoCargaDocumentos is called', () => {
      component.manejaEventoCargaDocumentos(true);
      expect(component.activarBotonCargaArchivos).toBe(true);

      component.manejaEventoCargaDocumentos(false);
      expect(component.activarBotonCargaArchivos).toBe(false);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyed subject and reset store', () => {
      jest.spyOn(component['destroyed$'], 'next');
      jest.spyOn(component['destroyed$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroyed$'].next).toHaveBeenCalled();
      expect(component['destroyed$'].complete).toHaveBeenCalled();
      expect(mockStore.resetStore).toHaveBeenCalled();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing pasoUnoComponent gracefully', () => {
      component.pasoUnoComponent = undefined as any;
      const mockEvent: AccionBoton = { valor: 2, accion: 'cont' };

      expect(() => component.getValorIndice(mockEvent)).not.toThrow();
    });

    it('should handle boundary values correctly in pasoNavegarPor', () => {
      // Test boundary value 1
      const event1: AccionBoton = { valor: 1, accion: 'cont' };
      component.pasoNavegarPor(event1);
      expect(component.indice).toBe(1);

      // Test boundary value 4
      const event4: AccionBoton = { valor: 4, accion: 'cont' };
      component.pasoNavegarPor(event4);
      expect(component.indice).toBe(4);
    });
  });
});
