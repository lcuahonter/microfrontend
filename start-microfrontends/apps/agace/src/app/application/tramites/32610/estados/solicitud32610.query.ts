import { Solicitud32610State, Solicitud32610Store } from './solicitud32610.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta (Query) para la solicitud 32610.
 * Permite acceder y suscribirse a los cambios en el estado de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud32610Query extends Query<Solicitud32610State> {

  /**
   * Observable que selecciona y emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta de la solicitud 32610.
   * @param store - Almacén de estado de la solicitud.
   */
  constructor(
    protected override store: Solicitud32610Store) {
    super(store);
  }
}
