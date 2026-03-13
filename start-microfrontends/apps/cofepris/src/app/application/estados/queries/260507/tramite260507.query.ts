import { Solicitud260507State, Tramite260507Store } from '../../tramites/260507/tramite260507.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud260303.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260507Query extends Query<Solicitud260507State> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260507State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite260507Query.
   * @param {Tramite260507Store} store - The store that holds the state of Solicitud260507.
   */
  constructor(
    protected override store: Tramite260507Store) {
    super(store);
  }
}