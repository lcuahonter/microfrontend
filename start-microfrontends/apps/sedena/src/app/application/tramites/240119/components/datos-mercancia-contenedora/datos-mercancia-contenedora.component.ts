import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { Tramite240119Store } from '../../estados/tramite240119Store.store';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';

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
   * Evento emitido para cerrar el componente.
   *
   * @type {EventEmitter<void>}
   * @memberof DatosMercanciaContenedoraComponent
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240119Store} tramiteStore - Store de Akita para actualizar el estado de la tabla de mercancías.
   * @returns {void}
   */
  constructor(private tramiteStore: Tramite240119Store) { }

  /**
 * @property {boolean} estaOculto - Indica si el elemento está oculto o visible.
 * @remarks Este valor determina la visibilidad del componente en la interfaz de usuario.
 * @command Cambiar el valor de esta propiedad para alternar la visibilidad.
 */
  public readonly idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240119;

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
