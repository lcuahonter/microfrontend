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
 * Estado inicial para la interfaz del trámite 31803.
 */
export interface Solicitud31803State {
  numeroOficio: string;
  claveReferencia: string;
  cadenaDependencia: string;
  importePago: string;
  fechaInicial: string;
  fechaFinal: string;
  /** Número de operación asociado a la solicitud. */
  numeroOperacion: string;
  /** Lista de bancos asociados a la solicitud. */
  banco: string;
  /** Llave única asociada a la solicitud. */
  llave: string;
  /** Primer manifiesto asociado a la solicitud. */
  manifiesto1: string;
  /** Segundo manifiesto asociado a la solicitud. */
  manifiesto2: string;
  /** Fecha de pago asociada a la solicitud. */
  fechaPago: string;
}

/**
 * Crea el estado inicial para la solicitud del trámite 31803.
 * @returns Estado inicial de tipo `Solicitud31803State`.
 */
export function createInitialState(): Solicitud31803State {
  return {
    numeroOficio: '2500302601620259910000004-000002',
    claveReferencia: '284000255',
    cadenaDependencia: '0111514EC40203',
    importePago: '30739',
    fechaInicial: '09/03/2025',
    fechaFinal: '12/03/2025',
    numeroOperacion: '',
    banco:'',
    llave: '',
    manifiesto1: '',
    manifiesto2: '',
    fechaPago: '',
  };
}

/**
 * Clase que representa el almacén de estado para el trámite 31803.
 * Gestiona el estado global de la solicitud y proporciona métodos para actualizarlo.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite31803', resettable: true })
export class Tramite31803Store extends Store<Solicitud31803State> {
  /**
   * Constructor del almacén.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }
  /**
   * Actualiza el número de oficio en el estado.
   * @param numeroOficio Número de oficio de tipo `string`.
   */
  public setNumeroOficio(numeroOficio: string): void {
    this.update((state) => ({ ...state, numeroOficio }));
  }
  /**
   * Actualiza la clave de referencia en el estado.
   * @param claveReferencia Clave de referencia de tipo `string`.
   */
  public setClaveReferencia(claveReferencia: string): void {
    this.update((state) => ({ ...state, claveReferencia }));
  }
  /**
   * Actualiza la cadena de dependencia en el estado.
   * @param cadenaDependencia Cadena de dependencia de tipo `string`.
   */
  public setCadenaDependencia(cadenaDependencia: string): void {
    this.update((state) => ({ ...state, cadenaDependencia }));
  }
  /**
   * Actualiza el importe de pago en el estado.
   * @param importePago Importe de pago de tipo `string`.
   */
  public setImportePago(importePago: string): void {
    this.update((state) => ({ ...state, importePago }));
  }
  /**
   * Actualiza la fecha inicial en el estado.
   * @param fechaInicial Fecha inicial de tipo `string`.
   */
  public setFechaInicial(fechaInicial: string): void {
    this.update((state) => ({ ...state, fechaInicial }));
  }
  /**
   * Actualiza la fecha final en el estado.
   * @param fechaFinal Fecha final de tipo `string`.
   */
  public setFechaFinal(fechaFinal: string): void {
    this.update((state) => ({ ...state, fechaFinal }));
  }

  /**
   * Actualiza la lista de bancos en el estado.
   * @param banco Lista de bancos de tipo `Catalogo[]`.
   */
  public setBanco(banco:string): void {
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
  public setManifiesto1(manifiesto1: string): void {
    this.update((state) => ({ ...state, manifiesto1 }));
  }

  /**
   * Actualiza el segundo manifiesto en el estado.
   * @param manifiesto2 Segundo manifiesto de tipo `string`.
   */
  public setManifiesto2(manifiesto2: string): void {
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
   * Restaura el estado al valor inicial.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
