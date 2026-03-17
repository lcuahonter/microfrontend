import { Solicitud90304State, Tramite90304Store } from './tramite90304.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';


@Injectable({ providedIn: 'root' })
export class Tramite90304Query extends Query<Solicitud90304State> {
  /**
     * Selecciona el estado completo de la solicitud
     */
    selectSolicitud$ = this.select((state) => {
      return state;
    });
  
    /**Guarda el estado completo del formulario de la solicitud */
    constructor(
      protected override store: Tramite90304Store) {
      super(store);
    }

}
