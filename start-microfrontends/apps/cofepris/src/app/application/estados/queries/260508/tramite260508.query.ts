import { Solicitud260508State, Tramite260508Store } from '../../tramites/260508/tramite260508.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud260303.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260508Query extends Query<Solicitud260508State> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260508State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite260508Query.
   * @param {Tramite260508Store} store - The store that holds the state of Solicitud260508.
   */
  constructor(
    protected override store: Tramite260508Store) {
    super(store);
  }
}