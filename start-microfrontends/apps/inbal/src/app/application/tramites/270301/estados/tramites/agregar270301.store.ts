/**
 * @module Agregar270301Store
 * @description
 * Este módulo define el estado y las acciones para la gestión de la solicitud 270301.
 * Utiliza Akita para manejar el estado de la aplicación de manera reactiva.
 */

import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { TablaDatos } from '../../models/aviso-siglos.models';

/**
 * @interface solicitud270301State
 * @description
 * Interfaz que define la estructura del estado para la solicitud 270301.
 */
export interface Solicitud270301State {
  /** Tipo de operación seleccionada. */
  tipoDeOperacion: string;

  /** Tipo de movimiento seleccionado. */
  tipoDeMovimiento: string;

  /** Motivo asociado a la solicitud. */
  motivo: string;

  /** País relacionado con la solicitud. */
  pais: string;

  /** Ciudad asociada a la solicitud. */
  ciudad: string;

  /** Medio de transporte utilizado. */
  medioTransporte: string;

  /** Empresa transportista asociada. */
  emprsaTransportista: string;

  /** Destino final de la solicitud. */
  destinofinal: string;

  /** Periodo de estancia relacionado con la solicitud. */
  periodoEstancia: string;

  /** Aduana de entrada seleccionada. */
  aduanaEntrada: string;
  /** Manifiesto correspondiente al trámite. */
  manifiesto: boolean;

   /**
     * Arreglo que contiene los datos de las obras de arte.
     * Cada obra de arte está representada por un objeto del tipo TablaDatos.
     * 
     * @property {TablaDatos[]} ObraDeArte
     */
    ObraDeArte: TablaDatos[];
}

/**
 * @function createInitialState
 * @description
 * Función que crea el estado inicial para la solicitud 270301.
 * @returns {solicitud270301State} El estado inicial con valores predeterminados.
 */
export function createInitialState(): Solicitud270301State {
  return {
    tipoDeOperacion: '',
    tipoDeMovimiento: '',
    motivo: '',
    pais: '',
    ciudad: '',
    medioTransporte: '',
    emprsaTransportista: '',
    destinofinal: '',
    periodoEstancia: '',
    aduanaEntrada: '',
    manifiesto: false,
    /**
     * Arreglo que contiene los datos de las obras de arte. Inicialmente está vacío.
     */
    ObraDeArte: [],
  };
}

/**
 * @class Agregar270301Store
 * @extends {Store<solicitud270301State>}
 * @description
 * Clase que maneja el estado y las acciones para la solicitud 270301.
 * Utiliza Akita para proporcionar un estado reactivo y centralizado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'agregar270301', resettable: true })
export class Agregar270301Store extends Store<Solicitud270301State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * @method settipoDeOperacion
   * @description
   * Actualiza el estado con el tipo de operación seleccionado.
   * @param {string} tipoDeOperacion - El tipo de operación seleccionado.
   */
  public settipoDeOperacion(tipoDeOperacion: string): void {
    this.update((state) => ({
      ...state,
      tipoDeOperacion,
    }));
  }

  /**
   * @method settipoDeMovimiento
   * @description
   * Actualiza el estado con el tipo de movimiento seleccionado.
   * @param {string} tipoDeMovimiento - El tipo de movimiento seleccionado.
   */
  public settipoDeMovimiento(tipoDeMovimiento: string): void {
    this.update((state) => ({
      ...state,
      tipoDeMovimiento,
    }));
  }

  /**
   * @method setmotivo
   * @description
   * Actualiza el estado con el motivo asociado a la solicitud.
   * @param {string} motivo - El motivo asociado.
   */
  public setmotivo(motivo: string): void {
    this.update((state) => ({
      ...state,
      motivo,
    }));
  }

  /**
   * @method setpais
   * @description
   * Actualiza el estado con el país relacionado con la solicitud.
   * @param {string} pais - El país relacionado.
   */
  public setpais(pais: string): void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }

  /**
   * @method setciudad
   * @description
   * Actualiza el estado con la ciudad asociada a la solicitud.
   * @param {string} ciudad - La ciudad asociada.
   */
  public setciudad(ciudad: string): void {
    this.update((state) => ({
      ...state,
      ciudad,
    }));
  }

  /**
   * @method setmedioTransporte
   * @description
   * Actualiza el estado con el medio de transporte utilizado.
   * @param {string} medioTransporte - El medio de transporte utilizado.
   */
  public setmedioTransporte(medioTransporte: string): void {
    this.update((state) => ({
      ...state,
      medioTransporte,
    }));
  }

  /**
   * @method setemprsaTransportista
   * @description
   * Actualiza el estado con la empresa transportista asociada.
   * @param {string} emprsaTransportista - La empresa transportista asociada.
   */
  public setemprsaTransportista(emprsaTransportista: string): void {
    this.update((state) => ({
      ...state,
      emprsaTransportista,
    }));
  }

  /**
   * @method setdestinofinal
   * @description
   * Actualiza el estado con el destino final de la solicitud.
   * @param {string} destinofinal - El destino final.
   */
  public setdestinofinal(destinofinal: string): void {
    this.update((state) => ({
      ...state,
      destinofinal,
    }));
  }

  /**
   * @method setperiodoEstancia
   * @description
   * Actualiza el estado con el periodo de estancia relacionado con la solicitud.
   * @param {string} periodoEstancia - El periodo de estancia.
   */
  public setperiodoEstancia(periodoEstancia: string): void {
    this.update((state) => ({
      ...state,
      periodoEstancia,
    }));
  }

  /**
   * @method setaduanaEntrada
   * @description
   * Actualiza el estado con la aduana de entrada seleccionada.
   * @param {string} aduanaEntrada - La aduana de entrada seleccionada.
   */
  public setaduanaEntrada(aduanaEntrada: string): void {
    this.update((state) => ({
      ...state,
      aduanaEntrada,
    }));
  }

  /**
   * @method setmanifiesto
   * @description
   * Actualiza el estado con el manifiesto correspondiente al trámite.
   * @param {boolean} manifiesto - El manifiesto correspondiente.
   */
  public setmanifiesto(manifiesto: boolean): void {
    this.update((state) => ({
      ...state,
      manifiesto,
    }));
  }

  /**
   * @method setObraDeArte
   * @description
   * Actualiza el estado con los datos de la obra de arte seleccionada.
   * @param {TableData[]} obraDeArte - Lista de obras de arte.
   */
  public setObraDeArte(obraDeArte: TablaDatos[]): void {
    this.update((state) => ({
      ...state,
      ObraDeArte: obraDeArte,
    }));
  }
}