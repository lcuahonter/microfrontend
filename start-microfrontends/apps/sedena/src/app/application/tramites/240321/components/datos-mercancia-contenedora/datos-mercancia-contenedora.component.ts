import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { Tramite240321Store } from '../../estados/tramite240321Store.store';
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
  * @property {number} idProcedimiento
  * Identificador numérico del procedimiento asociado al trámite.
  * En este caso, corresponde al trámite 240321.
  */
  public readonly idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240321;

  /**
   * Observable para limpiar suscripciones activas al destruir el componente.
   * @property {Subject<void>} unsubscribe$
   */
  private unsubscribe$ = new Subject<void>();

  /**
* Indica si el formulario debe mostrarse en modo solo lectura.
*
* @type {boolean}
* @memberof AgregarDestinatarioFinalContenedoraComponent
* @see https://compodoc.app/
*/
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240321Store} tramiteStore - Store de Akita para actualizar el estado de la tabla de mercancías.
   * @param {ConsultaioQuery} consultaioQuery - Query para obtener el estado de la consulta.
   * @see https://compodoc.app/
   * @returns {void}
   */
  constructor(private tramiteStore: Tramite240321Store, private readonly consultaioQuery: ConsultaioQuery) { }

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
