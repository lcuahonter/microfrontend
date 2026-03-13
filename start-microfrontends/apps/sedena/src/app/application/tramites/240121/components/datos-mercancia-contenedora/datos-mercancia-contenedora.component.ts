import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { ID_PROCEDIMIENTO } from '../../constantes/exportacion-armas-explosivo.enum';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { Tramite240121Store } from '../../estados/tramite240121Store.store';

/**
 * @title Datos de la Mercancía Contenedora
 * @description Componente contenedor encargado de recibir los datos de mercancía y actualizar el estado global del trámite.
 * @summary Actúa como puente entre el componente de datos de mercancía y el store de Akita.
 */

@Component({
  selector: 'app-datos-mercancia-contenedora',
  standalone: true,
  imports: [CommonModule, DatosMercanciaComponent],
  templateUrl: './datos-mercancia-contenedora.component.html',
  styleUrl: './datos-mercancia-contenedora.component.scss',
})
export class DatosMercanciaContenedoraComponent {
  /**
   * @event cerrar
   * @description Evento emitido para indicar que se debe cerrar el componente.
   * @remarks
   * Este evento no envía ningún valor, simplemente notifica a los componentes padres que se debe realizar la acción de cierre.
   * 
   * @eventType void
   * @es
   * Evento que se dispara para cerrar el componente actual.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Identificador del procedimiento.
   * Constante que define el ID único del procedimiento actual.
   * 
   * @constant {number} idProcedimiento
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Constructor del componente.
   * Inicializa el componente y permite la inyección del store de Akita.
   *
   * @method constructor
   * @param {Tramite240121Store} tramiteStore - Store de Akita para actualizar el estado de la tabla de mercancías.
   * @returns {void}
   */
  constructor(private tramiteStore: Tramite240121Store) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * Actualiza los datos de la tabla de mercancía en el store.
   * Este método se utiliza para recibir los datos actualizados desde el formulario
   * y sincronizarlos con el estado global del trámite.
   *
   * @method updateMercanciaDetalle
   * @param {MercanciaDetalle[]} event - Lista de mercancías actualizada desde el formulario.
   * @returns {void}
   */
  updateMercanciaDetalle(event: MercanciaDetalle[]): void {
    this.tramiteStore.updateMercanciaTablaDatos(event);
    this.cerrar.emit();
  }
}
