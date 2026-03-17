import {
  CategoriaMensaje,
  Notificacion,
  NotificacionesComponent,
  REGEX_PATRON_ALFANUMERICO,
  TablaDinamicaComponent,
  TablaSeleccion,
  TipoNotificacionEnum,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NOTA, VEHICULOS_TABLA_DATOS } from '../../enums/registro-empresas-transporte.enum';
import { Subject, map, takeUntil} from 'rxjs';
import { Tramite30401Store, Tramites30401State } from '../../estados/tramites30401.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';
import { Tramite30401Query } from '../../estados/tramites30401.query';
import { VehiculosTabla } from '../../modelos/registro-empresas-transporte.model';


/**
 * Componente VehiculosComponent para la gestión de vehículos dentro del sistema.
 * 
 * Este componente independiente (`standalone`) se encarga de la interacción con la tabla dinámica,
 * el manejo de formularios reactivos, y la visualización de notificaciones. Proporciona una interfaz
 * intuitiva para la gestión de vehículos registrados.
 * 
 * @component
 * @selector app-vehiculos
 * @standalone true
 * @imports CommonModule, TablaDinamicaComponent, TituloComponent, ReactiveFormsModule, NotificacionesComponent
 * @templateUrl ./Vehiculos.component.html
 * @styleUrl ./Vehiculos.component.scss
 */
@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [
    CommonModule,
    TablaDinamicaComponent,
    TituloComponent,
    ReactiveFormsModule,
    NotificacionesComponent,
  ],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss',
})
export class VehiculosComponent implements OnInit {
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
  registroVehiculosForm!: FormGroup;

  /**
   * Formulario para gestionar los archivos adjuntos.
   *
   * Permite capturar y validar los datos relacionados con los archivos adjuntos.
   */
  formularioArchivo!: FormGroup;

  /**
   * Referencia al elemento del modal para gestionar archivos.
   *
   * Se utiliza para abrir o cerrar el modal de archivos.
   */
  @ViewChild('modalArchivo') modalArchivo!: ElementRef;

  /**
   * Tipo de selección de tabla (CHECKBOX).
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Lista de vehículos registrados.
   */
  vehiculosInfoList: VehiculosTabla[] = [] as VehiculosTabla[];

  /**
   * Nombre de la pestaña activa.
   */
  activeTab: string = 'parquevehicular';

  /**
   * Referencia al elemento modal para el registro de vehículos.
   */
  @ViewChild('registroDeVehiculos') registroDeVehiculosElemento!: ElementRef;

  /**
   * Referencia al elemento modal de confirmación.
   */
  @ViewChild('modalDeConfirmacion') confirmacionElemento!: ElementRef;

  /**
   * Constante para la nota de confirmación del vehículo.
   */
  CONFIRMACION_VEHICULO = NOTA.CONFIRMACION_VEHICULO;

 /**
   * Configuración para las columnas de la tabla de vehículos.
   */
  ParqueVehicular = VEHICULOS_TABLA_DATOS;

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
  filaSeleccionadaVehiculos!: VehiculosTabla;

  /**
   * Lista de filas seleccionadas en la tabla de mercancías.
   */
  listaFilaSeleccionadaVehiculos: VehiculosTabla[] = [] as VehiculosTabla[];

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
  mostrarModalDatosVehiculos: boolean = false;

  /**
   * Indica si el popup está cerrado.
   */
  multipleSeleccionPopupCerrado: boolean = true;

  /**
   * @property {Tramites30401State} seccionState
   * Estado actual del formulario.
   */
  public seccionState!: Tramites30401State;

  /**
   * Constructor para VehiculosComponent.
   * Inicializa el formulario e inyecta los servicios necesarios.
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param tramite30401Store - Store para gestionar el estado relacionado con el Trámite 30401.
   */
  constructor(
    public fb: FormBuilder,
    private tramite30401Store: Tramite30401Store,
    private tramite30401Query: Tramite30401Query,
    private consultaioQuery: ConsultaioQuery
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
    this.inicializarFormularioArchivo();
  }

  /**
   * Método del ciclo de vida que se ejecuta cuando el componente se inicializa.
   * - Se suscribe a `selectTramite30401$` para obtener datos del estado.
   * - Actualiza `seccionState` con la información más reciente del estado.
   * - Asigna `VehiculosTablaDatos` a `vehiculosInfoList`.
   *
   * La suscripción está gestionada con `takeUntil(this.destroyed$)`
   * para garantizar la limpieza cuando el componente se destruye.
   */
  ngOnInit(): void {
    this.tramite30401Query.selectTramite30401$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: Tramites30401State) => {
        this.seccionState = datos;
      });

    this.vehiculosInfoList = this.seccionState.vehiculosTablaDatos;
  }

  /**
   * Crea el formulario reactivo para el registro de vehículos.
   */
  crearFormulario(): void {
    this.registroVehiculosForm = this.fb.group({
      id: [null],
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      vin: ['', [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]],
    });
  }

  /**
   * Inicializa el formulario para gestionar archivos.
   *
   * Este método configura los campos y validaciones del formulario relacionado con los archivos adjuntos.
   */
  inicializarFormularioArchivo(): void {
    this.formularioArchivo = this.fb.group({
      archivo: ['', [Validators.required]],
    });
  }

  /**
   * Muestra el modal para cargar un archivo.
   *
   * Este método utiliza el modal de Bootstrap para mostrar el modal de carga de archivos.
   */
  cargaArchivo(): void {
    if (this.modalArchivo) {
      const MODAL_INSTANCE = new Modal(this.modalArchivo.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Abre el cuadro de diálogo modal para el registro de vehículos.
   */
  agregarDialogoDatos(): void {
    if (this.registroDeVehiculosElemento) {
      const MODAL_INSTANCIA = new Modal(
        this.registroDeVehiculosElemento?.nativeElement
      );
      MODAL_INSTANCIA.show();
    }
  }

  /**
   * Envía los datos del formulario y muestra el modal de confirmación.
   * Si el formulario es inválido, marca todos los campos como tocados.
   */
  enviarDialogData(): void {
    if (this.registroVehiculosForm.valid) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: this.CONFIRMACION_VEHICULO,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };

      this.esHabilitarElDialogo = true;
      this.vehiculosInfoDatos();
      this.limpiarFormulario();
      this.cambiarEstadoModal();
    } else {
      this.registroVehiculosForm.markAllAsTouched();
    }
  }

  /**
   * Cancela el cuadro de diálogo modal para el registro de vehículos.
   * Este método oculta el modal y restablece el formulario.
   */
  modalCancelar(): void {
    this.cambiarEstadoModal();
    this.limpiarFormulario();
  }

  /**
   * Restablece el formulario de registro de vehículos a su estado inicial.
   */
  limpiarFormulario(): void {
    this.registroVehiculosForm.reset();
  }

  /**
   * Alterna la visibilidad del cuadro de diálogo modal para el registro de vehículos.
   * Si el modal está visible actualmente, se ocultará.
   */
  cambiarEstadoModal(): void {
    const MODAL_INSTANCIA = Modal.getInstance(
      this.registroDeVehiculosElemento.nativeElement
    );
    if (MODAL_INSTANCIA) {
      MODAL_INSTANCIA.hide();
    }
  }

  /**
   * Agrega los datos actuales del formulario a la lista de vehículos registrados.
   * Los datos del formulario se añaden al array `vehiculosInfoList`.
   */
  vehiculosInfoDatos(): void {
    const {
      marca: MARCA,
      modelo: MODELO,
      vin: VIN,
    } = this.registroVehiculosForm.value;

    if (
      !this.filaSeleccionadaVehiculos ||
      Object.keys(this.filaSeleccionadaVehiculos).length === 0
    ) {
      const ID = this.vehiculosInfoList.length
        ? this.vehiculosInfoList[this.vehiculosInfoList.length - 1]?.id + 1
        : 1;

      const OBJETO = { id: ID, marca: MARCA, modelo: MODELO, vin: VIN };

      this.vehiculosInfoList = [...this.vehiculosInfoList, OBJETO];
      this.tramite30401Store.establecerDatos({vehiculosTablaDatos:this.vehiculosInfoList});
    } else {
      this.vehiculosInfoList = this.vehiculosInfoList.map((elemento) =>
        elemento.id === this.filaSeleccionadaVehiculos.id
          ? { ...elemento, marca: MARCA, modelo: MODELO, vin: VIN }
          : elemento
      );

      this.tramite30401Store.establecerDatos({vehiculosTablaDatos:this.vehiculosInfoList});
      this.filaSeleccionadaVehiculos = {} as VehiculosTabla;
    }
  }
  /**
   * Método para cerrar el modal de confirmación.
   * @returns {void}
   */
  cerrarModal(): void {
    this.esHabilitarElDialogo = false;
  }

  /**
   * Maneja la fila seleccionada en la tabla de mercancías.
   * fila Fila seleccionada.
   */
  manejarFilaSeleccionada(fila: VehiculosTabla[]): void {
    this.listaFilaSeleccionadaVehiculos = fila;
      if (fila.length === 0) {
      this.filaSeleccionadaVehiculos = {} as VehiculosTabla;
      this.enableModficarBoton = false;
      this.enableEliminarBoton = false;
      return;
    }
  this.filaSeleccionadaVehiculos = fila[fila.length - 1];
  }
  

  /**
   * Actualiza la fila seleccionada con los datos más recientes de la tabla.
   */
  actualizarFilaSeleccionada(): void {
    const DATOS_ACTUALIZADOS = this.vehiculosInfoList.find(
      (item) => item.id === this.filaSeleccionadaVehiculos.id
    );

    if (DATOS_ACTUALIZADOS) {
      this.filaSeleccionadaVehiculos = { ...DATOS_ACTUALIZADOS };
    }
  }

  /**
   * Filtra y elimina los elementos seleccionados de la tabla de mercancías.
   * Actualiza el estado del almacén y cierra el popup de confirmación de eliminación.
   */
  eliminarVehiculosItem(evento:boolean): void {
    if(evento === true) {
      const IDS_TO_DELETE = this.listaFilaSeleccionadaVehiculos.map(
        (item) => item.id
      );

      this.vehiculosInfoList = this.vehiculosInfoList.filter(
        (item) => !IDS_TO_DELETE.includes(item.id)
      );

      this.listaFilaSeleccionadaVehiculos = [];
      this.filaSeleccionadaVehiculos = {} as VehiculosTabla;
      this.tramite30401Store.establecerDatos({vehiculosTablaDatos:this.vehiculosInfoList});
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
  modificarItemVehiculos(): void {
    const SELECCIONADAS = this.listaFilaSeleccionadaVehiculos;
  
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
   * Este método utiliza `patchValue` para actualizar los valores del formulario.
   */
  patchModifyiedData(): void {
    this.registroVehiculosForm.patchValue({
      id: this.filaSeleccionadaVehiculos?.id,
      marca: this.filaSeleccionadaVehiculos?.marca,
      modelo: this.filaSeleccionadaVehiculos?.modelo,
      vin: this.filaSeleccionadaVehiculos?.vin,
    });
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
  confirmEliminarVehiculosItem(): void {
    if (this.listaFilaSeleccionadaVehiculos.length === 0) {
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
   * Verifica si un control de formulario es inválido, está tocado o ha sido modificado.
   * @param nombreControl - El nombre del control de formulario a verificar.
   * @returns Verdadero si el control es inválido, de lo contrario, falso.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.registroVehiculosForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }
}
