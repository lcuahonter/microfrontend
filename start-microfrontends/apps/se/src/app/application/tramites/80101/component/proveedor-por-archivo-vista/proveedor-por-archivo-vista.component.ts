import { Component, EventEmitter, Output } from '@angular/core';
import { CargaPorArchivoComponent } from '../../../../shared/components/carga-por-archivo/carga-por-archivo.component';
import { CommonModule } from '@angular/common';

/**
 * Componente para la vista de anexar documentos en el trámite 80101.
 * Este componente permite a los usuarios adjuntar documentos necesarios
 * para completar el proceso de solicitud.
 *
 * @remarks
 * Este componente es autónomo y utiliza el módulo `CommonModule` y el componente `AnexarDocumentosComponent`.
 */
@Component({
  selector: 'app-proveedor-por-archivo-vista',
  standalone: true,
  imports: [CommonModule, CargaPorArchivoComponent],
  templateUrl: './proveedor-por-archivo-vista.component.html',
  styleUrl: './proveedor-por-archivo-vista.component.scss',
})
export class ProveedorPorArchivoVistaComponent {


   /**
     * Evento que se emite para cerrar el popup actual.
     *
     * Notifica al componente padre que se debe cerrar el popup.
     * No envía ningún dato, solo indica la acción de cierre.
     */
    @Output() cerrarPopup = new EventEmitter<void>();
}
