import { Solicitud290301State, Solicitud290301Store } from './tramite290301.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
/** Clase para realizar consultas sobre el estado de Solicitud290301 */
export class Solicitud290301Query extends Query<Solicitud290301State> {

  /** Selección del estado completo de la solicitud */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase Solicitud290301Query
   * @param store - Tienda de estado de Solicitud290301
   */
  constructor(
    protected override store: Solicitud290301Store) {
    super(store);
  }
}