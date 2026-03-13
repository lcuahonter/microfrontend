import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * @interface
 * @name UnicoState
 * @description
 * Representa el estado de la solicitud en el sistema. Contiene todos los campos necesarios para gestionar los datos relacionados con la solicitud.
 */
export interface UnicoState {
  /**
   * @property {string} mapTipoTramite
   * @description Modalidad de la solicitud.
   */
  mapTipoTramite: string;

  /**
   * @property {string} mapDeclaracionSolicitud
   * @description Declaración de protesta de verdad.
   */
  mapDeclaracionSolicitud: string;

  /**
   * @property {string} envioAviso
   * @description Estado del envío del aviso.
   */
  envioAviso: string;

  /**
   * @property {string} numeroAviso
   * @description Número del aviso.
   */
  numeroAviso: string;

  /**
   * @property {string} claveReferencia
   * @description Referencia de la solicitud.
   */
  claveReferencia: string;

  /**
   * @property {string} numeroOperacion
   * @description Número de operación asociado a la solicitud.
   */
  numeroOperacion: string;

  /**
   * @property {string} cadenaDependencia
   * @description Cadena de dependencia asociada a la solicitud.
   */
  cadenaDependencia: string;

  /**
   * @property {string} banco
   * @description Información del banco relacionado.
   */
  banco: string;

  /**
   * @property {string} llavePago
   * @description Llave única de pago asociada a la solicitud.
   */
  llavePago: string;

  /**
   * @property {string} fechaPago
   * @description Fecha de pago asociada a la solicitud.
   */
  fechaPago: string;

  /**
   * @property {string} importePago
   * @description Importe del pago relacionado con la solicitud.
   */
  importePago: string;
}

/**
 * @function
 * @name createInitialState
 * @description
 * Crea el estado inicial de la solicitud. Esta función devuelve un objeto con todos los campos inicializados como cadenas vacías.
 * 
 * @returns {UnicoState} El estado inicial de la solicitud.
 */
export function createInitialState(): UnicoState {
  return {
    mapTipoTramite: '',
    mapDeclaracionSolicitud: '',
    envioAviso: '',
    numeroAviso: '',
    claveReferencia: '',
    numeroOperacion: '',
    cadenaDependencia: '',
    banco: '',
    llavePago: '',
    fechaPago: '',
    importePago: '',
  };
}

/**
 * @class
 * @name UnicoStore
 * @description
 * Clase que representa el almacén de estado para la solicitud. Proporciona métodos para actualizar los campos del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'renovacionStore', resettable: true })
export class UnicoStore extends Store<UnicoState> {
  /**
   * Constructor de la clase UnicoStore.
   * Inicializa el almacén con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @method
   * @name setmodalidad
   * @description Actualiza el campo `modalidad` en el estado.
   * @param {string} modalidad Nueva modalidad.
   */
  public setmapTipoTramite(mapTipoTramite: string): void {
    this.update((state) => ({
      ...state,
      mapTipoTramite,
    }));
  }

  /**
   * @method
   * @name setprotestaVerdad
   * @description Actualiza el campo `protestaVerdad` en el estado.
   * @param {string} protestaVerdad Nueva protesta de verdad.
   */
  public setmapDeclaracionSolicitud(mapDeclaracionSolicitud: string): void {
    this.update((state) => ({
      ...state,
      mapDeclaracionSolicitud,
    }));
  }

  /**
   * @method
   * @name setenvioAviso
   * @description Actualiza el campo `envioAviso` en el estado.
   * @param {string} envioAviso Nuevo estado de envío del aviso.
   */
  public setenvioAviso(envioAviso: string): void {
    this.update((state) => ({
      ...state,
      envioAviso,
    }));
  }

  /**
   * @method
   * @name setnumeroAviso
   * @description Actualiza el campo `numeroAviso` en el estado.
   * @param {string} numeroAviso Nuevo número de aviso.
   */
  public setnumeroAviso(numeroAviso: string): void {
    this.update((state) => ({
      ...state,
      numeroAviso,
    }));
  }

  /**
   * @method
   * @name setclaveReferencia
   * @description Actualiza el campo `claveReferencia` en el estado.
   * @param {string} claveReferencia Nueva clave de referencia.
   */
  public setclaveReferencia(claveReferencia: string): void {
    this.update((state) => ({
      ...state,
      claveReferencia,
    }));
  }

  /**
   * @method
   * @name setnumeroOperacion
   * @description Actualiza el campo `numeroOperacion` en el estado.
   * @param {string} numeroOperacion Nuevo número de operación.
   */
  public setnumeroOperacion(numeroOperacion: string): void {
    this.update((state) => ({
      ...state,
      numeroOperacion,
    }));
  }

  /**
   * @method
   * @name setcadenaDependencia
   * @description Actualiza el campo `cadenaDependencia` en el estado.
   * @param {string} cadenaDependencia Nueva cadena de dependencia.
   */
  public setcadenaDependencia(cadenaDependencia: string): void {
    this.update((state) => ({
      ...state,
      cadenaDependencia,
    }));
  }

  /**
   * @method
   * @name setbanco
   * @description Actualiza el campo `banco` en el estado.
   * @param {string} banco Nuevo banco.
   */
  public setbanco(banco: string): void {
    this.update((state) => ({
      ...state,
      banco,
    }));
  }

  /**
   * @method
   * @name setllavePago
   * @description Actualiza el campo `llavePago` en el estado.
   * @param {string} llavePago Nueva llave de pago.
   */
  public setllavePago(llavePago: string): void {
    this.update((state) => ({
      ...state,
      llavePago,
    }));
  }

  /**
   * @method
   * @name setfechaPago
   * @description Actualiza el campo `fechaPago` en el estado.
   * @param {string} fechaPago Nueva fecha de pago.
   */
  public setfechaPago(fechaPago: string): void {
    this.update((state) => ({
      ...state,
      fechaPago,
    }));
  }

  /**
   * @method
   * @name setimportePago
   * @description Actualiza el campo `importePago` en el estado.
   * @param {string} importePago Nuevo importe de pago.
   */
  public setimportePago(importePago: string): void {
    this.update((state) => ({
      ...state,
      importePago,
    }));
  }
}