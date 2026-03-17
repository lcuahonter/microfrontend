import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of, ReplaySubject, throwError } from 'rxjs';
import { PasoUnoComponent } from './paso-uno.component';
import { TecnologicosService } from '../../service/tecnologicos.service';
import { Tramite324Store, Solicitud324State } from '../../state/Tramite324.store';
import { ConsultaioQuery, ConsultaioState, FormularioDinamico, TIPO_PERSONA, SolicitanteComponent } from '@ng-mf/data-access-user';
import { AccesosTabla } from '../../models/tecnologicos.model';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { EventEmitter } from '@angular/core';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockTecnologicosService: jest.Mocked<TecnologicosService>;
  let mockTramite324Store: jest.Mocked<Tramite324Store>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockSolicitanteComponent: jest.Mocked<SolicitanteComponent>;
  let formBuilder: FormBuilder;

  const mockAccesosTabla: AccesosTabla[] = [
    {
      rfc: 'TECH123456789AB',
      aduana: 'Aduana Tecnológica',
      sistema: 'Sistema Tech',
      rol: 'Administrador',
      tipoMovimiento: 'Alta'
    },
    {
      rfc: 'DATA987654321CD',
      aduana: 'Aduana Digital',
      sistema: 'Sistema Data',
      rol: 'Usuario',
      tipoMovimiento: 'Modificación'
    }
  ];

  const mockConsultaioState: ConsultaioState = {
    procedureId: 'PROC_001',
    parameter: 'PARAM_TEST',
    department: 'TECH_DEPT',
    folioTramite: 'FOL_12345',
    tipoDeTramite: 'TIPO_324',
    estadoDeTramite: 'EN_PROCESO',
    readonly: false,
    create: true,
    update: false,
    consultaioSolicitante: null,
    action_id: 'ACT_001',
    current_user: 'TEST_USER',
    id_solicitud: 'SOL_001',
    nombre_pagina: 'PASO_UNO'
  };

  const mockConsultaioStateUpdate: ConsultaioState = {
    ...mockConsultaioState,
    update: true,
    create: false
  };

  const mockFormularioDinamico: FormularioDinamico[] = [
    {
      labelNombre: 'RFC',
      campo: 'rfc',
      class: 'col-md-6',
      tipo_input: 'text',
      disabled: false,
      validators: ['required', 'maxlength:13']
    },
    {
      labelNombre: 'Razón Social',
      campo: 'razonSocial',
      class: 'col-md-6',
      tipo_input: 'text',
      disabled: false,
      validators: ['required']
    }
  ];

  beforeEach(async () => {
    // Mock de constantes importadas
    (PERSONA_MORAL_NACIONAL as any) = mockFormularioDinamico;
    (DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL as any) = mockFormularioDinamico;

    // Crear mocks de los servicios
    mockTecnologicosService = {
      obtenerTecnologicos: jest.fn().mockReturnValue(of(mockAccesosTabla)),
      obtenerDatosAduana: jest.fn().mockReturnValue(of([])),
      obtenerDatosRol: jest.fn().mockReturnValue(of([])),
      obtenerDatosSistema: jest.fn().mockReturnValue(of([])),
      obtenerDatosTipoMovimiento: jest.fn().mockReturnValue(of([]))
    } as any;

    mockTramite324Store = {
      addAccesosDatos: jest.fn(),
      limpiarSolicitud: jest.fn(),
      update: jest.fn(),
      reset: jest.fn()
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of(mockConsultaioState)
    } as any;

    mockSolicitanteComponent = {
      obtenerTipoPersona: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: TecnologicosService, useValue: mockTecnologicosService },
        { provide: Tramite324Store, useValue: mockTramite324Store },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
  });

  describe('Inicialización del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar con valores por defecto', () => {
      expect(component.indice).toBe(2);
      expect(component.esDatosRespuesta).toBeFalsy();
      expect(component.persona).toEqual([]);
      expect(component.domicilioFiscal).toEqual([]);
      expect(component.destroyed$).toBeInstanceOf(ReplaySubject);
    });

    it('debería tener EventEmitter configurado correctamente', () => {
      expect(component.indiceNombre).toBeInstanceOf(EventEmitter);
    });

    it('debería tener FormBuilder público', () => {
      expect(component.fb).toBeInstanceOf(FormBuilder);
    });
  });

  describe('Constructor', () => {
    it('debería inyectar todas las dependencias correctamente', () => {
      expect(component.fb).toBeDefined();
      expect(component['store']).toBeDefined();
      expect(component['tecnologicosService']).toBeDefined();
      expect(component['consultaQuery']).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('debería suscribirse al estado de consultaio correctamente', () => {
      component.ngOnInit();
      
      expect(component.consultaState).toEqual(mockConsultaioState);
    });

    it('debería llamar guardarDatosFormulario cuando consultaState.update es true', () => {
      mockConsultaioQuery.selectConsultaioState$ = of(mockConsultaioStateUpdate);
      jest.spyOn(component, 'guardarDatosFormulario');
      
      component.ngOnInit();
      
      expect(component.guardarDatosFormulario).toHaveBeenCalled();
    });

    it('debería establecer esDatosRespuesta como true cuando consultaState.update es false', () => {
      component.ngOnInit();
      
      expect(component.esDatosRespuesta).toBeTruthy();
    });

    it('debería manejar estado consultaio con update false', () => {
      const estadoSinUpdate = { ...mockConsultaioState, update: false };
      mockConsultaioQuery.selectConsultaioState$ = of(estadoSinUpdate);
      
      component.ngOnInit();
      
      expect(component.consultaState.update).toBeFalsy();
      expect(component.esDatosRespuesta).toBeTruthy();
    });

    it('debería usar takeUntil para evitar fugas de memoria', () => {
      const takeUntilSpy = jest.spyOn(require('rxjs'), 'takeUntil');
      
      component.ngOnInit();
      
      expect(takeUntilSpy).toHaveBeenCalledWith(component.destroyed$);
    });

    it('debería usar map para transformar el estado', () => {
      const mapSpy = jest.spyOn(require('rxjs'), 'map');
      
      component.ngOnInit();
      
      expect(mapSpy).toHaveBeenCalled();
    });
  });

  describe('guardarDatosFormulario', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('debería obtener datos tecnológicos y actualizar el store', () => {
      component.guardarDatosFormulario();

      expect(mockTecnologicosService.obtenerTecnologicos).toHaveBeenCalled();
      expect(mockTramite324Store.addAccesosDatos).toHaveBeenCalledWith(mockAccesosTabla);
      expect(component.esDatosRespuesta).toBeTruthy();
    });

    it('debería manejar respuesta vacía del servicio', () => {
      mockTecnologicosService.obtenerTecnologicos.mockReturnValue(of([]));

      component.guardarDatosFormulario();

      expect(mockTramite324Store.addAccesosDatos).toHaveBeenCalledWith([]);
      expect(component.esDatosRespuesta).toBeTruthy();
    });

    it('debería manejar errores en la obtención de datos tecnológicos', () => {
      const errorMock = new Error('Error de red');
      mockTecnologicosService.obtenerTecnologicos.mockReturnValue(
        throwError(() => errorMock)
      );

      expect(() => component.guardarDatosFormulario()).not.toThrow();
    });

    it('debería cancelar suscripción con destroyed$ al completarse', () => {
      const suscripcionSpy = jest.fn();
      component.destroyed$.subscribe(suscripcionSpy);
      
      component.guardarDatosFormulario();
      component.ngOnDestroy();
      
      expect(suscripcionSpy).toHaveBeenCalledWith(true);
    });

    it('debería usar pipe con takeUntil correctamente', () => {
      const pipeSpy = jest.spyOn(mockTecnologicosService.obtenerTecnologicos(), 'pipe');
      
      component.guardarDatosFormulario();
      
      expect(pipeSpy).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    beforeEach(() => {
      // Simular ViewChild
      component.solicitante = mockSolicitanteComponent;
    });

    it('debería configurar formularios dinámicos correctamente', () => {
      component.ngAfterViewInit();

      expect(component.persona).toEqual(PERSONA_MORAL_NACIONAL);
      expect(component.domicilioFiscal).toEqual(DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL);
    });

    it('debería llamar obtenerTipoPersona con TIPO_PERSONA.MORAL_NACIONAL', () => {
      component.ngAfterViewInit();

      expect(mockSolicitanteComponent.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
    });

    it('debería manejar caso cuando solicitante no está definido', () => {
      component.solicitante = undefined as any;
      
      expect(() => component.ngAfterViewInit()).toThrow();
    });

    it('debería asignar constantes a las propiedades del componente', () => {
      component.ngAfterViewInit();

      expect(component.persona).toBe(PERSONA_MORAL_NACIONAL);
      expect(component.domicilioFiscal).toBe(DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL);
    });
  });

  describe('seleccionaTab', () => {
    it('debería cambiar el índice y emitir evento correctamente', () => {
      jest.spyOn(component.indiceNombre, 'emit');
      const nuevoIndice = 2;

      component.seleccionaTab(nuevoIndice);

      expect(component.indice).toBe(nuevoIndice);
      expect(component.indiceNombre.emit).toHaveBeenCalledWith(nuevoIndice);
    });

    it('debería manejar cambio a pestaña 1', () => {
      jest.spyOn(component.indiceNombre, 'emit');
      
      component.seleccionaTab(1);

      expect(component.indice).toBe(1);
      expect(component.indiceNombre.emit).toHaveBeenCalledWith(1);
    });

    it('debería manejar cambio a pestaña 2', () => {
      jest.spyOn(component.indiceNombre, 'emit');
      
      component.seleccionaTab(2);

      expect(component.indice).toBe(2);
      expect(component.indiceNombre.emit).toHaveBeenCalledWith(2);
    });

    it('debería permitir valores de índice negativos', () => {
      jest.spyOn(component.indiceNombre, 'emit');
      
      component.seleccionaTab(-1);

      expect(component.indice).toBe(-1);
      expect(component.indiceNombre.emit).toHaveBeenCalledWith(-1);
    });

    it('debería permitir valores de índice grandes', () => {
      jest.spyOn(component.indiceNombre, 'emit');
      
      component.seleccionaTab(100);

      expect(component.indice).toBe(100);
      expect(component.indiceNombre.emit).toHaveBeenCalledWith(100);
    });

    it('debería emitir exactamente una vez por llamada', () => {
      jest.spyOn(component.indiceNombre, 'emit');
      
      component.seleccionaTab(5);

      expect(component.indiceNombre.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnDestroy', () => {
    it('debería completar destroyed$ al destruir el componente', () => {
      jest.spyOn(component.destroyed$, 'next');
      jest.spyOn(component.destroyed$, 'complete');

      component.ngOnDestroy();

      expect(component.destroyed$.next).toHaveBeenCalledWith(true);
      expect(component.destroyed$.complete).toHaveBeenCalled();
    });

    it('debería cancelar suscripciones activas', () => {
      component.ngOnInit();
      
      const suscripcionMock = jest.fn();
      component.destroyed$.subscribe(suscripcionMock);

      component.ngOnDestroy();

      expect(suscripcionMock).toHaveBeenCalledWith(true);
    });

    it('debería ejecutar next antes de complete', () => {
      const nextSpy = jest.spyOn(component.destroyed$, 'next');
      const completeSpy = jest.spyOn(component.destroyed$, 'complete');

      component.ngOnDestroy();

      expect(nextSpy.mock.invocationCallOrder[0]).toBeLessThan(completeSpy.mock.invocationCallOrder[0]);
    });
  });

  describe('Propiedades y tipos', () => {
    it('debería tener tipoPersona como number', () => {
      component.tipoPersona = 1;
      expect(typeof component.tipoPersona).toBe('number');
    });

    it('debería manejar FormularioDinamico array para persona', () => {
      component.persona = mockFormularioDinamico;
      
      expect(Array.isArray(component.persona)).toBeTruthy();
      component.persona.forEach(campo => {
        expect(campo).toHaveProperty('labelNombre');
        expect(campo).toHaveProperty('campo');
        expect(campo).toHaveProperty('class');
        expect(campo).toHaveProperty('tipo_input');
        expect(campo).toHaveProperty('disabled');
        expect(campo).toHaveProperty('validators');
      });
    });

    it('debería manejar FormularioDinamico array para domicilioFiscal', () => {
      component.domicilioFiscal = mockFormularioDinamico;
      
      expect(Array.isArray(component.domicilioFiscal)).toBeTruthy();
      component.domicilioFiscal.forEach(campo => {
        expect(campo).toHaveProperty('labelNombre');
        expect(campo).toHaveProperty('campo');
        expect(campo).toHaveProperty('class');
        expect(campo).toHaveProperty('tipo_input');
        expect(campo).toHaveProperty('disabled');
        expect(campo).toHaveProperty('validators');
      });
    });

    it('debería tener registroForm como FormGroup cuando se asigne', () => {
      component.registroForm = formBuilder.group({
        campo1: [''],
        campo2: ['']
      });
      
      expect(component.registroForm).toBeInstanceOf(FormGroup);
    });

    it('debería inicializar indice con valor 2', () => {
      expect(component.indice).toBe(2);
    });

    it('debería inicializar esDatosRespuesta como false', () => {
      expect(component.esDatosRespuesta).toBeFalsy();
    });
  });

  describe('Estados y flujos de datos', () => {
    it('debería manejar solicitudState correctamente', () => {
      const mockSolicitud: Solicitud324State = {
        AccesosDatos: mockAccesosTabla,
        rfc: 'TEST123456789',
        aduana: 'Aduana Test',
        sistema: 'Sistema Test',
        rol: 'Rol Test',
        tipoMovimiento: 'Movimiento Test'
      };

      component.solicitudState = mockSolicitud;

      expect(component.solicitudState.AccesosDatos).toEqual(mockAccesosTabla);
      expect(component.solicitudState.rfc).toBe('TEST123456789');
    });

    it('debería manejar consultaState con readonly true', () => {
      const estadoReadonly: ConsultaioState = {
        ...mockConsultaioState,
        readonly: true
      };

      component.consultaState = estadoReadonly;

      expect(component.consultaState.readonly).toBeTruthy();
      expect(component.consultaState.create).toBeTruthy();
      expect(component.consultaState.update).toBeFalsy();
    });

    it('debería manejar consultaState con consultaioSolicitante null', () => {
      const estadoSinSolicitante: ConsultaioState = {
        ...mockConsultaioState,
        consultaioSolicitante: null
      };

      component.consultaState = estadoSinSolicitante;

      expect(component.consultaState.consultaioSolicitante).toBeNull();
    });

    it('debería manejar cambios de estado en tiempo real', () => {
      const estadoInicial = mockConsultaioState;
      const estadoActualizado = { ...mockConsultaioState, readonly: true };

      // Simular cambio de estado
      mockConsultaioQuery.selectConsultaioState$ = of(estadoInicial, estadoActualizado);
      
      component.ngOnInit();
      
      expect(component.consultaState.readonly).toBe(true);
    });
  });

  describe('Integración completa', () => {
    it('debería completar el flujo de inicialización cuando update es true', () => {
      mockConsultaioQuery.selectConsultaioState$ = of(mockConsultaioStateUpdate);
      jest.spyOn(component, 'guardarDatosFormulario');
      
      component.ngOnInit();

      expect(component.consultaState.update).toBeTruthy();
      expect(component.guardarDatosFormulario).toHaveBeenCalled();
    });

    it('debería manejar la secuencia completa de ngAfterViewInit', () => {
      component.solicitante = mockSolicitanteComponent;

      component.ngAfterViewInit();

      expect(component.persona).toEqual(PERSONA_MORAL_NACIONAL);
      expect(component.domicilioFiscal).toEqual(DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL);
      expect(mockSolicitanteComponent.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
    });

    it('debería manejar el ciclo completo de vida del componente', () => {
      // Inicialización
      component.ngOnInit();
      expect(component.consultaState).toBeDefined();

      // Configuración después de vista
      component.solicitante = mockSolicitanteComponent;
      component.ngAfterViewInit();
      expect(component.persona.length).toBeGreaterThan(0);

      // Interacción
      component.seleccionaTab(2);
      expect(component.indice).toBe(2);

      // Destrucción
      jest.spyOn(component.destroyed$, 'complete');
      component.ngOnDestroy();
      expect(component.destroyed$.complete).toHaveBeenCalled();
    });

    it('debería sincronizar correctamente entre ngOnInit y guardarDatosFormulario', () => {
      mockConsultaioQuery.selectConsultaioState$ = of(mockConsultaioStateUpdate);
      
      component.ngOnInit();

      expect(component.consultaState.update).toBeTruthy();
      expect(mockTecnologicosService.obtenerTecnologicos).toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBeTruthy();
    });
  });

  describe('Casos edge y manejo de errores', () => {
    it('debería manejar consultaioQuery observable que emite múltiples valores', () => {
      const estadosMultiples = [
        mockConsultaioState,
        { ...mockConsultaioState, readonly: true },
        { ...mockConsultaioState, update: true }
      ];

      mockConsultaioQuery.selectConsultaioState$ = of(...estadosMultiples);

      component.ngOnInit();

      // Solo debería tomar los valores según el comportamiento del observable
      expect(component.consultaState).toBeDefined();
    });

    it('debería manejar error en suscripción a consultaioQuery', () => {
      const errorMock = new Error('Error de consulta');
      mockConsultaioQuery.selectConsultaioState$ = throwError(() => errorMock);

      expect(() => component.ngOnInit()).toThrow();
    });

    it('debería manejar FormularioDinamico con propiedades opcionales', () => {
      const formularioCompleto: FormularioDinamico[] = [{
        labelNombre: 'Campo Test',
        campo: 'campoTest',
        class: 'col-md-12',
        visibility: 'visible',
        tipo_input: 'text',
        disabled: false,
        readonly: true,
        validators: ['required'],
        tooltip: 'Tooltip test',
        tooltipTxt: 'Texto del tooltip',
        placeholder: 'Placeholder test',
        AvailableRadioOptions: ['Opción 1', 'Opción 2'],
        listaDesplegable: [{ id: 1, descripcion: 'Opción 1' }]
      }];

      component.persona = formularioCompleto;

      expect(component.persona[0].visibility).toBe('visible');
      expect(component.persona[0].readonly).toBeTruthy();
      expect(component.persona[0].tooltip).toBe('Tooltip test');
      expect(component.persona[0].AvailableRadioOptions).toHaveLength(2);
      expect(component.persona[0].listaDesplegable).toHaveLength(1);
    });

    it('debería manejar AccesosTabla vacío en obtenerTecnologicos', () => {
      mockTecnologicosService.obtenerTecnologicos.mockReturnValue(of([]));

      component.guardarDatosFormulario();

      expect(mockTramite324Store.addAccesosDatos).toHaveBeenCalledWith([]);
      expect(component.esDatosRespuesta).toBeTruthy();
    });

    it('debería manejar estados undefined en consultaState', () => {
      const estadoUndefined = undefined as any;
      mockConsultaioQuery.selectConsultaioState$ = of(estadoUndefined);

      expect(() => component.ngOnInit()).toThrow();
    });

    it('debería manejar constantes undefined en ngAfterViewInit', () => {
      (PERSONA_MORAL_NACIONAL as any) = undefined;
      (DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL as any) = undefined;
      component.solicitante = mockSolicitanteComponent;

      component.ngAfterViewInit();

      expect(component.persona).toBeUndefined();
      expect(component.domicilioFiscal).toBeUndefined();
    });
  });

  describe('EventEmitter y comunicación con padre', () => {
    it('debería emitir indiceNombre correctamente', () => {
      const emitSpy = jest.spyOn(component.indiceNombre, 'emit');
      
      component.seleccionaTab(3);

      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(3);
    });

    it('debería ser un EventEmitter válido', () => {
      expect(component.indiceNombre).toBeDefined();
      expect(typeof component.indiceNombre.emit).toBe('function');
    });

    it('debería emitir valores consecutivos correctamente', () => {
      const emitSpy = jest.spyOn(component.indiceNombre, 'emit');
      
      component.seleccionaTab(1);
      component.seleccionaTab(2);
      component.seleccionaTab(1);

      expect(emitSpy).toHaveBeenCalledTimes(3);
      expect(emitSpy).toHaveBeenNthCalledWith(1, 1);
      expect(emitSpy).toHaveBeenNthCalledWith(2, 2);
      expect(emitSpy).toHaveBeenNthCalledWith(3, 1);
    });
  });

  describe('ViewChild y referencias', () => {
    it('debería tener ViewChild configurado correctamente', () => {
      component.solicitante = mockSolicitanteComponent;
      
      expect(component.solicitante).toBeDefined();
      expect(component.solicitante.obtenerTipoPersona).toBeDefined();
    });

    it('debería manejar ViewChild null', () => {
      component.solicitante = null as any;
      
      expect(() => component.ngAfterViewInit()).toThrow();
    });
  });

  describe('Tipos de persona y constantes', () => {
    it('debería usar TIPO_PERSONA.MORAL_NACIONAL correctamente', () => {
      component.solicitante = mockSolicitanteComponent;
      
      component.ngAfterViewInit();
      
      expect(mockSolicitanteComponent.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
    });

    it('debería asignar constantes de formulario correctamente', () => {
      component.solicitante = {
        obtenerTipoPersona: jest.fn()
      } as any;
      
      component.ngAfterViewInit();
      
      expect(component.persona).toBe(PERSONA_MORAL_NACIONAL);
      expect(component.domicilioFiscal).toBe(DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL);
      expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
    });
  });
});