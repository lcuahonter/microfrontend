import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { SolicitudDeRegistroTplService } from '../../services/solicitud-de-registro-tpl.service';
import { Tramite120101Store } from '../../../../estados/tramites/tramite120101.store';
import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { of, throwError } from 'rxjs';
import { InstrumentoCupoTPLForm } from '../../../120201/models/cupos.model';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let consultaQuery: jest.Mocked<ConsultaioQuery>;
  let solicitudRegistroService: jest.Mocked<SolicitudDeRegistroTplService>;
  let tramite120101Store: jest.Mocked<Tramite120101Store>;
  let ampliacionServiciosAdapter: jest.Mocked<AmpliacionServiciosAdapter>;

  beforeEach(async () => {
    const consultaQueryMock = {
      selectConsultaioState$: of({
        update: false,
        readonly: false,
        id_solicitud: '123'
      }),
    };

    const solicitudRegistroServiceMock = {
      getMostrarDatos: jest.fn(),
    };

    const tramite120101StoreMock = {
      setDynamicFieldValue: jest.fn(),
      update: jest.fn(),
    };

    const ampliacionServiciosAdapterMock = {
      reverseMapFromPayload: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: SolicitudDeRegistroTplService, useValue: solicitudRegistroServiceMock },
        { provide: Tramite120101Store, useValue: tramite120101StoreMock },
        { provide: AmpliacionServiciosAdapter, useValue: ampliacionServiciosAdapterMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    
    consultaQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;
    solicitudRegistroService = TestBed.inject(SolicitudDeRegistroTplService) as jest.Mocked<SolicitudDeRegistroTplService>;
    tramite120101Store = TestBed.inject(Tramite120101Store) as jest.Mocked<Tramite120101Store>;
    ampliacionServiciosAdapter = TestBed.inject(AmpliacionServiciosAdapter) as jest.Mocked<AmpliacionServiciosAdapter>;
  });

  describe('Inicialización del componente', () => {
    it('debe crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debe inicializar las propiedades correctamente', () => {
      expect(component.esDatosRespuesta).toBe(false);
      expect(component.indice).toBe(1);
      expect(component['destroyNotifier$']).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('debe suscribirse al estado de consulta y establecer esDatosRespuesta como true cuando update es false', () => {
      component.ngOnInit();
      
      expect(component.consultaState).toEqual({
        update: false,
        readonly: false,
        id_solicitud: '123'
      });
      expect(component.esDatosRespuesta).toBe(true);
    });

    it('debe llamar a guardarDatosFormulario cuando update es true', () => {
      consultaQuery.selectConsultaioState$ = of({
        update: true,
        readonly: false,
        id_solicitud: '456'
      });
      
      jest.spyOn(component, 'guardarDatosFormulario');
      
      component.ngOnInit();
      
      expect(component.guardarDatosFormulario).toHaveBeenCalledWith('456');
      expect(tramite120101Store.setDynamicFieldValue).toHaveBeenCalledWith('idSolicitud', '456');
      expect(component.idSolicitud).toBe(456);
      expect(component.esDatosRespuesta).toBe(true);
    });

    it('debe manejar consultaState undefined sin errores', () => {
      consultaQuery.selectConsultaioState$ = of(null as any);
      
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('guardarDatosFormulario', () => {
    const mockRespuesta = {
      datos: {
        id: 1,
        test: 'data'
      }
    };

    const mockDatosTransformados = {
      cuerpoTabla: [
        { id: 1, nombre: 'Test Item' }
      ]
    };

    beforeEach(() => {
      solicitudRegistroService.getMostrarDatos.mockReturnValue(of(mockRespuesta));
      ampliacionServiciosAdapter.reverseMapFromPayload.mockReturnValue(mockDatosTransformados);
    });

    it('debe cargar y transformar los datos correctamente', () => {
      component.guardarDatosFormulario('123');
      
      expect(solicitudRegistroService.getMostrarDatos).toHaveBeenCalledWith('123');
      expect(ampliacionServiciosAdapter.reverseMapFromPayload).toHaveBeenCalledWith(mockRespuesta.datos);
      expect(component.esDatosRespuesta).toBe(true);
      expect(component.pestanaDosFormularioValido).toBe(true);
      expect(component.elementoDeTablaSeleccionado).toEqual({ id: 1, nombre: 'Test Item' });
      expect(tramite120101Store.update).toHaveBeenCalledWith(mockDatosTransformados);
    });

    it('debe manejar datos sin cuerpoTabla', () => {
      const datosSinTabla = { cuerpoTabla: [] };
      ampliacionServiciosAdapter.reverseMapFromPayload.mockReturnValue(datosSinTabla);
      
      component.guardarDatosFormulario('123');
      
      expect(component.elementoDeTablaSeleccionado).toBeUndefined();
    });

    it('debe manejar datos con cuerpoTabla undefined', () => {
      const datosSinTabla = { cuerpoTabla: undefined };
      ampliacionServiciosAdapter.reverseMapFromPayload.mockReturnValue(datosSinTabla);
      
      component.guardarDatosFormulario('123');
      
      expect(component.elementoDeTablaSeleccionado).toBeUndefined();
    });

    it('debe manejar respuesta nula o vacía', () => {
      solicitudRegistroService.getMostrarDatos.mockReturnValue(of(null));
      
      component.guardarDatosFormulario('123');
      
      expect(ampliacionServiciosAdapter.reverseMapFromPayload).not.toHaveBeenCalled();
      expect(tramite120101Store.update).not.toHaveBeenCalled();
    });

    it('debe manejar errores en la solicitud', () => {
      const error = new Error('Error de red');
      solicitudRegistroService.getMostrarDatos.mockReturnValue(throwError(error));
      
      expect(() => component.guardarDatosFormulario('123')).not.toThrow();
    });
  });

  describe('seleccionaTab', () => {
    it('debe cambiar el índice y emitir el evento pestanaCambiado', () => {
      jest.spyOn(component.pestanaCambiado, 'emit');
      
      component.seleccionaTab(3);
      
      expect(component.indice).toBe(3);
      expect(component.pestanaCambiado.emit).toHaveBeenCalledWith(3);
    });

    it('debe cambiar correctamente entre diferentes pestañas', () => {
      jest.spyOn(component.pestanaCambiado, 'emit');
      
      component.seleccionaTab(1);
      expect(component.indice).toBe(1);
      expect(component.pestanaCambiado.emit).toHaveBeenCalledWith(1);
      
      component.seleccionaTab(5);
      expect(component.indice).toBe(5);
      expect(component.pestanaCambiado.emit).toHaveBeenCalledWith(5);
    });

    it('debe manejar valores de índice cero', () => {
      jest.spyOn(component.pestanaCambiado, 'emit');
      
      component.seleccionaTab(0);
      
      expect(component.indice).toBe(0);
      expect(component.pestanaCambiado.emit).toHaveBeenCalledWith(0);
    });
  });

  describe('archivoHagaClicControlador', () => {
    it('debe establecer el elemento seleccionado cuando se proporciona un evento válido', () => {
      const mockEvent: InstrumentoCupoTPLForm = {
        id: 1,
        nombre: 'Test Item',
        descripcion: 'Test Description'
      } as any;
      
      component.archivoHagaClicControlador(mockEvent);
      
      expect(component.elementoDeTablaSeleccionado).toEqual(mockEvent);
    });

    it('no debe cambiar el elemento seleccionado si el evento es null', () => {
      const elementoAnterior = component.elementoDeTablaSeleccionado;
      
      component.archivoHagaClicControlador(null as any);
      
      expect(component.elementoDeTablaSeleccionado).toBe(elementoAnterior);
    });

    it('no debe cambiar el elemento seleccionado si el evento es undefined', () => {
      const elementoAnterior = component.elementoDeTablaSeleccionado;
      
      component.archivoHagaClicControlador(undefined as any);
      
      expect(component.elementoDeTablaSeleccionado).toBe(elementoAnterior);
    });

    it('debe manejar eventos con propiedades parciales', () => {
      const eventoIncompleto: Partial<InstrumentoCupoTPLForm> = {
        id: 2
      };
      
      component.archivoHagaClicControlador(eventoIncompleto as InstrumentoCupoTPLForm);
      
      expect(component.elementoDeTablaSeleccionado).toEqual(eventoIncompleto);
    });
  });

  describe('validarFormularios', () => {
    beforeEach(() => {
      // Mock de los componentes hijo
      component.consultarCupo = {
        validarFormulario: jest.fn()
      } as any;
      
      component.representacionFederal = {
        validarFormulario: jest.fn()
      } as any;
      
      component.bienFinal = {
        validarFormulario: jest.fn()
      } as any;
      
      component.insumos = {
        validarFormulario: jest.fn()
      } as any;
      
      component.procesoProductivo = {
        validarFormulario: jest.fn()
      } as any;
    });

    it('debe llamar al método validarFormulario de todos los componentes hijo', () => {
      component.validarFormularios();
      
      expect(component.consultarCupo.validarFormulario).toHaveBeenCalled();
      expect(component.representacionFederal.validarFormulario).toHaveBeenCalled();
      expect(component.bienFinal.validarFormulario).toHaveBeenCalled();
      expect(component.insumos.validarFormulario).toHaveBeenCalled();
      expect(component.procesoProductivo.validarFormulario).toHaveBeenCalled();
    });

    it('debe manejar componentes hijo que no están definidos', () => {
      component.consultarCupo = undefined as any;
      component.representacionFederal = undefined as any;
      component.bienFinal = undefined as any;
      component.insumos = undefined as any;
      component.procesoProductivo = undefined as any;
      
      expect(() => component.validarFormularios()).not.toThrow();
    });

    it('debe manejar componentes hijo parcialmente definidos', () => {
      component.consultarCupo = undefined as any;
      component.representacionFederal = {
        validarFormulario: jest.fn()
      } as any;
      component.bienFinal = undefined as any;
      
      component.validarFormularios();
      
      expect(component.representacionFederal.validarFormulario).toHaveBeenCalled();
    });
  });

  describe('fraccionErrorEvent', () => {
    it('debe emitir el evento fraccionErrorEventEmit con los datos correctos', () => {
      jest.spyOn(component.fraccionErrorEventEmit, 'emit');
      
      const eventoError = {
        fraccionErrorUno: 'Error en fracción uno',
        fraccionError: true
      };
      
      component.fraccionErrorEvent(eventoError);
      
      expect(component.fraccionErrorEventEmit.emit).toHaveBeenCalledWith(eventoError);
    });

    it('debe manejar eventos con propiedades parciales', () => {
      jest.spyOn(component.fraccionErrorEventEmit, 'emit');
      
      const eventoError = {
        fraccionErrorUno: 'Solo error uno'
      };
      
      component.fraccionErrorEvent(eventoError);
      
      expect(component.fraccionErrorEventEmit.emit).toHaveBeenCalledWith(eventoError);
    });

    it('debe manejar eventos vacíos', () => {
      jest.spyOn(component.fraccionErrorEventEmit, 'emit');
      
      const eventoError = {};
      
      component.fraccionErrorEvent(eventoError);
      
      expect(component.fraccionErrorEventEmit.emit).toHaveBeenCalledWith(eventoError);
    });
  });

  describe('obtenerVisible', () => {
    it('debe emitir el evento obtenorVisible con el valor correcto', () => {
      jest.spyOn(component.obtenorVisible, 'emit');
      
      component.obtenerVisible(true);
      
      expect(component.obtenorVisible.emit).toHaveBeenCalledWith(true);
    });

    it('debe emitir false cuando se pasa false', () => {
      jest.spyOn(component.obtenorVisible, 'emit');
      
      component.obtenerVisible(false);
      
      expect(component.obtenorVisible.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('Propiedades de entrada (@Input)', () => {
    it('debe aceptar idSolicitud como número', () => {
      component.idSolicitud = 123;
      expect(component.idSolicitud).toBe(123);
    });

    it('debe aceptar idSolicitud como null', () => {
      component.idSolicitud = null;
      expect(component.idSolicitud).toBeNull();
    });

    it('debe aceptar pestanaDosFormularioValido como boolean', () => {
      component.pestanaDosFormularioValido = true;
      expect(component.pestanaDosFormularioValido).toBe(true);
      
      component.pestanaDosFormularioValido = false;
      expect(component.pestanaDosFormularioValido).toBe(false);
    });
  });

  describe('Eventos de salida (@Output)', () => {
    it('debe tener definidos todos los eventos de salida', () => {
      expect(component.guardarEvent).toBeDefined();
      expect(component.pestanaCambiado).toBeDefined();
      expect(component.fraccionErrorEventEmit).toBeDefined();
      expect(component.obtenorVisible).toBeDefined();
    });

    it('debe poder emitir el evento guardarEvent', () => {
      jest.spyOn(component.guardarEvent, 'emit');
      
      component.guardarEvent.emit();
      
      expect(component.guardarEvent.emit).toHaveBeenCalled();
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

    it('debe limpiar las suscripciones correctamente', () => {
      // Simular que hay suscripciones activas
      component.ngOnInit();
      
      const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Integración de componentes', () => {
    it('debe manejar el flujo completo de inicialización con datos', () => {
      const mockRespuesta = {
        datos: { id: 1, nombre: 'Test' }
      };
      const mockDatosTransformados = {
        cuerpoTabla: [{ id: 1, nombre: 'Test Item' }]
      };
      
      consultaQuery.selectConsultaioState$ = of({
        update: true,
        readonly: false,
        id_solicitud: '789'
      });
      
      solicitudRegistroService.getMostrarDatos.mockReturnValue(of(mockRespuesta));
      ampliacionServiciosAdapter.reverseMapFromPayload.mockReturnValue(mockDatosTransformados);
      
      component.ngOnInit();
      
      expect(component.idSolicitud).toBe(789);
      expect(component.esDatosRespuesta).toBe(true);
      expect(component.pestanaDosFormularioValido).toBe(true);
      expect(component.elementoDeTablaSeleccionado).toEqual({ id: 1, nombre: 'Test Item' });
    });
  });
});