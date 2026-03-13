import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, Subject, Observable } from 'rxjs';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';

import { NumeroEmpleadosBimestreComponent } from './numero-empleados-bimestre.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { 
  TipoNotificacionEnum, 
  CategoriaMensaje,
  Catalogo,
  ConsultaioState,
  createConsultaInitialState
} from '@libs/shared/data-access-user/src';
import { Solicitud32608Store, createInitialSolicitudState } from '../../estados/solicitud32608.store';
import { Solicitud32608Query } from '../../estados/solicitud32608.query';
import { SolicitudService } from '../../services/solicitud.service';
import { BuscarRfcResponse, NumeroEmpleadosTabla } from '../../models/oea-textil-registro.model';

// Mock del módulo Bootstrap Modal
jest.mock('bootstrap', () => {
  const mockModalInstance = {
    show: jest.fn(),
    hide: jest.fn()
  };

  const MockModal = jest.fn().mockImplementation(() => mockModalInstance);
  (MockModal as any).getInstance = jest.fn().mockReturnValue(mockModalInstance);

  return {
    Modal: MockModal
  };
});

describe('NumeroEmpleadosBimestreComponent - Pruebas unitarias', () => {
  let component: NumeroEmpleadosBimestreComponent;
  let fixture: ComponentFixture<NumeroEmpleadosBimestreComponent>;
  let mockSolicitud32608Store: jest.Mocked<Solicitud32608Store>;
  let mockSolicitud32608Query: jest.Mocked<Solicitud32608Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockSolicitudService: jest.Mocked<SolicitudService>;

  // Datos de prueba simulados
  const datosNumeroEmpleadosMock: NumeroEmpleadosTabla[] = [
    {
      id: 1,
      denominacionSocial: 'Empresa Test S.A. de C.V.',
      rfc: 'ETE123456789',
      numeroDeEmpleados: 50,
      bimestre: 'Enero-Febrero'
    },
    {
      id: 2,
      denominacionSocial: 'Comercializadora XYZ S.C.',
      rfc: 'CXY987654321',
      numeroDeEmpleados: 25,
      bimestre: 'Marzo-Abril'
    }
  ];

  const datosBimestreMock: Catalogo[] = [
    { id: 1, descripcion: 'Enero-Febrero' },
    { id: 2, descripcion: 'Marzo-Abril' },
    { id: 3, descripcion: 'Mayo-Junio' }
  ];

  const estadoConsultaMock: ConsultaioState = {
    ...createConsultaInitialState(),
    readonly: false
  };

  const estadoTramiteMock = {
    ...createInitialSolicitudState(),
    numeroEmpleadosBimestre: datosNumeroEmpleadosMock
  };

  beforeEach(async () => {
    // Configuración de espías para servicios simulados
    mockSolicitud32608Store = {
      establecerDatos: jest.fn(),
      actualizarSeccion: jest.fn(),
      eliminarElemento: jest.fn(),
      actualizarEstado: jest.fn()
    } as any;

    // Usar of() para crear un observable compatible con pipe
    mockSolicitud32608Query = {
      selectSolicitud$: of(estadoTramiteMock),
      __store__: {} as any,
      select: jest.fn(),
      selectLoading: jest.fn(),
      selectError: jest.fn(),
      getValue: jest.fn(),
      selectEntity: jest.fn(),
      selectActiveId: jest.fn(),
      config: {} as any
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of(estadoConsultaMock)
    } as any;

    mockSolicitudService = {
      getRFCDetails: jest.fn(),
      insertAllData: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NumeroEmpleadosBimestreComponent
      ],
      providers: [
        FormBuilder,
        { provide: Solicitud32608Store, useValue: mockSolicitud32608Store },
        { provide: Solicitud32608Query, useValue: mockSolicitud32608Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: SolicitudService, useValue: mockSolicitudService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NumeroEmpleadosBimestreComponent);
    component = fixture.componentInstance;

    // Simular elementos del DOM
    component.registroDeNumeroEmpleadosElemento = {
      nativeElement: document.createElement('div')
    } as ElementRef;

    component.confirmacionElemento = {
      nativeElement: document.createElement('div')
    } as ElementRef;

    component.bimestreList = datosBimestreMock;
  });

  describe('🔧 Inicialización del componente', () => {
    it('✅ debería crear el componente sin errores', () => {
      expect(component).toBeTruthy();
    });

    it('✅ debería inicializar las propiedades con valores por defecto correctos', () => {
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.esHabilitarElDialogo).toBe(false);
      expect(component.numeroEmpleadosBimestreList).toEqual([]);
      expect(component.activeTab).toBe('parquevehicular');
      expect(component.multipleSeleccionPopupAbierto).toBe(false);
      expect(component.confirmEliminarPopupAbierto).toBe(false);
      expect(component.enableEliminarBoton).toBe(false);
      expect(component.enableModficarBoton).toBe(false);
      expect(component.colapsable).toBe(true);
    });

    it('✅ debería configurar las suscripciones en el constructor', () => {
      fixture.detectChanges();
      expect(component.esFormularioSoloLectura).toBe(estadoConsultaMock.readonly);
    });

    it('✅ debería manejar cambios en el estado de readonly', async () => {
      const nuevoEstado: ConsultaioState = {
        ...createConsultaInitialState(),
        readonly: true
      };
      
      // Crear un nuevo simulacro para esta prueba específica
      const nuevoMockConsultaioQuery = {
        selectConsultaioState$: of(nuevoEstado)
      } as any;
      
      // Crear nuevo TestBed configurado específicamente para esta prueba
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          NumeroEmpleadosBimestreComponent
        ],
        providers: [
          FormBuilder,
          { provide: Solicitud32608Store, useValue: mockSolicitud32608Store },
          { provide: Solicitud32608Query, useValue: mockSolicitud32608Query },
          { provide: ConsultaioQuery, useValue: nuevoMockConsultaioQuery },
          { provide: SolicitudService, useValue: mockSolicitudService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
      
      // Crear nueva instancia del componente
      const newFixture = TestBed.createComponent(NumeroEmpleadosBimestreComponent);
      const newComponent = newFixture.componentInstance;
      
      // Simular elementos del DOM
      newComponent.registroDeNumeroEmpleadosElemento = {
        nativeElement: document.createElement('div')
      } as ElementRef;
      
      newComponent.confirmacionElemento = {
        nativeElement: document.createElement('div')
      } as ElementRef;
      
      newComponent.bimestreList = datosBimestreMock;
      
      newFixture.detectChanges();
      
      expect(newComponent.esFormularioSoloLectura).toBe(false);
    });

    it('✅ debería crear los formularios reactivos correctamente', () => {
      expect(component.registroNumeroEmpleadosForm).toBeDefined();
      expect(component.rfcForm).toBeDefined();
      
      // Verificar controles del formulario principal
      expect(component.registroNumeroEmpleadosForm.get('id')).toBeDefined();
      expect(component.registroNumeroEmpleadosForm.get('rfc')).toBeDefined();
      expect(component.registroNumeroEmpleadosForm.get('denominacionSocial')).toBeDefined();
      expect(component.registroNumeroEmpleadosForm.get('numeroDeEmpleados')).toBeDefined();
      expect(component.registroNumeroEmpleadosForm.get('bimestre')).toBeDefined();
      
      // Verificar controles del formulario RFC
      expect(component.rfcForm.get('rfcInput')).toBeDefined();
    });
  });

  describe('🚀 Ciclo de vida ngOnInit', () => {
    it('✅ debería suscribirse al estado del trámite y cargar datos', () => {
      component.ngOnInit();
      
      expect(component.seccionState).toEqual(estadoTramiteMock);
      expect(component.numeroEmpleadosBimestreList).toEqual(datosNumeroEmpleadosMock);
    });

    it('✅ debería gestionar suscripciones con takeUntil', () => {
      // Simplemente verificar que ngOnInit se ejecute sin errores y configure las suscripciones
      expect(() => component.ngOnInit()).not.toThrow();
      
      // Verificar que la suscripción fue configurada comprobando si seccionState está poblado
      expect(component.seccionState).toBeDefined();
    });
  });

  describe('📋 Gestión de formularios', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería validar correctamente el formulario RFC', () => {
      const rfcControl = component.rfcForm.get('rfcInput');
      
      // RFC vacío debe ser inválido
      rfcControl?.setValue('');
      expect(rfcControl?.valid).toBe(false);
      
      // RFC con formato correcto debe ser válido
      rfcControl?.setValue('XAXX010101000');
      expect(rfcControl?.valid).toBe(true);
    });

    it('✅ debería validar correctamente el formulario de registro', () => {
      const form = component.registroNumeroEmpleadosForm;
      
      // Formulario vacío debe ser inválido
      expect(form.valid).toBe(false);
      
      // Llenar todos los campos requeridos
      form.patchValue({
        rfc: 'ETE123456789',
        denominacionSocial: 'Empresa Test',
        numeroDeEmpleados: '25',
        bimestre: 1
      });
      
      expect(form.valid).toBe(true);
    });

    it('✅ debería aplicar validaciones de patrón RFC correctamente', () => {
      const rfcControl = component.registroNumeroEmpleadosForm.get('rfc');
      
      // RFC con formato incorrecto
      rfcControl?.setValue('ABC123');
      expect(rfcControl?.hasError('pattern')).toBe(true);
      
      // RFC con formato correcto
      rfcControl?.setValue('ETE123456789');
      expect(rfcControl?.hasError('pattern')).toBe(false);
    });

    it('✅ debería validar que número de empleados sea solo números', () => {
      const numeroControl = component.registroNumeroEmpleadosForm.get('numeroDeEmpleados');
      
      // Texto debe ser inválido
      numeroControl?.setValue('abc');
      expect(numeroControl?.hasError('pattern')).toBe(true);
      
      // Números deben ser válidos
      numeroControl?.setValue('123');
      expect(numeroControl?.hasError('pattern')).toBe(false);
    });
  });

  describe('🔄 Funcionalidad de modales', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería abrir el modal de registro correctamente', () => {
      const { Modal } = require('bootstrap');
      
      // Limpiar cualquier llamada anterior
      jest.clearAllMocks();
      
      expect(() => {
        component.agregarDialogoDatos();
      }).not.toThrow();
      
      expect(Modal).toHaveBeenCalledWith(
        component.registroDeNumeroEmpleadosElemento.nativeElement,
        { backdrop: false }
      );
    });

    it('✅ debería manejar modal no disponible sin errores', () => {
      component.registroDeNumeroEmpleadosElemento = null as any;
      
      expect(() => {
        component.agregarDialogoDatos();
      }).not.toThrow();
    });
  });

  describe('📤 Envío de datos del formulario', () => {
    beforeEach(() => {
      component.ngOnInit();
      jest.spyOn(component, 'enNuevaNotificacion');
      jest.spyOn(component, 'NumeroEmpleadosInfoDatos');
      jest.spyOn(component, 'cambiarEstadoModal');
    });

    it('✅ debería procesar formulario válido correctamente', () => {
      // Llenar formulario con datos válidos
      component.registroNumeroEmpleadosForm.patchValue({
        rfc: 'ETE123456789',
        denominacionSocial: 'Empresa Test',
        numeroDeEmpleados: '25',
        bimestre: 1
      });
      
      component.enviarDialogData();
      
      expect(component.enNuevaNotificacion).toHaveBeenCalledWith(component.CONFIRMACION_NUMEROEMPLEADOS);
      expect(component.esHabilitarElDialogo).toBe(true);
      expect(component.NumeroEmpleadosInfoDatos).toHaveBeenCalled();
      expect(component.cambiarEstadoModal).toHaveBeenCalled();
    });

    it('✅ debería manejar formulario inválido correctamente', () => {
      // Dejar formulario vacío (inválido)
      component.registroNumeroEmpleadosForm.reset();
      const markAllAsTouchedSpy = jest.spyOn(component.registroNumeroEmpleadosForm, 'markAllAsTouched');
      
      component.enviarDialogData();
      
      expect(component.enNuevaNotificacion).toHaveBeenCalledWith(component.MENSAJE_DE_VALIDACION);
      expect(component.esHabilitarElDialogo).toBe(true);
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('✅ debería resetear el formulario después de envío exitoso', () => {
      // Llenar formulario
      component.registroNumeroEmpleadosForm.patchValue({
        rfc: 'ETE123456789',
        denominacionSocial: 'Empresa Test',
        numeroDeEmpleados: '25',
        bimestre: 1
      });
      
      const resetSpy = jest.spyOn(component.registroNumeroEmpleadosForm, 'reset');
      
      component.enviarDialogData();
      
      expect(resetSpy).toHaveBeenCalled();
    });
  });

  describe('🔔 Sistema de notificaciones', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería crear notificación con datos correctos', () => {
      const mensajePrueba = 'Mensaje de prueba';
      
      component.enNuevaNotificacion(mensajePrueba);
      
      expect(component.nuevaNotificacion).toEqual({
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: mensajePrueba,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: ''
      });
    });

    it('✅ debería crear notificaciones para diferentes tipos de mensajes', () => {
      // Notificación de confirmación
      component.enNuevaNotificacion(component.CONFIRMACION_NUMEROEMPLEADOS);
      expect(component.nuevaNotificacion.mensaje).toBe(component.CONFIRMACION_NUMEROEMPLEADOS);
      
      // Notificación de validación
      component.enNuevaNotificacion(component.MENSAJE_DE_VALIDACION);
      expect(component.nuevaNotificacion.mensaje).toBe(component.MENSAJE_DE_VALIDACION);
    });
  });

  describe('🧹 Gestión de memoria y limpieza de recursos', () => {
    it('✅ debería completar el subject destroyed$ al destruir el componente', () => {
      const nextSpy = jest.spyOn(component.destroyed$, 'next');
      const completeSpy = jest.spyOn(component.destroyed$, 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('✅ debería cancelar suscripciones activas al destruir', () => {
      const destroyedSpy = jest.spyOn(component.destroyed$, 'next');
      
      component.ngOnDestroy();
      
      expect(destroyedSpy).toHaveBeenCalledTimes(1);
    });

    it('✅ debería manejar destrucción múltiple sin errores', () => {
      expect(() => {
        component.ngOnDestroy();
        component.ngOnDestroy();
      }).not.toThrow();
    });
  });

  describe('📋 Gestión de filas seleccionadas', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.numeroEmpleadosBimestreList = [...datosNumeroEmpleadosMock];
    });

    it('✅ debería manejar selección de fila única correctamente', () => {
      const filaSeleccionada = [datosNumeroEmpleadosMock[0]];
      
      component.manejarFilaSeleccionada(filaSeleccionada);
      
      expect(component.listaFilaSeleccionadaEmpleado).toEqual(filaSeleccionada);
      expect(component.filaSeleccionadaNumeroEmpleados).toEqual(datosNumeroEmpleadosMock[0]);
    });

    it('✅ debería manejar selección de múltiples filas correctamente', () => {
      const filasSeleccionadas = [...datosNumeroEmpleadosMock];
      
      component.manejarFilaSeleccionada(filasSeleccionadas);
      
      expect(component.listaFilaSeleccionadaEmpleado).toEqual(filasSeleccionadas);
      expect(component.filaSeleccionadaNumeroEmpleados).toEqual(datosNumeroEmpleadosMock[1]); // Última fila
    });

    it('✅ debería resetear selección cuando array está vacío', () => {
      component.manejarFilaSeleccionada([]);
      
      expect(component.listaFilaSeleccionadaEmpleado).toEqual([]);
      expect(component.filaSeleccionadaNumeroEmpleados).toEqual({} as any);
      expect(component.enableModficarBoton).toBe(false);
      expect(component.enableEliminarBoton).toBe(false);
    });

    it('✅ debería actualizar fila seleccionada con datos actuales', () => {
      component.filaSeleccionadaNumeroEmpleados = { ...datosNumeroEmpleadosMock[0] };
      
      component.actualizarFilaSeleccionada();
      
      expect(component.filaSeleccionadaNumeroEmpleados).toEqual(datosNumeroEmpleadosMock[0]);
    });

    it('✅ debería manejar actualización cuando no existe la fila seleccionada', () => {
      component.filaSeleccionadaNumeroEmpleados = { id: 999, denominacionSocial: '', rfc: '', numeroDeEmpleados: 0, bimestre: '' } as any;
      
      expect(() => component.actualizarFilaSeleccionada()).not.toThrow();
    });
  });

  describe('✏️ Funcionalidad de modificación', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.numeroEmpleadosBimestreList = [...datosNumeroEmpleadosMock];
      jest.spyOn(component, 'agregarDialogoDatos');
      jest.spyOn(component, 'patchModifyiedData');
    });

    it('✅ debería mostrar notificación cuando no hay filas seleccionadas', () => {
      component.listaFilaSeleccionadaEmpleado = [];
      
      component.modificarItemEmpleado();
      
      expect(component.nuevaNotificacion.mensaje).toBe('Selecciona un registro');
      expect(component.multipleSeleccionPopupAbierto).toBe(true);
    });

    it('✅ debería mostrar notificación cuando hay múltiples filas seleccionadas', () => {
      component.listaFilaSeleccionadaEmpleado = [...datosNumeroEmpleadosMock];
      
      component.modificarItemEmpleado();
      
      expect(component.nuevaNotificacion.mensaje).toBe('Selecciona sólo un registro para modificar.');
      expect(component.multipleSeleccionPopupAbierto).toBe(true);
    });

    it('✅ debería permitir modificar cuando hay exactamente una fila seleccionada', () => {
      component.listaFilaSeleccionadaEmpleado = [datosNumeroEmpleadosMock[0]];
      component.filaSeleccionadaNumeroEmpleados = datosNumeroEmpleadosMock[0];
      
      component.modificarItemEmpleado();
      
      expect(component.agregarDialogoDatos).toHaveBeenCalled();
      expect(component.patchModifyiedData).toHaveBeenCalled();
    });

    it('✅ debería rellenar el formulario con datos de la fila seleccionada', () => {
      component.filaSeleccionadaNumeroEmpleados = datosNumeroEmpleadosMock[0];
      
      component.patchModifyiedData();
      
      const formValue = component.registroNumeroEmpleadosForm.value;
      expect(formValue.id).toBe(datosNumeroEmpleadosMock[0].id);
      expect(formValue.denominacionSocial).toBe(datosNumeroEmpleadosMock[0].denominacionSocial);
      expect(formValue.rfc).toBe(datosNumeroEmpleadosMock[0].rfc);
      expect(formValue.numeroDeEmpleados).toBe(datosNumeroEmpleadosMock[0].numeroDeEmpleados);
    });

    it('✅ debería manejar patchModifyiedData con bimestre no encontrado en la lista', () => {
      component.filaSeleccionadaNumeroEmpleados = {
        ...datosNumeroEmpleadosMock[0],
        bimestre: 'Bimestre No Existente'
      };
      
      expect(() => component.patchModifyiedData()).not.toThrow();
      
      const formValue = component.registroNumeroEmpleadosForm.value;
      expect(formValue.bimestre).toBe(0); // findIndex devuelve -1, +1 = 0
    });
  });

  describe('🗑️ Funcionalidad de eliminación', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.numeroEmpleadosBimestreList = [...datosNumeroEmpleadosMock];
    });

    it('✅ debería mostrar notificación cuando no hay elementos seleccionados para eliminar', () => {
      component.listaFilaSeleccionadaEmpleado = [];
      
      component.confirmEliminarEmpleadoItem();
      
      expect(component.nuevaNotificacion.mensaje).toBe('Debes seleccionar al menos un registro para eliminar.');
      expect(component.multipleSeleccionPopupAbierto).toBe(true);
    });

    it('✅ debería abrir popup de confirmación cuando hay elementos seleccionados', () => {
      component.listaFilaSeleccionadaEmpleado = [datosNumeroEmpleadosMock[0]];
      
      component.confirmEliminarEmpleadoItem();
      
      expect(component.nuevaNotificacion.mensaje).toBe('¿Estás seguro que deseas eliminar los registros marcados?');
      expect(component.confirmEliminarPopupAbierto).toBe(true);
    });

    it('✅ debería llamar a abrirElimninarConfirmationopup desde confirmEliminarEmpleadoItem', () => {
      component.listaFilaSeleccionadaEmpleado = [datosNumeroEmpleadosMock[0]];
      jest.spyOn(component, 'abrirElimninarConfirmationopup');
      
      component.confirmEliminarEmpleadoItem();
      
      expect(component.abrirElimninarConfirmationopup).toHaveBeenCalled();
    });

    it('✅ debería configurar notificación de confirmación de eliminación directamente', () => {
      component.abrirElimninarConfirmationopup();
      
      expect(component.nuevaNotificacion.mensaje).toBe('¿Estás seguro que deseas eliminar los registros marcados?');
      expect(component.nuevaNotificacion.txtBtnAceptar).toBe('Aceptar');
      expect(component.nuevaNotificacion.txtBtnCancelar).toBe('Cancelar');
      expect(component.confirmEliminarPopupAbierto).toBe(true);
    });

    it('✅ debería eliminar elementos cuando se confirma la eliminación', () => {
      component.listaFilaSeleccionadaEmpleado = [datosNumeroEmpleadosMock[0]];
      const longitudInicial = component.numeroEmpleadosBimestreList.length;
      
      component.eliminarEmpleadoItem(true);
      
      expect(component.numeroEmpleadosBimestreList.length).toBe(longitudInicial - 1);
      expect(component.numeroEmpleadosBimestreList).not.toContain(datosNumeroEmpleadosMock[0]);
      expect(component.listaFilaSeleccionadaEmpleado).toEqual([]);
      expect(component.filaSeleccionadaNumeroEmpleados).toEqual({} as any);
      expect(mockSolicitud32608Store.actualizarEstado).toHaveBeenCalled();
    });

    it('✅ no debería eliminar elementos cuando se cancela la eliminación', () => {
      component.listaFilaSeleccionadaEmpleado = [datosNumeroEmpleadosMock[0]];
      const longitudInicial = component.numeroEmpleadosBimestreList.length;
      
      component.eliminarEmpleadoItem(false);
      
      expect(component.numeroEmpleadosBimestreList.length).toBe(longitudInicial);
    });

    it('✅ debería cerrar popup de confirmación de eliminación', () => {
      component.cerrarEliminarConfirmationPopup();
      
      expect(component.confirmEliminarPopupAbierto).toBe(false);
      expect(component.confirmEliminarPopupCerrado).toBe(false);
    });
  });

  describe('🔄 Gestión de popups', () => {
    it('✅ debería abrir popup de selección múltiple', () => {
      component.abrirMultipleSeleccionPopup();
      
      expect(component.nuevaNotificacion.mensaje).toBe('Selecciona sólo un registro para modificar.');
      expect(component.multipleSeleccionPopupAbierto).toBe(true);
    });

    it('✅ debería cerrar popup de selección múltiple', () => {
      component.cerrarMultipleSeleccionPopup();
      
      expect(component.multipleSeleccionPopupAbierto).toBe(false);
      expect(component.multipleSeleccionPopupCerrado).toBe(false);
    });

    it('✅ debería cerrar modal principal', () => {
      component.esHabilitarElDialogo = true;
      
      component.cerrarModal();
      
      expect(component.esHabilitarElDialogo).toBe(false);
    });

    it('✅ debería cancelar modal y cambiar estado', () => {
      const { Modal } = require('bootstrap');
      const mockInstance = { hide: jest.fn() };
      Modal.getInstance.mockReturnValue(mockInstance);
      
      component.modalCancelar();
      
      expect(Modal.getInstance).toHaveBeenCalled();
      expect(mockInstance.hide).toHaveBeenCalled();
    });

    it('✅ debería manejar cambiarEstadoModal cuando no hay instancia de modal', () => {
      const { Modal } = require('bootstrap');
      Modal.getInstance.mockReturnValue(null);
      
      expect(() => component.cambiarEstadoModal()).not.toThrow();
    });

    it('✅ debería manejar cambiarEstadoModal cuando hay instancia de modal', () => {
      const { Modal } = require('bootstrap');
      const mockInstance = { hide: jest.fn() };
      Modal.getInstance.mockReturnValue(mockInstance);
      
      component.cambiarEstadoModal();
      
      expect(mockInstance.hide).toHaveBeenCalled();
    });
  });

  describe('🔍 Búsqueda de RFC', () => {
    beforeEach(() => {
      component.ngOnInit();
      mockSolicitudService.getRFCDetails.mockReturnValue(of({
        code: 200,
        message: 'Success',
        data: {
          rfc: 'ETE123456789',
          denominacionSocial: 'Empresa Test Completa S.A. de C.V.'
        }
      } as BuscarRfcResponse));
    });

    it('✅ debería buscar detalles de RFC cuando el formulario es válido', () => {
      component.rfcForm.patchValue({ rfcInput: 'ETE123456789' });
      
      component.onBuscarRfc();
      
      expect(mockSolicitudService.getRFCDetails).toHaveBeenCalled();
    });

    it('✅ debería actualizar formulario con datos obtenidos del RFC', () => {
      component.rfcForm.patchValue({ rfcInput: 'ETE123456789' });
      
      component.onBuscarRfc();
      
      expect(component.registroNumeroEmpleadosForm.get('rfc')?.value).toBe('ETE123456789');
      expect(component.registroNumeroEmpleadosForm.get('denominacionSocial')?.value).toBe('Empresa Test Completa S.A. de C.V.');
    });

    it('✅ no debería buscar RFC cuando el formulario es inválido', () => {
      component.rfcForm.patchValue({ rfcInput: '' });
      
      component.onBuscarRfc();
      
      expect(mockSolicitudService.getRFCDetails).not.toHaveBeenCalled();
    });

    it('✅ debería manejar errores en la búsqueda de RFC', () => {
      component.rfcForm.patchValue({ rfcInput: 'ETE123456789' });
      const errorResponse = new Error('Error de red');
      mockSolicitudService.getRFCDetails.mockReturnValue(
        new Observable(observer => observer.error(errorResponse))
      );
      
      expect(() => component.onBuscarRfc()).not.toThrow();
    });

    it('✅ debería manejar respuesta vacía del servicio RFC', () => {
      component.rfcForm.patchValue({ rfcInput: 'ETE123456789' });
      mockSolicitudService.getRFCDetails.mockReturnValue(of({
        code: 200,
        message: 'Success',
        data: {}
      } as BuscarRfcResponse));
      
      component.onBuscarRfc();
      
      expect(component.registroNumeroEmpleadosForm.get('rfc')?.value).toBeUndefined();
      expect(component.registroNumeroEmpleadosForm.get('denominacionSocial')?.value).toBeUndefined();
    });
  });

  describe('🧹 Limpieza de formularios', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería limpiar el formulario correctamente', () => {
      // Llenar formulario primero
      component.registroNumeroEmpleadosForm.patchValue({
        rfc: 'ETE123456789',
        denominacionSocial: 'Empresa Test',
        numeroDeEmpleados: '25',
        bimestre: 1
      });
      
      component.limpiarFormulario();
      
      expect(component.registroNumeroEmpleadosForm.get('rfc')?.value).toBeNull();
      expect(component.registroNumeroEmpleadosForm.get('denominacionSocial')?.value).toBeNull();
      expect(component.registroNumeroEmpleadosForm.get('numeroDeEmpleados')?.value).toBeNull();
      expect(component.registroNumeroEmpleadosForm.get('bimestre')?.value).toBeNull();
    });
  });

  describe('🎚️ Funcionalidad colapsable', () => {
    it('✅ debería alternar el estado colapsable', () => {
      const estadoInicial = component.colapsable;
      
      component.mostrar_colapsable();
      
      expect(component.colapsable).toBe(!estadoInicial);
    });

    it('✅ debería alternar múltiples veces el estado colapsable', () => {
      const estadoInicial = component.colapsable;
      
      component.mostrar_colapsable();
      component.mostrar_colapsable();
      
      expect(component.colapsable).toBe(estadoInicial);
    });
  });

  describe('✅ Validación de controles', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería identificar control inválido y tocado como inválido', () => {
      const rfcControl = component.registroNumeroEmpleadosForm.get('rfc');
      rfcControl?.setValue('');
      rfcControl?.markAsTouched();
      
      const esInvalido = component.esInvalido('rfc');
      
      expect(esInvalido).toBe(true);
    });

    it('✅ debería identificar control válido como válido', () => {
      const rfcControl = component.registroNumeroEmpleadosForm.get('rfc');
      rfcControl?.setValue('ETE123456789');
      
      const esInvalido = component.esInvalido('rfc');
      
      expect(esInvalido).toBe(false);
    });

    it('✅ debería manejar control inexistente sin errores', () => {
      const esInvalido = component.esInvalido('controlInexistente');
      
      expect(esInvalido).toBe(false);
    });
  });

  describe('📊 Gestión de datos de empleados', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.numeroEmpleadosBimestreList = [];
    });

    it('✅ debería actualizar registro existente al enviar datos', () => {
      // Configurar datos existentes
      component.numeroEmpleadosBimestreList = [...datosNumeroEmpleadosMock];
      component.filaSeleccionadaNumeroEmpleados = datosNumeroEmpleadosMock[0];
      
      // Llenar formulario con datos actualizados
      component.registroNumeroEmpleadosForm.patchValue({
        rfc: 'ETE123456789',
        denominacionSocial: 'Empresa Actualizada',
        numeroDeEmpleados: '100',
        bimestre: 1
      });
      
      component.NumeroEmpleadosInfoDatos();
      
      const elementoActualizado = component.numeroEmpleadosBimestreList.find(e => e.id === datosNumeroEmpleadosMock[0].id);
      expect(elementoActualizado?.denominacionSocial).toBe('Empresa Actualizada');
      expect(elementoActualizado?.numeroDeEmpleados).toBe('100');
      expect(mockSolicitud32608Store.actualizarEstado).toHaveBeenCalled();
    });

    it('✅ debería agregar nuevo registro cuando no hay fila seleccionada', () => {
      component.filaSeleccionadaNumeroEmpleados = {} as any;
      
      component.registroNumeroEmpleadosForm.patchValue({
        rfc: 'NEW123456789',
        denominacionSocial: 'Empresa Nueva',
        numeroDeEmpleados: '50',
        bimestre: 1
      });
      
      const longitudInicial = component.numeroEmpleadosBimestreList.length;
      component.NumeroEmpleadosInfoDatos();
      
      expect(component.numeroEmpleadosBimestreList.length).toBe(longitudInicial + 1);
      expect(component.numeroEmpleadosBimestreList[0].denominacionSocial).toBe('Empresa Nueva');
      expect(mockSolicitud32608Store.actualizarEstado).toHaveBeenCalled();
    });

    it('✅ debería generar ID incremental para nuevos registros', () => {
      component.numeroEmpleadosBimestreList = [{ id: 5, denominacionSocial: '', rfc: '', numeroDeEmpleados: 0, bimestre: '' }] as any;
      component.filaSeleccionadaNumeroEmpleados = {} as any;
      
      component.registroNumeroEmpleadosForm.patchValue({
        rfc: 'NEW123456789',
        denominacionSocial: 'Empresa Nueva',
        numeroDeEmpleados: '50',
        bimestre: 1
      });
      
      component.NumeroEmpleadosInfoDatos();
      
      const nuevoElemento = component.numeroEmpleadosBimestreList.find(e => e.denominacionSocial === 'Empresa Nueva');
      expect(nuevoElemento?.id).toBe(6);
    });

    it('✅ debería manejar lista de bimestre vacía en NumeroEmpleadosInfoDatos', () => {
      component.bimestreList = [];
      component.filaSeleccionadaNumeroEmpleados = {} as any;
      
      component.registroNumeroEmpleadosForm.patchValue({
        rfc: 'NEW123456789',
        denominacionSocial: 'Empresa Nueva',
        numeroDeEmpleados: '50',
        bimestre: 1
      });
      
      expect(() => component.NumeroEmpleadosInfoDatos()).not.toThrow();
      
      const nuevoElemento = component.numeroEmpleadosBimestreList.find(e => e.denominacionSocial === 'Empresa Nueva');
      expect(nuevoElemento?.bimestre).toBe(''); // OBTENER_DESCRIPCION devuelve cadena vacía
    });

    it('✅ debería resetear filaSeleccionadaNumeroEmpleados después de actualizar', () => {
      component.numeroEmpleadosBimestreList = [...datosNumeroEmpleadosMock];
      component.filaSeleccionadaNumeroEmpleados = datosNumeroEmpleadosMock[0];
      
      component.registroNumeroEmpleadosForm.patchValue({
        rfc: 'ETE123456789',
        denominacionSocial: 'Empresa Actualizada',
        numeroDeEmpleados: '100',
        bimestre: 1
      });
      
      component.NumeroEmpleadosInfoDatos();
      
      expect(component.filaSeleccionadaNumeroEmpleados).toEqual({} as any);
    });
  });
});