import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa un catálogo con un identificador y una descripción.
 */
export interface Catalogo {
  /** Identificador único del catálogo. */
  id: number;
  /** Descripción del catálogo. */
  descripcion: string;
}

/**
 * Estado inicial para la interfaz del trámite 30506.
 */
export interface Solicitud30506State {
  /** Número de operación asociado a la solicitud. */
  numeroOperacion: string;
  /** Fecha de inicio del trámite. */
  fechaInicio: string;
  /** Fecha final del trámite. */
  fechaFinal: string;
  /** Lista de bancos asociados a la solicitud. */
  banco: string;
  /** Llave única asociada a la solicitud. */
  llave: string;
  /** Primer manifiesto asociado a la solicitud. */
  manifiesto1: boolean;
  /** Segundo manifiesto asociado a la solicitud. */
  manifiesto2: boolean;
  /** Fecha de pago asociada a la solicitud. */
  fechaPago: string;
  /** Folio de la solicitud. */
  folio: string;
  /** Clave de referencia asociada a la solicitud. */
  claveReferencia: string;
  /** Cadena de la dependencia asociada a la solicitud. */
  cadenaDependecia: string;
  /** Importe del pago asociado a la solicitud. */
  importePago: string;
}

/**
 * Crea el estado inicial para la solicitud del trámite 30506.
 * @returns Estado inicial de tipo `Solicitud30506State`.
 */
export function createInitialState(): Solicitud30506State {
  return {
    numeroOperacion: '',
    fechaInicio: '29/05/2025',
    fechaFinal: '29/06/2025',
    banco: '',
    llave: '',
    manifiesto1: false,
    manifiesto2: false,
    fechaPago: '',
    folio: '',
    claveReferencia: '',
    cadenaDependecia :'',
    importePago: '',
  };
}

/**
 * Clase que representa el almacén de estado para el trámite 30506.
 * Gestiona el estado global de la solicitud y proporciona métodos para actualizarlo.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite30506', resettable: true })
export class Tramite30506Store extends Store<Solicitud30506State> {
  /**
   * Constructor del almacén.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza la lista de bancos en el estado.
   * @param banco Lista de bancos de tipo `Catalogo[]`.
   */
  public setBanco(banco: string): void {
    this.update((state) => ({ ...state, banco }));
  }

  /**
   * Actualiza el número de operación en el estado.
   * @param numeroOperacion Número de operación de tipo `string`.
   */
  public setNumeroOperacion(numeroOperacion: string): void {
    this.update((state) => ({ ...state, numeroOperacion }));
  }
  /**
   * Actualiza la fecha de inicio y final en el estado.
   * @param fechaInicio Fecha de inicio de tipo `string`.
   */
  public setFechaInicio(fechaInicio: string): void {
    this.update((state) => ({ ...state, fechaInicio }));
  }
  /**
   * Actualiza la fecha final en el estado.
   * @param fechaFinal Fecha final de tipo `string`.
   */
  public setFechaFinal(fechaFinal: string): void {
    this.update((state) => ({ ...state, fechaFinal }));
  }
  /**
   * Actualiza la llave en el estado.
   * @param llave Llave única de tipo `string`.
   */
  public setLlave(llave: string): void {
    this.update((state) => ({ ...state, llave }));
  }

  /**
   * Actualiza el primer manifiesto en el estado.
   * @param manifiesto1 Primer manifiesto de tipo `string`.
   */
  public setManifiesto1(manifiesto1: boolean): void {
    this.update((state) => ({ ...state, manifiesto1 }));
  }

  /**
   * Actualiza el segundo manifiesto en el estado.
   * @param manifiesto2 Segundo manifiesto de tipo `string`.
   */
  public setManifiesto2(manifiesto2: boolean): void {
    this.update((state) => ({ ...state, manifiesto2 }));
  }

  /**
   * Actualiza la fecha de pago en el estado.
   * @param fechaPago Fecha de pago de tipo `string`.
   */
  public setFechaPago(fechaPago: string): void {
    this.update((state) => ({ ...state, fechaPago }));
  }
  /**
   * Actualiza el folio en el estado.
   * @param folio Folio de tipo `string`.
   */
  public setFolio(folio: string): void {
    this.update((state) => ({ ...state, folio }));
  }
  /**
   * Actualiza la clave de referencia en el estado.
   * @param claveReferencia Clave de referencia de tipo `string`.
   */
  public setClaveReferencia(claveReferencia: string): void {
    this.update((state) => ({ ...state, claveReferencia }));
  }
  /**
   * Actualiza la cadena de la dependencia en el estado.
   * @param cadenaDependecia Cadena de la dependencia de tipo `string`.
   */
  public setCadenaDependecia(cadenaDependecia: string): void {
    this.update((state) => ({ ...state, cadenaDependecia }));
  }
  /**
   * Actualiza el importe de pago en el estado.
   * @param importePago Importe de pago de tipo `string`.
   */
  public setImportePago(importePago: string): void {
    this.update((state) => ({ ...state, importePago }));
  }

  /**
   * Restaura el estado al valor inicial.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
