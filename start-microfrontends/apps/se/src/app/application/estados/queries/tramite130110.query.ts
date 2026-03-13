import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite130110State } from '../tramites/tramites130110.store';
import { Tramite130110Store } from '../tramites/tramites130110.store';

@Injectable({ providedIn: 'root' })
export class Tramite130110Query extends Query<Tramite130110State> {
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
  constructor(protected override store: Tramite130110Store) {
    super(store);
  }

}
