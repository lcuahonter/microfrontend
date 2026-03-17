import {
  DatosDomicilioLegalState,
  DatosDomicilioLegalStore,
} from '../stores/datos-domicilio-legal.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class DatosDomicilioLegalQuery extends Query<DatosDomicilioLegalState> {

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
  constructor(protected override store: DatosDomicilioLegalStore) {
    super(store);
  }
}
