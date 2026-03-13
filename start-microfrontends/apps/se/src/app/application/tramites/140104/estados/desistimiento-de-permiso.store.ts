import { Store, StoreConfig } from '@datorama/akita';
import { Cancelacion } from '../models/cancelacion-de-solicitus.model';
import { Injectable } from '@angular/core';

export interface Solicitud140104State {
  idSolicitud: number | null;
  motivoCancelacion: string | null;
  cuerpoTablaCancelacion: Cancelacion[];
}

/**
 * Crea el estado inicial para la solicitud 140104.
 *
 * @returns El estado inicial con un arreglo vacío de cancelaciones y el idSolicitud en 0.
 */
export function createInitialSolicitudState(): Solicitud140104State {
  return {
    idSolicitud: 0,
    motivoCancelacion: '',
    cuerpoTablaCancelacion: [],
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'desistimiento-de-permiso', resettable: true })
export class DesistimientoStore extends Store<Solicitud140104State> {
  /**
   * Constructor que inicializa la tienda con el estado inicial generado por `createDatosState()`.
   */
  constructor() {
    super(createInitialSolicitudState());
  }

  /**
   * Actualiza los datos de la forma de cancelación en el estado.
   *
   * @remarks
   * Este método recibe un arreglo de objetos de tipo `Cancelacion` y reemplaza
   * los datos actuales en el estado por los nuevos.
   *
   * Es útil cuando se modifica la información del formulario o cuando se cargan datos desde una fuente externa.
   *
   * @param datos - Arreglo de objetos de tipo `Cancelacion` que se utilizará para actualizar el estado.
   */
  public actualizarDatosForma(cuerpoTablaCancelacion: Cancelacion[]): void {
    this.update((_state) => ({
      cuerpoTablaCancelacion,
    }));
  }

  /**
   * Actualiza el estado del store con los valores proporcionados.
   * Valores parciales para actualizar el estado.
   */
  public actualizarEstado(valores: Partial<Solicitud140104State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }

  /**
   * Actualiza el estado con el nuevo valor de `idSolicitud`.
   */
  setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
}
