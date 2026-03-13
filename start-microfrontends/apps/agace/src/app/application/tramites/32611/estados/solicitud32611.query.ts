import { Solicitud32611State, Solicitud32611Store } from './solicitud32611.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta (Query) para la solicitud 32611.
 * Permite acceder y suscribirse a los cambios en el estado de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud32611Query extends Query<Solicitud32611State> {

  /**
   * Observable que selecciona y emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta de la solicitud 32611.
   * @param store - Almacén de estado de la solicitud.
   */
  constructor(
    protected override store: Solicitud32611Store) {
    super(store);
  }
}
