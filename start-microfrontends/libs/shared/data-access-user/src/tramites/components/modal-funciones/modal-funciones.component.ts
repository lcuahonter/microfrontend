import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { Notificacion } from '../notificaciones/notificaciones.component';
import { TITULO_MODAL_AVISO } from '../../constantes/terceros.enums';

@Component({
  selector: 'lib-modal-funciones',
  standalone: true,
  imports: [CommonModule, ModalModule],
  templateUrl: './modal-funciones.component.html',
  styleUrl: './modal-funciones.component.scss',
})
export class ModalFuncionesComponent implements OnChanges {
  /**
   * Titulo del modal
   */
  @Input() titulo: string = 'Anexar nuevo documento';
  /**
   * Descripcion del modal
   */
  @Input() descripcion: string = '';
  /**
   * es un decorador de entrada (@Input) que define el tamaño máximo permitido para un archivo que se puede cargar en el modal. Su valor predeterminado es 10, lo que significa que, por defecto, el tamaño máximo permitido es de 10 MB.
   */
  @Input() maxSizeMB: number = 10;
  /**
   * Tipo de archivo aceptado
   */
  @Input() aceptado: string = 'application/pdf';
  /**
   * se enecarga de abrir el modal
   */
  @Input() abrirModal: boolean = false;
  /**
   * declara una propiedad de salida (@Output) llamada archivoSeleccionado que utiliza un EventEmitter para emitir eventos con un valor de tipo File.
   */
  @Output() archivoSeleccionado = new EventEmitter<File>();
  /**
   * se encarga de cerrar el modal
   */
  @Output() cerrar = new EventEmitter<void>();
  /**
   * se encarga de mostrar el modal
   */
  public mostrarModal: boolean = false;
  /** 
 * Configuración para la notificación actual.
 */
  public nuevaNotificacion: Notificacion | null = null;
  /**
   * Referencia al modal automático mostrado.
   * Utiliza `ModalDirective` para controlar su comportamiento.
   */
  @ViewChild('modal', { static: false }) modal?: ModalDirective;
  /**
   * archivo es una propiedad opcional que representa un archivo seleccionado por el usuario. Se utiliza para almacenar el archivo que se va a cargar o procesar en el componente.
   * Esta propiedad es de tipo File, lo que significa que puede contener información sobre el archivo, como su nombre, tipo y tamaño.
   */
  archivo?: File;
  /** 
   * se encarga de manejar el evento cuando un archivo es seleccionado en un campo de entrada (<input type="file">). Su propósito principal es validar el archivo seleccionado y almacenarlo si cumple con los criterios definidos.
   * @param event 
   * @returns 
   */
  onArchivoChange(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    const ARCHIVO = INPUT.files?.[0];
    if (ARCHIVO) {
      if (ARCHIVO.type !== this.aceptado) {
        this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: TITULO_MODAL_AVISO,
          mensaje: 'Tipo de archivo no permitido',
          cerrar: false,
          tiempoDeEspera: 2000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        }
        return;
      }
      if (ARCHIVO.size > this.maxSizeMB * 1024 * 1024) {
        this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: TITULO_MODAL_AVISO,
          mensaje: 'El tamaño del archivo excede el límite permitido de ' + this.maxSizeMB + ' MB',
          cerrar: false,
          tiempoDeEspera: 2000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        }
        return;
      }
      this.archivo = ARCHIVO;
      /**
       * Si el archivo es válido, la funcionalidad de guardar el archivo se implementará después de que se encuentre el api 
       * y se defina el destino del archivo.
       */
      // Aquí puedes agregar la lógica para guardar el archivo o realizar otras acciones necesarias.
      const NOMBRE_ARCHIVO = ARCHIVO.name;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const EXTENSION_ARCHIVO = NOMBRE_ARCHIVO.split('.').pop()?.toLowerCase();
    }
  }
  /**
   *  Callback que se ejecuta cuando el componente recibe cambios en sus entradas.
   *  Si la propiedad abrirModal cambia a true, se muestra el modal.
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abrirModal'] && changes['abrirModal'].currentValue) {
      if (this.abrirModal) {
        this.mostrarModal = true;
      }
    }
  }
  /**
   * Callback que se ejecuta cuando el modal se oculta. Cambia el estado de mostrarModal a false.
   */
  onHidden(): void {
    this.mostrarModal = false;
  }
  /**
   * Emite el archivo seleccionado si es válido, a través del archivoSeleccionado.
   */
  anexar(): void {
    if (this.archivo) {
      this.archivoSeleccionado.emit(this.archivo);
      this.archivo = undefined;
      this.cerrarModal();
    }
  }
  /**
   * Cierra el modal y emite un evento de cierre.
   */
  cerrarModal(): void {
    this.mostrarModal = false;
    this.cerrar.emit();
  }
}
