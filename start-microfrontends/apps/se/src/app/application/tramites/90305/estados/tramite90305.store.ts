/**
 * Tramite90305Store
 * Store para gestionar el estado del trámite 90305
 */
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
/**
 * Tramite90305State
 * Interface que define el estado del trámite 90305
 */
export interface Tramite90305State {
  selectedEstado: string;
  registroFederalContribuyentes: string;
  representacionFederal: string;
  tipoModificacion: string;
  modificacionPrograma: string;
}
/**
 * "createInitialState"
 * Función que crea el estado inicial del trámite 90305
 */
export function createInitialState(): Tramite90305State {
  return {
    selectedEstado: '',
    registroFederalContribuyentes: '',
    representacionFederal: '',
    tipoModificacion: '', 
    modificacionPrograma: '',
  };
}
/**
 * Tramite90305Store
 * Store de Akita para gestionar el estado del trámite 90305
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Tramite90305Store
 * Store de Akita para gestionar el estado del trámite 90305
 */
@StoreConfig({ name: 'estadoState', resettable: true })
/**
 * Tramite90305Store
 * Clase que extiende Store de Akita para gestionar el estado del trámite 90305
 */
export class Tramite90305Store extends Store<Tramite90305State> {
  /**
   * constructor
   * @description Crea una instancia del store con el estado inicial
   */
  constructor() {
    super(createInitialState());
  }
/**
 * setSelectedEstado
 * @param {string} selectedEstado - Estado seleccionado
 */
  public setSelectedEstado(selectedEstado: string) : void {
    this.update((state) => ({
      ...state,
      selectedEstado,
    }));
  }
  /**
   * setRegistroFederalContribuyentes
   * @param {string} registroFederalContribuyentes - Registro Federal de Contribuyentes
   */
public setRegistroFederalContribuyentes(registroFederalContribuyentes: string): void {
    this.update((state) => ({
      ...state,
      registroFederalContribuyentes,
    }));
  }
  /**
   * setRepresentacionFederal
   * @param {string} representacionFederal - Representación federal
   */
  public setRepresentacionFederal(representacionFederal: string): void {
    this.update((state) => ({
      ...state,
      representacionFederal,
    }));
  }
  /**
   * setTipoModificacion
   * @param {string} tipoModificacion - Tipo de modificación
   */
  public setTipoModificacion(tipoModificacion: string): void {
    this.update((state) => ({
      ...state,
      tipoModificacion,
    }));
  }
  /**
   * setModificacionPrograma
   * @param {string} modificacionPrograma - Modificación del programa
   */
  public setModificacionPrograma(modificacionPrograma: string): void {
    this.update((state) => ({
      ...state,
      modificacionPrograma,
    }));
  }
}
