import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Creacion del estado inicial para la interfaz de tramite 31501
 * @returns Solicitud31501
 */
/**
 * Representa el estado de la solicitud 31501.
 * 
 * @interface Solicitud31501State
 * 
 * @property {string} tipoBusqueda - Tipo de búsqueda realizada en la solicitud.
 * @property {string} rfc - Registro Federal de Contribuyentes asociado a la solicitud.
 * @property {string} tipoDeTramite - Tipo de trámite que se está gestionando.
 * @property {string} tipoDeRequerimiento - Tipo de requerimiento relacionado con el trámite.
 * @property {string} folioDeTramite - Folio único que identifica el trámite.
 * @property {[]} datosDelContenedor - Información relacionada con los contenedores asociados al trámite.
 * @property {string} [motivoCancelacion] - Motivo por el cual se cancela la solicitud (opcional).
 */
export interface Solicitud31501State {
  tipoBusqueda: string;
  rfc: string;
  tipoDeTramite: string;
  tipoDeRequerimiento: string;
  folioDeTramite: string;
  datosDelContenedor: [];
  motivoCancelacion?: string;
}

/**
 * Crea el estado inicial para la solicitud 31501.
 * 
 * @returns {Solicitud31501State} El estado inicial con los valores predeterminados:
 * - `tipoBusqueda`: Cadena vacía.
 * - `rfc`: Cadena vacía.
 * - `tipoDeTramite`: Cadena vacía.
 * - `tipoDeRequerimiento`: Cadena vacía.
 * - `folioDeTramite`: Cadena vacía.
 * - `datosDelContenedor`: Arreglo vacío.
 * - `motivoCancelacion`: Cadena vacía.
 */
export function createInitialState(): Solicitud31501State {
  return {
    tipoBusqueda: '',
    rfc: '',
    tipoDeTramite: '',
    tipoDeRequerimiento: '',
    folioDeTramite: '',
    datosDelContenedor: [],
    motivoCancelacion: '',
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite31501', resettable: true })
/**
 * Clase que representa la tienda de estado para el trámite 31501.
 * Extiende la funcionalidad de la clase base `Store` para manejar el estado
 * específico relacionado con el trámite 31501.
 *
 * Métodos principales:
 * - `setTipoBusqueda`: Establece el tipo de búsqueda en el estado.
 * - `setRfc`: Establece el RFC en el estado.
 * - `setTipoDeTramite`: Establece el tipo de trámite en el estado.
 * - `setTipoDeRequerimiento`: Establece el tipo de requerimiento en el estado.
 * - `setFolioDeTramite`: Establece el folio del trámite en el estado.
 * - `setDelContenedor`: Establece los datos del contenedor en el estado.
 * - `setMotivoCancelacion`: Establece el motivo de cancelación en el estado.
 *
 * Esta clase permite actualizar el estado de manera reactiva utilizando
 * el método `update` para modificar propiedades específicas del estado.
 */
export class Tramite31501Store extends Store<Solicitud31501State> {
  setFraccionRegla(_arg0: string): void {
    // Implementación de marcador de posición para satisfacer el linter
    throw new Error('Método no implementado en Tramite31501Store: ' + this.constructor.name);
  }
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece el tipo de búsqueda en el estado de la tienda.
   *
   * @param tipoBusqueda - El tipo de búsqueda que se desea establecer.
   */
  public setTipoBusqueda(tipoBusqueda: string): void {
    this.update((state) => ({
      ...state,
      tipoBusqueda,
    }));
  }

  /**
   * Establece el RFC en el estado de la tienda.
   *
   * @param rfc - El RFC (Registro Federal de Contribuyentes) que se desea establecer.
   */
  public setRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }

  /**
   * Establece el tipo de trámite en el estado de la tienda.
   *
   * @param tipoDeTramite - El tipo de trámite que se desea establecer.
   */
  public setTipoDeTramite(tipoDeTramite: string): void {
    this.update((state) => ({
      ...state,
      tipoDeTramite,
    }));
  }

  /**
   * Establece el tipo de requerimiento en el estado de la tienda.
   *
   * @param tipoDeRequerimiento - El tipo de requerimiento que se desea establecer.
   */
  public setTipoDeRequerimiento(tipoDeRequerimiento: string): void {
    this.update((state) => ({
      ...state,
      tipoDeRequerimiento,
    }));
  }

  /**
   * Establece el folio del trámite en el estado de la tienda.
   *
   * @param folioDeTramite - El folio del trámite que se desea establecer.
   */
  public setFolioDeTramite(folioDeTramite: string): void {
    this.update((state) => ({
      ...state,
      folioDeTramite,
    }));
  }

  /**
   * Establece los datos del contenedor en el estado de la tienda.
   *
   * @param datosDelContenedor - Un arreglo que contiene los datos del contenedor a establecer.
   * 
   * Este método actualiza el estado de la tienda con los datos proporcionados.
   */
  public setDelContenedor(datosDelContenedor: []): void {
    this.update((state) => ({
      ...state,
      datosDelContenedor,
    }));
  }

  /**
   * Establece el motivo de cancelación en el estado de la tienda.
   *
   * @param motivoCancelacion - El motivo de cancelación que se desea establecer.
   */
  public setMotivoCancelacion(motivoCancelacion: string): void {
    this.update((state) => ({
      ...state,
      motivoCancelacion,
    }));
  }
}
