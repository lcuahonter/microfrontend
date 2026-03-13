import { TramiteFolioState, TramiteFolioStore } from '../estados/tramiteFolio.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({
  providedIn: 'root',
})

export class TramiteFolioQueries extends Query<TramiteFolioState> {
  /**
   * Selecciona el número de trámite
   */
  selectIdTramite$ = this.select((state) => {
    return state.idTramite;
  });

  /**
   * Sleeciona la firma
   */
  selectedFirma$ = this.select((state) => {
    return state.firma;
  });

  /**
 * Selector para ID de solicitud
 */
  selectIdSolicitud$ = this.select((state) => state.idSolicitud);

  constructor(protected override store: TramiteFolioStore) {
    super(store);
  }

  /**
   * @description Función para obtener el número de trámite
   * @returns Un string que contiene el número de trámite.
   */
  getTramite(): string {
    return this.getValue()?.idTramite ?? '';
  }

  /**
   * @description Función para obtener la firma
   * @returns Un string que contiene la firma.
   */
  getFirma(): string {
    return this.getValue()?.firma ?? '';
  }

  /**
   * @description Función para obtener el ID de solicitud
   * @returns Un número que representa el ID de la solicitud.
   */
  getIdSolicitud(): number {
    return this.getValue()?.idSolicitud ?? 0;
  }
  /**
   * @description Función para obtener el código de procedimiento del trámite.
   * @returns Un número que representa el código del procedimiento, o 0 si no está definido.
   */
  getProcedure(): number {
    return this.getValue()?.procedure ?? 0;
  }
}
