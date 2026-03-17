import { SolicitudState, SolicitudStore } from './solicitud.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta (Query) para la solicitud 32605.
 * Permite acceder y suscribirse a los cambios en el estado de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class SolicitudQuery extends Query<SolicitudState> {

  /**
   * Observable que selecciona y emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta de la solicitud 32605.
   * @param store - Almacén de estado de la solicitud.
   */
  constructor(
    protected override store: SolicitudStore) {
    super(store);
  }
}
