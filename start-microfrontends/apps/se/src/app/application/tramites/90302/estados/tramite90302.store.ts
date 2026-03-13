/**
 * @fileoverview
 * El `Tramite90302Store` es una clase de Angular que utiliza Akita para gestionar el estado relacionado con la ampliación de servicios.
 * Proporciona métodos para actualizar y gestionar datos como información de registro, aduanas, sectores, empresas y otros campos relacionados.
 * 
 * @module Tramite90302Store
 * @description
 * Este archivo define la estructura del estado inicial, las interfaces necesarias y los métodos para actualizar el estado de la ampliación de servicios.
 */

import { Store, StoreConfig } from '@datorama/akita';
import { InfoServicios } from '../models/datos-info.model';

import { Injectable } from '@angular/core';

/**
 * Interfaz que define la estructura del estado de ampliación de servicios.
 * @interface AmpliacionServiciosState
 */
export interface AmpliacionServiciosState {
  /**
   * Información del registro.
   * @property {Servicios} infoRegistro
   */
  infoRegistro: InfoServicios;
}

/**
 * Estado inicial de la ampliación de servicios.
 * @constant {AmpliacionServiciosState} INITIAL_AMPLIACION_SERVICIOS_STATE
 */
export const INITIAL_AMPLIACION_SERVICIOS_STATE: AmpliacionServiciosState = {
  /**
   * Información del registro inicial.
   * @property {Servicios} infoRegistro
   */
  infoRegistro: {
    rfc: '',
    representacionFederal: '',
    tipoModificacion: '',
    modificacionPrograma: ''
  },

};

/**
 * Clase que representa el store de ampliación de servicios.
 * @export
 * @class Tramite90302Store
 * @extends {Store<AmpliacionServiciosState>}
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite-90302', resettable: true })
export class Tramite90302Store extends Store<AmpliacionServiciosState> {
  /**
   * Constructor del store.
   * @constructor
   */
  constructor() {
    super(INITIAL_AMPLIACION_SERVICIOS_STATE);
  }

  /**
   * Actualiza la información de registro en el estado.
   * @method setInfoRegistro
   * @param {Servicios} infoRegistro - Información de registro.
   */
  setInfoRegistro(infoRegistro: InfoServicios): void {
    this.update((state) => ({
      ...state,
      infoRegistro,
    }));
  }
}