/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * @interface ExportarIlustraciones130302State
 * @description Representa el estado de ExportarIlustraciones130302.
 * Contiene las propiedades necesarias para gestionar el estado del trámite.
 */
export interface ExportarIlustraciones130302State {
  /**
   * @property {string} saldoDisponible - Saldo disponible para el trámite.
   */
  saldoDisponible: string;
  fechaPago: string;

  /**
   * @property {string} prorrogaDel - Fecha de inicio de la prórroga.
   */
  prorrogaDel: string;

  /**
   * @property {string} prorrogaAl - Fecha de fin de la prórroga.
   */
  prorrogaAl: string;

  /**
   * @property {string} motivoJustificacion - Motivo de justificación del trámite.
   */
  motivoJustificacion: string;

  /**
   * @property {string} otrasDeclaraciones - Declaraciones adicionales relacionadas con el trámite.
   */
  otrasDeclaraciones: string;

  /**
   * @property {any} [key] - Propiedades dinámicas adicionales.
   */
  [key: string]: any;
}

/**
 * @function createInitialState
 * @description Crea el estado inicial para ExportarIlustraciones130302.
 * @returns {ExportarIlustraciones130302State} Estado inicial con valores vacíos.
 */
export function createInitialState(): ExportarIlustraciones130302State {
  return {
    saldoDisponible: '',
    fechaPago: '',
    prorrogaDel: '',
    prorrogaAl: '',
    motivoJustificacion: '',
    otrasDeclaraciones: '',
  };
}

/**
 * @decorator Injectable
 * @description Marca esta clase como un servicio inyectable en Angular.
 * @property {string} providedIn - Define el alcance del servicio (disponible en toda la aplicación).
 */
@Injectable({
  providedIn: 'root',
})

/**
 * @decorator StoreConfig
 * @description Configuración del store para Tramite130302.
 * @property {string} name - Nombre del store.
 * @property {boolean} resettable - Indica si el estado puede ser reiniciado.
 */
@StoreConfig({ name: 'tramite130302', resettable: true })
export class Tramite130302Store extends Store<ExportarIlustraciones130302State> {
  /**
   * @constructor
   * @description Inicializa el estado del store con valores iniciales.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @method setDynamicFieldValue
   * @description Establece dinámicamente un valor en el store por nombre de campo.
   * @param {string} fieldName - Nombre del campo a actualizar.
   * @param {any} value - Valor a establecer.
   */
  public setDynamicFieldValue(fieldName: string, value: any): void {
    this.update((state) => ({
      ...state,
      [fieldName]: value,
    }));
  }

  /**
   * @method setsaldoDisponible
   * @description Actualiza el saldo disponible en el estado.
   * @param {string} saldoDisponible - Nuevo saldo disponible.
   */
  public setsaldoDisponible(saldoDisponible: string): void {
    this.update((state) => ({
      ...state,
      saldoDisponible,
    }));
  }

  /**
   * @method setprorrogaDel
   * @description Actualiza la fecha de inicio de la prórroga en el estado.
   * @param {string} prorrogaDel - Nueva fecha de inicio de la prórroga.
   */
  public setprorrogaDel(prorrogaDel: string): void {
    this.update((state) => ({
      ...state,
      prorrogaDel,
    }));
  }

  /**
   * @method setprorrogaAl
   * @description Actualiza la fecha de fin de la prórroga en el estado.
   * @param {string} prorrogaAl - Nueva fecha de fin de la prórroga.
   */
  public setprorrogaAl(prorrogaAl: string): void {
    this.update((state) => ({
      ...state,
      prorrogaAl,
    }));
  }

  /**
   * @method setmotivoJustificacion
   * @description Actualiza el motivo de justificación en el estado.
   * @param {string} motivoJustificacion - Nuevo motivo de justificación.
   */
  public setmotivoJustificacion(motivoJustificacion: string): void {
    this.update((state) => ({
      ...state,
      motivoJustificacion,
    }));
  }

  /**
   * @method setotrasDeclaraciones
   * @description Actualiza las declaraciones adicionales en el estado.
   * @param {string} otrasDeclaraciones - Nuevas declaraciones adicionales.
   */
  public setotrasDeclaraciones(otrasDeclaraciones: string): void {
    this.update((state) => ({
      ...state,
      otrasDeclaraciones,
    }));
  }

  
public setfechaPago(fechaPago: string): void {
    this.update((state) => ({
      ...state,
      fechaPago,
    }));
  }
}