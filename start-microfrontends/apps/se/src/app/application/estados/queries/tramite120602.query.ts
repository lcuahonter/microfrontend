import { Solicitud120602State, Tramite120602Store } from '../../estados/tramites/tramite120602.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite120602Query extends Query<Solicitud120602State> {
    /**
     * Selecciona el estatdo completo de la sección
     */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
  constructor(
    protected override store: Tramite120602Store) {
    super(store);
  }
}