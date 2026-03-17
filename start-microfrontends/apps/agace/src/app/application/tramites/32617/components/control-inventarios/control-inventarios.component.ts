import { CONTROL_INVESTARIOS_TABLA_DATOS, MENSAJE_DE_VALIDACION, NOTA, OPCIONES_DE_BOTON_DE_RADIO } from '../../enums/oea-tercerizacion-logistica-registro.enum';
import {
  CategoriaMensaje,
  InputCheckComponent,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TipoNotificacionEnum,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil} from 'rxjs';
import { Tramite32617Store, Tramites32617State } from '../../estados/tramites32617.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ControlInventariosTabla } from '../../modelos/oea-tercerizacion-logistica-registro.model';
import { Modal } from 'bootstrap';
import { Tramite32617Query } from '../../estados/tramites32617.query';

/**
 * Componente para la gestión de control de inventarios en el trámite OEA textil.
 * 
 * Este componente independiente (`standalone`) permite registrar, editar y administrar
 * la información sobre los sistemas de control de inventarios utilizados por la empresa
 * solicitante del trámite OEA textil. Incluye validación de datos, gestión de modales
 * y tabla dinámica para mostrar los sistemas registrados.
 * 
 * @component
 * @selector app-control-inventarios
 * @standalone true
 * @implements {OnInit, OnDestroy}
 * @author Equipo de desarrollo VUCEM
 * @version 1.0.0
 * @since 2024
 * 
 * @example
 * ```html
 * <app-control-inventarios></app-control-inventarios>
 * ```
 */
@Component({
  selector: 'app-control-inventarios',
  standalone: true,
  imports: [
    CommonModule,
    TablaDinamicaComponent,
    ReactiveFormsModule,
    NotificacionesComponent,
    TituloComponent,
    InputRadioComponent,
    InputCheckComponent,
  ],
  templateUrl: './control-inventarios.component.html',
  styleUrl: './control-inventarios.component.scss',
})
export class ControlInventariosComponent implements OnInit, OnDestroy {
    /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Define si el diálogo exitoso está habilitado.
   *
   * @property esHabilitarElDialogo
   * @type {boolean}
   * @default false
   */
  esHabilitarElDialogo: boolean = false;

  /**
   * Formulario reactivo para el registro de inventarios.
   */
  registroControlInventariosForm!: FormGroup;

  /**
   * Formulario reactivo para el registro de inventarios en el modal.
   *
   * Este formulario se utiliza para capturar y validar los datos del vehículo
   * cuando se abre el modal de registro.
   */
  modificarRegistroControlInventariosForm!: FormGroup;

  /**
   * Formulario para gestionar los archivos adjuntos.
   *
   * Permite capturar y validar los datos relacionados con los archivos adjuntos.
   */
  formularioArchivo!: FormGroup;

  /**
   * Tipo de selección de tabla (CHECKBOX).
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Lista de inventarios registrados.
   */
  controlInventariosList: ControlInventariosTabla[] = [] as ControlInventariosTabla[];

  /**
   * Nombre de la pestaña activa.
   */
  activeTab: string = 'parquevehicular';

  
  /**
   * Referencia al elemento modal para el registro de inventarios.
   */
  @ViewChild('registroControlInventariosModalForm') registroDeNumeroEmpleadosModalElemento!: ElementRef;

  /**
   * Referencia al elemento modal de confirmación.
   */
  @ViewChild('modalDeConfirmacion') confirmacionElemento!: ElementRef;

  /**
   * Constante para la nota de confirmación del vehículo.
   */
  CONFIRMACION_NUMEROEMPLEADOS = NOTA.CONFIRMACION_NUMEROEMPLEADOS;

  MENSAJE_DE_VALIDACION = MENSAJE_DE_VALIDACION;

 /**
   * Configuración para las columnas de la tabla de inventarios.
   */
  ParqueVehicular = CONTROL_INVESTARIOS_TABLA_DATOS;

  /**
   * Subject utilizado para rastrear la destrucción del componente.
   * Ayuda a cancelar la suscripción de observables para evitar fugas de memoria.
   */
  destroyed$: Subject<void> = new Subject();

  /**
   * Indica si el popup está abierto.
   */
  multipleSeleccionPopupAbierto: boolean = false;

  /**
   * Indica si el popup está abierto.
   */
  confirmEliminarPopupAbierto: boolean = false;

  /**
   * Notificación que se muestra al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Fila seleccionada en la tabla de mercancías.
   */
  filaSeleccionadaControlInventarios!: ControlInventariosTabla;

  /**
   * Lista de filas seleccionadas en la tabla de mercancías.
   */
  listaFilaSeleccionadaEmpleado: ControlInventariosTabla[] = [] as ControlInventariosTabla[];

  /**
   * Indica si el botón de eliminar está habilitado.
   */
  enableEliminarBoton: boolean = false;

  /**
   * Indica si un archivo está seleccionado.
   */
  enableModficarBoton: boolean = false;

  /**
   * Indica si el popup está cerrado.
   */
  confirmEliminarPopupCerrado: boolean = true;

  /**
   * Indica si se debe mostrar el modal de datos de mercancía.
   */
  mostrarModalDatosEmpleado: boolean = false;

  /**
   * Indica si el popup está cerrado.
   */
  multipleSeleccionPopupCerrado: boolean = true;

  /**
   * @property {Tramites32617State} seccionState
   * Estado actual del formulario.
   */
  public seccionState!: Tramites32617State;

  /**
   * Opciones de botón de radio.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;  

  cumpleAnexoNota = NOTA.CUMPLE_ANEXO24;
  /**
   * Indica si el formulario es colapsable.
   */
  colapsable: boolean = true;

  /**
   * Almacena el valor anterior del radio button antes de intentar seleccionar "No".
   */
  valorAnteriorRadioButton: string | null = null;

  /**
   * Indica si el radio button está seleccionado.
   * Se utiliza para habilitar o deshabilitar campos del formulario.
   */
  radioSeleccionado: boolean = false;

    /**
   * Indica si el formulario ha sido inicializado.
   * Se utiliza para evitar la recreación del formulario si ya está inicializado.
   */
  public esFormularioInicializado: boolean = false;

  /**
   * Constructor para ControlInventariosBimestreComponent.
   * Inicializa el formulario e inyecta los servicios necesarios.
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param tramite32617Store - Store para gestionar el estado relacionado con el Trámite 32617.
   */
  constructor(
    public fb: FormBuilder,
    private tramite32617Store: Tramite32617Store,
    private tramite32617Query: Tramite32617Query,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.crearFormulario();
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
       if (this.registroControlInventariosForm && this.esFormularioInicializado) {
           this.actualizarEstadoCampos();
           this.actualizarEstadoFormulario();
         }
      })
    )
    .subscribe();
  }

  /**
   * Método del ciclo de vida que se ejecuta cuando el componente se inicializa.
   * - Se suscribe a `selectTramite32617$` para obtener datos del estado.
   * - Actualiza `seccionState` con la información más reciente del estado.
   * - Asigna `ControlInventariosTablaDatos` a `controlInventariosList`.
   *
   * La suscripción está gestionada con `takeUntil(this.destroyed$)`
   * para garantizar la limpieza cuando el componente se destruye.
   */
  ngOnInit(): void {
    this.tramite32617Query.selectTramite32617$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: Tramites32617State) => {
        this.seccionState = datos;
      });

    this.controlInventariosList = this.seccionState.controlInventarios;
    
    // Inicializar el valor anterior si ya hay un valor válido en el formulario
    const VALOR_INICIAL = this.registroControlInventariosForm.get('sistemaControlInventariosArt59')?.value;
    if (VALOR_INICIAL && VALOR_INICIAL === '1') {
      this.valorAnteriorRadioButton = '1';
    }
    
    // Actualizar el estado del formulario al inicializar
    this.actualizarFormularioConDatosDelEstado();
  }

  /**
   * Crea el formulario reactivo para el registro de inventarios.
   */
  crearFormulario(): void {
    this.registroControlInventariosForm = this.fb.group({
      id: [null],
      sistemaControlInventariosArt59: ['', [Validators.required]],
      nombreSistema: [{value: '', disabled: true}, [Validators.required]],
      lugarRadicacion: [{value: '', disabled: true}, Validators.required],
      cumpleAnexo24: [false],
    });

    this.modificarRegistroControlInventariosForm = this.fb.group({
      id: [null],
      modificarNombreSistema: ['', Validators.required],
      modificarLugarRadicacion: ['', Validators.required],
      modificarCumpleAnexo24: [false],
    });
    this.esFormularioInicializado = true;
  }

  /**
   * Método del ciclo de vida que se ejecuta cuando el componente se destruye.
   * Limpia las suscripciones y libera recursos.
   */
  private actualizarFormularioConDatosDelEstado(): void {
    if (this.registroControlInventariosForm && this.seccionState && this.esFormularioInicializado) {
      this.actualizarEstadoFormulario();
      const STATEVALOR = {
        sistemaControlInventariosArt59: this.seccionState.sistemaControlInventariosArt59,
      };

      this.registroControlInventariosForm.patchValue(STATEVALOR);
    }
  }

  /**
   * Envía los datos del formulario y muestra el modal de confirmación.
   * Si el formulario es inválido, marca todos los campos como tocados.
   */
  enviarDialogData(): void {
    if (this.registroControlInventariosForm.valid) {
      this.enNuevaNotificacion(this.CONFIRMACION_NUMEROEMPLEADOS);
       this.esHabilitarElDialogo = true;
      this.ControlInventariosInfoDatos();
      // Limpiar el formulario después de enviar los datos
      this.limpiarFormulario();
    } else {
      this.enNuevaNotificacion(this.MENSAJE_DE_VALIDACION);
      this.esHabilitarElDialogo = true;
      this.registroControlInventariosForm.markAllAsTouched();
    }
  }

  /**
   * Envía los datos del formulario y muestra el modal de confirmación.
   */
  enNuevaNotificacion(datos:string):void {
     this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: datos,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
  }


  /**
   * Agrega los datos actuales del formulario a la lista de inventarios registrados.
   * Los datos del formulario se añaden al array `controlInventariosList`.
   * @param useModalForm - Indica si debe usar el formulario del modal o el formulario principal
   */
  ControlInventariosInfoDatos(useModalForm: boolean = false): void {
    let nombreSistema: string;
    let lugarRadicacion: string;
    let cumpleAnexo24: boolean;

    if (useModalForm) {
      // Usar datos del formulario del modal
      const VALOR_FORMULARIO_MODAL = this.modificarRegistroControlInventariosForm.value;
      nombreSistema = VALOR_FORMULARIO_MODAL.modificarNombreSistema;
      lugarRadicacion = VALOR_FORMULARIO_MODAL.modificarLugarRadicacion;
      cumpleAnexo24 = VALOR_FORMULARIO_MODAL.modificarCumpleAnexo24;
    } else {
      // Usar datos del formulario principal
      const VALOR_PRINCIPAL_FORMULARIO = this.registroControlInventariosForm.value;
      nombreSistema = VALOR_PRINCIPAL_FORMULARIO.nombreSistema;
      lugarRadicacion = VALOR_PRINCIPAL_FORMULARIO.lugarRadicacion;
      cumpleAnexo24 = VALOR_PRINCIPAL_FORMULARIO.cumpleAnexo24;
    }

    if (
      !this.filaSeleccionadaControlInventarios ||
      Object.keys(this.filaSeleccionadaControlInventarios).length === 0
    ) {
      // Agregar nuevo registro
      const ID = this.controlInventariosList.length
        ? this.controlInventariosList[this.controlInventariosList.length - 1]?.id + 1
        : 1;

      const OBJETO = { 
        id: ID, 
        nombreSistema: nombreSistema, 
        lugarRadicacion: lugarRadicacion, 
        cumpleAnexo24: cumpleAnexo24 
      } as ControlInventariosTabla;

      this.controlInventariosList = [...this.controlInventariosList, OBJETO];
      this.tramite32617Store.establecerDatos({controlInventarios:this.controlInventariosList});
    } else {
      // Actualizar registro existente
      this.controlInventariosList = this.controlInventariosList.map((elemento) =>
        elemento.id === this.filaSeleccionadaControlInventarios.id
          ? { ...elemento, nombreSistema: nombreSistema, lugarRadicacion: lugarRadicacion, cumpleAnexo24: cumpleAnexo24 }
          : elemento
      );

      this.tramite32617Store.establecerDatos({controlInventarios:this.controlInventariosList});
      this.filaSeleccionadaControlInventarios = {} as ControlInventariosTabla;
    }
  }

  /**
   * Envía los datos del formulario del modal y muestra el modal de confirmación.
   * Si el formulario es inválido, marca todos los campos como tocados.
   */
  modificarEnviarDialogData(): void {
    if (this.modificarRegistroControlInventariosForm.valid) {
      this.enNuevaNotificacion(this.CONFIRMACION_NUMEROEMPLEADOS);
       this.esHabilitarElDialogo = true;
      this.ControlInventariosInfoDatos(true); // Usar el formulario del modal
      // Limpiar el formulario del modal después de enviar los datos
      this.limpiarFormularioModal();
      this.cambiarEstadoModal();
    } else {
      this.enNuevaNotificacion(this.MENSAJE_DE_VALIDACION);
      this.esHabilitarElDialogo = true;
      this.modificarRegistroControlInventariosForm.markAllAsTouched();
    }
  }
  /**
   * Método para cerrar el modal de confirmación.
   * También resetea el radio button cuando se cierra el modal después de intentar seleccionar "No".
   * @returns {void}
   */
  cerrarModal(): void {
    this.esHabilitarElDialogo = false;
    // Reset el radio button cuando se cierra el modal después de seleccionar "No"
    if (this.registroControlInventariosForm.get('sistemaControlInventariosArt59')?.value === '0') {
      // Revertir al valor anterior si existía, de lo contrario dejar como null
      const VALOR_A_RESTAURAR = this.valorAnteriorRadioButton || '1';
      this.registroControlInventariosForm.get('sistemaControlInventariosArt59')?.setValue(VALOR_A_RESTAURAR);
    }
    
    // Actualizar el estado del formulario después de cerrar el modal
    this.actualizarEstadoFormulario();
  }

  /**
   * Maneja la fila seleccionada en la tabla de mercancías.
   * fila Fila seleccionada.
   */
  manejarFilaSeleccionada(fila: ControlInventariosTabla[]): void {
    this.listaFilaSeleccionadaEmpleado = fila;
      if (fila.length === 0) {
      this.filaSeleccionadaControlInventarios = {} as ControlInventariosTabla;
      this.enableModficarBoton = false;
      this.enableEliminarBoton = false;
      return;
    }
  this.filaSeleccionadaControlInventarios = fila[fila.length - 1];
  }
  

  /**
   * Actualiza la fila seleccionada con los datos más recientes de la tabla.
   */
  actualizarFilaSeleccionada(): void {
    const DATOS_ACTUALIZADOS = this.controlInventariosList.find(
      (item) => item.id === this.filaSeleccionadaControlInventarios.id
    );

    if (DATOS_ACTUALIZADOS) {
      this.filaSeleccionadaControlInventarios = { ...DATOS_ACTUALIZADOS };
    }
  }

  /**
   * Filtra y elimina los elementos seleccionados de la tabla de mercancías.
   * Actualiza el estado del almacén y cierra el popup de confirmación de eliminación.
   */
  eliminarEmpleadoItem(evento:boolean): void {
    if(evento === true) {
      const IDS_TO_DELETE = this.listaFilaSeleccionadaEmpleado.map(
        (item) => item.id
      );

      this.controlInventariosList = this.controlInventariosList.filter(
        (item) => !IDS_TO_DELETE.includes(item.id)
      );

      this.listaFilaSeleccionadaEmpleado = [];
      this.filaSeleccionadaControlInventarios = {} as ControlInventariosTabla;
      this.tramite32617Store.establecerDatos({controlInventarios:this.controlInventariosList});
      this.cerrarEliminarConfirmationPopup();
    }
  }

  /**
   * Cierra el popup de confirmación de eliminación.
   */
  cerrarEliminarConfirmationPopup(): void {
    this.confirmEliminarPopupAbierto = false;
    this.confirmEliminarPopupCerrado = false;
  }

  /**
   * Modifica los datos de una fila seleccionada en la tabla de mercancías.
   * Actualiza el formulario de mercancía con los datos de la fila seleccionada
   * y abre el modal para editar los datos.
   */
  modificarItemEmpleado(): void {
    const SELECCIONADAS = this.listaFilaSeleccionadaEmpleado;
    if(this.controlInventariosList.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: 'No se encontró información',
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      this.multipleSeleccionPopupAbierto = true;
      return;
    }
    if (!SELECCIONADAS || SELECCIONADAS.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: 'Selecciona un registro',
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      this.multipleSeleccionPopupAbierto = true;
      return;
    }
  
    if (SELECCIONADAS.length > 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: 'Selecciona sólo un registro para modificar.',
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      this.multipleSeleccionPopupAbierto = true;
      return;
    }
    this.actualizarFilaSeleccionada();
    this.agregarDialogoDatos();
    this.patchModifyiedData();
  }
  


    /**
   * Abre el cuadro de diálogo modal para el registro de inventarios.
   */
  agregarDialogoDatos(): void {
    if (this.registroDeNumeroEmpleadosModalElemento) {
      const MODAL_INSTANCIA = new Modal(
        this.registroDeNumeroEmpleadosModalElemento?.nativeElement,
        { backdrop: false }
      );
      MODAL_INSTANCIA.show();
    }
  }


  /**
   * @method patchModifyiedData
   * Rellena el formulario con los datos de la fila seleccionada para su modificación.
   * Este método utiliza `patchValue` para actualizar los valores del formulario.
   */
  patchModifyiedData(): void {
    this.modificarRegistroControlInventariosForm.patchValue({
      id: this.filaSeleccionadaControlInventarios?.id,
      modificarNombreSistema: this.filaSeleccionadaControlInventarios?.nombreSistema,
      modificarLugarRadicacion: this.filaSeleccionadaControlInventarios?.lugarRadicacion,
      modificarCumpleAnexo24: this.filaSeleccionadaControlInventarios?.cumpleAnexo24,
    });
    
    // Almacenar el valor actual del radio button como valor anterior para poder revertir
    const VALOR_ACTUAL = this.registroControlInventariosForm.get('sistemaControlInventariosArt59')?.value;
    if (VALOR_ACTUAL && VALOR_ACTUAL !== '0') {
      this.valorAnteriorRadioButton = VALOR_ACTUAL;
    }
    
    // Actualizar el estado del formulario después de hacer patch
    this.actualizarEstadoFormulario();
  }

  /**
   * @method abrirMultipleSeleccionPopup
   * Muestra un popup de error si se seleccionan múltiples filas para modificar.
   * Este método se activa cuando el botón de modificar está habilitado.
   */
  abrirMultipleSeleccionPopup(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'Selecciona sólo un registro para modificar.',
      cerrar: false,
      txtBtnAceptar: 'Cerrar',
      txtBtnCancelar: '',
    };
    this.multipleSeleccionPopupAbierto = true;
  }

  /**
   * Confirma la eliminación de los elementos seleccionados en la tabla de mercancías.
   * Si no hay elementos seleccionados, no realiza ninguna acción.
   * Si hay elementos seleccionados, abre el popup de confirmación de eliminación.
   */
  confirmEliminarEmpleadoItem(): void {
    if(this.controlInventariosList.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: 'No se encontró información',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.multipleSeleccionPopupAbierto = true;
      return;
    }
    if (this.listaFilaSeleccionadaEmpleado.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: 'Debes seleccionar al menos un registro para eliminar.',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.multipleSeleccionPopupAbierto = true;
      return;
    }
    this.abrirElimninarConfirmationopup();
  }
  /**
   * @method abrirElimninarConfirmationopup
   * Abre un popup de confirmación para eliminar los registros seleccionados.
   * Si no hay registros seleccionados, no realiza ninguna acción.
   */
  abrirElimninarConfirmationopup(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ERROR,
      modo: 'modal',
      titulo: '',
      mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
    this.confirmEliminarPopupAbierto = true;
  }

  /**
   * Cierra el popup de selección múltiple.
   */
  cerrarMultipleSeleccionPopup(): void {
    this.multipleSeleccionPopupAbierto = false;
    this.multipleSeleccionPopupCerrado = false;
  }
  
  /**
   * Actualiza el estado de los campos del formulario según la selección del radio button.
   * Habilita o deshabilita los campos según la opción seleccionada.
   */
  actualizarEstadoFormulario(): void {
    const SISTEMA_CONTROL = this.registroControlInventariosForm.get('sistemaControlInventariosArt59')?.value;
    
    // Campos del formulario principal
    const NOMBRE_SISTEMA = this.registroControlInventariosForm.get('nombreSistema');
    const LUGAR_RADICACION = this.registroControlInventariosForm.get('lugarRadicacion');
    
    if ((SISTEMA_CONTROL === '1' || SISTEMA_CONTROL === 1) && this.esFormularioSoloLectura === false) {
      // Habilitar campos cuando se selecciona "Sí"
      this.radioSeleccionado = true;
      
      // Habilitar campos del formulario principal
      NOMBRE_SISTEMA?.enable();
      LUGAR_RADICACION?.enable();
      
    } else {
      // Deshabilitar campos cuando se selecciona "No" o no hay selección
      this.radioSeleccionado = false;
      
      // Deshabilitar campos del formulario principal
      NOMBRE_SISTEMA?.disable();
      LUGAR_RADICACION?.disable();
    }
  }


  
  /**
   * Habilita o deshabilita dinámicamente los campos 'motivoRenunciaDeDerechos' y 'mercacniaSolicitudControlar'
   * según el estado de solo lectura del formulario.
   *
   * @returns void
   * @description Si el formulario está en modo solo lectura, deshabilita ambos campos; de lo contrario, los habilita.
   */
  actualizarEstadoCampos(): void {
    if (!this.registroControlInventariosForm) {
      return;
    }

    const CAMPOS = ["sistemaControlInventariosArt59"];
    CAMPOS.forEach(campo => {
      const CONTROL = this.registroControlInventariosForm.get(campo);
      if (CONTROL) {
        if (this.esFormularioSoloLectura) {
          CONTROL.disable();
        } else {
          CONTROL.enable();
        }
      }
    });
  }


  /**
   * Verifica si un control de formulario es inválido, está tocado o ha sido modificado.
   * Solo valida campos que están habilitados.
   * @param nombreControl - El nombre del control de formulario a verificar.
   * @returns Verdadero si el control es inválido, de lo contrario, falso.
   */
  public esInvalido(nombreControl: string, useModalForm: boolean = false): boolean {
    const FORM = useModalForm ? this.modificarRegistroControlInventariosForm : this.registroControlInventariosForm;
    const CONTROL = FORM.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * Restablece el formulario de registro de inventarios a su estado inicial.
   */
  limpiarFormulario(): void {
    this.registroControlInventariosForm.get('nombreSistema')?.reset();
    this.registroControlInventariosForm.get('lugarRadicacion')?.reset();
    this.registroControlInventariosForm.get('cumpleAnexo24')?.reset();
    // También resetear el valor anterior almacenado
    this.valorAnteriorRadioButton = null;
    
    // Actualizar el estado del formulario después de limpiar
    this.actualizarEstadoFormulario();
  }

  /**
   * Restablece el formulario del modal a su estado inicial.
   */
  limpiarFormularioModal(): void {
    this.modificarRegistroControlInventariosForm.reset();
    
    // Actualizar el estado del formulario después de limpiar
    this.actualizarEstadoFormulario();
  }
  
  /**
   * Método que se ejecuta cuando se selecciona una opción del botón de radio.
   * Habilita o deshabilita el diálogo de confirmación según la opción seleccionada.
   * @param {string, number} evento - El evento del cambio de valor del botón de radio.
   */
  onSeleccionfalsa(evento:string | number): void {
    if (evento && (evento === '0' || evento === 0)) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: 'Debe agregar por lo menos un control de inventarios.',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-md',
      };
      this.esHabilitarElDialogo = true;
    } else {
      this.esHabilitarElDialogo = false;
      // Almacenar el valor válido para futuras reversiones
      if (evento && (evento === '1' || evento === 1)) {
        this.valorAnteriorRadioButton = '1';
      }
    }
    
    if (evento && (evento === '1' || evento === 1)) {
      this.radioSeleccionado = true;
      // Habilitar campos del formulario principal
      this.registroControlInventariosForm.get('nombreSistema')?.enable();
      this.registroControlInventariosForm.get('lugarRadicacion')?.enable();
    } else {
      this.radioSeleccionado = false;
      // Deshabilitar campos del formulario principal
      this.registroControlInventariosForm.get('nombreSistema')?.disable();
      this.registroControlInventariosForm.get('lugarRadicacion')?.disable();
    }
  }

  /**
   * Pasa el valor de un campo del formulario a la tienda para la gestión del estado.
   * @param form - El formulario reactivo.
   * @param campo - El nombre del campo en el formulario.
   */
  setValoresStore(form: FormGroup | null, campo: string): void {
    if (!form) {
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
      this.tramite32617Store.establecerDatos({ [campo]: CONTROL.value });
    }
  }

   /**
     * Cancela el cuadro de diálogo modal para el registro de inventarios.
     * Este método oculta el modal y restablece el formulario.
     */
    modalCancelar(): void {
      this.cambiarEstadoModal();
    }
  
    /**
     * Alterna la visibilidad del cuadro de diálogo modal para el registro de inventarios.
     * Si el modal está visible actualmente, se ocultará.
     */
    cambiarEstadoModal(): void {
      const MODAL_INSTANCIA = Modal.getInstance(
        this.registroDeNumeroEmpleadosModalElemento.nativeElement
      );
      if (MODAL_INSTANCIA) {
        MODAL_INSTANCIA.hide();
      }
    }

   /**
   * Método para mostrar u ocultar el formulario colapsable.
   * Cambia el estado de la variable `colapsable`.
   */
  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }
  /**
   * @method ngOnDestroy
   * Hook de ciclo de vida que se ejecuta al destruir el componente.
   * Libera recursos y suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * @method validarFormularios
   * Método público que valida todos los formularios del componente.
   * Este método puede ser llamado desde el componente padre para triggear validación.
   * 
   * @returns {void}
   */
  public validarFormularios(): boolean {
    // Validar formulario principal de registro
    if (this.registroControlInventariosForm) {
      this.registroControlInventariosForm.markAllAsTouched();
      return this.registroControlInventariosForm.valid;
    }
    return false;
  }
}
