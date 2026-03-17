import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { DatosSolicitudState, Tramite140218Store } from '../store/tramite140218.store';

@Injectable({ providedIn: 'root' })
export class Tramite140218Query extends Query<DatosSolicitudState> {

  /**
   * Selecciona el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
 
  /**
   * Constructor del Query para el trámite 140218.
   * @param store Instancia del store de Tramite140218.
   */
  constructor(protected override store: Tramite140218Store) {
    super(store);
  }
}