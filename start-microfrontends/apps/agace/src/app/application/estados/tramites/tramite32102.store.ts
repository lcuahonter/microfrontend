import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';


/**
 * Representa el estado de la solicitud 32102.
 * Cada propiedad indica si un manifiesto específico está presente o no.
 *
 * @property {boolean} MANIFIESTO_1 - Indica si el manifiesto 1 está presente.
 * @property {boolean} MANIFIESTO_2 - Indica si el manifiesto 2 está presente.
 * @property {boolean} MANIFIESTO_3 - Indica si el manifiesto 3 está presente.
 * @property {boolean} MANIFIESTO_4 - Indica si el manifiesto 4 está presente.
 */
export interface Solicitud32102State {
  MANIFIESTO_1: boolean;
  MANIFIESTO_2: boolean;
  MANIFIESTO_3: boolean;
  MANIFIESTO_4: boolean;
}


/**
 * Crea el estado inicial para la solicitud 32102.
 *
 * @returns {Solicitud32102State} El estado inicial con los valores predeterminados
 * para los manifiestos (MANIFIESTO_1, MANIFIESTO_2, MANIFIESTO_3, MANIFIESTO_4) establecidos en `false`.
 */
export function createInitialState(): Solicitud32102State {
  return {
    MANIFIESTO_1: false,
    MANIFIESTO_2: false,
    MANIFIESTO_3: false,
    MANIFIESTO_4: false,
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite32102', resettable: true })
export class Tramite32102Store extends Store<Solicitud32102State> {

  constructor() {
    super(createInitialState());
  }

  /**
   * Establece el valor de la propiedad `MANIFIESTO_1` en el estado.
   *
   * @param MANIFIESTO_1 - Valor booleano que indica el estado del manifiesto.
   */
  public setManifiesto1(MANIFIESTO_1: boolean): void {
    this.update((state) => ({
      ...state,
      MANIFIESTO_1,
    }));
  }

  /**
   * Establece el valor de la propiedad `MANIFIESTO_2` en el estado.
   *
   * @param MANIFIESTO_2 - Valor booleano que indica el estado del manifiesto.
   */
  public setManifiesto2(MANIFIESTO_2: boolean): void {
    this.update((state) => ({
      ...state,
      MANIFIESTO_2,
    }));
  }

  /**
   * Establece el valor de la propiedad `MANIFIESTO_3` en el estado.
   *
   * @param MANIFIESTO_3 - Valor booleano que indica el estado del manifiesto 3.
   */
  public setManifiesto3(MANIFIESTO_3: boolean): void {
    this.update((state) => ({
      ...state,
      MANIFIESTO_3,
    }));
  }

  /**
   * Establece el valor de la propiedad `MANIFIESTO_4` en el estado.
   *
   * @param MANIFIESTO_4 - Un valor booleano que representa el estado del manifiesto 4.
   */
  public setManifiesto4(MANIFIESTO_4: boolean): void {
    this.update((state) => ({
      ...state,
      MANIFIESTO_4,
    }));
  }
}
