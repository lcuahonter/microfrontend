import { Store, StoreConfig } from '@datorama/akita';
import { EstadoSolicitud31909 } from '../../models/estado-solicitud-31909';
import { Injectable } from '@angular/core';

/**
 * Crea el estado inicial para el trámite 31909.
 * @returns Estado inicial del trámite 31909.
 */
export function crearEstadoInicialTramite31909(): EstadoSolicitud31909 {
  return {
    idSolicitud: null,
    folioTramite: '',
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite31909', resettable: true })
export class Tramite31909Store extends Store<EstadoSolicitud31909> {
  constructor() {
    super(crearEstadoInicialTramite31909());
  }

  /**
   * Guarda el ID de la solicitud en el estado del store.
   * @param idSolicitud Identificador de la solicitud.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * Guarda el folio del trámite en el estado del store.
   * @param folio Folio del trámite.
   */
  public setFolioTramite(folio: string): void {
    this.update((state) => ({
      ...state,
      folioTramite: folio,
    }));
  }

  /**
   * Restaura el estado del formulario al valor inicial definido.
   */
  limpiarFormulario(): void {
    this.reset();
  }
}
