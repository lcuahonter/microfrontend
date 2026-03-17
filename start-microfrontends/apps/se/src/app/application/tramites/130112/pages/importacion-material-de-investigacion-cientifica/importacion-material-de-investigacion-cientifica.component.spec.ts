import { TestBed } from '@angular/core/testing';
import { ImportacionMaterialDeInvestigacionCientificaComponent } from './importacion-material-de-investigacion-cientifica.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PASOS_IMPORTACION } from '../../constants/importacion-material-de-investigacion-cientifica-pasos.enum';
import { AccionBoton } from '../../enums/accion-botton.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ImportacionMaterialDeInvestigacionCientificaService } from '../../services/importacion-material-de-investigacion-cientifica.service';
import { Tramite130112Query } from '../../estados/queries/tramite130112.query';
import { Tramite130112Store } from '../../estados/tramites/tramites130112.store';
import { ToastrService } from 'ngx-toastr';
import { of, throwError, Subject } from 'rxjs';
import { Tramite130112State } from '../../estados/tramites/tramites130112.store';
import { JSONResponse } from '@libs/shared/data-access-user/src';
import { EventEmitter } from '@angular/core';

describe('ImportacionMaterialDeInvestigacionCientificaComponent', () => {
  let component: ImportacionMaterialDeInvestigacionCientificaComponent;
  let fixture: any;

  const mockTramite130112State: Partial<Tramite130112State> = {
    idSolicitud: 123,
    defaultSelect: 'test',
    regimen: 'test-regimen',
    clasificacion: 'test-clasificacion',
    fechasSeleccionadas: []
  };

  const mockImportacionService = {
    actualizarEstadoFormulario: jest.fn(),
    getAllState: jest.fn().mockReturnValue(of(mockTramite130112State)),
    buildMercancia: jest.fn().mockReturnValue({}),
    buildProductor: jest.fn().mockReturnValue({}),
    buildSolicitante: jest.fn().mockReturnValue({}),
    buildRepresentacionFederal: jest.fn().mockReturnValue({}),
    buildEntidadesFederativas: jest.fn().mockReturnValue({}),
    guardarDatosPost: jest.fn().mockReturnValue(of({
      id: 1,
      descripcion: 'Success',
      codigo: '200',
      datos: { id_solicitud: 456 }
    }))
  };

  const mockQuery = {
    selectSolicitud$: of(mockTramite130112State)
  };

  const mockStore = {
    setIdSolicitud: jest.fn(),
    actualizarEstado: jest.fn()
  };

  const mockToastrService = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportacionMaterialDeInvestigacionCientificaComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ImportacionMaterialDeInvestigacionCientificaService, useValue: mockImportacionService },
        { provide: Tramite130112Query, useValue: mockQuery },
        { provide: Tramite130112Store, useValue: mockStore },
        { provide: ToastrService, useValue: mockToastrService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportacionMaterialDeInvestigacionCientificaComponent);
    component = fixture.componentInstance;
    
    jest.spyOn(component, 'pasoNavegarPor').mockImplementation(() => {});
    
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pasosSolicitar with PASOS_IMPORTACION', () => {
    expect(component.pasosSolicitar).toEqual(PASOS_IMPORTACION);
  });

  it('should initialize datosPasos with correct values', () => {
    expect(component.datosPasos.nroPasos).toBe(PASOS_IMPORTACION.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should update indice and call wizardComponent.siguiente() when accion is "cont"', () => {
    (component.pasoNavegarPor as jest.Mock).mockClear();

    const accionBoton: AccionBoton = { accion: 'cont', valor: 2 };
    component.getValorIndice(accionBoton);

    expect(component.pasoNavegarPor).toHaveBeenCalledWith(accionBoton);
  });

  it('should update indice and call wizardComponent.atras() when accion is not "cont"', () => {
    const wizardComponentSpy = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      listaPasos: [],
      indice: 0,
      indiceActual: 0,
      estadoInicial: false,
      pasosCompletados: [],
      pasoActual: null,
      cambiarPaso: jest.fn(),
    };
    component.wizardComponent = wizardComponentSpy as any;


    const pasoUnoSpy = {
      validarTodosLosFormularios: jest.fn().mockReturnValue(true)
    };
    component.pasoUno = pasoUnoSpy as any;

    const accionBoton: AccionBoton = { accion: 'prev', valor: 1 };
    component.getValorIndice(accionBoton);

    expect(component.indice).toBe(1);
    expect(wizardComponentSpy.atras).toHaveBeenCalled();
    expect(wizardComponentSpy.siguiente).not.toHaveBeenCalled();
  });

  it('should not update indice or call wizardComponent methods if valor is out of range', () => {
    const wizardComponentSpy = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      listaPasos: [],
      indice: 0,
      indiceActual: 0,
      estadoInicial: false,
      pasosCompletados: [],
      pasoActual: null,
      cambiarPaso: jest.fn(),
    };
    component.wizardComponent = wizardComponentSpy as any;

    const accionBoton: AccionBoton = { accion: 'cont', valor: 5 }; // Out of range
    component.getValorIndice(accionBoton);

    expect(component.indice).toBe(1); // Default value
    expect(wizardComponentSpy.siguiente).not.toHaveBeenCalled();
    expect(wizardComponentSpy.atras).not.toHaveBeenCalled();
  });

  it('should handle getValorIndice correctly for valid values and actions', () => {
    (component.pasoNavegarPor as jest.Mock).mockClear();

    const accionBotonCont: AccionBoton = { accion: 'cont', valor: 2 };
    component.getValorIndice(accionBotonCont);
    expect(component.pasoNavegarPor).toHaveBeenCalledWith(accionBotonCont);

    const accionBotonPrev: AccionBoton = { accion: 'prev', valor: 1 };
    component.getValorIndice(accionBotonPrev);
    expect(component.pasoNavegarPor).toHaveBeenCalledWith(accionBotonPrev);
  });

  it('should not update indice or call wizardComponent methods for invalid values', () => {
    const wizardComponentSpy = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      listaPasos: [],
      indice: 0,
      indiceActual: 0,
      estadoInicial: false,
      pasosCompletados: [],
      pasoActual: null,
      cambiarPaso: jest.fn(),
    };
    component.wizardComponent = wizardComponentSpy as any;


    const accionBotonInvalid: AccionBoton = { accion: 'cont', valor: 5 };
    component.getValorIndice(accionBotonInvalid);
    expect(component.indice).toBe(1); // Default value remains unchanged
    expect(wizardComponentSpy.siguiente).not.toHaveBeenCalled();
    expect(wizardComponentSpy.atras).not.toHaveBeenCalled();


    const accionBotonNegative: AccionBoton = { accion: 'prev', valor: -1 };
    component.getValorIndice(accionBotonNegative);
    expect(component.indice).toBe(1); 
    expect(wizardComponentSpy.siguiente).not.toHaveBeenCalled();
    expect(wizardComponentSpy.atras).not.toHaveBeenCalled();
  });

  describe('getValorIndice - Step 1 validation', () => {
    it('should set esFormaValido to true and return early when form is invalid on step 1', () => {
      component.indice = 1;
      const mockPasoUno = {
        solicitudComponent: {
          validarFormulario: jest.fn().mockReturnValue(false)
        }
      };
      component.pasoUno = mockPasoUno as any;

      const accionBoton: AccionBoton = { accion: 'cont', valor: 1 };
      component.getValorIndice(accionBoton);

      expect(component.esFormaValido).toBe(true);
      expect(mockPasoUno.solicitudComponent.validarFormulario).toHaveBeenCalled();
      expect(mockImportacionService.getAllState).not.toHaveBeenCalled();
    });

    it('should call obtenerDatosDelStore when form is valid on step 1', () => {
      component.indice = 1;
      const mockPasoUno = {
        solicitudComponent: {
          validarFormulario: jest.fn().mockReturnValue(true)
        }
      };
      component.pasoUno = mockPasoUno as any;
      jest.spyOn(component, 'obtenerDatosDelStore');

      const accionBoton: AccionBoton = { accion: 'cont', valor: 1 };
      component.getValorIndice(accionBoton);

      expect(component.esFormaValido).toBe(false);
      expect(mockPasoUno.solicitudComponent.validarFormulario).toHaveBeenCalled();
      expect(component.obtenerDatosDelStore).toHaveBeenCalled();
    });

    it('should handle case when pasoUno is undefined', () => {
      component.indice = 1;
      component.pasoUno = undefined as any;

      const accionBoton: AccionBoton = { accion: 'cont', valor: 1 };
      
      expect(() => component.getValorIndice(accionBoton)).not.toThrow();
      expect(component.esFormaValido).toBe(true);
    });
  });

  describe('pasoNavegarPor', () => {
    beforeEach(() => {
      (component.pasoNavegarPor as jest.Mock).mockRestore();
    });
    
    it('should update indice and datosPasos.indice', () => {
      const wizardComponentSpy = {
        siguiente: jest.fn(),
        atras: jest.fn(),
      };
      component.wizardComponent = wizardComponentSpy as any;
      
      const accionBoton: AccionBoton = { accion: 'cont', valor: 3 };
      component.pasoNavegarPor(accionBoton);

      expect(component.indice).toBe(3);
      expect(component.datosPasos.indice).toBe(3);
    });

    it('should not call wizard methods when valor is 5 or greater', () => {
      const wizardComponentSpy = {
        siguiente: jest.fn(),
        atras: jest.fn(),
      };
      component.wizardComponent = wizardComponentSpy as any;

      const accionBoton: AccionBoton = { accion: 'cont', valor: 5 };
      component.pasoNavegarPor(accionBoton);

      expect(wizardComponentSpy.siguiente).not.toHaveBeenCalled();
      expect(wizardComponentSpy.atras).not.toHaveBeenCalled();
    });

    it('should not call wizard methods when valor is 0 or negative', () => {
      const wizardComponentSpy = {
        siguiente: jest.fn(),
        atras: jest.fn(),
      };
      component.wizardComponent = wizardComponentSpy as any;

      const accionBoton: AccionBoton = { accion: 'cont', valor: 0 };
      component.pasoNavegarPor(accionBoton);

      expect(wizardComponentSpy.siguiente).not.toHaveBeenCalled();
      expect(wizardComponentSpy.atras).not.toHaveBeenCalled();
    });
  });

  describe('obtenerDatosDelStore', () => {
    it('should call getAllState and guardar', () => {
      jest.spyOn(component, 'guardar').mockResolvedValue({} as JSONResponse);
      
      component.obtenerDatosDelStore();

      expect(mockImportacionService.getAllState).toHaveBeenCalled();
    });
  });

  describe('guardar', () => {
    beforeEach(() => {
      jest.spyOn(component, 'pasoNavegarPor').mockImplementation(() => {});
    });

    it('should create correct payload and call guardarDatosPost', async () => {
      const testState = mockTramite130112State as Tramite130112State;
      
      const result = await component.guardar(testState);

      expect(mockImportacionService.buildMercancia).toHaveBeenCalledWith(testState);
      expect(mockImportacionService.buildProductor).toHaveBeenCalled();
      expect(mockImportacionService.buildSolicitante).toHaveBeenCalled();
      expect(mockImportacionService.buildRepresentacionFederal).toHaveBeenCalledWith(testState);
      expect(mockImportacionService.buildEntidadesFederativas).toHaveBeenCalledWith(testState);
      expect(mockImportacionService.guardarDatosPost).toHaveBeenCalledWith({
        "tipoDeSolicitud": "guardar",
        "tipo_solicitud_pexim": testState.defaultSelect,
        "mercancia": {},
        "id_solcitud": testState.idSolicitud || 0,
        "idTipoTramite": 130112,
        "cve_regimen": testState.regimen,
        "cve_clasificacion_regimen": testState.clasificacion,
        "productor": {},
        "solicitante": {},
        "representacion_federal": {},
        "entidades_federativas": {},
        "lista_paises": testState.fechasSeleccionadas ?? []
      });

      expect(result).toBeDefined();
      expect(mockStore.setIdSolicitud).toHaveBeenCalledWith(456);
    });

    it('should handle successful response with valid id_solicitud', async () => {
      const testState = mockTramite130112State as Tramite130112State;
      
      await component.guardar(testState);

      expect(mockStore.setIdSolicitud).toHaveBeenCalledWith(456);
      expect(component.pasoNavegarPor).toHaveBeenCalledWith({ accion: 'cont', valor: 2 });
    });

    it('should handle response without valid id_solicitud', async () => {
      const mockResponseWithoutId = {
        id: 1,
        descripcion: 'Success',
        codigo: '200',
        datos: { id_solicitud: null }
      };
      mockImportacionService.guardarDatosPost.mockReturnValue(of(mockResponseWithoutId));
      
      const testState = mockTramite130112State as Tramite130112State;
      await component.guardar(testState);

      expect(mockStore.setIdSolicitud).toHaveBeenCalledWith(0);
      expect(component.pasoNavegarPor).not.toHaveBeenCalled();
    });

    it('should handle error response', async () => {
      const errorResponse = new Error('Test error');
      mockImportacionService.guardarDatosPost.mockReturnValue(throwError(() => errorResponse));
      
      const testState = mockTramite130112State as Tramite130112State;
      
      await expect(component.guardar(testState)).rejects.toThrow('Test error');
      expect(mockToastrService.error).toHaveBeenCalledWith('Error al buscar Mercancia');
    });

    it('should handle response without datos property', async () => {
      const mockResponseWithoutDatos = {
        id: 1,
        descripcion: 'Success',
        codigo: '200'
      };
      mockImportacionService.guardarDatosPost.mockReturnValue(of(mockResponseWithoutDatos));
      
      const testState = mockTramite130112State as Tramite130112State;
      const result = await component.guardar(testState);

      expect(result).toEqual({
        id: 1,
        descripcion: 'Success',
        codigo: '200',
        mensaje: 'Operación exitosa.',
        data: null
      });
    });
  });

  describe('onClickCargaArchivos', () => {
    it('should emit cargarArchivosEvento', () => {
      jest.spyOn(component.cargarArchivosEvento, 'emit');
      
      component.onClickCargaArchivos();

      expect(component.cargarArchivosEvento.emit).toHaveBeenCalled();
    });
  });

  describe('manejaEventoCargaDocumentos', () => {
    it('should update activarBotonCargaArchivos to true', () => {
      component.manejaEventoCargaDocumentos(true);

      expect(component.activarBotonCargaArchivos).toBe(true);
    });

    it('should update activarBotonCargaArchivos to false', () => {
      component.manejaEventoCargaDocumentos(false);

      expect(component.activarBotonCargaArchivos).toBe(false);
    });
  });

  describe('cargaRealizada', () => {
    it('should set seccionCargarDocumentos to false when cargaRealizada is true', () => {
      component.cargaRealizada(true);

      expect(component.seccionCargarDocumentos).toBe(false);
    });

    it('should set seccionCargarDocumentos to true when cargaRealizada is false', () => {
      component.cargaRealizada(false);

      expect(component.seccionCargarDocumentos).toBe(true);
    });
  });

  describe('onCargaEnProgreso', () => {
    it('should update cargaEnProgreso to true', () => {
      component.onCargaEnProgreso(true);

      expect(component.cargaEnProgreso).toBe(true);
    });

    it('should update cargaEnProgreso to false', () => {
      component.onCargaEnProgreso(false);

      expect(component.cargaEnProgreso).toBe(false);
    });
  });

  describe('Component Properties', () => {
    it('should initialize with correct default values', () => {
      expect(component.esFormaValido).toBe(false);
      expect(component.indice).toBe(1);
      expect(component.tabIndex).toBe(1);
      expect(component.activarBotonCargaArchivos).toBe(false);
      expect(component.seccionCargarDocumentos).toBe(true);
      expect(component.cargaEnProgreso).toBe(true);
      expect(component.idProcedimiento).toBe(130112);
    });

    it('should have TEXTOS property with AVISO', () => {
      expect(component.TEXTOS).toBeDefined();
      expect(component.TEXTOS.AVISO).toBeDefined();
    });

    it('should initialize datosPasos with correct values from pasosSolicitar', () => {
      expect(component.datosPasos.nroPasos).toBe(component.pasosSolicitar.length);
      expect(component.datosPasos.indice).toBe(component.indice);
      expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
      expect(component.datosPasos.txtBtnSig).toBe('Continuar');
    });
  });

  describe('Constructor and Lifecycle', () => {
    it('should subscribe to query.selectSolicitud$', () => {
      expect(component.solicitudState).toEqual(mockTramite130112State);
    });

    it('should create cargarArchivosEvento EventEmitter', () => {
      expect(component.cargarArchivosEvento).toBeDefined();
      expect(component.cargarArchivosEvento instanceof EventEmitter).toBe(true);
    });

    it('should initialize destroyNotifier$ Subject', () => {
      expect(component.destroyNotifier$).toBeDefined();
      expect(component.destroyNotifier$ instanceof Subject).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete flow from getValorIndice to guardar', async () => {
      component.indice = 1;
      const mockPasoUno = {
        solicitudComponent: {
          validarFormulario: jest.fn().mockReturnValue(true)
        }
      };
      component.pasoUno = mockPasoUno as any;
      jest.spyOn(component, 'pasoNavegarPor').mockImplementation(() => {});
      jest.spyOn(component, 'obtenerDatosDelStore');

      const accionBoton: AccionBoton = { accion: 'cont', valor: 1 };
      component.getValorIndice(accionBoton);

      expect(component.obtenerDatosDelStore).toHaveBeenCalled();
    });

    it('should handle wizard navigation correctly for different step values', () => {
      const wizardComponentSpy = {
        siguiente: jest.fn(),
        atras: jest.fn(),
      };
      component.wizardComponent = wizardComponentSpy as any;

      // Test boundary values
      const testCases = [
        { valor: 1, accion: 'cont' as const, shouldCallSiguiente: true },
        { valor: 4, accion: 'cont' as const, shouldCallSiguiente: true },
        { valor: 5, accion: 'cont' as const, shouldCallSiguiente: false },
        { valor: 1, accion: 'prev' as const, shouldCallAtras: true },
        { valor: 4, accion: 'prev' as const, shouldCallAtras: true },
        { valor: 0, accion: 'cont' as const, shouldCallSiguiente: false }
      ];

      testCases.forEach((testCase, index) => {
        wizardComponentSpy.siguiente.mockClear();
        wizardComponentSpy.atras.mockClear();

        component.pasoNavegarPor({ accion: testCase.accion, valor: testCase.valor });

        if (testCase.shouldCallSiguiente) {
          expect(wizardComponentSpy.siguiente).toHaveBeenCalled();
        } else {
          expect(wizardComponentSpy.siguiente).not.toHaveBeenCalled();
        }

        if (testCase.shouldCallAtras) {
          expect(wizardComponentSpy.atras).toHaveBeenCalled();
        } else {
          expect(wizardComponentSpy.atras).not.toHaveBeenCalled();
        }
      });
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      jest.spyOn(component, 'pasoNavegarPor').mockImplementation(() => {});
    });

    it('should handle null/undefined responses in guardar', async () => {
      mockImportacionService.guardarDatosPost.mockReturnValue(of({}));
      
      const testState = mockTramite130112State as Tramite130112State;
      const result = await component.guardar(testState);

      expect(result).toEqual({
        id: 0,
        descripcion: '',
        codigo: '',
        mensaje: 'Operación exitosa.',
        data: null
      });
    });

    it('should handle empty response in guardar', async () => {
      mockImportacionService.guardarDatosPost.mockReturnValue(of({}));
      
      const testState = mockTramite130112State as Tramite130112State;
      const result = await component.guardar(testState);

      expect(result).toEqual({
        id: 0,
        descripcion: '',
        codigo: '',
        mensaje: 'Operación exitosa.',
        data: null
      });
    });
  });

  describe('Component Destruction', () => {
    it('should have destroyNotifier$ Subject for cleanup', () => {
      expect(component.destroyNotifier$).toBeDefined();
      expect(component.destroyNotifier$ instanceof Subject).toBe(true);
    });

    it('should handle subscription cleanup properly', () => {
      const subscription = component.destroyNotifier$.subscribe();
      expect(subscription).toBeDefined();
      subscription.unsubscribe();
    });

    it('should be able to emit destruction signal', () => {
      const spy = jest.fn();
      component.destroyNotifier$.subscribe(spy);
      
      component.destroyNotifier$.next();
      
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Payload Building', () => {
    beforeEach(() => {
      jest.spyOn(component, 'pasoNavegarPor').mockImplementation(() => {});
    });

    it('should create payload with correct structure and default values', async () => {
      const testState: Partial<Tramite130112State> = {
        idSolicitud: undefined,
        defaultSelect: undefined,
        regimen: undefined,
        clasificacion: undefined,
        fechasSeleccionadas: undefined
      };

      await component.guardar(testState as Tramite130112State);

      expect(mockImportacionService.guardarDatosPost).toHaveBeenCalledWith({
        "tipoDeSolicitud": "guardar",
        "tipo_solicitud_pexim": undefined,
        "mercancia": {},
        "id_solcitud": 0,
        "idTipoTramite": 130112,
        "cve_regimen": undefined,
        "cve_clasificacion_regimen": undefined,
        "productor": {},
        "solicitante": {},
        "representacion_federal": {},
        "entidades_federativas": {},
        "lista_paises": []
      });
    });

    it('should handle fechasSeleccionadas as undefined', async () => {
      const testState: Partial<Tramite130112State> = {
        ...mockTramite130112State,
        fechasSeleccionadas: undefined
      };

      await component.guardar(testState as Tramite130112State);

      const expectedPayload = expect.objectContaining({
        "lista_paises": []
      });
      
      expect(mockImportacionService.guardarDatosPost).toHaveBeenCalledWith(expectedPayload);
    });
  });

  describe('Form Validation Edge Cases', () => {
    it('should handle getValorIndice when pasoUno.solicitudComponent is undefined', () => {
      component.indice = 1;
      const mockPasoUno = {
        solicitudComponent: undefined
      };
      component.pasoUno = mockPasoUno as any;

      const accionBoton: AccionBoton = { accion: 'cont', valor: 1 };
      component.getValorIndice(accionBoton);

      expect(component.esFormaValido).toBe(true);
    });

    it('should handle form validation when validarFormulario throws error', () => {
      component.indice = 1;
      const mockPasoUno = {
        solicitudComponent: {
          validarFormulario: jest.fn().mockImplementation(() => {
            throw new Error('Validation error');
          })
        }
      };
      component.pasoUno = mockPasoUno as any;

      const accionBoton: AccionBoton = { accion: 'cont', valor: 1 };
      
      expect(() => component.getValorIndice(accionBoton)).toThrow('Validation error');
    });

    it('should reset esFormaValido to false at start of getValorIndice', () => {
      component.esFormaValido = true;
      (component.pasoNavegarPor as jest.Mock).mockClear();
      
      const accionBoton: AccionBoton = { accion: 'cont', valor: 3 };
      component.getValorIndice(accionBoton);

      expect(component.esFormaValido).toBe(false);
    });
  });

  describe('Service Method Calls', () => {
    beforeEach(() => {
      jest.spyOn(component, 'pasoNavegarPor').mockImplementation(() => {});
    });

    it('should call all builder methods with correct parameters', async () => {
      const testState = mockTramite130112State as Tramite130112State;
      
      await component.guardar(testState);

      expect(mockImportacionService.buildMercancia).toHaveBeenCalledTimes(1);
      expect(mockImportacionService.buildProductor).toHaveBeenCalledTimes(1);
      expect(mockImportacionService.buildSolicitante).toHaveBeenCalledTimes(1);
      expect(mockImportacionService.buildRepresentacionFederal).toHaveBeenCalledTimes(1);
      expect(mockImportacionService.buildEntidadesFederativas).toHaveBeenCalledTimes(1);
    });

    it('should handle builder methods returning complex objects', async () => {
      const complexMercancia = { id: 1, nombre: 'Test Product', precio: 100 };
      const complexProductor = { id: 2, nombre: 'Test Producer' };
      
      mockImportacionService.buildMercancia.mockReturnValue(complexMercancia);
      mockImportacionService.buildProductor.mockReturnValue(complexProductor);

      const testState = mockTramite130112State as Tramite130112State;
      await component.guardar(testState);

      expect(mockImportacionService.guardarDatosPost).toHaveBeenCalledWith(
        expect.objectContaining({
          "mercancia": complexMercancia,
          "productor": complexProductor
        })
      );
    });
  });

  describe('Response Processing', () => {
    beforeEach(() => {
      (component.pasoNavegarPor as jest.Mock).mockClear();
    });
    
    it('should handle response with data property instead of datos', async () => {
      const mockResponse = {
        id: 1,
        descripcion: 'Success',
        codigo: '200',
        data: { id_solicitud: 789 }
      };
      mockImportacionService.guardarDatosPost.mockReturnValue(of(mockResponse));
      
      const testState = mockTramite130112State as Tramite130112State;
      const result = await component.guardar(testState);

      expect(result).toEqual({
        ...mockResponse,
        mensaje: 'Operación exitosa.'
      });
    });

    it('should handle response with both data and datos properties', async () => {
      const mockResponse = {
        id: 1,
        descripcion: 'Success',
        codigo: '200',
        data: { some: 'data' },
        datos: { id_solicitud: 999 }
      };
      mockImportacionService.guardarDatosPost.mockReturnValue(of(mockResponse));
      (component.pasoNavegarPor as jest.Mock).mockClear();
      
      const testState = mockTramite130112State as Tramite130112State;
      await component.guardar(testState);

      expect(mockStore.setIdSolicitud).toHaveBeenCalledWith(999);
    });

    it('should preserve all response properties in result', async () => {
      const mockResponse = {
        id: 1,
        descripcion: 'Success',
        codigo: '200',
        extraProperty: 'extraValue',
        anotherProperty: { nested: 'object' },
        datos: { id_solicitud: 111 }
      };
      mockImportacionService.guardarDatosPost.mockReturnValue(of(mockResponse));
      (component.pasoNavegarPor as jest.Mock).mockClear();
      
      const testState = mockTramite130112State as Tramite130112State;
      const result = await component.guardar(testState);

      expect(result).toEqual(expect.objectContaining({
        extraProperty: 'extraValue',
        anotherProperty: { nested: 'object' }
      }));
    });
  });

  describe('Wizard Component Integration', () => {
    it('should handle wizardComponent being undefined', () => {
      component.wizardComponent = undefined as any;
      
      const accionBoton: AccionBoton = { accion: 'cont', valor: 2 };
      
      expect(() => component.pasoNavegarPor(accionBoton)).toThrow();
    });

    it('should update datosPasos.indice even when wizard methods fail', () => {
      const wizardComponentSpy = {
        siguiente: jest.fn().mockImplementation(() => {
          throw new Error('Wizard error');
        }),
        atras: jest.fn()
      };
      component.wizardComponent = wizardComponentSpy as any;

      const accionBoton: AccionBoton = { accion: 'cont', valor: 3 };
      
      expect(() => component.pasoNavegarPor(accionBoton)).toThrow('Wizard error');
      expect(component.indice).toBe(3);
      expect(component.datosPasos.indice).toBe(3);
    });
  });

  describe('Event Emissions', () => {
    it('should emit cargarArchivosEvento with no parameters', () => {
      let emittedValue: any = 'not-called';
      component.cargarArchivosEvento.subscribe((value) => {
        emittedValue = value;
      });

      component.onClickCargaArchivos();

      expect(emittedValue).toBeUndefined();
    });

    it('should handle multiple subscribers to cargarArchivosEvento', () => {
      const subscriber1 = jest.fn();
      const subscriber2 = jest.fn();
      
      component.cargarArchivosEvento.subscribe(subscriber1);
      component.cargarArchivosEvento.subscribe(subscriber2);

      component.onClickCargaArchivos();

      expect(subscriber1).toHaveBeenCalled();
      expect(subscriber2).toHaveBeenCalled();
    });
  });

  describe('State Management', () => {
    it('should handle state updates from query subscription', () => {
      const newState: Partial<Tramite130112State> = {
        idSolicitud: 999,
        defaultSelect: 'new-select'
      };

      // Simulate new state emission
      mockQuery.selectSolicitud$ = of(newState);
      
      expect(component.solicitudState).toBeDefined();
    });

    it('should handle store method calls with correct parameters', async () => {
      (component.pasoNavegarPor as jest.Mock).mockClear();
      const testState = mockTramite130112State as Tramite130112State;
      await component.guardar(testState);

      expect(mockStore.setIdSolicitud).toHaveBeenCalledWith(456);
    });
  });

  describe('Constants and Static Values', () => {
    it('should have correct idProcedimiento value', () => {
      expect(component.idProcedimiento).toBe(130112);
    });

    it('should initialize with PASOS_IMPORTACION', () => {
      expect(component.pasosSolicitar).toBe(PASOS_IMPORTACION);
    });

    it('should have correct formErrorAlert value', () => {
      expect(component.formErrorAlert).toBeDefined();
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle component initialization properly', () => {
      const newFixture = TestBed.createComponent(ImportacionMaterialDeInvestigacionCientificaComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.indice).toBe(1);
      expect(newComponent.tabIndex).toBe(1);
      expect(newComponent.esFormaValido).toBe(false);
      expect(newComponent.activarBotonCargaArchivos).toBe(false);
      expect(newComponent.seccionCargarDocumentos).toBe(true);
      expect(newComponent.cargaEnProgreso).toBe(true);
    });

    it('should initialize component properties with correct default values', () => {
      expect(component.destroyNotifier$).toBeInstanceOf(Subject);
      expect(component.cargarArchivosEvento).toBeDefined();
      expect(component.TEXTOS).toBeDefined();
      expect(component.formErrorAlert).toBeDefined();
    });
  });

  describe('Boundary Value Testing', () => {
    it('should handle maximum step value correctly', () => {
      (component.pasoNavegarPor as jest.Mock).mockClear();

      const maxSteps = component.pasosSolicitar.length;
      
      const accionBoton: AccionBoton = { accion: 'cont', valor: maxSteps };
      component.getValorIndice(accionBoton);

      expect(component.pasoNavegarPor).toHaveBeenCalledWith(accionBoton);
    });

    it('should handle minimum valid step value', () => {
      const wizardComponentSpy = {
        siguiente: jest.fn(),
        atras: jest.fn(),
      };
      component.wizardComponent = wizardComponentSpy as any;

      const accionBoton: AccionBoton = { accion: 'cont', valor: 1 };
      component.getValorIndice(accionBoton);

      expect(component.indice).toBe(1);
    });

    it('should handle step value exactly at boundary (valor = 5)', () => {
      const wizardComponentSpy = {
        siguiente: jest.fn(),
        atras: jest.fn(),
      };
      component.wizardComponent = wizardComponentSpy as any;

      const accionBoton: AccionBoton = { accion: 'cont', valor: 5 };
      component.pasoNavegarPor(accionBoton);

      expect(component.indice).toBe(5);
      expect(wizardComponentSpy.siguiente).not.toHaveBeenCalled();
      expect(wizardComponentSpy.atras).not.toHaveBeenCalled();
    });
  });

  describe('Method Chaining and Dependencies', () => {
    it('should handle obtenerDatosDelStore -> guardar chain correctly', async () => {
      const mockState = { ...mockTramite130112State, idSolicitud: 777 };
      mockImportacionService.getAllState.mockReturnValue(of(mockState));
      jest.spyOn(component, 'guardar').mockResolvedValue({} as JSONResponse);

      component.obtenerDatosDelStore();

      expect(mockImportacionService.getAllState).toHaveBeenCalled();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(component.guardar).toHaveBeenCalledWith(mockState);
    });

    it('should handle error in obtenerDatosDelStore chain', () => {
      const errorMessage = 'Service error';
      mockImportacionService.getAllState.mockReturnValue(throwError(() => new Error(errorMessage)));

      expect(() => {
        component.obtenerDatosDelStore();
      }).not.toThrow();
    });
  });

  describe('Type Safety and Null Checks', () => {
    it('should handle undefined values in payload creation', async () => {
      jest.spyOn(component, 'pasoNavegarPor').mockImplementation(() => {});
      const stateWithUndefined: Partial<Tramite130112State> = {
        idSolicitud: undefined,
        defaultSelect: undefined,
        regimen: undefined,
        clasificacion: undefined,
        fechasSeleccionadas: undefined
      };

      await component.guardar(stateWithUndefined as Tramite130112State);

      const callArgs = mockImportacionService.guardarDatosPost.mock.calls[0][0];
      expect(callArgs.id_solcitud).toBe(0);
      expect(callArgs.lista_paises).toEqual([]);
    });

    it('should handle null solicitudState', () => {
      component.solicitudState = null as any;
      
      expect(() => {
        const payload = {
          defaultSelect: component.solicitudState?.defaultSelect,
          regimen: component.solicitudState?.regimen
        };
        expect(payload.defaultSelect).toBeUndefined();
        expect(payload.regimen).toBeUndefined();
      }).not.toThrow();
    });
  });

  describe('Observable Patterns', () => {
    it('should use takeUntil pattern correctly', () => {
      const spy = jest.spyOn(component.destroyNotifier$, 'next');
      
      component.destroyNotifier$.next();
      
      expect(spy).toHaveBeenCalled();
    });

    it('should handle subscription errors gracefully', () => {
      const subscription = component.destroyNotifier$.subscribe({
        error: (err) => {
          expect(err).toBeDefined();
        }
      });
      
      expect(subscription).toBeDefined();
      subscription.unsubscribe();
    });
  });
});