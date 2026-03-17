import { Solicitud221602State, Tramite221602Store } from '../tramites/tramite221602.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';


@Injectable({ providedIn: 'root' })
export class Tramite221602Query extends Query<Solicitud221602State> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Tramite221602Store) {
    super(store);
  }
}