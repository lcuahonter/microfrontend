import { SolicitudSectoresYMercanciasState, TramiteSectoresYMercanciasStore } from '../stores/sectores-y-mercancias.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class TramiteSectoresYMercanciasQuery extends Query<SolicitudSectoresYMercanciasState> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: TramiteSectoresYMercanciasStore) {
    super(store);
  }
}
