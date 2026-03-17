import { Solicitud30901State, Solicitud30901Store } from './tramites30901.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta (Query) para la solicitud 30901.
 * Permite acceder y suscribirse a los cambios en el estado de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud30901Query extends Query<Solicitud30901State> {

  /**
   * Observable que selecciona y emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta de la solicitud 30901.
   * @param store - Almacén de estado de la solicitud.
   */
  constructor(
    protected override store: Solicitud30901Store) {
    super(store);
  }
}
