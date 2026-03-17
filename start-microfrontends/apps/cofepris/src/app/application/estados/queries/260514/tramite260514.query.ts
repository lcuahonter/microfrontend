import { Solicitud260514State, Tramite260514Store } from '../../tramites/260514/tramite260514.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud260303.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260514Query extends Query<Solicitud260514State> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260514State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite260514Query.
   * @param {Tramite260514Store} store - The store that holds the state of Solicitud260514.
   */
  constructor(
    protected override store: Tramite260514Store) {
    super(store);
  }
}