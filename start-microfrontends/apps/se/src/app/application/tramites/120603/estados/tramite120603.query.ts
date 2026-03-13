import { Solicitud120603State, Solicitud120603Store } from './tramite120603.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
/** Clase para realizar consultas sobre el estado de Solicitud120603 */
export class Solicitud120603Query extends Query<Solicitud120603State> {

  /** Selección del estado completo de la solicitud */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase Solicitud120603Query
   * @param store - Tienda de estado de Solicitud120603
   */
  constructor(
    protected override store: Solicitud120603Store) {
    super(store);
  }
}