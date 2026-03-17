import { Solicitud260515State, Tramite260515Store } from '../stores/tramite260515Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud260303.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260515Query extends Query<Solicitud260515State> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260515State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite260515Query.
   * @param {Tramite260515Store} store - The store that holds the state of Solicitud260515.
   */
  constructor(
    protected override store: Tramite260515Store) {
    super(store);
  }
}