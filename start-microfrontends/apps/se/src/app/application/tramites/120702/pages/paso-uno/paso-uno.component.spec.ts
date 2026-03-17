import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { ExpedicionCertificadosFronteraService } from '../../services/expedicion-certificados-frontera.service';
import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { of, Subject, throwError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let consultaQuery: jest.Mocked<ConsultaioQuery>;
  let expedicionService: jest.Mocked<ExpedicionCertificadosFronteraService>;
  let registroSolicitudService: jest.Mocked<RegistroSolicitudService>;
  let ampliacionServiciosAdapter: jest.Mocked<AmpliacionServiciosAdapter>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    const consultaQueryMock = {
      selectConsultaioState$: of({
        update: false,
        readonly: false,
        procedureId: '120702',
        id_solicitud: '123'
      }),
    };

    const expedicionServiceMock = {
      obtenerDatos: jest.fn(),
      procesarInformacion: jest.fn(),
    };

    const registroSolicitudServiceMock = {
      parcheOpcionesPrellenadas: jest.fn(),
    };

    const ampliacionServiciosAdapterMock = {
      obtenerMostrarDatos: jest.fn(),
      mapearDatos: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        FormBuilder,
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: ExpedicionCertificadosFronteraService, useValue: expedicionServiceMock },
        { provide: RegistroSolicitudService, useValue: registroSolicitudServiceMock },
        { provide: AmpliacionServiciosAdapter, useValue: ampliacionServiciosAdapterMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    
    consultaQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;
    expedicionService = TestBed.inject(ExpedicionCertificadosFronteraService) as jest.Mocked<ExpedicionCertificadosFronteraService>;
    registroSolicitudService = TestBed.inject(RegistroSolicitudService) as jest.Mocked<RegistroSolicitudService>;
    ampliacionServiciosAdapter = TestBed.inject(AmpliacionServiciosAdapter) as jest.Mocked<AmpliacionServiciosAdapter>;
  });

  describe('Inicialización del componente', () => {
    it('debe crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debe inicializar las propiedades con valores por defecto', () => {
      expect(component.esDatosRespuesta).toBe(false);
      expect(component.formularioDeshabilitado).toBe(false);
      expect(component.indice).toBe(1);
      expect(component.isContinuarTriggered).toBe(false);
      expect(component['destroyNotifier$']).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('debe suscribirse al estado de consulta correctamente', () => {
      component.ngOnInit();
      
      expect(component.consultaState).toEqual({
        update: false,
        readonly: false,
        procedureId: '120702',
        id_solicitud: '123'
      });
      expect(component.esDatosRespuesta).toBe(true);
    });

    it('debe habilitar el formulario y mostrar datos cuando update es true', () => {
      consultaQuery.selectConsultaioState$ = of({
        update: true,
        readonly: false,
        procedureId: '120702',
        id_solicitud: '456'
      });
      
      jest.spyOn(component, 'monstrarDatosFormulario');
      
      component.ngOnInit();
      
      expect(component.formularioDeshabilitado).toBe(false);
      expect(component.monstrarDatosFormulario).toHaveBeenCalled();
    });

    it('debe deshabilitar el formulario cuando readonly es true', () => {
      consultaQuery.selectConsultaioState$ = of({
        update: false,
        readonly: true,
        procedureId: '120702',
        id_solicitud: '789'
      });
      
      component.ngOnInit();
      
      expect(component.formularioDeshabilitado).toBe(true);
    });

    it('debe establecer esDatosRespuesta como true cuando no es update del procedimiento 120702', () => {
      consultaQuery.selectConsultaioState$ = of({
        update: false,
        readonly: false,
        procedureId: '120701',
        id_solicitud: '111'
      });
      
      component.ngOnInit();
      
      expect(component.esDatosRespuesta).toBe(true);
    });

    it('no debe establecer esDatosRespuesta cuando es update del procedimiento 120702', () => {
      consultaQuery.selectConsultaioState$ = of({
        update: true,
        readonly: false,
        procedureId: '120702',
        id_solicitud: '222'
      });
      
      component.esDatosRespuesta = false;
      component.ngOnInit();
      
      expect(component.esDatosRespuesta).toBe(false);
    });
  });

  describe('seleccionaTab', () => {
    it('debe cambiar el índice correctamente', () => {
      component.seleccionaTab(3);
      expect(component.indice).toBe(3);
    });

    it('debe manejar diferentes valores de índice', () => {
      component.seleccionaTab(1);
      expect(component.indice).toBe(1);
      
      component.seleccionaTab(5);
      expect(component.indice).toBe(5);
      
      component.seleccionaTab(0);
      expect(component.indice).toBe(0);
    });
  });

  describe('validarTabActual', () => {
    beforeEach(() => {
      // Mock del componente de asignación
      component.asignacion = {
        asignacionForm: formBuilder.group({
          anoDelOficio: ['', Validators.required],
          numeroOficio: ['', Validators.required],
          montoAExpedir: ['', Validators.required]
        }),
        forzarValidacion: jest.fn()
      } as any;
    });

    it('debe validar correctamente cuando está en el tab 2 y el formulario es válido', () => {
      component.indice = 2;
      component.asignacion.asignacionForm.patchValue({
        anoDelOficio: '2023',
        numeroOficio: '12345',
        montoAExpedir: '1000'
      });
      
      const resultado = component.validarTabActual();
      
      expect(resultado).toBe(true);
    });

    it('debe retornar false cuando está en el tab 2 y el formulario es inválido', () => {
      component.indice = 2;
      component.asignacion.asignacionForm.patchValue({
        anoDelOficio: '',
        numeroOficio: '12345',
        montoAExpedir: '1000'
      });
      
      const resultado = component.validarTabActual();
      
      expect(resultado).toBe(false);
    });

    it('debe marcar todos los campos como touched en el tab 2', () => {
      component.indice = 2;
      const markAllAsTouchedSpy = jest.spyOn(component.asignacion.asignacionForm, 'markAllAsTouched');
      
      component.validarTabActual();
      
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('debe retornar true para otros tabs diferentes al 2', () => {
      component.indice = 1;
      
      const resultado = component.validarTabActual();
      
      expect(resultado).toBe(true);
    });

    it('debe manejar correctamente cuando asignacion no está definido', () => {
      component.indice = 2;
      component.asignacion = undefined as any;
      
      const resultado = component.validarTabActual();
      
      expect(resultado).toBe(true);
    });

    it('debe manejar correctamente cuando asignacionForm no está definido', () => {
      component.indice = 2;
      component.asignacion = { asignacionForm: undefined } as any;
      
      const resultado = component.validarTabActual();
      
      expect(resultado).toBe(true);
    });
  });

  describe('validarFormularioCompleto', () => {
    beforeEach(() => {
      component.asignacion = {
        asignacionForm: formBuilder.group({
          anoDelOficio: ['', Validators.required],
          numeroOficio: ['', Validators.required],
          montoAExpedir: ['', Validators.required]
        }),
        forzarValidacion: jest.fn()
      } as any;
    });

    it('debe validar correctamente el formulario completo en el tab 2', () => {
      component.indice = 2;
      component.asignacion.asignacionForm.patchValue({
        anoDelOficio: '2023',
        numeroOficio: '12345',
        montoAExpedir: '1000'
      });
      
      const resultado = component.validarFormularioCompleto();
      
      expect(resultado).toBe(true);
      expect(component.asignacion.forzarValidacion).toHaveBeenCalled();
    });

    it('debe retornar false cuando los campos requeridos están vacíos', () => {
      component.indice = 2;
      component.asignacion.asignacionForm.patchValue({
        anoDelOficio: '',
        numeroOficio: '',
        montoAExpedir: ''
      });
      
      const resultado = component.validarFormularioCompleto();
      
      expect(resultado).toBe(false);
    });

    it('debe llamar a forzarValidacion si existe', () => {
      component.indice = 2;
      
      component.validarFormularioCompleto();
      
      expect(component.asignacion.forzarValidacion).toHaveBeenCalled();
    });

    it('debe marcar todos los campos como touched', () => {
      component.indice = 2;
      const markAllAsTouchedSpy = jest.spyOn(component.asignacion.asignacionForm, 'markAllAsTouched');
      
      component.validarFormularioCompleto();
      
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('debe retornar true para tabs diferentes al 2', () => {
      component.indice = 1;
      
      const resultado = component.validarFormularioCompleto();
      
      expect(resultado).toBe(true);
    });

    it('debe manejar cuando asignacion no está definido', () => {
      component.indice = 2;
      component.asignacion = undefined as any;
      
      const resultado = component.validarFormularioCompleto();
      
      expect(resultado).toBe(true);
    });

    it('debe manejar cuando forzarValidacion no existe', () => {
      component.indice = 2;
      component.asignacion = {
        asignacionForm: formBuilder.group({
          anoDelOficio: ['2023', Validators.required],
          numeroOficio: ['12345', Validators.required],
          montoAExpedir: ['1000', Validators.required]
        })
      } as any;
      
      const resultado = component.validarFormularioCompleto();
      
      expect(resultado).toBe(true);
    });
  });

  describe('handleFormaDatos', () => {
    it('debe emitir los datos recibidos a través del evento buscarDatos', () => {
      const mockAsignacionResponse = {
        id: 1,
        nombre: 'Test Response',
        datos: { test: 'data' }
      } as any;
      
      jest.spyOn(component.buscarDatos, 'emit');
      
      component.handleFormaDatos(mockAsignacionResponse);
      
      expect(component.buscarDatos.emit).toHaveBeenCalledWith(mockAsignacionResponse);
    });

    it('debe manejar datos undefined', () => {
      jest.spyOn(component.buscarDatos, 'emit');
      
      component.handleFormaDatos(undefined as any);
      
      expect(component.buscarDatos.emit).toHaveBeenCalledWith(undefined);
    });
  });

  describe('monstrarDatosFormulario', () => {
    const mockRespuesta = {
      datos: {
        id: 1,
        informacion: 'datos de prueba'
      }
    };

    beforeEach(() => {
      component.consultaState = {
        id_solicitud: '789',
        update: true,
        readonly: false
      } as any;
      
      registroSolicitudService.parcheOpcionesPrellenadas.mockReturnValue(of(mockRespuesta));
    });

    it('debe obtener y procesar los datos del formulario correctamente', () => {
      component.monstrarDatosFormulario();
      
      expect(registroSolicitudService.parcheOpcionesPrellenadas).toHaveBeenCalledWith(120702, 789);
      expect(ampliacionServiciosAdapter.obtenerMostrarDatos).toHaveBeenCalledWith(mockRespuesta.datos);
      expect(component.esDatosRespuesta).toBe(true);
    });

    it('debe manejar respuesta vacía sin procesar datos', () => {
      registroSolicitudService.parcheOpcionesPrellenadas.mockReturnValue(of(null));
      
      component.monstrarDatosFormulario();
      
      expect(registroSolicitudService.parcheOpcionesPrellenadas).toHaveBeenCalledWith(120702, 789);
      expect(ampliacionServiciosAdapter.obtenerMostrarDatos).not.toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(true);
    });

    it('debe manejar respuesta sin datos', () => {
      registroSolicitudService.parcheOpcionesPrellenadas.mockReturnValue(of({ datos: null }));
      
      component.monstrarDatosFormulario();
      
      expect(ampliacionServiciosAdapter.obtenerMostrarDatos).not.toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(true);
    });

    it('debe convertir correctamente el id_solicitud a número', () => {
      component.consultaState.id_solicitud = '456';
      
      component.monstrarDatosFormulario();
      
      expect(registroSolicitudService.parcheOpcionesPrellenadas).toHaveBeenCalledWith(120702, 456);
    });

    it('debe manejar errores en la solicitud', () => {
      const error = new Error('Error de red');
      registroSolicitudService.parcheOpcionesPrellenadas.mockReturnValue(throwError(error));
      
      expect(() => component.monstrarDatosFormulario()).not.toThrow();
      expect(component.esDatosRespuesta).toBe(true);
    });
  });

  describe('handleTablaLength', () => {
    it('debe emitir la longitud de la tabla recibida', () => {
      jest.spyOn(component.TablaLength, 'emit');
      
      component.handleTablaLength(5);
      
      expect(component.TablaLength.emit).toHaveBeenCalledWith(5);
    });

    it('debe manejar diferentes valores de longitud', () => {
      jest.spyOn(component.TablaLength, 'emit');
      
      component.handleTablaLength(0);
      expect(component.TablaLength.emit).toHaveBeenCalledWith(0);
      
      component.handleTablaLength(100);
      expect(component.TablaLength.emit).toHaveBeenCalledWith(100);
    });
  });

  describe('Propiedades @Input', () => {
    it('debe aceptar isContinuarTriggered como boolean', () => {
      component.isContinuarTriggered = true;
      expect(component.isContinuarTriggered).toBe(true);
      
      component.isContinuarTriggered = false;
      expect(component.isContinuarTriggered).toBe(false);
    });
  });

  describe('Eventos @Output', () => {
    it('debe tener definidos todos los eventos de salida', () => {
      expect(component.buscarDatos).toBeDefined();
      expect(component.TablaLength).toBeDefined();
    });

    it('debe poder emitir eventos correctamente', () => {
      const mockData = { test: 'data' } as any;
      jest.spyOn(component.buscarDatos, 'emit');
      jest.spyOn(component.TablaLength, 'emit');
      
      component.buscarDatos.emit(mockData);
      component.TablaLength.emit(10);
      
      expect(component.buscarDatos.emit).toHaveBeenCalledWith(mockData);
      expect(component.TablaLength.emit).toHaveBeenCalledWith(10);
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
      // Simular suscripciones activas
      component.ngOnInit();
      
      const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Integración completa del componente', () => {
    it('debe manejar el flujo completo de inicialización con actualización', () => {
      const mockRespuesta = {
        datos: { id: 1, test: 'data' }
      };
      
      consultaQuery.selectConsultaioState$ = of({
        update: true,
        readonly: false,
        procedureId: '120702',
        id_solicitud: '999'
      });
      
      registroSolicitudService.parcheOpcionesPrellenadas.mockReturnValue(of(mockRespuesta));
      
      component.ngOnInit();
      
      expect(component.formularioDeshabilitado).toBe(false);
      expect(registroSolicitudService.parcheOpcionesPrellenadas).toHaveBeenCalledWith(120702, 999);
      expect(ampliacionServiciosAdapter.obtenerMostrarDatos).toHaveBeenCalledWith(mockRespuesta.datos);
      expect(component.esDatosRespuesta).toBe(true);
    });

    it('debe manejar el flujo de solo lectura', () => {
      consultaQuery.selectConsultaioState$ = of({
        update: false,
        readonly: true,
        procedureId: '120702',
        id_solicitud: '888'
      });
      
      component.ngOnInit();
      
      expect(component.formularioDeshabilitado).toBe(true);
      expect(component.esDatosRespuesta).toBe(true);
    });
  });
});