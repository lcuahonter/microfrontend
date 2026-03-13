import { Solicitud32608State, Solicitud32608Store } from './solicitud32608.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta (Query) para la solicitud 32608.
 * Permite acceder y suscribirse a los cambios en el estado de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud32608Query extends Query<Solicitud32608State> {

  /**
   * Observable que selecciona y emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta de la solicitud 32608.
   * @param store - Almacén de estado de la solicitud.
   */
  constructor(
    protected override store: Solicitud32608Store) {
    super(store);
  }
}
