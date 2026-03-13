import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Estado para almacenar datos generales inherentes al trámite.
 */
export interface TramiteState {
  /**
   * El id del trámite 
   */
  idTramite: string;
  /**
   * El número de folio asignado a la solicitud cuando aún no se ha finalizado
   * la captura de la información requerida.
   */
  numeroTemporal: string;
  /**
   * El número de folio asignado a la solicitud cuando se ha proporcionado toda la información
   * correspondiente al trámite.
   */
  folioTramiteOficial: string;
  /**
   * Bandera para saber si el trámite se está iniciando desde una solicitud nueva o
   * desde alguna bandeja 
   */ 
  origenPeticion: string;
  /**
   * Firma enviada para finalizar el trámite
   */

  firma: string;
}

/**
 * Creación del estado inicial para el trámite
 * @returns TramiteState
 */
export function createInitialState(): TramiteState {
  return {
    idTramite: '',
    origenPeticion: '',
    numeroTemporal: '',
    folioTramiteOficial: '',
    firma: '',
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite', resettable: true })
export class TramiteStore extends Store<TramiteState> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Guarda el número de trámite en el state
   *
   * @param idTramite
   */
  public establecerTramite(idTramite: string, firma: string): void {
    this.update((state) => ({
      ...state,
      idTramite,
      firma,
    }));
  }

  /**
   * Guarda el origen de la petición en el state
   *
   * @param origenPeticion
   */
  public establecerOrigenPeticion(origenPeticion: string): void {
    this.update((state) => ({
      ...state,
      origenPeticion
    }));
  }


  /**
   * Guarda el número de procedimiento en el state
   *
   * @param procedureno El número de procedimiento a guardar en el estado
   */
  public procedureNo(procedureno: string): void {
    this.update((state) => ({
      ...state,
      procedureno
    }));
  }

  /**
   * Guarda el número de trámite en el state
   *
   * @param idTramite
   */
  public establecerNumeroTemporal(numeroTemporal: string): void {
    this.update((state) => ({
      ...state,
      numeroTemporal
    }));
  }

  /**
   * Guarda el número de trámite en el state
   *
   * @param folioTramiteOficial
   */
  public establecerFolioTramiteOficial(folioTramiteOficial: string): void {
    this.update((state) => ({
      ...state,
      folioTramiteOficial
    }));
  }

  /**
   * Limpia el estado del trámite
   */

  public limpiarTramite(): void {
    this.reset();
  }

  /**
     * Guarda el id de tramite seleccionado
     * @param idTramite parametro del id de tramite
     */
    setTramiteValue(idTramite: string): void {
      this.update(state => ({ ...state, idTramite }));
    }
}
