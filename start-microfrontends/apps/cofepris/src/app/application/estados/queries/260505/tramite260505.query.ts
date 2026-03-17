import { Solicitud260505State, Tramite260505Store } from '../../tramites/260505/tramite260505.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud260505.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260505Query extends Query<Solicitud260505State> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260505State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite260505Query.
   * @param {Tramite260505Store} store - The store that holds the state of Solicitud260505.
   */
  constructor(
    protected override store: Tramite260505Store) {
    super(store);
  }
}