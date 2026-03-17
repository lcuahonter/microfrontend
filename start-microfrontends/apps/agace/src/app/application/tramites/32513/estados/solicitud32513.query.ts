import { Solicitud32513State, Solicitud32513Store } from './solicitud32513.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta (Query) para la solicitud 32513.
 * Permite acceder y suscribirse a los cambios en el estado de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud32513Query extends Query<Solicitud32513State> {

  /**
   * Observable que selecciona y emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta de la solicitud 32513.
   * @param store - Almacén de estado de la solicitud.
   */
  constructor(
    protected override store: Solicitud32513Store) {
    super(store);
  }
}
