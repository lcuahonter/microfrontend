import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa un catálogo genérico.
 * Un catálogo contiene un identificador único y una descripción asociada.
 */
export interface Catalogo {
  /**
   * Identificador único del catálogo.
   * @type {number}
   */
  id: number;

  /**
   * Descripción del catálogo.
   * @type {string}
   */
  descripcion: string;
}

/**
 * Interfaz que representa el estado inicial de la solicitud 90304.
 */
export interface Solicitud90304State {

  /**
   * Identificador único de la solicitud.
   * @type {number | null}
   */
  idSolicitud: number | null;
  /**
   * Indica si el elemento está en estado de baja.
   * @type {boolean}
   */
  isBaja: boolean;

  /**
   * Datos relacionados con la mercancía.
   * @type {[]}
   */
  datosDelMercancia: [];
}

/**
 * Función que crea el estado inicial de la solicitud 90304.
 * @returns Estado inicial de la solicitud.
 */
export function createInitialState(): Solicitud90304State {
  return {
    idSolicitud: 0,
    isBaja: true,
    datosDelMercancia: [],
  };
}

/**
 * Clase que representa el store para manejar el estado de la solicitud 90304.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite90304', resettable: true })
export class Tramite90304Store extends Store<Solicitud90304State> {
  /**
   * Constructor del store.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Guarda el ID de la solicitud en el estado.
   *
   * @param idSolicitud - El ID de la solicitud que se va a guardar.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * Establece el valor de isBaja.
   * @param isBaja Valor booleano a establecer que indica si el elemento está en estado de baja.
   */
  public setIsBaja(isBaja: boolean): void {
    this.update((state) => ({
      ...state,
      isBaja,
    }));
  }

  /**
   * Establece los datos de la mercancía.
   * @param datosDelMercancia Array con los datos de la mercancía a almacenar.
   */
  public setDelMercancia(datosDelMercancia: []): void {
    this.update((state) => ({
      ...state,
      datosDelMercancia,
    }));
  }

  /**
   * Limpia los datos de la solicitud.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
