
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { Sanitario260906Store, Solicitud260906State } from '../tramites/sanitario260906.store';

/**
 * Service to query the state of Solicitud260906.
 */
@Injectable({ providedIn: 'root' })
export class Permiso260906Query extends Query<Solicitud260906State> {

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260906State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Permiso260906Query.
   * @param {Tramite216001Store} store - The store that holds the state of Solicitud260906.
   */
  constructor(
    protected override store: Sanitario260906Store) {
    super(store);
  }
}