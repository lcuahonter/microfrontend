/* eslint-disable @typescript-eslint/no-explicit-any */
import { ALERTARCHIVOMSG, PARTIDASDELAMERCANCIA_TABLA, TEXTOS } from '../../../../shared/constantes/partidas-de-la-mercancia.enum';
import { Catalogo, ConfiguracionColumna, Notificacion, TipoNotificacionEnum } from '@ng-mf/data-access-user';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotificacionesComponent,TituloComponent} from '@ng-mf/data-access-user';
import { AlertComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { MENSAJES } from '../../constants/importacion-material-de-investigacion-cientifica-pasos.enum';
import { Modal } from 'bootstrap';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

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
    AlertComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    TooltipModule,
    NotificacionesComponent
  ],
  templateUrl: './partidas-de-la-mercancia.component.html',
  styleUrl: './partidas-de-la-mercancia.component.scss',
})
export class PartidasDeLaMercanciaComponent implements OnChanges {
  /**
   *  Indica si se debe mostrar una alerta de archivo.
   */
  alertaArchivo = false;
  /**
   * Textos utilizados en el componente.
   * @type {typeof TEXTOS}
   */
  TEXTOS = TEXTOS;

  /*
   * @descripcion Mensaje de alerta para el archivo.
   */
  ALERTARCHIVOMSG = ALERTARCHIVOMSG ;
    /**
   * modificarPartidasDelaMercanciaForm
   * Formulario reactivo para modificar las partidas.
   */
  @Input() modificarPartidasDelaMercanciaForm!: FormGroup;
    /**
   * confirmandoEliminarPartida
   * Bandera que indica si se está confirmando la eliminación de una partida específica.
   */
  confirmandoEliminarPartida = false;
    /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;
  /*
   * @Input() mostrarErroresModal
   * Bandera que indica si se deben mostrar los mensajes de error en el modal.
   */
  mostrarErroresModal = false;
    /*
   * @descripcion Indica si se debe mostrar una notificación.
   */
  mostrarNotificacion = false;
    /**
   * Evento emitido cuando se modifica una partida seleccionada.
   */
  @Output() partidaModificada = new EventEmitter<PartidasDeLaMercanciaModelo>();
  /**
   * @Input() mostrarErrores
   * Bandera que indica si se deben mostrar los mensajes de error en el formulario.
   */
  @Input() mostrarErrores: boolean = false;
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
   * formForTotalCount
   * Formulario reactivo para capturar los totales de las partidas.
   */
  @Input() formForTotalCount!: FormGroup;

  /**
   * Configuración de las columnas de la tabla dinámica.
   * Este campo define las columnas que se mostrarán en la tabla, incluyendo encabezados y claves.
   */
  @Input()
  tableHeaderData: ConfiguracionColumna<PartidasDeLaMercanciaModelo>[] =
    PARTIDASDELAMERCANCIA_TABLA;

  /**
   * Datos que se mostrarán en la tabla dinámica.
   * Este campo contiene las filas de datos que se renderizarán en el cuerpo de la tabla.
   */
  @Input() tableBodyData: PartidasDeLaMercanciaModelo[] = [];

  /**
   * mostrarTabla
   * Bandera para mostrar u ocultar la tabla dinámica.
   */
  @Input() mostrarTabla = true;

  /**
   * Lista de elementos del catálogo de fracciones arancelarias.
   */
  @Input() fraccionDescripcionPartidasDeLaMercancia: Catalogo[] = [];

  /**
   * Bandera para deshabilitar la tabla dinámica.
   * Si está configurada como `true`, la tabla estará deshabilitada.
   */
  @Input() disabled: boolean = false;

  /**
   * filaSeleccionadaChange
   * Evento que emite las filas seleccionadas en la tabla dinámica.
   */
  @Output() filaSeleccionadaChange = new EventEmitter<any[]>();

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
  @Output() setValoresStoreEvent = new EventEmitter<{
    form: FormGroup;
    campo: string;
  }>();

  /**
   * Tipo de selección de la tabla dinámica (checkbox).
   */
  CHECKBOX = TablaSeleccion.CHECKBOX;

  /**
   * Constante que contiene los mensajes de texto utilizados en el componente.
   */
  MENSAJES_TEXTOS = MENSAJES;

  /**
   * Referencia al elemento del DOM asociado con el archivo de nacionales.
   * Utilizado para acceder y manipular directamente el elemento en la plantilla.
   */
  @ViewChild('archivoNacionales') archivoNacionalesElemento!: ElementRef;
   /*
   * Evento emitido cuando se eliminan partidas de la tabla.
   */
  @Output() partidasEliminadas = new EventEmitter<string[]>();
  
  /**
   * @description Referencia al elemento de la partida que se va a modificar.
   */
  @ViewChild('modificarPartidaModal') modificarPartidaElemento!: ElementRef;
    /**
   * Evento emitido cuando se modifica una partida seleccionada.
   */
  @Output() modificarPartidaSeleccionada = new EventEmitter<PartidasDeLaMercanciaModelo>();
    /**
   * Evento emitido antes de cargar un archivo, permitiendo realizar validaciones previas.
   */
  @Output() validarAntesDeCargarArchivo = new EventEmitter<void>();
    /**
   * @ViewChild('cargarArchivo') cargarArchivoElemento
   * Referencia al elemento del DOM para el modal de carga de archivos.
   */
  @ViewChild('cargarArchivo') cargarArchivoElemento!: ElementRef;		

  /**
   * Nombre del archivo seleccionado por el usuario.
   */
  nombreArchivoSeleccionado: string = '';
    /**
   * selectedRows
   * Arreglo de filas seleccionadas en la tabla dinámica de partidas de la mercancía.
   */
  selectedRows: PartidasDeLaMercanciaModelo[] = [];

  /**
   * Constructor para inicializar el componente e inyectar dependencias.
   * FormBuilder para crear formularios reactivos.
   */
  constructor(private fb: FormBuilder) {
    //  Constructor del componente
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
      } else {
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

  /**
   * Maneja las filas seleccionadas en la tabla dinámica y emite un evento.
   * Lista de filas seleccionadas.
   */
  handleListaDeFilaSeleccionada(event: PartidasDeLaMercanciaModelo[]): void {
    this.selectedRows = event;
    this.filaSeleccionadaChange.emit(event);
  }

  /**
   * Valida y envía el formulario, emitiendo un evento.
   */
  validarYEnviarFormulario(): void {
    this.validarYEnviarFormularioEvent.emit();
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
        tamanioModal:'modal-sm'
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
        tamanioModal:'modal-sm'
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
   * Maneja el evento de selección de archivo y actualiza el nombre del archivo seleccionado.
   * @param evento Evento de cambio del input de archivo.
   */
  archivoSeleccionado(evento: Event): void {
    const INPUT = evento.target as HTMLInputElement;
    if (INPUT.files && INPUT.files.length > 0) {
      this.nombreArchivoSeleccionado = INPUT.files[0].name;
    } else {
      this.nombreArchivoSeleccionado = '';
    }
  }

  /**
   * Emite un evento para almacenar valores en el store.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    this.setValoresStoreEvent.emit({ form, campo });
  }
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

  /**
 * Método que gestiona la carga de un archivo desde un input HTML. 
 * Verifica que el archivo seleccionado exista y que su extensión sea `.csv`. 
 * Si no se selecciona ningún archivo o la extensión no es válida, muestra una notificación de error.
 * Si el archivo es válido, oculta la notificación y cierra el modal de carga.
 */
  enviarArchivo(): void {
  const INPUT_FILE = document.getElementById('archivoNacionales') as HTMLInputElement;
  if (!INPUT_FILE || !INPUT_FILE.files || INPUT_FILE.files.length === 0) {
    this.alertaArchivo = true;
    this.mostrarNotificacion = false;
    return;
  }
  const FILE = INPUT_FILE.files[0];
  const EXTENSION = FILE.name.split('.').pop()?.toLowerCase();
  if (EXTENSION !== 'csv') {
    this.mostrarNotificacion = true;
    this.alertaArchivo = false; 
    return;
  }
  this.mostrarNotificacion = false;
  this.alertaArchivo = false;
  this.cerrarCargarArchivoModal();
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
}