import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Interfaz que define el estado del trámite 420103.
 * Contiene las propiedades necesarias para gestionar los datos relacionados con el trámite.
 */
export interface Tramite420103State {
  /**
   * RFC del contribuyente asociado al trámite.
   */
  rfc: string;

  /**
  /** Debe tener un formato válido (por ejemplo, YYYY-MM-DD).
  */
  fechaInicial: string;

  /**
   * Debe tener un formato válido (por ejemplo, YYYY-MM-DD).
   */
  fechaFinal: string;
}

/**
 * Función que crea el estado inicial del trámite 420103.
 * Retorna un objeto con los valores predeterminados para el estado.
 */
export function createTramiteState(): Tramite420103State {
  return {
    /**
     * Valor inicial del RFC.
     */
    rfc: '',
    /**
     * Fecha de expedición de la factura
     */
    fechaInicial: '',
    /**
     * Fecha de finalización de la factura
     */
    fechaFinal: '',
  };
}

/**
 * Almacén de estado para gestionar los datos relacionados con el trámite 420103.
 * Utiliza Akita para gestionar el estado de la aplicación.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite420103', resettable: true })
export class Tramite420103Store extends Store<Tramite420103State> {
  /**
   * Constructor del almacén.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createTramiteState());
  }

  /**
   * Actualiza el estado de la solicitud con los valores proporcionados.
   * Param valores Objeto parcial con los valores a actualizar.
   */
  public actualizarEstado(valores: Partial<Tramite420103State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }

}