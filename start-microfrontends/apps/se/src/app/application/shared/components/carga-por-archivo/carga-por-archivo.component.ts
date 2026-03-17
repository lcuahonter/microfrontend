import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, Output } from '@angular/core';
import { TABLA_DATOS, TEXTOS } from '../../constantes/carga-por-archivo.enum';
import { CommonModule } from '@angular/common';
import { ComplimentosService } from '../../services/complimentos.service';

import { Notificacion, NotificacionesComponent,TituloComponent} from '@libs/shared/data-access-user/src';

/**
 * Componente encargado de gestionar la carga de archivos para la capacidad instalada.
 * Permite al usuario seleccionar un archivo, visualizar el nombre del archivo seleccionado
 * y muestra información y ayudas sobre el formato y los campos requeridos.
 */
@Component({
  selector: 'app-carga-por-archivo',
  standalone: true,
  imports: [CommonModule, TituloComponent, NotificacionesComponent],
  templateUrl: './carga-por-archivo.component.html',
  styleUrl: './carga-por-archivo.component.scss',
})

export class CargaPorArchivoComponent {

    /**
     * Notificación que se muestra al usuario.
     */
    public nuevaNotificacion!: Notificacion;

  /** Contiene los textos y mensajes utilizados en el componente para mostrar información y ayudas al usuario. */
  public TEXTOS = TEXTOS;

  /** Arreglo que contiene la información de las columnas y su posición para mostrar en la tabla de ejemplo de carga por archivo. */
  public tablaDatos: { posicion: number, dato: string }[] = TABLA_DATOS;

  /** Almacena el nombre del archivo seleccionado por el usuario para la carga por archivo. */
  public filaSeleccionadaNombre: string | null = null;
  archivoSeleccionado:File |null = null;
  /**
   * Evento que se emite al cerrar el popup.
   * 
   * Se utiliza para notificar al componente padre que el popup ha sido cerrado.
   */
  @Output() cerrarPopup = new EventEmitter<void>();
  

  /**
   * Constructor de la clase CargaPorArchivoComponent.
   * @param {Router} router - Servicio de Angular para la navegación.
   * @param {ActivatedRoute} activatedRoute - Servicio de Angular para obtener información sobre la ruta actual.
   */
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private cs: ComplimentosService) {}

  /**
   * Navega a la ruta de acciones
   */
  cambioPathe(): void {
    if(this.filaSeleccionadaNombre) {
      const EXT = this.filaSeleccionadaNombre.split('.').pop()?.toLowerCase();
      if (EXT !== 'xlsx' && EXT !== 'csv' && EXT !== 'txt') {
        this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Error, Formato de archivo incorrecto.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.filaSeleccionadaNombre=null;
      this.archivoSeleccionado=null;
      return;
    }
  }

     if (!this.archivoSeleccionado) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe elegir un registro de complemento para actualizar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
  if(this.archivoSeleccionado!==null){
  this.cs.uploadCapacidad(this.archivoSeleccionado).subscribe({
    next: () => {
       this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'La operación se realizó exitosamente.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    },
    error: () => {
      this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Ocurrió un error al cargar el archivo, contacte a soporte técnico.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    }
  });
    this.filaSeleccionadaNombre=null;
    this.archivoSeleccionado=null;
  }
}

  layoutArchivoDownload(): void {
    this.cs.getLayoutArchivo(1).subscribe({
      next: (data) => {
        if (data?.codigo === "00" && data?.datos?.contenido) {
          CargaPorArchivoComponent.manejarArchivo(
            data.datos.contenido,
            data.datos.llave_archivo,
           'descargar'
          );
        }
      },
    });
  }

  /**
  * Método genérico para manejar un PDF en base64.
  *
  * @param base64 Contenido del PDF en base64.
  * @param nombreArchivo Nombre del archivo a descargar (si aplica).
  * @param accion 'abrir' para abrir en pestaña o 'descargar' para forzar descarga.
  */
 static manejarArchivo(
  BASE64: string,
  NOMBRE_ARCHIVO: string,
  ACCION: 'abrir' | 'descargar'
): void {

  const BASE64_LIMPIO = BASE64.includes(',')
    ? BASE64.split(',')[1]
    : BASE64;

  const BYTE_CHARACTERS = atob(BASE64_LIMPIO);
  const BYTE_NUMBERS = new Array(BYTE_CHARACTERS.length);

  for (let i = 0; i < BYTE_CHARACTERS.length; i++) {
    BYTE_NUMBERS[i] = BYTE_CHARACTERS.charCodeAt(i);
  }

  const BYTE_ARRAY = new Uint8Array(BYTE_NUMBERS);

  const MIME_TYPE = this.obtenerMimeType(NOMBRE_ARCHIVO);

  const BLOB = new Blob([BYTE_ARRAY], { type: MIME_TYPE });
  const URLCODIFICADA = URL.createObjectURL(BLOB);

  if (ACCION === 'abrir') {
    window.open(URLCODIFICADA, '_blank');
    return;
  }

  const LINK = document.createElement('a');
  LINK.href = URLCODIFICADA;
  LINK.download = NOMBRE_ARCHIVO;
  LINK.click();

  URL.revokeObjectURL(URLCODIFICADA);
}

static obtenerMimeType(NOMBRE_ARCHIVO: string): string {
  const EXT = NOMBRE_ARCHIVO.split('.').pop()?.toLowerCase();

  switch (EXT) {
    case 'pdf':
      return 'application/pdf';
    case 'zip':
      return 'application/zip';
    case 'xml':
      return 'application/xml';
    case 'txt':
      return 'text/plain';
    case 'csv':
      return 'text/csv';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    default:
      return 'application/octet-stream'; 
  }
}




  /**
   * Cierra el popup de carga por archivo.
   * 
   * Emite el evento `cerrarPopup` para notificar al componente padre que
   * se debe cerrar el popup correspondiente.
   */
  cerrarCargaPorArchivo(): void {
    this.cerrarPopup.emit();
  }

  /**
   * Maneja el evento de selección de archivo y asigna el nombre del archivo seleccionado a la variable correspondiente.
   * @param event - Evento de cambio del input de archivo.
   */
  onFilaSeleccionada(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    if (INPUT.files && INPUT.files.length > 0) {
       this.filaSeleccionadaNombre = INPUT.files[0].name;
      this.archivoSeleccionado = INPUT.files[0]; 
    }
  }

  /**
   * Devuelve el nombre del archivo seleccionado o el texto por defecto si no hay archivo seleccionado.
   * @returns {string} Nombre del archivo o texto por defecto.
   */
  get fila(): string {
    return this.filaSeleccionadaNombre ? this.filaSeleccionadaNombre : this.TEXTOS.CARGA_DE_ARCHIVO_DE_TEXTO;
  }
}
