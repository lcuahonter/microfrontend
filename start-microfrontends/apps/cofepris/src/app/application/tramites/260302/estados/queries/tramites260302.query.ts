import { Solicitud260302State, Tramite260302Store } from '../stores/tramites260302.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud260302.
 */
@Injectable({ providedIn: 'root' })
export class Tramites260302Query extends Query<Solicitud260302State> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260302State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite260302Query.
   * @param {Tramite260302Store} store - The store that holds the state of Solicitud260302.
   */
  constructor(
    protected override store: Tramite260302Store) {
    super(store);
  }
}