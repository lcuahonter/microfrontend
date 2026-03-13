import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';

/**
 * Creacion del estado inicial para la interfaz de tramite PagoBanco
 * @returns SolicitudPagoBanco
 */
export interface PagoDerechosState {
  /**
   * claveReferencia
   * @type {string}
   */
  claveReferencia: string;

  /**
   * cadenaDependencia
   * @type {string}
   */
  cadenaDependencia: string;

  /**
   * banco
   * @type {string}
   */
  banco: string;

  /**
   * llavePago
   * @type {string}
   */
  llavePago: string;

  /**
   * fechaPago
   * @type {string}
   */
  fechaPago: string;

  /**
   * importePago
   * @type {string}
   */
  importePago: string;

  estado: string;
  bancoObject?: Catalogo;
  estadoObject?: Catalogo;

}

/**
 * Crea y retorna el estado inicial para el pago de derechos.
 *
 * @returns {PagoDerechosState} El estado inicial con los siguientes campos:
 * - claveReferencia: Clave de referencia del pago.
 * - cadenaDependencia: Cadena de la dependencia correspondiente.
 * - banco: Nombre del banco donde se realiza el pago.
 * - llavePago: Llave única del pago.
 * - fechaPago: Fecha en la que se realizó el pago.
 * - importePago: Importe del pago realizado.
 * - estado: Estado actual del pago.
 */
export function createInitialState(): PagoDerechosState {
  return {
    /**
     * claveReferencia
     * @type {string}
     */
    claveReferencia: '',

    /**
     * cadenaDependencia
     * @type {string}
     * */
    cadenaDependencia: '',

    /**
     * banco
     * @type {string}
     */
    banco: '',

    /**
     * llavePago
     * @type {string}
     */
    llavePago: '',

    /**
     * fechaPago
     * @type {string}
     */
    fechaPago: '',

    /**
     * importePago
     * @type {string}
     */
    importePago: '',

    estado: '',
    bancoObject: undefined,
    estadoObject: undefined
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'pagoDerechos', resettable: true })
export class PagoDerechosStore extends Store<PagoDerechosState> {
  /**
   * Crea una instancia de PagoDerechosState.
   * @constructor
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Guarda la clave de referencia en el estado.
   * @param claveReferencia
   */
  public setClaveReferencia(claveReferencia: string): void {
    this.update((state) => ({
      ...state,
      claveReferencia,
    }));
  }

  /**
   * Guarda la cadena de dependencia en el estado.
   * @param cadenaDependencia
   */
  public setCadenaDependencia(cadenaDependencia: string): void {
    this.update((state) => ({
      ...state,
      cadenaDependencia,
    }));
  }

  /**
   * Guarda el banco en el estado.
   * @param banco
   */
  public setBanco(banco: string): void {
    this.update((state) => ({
      ...state,
      banco,
    }));
  }


/**
 * Actualiza el banco seleccionado como objeto completo.
 * @param banco - Objeto Catalogo del banco seleccionado.
 */
public setBancoObject(banco: Catalogo): void {
  this.update((state) => ({
    ...state,
    bancoObject: banco,
  }));
}

/**
 * Actualiza el estado seleccionado como objeto completo.
 * @param estado - Objeto Catalogo del estado seleccionado.
 */
public setEstadoObject(estado: Catalogo): void {
  this.update((state) => ({
    ...state,
    estadoObject: estado,
  }));
}


  /**
   * Guarda la llave de pago en el estado.
   * @param llavePago
   */
  public setllavePago(llavePago: string): void {
    this.update((state) => ({
      ...state,
      llavePago,
    }));
  }

  /**
   * Guarda la fecha de pago en el estado.
   * @param fechaPago
   */
  public setFechaPago(fechaPago: string): void {
    this.update((state) => ({
      ...state,
      fechaPago,
    }));
  }

  /**
   * Guarda el importe de pago en el estado.
   * @param importePago
   * */
  public setImportePago(importePago: string): void {
    this.update((state) => ({
      ...state,
      importePago,
    }));
  }

    /**
   * Guarda el importe de pago en el estado.
   * @param estado
   * */
  public setEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Limpia los datos de la solicitud
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
