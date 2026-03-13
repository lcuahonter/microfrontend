import { Solicitud260503State, Tramite260503Store } from '../../tramites/260503/tramite260503.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud260303.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260503Query extends Query<Solicitud260503State> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260503State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite260503Query.
   * @param {Tramite260503Store} store - The store that holds the state of Solicitud260503.
   */
  constructor(
    protected override store: Tramite260503Store) {
    super(store);
  }
}