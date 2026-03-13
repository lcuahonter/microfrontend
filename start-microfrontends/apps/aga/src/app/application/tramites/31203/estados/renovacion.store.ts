import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa el estado de una solicitud en el sistema.
 */
export interface UnicoState {
  /** Modalidad de la solicitud (tipo de trámite). */
  mapTipoTramite: string;

  /** Declaración bajo protesta de decir verdad. */
  mapDeclaracionSolicitud: string;

  /** Estado del envío del aviso (por ejemplo, "enviado", "pendiente"). */
  envioAviso: string;

  /** Número de aviso generado por el sistema. */
  numeroAviso: string;

  /** Clave de referencia de la solicitud para su seguimiento. */
  claveReferencia: string;

  /** Número de operación bancaria asociada a la solicitud. */
  numeroOperacion: string;

  /** Cadena que representa la dependencia gubernamental o institución relacionada. */
  cadenaDependencia: string;

  /** Información del banco involucrado en el pago. */
  banco: string;

  /** Llave única que identifica el pago realizado. */
  llavePago: string;

  /** Fecha en la que se realizó el pago. */
  fechaPago: string;

  /** Importe o monto del pago realizado. */
  importePago: string;

  /**
   * Función para manejar la modalidad.
   *
   * @param modalidad Valor de modalidad (tipo desconocido).
   * @returns {unknown} Valor devuelto según implementación.
   */
  modalidad(modalidad: unknown): unknown;
}


/**
 * Genera y devuelve el estado inicial de una solicitud.
 *
 * @returns {UnicoState} Estado inicial con todos los campos vacíos y función `modalidad` sin implementar.
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
    modalidad: function (_modalidad: unknown): unknown {
      throw new Error('Function not implemented.');
    },
  };
}

/**
 * @class UnicoStore
 * @description
 * Almacén de estado para gestionar la información de una solicitud.
 * Utiliza Akita para manejar la reactividad del estado y proporciona métodos para actualizarlo.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'renovacionStore', resettable: true })
export class UnicoStore extends Store<UnicoState> {
  /**
   * Crea una nueva instancia del almacén con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece el valor de `mapTipoTramite`.
   * @param mapTipoTramite Nueva modalidad o tipo de trámite.
   */
  public setmapTipoTramite(mapTipoTramite: string): void {
    this.update((state) => ({
      ...state,
      mapTipoTramite,
    }));
  }

  /**
   * Establece el valor de `mapDeclaracionSolicitud`.
   * @param mapDeclaracionSolicitud Declaración de protesta de verdad.
   */
  public setmapDeclaracionSolicitud(mapDeclaracionSolicitud: string): void {
    this.update((state) => ({
      ...state,
      mapDeclaracionSolicitud,
    }));
  }

  /**
   * Establece el valor de `envioAviso`.
   * @param envioAviso Estado del envío del aviso.
   */
  public setenvioAviso(envioAviso: string): void {
    this.update((state) => ({
      ...state,
      envioAviso,
    }));
  }

  /**
   * Establece el valor de `numeroAviso`.
   * @param numeroAviso Número del aviso generado.
   */
  public setnumeroAviso(numeroAviso: string): void {
    this.update((state) => ({
      ...state,
      numeroAviso,
    }));
  }

  /**
   * Establece el valor de `claveReferencia`.
   * @param claveReferencia Clave de referencia para la solicitud.
   */
  public setclaveReferencia(claveReferencia: string): void {
    this.update((state) => ({
      ...state,
      claveReferencia,
    }));
  }

  /**
   * Establece el valor de `numeroOperacion`.
   * @param numeroOperacion Número de operación bancaria.
   */
  public setnumeroOperacion(numeroOperacion: string): void {
    this.update((state) => ({
      ...state,
      numeroOperacion,
    }));
  }

  /**
   * Establece el valor de `cadenaDependencia`.
   * @param cadenaDependencia Nombre o código de la dependencia relacionada.
   */
  public setcadenaDependencia(cadenaDependencia: string): void {
    this.update((state) => ({
      ...state,
      cadenaDependencia,
    }));
  }

  /**
   * Establece el valor de `banco`.
   * @param banco Información del banco involucrado.
   */
  public setbanco(banco: string): void {
    this.update((state) => ({
      ...state,
      banco,
    }));
  }

  /**
   * Establece el valor de `llavePago`.
   * @param llavePago Llave de pago única asociada.
   */
  public setllavePago(llavePago: string): void {
    this.update((state) => ({
      ...state,
      llavePago,
    }));
  }

  /**
   * Establece el valor de `fechaPago`.
   * @param fechaPago Fecha en formato string en la que se efectuó el pago.
   */
  public setfechaPago(fechaPago: string): void {
    this.update((state) => ({
      ...state,
      fechaPago,
    }));
  }

  /**
   * Establece el valor de `importePago`.
   * @param importePago Monto del pago realizado.
   */
  public setimportePago(importePago: string): void {
    this.update((state) => ({
      ...state,
      importePago,
    }));
  }
}
