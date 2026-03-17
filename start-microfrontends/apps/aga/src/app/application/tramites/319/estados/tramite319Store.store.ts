import { Injectable } from '@angular/core';

import { Store, StoreConfig } from '@datorama/akita';

import { Solicitar } from '../models/personas';

import {
  FinalDataToSend,
  createDatosState,
} from '../models/tramite319-state.model';

/**
 * @description
 * Servicio que representa el estado de la tienda para el manejo de datos fitosanitarios.
 * Proporciona métodos para actualizar y eliminar datos relacionados con el formulario.
 *
 * @providedIn root
 * @storeConfig
 * - name: 'fitosanitariostore'
 * - resettable: true
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite319Store', resettable: true })
export class Tramite319Store extends Store<FinalDataToSend> {
  /**
   * @constructor
   * Initializes the `Tramite319Store` class by invoking the parent class constructor
   * with the initial state created by `createDatosState`.
   *
   * @description
   * This constructor is responsible for setting up the store's initial state
   * by calling the `createDatosState` function and passing the resulting state
   * to the parent class. This ensures that the store is properly initialized
   * with the required data structure and default values.
   *
   * @see {@link createDatosState} for details on the initial state structure.
   */
  constructor() {
    super(createDatosState());
  }
  /**
   * @method actualizarDatosForma
   * @description Elimina un dato del estado actual basado en su identificador único (ID).
   *
   * @param {Solicitar[]} datos - El identificador único del dato que se desea eliminar.
   *
   */
  public actualizarDatosForma(datos: Solicitar[]): void {
    this.update((state) => ({
      ...state,
      lista_periodos_solicitud: datos as Solicitar[],
    }));
  }

  /**
   * @method actualizarCampo
   * @description Actualiza un campo específico del estado con un nuevo valor.
   * @param campo
   * @param valor
   */
  public actualizarCampo(campo: keyof FinalDataToSend, valor: string | Solicitar[]): void {
    this.update((state) => ({
      ...state,
      [campo]: valor,
    }));
  }

  /**
   * @method eliminarDatoPorId
   * @description Elimina un dato del estado actual basado en su identificador único (ID).
   *
   * @param {number} id - El identificador único del dato que se desea eliminar.
   *
   * @example
   * // Ejemplo de uso:
   * this.eliminarDatoPorId(123);
   *
   * @remarks
   * Este método actualiza el estado eliminando el elemento cuyo ID coincide con el proporcionado.
   * Utiliza el método `filter` para crear una nueva lista de datos excluyendo el elemento especificado.
   */
  public eliminarDatoPorId(periodo: string): void {
    this.update((state) => ({
      ...state,
      lista_periodos_solicitud: state.lista_periodos_solicitud.filter(
        (dato) => dato.periodo !== periodo
      ),
    }));
  }

  /**
   * @method actualizarOperacion
   * @description Actualiza el estado de la operación con un nuevo valor.
   * @param {string} nuevaOperacion - El nuevo valor de la operación que se establecerá en el estado.
   * @returns {void}
   *
   * @example
   * // Ejemplo de uso:
   * tramite319Store.actualizarOperacion('nuevaOperacion');
   *
   * @category Estados
   */
  public actualizarOperacion(nuevaOperacion: string): void {
    this.update((state) => ({
      ...state,
      numero_registro: nuevaOperacion as string,
      clave_operacion_historica: nuevaOperacion as string,
    }));
  }

  /**
   * El nuevo estado completo a establecer.
   * @method actualizarTodo
   * @description Reemplaza completamente el estado con nuevos datos y una nueva operación.
   * @param {FinalDataToSend} nuevoEstado - El nuevo estado completo a establecer.
   *
   * @example
   * tramite319Store.actualizarTodo({
   *   datos: [...],
   *   operacion: 'crear'
   * });
   */
  public actualizarTodo(nuevoEstado: FinalDataToSend): void {
    this.update(() => ({
      ...nuevoEstado,
    }));
  }
}
