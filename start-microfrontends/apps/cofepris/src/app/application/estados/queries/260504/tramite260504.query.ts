import { Solicitud260504State, Tramite260504Store } from '../../tramites/260504/tramite260504.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud260504.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260504Query extends Query<Solicitud260504State> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260504State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite260504Query.
   * @param {Tramite260504Store} store - The store that holds the state of Solicitud260504.
   */
  constructor(
    protected override store: Tramite260504Store) {
    super(store);
  }
}