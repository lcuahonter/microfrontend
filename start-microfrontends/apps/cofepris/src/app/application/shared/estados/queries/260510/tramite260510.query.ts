import { Solicitud260510State, Tramite260510Store } from '../../stores/260510/tramite260510.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud260510.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260510Query extends Query<Solicitud260510State> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260501State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite260510Query.
   * @param {Tramite260510Store} store - The store that holds the state of Solicitud260510.
   */
  constructor(
    protected override store: Tramite260510Store) {
    super(store);
  }
}