import { CapturistaStore, CapturistaStoreService } from '../estados/capturista.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Query para consultar el estado de capturistas en el store.
 * Permite suscribirse y obtener los valores actuales del estado de capturistas,
 * facilitando la reactividad en los componentes que requieren esta información.
 */
@Injectable({ providedIn: 'root' })
export class BusquedaRFCCURPQuery extends Query<CapturistaStore> {

  /**
   * Observable que emite el estado completo de capturistas cada vez que hay un cambio.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor que inyecta el store de capturistas.
   * @param store Servicio del store de capturistas.
   */
  constructor(
    protected override store: CapturistaStoreService) {
    super(store);
  }
}