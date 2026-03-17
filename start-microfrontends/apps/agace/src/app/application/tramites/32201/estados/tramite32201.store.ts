import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa el estado de Solicitud32201.
 * Contiene los valores de los regímenes y el manifiesto.
 */
export interface Solicitud32201State {
  /**
   * El valor de regimen_0.
   * Indica si el régimen 0 está seleccionado.
   */
  regimen_0: boolean;

  /**
   * El valor de regimen_1.
   * Indica si el régimen 1 está seleccionado.
   */
  regimen_1: boolean;

  /**
   * El valor de regimen_2.
   * Indica si el régimen 2 está seleccionado.
   */
  regimen_2: boolean;

  /**
   * El valor de regimen_3.
   * Indica si el régimen 3 está seleccionado.
   */
  regimen_3: boolean;

  /**
   * El valor de manifiesto.
   * Indica si el manifiesto está activo.
   */
  manifiesto: boolean;

  /**
   * El valor de radio1.
   * Indica la selección del primer grupo de opciones de radio.
   */
  radio_1: string;

  /**
   * El valor de radio1.
   * Indica la selección del primer grupo de opciones de radio.
   */
  radio_2: string;

  /**
   * El valor de radio1.
   * Indica la selección del primer grupo de opciones de radio.
   */
  radio_3: string;

  /**
   * El valor de valorAduana.
   * Indica el valor aduana.
   */
  valorAduana?: string | undefined;

  /** Texto genérico 10, valor numérico */
  textoGenerico10: number | string;

  /** Texto genérico 11, valor numérico */
  textoGenerico11: number | string;

  /** Texto genérico 12, valor numérico */
  textoGenerico12: number | string;

  /** Texto genérico 13, valor numérico */
  textoGenerico13: number | string;

  /** Texto genérico 14, valor numérico */
  textoGenerico14: number | string;

  /** Texto genérico 15, valor numérico */
  textoGenerico15: number | string;

  /** Texto genérico 16, valor numérico */
  textoGenerico16: number | string;

  /** Texto genérico 17, valor numérico */
  textoGenerico17: number | string;

  /** Texto genérico 18, valor numérico */
  textoGenerico18: number | string;

  /** Texto genérico 19, valor numérico */
  textoGenerico19: number | string;

  /** Texto genérico 20, valor numérico */
  textoGenerico20: number | string;

  /** Texto genérico 21, valor numérico */
  textoGenerico21: number | string;

  /** Texto genérico 22, valor numérico */
  textoGenerico22: number | string;

  /** Texto genérico 23, valor numérico */
  textoGenerico23: number | string;

  /** Texto genérico 24, valor numérico */
  textoGenerico24: number | string;

}

/**
 * Función para crear el estado inicial de Solicitud32201.
 * Inicializa todos los valores de los regímenes y el manifiesto como `false`.
 * 
 * @returns {Solicitud32201State} El estado inicial de Solicitud32201.
 */
export function createInitialState(): Solicitud32201State {
  return {
    /**
     * El valor inicial de regimen_0.
     */
    regimen_0: false,

    /**
     * El valor inicial de regimen_1.
     */
    regimen_1: false,

    /**
     * El valor inicial de regimen_2.
     */
    regimen_2: false,

    /**
     * El valor inicial de regimen_3.
     */
    regimen_3: false,

    /**
     * El valor inicial de manifiesto.
     */
    manifiesto: false,

    /**
     * El valor inicial de radio1.
     */
    radio_1: '',

    /**
     * El valor inicial de radio2.
     */
    radio_2: '',

    /**
     * El valor inicial de radio3.
     */
    radio_3: '',

    /**
     * El valor inicial de valorAduana.
     */
    valorAduana: '',

    textoGenerico10: '',
    textoGenerico11: '',
    textoGenerico12: '',
    textoGenerico13: '',
    textoGenerico14: '',
    textoGenerico15: '',
    textoGenerico16: '',
    textoGenerico17: '',
    textoGenerico18: '',
    textoGenerico19: '',
    textoGenerico20: '',
    textoGenerico21: '',
    textoGenerico22: '',
    textoGenerico23: '',
    textoGenerico24: '',
    
  };
}

/**
 * Decorador Injectable para hacer que la tienda esté disponible a nivel raíz.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Decorador StoreConfig para configurar la tienda con un nombre y una opción de restablecimiento.
 * 
 * @param {Object} config - El objeto de configuración.
 * @param {string} config.name - El nombre de la tienda.
 * @param {boolean} config.resettable - Indica si la tienda es restablecible.
 */
@StoreConfig({ name: 'tramite32201', resettable: true })
export class Tramite32201Store extends Store<Solicitud32201State> {
  /**
   * Crea una instancia de Tramite32201Store.
   * Inicializa la tienda con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece el estado de regimen_0.
   * 
   * @param {boolean} regimen_0 - El valor de regimen_0.
   */
  public setRegimen_0(regimen_0: boolean): void {
    this.update((state) => ({
      ...state,
      regimen_0,
    }));
  }

  /**
   * Establece el estado de regimen_1.
   * 
   * @param {boolean} regimen_1 - El valor de regimen_1.
   */
  public setRegimen_1(regimen_1: boolean): void {
    this.update((state) => ({
      ...state,
      regimen_1,
    }));
  }

  /**
   * Establece el estado de regimen_2.
   * 
   * @param {boolean} regimen_2 - El valor de regimen_2.
   */
  public setRegimen_2(regimen_2: boolean): void {
    this.update((state) => ({
      ...state,
      regimen_2,
    }));
  }

  /**
   * Establece el estado de regimen_3.
   * 
   * @param {boolean} regimen_3 - El valor de regimen_3.
   */
  public setRegimen_3(regimen_3: boolean): void {
    this.update((state) => ({
      ...state,
      regimen_3,
    }));
  }

  /**
   * Establece el estado de manifiesto.
   * 
   * @param {boolean} manifiesto - El valor de manifiesto.
   */
  public setManifiesto(manifiesto: boolean): void {
    this.update((state) => ({
      ...state,
      manifiesto,
    }));
  }

  /**
   * Establece el estado de radio1.
   * 
   * @param {string} radio_1 - El valor de radio1.
   */
  public setRadio_1(radio_1: string): void {
    this.update((state) => ({
      ...state,
      radio_1,
    }));
  }

  /**
   * Establece el estado de radio2.
   * 
   * @param {string} radio_2 - El valor de radio2.
   */
  public setRadio_2(radio_2: string): void {
    this.update((state) => ({
      ...state,
      radio_2,
    }));
  }

  /**
   * Establece el estado de radio3.
   * 
   * @param {string} radio_3 - El valor de radio3.
   */
  public setRadio_3(radio_3: string): void {
    this.update((state) => ({
      ...state,
      radio_3,
    }));
  }

  /**
   * Establece el estado de valorAduana.
   * 
   * @param {string} valorAduana - El valor de valorAduana.
   */
  public setValorAduana(valorAduana: string | undefined): void {
    this.update((state) => ({
      ...state,
      valorAduana,
    }));
  }

  /**
   * Establece el estado de textoGenerico10.
   */
  public setTextoGenerico10(textoGenerico10: number | string): void {
    this.update((state) => ({
      ...state,
      textoGenerico10,
    }));
  }

  /**
   * Establece el estado de textoGenerico11.
   */
  public setTextoGenerico11(textoGenerico11: number | string): void {
    this.update((state) => ({
      ...state,
      textoGenerico11,
    }));
  }

  /**
   * Establece el estado de textoGenerico12.
   */
  public setTextoGenerico12(textoGenerico12: number | string): void {
    this.update((state) => ({
      ...state,
      textoGenerico12,
    }));
  }

  /**
   * Establece el estado de textoGenerico13.
   */
  public setTextoGenerico13(textoGenerico13: number | string): void {
    this.update((state) => ({
      ...state,
      textoGenerico13,
    }));
  }

  /**
   * Establece el estado de textoGenerico14.
   */
  public setTextoGenerico14(textoGenerico14: number | string): void {
    this.update((state) => ({
      ...state,
      textoGenerico14,
    }));
  }

  /**
   * Establece el estado de textoGenerico15.
   */
  public setTextoGenerico15(textoGenerico15: number | string): void {
    this.update((state) => ({
      ...state,
      textoGenerico15,
    }));
  }

  /**
   * Establece el estado de textoGenerico16.
   */
  public setTextoGenerico16(textoGenerico16: number | string): void {
    this.update((state) => ({
      ...state,
      textoGenerico16,
    }));
  }

  /**
   * Establece el estado de textoGenerico17.
   */
  public setTextoGenerico17(textoGenerico17: number | string): void {
    this.update((state) => ({
      ...state,
      textoGenerico17,
    }));
  }

  /**
   * Establece el estado de textoGenerico18.
   */
  public setTextoGenerico18(textoGenerico18: number | string): void {
    this.update((state) => ({
      ...state,
      textoGenerico18,
    }));
  }

  /**
   * Establece el estado de textoGenerico19.
   */
  public setTextoGenerico19(textoGenerico19: number | string): void {
    this.update((state) => ({
      ...state,
      textoGenerico19,
    }));
  }

  /**
   * Establece el estado de textoGenerico20.
   */
  public setTextoGenerico20(textoGenerico20: number | string): void {
    this.update((state) => ({
      ...state,
      textoGenerico20,
    }));
  }

  /**
   * Establece el estado de textoGenerico21.
   */
  public setTextoGenerico21(textoGenerico21: number | string): void {
    this.update((state) => ({
      ...state,
      textoGenerico21,
    }));
  }

  /**
   * Establece el estado de textoGenerico22.
   */
  public setTextoGenerico22(textoGenerico22: number | string): void {
    this.update((state) => ({
      ...state,
      textoGenerico22,
    }));
  }

  /**
   * Establece el estado de textoGenerico23.
   */
  public setTextoGenerico23(textoGenerico23: number | string): void {
    this.update((state) => ({
      ...state,
      textoGenerico23,
    }));
  }

  /**
   * Establece el estado de textoGenerico24.
   */
  public setTextoGenerico24(textoGenerico24: number | string): void {
    this.update((state) => ({
      ...state,
      textoGenerico24,
    }));
  }

  /**
   * Limpia los datos de la solicitud.
   * Restablece el estado al valor inicial.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
