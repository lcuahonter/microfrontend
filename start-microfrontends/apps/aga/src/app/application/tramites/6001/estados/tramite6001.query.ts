import { AgregarCuenta6001State, Tramite6001Store } from './tramite6001.store';
import { Inject,Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Service to query the state of Solicitud31601.
 */
@Injectable({ providedIn: 'root' })
export class Tramite6001Query extends Query<AgregarCuenta6001State> {

  agregarCuenta$ = this.select((state) => {
    return state;
  });

  constructor(
    @Inject(Tramite6001Store) protected override store: Tramite6001Store) {
    super(store);
  }
}