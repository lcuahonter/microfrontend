import { Tramite80314Store, TramiteState } from './tramite80314.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Tramite query
 *
 * @export
 * @class TramiteQuery
 * @extends {Query<TramiteState>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite80314Query extends Query<TramiteState> {
  selectEstado$ = this.select((state) => {
    return state.estado;
  });

  FormaValida$ = this.select((state) => {
   return Object.values(state.formaValida).every(value => value === true);
  })

  selectBuscarDomicilios$ = this.select((state) => {
    return state.buscarDomicilios;
  });

  selectDomicilios$ = this.select((state) => {
    return state.domicilios;
  });

  selectAltaPlanta$ = this.select((state) => {
    return state.altaPlanta;
  });

  selectSolicitud$ = this.select((state) => {
    return state;
  });

  constructor(protected override store: Tramite80314Store) {
    super(store);
  }
}
