import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Solicitud31501State } from '../tramites/tramite31501.store';
import { Tramite31501Store } from '../tramites/tramite31501.store';

/**
 * Servicio para consultar el estado de la Solicitud31501.
 */
@Injectable({ providedIn: 'root' })
export class Tramite31501Query extends Query<Solicitud31501State> {
  /**
   * Observable para seleccionar el estado completo de la solicitud.
   * @returns {Observable<Solicitud31501State>} El estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor para Tramite31501Query.
   * @param {Tramite31501Store} store - La tienda que guarda el estado de Solicitud31501.
   */
  constructor(protected override store: Tramite31501Store) {
    super(store);
  }
}
