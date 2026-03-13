import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Solicitud130106State } from '../tramites/tramite130106.store';
import { Tramite130106Store } from '../tramites/tramite130106.store';
@Injectable({ providedIn: 'root' })
export class Tramite130106Query extends Query<Solicitud130106State> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Tramite130106Store) {
    super(store);
  }
}
