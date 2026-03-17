/**
 *  datos-mercancia-contenedora.component.ts
 *  Componente Angular para manejar los datos de mercancía en un trámite específico.
 */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { Tramite240308Store } from '../../estados/tramite240308Store.store';
import { ID_PROCEDIMIENTO } from '../../constants/solicitude-de-artificios-pirotecnicos.enum';

/**
 *  Datos de la Mercancía Contenedora
 *  Componente contenedor encargado de recibir los datos de mercancía y actualizar el estado global del trámite.
 *  Actúa como puente entre el componente de datos de mercancía y el store de Akita.
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
   * Evento que se emite para cerrar el modal de datos de mercancía.
   * @property {EventEmitter<void>} cerrar
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240308Store} tramiteStore - Store de Akita para actualizar el estado de la tabla de mercancías.
   * @returns {void}
   */

  /**
   * Identificador del procedimiento.
   * Constante que define el ID único del procedimiento actual.
   * 
   * @constant {number} idProcedimiento
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  // eslint-disable-next-line no-empty-function
  constructor(private tramiteStore: Tramite240308Store) { }

  /**
   * Actualiza los datos de la tabla de mercancía en el store.
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
