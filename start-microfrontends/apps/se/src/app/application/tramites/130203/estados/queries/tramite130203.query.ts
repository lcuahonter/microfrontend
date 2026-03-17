import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite130203State } from '../tramites/tramites130203.store';
import { Tramite130203Store } from '../tramites/tramites130203.store';

@Injectable({ providedIn: 'root' })
export class Tramite130203Query extends Query<Tramite130203State> {
  /**
   * Observable para seleccionar el estado completo del trámite.
   * Estado completo del trámite.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Observable para seleccionar el valor de `mostrarTabla` del estado.
   * Valor booleano de `mostrarTabla`.
   */
  mostrarTabla$ = this.select((state) => state.mostrarTabla);
  

    constructor(private tramiteStore: Tramite130203Store) {
      super(tramiteStore);
    }
}
