import { Solicitud260502State, Tramite260502Store } from '../../stores/260502/tramite260502.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud260502.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260502Query extends Query<Solicitud260502State> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260502State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite260502Query.
   * @param {Tramite260502Store} store - The store that holds the state of Solicitud260502.
   */
  constructor(
    protected override store: Tramite260502Store) {
    super(store);
  }
}