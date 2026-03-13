import { Solicitud260511State, Tramite260511Store } from '../../stores/260511/tramite260511.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud260511.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260511Query extends Query<Solicitud260511State> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260511State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite260511Query.
   * @param {Tramite260511Store} store - The store that holds the state of Solicitud260511.
   */
  constructor(
    protected override store: Tramite260511Store) {
    super(store);
  }
}