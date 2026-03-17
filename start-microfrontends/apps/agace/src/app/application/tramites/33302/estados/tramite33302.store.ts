/**
 * Importación de la librería Akita para gestionar el estado global de la aplicación.
 * Se incluyen `Store` y `StoreConfig` para definir y estructurar la tienda de datos.
 */
import { Store, StoreConfig } from '@datorama/akita';

/**
 * Importación de la funcionalidad `Injectable` de Angular.
 * Se usa para definir que la clase puede ser inyectada como un servicio.
 */
import { Injectable } from '@angular/core';

/**
 * Definición de la interfaz `Catalogo`.
 * Representa un objeto con un identificador único y una descripción asociada.
 */
export interface Catalogo {
    /**
     * Identificador único del catálogo.
     */
    id: number;

    /**
     * Descripción del elemento dentro del catálogo.
     */
    descripcion: string;
   
}
/**
 * @interface Tramite33302State
 * @description
 * Representa el estado del trámite 33302, incluyendo datos relacionados con claves de referencia,
 * dependencias, pagos, y otros detalles asociados al trámite.
 */
export interface Tramite33302State {
  /**
   * @property {string} claveDeReferencia
   * Clave de referencia del trámite.
   */
  claveDeReferencia: string;

  /**
   * @property {string} cadenaDependencia
   * Cadena de dependencia asociada al trámite.
   */
  cadenaDependencia: string;

  /**
   * @property {string} banco
   * Nombre del banco donde se realizó el pago.
   */
  banco: string;

  /**
   * @property {string} llaveDePago
   * Llave única del pago.
   */
  llaveDePago: string;

  /**
   * @property {string} fechaDePago
   * Fecha de pago.
   */
  fechaDePago: string;

  /**
   * @property {string} importeDePago
   * Importe total del pago.
   */
  importeDePago: string;

  /**
   * @property {string} numeroDe
   * Número asociado al trámite.
   */
  numeroDe: string;

  /**
   * @property {string} modalidadCertificacion
   * Modalidad de certificación.
   */
  modalidadCertificacion: string;

  /**
   * @property {boolean} foreignClientsSuppliers
   * Indica si es un cliente o proveedor extranjero.
   */
  foreignClientsSuppliers: boolean;

  /**
   * @property {boolean} nationalSuppliers
   * Indica si es un proveedor nacional.
   */
  nationalSuppliers: boolean;

  /**
   * @property {boolean} modificationsMembers
   * Indica si hay modificaciones de socios.
   */
  modificationsMembers: boolean;

  /**
   * @property {boolean} changesToLegalDocuments
   * Indica si hay cambios en los documentos legales.
   */
  changesToLegalDocuments: boolean;

  /**
   * @property {boolean} mergerOrSplitNotice
   * Indica si es un aviso de fusión o escisión.
   */
  mergerOrSplitNotice: boolean;

  /**
   * @property {boolean} additionFractions
   * Indica si hay fracciones adicionales.
   */
  additionFractions: boolean;

  /**
   * @property {boolean} presenten
   * Indica si se selecciona 'Presenten'.
   */
  presenten: boolean;

  /**
   * @property {boolean} contratados
   * Indica si se selecciona 'Contratados'.
   */
  contratados: boolean;

  /**
   * @property {boolean} expirado
   * Indica si se selecciona 'Expirado'.
   */
  expirado: boolean;

  /**
   * @property {boolean} derechos
   * Indica si se selecciona 'Derechos'.
   */
  derechos: boolean;

  /**
   * @property {boolean} acepto253
   * Indica si se aceptó la sección 253.
   */
  acepto253: boolean;
}

/**
 * @function createInitialState
 * @description
 * Crea el estado inicial del trámite 33302 con valores predeterminados.
 * 
 * @returns {Tramite33302State} El estado inicial del trámite.
 */
export function createInitialState(): Tramite33302State {
  return {
    /**
     * Clave de referencia inicial vacía.
     * @property {string} claveDeReferencia
     */
    claveDeReferencia: '',

    /**
     * Cadena de dependencia inicial vacía.
     * @property {string} cadenaDependencia
     */
    cadenaDependencia: '',

    /**
     * Nombre del banco inicial vacío.
     * @property {string} banco
     */
    banco: '',

    /**
     * Llave de pago inicial vacía.
     * @property {string} llaveDePago
     */
    llaveDePago: '',

    /**
     * Fecha de pago inicial vacía.
     * @property {string} fechaDePago
     */
    fechaDePago: '',

    /**
     * Importe de pago inicial vacío.
     * @property {string} importeDePago
     */
    importeDePago: '',

    /**
     * Número asociado al trámite inicial vacío.
     * @property {string} numeroDe
     */
    numeroDe: '',

    /**
     * Modalidad de certificación inicial vacía.
     * @property {string} modalidadCertificacion
     */
    modalidadCertificacion: '',

    /**
     * Indica si es un cliente o proveedor extranjero.
     * @property {boolean} foreignClientsSuppliers
     */
    foreignClientsSuppliers: false,

    /**
     * Indica si es un proveedor nacional.
     * @property {boolean} nationalSuppliers
     */
    nationalSuppliers: false,

    /**
     * Indica si hay modificaciones de socios.
     * @property {boolean} modificationsMembers
     */
    modificationsMembers: false,

    /**
     * Indica si hay cambios en los documentos legales.
     * @property {boolean} changesToLegalDocuments
     */
    changesToLegalDocuments: false,

    /**
     * Indica si es un aviso de fusión o escisión.
     * @property {boolean} mergerOrSplitNotice
     */
    mergerOrSplitNotice: false,

    /**
     * Indica si hay fracciones adicionales.
     * @property {boolean} additionFractions
     */
    additionFractions: false,

    /**
     * Indica si se selecciona 'Presenten'.
     * @property {boolean} presenten
     */
    presenten: false,

    /**
     * Indica si se selecciona 'Contratados'.
     * @property {boolean} contratados
     */
    contratados: false,

    /**
     * Indica si se selecciona 'Expirado'.
     * @property {boolean} expirado
     */
    expirado: false,

    /**
     * Indica si se selecciona 'Derechos'.
     * @property {boolean} derechos
     */
    derechos: false,

    /**
     * Indica si se aceptó la sección 253.
     * @property {boolean} acepto253
     */
    acepto253: false,
  };
}

/**
 * Store del trámite 33302.
 * Este store gestiona el estado del formulario relacionado con el trámite 33302..
 * Utiliza Akita para manejar el estado de manera reactiva.
 * 
 * @export
 * @class Tramite33302Store
 * @extends {Store<FormularioGrupo>}
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite-33301', resettable: true })
export class Tramite33302Store extends Store<Tramite33302State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado del store con los valores proporcionados.
   * @param {Partial<Tramite33302State>} valores - Valores parciales del estado a actualizar.
   * @method actualizarEstado
   * @description
   * Actualiza el estado del store con los valores proporcionados.
   * Utiliza el método `update` de Akita para fusionar los nuevos valores con el estado actual.
   * @param {Partial<Tramite33302State>} valores - Valores parciales del estado a actualizar.
   * @returns {void}
   * */

  public actualizarEstado(valores: Partial<Tramite33302State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }  
}