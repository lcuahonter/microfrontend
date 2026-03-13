import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallasComponent } from './pantallas.component';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { SolicitudDeRegistroTplService } from '../../services/solicitud-de-registro-tpl.service';
import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { ToastrService } from 'ngx-toastr';
import { Tramite120101Store } from '../../../../estados/tramites/tramite120101.store';
import { Tramite120101Query } from '../../../../estados/queries/tramite120101.query';
import { WizardService } from '@libs/shared/data-access-user/src';
import { of, throwError } from 'rxjs';

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;
  let servicioDeFormularioService: jest.Mocked<ServicioDeFormularioService>;
  let consultaQuery: jest.Mocked<ConsultaioQuery>;
  let solicitudDeRegistroTplService: jest.Mocked<SolicitudDeRegistroTplService>;
  let ampliacionServiciosAdapter: jest.Mocked<AmpliacionServiciosAdapter>;
  let toastrService: jest.Mocked<ToastrService>;
  let tramite120101Store: jest.Mocked<Tramite120101Store>;
  let tramite120101Query: jest.Mocked<Tramite120101Query>;
  let wizardService: jest.Mocked<WizardService>;

  beforeEach(async () => {
    const servicioDeFormularioServiceMock = {
      isFormValid: jest.fn(),
      markFormAsTouched: jest.fn(),
    };

    const consultaQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    const solicitudDeRegistroTplServiceMock = {
      getAllState: jest.fn(),
      guardarDatosPost: jest.fn(),
      guardarPartialPost: jest.fn(),
    };

    const ampliacionServiciosAdapterMock = {
      toFormGuardarPayload: jest.fn(),
    };

    const toastrServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
    };

    const tramite120101StoreMock = {
      setDynamicFieldValue: jest.fn(),
    };

    const tramite120101QueryMock = {
      selectSolicitudDeRegistroTpl$: of({ idSolicitud: 123, idMecanismo: 456 }),
    };

    const wizardServiceMock = {
      cambio_indice: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PantallasComponent],
      providers: [
        { provide: ServicioDeFormularioService, useValue: servicioDeFormularioServiceMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: SolicitudDeRegistroTplService, useValue: solicitudDeRegistroTplServiceMock },
        { provide: AmpliacionServiciosAdapter, useValue: ampliacionServiciosAdapterMock },
        { provide: ToastrService, useValue: toastrServiceMock },
        { provide: Tramite120101Store, useValue: tramite120101StoreMock },
        { provide: Tramite120101Query, useValue: tramite120101QueryMock },
        { provide: WizardService, useValue: wizardServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
    
    servicioDeFormularioService = TestBed.inject(ServicioDeFormularioService) as jest.Mocked<ServicioDeFormularioService>;
    consultaQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;
    solicitudDeRegistroTplService = TestBed.inject(SolicitudDeRegistroTplService) as jest.Mocked<SolicitudDeRegistroTplService>;
    ampliacionServiciosAdapter = TestBed.inject(AmpliacionServiciosAdapter) as jest.Mocked<AmpliacionServiciosAdapter>;
    toastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;
    tramite120101Store = TestBed.inject(Tramite120101Store) as jest.Mocked<Tramite120101Store>;
    tramite120101Query = TestBed.inject(Tramite120101Query) as jest.Mocked<Tramite120101Query>;
    wizardService = TestBed.inject(WizardService) as jest.Mocked<WizardService>;
  });

  describe('Inicialización del componente', () => {
    it('debe crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debe inicializar las propiedades correctamente', () => {
      expect(component.indice).toBe(1);
      expect(component.padreBtn).toBe(true);
      expect(component.idSolicitud).toBe(0);
      expect(component.idMecanismo).toBe(0);
      expect(component.obtenorVisibile).toBe(false);
      expect(component.mostrarAplicacionRegistradaAlerta).toBe(false);
      expect(component.pestanaDosFormularioValido).toBe(false);
    });

    it('debe configurar datosPasos correctamente', () => {
      expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
      expect(component.datosPasos.indice).toBe(1);
      expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
      expect(component.datosPasos.txtBtnSig).toBe('Continuar');
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('debe suscribirse al estado de consulta', () => {
      expect(component.consultaState).toEqual({ readonly: false });
    });

    it('debe establecer pestanaDosFormularioValido como true cuando readonly es true', () => {
      consultaQuery.selectConsultaioState$ = of({ readonly: true });
      component.ngOnInit();
      expect(component.pestanaDosFormularioValido).toBe(true);
    });

    it('debe actualizar idSolicitud e idMecanismo desde el estado', () => {
      expect(component.idSolicitud).toBe(123);
      expect(component.idMecanismo).toBe(456);
    });
  });

  describe('Validaciones de formularios', () => {
    it('debe verificar la validez del formulario sin idSolicitud', () => {
      component.idSolicitud = 0;
      servicioDeFormularioService.isFormValid.mockReturnValue(true);
      
      const resultado = component.verificarLaValidezDelFormulario();
      
      expect(resultado).toBe(true);
      expect(servicioDeFormularioService.isFormValid).toHaveBeenCalledWith('representacionFederalForm');
    });

    it('debe verificar la validez de todos los formularios con idSolicitud', () => {
      component.idSolicitud = 123;
      servicioDeFormularioService.isFormValid.mockReturnValue(true);
      
      const resultado = component.verificarLaValidezDelFormulario();
      
      expect(resultado).toBe(true);
      expect(servicioDeFormularioService.isFormValid).toHaveBeenCalledWith('bienFinalForm');
      expect(servicioDeFormularioService.isFormValid).toHaveBeenCalledWith('representacionFederalForm');
      expect(servicioDeFormularioService.isFormValid).toHaveBeenCalledWith('insumosForm');
      expect(servicioDeFormularioService.isFormValid).toHaveBeenCalledWith('procesoProductivoForm');
    });

    describe('Getters de validación', () => {
      it('debe retornar true para esConsultarCupoFormValid cuando el formulario es válido', () => {
        servicioDeFormularioService.isFormValid.mockReturnValue(true);
        expect(component.esConsultarCupoFormValid).toBe(true);
      });

      it('debe retornar false para esBienFinalFormValid cuando el formulario es inválido', () => {
        servicioDeFormularioService.isFormValid.mockReturnValue(false);
        expect(component.esBienFinalFormValid).toBe(false);
      });

      it('debe retornar true para esRepresentacionFederalFormValid cuando el formulario es válido', () => {
        servicioDeFormularioService.isFormValid.mockReturnValue(true);
        expect(component.esRepresentacionFederalFormValid).toBe(true);
      });

      it('debe retornar true para esInsumosFormValid cuando el formulario es válido', () => {
        servicioDeFormularioService.isFormValid.mockReturnValue(true);
        expect(component.esInsumosFormValid).toBe(true);
      });

      it('debe retornar true para esProcesoProductivoFormValid cuando el formulario es válido', () => {
        servicioDeFormularioService.isFormValid.mockReturnValue(true);
        expect(component.esProcesoProductivoFormValid).toBe(true);
      });
    });
  });

  describe('pestanaCambiado', () => {
    it('debe actualizar subpestanaSeleccionada cuando se proporciona un evento', () => {
      component.pestanaCambiado(3);
      expect(component.subpestanaSeleccionada).toBe(3);
    });

    it('no debe actualizar subpestanaSeleccionada cuando el evento es falsy', () => {
      const valorAnterior = component.subpestanaSeleccionada;
      component.pestanaCambiado(0);
      expect(component.subpestanaSeleccionada).toBe(valorAnterior);
    });
  });

  describe('getValorIndice', () => {
    beforeEach(() => {
      component.consultaState = { readonly: false };
      component.pasoUnoComponent = { validarFormularios: jest.fn() } as any;
      component.wizardComponent = { 
        siguiente: jest.fn(),
        atras: jest.fn() 
      } as any;
      jest.spyOn(component, 'verificarLaValidezDelFormulario').mockReturnValue(true);
      jest.spyOn(component, 'shouldNavigate$' as any).mockReturnValue(of(true));
    });

    it('debe mostrar alerta y establecer pestanaDosFormularioValido cuando los formularios son válidos', () => {
      servicioDeFormularioService.isFormValid.mockReturnValue(true);
      
      component.getValorIndice({ valor: 1, accion: 'cont' });
      
      expect(component.mostrarAplicacionRegistradaAlerta).toBe(true);
      expect(component.pestanaDosFormularioValido).toBe(true);
    });

    it('debe validar formularios y retornar temprano si esFormaValido es falso', () => {
      jest.spyOn(component, 'verificarLaValidezDelFormulario').mockReturnValue(false);
      
      component.getValorIndice({ valor: 1, accion: 'cont' });
      
      expect(component.pasoUnoComponent.validarFormularios).toHaveBeenCalled();
    });

    it('debe navegar hacia adelante cuando la acción es continuar', () => {
      component.idSolicitud = 123;
      servicioDeFormularioService.isFormValid.mockReturnValue(true);
      
      component.getValorIndice({ valor: 1, accion: 'cont' });
      
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(wizardService.cambio_indice).toHaveBeenCalledWith(2);
    });

    it('debe navegar hacia atrás cuando la acción es anterior', () => {
      component.indice = 2;
      
      component.getValorIndice({ valor: 2, accion: 'ant' });
      
      expect(component.indice).toBe(1);
      expect(component.datosPasos.indice).toBe(1);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
    });

    it('no debe hacer nada si consultaState.readonly es true', () => {
      component.consultaState = { readonly: true };
      const indicePrevio = component.indice;
      
      component.getValorIndice({ valor: 1, accion: 'cont' });
      
      expect(component.indice).toBe(indicePrevio);
    });
  });

  describe('guardar', () => {
    const mockState = { test: 'data' };
    const mockPayload = { payload: 'test' };
    const mockResponse = { 
      codigo: '00', 
      mensaje: 'Éxito',
      datos: { id_solicitud: 789 }
    };

    beforeEach(() => {
      ampliacionServiciosAdapter.toFormGuardarPayload.mockReturnValue(mockPayload);
      solicitudDeRegistroTplService.guardarDatosPost.mockReturnValue(of(mockResponse));
    });

    it('debe guardar correctamente sin idSolicitud', async () => {
      component.idSolicitud = 0;
      
      const resultado = await component.guardar(mockState as any);
      
      expect(ampliacionServiciosAdapter.toFormGuardarPayload).toHaveBeenCalledWith(mockState);
      expect(mockPayload).not.toHaveProperty('insumos');
      expect(mockPayload).not.toHaveProperty('solicitud');
      expect(tramite120101Store.setDynamicFieldValue).toHaveBeenCalledWith('idSolicitud', 789);
      expect(resultado).toEqual(mockResponse);
    });

    it('debe guardar correctamente con idSolicitud', async () => {
      component.idSolicitud = 123;
      
      const resultado = await component.guardar(mockState as any);
      
      expect(mockPayload).toHaveProperty('solicitud', { id_solicitud: 123 });
      expect(resultado).toEqual(mockResponse);
    });

    it('debe manejar errores en el guardado', async () => {
      const error = new Error('Error de guardado');
      solicitudDeRegistroTplService.guardarDatosPost.mockReturnValue(throwError(error));
      
      await expect(component.guardar(mockState as any)).rejects.toThrow('Error de guardado');
    });
  });

  describe('guardarCupo', () => {
    const mockState = { test: 'data' };
    const mockResponse = { codigo: '00', mensaje: 'Guardado exitoso' };

    beforeEach(() => {
      solicitudDeRegistroTplService.getAllState.mockReturnValue(of(mockState as any));
      jest.spyOn(component, 'guardarPartical').mockResolvedValue(mockResponse as any);
    });

    it('debe guardar el cupo exitosamente', () => {
      component.guardarCupo();
      
      expect(solicitudDeRegistroTplService.getAllState).toHaveBeenCalled();
      expect(toastrService.success).toHaveBeenCalledWith('Guardado exitoso');
    });

    it('debe mostrar error cuando el guardado falla', () => {
      const errorResponse = { codigo: '01', mensaje: 'Error en el guardado' };
      jest.spyOn(component, 'guardarPartical').mockResolvedValue(errorResponse as any);
      
      component.guardarCupo();
      
      expect(component.padreBtn).toBe(true);
      expect(toastrService.error).toHaveBeenCalledWith('Error en el guardado');
    });
  });

  describe('guardarPartical', () => {
    const mockState = { test: 'data' };
    const mockPayload = { payload: 'test', solicitud: {}, insumos: {} };
    const mockResponse = { 
      codigo: '00', 
      mensaje: 'Éxito',
      datos: { id_solicitud: 999 }
    };

    beforeEach(() => {
      component.idSolicitud = 456;
      ampliacionServiciosAdapter.toFormGuardarPayload.mockReturnValue(mockPayload);
      solicitudDeRegistroTplService.guardarPartialPost.mockReturnValue(of(mockResponse));
    });

    it('debe guardar parcialmente los datos correctamente', async () => {
      const resultado = await component.guardarPartical(mockState as any);
      
      expect(mockPayload).not.toHaveProperty('insumos');
      expect(mockPayload).not.toHaveProperty('solicitud');
      expect(mockPayload).toHaveProperty('solicitud', { id_solicitud: 456 });
      expect(tramite120101Store.setDynamicFieldValue).toHaveBeenCalledWith('idSolicitud', 999);
      expect(resultado).toEqual(mockResponse);
    });
  });

  describe('obtenerDatosDelStore', () => {
    const mockState = { test: 'data' };

    beforeEach(() => {
      solicitudDeRegistroTplService.getAllState.mockReturnValue(of(mockState as any));
      jest.spyOn(component, 'guardar').mockResolvedValue({} as any);
    });

    it('debe obtener datos del store y guardarlos', () => {
      component.obtenerDatosDelStore();
      
      expect(solicitudDeRegistroTplService.getAllState).toHaveBeenCalled();
      expect(component.stateDatos).toEqual(mockState);
      expect(component.guardar).toHaveBeenCalledWith(mockState);
    });
  });

  describe('continuar', () => {
    beforeEach(() => {
      component.wizardComponent = { siguiente: jest.fn() } as any;
      servicioDeFormularioService.isFormValid.mockReturnValue(true);
      component.esFormaValido = true;
    });

    it('debe marcar formulario como touched si esBienFinalFormValid es false', () => {
      servicioDeFormularioService.isFormValid.mockImplementation((formName) => 
        formName === 'bienFinalForm' ? false : true
      );
      
      component.continuar({ valor: 1, accion: 'cont' });
      
      expect(servicioDeFormularioService.markFormAsTouched).toHaveBeenCalledWith('consultarCupoForm');
    });

    it('debe mostrar alerta cuando subpestanaSeleccionada es 2 y formulario es válido', () => {
      component.subpestanaSeleccionada = 2;
      
      component.continuar({ valor: 1, accion: 'cont' });
      
      expect(component.mostrarAplicacionRegistradaAlerta).toBe(true);
      expect(component.pestanaDosFormularioValido).toBe(true);
    });

    it('debe avanzar al siguiente paso cuando esFormaValido es true', () => {
      component.continuar({ valor: 1, accion: 'cont' });
      
      expect(component.pestanaDosFormularioValido).toBe(true);
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(wizardService.cambio_indice).toHaveBeenCalledWith(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    });

    it('debe ocultar alerta cuando esFormaValido es false', () => {
      component.esFormaValido = false;
      
      component.continuar({ valor: 1, accion: 'cont' });
      
      expect(component.mostrarAplicacionRegistradaAlerta).toBe(false);
    });
  });

  describe('fraccionErrorEvent', () => {
    it('debe actualizar propiedades de error de fracción', () => {
      const evento = { 
        fraccionErrorUno: 'Error en fracción uno', 
        fraccionError: true 
      };
      
      component.fraccionErrorEvent(evento);
      
      expect(component.fraccionErrorUno).toBe('Error en fracción uno');
      expect(component.fraccionError).toBe(true);
    });

    it('debe manejar evento parcial', () => {
      const evento = { fraccionErrorUno: 'Solo error uno' };
      
      component.fraccionErrorEvent(evento);
      
      expect(component.fraccionErrorUno).toBe('Solo error uno');
      expect(component.fraccionError).toBeUndefined();
    });
  });

  describe('obtenerVisible', () => {
    it('debe invertir el estado de visibilidad', () => {
      component.obtenerVisible(true);
      expect(component.obtenorVisibile).toBe(false);
      
      component.obtenerVisible(false);
      expect(component.obtenorVisibile).toBe(true);
    });
  });

  describe('ngOnDestroy', () => {
    it('debe completar el observable destroyNotifier$', () => {
      const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});