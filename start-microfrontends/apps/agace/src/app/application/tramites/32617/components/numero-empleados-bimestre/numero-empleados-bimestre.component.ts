import {
  Catalogo,
  CatalogoSelectComponent,
  CategoriaMensaje,
  Notificacion,
  NotificacionesComponent,
  REGEX_RFC,
  REG_X,
  SoloLetrasNumerosDirective,
  TablaDinamicaComponent,
  TablaSeleccion,
  TipoNotificacionEnum,
} from '@libs/shared/data-access-user/src';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MENSAJE_DE_VALIDACION, NOTA, NUMERO_EMPLEADOS_TABLA_DATOS } from '../../enums/oea-tercerizacion-logistica-registro.enum';
import { Subject, map, takeUntil} from 'rxjs';
import { Tramite32617Store, Tramites32617State } from '../../estados/tramites32617.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';
import { NumeroEmpleadosTabla } from '../../modelos/oea-tercerizacion-logistica-registro.model';
import { OeaTercerizacionLogisticaRegistroService } from '../../services/oea-tercerizacion-logistica-registro.service';
import { Tramite32617Query } from '../../estados/tramites32617.query';


/**
 * Componente para la gestión del número de empleados por bimestre en el trámite OEA textil.
 * 
 * Este componente independiente (`standalone`) permite registrar, editar y eliminar
 * información sobre el número de empleados por bimestre de empresas relacionadas
 * con el solicitante del trámite OEA textil. Incluye validación de RFC,
 * gestión de modales y tabla dinámica interactiva.
 * 
 * @component
 * @selector app-numero-empleados-bimestre
 * @standalone true
 * @implements {OnInit, OnDestroy}
 * @author Equipo de desarrollo VUCEM
 * @version 1.0.0
 * @since 2024
 * 
 * @example
 * ```html
 * <app-numero-empleados-bimestre></app-numero-empleados-bimestre>
 * ```
 */
@Component({
  selector: 'app-numero-empleados-bimestre',
  standalone: true,
  imports: [
    CommonModule,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    NotificacionesComponent,
    SoloLetrasNumerosDirective
  ],
  templateUrl: './numero-empleados-bimestre.component.html',
  styleUrl: './numero-empleados-bimestre.component.scss',
})
export class NumeroEmpleadosBimestreComponent implements OnInit, OnDestroy {
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
   * Formulario reactivo para el registro de vehículos.
   */
  registroNumeroEmpleadosForm!: FormGroup;

  /**
   * Formulario para gestionar los archivos adjuntos.
   *
   * Permite capturar y validar los datos relacionados con los archivos adjuntos.
   */
  formularioArchivo!: FormGroup;

  /**
   * Formulario para capturar el RFC.
   *
   * Este formulario es utilizado para validar y capturar el RFC del usuario.
   */
  rfcForm!: FormGroup;

  /**
   * Tipo de selección de tabla (CHECKBOX).
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Lista de vehículos registrados.
   */
  numeroEmpleadosBimestreList: NumeroEmpleadosTabla[] = [] as NumeroEmpleadosTabla[];

  /**
   * Nombre de la pestaña activa.
   */
  activeTab: string = 'parquevehicular';

  /**
   * Referencia al elemento modal para el registro de vehículos.
   */
  @ViewChild('registroDeNumeroEmpleados') registroDeNumeroEmpleadosElemento!: ElementRef;

  /**
   * Referencia al elemento modal de confirmación.
   */
  @ViewChild('modalDeConfirmacion') confirmacionElemento!: ElementRef;

  /**
   * Constante para la nota de confirmación del registro de empleados.
   * 
   * @type {string}
   * @readonly
   */
  CONFIRMACION_NUMEROEMPLEADOS = NOTA.CONFIRMACION_NUMEROEMPLEADOS;

  /**
   * Mensajes de validación para mostrar al usuario.
   * 
   * @type {object}
   * @readonly
   */
  MENSAJE_DE_VALIDACION = MENSAJE_DE_VALIDACION;

 /**
   * Configuración para las columnas de la tabla de empleados por bimestre.
   * 
   * @type {object}
   * @readonly
   */
  ParqueVehicular = NUMERO_EMPLEADOS_TABLA_DATOS;

  /**
   * Subject utilizado para rastrear la destrucción del componente.
   * Ayuda a cancelar la suscripción de observables para evitar fugas de memoria.
   * 
   * @type {Subject<void>}
   */
  destroyed$: Subject<void> = new Subject();

  /**
   * Indica si el popup de selección múltiple está abierto.
   * 
   * @type {boolean}
   * @default false
   */
  multipleSeleccionPopupAbierto: boolean = false;

  /**
   * Indica si el popup de confirmación de eliminación está abierto.
   * 
   * @type {boolean}
   * @default false
   */
  confirmEliminarPopupAbierto: boolean = false;

  /**
   * Notificación que se muestra al usuario.
   * 
   * @type {Notificacion}
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Fila seleccionada en la tabla de empleados por bimestre.
   * 
   * @type {NumeroEmpleadosTabla}
   */
  filaSeleccionadaNumeroEmpleados!: NumeroEmpleadosTabla;

  /**
   * Lista de filas seleccionadas en la tabla de empleados por bimestre.
   * 
   * @type {NumeroEmpleadosTabla[]}
   * @default []
   */
  listaFilaSeleccionadaEmpleado: NumeroEmpleadosTabla[] = [] as NumeroEmpleadosTabla[];

  /**
   * Indica si el botón de eliminar está habilitado.
   * 
   * @type {boolean}
   * @default false
   */
  enableEliminarBoton: boolean = false;

  /**
   * Indica si el botón de modificar está habilitado.
   * 
   * @type {boolean}
   * @default false
   */
  enableModficarBoton: boolean = false;

  /**
   * Indica si el popup de confirmación de eliminación está cerrado.
   * 
   * @type {boolean}
   * @default true
   */
  confirmEliminarPopupCerrado: boolean = true;

  /**
   * Indica si se debe mostrar el modal de datos de empleado.
   * 
   * @type {boolean}
   * @default false
   */
  mostrarModalDatosEmpleado: boolean = false;

  /**
   * Indica si el popup de selección múltiple está cerrado.
   * 
   * @type {boolean}
   * @default true
   */
  multipleSeleccionPopupCerrado: boolean = true;

  /**
   * @property {Tramites32617State} seccionState
   * Estado actual del formulario.
   */
  public seccionState!: Tramites32617State;

   /**
     * Lista de bimestres.
     */
    @Input() bimestreList!: Catalogo[];

  /**
   * Indica si el formulario es colapsable.
   */
  colapsable: boolean = true;

  /**
   * Constructor del componente NumeroEmpleadosBimestreComponent.
   * 
   * Inicializa las dependencias necesarias y configura las suscripciones
   * para el manejo del estado del componente y formularios reactivos.
   * También configura la suscripción para el estado de solo lectura.
   * 
   * @param {FormBuilder} fb - Servicio para crear formularios reactivos
   * @param {Tramite32617Store} tramite32617Store - Store para gestionar el estado del trámite
   * @param {Tramite32617Query} tramite32617Query - Query para obtener datos del trámite
   * @param {ConsultaioQuery} consultaioQuery - Query para obtener el estado de consulta
   * @param {OeaTextilRegistroService} servicio - Servicio para operaciones del trámite OEA textil
   */
  constructor(
    public fb: FormBuilder,
    private tramite32617Store: Tramite32617Store,
    private tramite32617Query: Tramite32617Query,
    private consultaioQuery: ConsultaioQuery,
    private servicio: OeaTercerizacionLogisticaRegistroService
  ) {
      this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
      })
    )
    .subscribe();
    this.crearFormulario();
  }

  /**
   * Método del ciclo de vida que se ejecuta cuando el componente se inicializa.
   * - Se suscribe a `selectTramite32617$` para obtener datos del estado.
   * - Actualiza `seccionState` con la información más reciente del estado.
   * - Asigna `NumeroEmpleadosTablaDatos` a `numeroEmpleadosBimestreList`.
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

    this.numeroEmpleadosBimestreList = this.seccionState.numeroEmpleadosBimestre;
  }

  /**
   * @method crearFormulario
   * Crea y configura los formularios reactivos necesarios para el componente.
   * 
   * Inicializa dos formularios:
   * - rfcForm: Para capturar y validar el RFC
   * - registroNumeroEmpleadosForm: Para registrar datos completos de empleados
   * 
   * @returns {void}
   */
  crearFormulario(): void {

    this.rfcForm = this.fb.group({
      rfcInput: ['', [Validators.required, Validators.pattern(REGEX_RFC)]]
    });

    this.registroNumeroEmpleadosForm = this.fb.group({
      id: [null],
      rfc: ['', [Validators.required, Validators.pattern(REGEX_RFC)]],
      denominacionSocial: ['', Validators.required],
      numeroDeEmpleados: ['', [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)]],
      bimestre: [null, Validators.required]
    });
  }


  /**
   * @method agregarDialogoDatos
   * Abre el modal para el registro de empleados por bimestre.
   * 
   * Utiliza Bootstrap Modal para mostrar el formulario de registro.
   * Verifica que el elemento del modal exista antes de intentar mostrarlo.
   * 
   * @returns {void}
   */
  agregarDialogoDatos(): void {
    if (this.registroDeNumeroEmpleadosElemento) {
      const MODAL_INSTANCIA = new Modal(
        this.registroDeNumeroEmpleadosElemento?.nativeElement,
        { backdrop: false }
      );
      MODAL_INSTANCIA.show();
    }
  }

  /**
   * @method enviarDialogData
   * Procesa y envía los datos del formulario de empleados.
   * 
   * Valida el formulario y procede según el resultado:
   * - Si es válido: muestra confirmación, procesa datos y resetea formulario
   * - Si es inválido: muestra mensaje de validación y marca campos como tocados
   * 
   * @returns {void}
   */
  enviarDialogData(): void {
    if (this.registroNumeroEmpleadosForm.valid) {
      this.enNuevaNotificacion(this.CONFIRMACION_NUMEROEMPLEADOS);
       this.esHabilitarElDialogo = true;
      this.NumeroEmpleadosInfoDatos();
      this.registroNumeroEmpleadosForm.reset();
      this.cambiarEstadoModal();
    } else {
      this.enNuevaNotificacion(this.MENSAJE_DE_VALIDACION);
      this.esHabilitarElDialogo = true;
      this.registroNumeroEmpleadosForm.markAllAsTouched();
    }
  }

  /**
   * @method enNuevaNotificacion
   * Crea y configura una nueva notificación para mostrar al usuario.
   * 
   * Configura los parámetros de la notificación incluyendo tipo, categoría,
   * modo de visualización y mensaje a mostrar.
   * 
   * @param {string} datos - El mensaje que se mostrará en la notificación
   * @returns {void}
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
   * @method modalCancelar
   * Cancela el cuadro de diálogo modal para el registro de vehículos.
   * 
   * Este método oculta el modal y restablece el formulario a su estado inicial.
   * Utiliza el método cambiarEstadoModal para gestionar la visibilidad.
   * 
   * @returns {void}
   */
  modalCancelar(): void {
    this.cambiarEstadoModal();
  }

  /**
   * @method cambiarEstadoModal
   * Alterna la visibilidad del cuadro de diálogo modal para el registro de vehículos.
   * 
   * Si el modal está visible actualmente, se ocultará utilizando la instancia de Bootstrap Modal.
   * Gestiona el estado del modal de forma segura verificando la existencia de la instancia.
   * 
   * @returns {void}
   */
  cambiarEstadoModal(): void {
    const MODAL_INSTANCIA = Modal.getInstance(
      this.registroDeNumeroEmpleadosElemento.nativeElement
    );
    if (MODAL_INSTANCIA) {
      MODAL_INSTANCIA.hide();
    }
  }

  /**
   * @method NumeroEmpleadosInfoDatos
   * Agrega los datos actuales del formulario a la lista de vehículos registrados.
   * 
   * Los datos del formulario se añaden al array `numeroEmpleadosBimestreList` después
   * de procesar y validar la información de empleados por bimestre.
   * 
   * @returns {void}
   */
  NumeroEmpleadosInfoDatos(): void {
    const OBTENER_DESCRIPCION = (array: Catalogo[], index: number): string =>
      array[index - 1]?.descripcion || '';

    const {
      denominacionSocial: DENOMINACION_SOCIAL,
      rfc: RFC,
      numeroDeEmpleados: NUMERO_DE_EMPLEADOS,
      numeroUno: NUMERO_UNO,
      bimestre: BIMESTRE,
    } = this.registroNumeroEmpleadosForm.value;

    const SELECTEDBIMESTRE= OBTENER_DESCRIPCION(
        this.bimestreList,
        BIMESTRE
      );
    

    if (
      !this.filaSeleccionadaNumeroEmpleados ||
      Object.keys(this.filaSeleccionadaNumeroEmpleados).length === 0
    ) {
      const ID = this.numeroEmpleadosBimestreList.length
        ? this.numeroEmpleadosBimestreList[this.numeroEmpleadosBimestreList.length - 1]?.id + 1
        : 1;

      const OBJETO = { id: ID, denominacionSocial: DENOMINACION_SOCIAL, rfc: RFC, numeroDeEmpleados: NUMERO_DE_EMPLEADOS, numeroUno: NUMERO_UNO, bimestre: SELECTEDBIMESTRE } as NumeroEmpleadosTabla;

      this.numeroEmpleadosBimestreList = [...this.numeroEmpleadosBimestreList, OBJETO];
      this.tramite32617Store.establecerDatos({numeroEmpleadosBimestre:this.numeroEmpleadosBimestreList});
    } else {
      this.numeroEmpleadosBimestreList = this.numeroEmpleadosBimestreList.map((elemento) =>
        elemento.id === this.filaSeleccionadaNumeroEmpleados.id
          ? { ...elemento, denominacionSocial: DENOMINACION_SOCIAL, rfc: RFC, numeroDeEmpleados: NUMERO_DE_EMPLEADOS, numeroUno: NUMERO_UNO, bimestre: SELECTEDBIMESTRE }
          : elemento
      );

      this.tramite32617Store.establecerDatos({numeroEmpleadosBimestre:this.numeroEmpleadosBimestreList});
      this.filaSeleccionadaNumeroEmpleados = {} as NumeroEmpleadosTabla;
    }
  }
  /**
   * @method cerrarModal
   * Método para cerrar el modal de confirmación.
   * 
   * Desactiva el estado del diálogo para ocultar la ventana modal
   * de confirmación actualmente visible.
   * 
   * @returns {void}
   */
  cerrarModal(): void {
    this.esHabilitarElDialogo = false;
  }

  /**
   * @method manejarFilaSeleccionada
   * Maneja la fila seleccionada en la tabla de mercancías.
   * 
   * Actualiza el estado de los botones de modificar y eliminar según
   * la selección de filas en la tabla de empleados.
   * 
   * @param {NumeroEmpleadosTabla[]} fila - Fila seleccionada en la tabla
   * @returns {void}
   */
  manejarFilaSeleccionada(fila: NumeroEmpleadosTabla[]): void {
    this.listaFilaSeleccionadaEmpleado = fila;
      if (fila.length === 0) {
      this.filaSeleccionadaNumeroEmpleados = {} as NumeroEmpleadosTabla;
      this.enableModficarBoton = false;
      this.enableEliminarBoton = false;
      return;
    }
  this.filaSeleccionadaNumeroEmpleados = fila[fila.length - 1];
  }
  

  /**
   * @method actualizarFilaSeleccionada
   * Actualiza la fila seleccionada con los datos más recientes de la tabla.
   * 
   * Busca en la lista de empleados el elemento que coincida con el ID de la fila
   * seleccionada y actualiza la referencia con los datos más recientes.
   * 
   * @returns {void}
   */
  actualizarFilaSeleccionada(): void {
    const DATOS_ACTUALIZADOS = this.numeroEmpleadosBimestreList.find(
      (item) => item.id === this.filaSeleccionadaNumeroEmpleados.id
    );

    if (DATOS_ACTUALIZADOS) {
      this.filaSeleccionadaNumeroEmpleados = { ...DATOS_ACTUALIZADOS };
    }
  }

  /**
   * @method eliminarEmpleadoItem
   * Filtra y elimina los elementos seleccionados de la tabla de mercancías.
   * 
   * Actualiza el estado del almacén y cierra el popup de confirmación de eliminación.
   * Los elementos se eliminan basándose en los IDs de la lista de filas seleccionadas.
   * 
   * @param {boolean} evento - Confirmación de eliminación del usuario
   * @returns {void}
   */
  eliminarEmpleadoItem(evento:boolean): void {
    if(evento === true) {
      const IDS_TO_DELETE = this.listaFilaSeleccionadaEmpleado.map(
        (item) => item.id
      );

      this.numeroEmpleadosBimestreList = this.numeroEmpleadosBimestreList.filter(
        (item) => !IDS_TO_DELETE.includes(item.id)
      );

      this.listaFilaSeleccionadaEmpleado = [];
      this.filaSeleccionadaNumeroEmpleados = {} as NumeroEmpleadosTabla;
      this.tramite32617Store.establecerDatos({numeroEmpleadosBimestre:this.numeroEmpleadosBimestreList});
      this.cerrarEliminarConfirmationPopup();
    }
  }

  /**
   * @method cerrarEliminarConfirmationPopup
   * Cierra el popup de confirmación de eliminación.
   * 
   * Restablece los estados de apertura y cierre del popup de confirmación
   * para eliminar elementos de la tabla.
   * 
   * @returns {void}
   */
  cerrarEliminarConfirmationPopup(): void {
    this.confirmEliminarPopupAbierto = false;
    this.confirmEliminarPopupCerrado = false;
  }

  /**
   * @method modificarItemEmpleado
   * Modifica los datos de una fila seleccionada en la tabla de mercancías.
   * 
   * Actualiza el formulario de mercancía con los datos de la fila seleccionada
   * y abre el modal para editar los datos del empleado.
   * 
   * @returns {void}
   */
  modificarItemEmpleado(): void {
    const SELECCIONADAS = this.listaFilaSeleccionadaEmpleado;
  
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
   * @method patchModifyiedData
   * Rellena el formulario con los datos de la fila seleccionada para su modificación.
   * 
   * Este método utiliza `patchValue` para actualizar los valores del formulario
   * con los datos de la fila seleccionada, incluyendo la búsqueda del índice correcto
   * para el campo de bimestre.
   * 
   * @returns {void}
   */
  patchModifyiedData(): void {
     const OBTENER_INDICE = (array: Catalogo[], value: string): number =>
      array.findIndex((item) => item.descripcion === value) + 1;
    const BIMESTRE = OBTENER_INDICE(this.bimestreList, this.filaSeleccionadaNumeroEmpleados?.bimestre);
    this.registroNumeroEmpleadosForm.patchValue({
      id: this.filaSeleccionadaNumeroEmpleados?.id,
      denominacionSocial: this.filaSeleccionadaNumeroEmpleados?.denominacionSocial,
      rfc: this.filaSeleccionadaNumeroEmpleados?.rfc,
      numeroDeEmpleados: this.filaSeleccionadaNumeroEmpleados?.numeroDeEmpleados,
      bimestre: BIMESTRE,
    });
  }

  /**
   * @method abrirMultipleSeleccionPopup
   * Muestra un popup de error si se seleccionan múltiples filas para modificar.
   * 
   * Este método se activa cuando el botón de modificar está habilitado pero
   * se han seleccionado múltiples elementos, lo cual no está permitido
   * para la operación de modificación.
   * 
   * @returns {void}
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
   * @method confirmEliminarEmpleadoItem
   * Confirma la eliminación de los elementos seleccionados en la tabla de mercancías.
   * 
   * Si no hay elementos seleccionados, no realiza ninguna acción.
   * Si hay elementos seleccionados, abre el popup de confirmación de eliminación.
   * 
   * @returns {void}
   */
  confirmEliminarEmpleadoItem(): void {
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
   * 
   * Establece el estado del popup de confirmación como abierto para mostrar
   * la ventana de confirmación de eliminación al usuario.
   * 
   * @returns {void}
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
   * @method cerrarMultipleSeleccionPopup
   * Cierra el popup de selección múltiple.
   * 
   * Restablece los estados de apertura y cierre del popup de selección múltiple
   * para ocultar la ventana modal.
   * 
   * @returns {void}
   */
  cerrarMultipleSeleccionPopup(): void {
    this.multipleSeleccionPopupAbierto = false;
    this.multipleSeleccionPopupCerrado = false;
  }

  /**
   * @method esInvalido
   * Verifica si un control de formulario es inválido, está tocado o ha sido modificado.
   * 
   * Utiliza el estado del control del formulario para determinar si debe mostrarse
   * un mensaje de error de validación al usuario.
   * 
   * @param {string} nombreControl - El nombre del control de formulario a verificar
   * @returns {boolean} Verdadero si el control es inválido, de lo contrario, falso
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.registroNumeroEmpleadosForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * @method onBuscarRfc
   * Busca los detalles del RFC para una persona física nacional (PFN).
   * 
   * Si el RFC tiene longitud mayor a 0, realiza una llamada al servicio para obtener los detalles.
   * Actualiza el formulario con la denominación social y el número de empleados obtenidos.
   * 
   * @returns {void}
   */
  onBuscarRfc(): void {
    if (this.rfcForm.valid) {
      this.servicio.getRFCDetails().pipe(
        takeUntil(this.destroyed$)
      ).subscribe({
        next: (result) => {
          const DATOS = result.data;
          this.registroNumeroEmpleadosForm.patchValue({
            rfc: DATOS.rfc,
            denominacionSocial: DATOS.denominacionSocial,
          });
        }
      });
    } else {
      const RFC_VALUE = this.rfcForm.get('rfcInput')?.value;
      const RFC_CONTROL = this.rfcForm.get('rfcInput');
      this.esHabilitarElDialogo = true;
      this.rfcForm.markAllAsTouched();
      if(!RFC_VALUE){
        this.enNuevaNotificacion(this.MENSAJE_DE_VALIDACION);
        return;
      } 
      if(RFC_CONTROL?.errors?.['pattern']){
        this.enNuevaNotificacion('Ha proporcionado información con un formato incorrecto');
      }
    }

  }

  /**
   * @method limpiarFormulario
   * Restablece el formulario de registro de vehículos a su estado inicial.
   * 
   * Limpia todos los campos del formulario reactivo, estableciendo sus valores
   * a su estado original sin validaciones activas.
   * 
   * @returns {void}
   */
  limpiarFormulario(): void {
    this.registroNumeroEmpleadosForm.reset();
  }
  
  /**
   * @method mostrar_colapsable
   * Método para mostrar u ocultar el formulario colapsable.
   * 
   * Cambia el estado de la variable `colapsable` para controlar la visibilidad
   * de elementos plegables en la interfaz de usuario.
   * 
   * @returns {void}
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
}
