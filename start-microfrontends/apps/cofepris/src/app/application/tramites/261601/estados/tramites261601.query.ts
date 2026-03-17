import { Solicitud261601State, Solicitud261601Store, } from './tramites261601.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Solicitud261601Query extends Query<Solicitud261601State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Solicitud261601Store) {
    super(store);
  }
}
