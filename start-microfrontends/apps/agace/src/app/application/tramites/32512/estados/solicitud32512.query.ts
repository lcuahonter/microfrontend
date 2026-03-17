import { Solicitud32512State, Solicitud32512Store } from './solicitud32512.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta (Query) para la solicitud 32512.
 * Permite acceder y suscribirse a los cambios en el estado de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud32512Query extends Query<Solicitud32512State> {

  /**
   * Observable que selecciona y emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta de la solicitud 32512.
   * @param store - Almacén de estado de la solicitud.
   */
  constructor(
    protected override store: Solicitud32512Store) {
    super(store);
  }
}
