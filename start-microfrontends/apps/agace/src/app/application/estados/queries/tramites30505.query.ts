import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Solicitud30505State } from '../tramites/tramites30505.store';
import { Solicitud30505Store } from '../tramites/tramites30505.store';


/**
 * Servicio de consulta (Query) para la solicitud 30505.
 * Permite acceder y suscribirse a los cambios en el estado de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud30505Query extends Query<Solicitud30505State> {

  /**
   * Observable que selecciona y emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta de la solicitud 30505.
   * @param store - Almacén de estado de la solicitud.
   */
  constructor(
    protected override store: Solicitud30505Store) {
    super(store);
  }
}
