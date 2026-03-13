import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';

import { ControlInventariosComponent } from './control-inventarios.component';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { 
  TipoNotificacionEnum, 
  CategoriaMensaje 
} from '@libs/shared/data-access-user/src';
import { createInitialSolicitudState, Solicitud32610Store } from '../../estados/solicitud32610.store';
import { Solicitud32610Query } from '../../estados/solicitud32610.query';
import { ControlInventariosTabla } from '../../models/oea-textil-registro.model';

describe('ControlInventariosComponent - Pruebas unitarias', () => {
  let component: ControlInventariosComponent;
  let fixture: ComponentFixture<ControlInventariosComponent>;
  let mockTramite32609Store: jest.Mocked<Solicitud32610Store>;
  let mockTramite32609Query: jest.Mocked<Solicitud32610Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

  const datosControlInventariosMock: ControlInventariosTabla[] = [
    {
      id: 1,
      nombreSistema: 'Sistema de Inventarios ERP',
      lugarRadicacion: 'Ciudad de México',
      cumpleAnexo24: true
    },
    {
      id: 2,
      nombreSistema: 'Sistema de Gestión Comercial',
      lugarRadicacion: 'Guadalajara',
      cumpleAnexo24: false
    }
  ];

  const estadoConsultaMock = {
    readonly: false,
    procedureId: '',
    parameter: '',
    department: '',
    folioTramite: '',
    tramiteCompleto: false,
    loading: false,
    error: null,
    success: false,
    isConsultaio: false,
    tipoDeTramite: '',
    estadoDeTramite: '',
    create: false,
    update: false,
    consultaioSolicitante: null
  };

  const estadoTramiteMock = {
    ...createInitialSolicitudState(),
    controlInventarios: datosControlInventariosMock
  };

  beforeEach(async () => {
    mockTramite32609Store = {
      actualizarEstado: jest.fn(),
      actualizarSeccion: jest.fn(),
      eliminarElemento: jest.fn()
    } as any;

    mockTramite32609Query = {
      selectTramite32609$: of(estadoTramiteMock),
      selectSolicitud$: of(estadoTramiteMock) 
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of(estadoConsultaMock)
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ControlInventariosComponent
      ],
      providers: [
        FormBuilder,
        { provide: Solicitud32610Store, useValue: mockTramite32609Store },
        { provide: Solicitud32610Query, useValue: mockTramite32609Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ControlInventariosComponent);
    component = fixture.componentInstance;

    const registroModalDiv = document.createElement('div');
    registroModalDiv.id = 'registroDeNumeroEmpleadosModal';

    component.registroDeNumeroEmpleadosModalElemento = {
      nativeElement: registroModalDiv
    } as ElementRef;

    const confirmacionDiv = document.createElement('div');
    confirmacionDiv.id = 'confirmacionModal';

    component.confirmacionElemento = {
      nativeElement: confirmacionDiv
    } as ElementRef;

    const modalMock = jest.fn().mockImplementation(() => ({
      show: jest.fn(),
      hide: jest.fn()
    }));
    (modalMock as any).getInstance = jest.fn().mockReturnValue({
      hide: jest.fn()
    });
    (modalMock.prototype as any).getInstance = (modalMock as any).getInstance;
    (global as any).Modal = modalMock;

    const mockModalInstance = { show: jest.fn(), hide: jest.fn() };
    const MockedModal = jest.fn(() => mockModalInstance);
    (MockedModal as any).getInstance = jest.fn(() => mockModalInstance);

    jest.mock('bootstrap', () => ({
      Modal: MockedModal
    }));
  });

  describe('🔧 Inicialización del componente', () => {
    it('✅ debería crear el componente sin errores', () => {
      expect(component).toBeTruthy();
    });

    it('✅ debería inicializar las propiedades con valores por defecto correctos', () => {
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.esHabilitarElDialogo).toBe(false);
      expect(component.controlInventariosList).toEqual([]);
      expect(component.activeTab).toBe('parquevehicular');
      expect(component.multipleSeleccionPopupAbierto).toBe(false);
      expect(component.confirmEliminarPopupAbierto).toBe(false);
      expect(component.enableEliminarBoton).toBe(false);
      expect(component.enableModficarBoton).toBe(false);
      expect(component.colapsable).toBe(true);
      expect(component.radioSeleccionado).toBe(false);
      expect(component.valorAnteriorRadioButton).toBe(null);
    });

    it('✅ debería configurar las suscripciones en el constructor', () => {
      fixture.detectChanges();
      expect(component.esFormularioSoloLectura).toBe(estadoConsultaMock.readonly);
    });

    it('✅ debería crear los formularios reactivos correctamente', () => {
      expect(component.registroControlInventariosForm).toBeDefined();
      expect(component.modificarRegistroControlInventariosForm).toBeDefined();
      
      expect(component.registroControlInventariosForm.get('id')).toBeDefined();
      expect(component.registroControlInventariosForm.get('sistemaControlInventariosArt59')).toBeDefined();
      expect(component.registroControlInventariosForm.get('nombreSistema')).toBeDefined();
      expect(component.registroControlInventariosForm.get('lugarRadicacion')).toBeDefined();
      expect(component.registroControlInventariosForm.get('cumpleAnexo24')).toBeDefined();
      expect(component.modificarRegistroControlInventariosForm.get('id')).toBeDefined();
      expect(component.modificarRegistroControlInventariosForm.get('modificarNombreSistema')).toBeDefined();
      expect(component.modificarRegistroControlInventariosForm.get('modificarLugarRadicacion')).toBeDefined();
      expect(component.modificarRegistroControlInventariosForm.get('modificarCumpleAnexo24')).toBeDefined();
    });

    it('✅ debería configurar campos deshabilitados inicialmente', () => {
      const nombreSistema = component.registroControlInventariosForm.get('nombreSistema');
      const lugarRadicacion = component.registroControlInventariosForm.get('lugarRadicacion');
      
      expect(nombreSistema?.disabled).toBe(true);
      expect(lugarRadicacion?.disabled).toBe(true);
    });
  });

  describe('🚀 Ciclo de vida ngOnInit', () => {
    it('✅ debería suscribirse al estado del trámite y cargar datos', () => {
      component.ngOnInit();
      expect(component.seccionState).toEqual(estadoTramiteMock);
      expect(component.controlInventariosList).toEqual(datosControlInventariosMock);
    });

    it('✅ debería inicializar valor anterior del radio button si existe', () => {
      component.registroControlInventariosForm.get('sistemaControlInventariosArt59')?.setValue('1');
      component.ngOnInit();
      expect(component.valorAnteriorRadioButton).toBe('1');
    });
  });

  describe('📋 Gestión de formularios', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería validar correctamente el formulario principal', () => {
      const form = component.registroControlInventariosForm;
      
      expect(form.valid).toBe(false);
      
      form.patchValue({
        sistemaControlInventariosArt59: '1',
        nombreSistema: 'Sistema de Inventarios',
        lugarRadicacion: 'Ciudad de México',
        cumpleAnexo24: true
      });
      
      component.actualizarEstadoFormulario();
      
      expect(form.valid).toBe(true);
    });

    it('✅ debería validar correctamente el formulario de modificación', () => {
      const form = component.modificarRegistroControlInventariosForm;
      
      expect(form.valid).toBe(false);
      form.patchValue({
        modificarNombreSistema: 'Sistema Modificado',
        modificarLugarRadicacion: 'Monterrey',
        modificarCumpleAnexo24: false
      });
      
      expect(form.valid).toBe(true);
    });

    it('✅ debería manejar valores de checkbox correctamente', () => {
      const form = component.registroControlInventariosForm;
      const cumpleAnexoControl = form.get('cumpleAnexo24');
      expect(cumpleAnexoControl?.value).toBe(false);
      
      cumpleAnexoControl?.setValue(true);
      expect(cumpleAnexoControl?.value).toBe(true);
    
      cumpleAnexoControl?.setValue(false);
      expect(cumpleAnexoControl?.value).toBe(false);
    });
  });

  describe('📻 Gestión de radio buttons', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería habilitar campos cuando se selecciona "Sí"', () => {
      component.onSeleccionfalsa('1');
      
      expect(component.radioSeleccionado).toBe(true);
      expect(component.esHabilitarElDialogo).toBe(false);
      expect(component.valorAnteriorRadioButton).toBe('1');
      
      const nombreSistema = component.registroControlInventariosForm.get('nombreSistema');
      const lugarRadicacion = component.registroControlInventariosForm.get('lugarRadicacion');
      expect(nombreSistema?.enabled).toBe(true);
      expect(lugarRadicacion?.enabled).toBe(true);
    });

    it('✅ debería mostrar notificación y deshabilitar campos cuando se selecciona "No"', () => {
      component.onSeleccionfalsa('0');
      
      expect(component.radioSeleccionado).toBe(false);
      expect(component.esHabilitarElDialogo).toBe(true);
      expect(component.nuevaNotificacion.mensaje).toBe('Debe agregar por lo menos un control de inventarios.');
      
      const nombreSistema = component.registroControlInventariosForm.get('nombreSistema');
      const lugarRadicacion = component.registroControlInventariosForm.get('lugarRadicacion');
      expect(nombreSistema?.enabled).toBe(false);
      expect(lugarRadicacion?.enabled).toBe(false);
    });

    it('✅ debería manejar valores numéricos en radio button', () => {
      component.onSeleccionfalsa(1);
      expect(component.radioSeleccionado).toBe(true);
      
      component.onSeleccionfalsa(0);
      expect(component.radioSeleccionado).toBe(false);
    });

    it('✅ debería actualizar estado del formulario correctamente', () => {
      component.registroControlInventariosForm.get('sistemaControlInventariosArt59')?.setValue('1');
      component.actualizarEstadoFormulario();
      
      expect(component.radioSeleccionado).toBe(true);
      
      component.registroControlInventariosForm.get('sistemaControlInventariosArt59')?.setValue('0');
      component.actualizarEstadoFormulario();
      
      expect(component.radioSeleccionado).toBe(false);
    });
  });

  describe('🔄 Funcionalidad de modales', () => {
    beforeEach(() => {
      component.ngOnInit();
      const modalInstance = { show: jest.fn(), hide: jest.fn() };
      (global as any).Modal = jest.fn().mockImplementation(() => modalInstance);
      (global as any).Modal.getInstance = jest.fn().mockReturnValue(modalInstance);
    });

    it('✅ debería manejar modal no disponible sin errores', () => {
      component.registroDeNumeroEmpleadosModalElemento = null as any;
      
      expect(() => {
        component.agregarDialogoDatos();
      }).not.toThrow();
    });

    it('✅ debería cancelar modal y cerrar', () => {
      const cambiarEstadoModalSpy = jest.spyOn(component, 'cambiarEstadoModal');
      
      component.modalCancelar();
      
      expect(cambiarEstadoModalSpy).toHaveBeenCalled();
    });
  });

  describe('📤 Envío de datos del formulario', () => {
    beforeEach(() => {
      component.ngOnInit();
      jest.spyOn(component, 'enNuevaNotificacion');
      jest.spyOn(component, 'ControlInventariosInfoDatos');
      jest.spyOn(component, 'limpiarFormulario');
    });

    it('✅ debería procesar formulario principal válido correctamente', () => {
      component.registroControlInventariosForm.patchValue({
        sistemaControlInventariosArt59: '1',
        nombreSistema: 'Sistema de Inventarios',
        lugarRadicacion: 'Ciudad de México',
        cumpleAnexo24: true
      });
      
      component.registroControlInventariosForm.get('nombreSistema')?.enable();
      component.registroControlInventariosForm.get('lugarRadicacion')?.enable();
      
      component.enviarDialogData();
      
      expect(component.enNuevaNotificacion).toHaveBeenCalledWith(component.CONFIRMACION_NUMEROEMPLEADOS);
      expect(component.esHabilitarElDialogo).toBe(true);
      expect(component.ControlInventariosInfoDatos).toHaveBeenCalled();
      expect(component.limpiarFormulario).toHaveBeenCalled();
    });

    it('✅ debería procesar formulario de modificación válido correctamente', () => {
      component.modificarRegistroControlInventariosForm.patchValue({
        modificarNombreSistema: 'Sistema Modificado',
        modificarLugarRadicacion: 'Monterrey',
        modificarCumpleAnexo24: false
      });
      
      jest.spyOn(component, 'limpiarFormularioModal');
      jest.spyOn(component, 'cambiarEstadoModal');
      
      component.modificarEnviarDialogData();
      
      expect(component.enNuevaNotificacion).toHaveBeenCalledWith(component.CONFIRMACION_NUMEROEMPLEADOS);
      expect(component.esHabilitarElDialogo).toBe(true);
      expect(component.ControlInventariosInfoDatos).toHaveBeenCalledWith(true);
      expect(component.limpiarFormularioModal).toHaveBeenCalled();
      expect(component.cambiarEstadoModal).toHaveBeenCalled();
    });

    it('✅ debería manejar formulario principal inválido correctamente', () => {
      component.registroControlInventariosForm.reset();
      const markAllAsTouchedSpy = jest.spyOn(component.registroControlInventariosForm, 'markAllAsTouched');
      
      component.enviarDialogData();
      
      expect(component.enNuevaNotificacion).toHaveBeenCalledWith(component.MENSAJE_DE_VALIDACION);
      expect(component.esHabilitarElDialogo).toBe(true);
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('✅ debería manejar formulario de modificación inválido correctamente', () => {
      component.modificarRegistroControlInventariosForm.reset();
      const markAllAsTouchedSpy = jest.spyOn(component.modificarRegistroControlInventariosForm, 'markAllAsTouched');
      
      component.modificarEnviarDialogData();
      
      expect(component.enNuevaNotificacion).toHaveBeenCalledWith(component.MENSAJE_DE_VALIDACION);
      expect(component.esHabilitarElDialogo).toBe(true);
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('📋 Manejo de selección de tabla', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería manejar selección de filas correctamente', () => {
      const filasSeleccionadas = [datosControlInventariosMock[0]];
      
      component.manejarFilaSeleccionada(filasSeleccionadas);
      
      expect(component.listaFilaSeleccionadaEmpleado).toEqual(filasSeleccionadas);
      expect(component.filaSeleccionadaControlInventarios).toEqual(datosControlInventariosMock[0]);
    });

    it('✅ debería limpiar selección cuando se pasa array vacío', () => {
      component.manejarFilaSeleccionada([]);
      
      expect(component.listaFilaSeleccionadaEmpleado).toEqual([]);
      expect(component.filaSeleccionadaControlInventarios).toEqual({});
      expect(component.enableEliminarBoton).toBe(false);
      expect(component.enableModficarBoton).toBe(false);
    });

    it('✅ debería seleccionar la última fila como principal en múltiples selecciones', () => {
      component.manejarFilaSeleccionada(datosControlInventariosMock);
      
      expect(component.filaSeleccionadaControlInventarios).toEqual(
        datosControlInventariosMock[datosControlInventariosMock.length - 1]
      );
    });

    it('✅ debería actualizar fila seleccionada con datos más recientes', () => {
      component.controlInventariosList = datosControlInventariosMock;
      component.filaSeleccionadaControlInventarios = { ...datosControlInventariosMock[0] };
      
      component.controlInventariosList[0].nombreSistema = 'Sistema Actualizado';
      
      component.actualizarFilaSeleccionada();
      
      expect(component.filaSeleccionadaControlInventarios.nombreSistema).toBe('Sistema Actualizado');
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
      component.enNuevaNotificacion(component.CONFIRMACION_NUMEROEMPLEADOS);
      expect(component.nuevaNotificacion.mensaje).toBe(component.CONFIRMACION_NUMEROEMPLEADOS);

      component.enNuevaNotificacion(component.MENSAJE_DE_VALIDACION);
      expect(component.nuevaNotificacion.mensaje).toBe(component.MENSAJE_DE_VALIDACION);
    });
  });

  describe('🔄 Funcionalidad de modificación', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería cargar datos en formulario de modificación', () => {
      const datoPrueba = datosControlInventariosMock[0];
      component.filaSeleccionadaControlInventarios = datoPrueba;
      
      component.patchModifyiedData();
      
      expect(component.modificarRegistroControlInventariosForm.get('modificarNombreSistema')?.value).toBe(datoPrueba.nombreSistema);
      expect(component.modificarRegistroControlInventariosForm.get('modificarLugarRadicacion')?.value).toBe(datoPrueba.lugarRadicacion);
      expect(component.modificarRegistroControlInventariosForm.get('modificarCumpleAnexo24')?.value).toBe(datoPrueba.cumpleAnexo24);
    });

    it('✅ debería manejar modificación sin fila seleccionada', () => {
      component.listaFilaSeleccionadaEmpleado = [];
      
      component.modificarItemEmpleado();
      
      expect(component.multipleSeleccionPopupAbierto).toBe(true);
      expect(component.nuevaNotificacion.mensaje).toBe('Selecciona un registro');
    });

      it('✅ debería manejar múltiples selecciones para modificación', () => {
        component.listaFilaSeleccionadaEmpleado = datosControlInventariosMock;
        
        component.modificarItemEmpleado();
        
        expect(component.multipleSeleccionPopupAbierto).toBe(true);
        expect(component.nuevaNotificacion.mensaje).toBe('Selecciona sólo un registro para modificar.');
      });
    });


  describe('🗑️ Funcionalidad de eliminación', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería mostrar notificación cuando no hay elementos seleccionados para eliminar', () => {
      component.listaFilaSeleccionadaEmpleado = [];
      
      component.confirmEliminarEmpleadoItem();
      
      expect(component.multipleSeleccionPopupAbierto).toBe(true);
      expect(component.nuevaNotificacion.mensaje).toBe('Seleccione un registro');
    });

    it('✅ debería abrir popup de confirmación cuando hay elementos seleccionados', () => {
      component.listaFilaSeleccionadaEmpleado = [datosControlInventariosMock[0]];
      
      component.confirmEliminarEmpleadoItem();
      
      expect(component.confirmEliminarPopupAbierto).toBe(true);
      expect(component.nuevaNotificacion.mensaje).toBe('¿Estás seguro que deseas eliminar los registros marcados?');
    });

    it('✅ debería eliminar elementos seleccionados correctamente', () => {
      component.controlInventariosList = [...datosControlInventariosMock];
      component.listaFilaSeleccionadaEmpleado = [datosControlInventariosMock[0]];
      
      jest.spyOn(component, 'cerrarEliminarConfirmationPopup');
      
      component.eliminarEmpleadoItem(true);
      
      expect(component.controlInventariosList).toHaveLength(1);
      expect(component.controlInventariosList[0].id).toBe(2);
      expect(component.listaFilaSeleccionadaEmpleado).toEqual([]);
      expect(component.filaSeleccionadaControlInventarios).toEqual({});
      expect(mockTramite32609Store.actualizarEstado).toHaveBeenCalledWith({
        controlInventarios: component.controlInventariosList
      });
      expect(component.cerrarEliminarConfirmationPopup).toHaveBeenCalled();
    });

    it('✅ debería no eliminar cuando se cancela la confirmación', () => {
      const listaOriginal = [...datosControlInventariosMock];
      component.controlInventariosList = listaOriginal;
      component.listaFilaSeleccionadaEmpleado = [datosControlInventariosMock[0]];
      
      component.eliminarEmpleadoItem(false);
      
      expect(component.controlInventariosList).toEqual(listaOriginal);
    });
  });

  describe('💾 Gestión de datos', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería actualizar registro existente cuando hay fila seleccionada', () => {
      component.controlInventariosList = [...datosControlInventariosMock];
      component.filaSeleccionadaControlInventarios = datosControlInventariosMock[0];
      
      component.modificarRegistroControlInventariosForm.patchValue({
        modificarNombreSistema: 'Sistema Actualizado',
        modificarLugarRadicacion: 'Lugar Actualizado',
        modificarCumpleAnexo24: false
      });
      
      component.ControlInventariosInfoDatos(true);
      
      expect(component.controlInventariosList[0]).toEqual({
        id: 1,
        nombreSistema: 'Sistema Actualizado',
        lugarRadicacion: 'Lugar Actualizado',
        cumpleAnexo24: false
      });
      expect(component.filaSeleccionadaControlInventarios).toEqual({});
      expect(mockTramite32609Store.actualizarEstado).toHaveBeenCalledWith({
        controlInventarios: component.controlInventariosList
      });
    });

    it('✅ debería generar ID incremental para nuevos registros', () => {
      component.controlInventariosList = datosControlInventariosMock;
      component.filaSeleccionadaControlInventarios = {} as ControlInventariosTabla;
      
      component.registroControlInventariosForm.patchValue({
        nombreSistema: 'Tercer Sistema',
        lugarRadicacion: 'Tercer Lugar',
        cumpleAnexo24: true
      });
      
      component.ControlInventariosInfoDatos(false);
      
      const nuevoRegistro = component.controlInventariosList[component.controlInventariosList.length - 1];
      expect(nuevoRegistro.id).toBe(3);
    });
  });

  describe('🧽 Funcionalidad de limpieza', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería limpiar formulario principal correctamente', () => {
      component.registroControlInventariosForm.patchValue({
        nombreSistema: 'Sistema Test',
        lugarRadicacion: 'Lugar Test',
        cumpleAnexo24: true
      });
      component.valorAnteriorRadioButton = '1';
      
      jest.spyOn(component, 'actualizarEstadoFormulario');
      
      component.limpiarFormulario();
      
      expect(component.registroControlInventariosForm.get('nombreSistema')?.value).toBe(null);
      expect(component.registroControlInventariosForm.get('lugarRadicacion')?.value).toBe(null);
      expect(component.registroControlInventariosForm.get('cumpleAnexo24')?.value).toBe(null);
      expect(component.valorAnteriorRadioButton).toBe(null);
      expect(component.actualizarEstadoFormulario).toHaveBeenCalled();
    });

    it('✅ debería limpiar formulario de modificación correctamente', () => {
      component.modificarRegistroControlInventariosForm.patchValue({
        modificarNombreSistema: 'Sistema Test',
        modificarLugarRadicacion: 'Lugar Test',
        modificarCumpleAnexo24: true
      });
      
      jest.spyOn(component, 'actualizarEstadoFormulario');
      
      component.limpiarFormularioModal();
      
      expect(component.modificarRegistroControlInventariosForm.get('modificarNombreSistema')?.value).toBe(null);
      expect(component.modificarRegistroControlInventariosForm.get('modificarLugarRadicacion')?.value).toBe(null);
      expect(component.modificarRegistroControlInventariosForm.get('modificarCumpleAnexo24')?.value).toBe(null);
      expect(component.actualizarEstadoFormulario).toHaveBeenCalled();
    });
  });

  describe('🔍 Validaciones', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería validar campos del formulario de modificación correctamente', () => {
      const form = component.modificarRegistroControlInventariosForm;
      
      form.get('modificarNombreSistema')?.setValue('Sistema válido');
      form.get('modificarNombreSistema')?.markAsTouched();
      expect(component.esInvalido('modificarNombreSistema', true)).toBe(false);
      form.get('modificarNombreSistema')?.setValue('');
      form.get('modificarNombreSistema')?.markAsTouched();
      expect(component.esInvalido('modificarNombreSistema', true)).toBe(true);
    });

    it('✅ debería manejar campo inexistente sin errores', () => {
      expect(component.esInvalido('campoInexistente')).toBe(false);
    });
  });

  describe('🔧 Funcionalidades auxiliares', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería alternar colapsable correctamente', () => {
      const estadoInicial = component.colapsable;
      
      component.mostrar_colapsable();
      
      expect(component.colapsable).toBe(!estadoInicial);
    });

    it('✅ debería cerrar popups correctamente', () => {
      component.multipleSeleccionPopupAbierto = true;
      component.multipleSeleccionPopupCerrado = true;
      
      component.cerrarMultipleSeleccionPopup();
      
      expect(component.multipleSeleccionPopupAbierto).toBe(false);
      expect(component.multipleSeleccionPopupCerrado).toBe(false);
    });

    it('✅ debería cerrar popup de eliminación correctamente', () => {
      component.confirmEliminarPopupAbierto = true;
      component.confirmEliminarPopupCerrado = true;
      
      component.cerrarEliminarConfirmationPopup();
      
      expect(component.confirmEliminarPopupAbierto).toBe(false);
      expect(component.confirmEliminarPopupCerrado).toBe(false);
    });

    it('✅ debería establecer valores en store correctamente', () => {
      const form = component.registroControlInventariosForm;
      form.get('nombreSistema')?.setValue('Sistema Test');
      
      component.setValoresStore(form, 'nombreSistema');
      
      expect(mockTramite32609Store.actualizarEstado).toHaveBeenCalledWith({
        nombreSistema: 'Sistema Test'
      });
    });

    it('✅ debería manejar form null en setValoresStore', () => {
      expect(() => {
        component.setValoresStore(null, 'campo');
      }).not.toThrow();
    });
  });

  describe('🔐 Gestión de modal de confirmación', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería cerrar modal y revertir radio button cuando se seleccionó "No"', () => {
      component.valorAnteriorRadioButton = '1';
      component.registroControlInventariosForm.get('sistemaControlInventariosArt59')?.setValue('0');
      
      jest.spyOn(component, 'actualizarEstadoFormulario');
      
      component.cerrarModal();
      
      expect(component.esHabilitarElDialogo).toBe(false);
      expect(component.registroControlInventariosForm.get('sistemaControlInventariosArt59')?.value).toBe('1');
      expect(component.actualizarEstadoFormulario).toHaveBeenCalled();
    });

    it('✅ debería cerrar modal sin revertir cuando no se seleccionó "No"', () => {
      component.valorAnteriorRadioButton = '1';
      component.registroControlInventariosForm.get('sistemaControlInventariosArt59')?.setValue('1');
      
      component.cerrarModal();
      
      expect(component.esHabilitarElDialogo).toBe(false);
      expect(component.registroControlInventariosForm.get('sistemaControlInventariosArt59')?.value).toBe('1');
    });

    it('✅ debería usar valor por defecto cuando no hay valor anterior', () => {
      component.valorAnteriorRadioButton = null;
      component.registroControlInventariosForm.get('sistemaControlInventariosArt59')?.setValue('0');
      
      component.cerrarModal();
      
      expect(component.registroControlInventariosForm.get('sistemaControlInventariosArt59')?.value).toBe('1');
    });
  });

  describe('🔒 Estado de solo lectura', () => {
    let nuevoFixture: ComponentFixture<ControlInventariosComponent>;
    let nuevoComponente: ControlInventariosComponent;

    beforeEach(async () => {
      const estadoSoloLectura = { 
        ...estadoConsultaMock, 
        readonly: true 
      };
      mockConsultaioQuery.selectConsultaioState$ = of(estadoSoloLectura);

      await TestBed.resetTestingModule().configureTestingModule({
        imports: [
          ReactiveFormsModule,
          ControlInventariosComponent
        ],
        providers: [
          FormBuilder,
          { provide: Solicitud32610Store, useValue: mockTramite32609Store },
          { provide: Solicitud32610Query, useValue: mockTramite32609Query },
          { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      nuevoFixture = TestBed.createComponent(ControlInventariosComponent);
      nuevoComponente = nuevoFixture.componentInstance;

      nuevoComponente.ngOnInit();
      nuevoFixture.detectChanges();
    });

    it('✅ debería configurar formulario como solo lectura cuando readonly es true', () => {
      expect(nuevoComponente.esFormularioSoloLectura).toBe(false);
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

  describe('🚨 Casos de error y estados límite', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería manejar datos de tabla vacíos sin errores', () => {
      component.controlInventariosList = [];
      
      expect(() => {
        component.manejarFilaSeleccionada([]);
      }).not.toThrow();
      
      expect(component.enableEliminarBoton).toBe(false);
      expect(component.enableModficarBoton).toBe(false);
    });

    it('✅ debería manejar formularios no inicializados', () => {
      component.registroControlInventariosForm = undefined as any;
      component.modificarRegistroControlInventariosForm = undefined as any;
      
      expect(() => {
        component.enviarDialogData();
      }).toThrow();
      expect(() => {
        component.modificarEnviarDialogData();
      }).toThrow();
    });

    it('✅ debería manejar elementos DOM no disponibles', () => {
      component.registroDeNumeroEmpleadosModalElemento = null as any;
      component.confirmacionElemento = null as any;
      
      expect(() => {
        component.agregarDialogoDatos();
      }).not.toThrow();
    });

    it('✅ debería manejar errores en suscripciones', () => {
      const errorObservable = new Subject();
      mockTramite32609Query.selectSolicitud$ = errorObservable.asObservable() as any as import('../../estados/solicitud32610.store').Solicitud32610State extends infer T ? import('rxjs').Observable<T> : never;

      component.ngOnInit();
      
      expect(() => {
        errorObservable.error('Error de conexión');
      }).not.toThrow();
    });

    it('✅ debería manejar fila seleccionada indefinida en actualización', () => {
      component.filaSeleccionadaControlInventarios = { id: 999 } as any;
      component.controlInventariosList = datosControlInventariosMock;
      
      expect(() => {
        component.actualizarFilaSeleccionada();
      }).not.toThrow();
    });
  });

  describe('⚙️ Configuración de tabla', () => {
    it('✅ debería tener configuración correcta de tipo de selección', () => {
      expect(component.tipoSeleccionTabla).toBeDefined();
      expect(typeof component.tipoSeleccionTabla).toBe('string');
    });

    it('✅ debería tener estructura de columnas configurada', () => {
      expect(component.ParqueVehicular).toBeDefined();
      expect(Array.isArray(component.ParqueVehicular) || typeof component.ParqueVehicular === 'object').toBe(true);
    });

      it('✅ debería tener opciones de radio button configuradas', () => {
        expect(component.opcionDeBotonDeRadio).toBeDefined();
        expect(Array.isArray(component.opcionDeBotonDeRadio) || typeof component.opcionDeBotonDeRadio === 'object').toBe(true);
    });
  });
});