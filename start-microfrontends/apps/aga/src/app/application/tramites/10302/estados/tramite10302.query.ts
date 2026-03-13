import { Solicitud10302State, Tramite10302Store } from './tramite10302.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';


@Injectable({ providedIn: 'root' })
export class Tramite10302Query extends Query<Solicitud10302State> {
  /**
     * Selecciona el estado completo de la solicitud
     */
    selectSolicitud$ = this.select((state) => {
      return state;
    });
  
    /**Guarda el estado completo del formulario de la solicitud */
    constructor(
      protected override store: Tramite10302Store) {
      super(store);
    }

}
