import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { UnicoState, UnicoStore } from '../renovacion.store';

/**
 * Service to query the state of Solicitud31202.
 */
@Injectable({ providedIn: 'root' })
export class UnicoQuery extends Query<UnicoState> {

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<UnicoState>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for UnicoQuery.
   * @param {UnicoStore} store - The store that holds the state of UnicoState.
   */
  constructor(
    protected override store: UnicoStore) {
    super(store);
  }
}