import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa el estado de la solicitud 6102.
 */
export interface Solicitud6102State {
  /**
   * Indica si la opción de radio parcial está seleccionada.
   */
  radioParcial: boolean;

  /**
   * Contiene los identificadores de los contenedores asociados.
   */
  contenedores: string;

  /**
   * Código de la aduana relacionada con la solicitud.
   */
  aduana: string;

  /**
   * Observaciones adicionales relacionadas con la solicitud.
   */
  observaciones: string;
}

/**
 * Crea el estado inicial para la solicitud 6102.
 *
 * @returns {Solicitud6102State} El estado inicial con los valores predeterminados:
 * - `radioParcial`: Indica si la opción parcial está seleccionada (por defecto `false`).
 * - `contenedores`: Cadena vacía para los contenedores.
 * - `aduana`: Cadena vacía para la aduana.
 * - `observaciones`: Cadena vacía para las observaciones.
 */
export function createInitialState(): Solicitud6102State {
  return {
    radioParcial: false,
    contenedores: '',
    aduana: '',
    observaciones: '',    
  };
}

/**
 * Store que gestiona el estado de la solicitud 6102.
 */
/**
 * Clase `Solicitud6102Store` que extiende de `Store<Solicitud6102State>`.
 * 
 * Esta clase representa una tienda de estado para manejar la información
 * relacionada con la solicitud 6102. Proporciona métodos para actualizar
 * diferentes propiedades del estado y para restablecer el estado a su
 * configuración inicial.
 * 
 * @remarks
 * - La clase utiliza decoradores de Angular como `@Injectable` para
 *   inyección de dependencias y `@StoreConfig` para configurar la tienda.
 * - Los métodos de esta clase permiten modificar propiedades específicas
 *   del estado de manera controlada.
 * 
 * @example
 * ```typescript
 * const store = new Solicitud6102Store();
 * store.setRadioParcial(true);
 * store.setContenedores('ABC123');
 * store.limpiarSolicitud();
 * ```
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'solicitud6102', resettable: true })

export class Solicitud6102Store extends Store<Solicitud6102State> {

  /**
   * Constructor de la clase.
   * Inicializa el estado inicial llamando al método `createInitialState`.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece el valor de `radioParcial` en el estado.
   *
   * @param radioParcial - Un valor booleano que indica el estado de `radioParcial`.
   */
  public setRadioParcial(radioParcial: boolean): void {
    this.update((state) => ({ ...state, radioParcial }));
  }

  /**
   * Establece los contenedores en el estado de la tienda.
   *
   * @param contenedores - Una cadena que representa los contenedores a establecer.
   */
  public setContenedores(contenedores: string): void {
    this.update((state) => ({ ...state, contenedores }));
  }

  /**
   * Establece el valor de la propiedad "aduana" en el estado.
   *
   * @param aduana - El valor de la aduana que se desea establecer.
   */
  public setAduana(aduana: string): void {
    this.update((state) => ({ ...state, aduana }));
  }

  /**
   * Establece las observaciones en el estado de la tienda.
   *
   * @param observaciones - Las observaciones que se deben actualizar en el estado.
   */
  public setObservaciones(observaciones: string): void {
    this.update((state) => ({ ...state, observaciones }));
  }

  /**
   * Limpia la solicitud actual restableciendo su estado.
   * Este método llama a la función `reset` para reiniciar los valores
   * de la solicitud a su estado inicial.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
