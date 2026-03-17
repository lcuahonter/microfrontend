import { Solicitud140205State, Solicitud140205Store } from '../store/solicitud140205.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Solicitud140205Query extends Query<Solicitud140205State> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Solicitud140205Store) {
    super(store);
  }
}
