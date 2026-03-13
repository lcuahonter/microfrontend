import { Tramite140112Store, Tramites140112State } from './tramite-140112.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Service to query the state of Tramites140112.
 */
@Injectable({ providedIn: 'root' })
export class Tramite140112Query extends Query<Tramites140112State> {

  /**
   * Observable to select the desistimiento property from the state.
   */
  selectDesistimiento$ = this.select((state) => {
    return state;
  }); 

  
  
  /**
   * Constructor for Tramite140112Query.
   * @param {Tramite140112Store} store - The store instance to query the state from.
   */
  constructor(
    protected override store: Tramite140112Store) {
    super(store);
  }
}