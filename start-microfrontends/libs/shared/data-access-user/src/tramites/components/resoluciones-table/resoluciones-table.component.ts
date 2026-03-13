import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interface que define la estructura de una fila en la tabla de resoluciones.
 */
export interface ResolucionDocumento {
  no: number;
  documento: string;
  archivo?: string; // base64 o url
  nombreArchivo?: string;
}

@Component({
  selector: 'app-resoluciones-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resoluciones-table.component.html',
  styleUrls: ['./resoluciones-table.component.scss']
})
export class ResolucionesTableComponent {
  /**
   * Datos a mostrar en la tabla.
   */
  @Input() data: ResolucionDocumento[] = [];

  /**
   * Evento que se emite cuando se solicita la descarga de un documento.
   */
  @Output() descargar = new EventEmitter<ResolucionDocumento>();

  /**
   * Maneja el evento de descarga de un documento.
   * @param item El documento a descargar.
   */
  onDescargar(item: ResolucionDocumento): void {
    this.descargar.emit(item);
  }
}
