import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';
import { Tramite240117Store } from '../../estados/tramite240117Store.store';

/**
 * @title Datos de la Mercancía Contenedora
 * @description Componente contenedor encargado de recibir los datos de mercancía y actualizar el estado global del trámite.
 * @summary Actúa como puente entre el componente de datos de mercancía y el store de Akita.
 */
/**
 * Componente que representa los datos de mercancía contenedora.
 *
 * Este componente es parte del trámite 240117 y se encarga de gestionar
 * y actualizar los datos de mercancías en el store correspondiente.
 *
 * @selector app-datos-mercancia-contenedora
 * @standalone true
 * @imports CommonModule, DatosMercanciaComponent
 * @templateUrl ./datos-mercancia-contenedora.component.html
 * @styleUrl ./datos-mercancia-contenedora.component.scss
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
   * Identificador del procedimiento asociado al trámite.
   * Este valor se utiliza para identificar el trámite específico en el store.
   *
   * @type {number}
   */
  idProcedimiento = NUMERO_TRAMITE.TRAMITE_240117;

  /**
   * Evento que se emite cuando se cierra el componente.
   * Este evento permite a los componentes padres reaccionar al cierre del modal.
   *
   * @type {EventEmitter<void>}
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240117Store} tramiteStore - Store de Akita para actualizar el estado de la tabla de mercancías.
   * @returns {void}
   */
  // eslint-disable-next-line no-empty-function
  constructor(private tramiteStore: Tramite240117Store) { }

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
