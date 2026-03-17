import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { TercerosRelacionadasState } from '../stores/terceros-relacionados.stores';
import { TramiteRelacionadaseStore } from '../stores/terceros-relacionados.stores';

@Injectable({ providedIn: 'root' })
export class TercerosRelacionadosQuery extends Query<TercerosRelacionadasState> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: TramiteRelacionadaseStore) {
    super(store);
  }
}