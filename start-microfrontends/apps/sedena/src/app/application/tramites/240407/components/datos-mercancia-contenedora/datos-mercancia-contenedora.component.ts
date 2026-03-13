import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { Tramite240407Store } from '../../estados/tramite240407Store.store';

/**
 * title Datos de la Mercancía Contenedora
 * description Componente contenedor encargado de recibir los datos de mercancía y actualizar el estado global del trámite.
 * summary Actúa como puente entre el componente de datos de mercancía y el store de Akita.
 */

@Component({
  selector: 'app-datos-mercancia-contenedora',
  standalone: true,
  imports: [CommonModule, DatosMercanciaComponent],
  templateUrl: './datos-mercancia-contenedora.component.html',
  styleUrl: './datos-mercancia-contenedora.component.scss',
})
export class DatosMercanciaContenedoraComponent {
   @Output() cerrar = new EventEmitter<void>();
  /**
   * Constructor del componente.
   *
   * method constructor
   * param {Tramite240407Store} tramiteStore - Store de Akita para actualizar el estado de la tabla de mercancías.
   * returns {void}
   */
  // eslint-disable-next-line no-empty-function
  constructor(private tramiteStore: Tramite240407Store) {}

  /**
   * Actualiza los datos de la tabla de mercancía en el store.
   *
   * method updateMercanciaDetalle
   * param {MercanciaDetalle[]} event - Lista de mercancías actualizada desde el formulario.
   * returns {void}
   */
  updateMercanciaDetalle(event: MercanciaDetalle[]): void {
    this.tramiteStore.updateMercanciaTablaDatos(event);
    this.cerrar.emit();
  }
}
