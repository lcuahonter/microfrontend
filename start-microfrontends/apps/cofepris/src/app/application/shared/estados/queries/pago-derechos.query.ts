
import { PagoDerechosState,PagoDerechosStore } from '../stores/pago-de-derechos.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class PagoDerechosQuery extends Query<PagoDerechosState> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: PagoDerechosStore) {
    super(store);
  }
}