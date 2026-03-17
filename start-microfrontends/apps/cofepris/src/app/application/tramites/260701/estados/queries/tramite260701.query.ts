import {
  Solicitud260701State,
  Tramite260701Store,
} from '../tramites/tramite260701.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite260701Query extends Query<Solicitud260701State> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Tramite260701Store) {
    super(store);
  }
}
