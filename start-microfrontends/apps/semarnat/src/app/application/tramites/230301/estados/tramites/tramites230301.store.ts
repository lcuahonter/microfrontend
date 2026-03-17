import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define el estado del trámite 230301.
 */
export interface Tramite230301State {
  /**
   * Folio de desistimiento del trámite.
   */
  folioAnterior: string;

  /**
   * Tipo de solicitud del trámite.
   */
  tipoSolicitud: string;

  /**
   * Motivo de desistimiento del trámite.
   */
  motivoDesistimiento: string;

  /**
   * Identificador de la solicitud anterior.
   */
  solicitudAnterior: number;

  /**
   * Identificador de la solicitud actual.
   */
  idSolicitud: number;
}

/**
 * Crea el estado inicial para la interfaz de trámite 230301.
 * @returns {Tramite230301State} Estado inicial del trámite 230301.
 */
export function createInitialSolicitudState(): Tramite230301State {
  return {
    folioAnterior: '',
    solicitudAnterior: 0,
    tipoSolicitud: '',
    motivoDesistimiento: '',
    idSolicitud: 0,
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'solicitud230301', resettable: true })
export class Tramite230301Store extends Store<Tramite230301State> {
  /**
   * Constructor de la clase `Solicitud230301Store`.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialSolicitudState());
  }

  /**
   * Actualiza el motivo de desistimiento en el estado.
   * @param {string} motivoDesistimiento - Nuevo valor para el motivo de desistimiento.
   */
  public setMotivoDesistimiento(motivoDesistimiento: string): void {
    this.update((state) => ({
      ...state,
      motivoDesistimiento: motivoDesistimiento,
    }));
  }

  /**
   * Actualiza el tipo de solicitud en el estado.
   * @param {string} tipoDeTramite - Nuevo valor para el tipo de solicitud.
   */
  public setTipoSolicitud(tipoDeTramite: string): void {
    this.update((state) => ({
      ...state,
      tipoSolicitud: tipoDeTramite,
    }));
  }

  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud: idSolicitud,
    }));
  }

  public setInitialState(param: {
    folioAnterior: string;
    tipoSolicitud: string;
    solicitudAnterior: number;
  }): void {
    this.update((state) => ({
      ...state,
      folioAnterior: param.folioAnterior,
      tipoSolicitud: param.tipoSolicitud,
      solicitudAnterior: param.solicitudAnterior,
    }));
  }
}
