import {Tramite130217State, Tramite130217Store } from '../tramites/tramite130217.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite130217Query extends Query<Tramite130217State> {
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
  constructor(protected override store: Tramite130217Store) {
    super(store);
  }

}
