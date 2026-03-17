import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite40402Store } from './tramite40402.store';
import { Tramitenacionales40402State } from './tramite40402.store';

@Injectable({ providedIn: 'root' })
export class Tramite40402Query extends Query<Tramitenacionales40402State> {
  constructor(protected override store: Tramite40402Store) {
    super(store);
  }
  /**
   * Observable que selecciona el estado completo de la sección.
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });
}
