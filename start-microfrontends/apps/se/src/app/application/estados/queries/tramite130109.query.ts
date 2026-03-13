import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite130109State } from '../tramites/tramites130109.store';
import { Tramite130109Store } from '../tramites/tramites130109.store';

@Injectable({ providedIn: 'root' })
export class Tramite130109Query extends Query<Tramite130109State> {
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
  constructor(protected override store: Tramite130109Store) {
    super(store);
  }

}
