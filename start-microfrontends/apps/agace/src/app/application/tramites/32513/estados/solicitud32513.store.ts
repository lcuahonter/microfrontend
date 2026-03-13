import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Interfaz que define la estructura del estado centralizado para la solicitud 32513.
 * Contiene los campos necesarios para el llenado del formulario correspondiente.
 */
export interface Solicitud32513State {
  /**
   * Descripción de la mercancía.
   */
  descripcionMercancia?: string;

  /**
   * Porcentaje de desperdicio.
   */
  porcentajeDesperdicio?: number;

  /**
   * Código ADACE.
   */
  adace?: string;
}

/**
 * Función que crea el estado inicial de la solicitud.
 * Devuelve un objeto con los valores iniciales para cada campo del estado.
 *
 * @returns {Solicitud32513State} Estado inicial de la solicitud.
 */
export function createInitialSolicitudState(): Solicitud32513State {
  return {
    /**
     * Descripción de la mercancía, inicialmente vacío.
     */
    descripcionMercancia: '',

    /**
     * Porcentaje de desperdicio, inicialmente vacío.
     */
    porcentajeDesperdicio: 0,

    /**
     * Código ADACE, inicialmente establecido en 'ADACE-01'.
     */
    adace: 'ADACE-01'
  };
}

@Injectable({
  providedIn: 'root',
})

@StoreConfig({
  /**
   * Nombre de la configuración para el store.
   */
  name: 'solicitud32513',

  /**
   * Habilita la opción de restablecer el estado del store.
   */
  resettable: true,
})
export class Solicitud32513Store extends Store<Solicitud32513State> {
  /**
   * Constructor de la clase Solicitud32513Store.
   * Inicializa el store con el estado inicial definido por createInitialSolicitudState().
   */
  constructor() {
    super(createInitialSolicitudState());
  }

  /**
   * Actualiza la descripción de la mercancía en el estado.
   * @param descripcionMercancia Nueva descripción de la mercancía.
   */
  public setDescripcionMercancia(descripcionMercancia: string): void {
    this.update((state) => ({
      ...state,
      descripcionMercancia,
    }));
  }

  /**
   * Actualiza el porcentaje de desperdicio en el estado.
   * @param porcentajeDesperdicio Nuevo porcentaje de desperdicio.
   */
  public setPorcentajeDesperdicio(porcentajeDesperdicio: number): void {
    this.update((state) => ({
      ...state,
      porcentajeDesperdicio,
    }));
  }

  /**
   * Actualiza el código ADACE en el estado.
   * @param adace Nuevo código ADACE.
   */
  public setAdace(adace: string): void {
    this.update((state) => ({
      ...state,
      adace,
    }));
  }

  /**
   * Limpia los datos de la solicitud, restableciendo el estado a sus valores iniciales.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
