
import { ALERTARCHIVOMSG, MENSAJES, PARTIDASDELAMERCANCIA_TABLA, TEXTOS } from '../../constantes/partidas-de-la-mercancia.enum';
import { AlertComponent, ConfiguracionColumna, Notificacion, NotificacionesComponent, TipoNotificacionEnum } from '@ng-mf/data-access-user';
import { Catalogo, CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { PartidasDeLaMercanciaModelo } from '../../models/partidas-de-la-mercancia.model';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { TituloComponent } from '@ng-mf/data-access-user';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { archivoCSVTOJSON } from '../../utils/convertCSVToJsonArchivo';

/**
 * PartidasDeLaMercanciaComponent
 * Este componente es responsable de gestionar las partidas de la mercancía.
 * Proporciona un formulario para capturar datos, una tabla dinámica para mostrar información
 * y eventos para interactuar con otros componentes o servicios.
 */
@Component({
  selector: 'app-partidas-de-la-mercancia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    TablaDinamicaComponent,
    TooltipModule,
    AlertComponent,
    NotificacionesComponent,
    CatalogoSelectComponent
  ],
  templateUrl: './partidas-de-la-mercancia.component.html',
  styleUrl: './partidas-de-la-mercancia.component.scss',
})
export class PartidasDeLaMercanciaComponent implements OnChanges, OnInit {
  /**
   * Textos utilizados en el componente.
   * @type {typeof TEXTOS}
   */
  TEXTOS = TEXTOS;

  /*
   * @descripcion Mensaje de alerta para el archivo.
   */
  ALERTARCHIVOMSG = ALERTARCHIVOMSG;
  /*
   * @descripcion Indica si se debe mostrar una notificación.
   */
  mostrarNotificacion = false;
  /**
   *  Indica si se debe mostrar una alerta de archivo.
   */
  alertaArchivo = false;
  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @description Referencia al elemento de la partida que se va a modificar.
   */
  @ViewChild('modificarPartidaModal') modificarPartidaElemento!: ElementRef;
  /**
  * @description Indica si el formulario debe mostrarse en modo solo lectura.
  */
  @Input() esFormularioSoloLectura!: boolean;
  /**
   * form
   * Formulario reactivo principal para capturar los datos de las partidas.
   */
  @Input() partidasDelaMercanciaForm!: FormGroup;

  /**
   * modificarPartidasDelaMercanciaForm
   * Formulario reactivo para modificar las partidas.
   */
  @Input() modificarPartidasDelaMercanciaForm!: FormGroup;

  /**
   * formForTotalCount
   * Formulario reactivo para capturar los totales de las partidas.
   */
  @Input() formForTotalCount!: FormGroup;

  /**
   * mostrarTabla
   * Bandera para mostrar u ocultar la tabla dinámica.
   */
  @Input() mostrarTabla = true;
  /**
   * filaSeleccionadaChange
   * Evento que emite las filas seleccionadas en la tabla dinámica.
   */
  @Output() filaSeleccionadaChange = new EventEmitter<PartidasDeLaMercanciaModelo[]>();

  /**
   * validarYEnviarFormularioEvent
   * Evento que se emite cuando se valida y envía el formulario.
   */
  @Output() validarYEnviarFormularioEvent = new EventEmitter<void>();

  /**
   * navegarParaModificarPartidaEvent
   * Evento que se emite para navegar y modificar una partida específica.
   */
  @Output() navegarParaModificarPartidaEvent = new EventEmitter<void>();

  /**
   * setValoresStoreEvent
   * Evento que emite los valores del formulario para almacenarlos en el store.
   * Formulario reactivo.
   * Nombre del campo que se está actualizando.
   * Nombre del método que realiza la actualización.
   */
  @Output() setValoresStoreEvent = new EventEmitter<{ form: FormGroup; campo: string }>();

  /**
 * Tipo de selección de la tabla dinámica.
 * Define el tipo de selección que se utilizará en la tabla dinámica (por ejemplo, checkbox).
 */
  CHECKBOX: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas de la tabla dinámica.
   * Este campo define las columnas que se mostrarán en la tabla, incluyendo encabezados y claves.
   */
  @Input() tableHeaderData: ConfiguracionColumna<PartidasDeLaMercanciaModelo>[] =
  PARTIDASDELAMERCANCIA_TABLA;

  /**
   * Datos que se mostrarán en la tabla dinámica.
   * Este campo contiene las filas de datos que se renderizarán en el cuerpo de la tabla.
   */
  @Input() tableBodyData: PartidasDeLaMercanciaModelo[] = [];

  /**
   * Bandera para deshabilitar la tabla dinámica.
   * Si está configurada como `true`, la tabla estará deshabilitada.
   */
  @Input() disabled: boolean = false;
  /**
   * Referencia al elemento del DOM asociado con el archivo de nacionales.
   * Utilizado para acceder y manipular directamente el elemento en la plantilla.
   */
  @ViewChild('archivoNacionales') archivoNacionalesElemento!: ElementRef;

  /**
   * @ViewChild('cargarArchivo') cargarArchivoElemento
   * Referencia al elemento del DOM para el modal de carga de archivos.
   */
  @ViewChild('cargarArchivo') cargarArchivoElemento!: ElementRef;

  /**
   * selectedRows
   * Arreglo de filas seleccionadas en la tabla dinámica de partidas de la mercancía.
   */
  selectedRows: PartidasDeLaMercanciaModelo[] = [];

  /**
   * confirmandoEliminar
   * Bandera que indica si se está confirmando la eliminación de partidas.
   */
  confirmandoEliminar = false;

  /**
   * confirmandoEliminarPartida
   * Bandera que indica si se está confirmando la eliminación de una partida específica.
   */
  confirmandoEliminarPartida = false;

  /**
   * @Input() mostrarErrores
   * Bandera que indica si se deben mostrar los mensajes de error en el formulario.
   */
  @Input() mostrarErrores: boolean = false;

  /*
   * @Input() mostrarErroresModal
   * Bandera que indica si se deben mostrar los mensajes de error en el modal.
   */
  mostrarErroresModal = false;

  /**
   * Nombre del archivo seleccionado por el usuario.
   */
  nombreArchivoSeleccionado: string = '';

  /**
   * Evento emitido antes de cargar un archivo, permitiendo realizar validaciones previas.
   */
  @Output() validarAntesDeCargarArchivo = new EventEmitter<void>();

  /*
   * Evento emitido cuando se eliminan partidas de la tabla.
   */
  @Output() partidasEliminadas = new EventEmitter<string[]>();

  /**
   * Evento emitido cuando se modifica una partida seleccionada.
   */
  @Output() modificarPartidaSeleccionada = new EventEmitter<PartidasDeLaMercanciaModelo>();

  /**
   * Evento emitido cuando se modifica una partida seleccionada.
   */
  @Output() partidaModificada = new EventEmitter<PartidasDeLaMercanciaModelo>();

  /**
   * Indica si las partidas son inválidas.
   * 
   * Este valor se recibe como una propiedad de entrada desde el componente padre.
   * Cuando es `true`, puede utilizarse para mostrar mensajes de error, deshabilitar acciones
   * o aplicar estilos visuales de validación.
   *
   * @type {boolean}
   * @Input()
   */
  @Input() isInvalidaPartidas: boolean = false;

  /**
    * Lista de elementos del catálogo de fracciones arancelarias.
    * @type {Catalogo[]}
    */
  @Input() fraccionDescripcionPartidasDeLaMercancia: Catalogo[] = [];

  /**
   * @description
   * Lista de fracciones arancelarias utilizada para modificar
   * las partidas de la mercancía.  
   * 
   * Este arreglo se recibe desde el componente padre y contiene
   * elementos del catálogo que se usarán para mostrar o seleccionar
   * la fracción correspondiente dentro del formulario.
   *
   * @type {Catalogo[]}
   */
  @Input() fraccionModificationPartidasDeLaMercancia: Catalogo[] = [];

  /**
   * @description
   * Indica si la fracción arancelaria corresponde a TIGIE.  
   * 
   * Este valor es recibido desde el componente padre y permite
   * habilitar o deshabilitar lógica específica relacionada con
   * la selección o validación de la fracción TIGIE.
   *
   * @type {boolean}
   */
  @Input() isFraccionTIGIE: boolean = false;

  /**
   * Constante que contiene los mensajes de texto utilizados en el componente.
   */
  MENSAJES_TEXTOS = MENSAJES;

  /**
   * Indica si se debe mostrar el mensaje de advertencia cuando la mercancía es requerida.
   * 
   * @remarks
   * Cuando este valor es `true`, se mostrará un mensaje informando al usuario que debe ingresar información de la mercancía.
   * 
   * @defaultValue false
   */
  @Input() mostrarMensajeMercanciaRequerida: boolean = false;

  /**
   * Indica si se debe mostrar un mensaje que informa que la fracción arancelaria es requerida.
   * 
   * @remarks
   * Cuando este valor es `true`, se mostrará un mensaje al usuario indicando que debe ingresar la fracción arancelaria.
   * 
   * @defaultValue false
   */
  @Input() mostrarMensajeFraccionArancelariaRequerida: boolean = false;

  /**
   * Identificador del procedimiento asociado al componente.
   * 
   * Este valor se utiliza para adaptar el comportamiento del componente
   * según el procedimiento específico que se esté manejando.
   */
  @Input() idProcedimiento!: number;

  /**
   * Lista de partidas de la mercancía cargadas desde un archivo JSON.
   */
  cargarArchivoJSONlisto: PartidasDeLaMercanciaModelo[] = [];

  /**
   * Evento emitido cuando se carga un archivo JSON listo.
   */
  @Output() emitCargarArchivoJSONlisto = new EventEmitter<PartidasDeLaMercanciaModelo[]>();
  
  /**
   * Constructor para inicializar el componente e inyectar dependencias.
   * FormBuilder para crear formularios reactivos.
   */
  constructor(private fb: FormBuilder) {
    //  Constructor del componente
  }

  ngOnInit(): void {
    // Add only if they do NOT exist
    this.addControlIfMissing('fraccionTigiePartidasDeLaMercancia');
    this.addControlIfMissing('fraccionDescripcionPartidasDeLaMercancia');

    this.addControlModificationMissing('fraccionTigiePartidasDeLaMercancia');
    this.addControlModificationMissing('fraccionDescripcionPartidasDeLaMercancia');
  }

  /**
 * @description
 * Agrega un control al formulario `partidasDelaMercanciaForm` si no existe.
 * 
 * Este método valida si el control indicado por su nombre ya está
 * registrado en el formulario. En caso de que no exista, lo crea con
 * un `FormControl` vacío.
 *
 * @param {string} controlName - Nombre del control a verificar o agregar.
 */
  private addControlIfMissing(controlName: string): void {
    if (!this.partidasDelaMercanciaForm.contains(controlName)) {
      this.partidasDelaMercanciaForm.addControl(
        controlName,
        new FormControl('', [])
      );
    }
  }

  /**
   * @description
   * Agrega un control al formulario `modificarPartidasDelaMercanciaForm`
   * si no existe.
   * 
   * Funciona como la versión original, pero está orientado al formulario
   * utilizado para modificar partidas de la mercancía. Solo crea el control
   * si aún no está presente en el formulario.
   *
   * @param {string} controlName - Nombre del control que se desea agregar si falta.
   */
  private addControlModificationMissing(controlName: string): void {
    if (!this.modificarPartidasDelaMercanciaForm.contains(controlName)) {
      this.modificarPartidasDelaMercanciaForm.addControl(
        controlName,
        new FormControl('', [])
      );
    }
  }


  /**
     * Método del ciclo de vida que se ejecuta cuando cambian las propiedades de entrada del componente.
     *
     * Si la propiedad `esFormularioSoloLectura` cambia, habilita o deshabilita el formulario según su valor.
     * Esto permite que el formulario se muestre en modo solo lectura o editable dinámicamente.
     *
     * @param changes - Objeto que contiene los cambios detectados en las propiedades de entrada.
     */
  ngOnChanges(changes: SimpleChanges): void {
    // Verifica si el formulario ha cambiado y actualiza su estado
    if (changes['esFormularioSoloLectura']) {
      if (this.esFormularioSoloLectura) {
        this.partidasDelaMercanciaForm.disable();
      } else if (!this.esFormularioSoloLectura) {
        this.partidasDelaMercanciaForm.enable();
      }
    }
  }

  /**
   * Verifica si un control del formulario es inválido.
   * Nombre del control en el formulario.
   * boolean Verdadero si el control es inválido, falso en caso contrario.
   */
  esInvalido(nombreControl: string): boolean {
    const CONTROL = this.partidasDelaMercanciaForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }
  /*
  
  */
  /**
   * Verifica si un control específico dentro del formulario `modificarPartidasDelaMercanciaForm` es inválido y ha sido tocado o modificado.
   * El nombre del control dentro del formulario a validar.
   * true si el control es inválido y ha sido tocado o modificado; de lo contrario, `false`.
   */
  esInvalidoModal(nombreControl: string): boolean {
    const CONTROL = this.modificarPartidasDelaMercanciaForm.get(nombreControl);
    return CONTROL ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty) : false;
  }

  /**
   * Maneja las filas seleccionadas en la tabla dinámica y emite un evento.
   * Lista de filas seleccionadas.
   */
  handleListaDeFilaSeleccionada(event: PartidasDeLaMercanciaModelo[]): void {
    this.selectedRows = event;
    if (this.selectedRows.length > 0) {
      this.isInvalidaPartidas = false;
    }
    this.filaSeleccionadaChange.emit(event);
  }

  /**
   * Valida y envía el formulario, emitiendo un evento.
   */
  validarYEnviarFormulario(): void {
    this.validarYEnviarFormularioEvent.emit();
    this.filaSeleccionadaChange.emit(this.tableBodyData);
  }

  /**
   * Navega para modificar una partida específica, emitiendo un evento.
   */
  navegarParaModificarPartida(): void {
    if (!this.selectedRows || this.selectedRows.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: 'info',
        modo: '',
        titulo: '',
        mensaje: 'Debe seleccionar un elemento',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-sm'
      };
      this.mostrarNotificacion = true;
      return;
    }
    if (this.selectedRows.length > 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: 'info',
        modo: '',
        titulo: '',
        mensaje: 'Sólo debe seleccionar un elemento',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-sm'
      };
      this.mostrarNotificacion = true;
      return;
    }
    this.modificarPartidaSeleccionada.emit(this.selectedRows[0]);

    if (this.modificarPartidaElemento) {
      const MODAL_INSTANCIA = new Modal(
        this.modificarPartidaElemento?.nativeElement,
        { backdrop: false }
      );
      MODAL_INSTANCIA.show();
    }
  }

  /**
   * Muestra una notificación para confirmar la eliminación de las partidas seleccionadas.
   * Si no hay elementos seleccionados, muestra una alerta informando al usuario que debe seleccionar al menos un elemento.
   * Si hay elementos seleccionados, muestra una notificación de confirmación para proceder con la eliminación.
   */
  confirmarEliminarPartida(): void {
    if (!this.selectedRows || this.selectedRows.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: 'info',
        modo: '',
        titulo: '',
        mensaje: 'Selecciona un registro a eliminar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-sm'
      };
      this.mostrarNotificacion = true;
      this.confirmandoEliminarPartida = false;
      return;
    }
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: 'info',
      modo: '',
      titulo: '',
      mensaje: '¿Está seguro que desea eliminar los registros marcados?',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
      tamanioModal: 'modal-md'
    };
    this.mostrarNotificacion = true;
    this.confirmandoEliminarPartida = true;
  }

  /**
   * Maneja la confirmación del modal para eliminar partidas seleccionadas.
   * Si la bandera `confirmandoEliminarPartida` está activa, elimina las partidas seleccionadas
   * y restablece la bandera. Además, oculta la notificación.
   */
  onConfirmacionModal(accion: boolean): void {
    if (this.confirmandoEliminarPartida && accion === true) {
      this.eliminarPartidasSeleccionadas();
      this.confirmandoEliminarPartida = false;
    }
    this.mostrarNotificacion = false;
  }

  /**
   * Si existen filas seleccionadas, obtiene sus identificadores y filtra la lista de datos de la tabla
   * para eliminar aquellas filas cuyos identificadores coincidan con los seleccionados. Finalmente,
   * limpia la selección de filas.
   */
  eliminarPartidasSeleccionadas(): void {
    if (this.selectedRows && this.selectedRows.length > 0) {
      const IDS_ELIMINAR = this.selectedRows.map(row => row.id);
      this.tableBodyData = this.tableBodyData.filter(row => !IDS_ELIMINAR.includes(row.id));
      this.selectedRows = [];
      this.partidasEliminadas.emit(IDS_ELIMINAR);
    }
  }
  /**
   * Cancela la modificación de una partida específica, cerrando el modal.
   */
  modalCancelar(): void {
    if (this.modificarPartidaElemento && this.modificarPartidaElemento.nativeElement) {
      const MODAL_INSTANCIA = Modal.getInstance(
        this.modificarPartidaElemento.nativeElement
      );
      if (MODAL_INSTANCIA) {
        MODAL_INSTANCIA.hide();
      }
    }
    Object.values(this.partidasDelaMercanciaForm.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });
  }
  /**
   * Emite un evento para almacenar valores en el store.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    this.setValoresStoreEvent.emit({ form, campo });
  }

  /**
   * Valida los campos del formulario antes de modificar una partida.
   */
  validarModificarPartida(): void {

    if (this.modificarPartidasDelaMercanciaForm.invalid) {
      this.mostrarErroresModal = true;
      this.modificarPartidasDelaMercanciaForm.markAllAsTouched();
      return;
    }
    this.mostrarErroresModal = false;
    const PREV = this.selectedRows[0];
    if (!PREV) { return; }

    this.partidaModificada.emit({
      id: PREV.id,
      cantidad: this.modificarPartidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')?.value,
      descripcion: this.modificarPartidasDelaMercanciaForm.get('descripcionPartidasDeLaMercancia')?.value,
      totalUSD: this.modificarPartidasDelaMercanciaForm.get('valorPartidaUSDPartidasDeLaMercancia')?.value,
      unidadDeMedida: PREV.unidadDeMedida,
      fraccionFrancelaria: PREV.fraccionFrancelaria,
      precioUnitarioUSD: PREV.precioUnitarioUSD
    });

    if (this.modificarPartidaElemento && this.modificarPartidaElemento.nativeElement) {
      const MODAL_INSTANCIA = Modal.getInstance(this.modificarPartidaElemento.nativeElement);
      if (MODAL_INSTANCIA) {
        MODAL_INSTANCIA.hide();
      }
    }
  }
  /*
  
  */
  /**
   * Método que gestiona la carga de un archivo desde un input HTML. 
   * Verifica que el archivo seleccionado exista y que su extensión sea `.csv`. 
   * Si no se selecciona ningún archivo o la extensión no es válida, muestra una notificación de error.
   * Si el archivo es válido, oculta la notificación y cierra el modal de carga.
   */
  enviarArchivo(): void {
    this.mostrarNotificacion = false;
    this.alertaArchivo = false;
    if (this.cargarArchivoJSONlisto.length > 0) {
      this.mostrarNotificacion = false;
      this.alertaArchivo = false;
      this.emitCargarArchivoJSONlisto.emit(this.cargarArchivoJSONlisto);
      this.cerrarCargarArchivoModal();
    } else {
      this.alertaArchivo = true;
      this.mostrarNotificacion = false;
    }
    // const INPUT_FILE = document.getElementById('archivoNacionales') as HTMLInputElement;
    // if (!INPUT_FILE || !INPUT_FILE.files || INPUT_FILE.files.length === 0) {
    //   this.alertaArchivo = true;
    //   this.mostrarNotificacion = false;
    //   return;
    // }
    // const FILE = INPUT_FILE.files[0];
    // const EXTENSION = FILE.name.split('.').pop()?.toLowerCase();
    // if (EXTENSION !== 'csv') {
    //   this.mostrarNotificacion = true;
    //   this.alertaArchivo = false;
    //   return;
    // }

  }
  /**
   * Maneja el evento de selección de archivo y actualiza el nombre del archivo seleccionado.
   * @param evento Evento de cambio del input de archivo.
   */
  archivoSeleccionado(evento: Event): void {
    const INPUT = evento.target as HTMLInputElement;
    if (INPUT.files && INPUT.files.length > 0) {
      this.nombreArchivoSeleccionado = INPUT.files[0].name;
      const READER = new FileReader();

      READER.onload = (): any => {
        const TEXT = READER.result as string;
        const JSON_ARRAY = archivoCSVTOJSON(TEXT);
        this.cargarArchivoJSONlisto = JSON_ARRAY;
      };

      READER.readAsText(INPUT.files[0], 'UTF-8')
    } else {
      this.nombreArchivoSeleccionado = '';
    }
  }

  /*
   * Abre el modal para cargar un archivo.
   */
  abrirCargarArchivoModal(): void {
    this.validarAntesDeCargarArchivo.emit();
  }

  /**
   * Abre un modal para cargar un archivo utilizando el elemento referenciado en `cargarArchivoElemento`.
   * Si el elemento existe, se crea una instancia de `Modal` con la opción de fondo deshabilitada (`backdrop: false`)
   * y se muestra el modal.
   */
  abrirCargarArchivoModalReal(): void {
    if (this.cargarArchivoElemento && this.cargarArchivoElemento.nativeElement) {
      const MODAL_INSTANCIA = new Modal(
        this.cargarArchivoElemento?.nativeElement,
        { backdrop: false }
      );
      MODAL_INSTANCIA.show();
    }
  }
  /*
   * Cierra el modal para cargar un archivo.
   */
  cerrarCargarArchivoModal(): void {
    if (this.cargarArchivoElemento && this.cargarArchivoElemento.nativeElement) {
      const MODAL_INSTANCIA = Modal.getInstance(
        this.cargarArchivoElemento.nativeElement
      );
      if (MODAL_INSTANCIA) {
        MODAL_INSTANCIA.hide();
      }
    }
  }

}
