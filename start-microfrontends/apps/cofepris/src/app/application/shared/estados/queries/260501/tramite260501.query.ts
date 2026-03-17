import { Solicitud260501State, Tramite260501Store } from '../../stores/260501/tramite260509.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud260501.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260501Query extends Query<Solicitud260501State> {

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
   * Constructor for Tramite260501Query.
   * @param {Tramite260501Store} store - The store that holds the state of Solicitud260501.
   */
  constructor(
    protected override store: Tramite260501Store) {
    super(store);
  }
}