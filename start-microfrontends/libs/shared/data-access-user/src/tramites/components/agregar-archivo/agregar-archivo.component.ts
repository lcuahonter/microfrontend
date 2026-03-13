import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * AgregarArchivoComponent is a reusable component for handling file upload and item addition actions.
 * It provides two buttons: one for file upload and another for adding items.
 * Each button emits an event when clicked.
 *
 */

@Component({
  selector: 'app-agregar-archivo',
  templateUrl: './agregar-archivo.component.html',
  styleUrl: './agregar-archivo.component.scss',
  standalone: true,
  imports: [],
})
export class AgregarArchivoComponent {
   /**
   * La etiqueta para el botón de acción del archivo.
   * @type {string}
   * @default 'Carga por archivo'
   */
    @Input() archivoBtn: string = 'Carga por archivo';

   /**
     * La etiqueta para el botón de acción de agregar.
     * @type {string}
     * @default 'Agregar'
     */
    @Input() agregarBtn: string = 'Agregar';
  
    /**
     * Evento emitido cuando se hace clic en el botón de acción del archivo.
     * @event archivoAction
     */

    @Output() archivoAction = new EventEmitter<void>();
  
    /**
     * Evento emitido cuando se hace clic en el botón de acción de agregar.
     * @event agregarAction
     */
    @Output() agregarAction = new EventEmitter<void>();
  
    /**
     * Maneja el evento de clic para el botón de acción del archivo.
     * Emite el evento `archivoAction`.
     */
    onArchivoClick():void {
      this.archivoAction.emit();
    }
  
    /**
     * Maneja el evento de clic para el botón de acción de agregar.
     * Emite el evento `agregarAction` para notificar a los componentes padres.
     */
    onAgregarClick():void {
      this.agregarAction.emit()
    }
}
