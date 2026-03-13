import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Solicitante110101State } from '../tramites/solicitante110101.store';
import { Tramite110101Store } from '../tramites/solicitante110101.store';

/**
 * Query para acceder al estado del solicitante.
 */
@Injectable({ providedIn: 'root' })
export class Solicitante110101Query extends Query<Solicitante110101State> {
  
  /**
   * Selecciona el estado completo del solicitante
   */
  selectSolicitante$ = this.select((state) => state);

  /**
   * Constructor para inyectar el store y crear la query
   * @param store - Store para gestionar el estado del solicitante
   */
  constructor(protected override store: Tramite110101Store) {
    super(store);
  }
}
