
import { RegistroStates, RegistroStore } from '../estados/registro.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Query para consultar el estado del registro de personas y notificaciones.
 * Permite seleccionar el estado completo del store de registro.
 */
@Injectable({ providedIn: 'root' })
export class BusquedaRFCQuery extends Query<RegistroStore> {

  /**
   * Observable que emite el estado completo del registro.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor. Inyecta el store de registro.
   * @param store Instancia del store de registro.
   */
  constructor(
    protected override store: RegistroStates) {
    super(store);
  }
}