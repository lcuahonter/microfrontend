import { CategoriaMensaje, ConfiguracionColumna, Notificacion, NotificacionesComponent, REGEX_CORREO_ELECTRONICO_EXPORTADOR, TablaDinamicaComponent, TablaSeleccion, TipoNotificacionEnum } from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, REG_X } from '@ng-mf/data-access-user';
import { ENLACE_OPERATIVO_TABLA, PANELS } from '../../constants/enlace-operativo-tabla.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud32605State, Solicitud32605Store } from '../../estados/solicitud32605.store';
import { Subject, map, takeUntil } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { Solicitud32605Query } from '../../estados/solicitud32605.query';
import { TablaEnlaceOperativo } from '../../models/enlace-operativo-tabla.model';
import { TituloComponent } from '@ng-mf/data-access-user';

/**
 * Componente para gestionar el enlace operativo en el trámite 32610.
 * 
 * Este componente maneja la funcionalidad completa del enlace operativo,
 * incluyendo la creación, edición, eliminación y visualización de registros
 * en una tabla dinámica con capacidades de selección múltiple.
 * 
 * @description
 * Proporciona una interfaz de usuario para:
 * - Registrar nuevos enlaces operativos
 * - Modificar enlaces operativos existentes
 * - Eliminar enlaces operativos seleccionados
 * - Validar formularios reactivos
 * - Gestionar notificaciones y confirmaciones
 * 
 */
@Component({
  selector: 'app-enlace-operativo',
  standalone: true,
  providers: [BsModalService],
  imports: [
    CommonModule,
    TituloComponent,
    TablaDinamicaComponent,
    ReactiveFormsModule,
    NotificacionesComponent,
  ],
  templateUrl: './enlace-operativo.component.html',
  styleUrls: ['./enlace-operativo.component.scss'],
})
export class EnlaceOperativoComponent implements OnInit, OnDestroy {
  /**
   * Referencia al elemento DOM del modal de enlace operativo.
   *
   * @description
   * Utilizado para controlar la apertura y cierre del modal mediante
   * la API de Bootstrap Modal. Permite acceso directo al elemento DOM
   * para manipular el estado del modal.
   *
   * @type {ElementRef}
   * @readonly
   * @since 1.0.0
   */
  @ViewChild('enlaceOperativoElemento') enlaceOperativoElemento!: ElementRef;

  /**
   * Formulario reactivo para el registro y edición de enlaces operativos.
   *
   * @description
   * Contiene todos los controles de formulario necesarios para capturar
   * la información del enlace operativo, incluyendo validaciones y estado.
   *
   */
  enlaceOperativoForm!: FormGroup;

  /**
   * Formulario reactivo que contiene los datos operativos del enlace en el componente.
   */
  enlaceOperativoDataForm!: FormGroup;

  /**
   * Referencia de solo lectura al enumerado de tipos de selección de tabla.
   *
   * @description
   * Proporciona acceso a los diferentes tipos de selección disponibles
   * para la tabla dinámica (checkbox, radio, etc.).
   */
  public readonly TablaSeleccion = TablaSeleccion;

  /**
   * Configuración de columnas para la tabla dinámica de enlaces operativos.
   *
   * @description
   * Define la estructura, encabezados y propiedades de visualización
   * de cada columna en la tabla de enlaces operativos.
   */
  public readonly configuracionTabla: ConfiguracionColumna<TablaEnlaceOperativo>[] =
    ENLACE_OPERATIVO_TABLA;

  /**
   * Fila actualmente seleccionada en la tabla de enlaces operativos.
   *
   * @description
   * Almacena la información de la fila seleccionada para operaciones
   * de edición y eliminación individual.
   */
  filaSeleccionadaEnlaceOperativo!: TablaEnlaceOperativo;

  /**
   * Subject para gestionar la destrucción de suscripciones.
   *
   * @description
   * Utilizado para cancelar automáticamente todas las suscripciones
   * activas cuando el componente se destruye, evitando memory leaks.
   *
   */
  private readonly destroyed$: Subject<void> = new Subject();

  /**
   * Configuración de paneles colapsables de la interfaz de usuario.
   *
   * @description
   * Define el estado y comportamiento de los paneles que pueden
   * expandirse o contraerse en la interfaz.
   */
  panels = PANELS;

  /**
   * Configuración de notificación actual para mostrar al usuario.
   *
   * @description
   * Almacena la configuración de la notificación que se mostrará
   * en modales de confirmación, error o información.
   *
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Indica si el popup de confirmación de eliminación está abierto.
   *
   * @description
   * Controla la visibilidad del modal de confirmación que aparece
   * cuando el usuario intenta eliminar registros.
   *
   */
  confirmEliminarPopupAbierto: boolean = false;

  /**
   * Indica si el popup de confirmación de eliminación está cerrado.
   *
   * @description
   * Estado complementario que indica cuando el modal de confirmación
   * de eliminación ha sido cerrado.
   */
  confirmEliminarPopupCerrado: boolean = true;

  /**
   * Indica si el formulario está en modo de edición.
   *
   * @description
   * Cuando es true, el formulario está editando un registro existente.
   * Cuando es false, el formulario está creando un nuevo registro.
   *
   */
  modoEdicion: boolean = false;

  /**
   * ID del registro que se está editando actualmente.
   *
   * @description
   * Almacena el identificador único del registro en modo de edición.
   * Es undefined cuando se está creando un nuevo registro.
   */
  registroEditandoId?: number;

  /**
   * Lista de filas seleccionadas en la tabla de enlaces operativos.
   *
   * @description
   * Contiene todas las filas que el usuario ha seleccionado mediante
   * checkboxes para operaciones de eliminación múltiple.
   */
  listaFilaSeleccionadaEnlace: TablaEnlaceOperativo[] = [];

  /**
   * Indica si el botón de modificar está habilitado.
   *
   * @description
   * Se habilita cuando hay exactamente una fila seleccionada
   * en la tabla para permitir la edición.
   */
  enableModficarBoton: boolean = false;

  /**
   * Indica si el popup de selección múltiple está abierto.
   *
   * @description
   * Controla la visibilidad del modal que aparece cuando el usuario
   * intenta modificar múltiples registros simultáneamente.
   */
  multipleSeleccionPopupAbierto: boolean = false;

  /**
   * Indica si el botón de eliminar está habilitado.
   *
   * @description
   * Se habilita cuando hay al menos una fila seleccionada
   * en la tabla para permitir la eliminación.
   *
   */
  enableEliminarBoton: boolean = false;

  /**
   * Indica si el formulario está en modo de solo lectura.
   *
   * @description
   * Cuando es true, todos los controles del formulario están
   * deshabilitados y no se pueden editar.
   *
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado actual de la sección de terceros del trámite 32610.
   *
   * @description
   * Contiene toda la información del estado actual del trámite
   * relacionada con terceros y enlaces operativos.
   */
  public seccionState!: Solicitud32605State;

  /**
   * Datos de la tabla de enlaces operativos.
   *
   * @description
   * Array que contiene todos los registros de enlaces operativos
   * que se muestran en la tabla dinámica.
   */
  enlaceOperativoData: TablaEnlaceOperativo[] = [] as TablaEnlaceOperativo[];

  /**
   * Indica si el popup de selección múltiple está cerrado.
   *
   * @description
   * Estado complementario que indica cuando el modal de selección
   * múltiple ha sido cerrado.
   */
  multipleSeleccionPopupCerrado: boolean = true;

  /**
   * Indica si el campo RFC tiene un valor asignado.
   */
  tieneValorRfc: boolean = false;

  /**
   * Indica si el campo RFC es válido.
   */
  rfcValido: boolean = false;

  /** Indica si una fila ha sido seleccionada en la tabla. */
  esFilaSeleccionada: boolean = false;
   /**
   * Bandera que controla la visualización de errores en el formulario.
   * Se activa cuando hay errores de validación que deben mostrarse.
   */
  mostrarError: boolean = false;

  /**
   * Constructor del componente EnlaceOperativoComponent.
   *
   * @description
   * Inicializa el componente con todas las dependencias necesarias,
   * configura las suscripciones iniciales y crea el formulario reactivo.
   *
   */
  constructor(
    private fb: FormBuilder,
    private tramite32605Store: Solicitud32605Store,
    private tramite32605Query: Solicitud32605Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          if (this.esFormularioSoloLectura) {
            this.mostrar_colapsable(0);
          }
        })
      )
      .subscribe();
    this.crearFormulario();
  }

  /**
   * Método de inicialización del componente.
   *
   * @description
   * Se ejecuta después de que Angular inicializa las propiedades del componente.
   * Configura las suscripciones a los observables del estado del trámite
   * y carga los datos iniciales de la tabla.
   */
  ngOnInit(): void {
    this.tramite32605Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: Solicitud32605State) => {
        this.seccionState = datos;
        this.enlaceOperativoData = this.seccionState.enlaceOperativoData;
      });
  }
 
  /**
   * Crea el formulario reactivo para el registro de vehículos.
   */
  crearFormulario(): void {
    this.enlaceOperativoDataForm = this.fb.group({});
    this.enlaceOperativoForm = this.fb.group({
      registro: [
        '',
        [Validators.required, Validators.pattern(REG_X.RFC_13_ALFANUM), Validators.maxLength(15)],
      ],
      rfc: [{ value: '', disabled: true }],
      nombre: [{ value: '', disabled: true }],
      apellidoPaterno: [{ value: '', disabled: true }],
      apellidoMaterno: [{ value: '', disabled: true }],
      cuidad: [{ value: '', disabled: true }],
      cargo: [''],
      telefono: [''],
      correoElectronico: ['', [Validators.pattern(REGEX_CORREO_ELECTRONICO_EXPORTADOR), Validators.maxLength(320)]],
      suplente: [false],
    });
  }
 
  /**
   * Controla la visibilidad de los paneles colapsables.
   *
   * @description
   * Alterna el estado de colapso de un panel específico mientras
   * cierra todos los demás paneles. Implementa un comportamiento
   * de acordeón donde solo un panel puede estar abierto a la vez.
   */
  mostrar_colapsable(index: number): void {
    const IS_CURRENTLY_OPEN = this.panels[index].isCollapsed;
    this.panels.forEach((panel: { isCollapsed: boolean }, i: number) => {
      panel.isCollapsed = i === index ? !IS_CURRENTLY_OPEN : true;
    });
  }
 
  /**
   * Realiza la búsqueda de información basada en el registro ingresado.
   *
   * @description
   * Busca y llena automáticamente los campos del formulario con datos
   * simulados basados en el valor del registro Federal de Contribuyentes.
   * En una implementación real, esto se conectaría a un servicio web.
   */
  botonBuscar(): void {
    let MOCK_DATA;
    const REGISTRO_VALUE = this.enlaceOperativoForm.get('registro')?.value;
    const REGISTRO_CONTROL = this.enlaceOperativoForm.get('registro');
    if(!REGISTRO_VALUE) {
      this.mostrarNotificacionDeBusqueda('', 'No se ha proporcionado información que es requerida');
      this.tieneValorRfc = true;
      return;
      }
    if (!REGISTRO_CONTROL?.valid) {
      this.mostrarNotificacionDeBusqueda('', 'Ha proporcionado información con un formato incorrecto');
      this.tieneValorRfc = true;
      return;
    }
    if (REGISTRO_VALUE) {
       this.mostrarNotificacionDeBusqueda('', 'Datos guardados correctamente');
       this.tieneValorRfc = true;
        MOCK_DATA = {
        rfc: REGISTRO_VALUE,
        nombre: 'EUROFOODS DE MEXICO',
        apellidoPaterno: 'GONZALEZ',
        apellidoMaterno: 'PINAL',
        telefono: '618-256-2532',
        cuidad: 'DURANGO',
        correoElectronico: 'vucem2.5@hotmail.com',
      };
      this.enlaceOperativoForm.patchValue(MOCK_DATA);
    }
  }
 
  /**
   * Muestra una notificación de búsqueda exitosa.
   * Este mensaje indica que los datos se guardaron correctamente.
   */
  mostrarNotificacionDeBusqueda(titulo: string,
    mensaje: string,
    txtBtnAceptar: string = 'Aceptar',
    txtBtnCancelar: string = ''): void {
    this.nuevaNotificacion = {
       tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: titulo,
      mensaje: mensaje,
      cerrar: false,
      txtBtnAceptar: txtBtnAceptar,
      txtBtnCancelar: txtBtnCancelar
    };
  }
 
  /**
   * Abre el cuadro de diálogo modal para el registro de enlaces operativos.
   *
   * @description
   * Inicializa y muestra el modal de Bootstrap para permitir al usuario
   * ingresar o editar información de enlaces operativos. Requiere que
   * el ViewChild esté inicializado.
   */
  agregarDialogoDatos(): void {
    if (this.enlaceOperativoElemento) {
      const MODAL_INSTANCIA = new Modal(
        this.enlaceOperativoElemento?.nativeElement
      );
      MODAL_INSTANCIA.show();
    }
  }
 
  /**
   * Envía los datos del formulario y muestra el modal de confirmación.
   *
   * @description
   * Valida el formulario y, si es válido, procesa los datos del enlace operativo.
   * Muestra una notificación de confirmación y resetea el formulario.
   * Si el formulario es inválido, marca todos los campos como tocados para
   * mostrar los errores de validación.
   */
  enviarDialogData(): void {
    if (this.enlaceOperativoForm.valid) {
      this.enlaceInfoDatos();
      this.limpiarFormulario();
      this.cambiarEstadoModal();
    } else {
      this.enlaceOperativoForm.markAllAsTouched();
    }
  }
 
  /**
   * Cancela el cuadro de diálogo modal para el registro de enlaces operativos.
   *
   * @description
   * Cierra el modal activo y restablece el formulario a su estado inicial.
   * Se ejecuta cuando el usuario cancela la operación de agregar o editar
   * un enlace operativo.
   */
  modalCancelar(): void {
    this.cambiarEstadoModal();
    this.limpiarFormulario();
  }
 
  /**
   * Restablece el formulario de registro de enlaces operativos a su estado inicial.
   *
   * @description
   * Limpia todos los campos del formulario y resetea su estado de validación.
   * Los campos vuelven a sus valores por defecto y se eliminan las marcas
   * de tocado y validación.
   */
  limpiarFormulario(): void {
    this.enlaceOperativoForm.reset();
  }
 
  /**
   * Alterna la visibilidad del cuadro de diálogo modal para el registro de enlaces operativos.
   *
   * @description
   * Oculta el modal si está visible actualmente. Utiliza la API de Bootstrap
   * para obtener la instancia del modal y controlarlo programáticamente.
   *
   */
  cambiarEstadoModal(): void {
    const MODAL_INSTANCIA = Modal.getInstance(
      this.enlaceOperativoElemento.nativeElement
    );
    if (MODAL_INSTANCIA) {
      MODAL_INSTANCIA.hide();
    }
  }
 
  /**
   * Agrega o actualiza los datos del enlace operativo en la lista de registros.
   *
   * @description
   * Procesa los datos del formulario y los agrega a la tabla de enlaces operativos.
   * Si está en modo edición, actualiza el registro existente. Si no, crea un nuevo
   * registro con un ID único. Actualiza el estado del store después de la operación.
   */
  enlaceInfoDatos(): void {
    if (!this.enlaceOperativoForm.valid) {
      return;
    }
 
    const FORM_DATA = this.enlaceOperativoForm.getRawValue();
 
    if (this.modoEdicion && this.registroEditandoId !== undefined) {
      this.enlaceOperativoData = this.enlaceOperativoData.map((item) =>
        item.id === this.registroEditandoId ? { ...item, ...FORM_DATA } : item
      );
    } else {
      const NEW_ID =
        this.enlaceOperativoData.length > 0
          ? Math.max(...this.enlaceOperativoData.map((item) => item.id || 0)) +
            1
          : 1;
 
      const ENLACE_OPERATIVO: TablaEnlaceOperativo = {
        ...FORM_DATA,
        id: NEW_ID,
      };
 
      this.enlaceOperativoData = [
        ...this.enlaceOperativoData,
        ENLACE_OPERATIVO,
      ];
    }
    this.tramite32605Store.actualizarEstado({
      enlaceOperativoData: this.enlaceOperativoData,
    });
    this.filaSeleccionadaEnlaceOperativo = {} as TablaEnlaceOperativo;
  }
 
  /**
   * Método para cerrar el modal de confirmación.
   * @returns {void}
   */
  cerrarModal(): void {
    this.confirmEliminarPopupAbierto = false;
    this.tieneValorRfc = false;
    this.esFilaSeleccionada = false;
    this.multipleSeleccionPopupAbierto = false;
  }
 
  /**
   * Maneja la selección de filas en la tabla de enlaces operativos.
   *
   * @description
   * Actualiza el estado de las filas seleccionadas y controla la habilitación
   * de los botones de modificar y eliminar. Si no hay filas seleccionadas,
   * deshabilita los botones y limpia la selección.
   *
   */
  manejarFilaSeleccionada(fila: TablaEnlaceOperativo[]): void {
    this.listaFilaSeleccionadaEnlace = fila;
    if (fila.length === 0) {
      this.filaSeleccionadaEnlaceOperativo = {} as TablaEnlaceOperativo;
      this.enableModficarBoton = false;
      this.enableEliminarBoton = false;
      return;
    }
    this.filaSeleccionadaEnlaceOperativo = fila[fila.length - 1];
  }
 
  /**
   * Actualiza la fila seleccionada con los datos más recientes de la tabla.
   *
   * @description
   * Busca en los datos de la tabla el registro correspondiente a la fila
   * seleccionada y actualiza la referencia local con los datos más recientes.
   * Útil para mantener la sincronización después de modificaciones.
   *
   */
  actualizarFilaSeleccionada(): void {
    const DATOS_ACTUALIZADOS = this.enlaceOperativoData.find(
      (item) => item.id === this.filaSeleccionadaEnlaceOperativo.id
    );
 
    if (DATOS_ACTUALIZADOS) {
      this.filaSeleccionadaEnlaceOperativo = { ...DATOS_ACTUALIZADOS };
    }
  }
 
  /**
   * Elimina los elementos seleccionados de la tabla de enlaces operativos.
   *
   * @description
   * Filtra y elimina los registros seleccionados de la tabla cuando el usuario
   * confirma la eliminación. Actualiza el estado del store y resetea las
   * selecciones después de la operación.
   */
  eliminarEnlaceItem(evento: boolean): void {
    this.cerrarModal();
    if (evento === true) {
      const IDS_TO_DELETE = this.listaFilaSeleccionadaEnlace.map(
        (item) => item.id
      );
 
      this.enlaceOperativoData = this.enlaceOperativoData.filter(
        (item) => !IDS_TO_DELETE.includes(item.id)
      );
 
      this.listaFilaSeleccionadaEnlace = [];
      this.filaSeleccionadaEnlaceOperativo = {} as TablaEnlaceOperativo;
      this.tramite32605Store.actualizarEstado({
        enlaceOperativoData: this.enlaceOperativoData,
      });
    }
  }
 
  /**
   * Modifica un enlace operativo seleccionado en la tabla.
   *
   * @description
   * Inicia el proceso de edición de un enlace operativo. Si hay exactamente
   * una fila seleccionada, abre el modal de edición con los datos cargados.
   * Si hay múltiples filas seleccionadas, muestra un popup de error.
   */
  modificarItemEnlace(): void {
    this.cerrarModal();
    if(this.enlaceOperativoData.length === 0) {
      this.abrirMultipleSeleccionPopup('', 'No se encontró información');
      this.esFilaSeleccionada = true;
      return;
    }
    if (this.listaFilaSeleccionadaEnlace.length === 0) {
     this.abrirMultipleSeleccionPopup('', 'Seleccione un registro');
      this.esFilaSeleccionada = true;
      return;
    } if (
      this.listaFilaSeleccionadaEnlace &&
      this.listaFilaSeleccionadaEnlace.length === 1
    ) {
      this.filaSeleccionadaEnlaceOperativo = {
        ...this.listaFilaSeleccionadaEnlace[0],
      };
      this.registroEditandoId = this.filaSeleccionadaEnlaceOperativo.id;
      this.modoEdicion = true;
      this.agregarDialogoDatos();
      this.actualizarDatosModificados();
    }
  }
 
    /**
   * @method abrirMultipleSeleccionPopup
   * Muestra un popup de notificación con contenido dinámico.
   * Este método permite personalizar el título, mensaje y etiquetas de los botones del popup.
   * @param titulo - Título del popup
   * @param mensaje - Mensaje a mostrar en el popup
   * @param txtBtnAceptar - Texto del botón de aceptar (opcional, por defecto 'Cerrar')
   * @param txtBtnCancelar - Texto del botón de cancelar (opcional, por defecto '')
   */
  abrirMultipleSeleccionPopup(
    titulo: string,
    mensaje: string,
    txtBtnAceptar: string = 'Aceptar',
    txtBtnCancelar: string = ''
  ): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: titulo,
      mensaje: mensaje,
      cerrar: false,
      txtBtnAceptar: txtBtnAceptar,
      txtBtnCancelar: txtBtnCancelar,
    };
  }
 
  /**
   * Actualiza el formulario con los datos de la fila seleccionada para modificación.
   *
   * @description
   * Llena todos los campos del formulario con los valores de la fila seleccionada
   * para permitir la edición. Utiliza patchValue para actualizar solo los
   * campos especificados sin afectar el resto del formulario.
   */
  actualizarDatosModificados(): void {
    if (!this.filaSeleccionadaEnlaceOperativo) {
      return;
    }
 
    this.enlaceOperativoForm.patchValue({
      registro: this.filaSeleccionadaEnlaceOperativo.registro,
      rfc: this.filaSeleccionadaEnlaceOperativo.rfc,
      nombre: this.filaSeleccionadaEnlaceOperativo.nombre,
      apellidoPaterno: this.filaSeleccionadaEnlaceOperativo.apellidoPaterno,
      apellidoMaterno: this.filaSeleccionadaEnlaceOperativo.apellidoMaterno,
      cuidad: this.filaSeleccionadaEnlaceOperativo.cuidad,
      cargo: this.filaSeleccionadaEnlaceOperativo.cargo,
      telefono: this.filaSeleccionadaEnlaceOperativo.telefono,
      correoElectronico: this.filaSeleccionadaEnlaceOperativo.correoElectronico,
      suplente: this.filaSeleccionadaEnlaceOperativo.suplente,
    });
  }
 
  /**
   * Confirma la eliminación de los elementos seleccionados en la tabla.
   *
   * @description
   * Valida que haya al menos un elemento seleccionado antes de mostrar
   * el popup de confirmación. Si no hay elementos seleccionados, muestra
   * un mensaje de error. Si hay elementos, abre el popup de confirmación.
   */
  confirmeliminarEnlaceItem(): void {
    this.cerrarModal();
    if (this.enlaceOperativoData.length === 0) {
      this.multipleSeleccionPopupAbierto = true;
      this.abrirMultipleSeleccionPopup('', 'No se encontró información');
      return;
    }
    if (this.listaFilaSeleccionadaEnlace.length === 0) {
      this.multipleSeleccionPopupAbierto = true;
      this.abrirMultipleSeleccionPopup('', 'Seleccione un registro');
      return;
    } if (this.listaFilaSeleccionadaEnlace.length) {
      this.abrirElimninarConfirmationopup();
    }
  }
  /**
   * Abre un popup de confirmación para eliminar los registros seleccionados.
   *
   * @description
   * Configura y muestra un modal de confirmación con mensaje de advertencia
   * para que el usuario confirme la eliminación de los registros marcados.
   * Incluye botones de aceptar y cancelar para la decisión del usuario.
   */
  abrirElimninarConfirmationopup(): void {
    this.confirmEliminarPopupAbierto = true;
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
  }
 
  /**
   * Validates the representante form and sets the mostrarError flag if validation fails
   * @returns boolean indicating if the form is valid
   */
  validarFormulario(): boolean {
    this.mostrarError = false;
 
    if (!this.enlaceOperativoData || this.enlaceOperativoData.length === 0) {
      this.mostrarError = true;
      return false;
    }
 
    return true;
  }
 
  /**
   * Método de ciclo de vida de Angular que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}