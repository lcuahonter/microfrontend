
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { Sanitario260211Store, Solicitud260211State } from '../tramites/sanitario260211.store';

/**
 * Service to query the state of Solicitud260211.
 */
@Injectable({ providedIn: 'root' })
export class Permiso260211Query extends Query<Solicitud260211State> {

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260211State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Permiso260211Query.
   * @param {Tramite216001Store} store - The store that holds the state of Solicitud260211.
   */
  constructor(
    protected override store: Sanitario260211Store) {
    super(store);
  }
}