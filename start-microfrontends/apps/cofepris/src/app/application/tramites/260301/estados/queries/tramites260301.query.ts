
import { Solicitud260301State, Tramite260301Store } from '../stores/tramites260301.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud260301.
 */
@Injectable({ providedIn: 'root' })
export class Tramites260301Query extends Query<Solicitud260301State> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260301State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite260301Query.
   * @param {Tramite260301Store} store - The store that holds the state of Solicitud260302.
   */
  constructor(
    protected override store: Tramite260301Store) {
    super(store);
  }
}