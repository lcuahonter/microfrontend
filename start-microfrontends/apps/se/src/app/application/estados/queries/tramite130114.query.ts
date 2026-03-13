import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite130114State } from '../tramites/tramite130114.store';
import { Tramite130114Store } from '../tramites/tramite130114.store';

@Injectable({ providedIn: 'root' })
export class Tramite130114Query extends Query<Tramite130114State> {
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

  

  constructor(protected override store: Tramite130114Store) {
    super(store);
  }

}
