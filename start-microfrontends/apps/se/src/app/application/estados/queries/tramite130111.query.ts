
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite130111State } from '../tramites/tramites130111.store';
import { Tramite130111Store } from '../tramites/tramites130111.store';

@Injectable({ providedIn: 'root' })
export class Tramite130111Query extends Query<Tramite130111State> {
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
  constructor(protected override store: Tramite130111Store) {
    super(store);
  }

}
