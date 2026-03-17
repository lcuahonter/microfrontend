import { AnexarDocumentosComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';

import { Component, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common';

import { CargaPorArchivoComponent } from '../../../../shared/components/carga-por-archivo/carga-por-archivo.component';

@Component({
  selector: 'app-proveedor-por-archivo-vista',
  standalone: true,
  imports: [CommonModule, AnexarDocumentosComponent,CargaPorArchivoComponent],
  templateUrl: './proveedor-por-archivo-vista.component.html',
  styleUrl: './proveedor-por-archivo-vista.component.scss',
})
/**
 * Componente para la vista de proveedores por archivo.
 * Este componente permite gestionar la visualización y anexar documentos relacionados con los proveedores.
 *
 * @export ProveedorPorArchivoVistaComponent
 */
export class ProveedorPorArchivoVistaComponent {

  /**
   * Constructor del componente.
   * @param ubicaccion Servicio de ubicación para navegación.
   */
  constructor( private ubicaccion: Location){
    //El constructor requiere inyección de dependencias, pero se ha mantenido vacío debido a una regla de ESLint.
  }
 /**
     * Evento que se emite para cerrar el popup actual.
     *
     * Notifica al componente padre que se debe cerrar el popup.
     * No envía ningún dato, solo indica la acción de cierre.
     */
    @Output() cerrarPopup = new EventEmitter<void>();
  /**
   * Método para regresar al anexo I.
   */
  regrsarAnnexoI(): void {
    this.ubicaccion.back();
  }
}
