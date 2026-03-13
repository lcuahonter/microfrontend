import { Tramite33302State } from "../estados/tramite33302.store";


export interface TipoDevAviso {
  /** Modalidad de certificación */
  modalidadCertificacion: string;
  /** Indica si es un cliente o proveedor extranjero */
  foreignClientsSuppliers: boolean,
  /** Indica si es un proveedor nacional */
  nationalSuppliers: boolean,
  /** Indica si hay modificaciones de socios */
  modificationsMembers: boolean,
  /** Indica si hay cambios en los documentos legales */
  changesToLegalDocuments: boolean,
  /** Indica si es un aviso de fusión o escisión */
  mergerOrSplitNotice: boolean,
  /** Indica si hay fracciones adicionales */
  additionFractions: boolean,
  presenten: boolean, // Indica si se selecciona 'Presenten'
  contratados: boolean, // Indica si se selecciona 'Contratados'
  expirado: boolean, // Indica si se selecciona 'Expirado'
  derechos: boolean, // Indica si se selecciona 'Derechos'
  /** Aceptación de la sección 253 */
  acepto253: boolean,
}





/**
 * @fileoverview
 * Este archivo define la interfaz `DatosPrevios`, que representa la estructura de los datos
 * contenidos en el archivo `datos-previos.json`. Proporciona una forma tipada de manejar
 * los datos relacionados con clientes, proveedores, modificaciones, y detalles de pago.
 */

/**
 * @interface DatosPrevios
 * @description
 * Representa la estructura completa del archivo `datos-previos.json`.
 */
export interface DatosPrevios {


  /**
   * Clave de referencia del trámite.
   * @type {string}
   */
  claveDeReferencia: string;

  /**
   * Cadena de dependencia asociada al trámite.
   * @type {string}
   */
  cadenaDependencia: string;

  /**
   * Nombre del banco donde se realizó el pago.
   * @type {string}
   */
  banco: string;

  /**
   * Llave única del pago.
   * @type {string}
   */
  llaveDePago: string;

  /**
   * Fecha de pago.
   * @type {string}
   */
  fechaDePago: string;

  /**
   * Importe total del pago.
   * @type {string}
   */
  importeDePago: string;

  /**
   * Número asociado al trámite.
   * @type {string}
   */
  numeroDe: string;
  /**
   * Modalidad de certificación.
   * @type {string}
   */
  foreignClientsSuppliers: boolean,
  /** Indica si es un proveedor nacional */
  nationalSuppliers: boolean,
  /** Indica si hay modificaciones de socios */
  modificationsMembers: boolean,
  /** Indica si hay cambios en los documentos legales */
  changesToLegalDocuments: boolean,
  /** Indica si es un aviso de fusión o escisión */
  mergerOrSplitNotice: boolean,
  /** Indica si hay fracciones adicionales */
  additionFractions: boolean,
  presenten: boolean, // Indica si se selecciona 'Presenten'
  contratados: boolean, // Indica si se selecciona 'Contratados'
  expirado: boolean, // Indica si se selecciona 'Expirado'
  derechos: boolean, // Indica si se selecciona 'Derechos'
  /** Aceptación de la sección 253 */
  acepto253: boolean,
}

export interface PagoDeDerechos {
  /**
   * Datos de revisión del pago de derechos.
   * @property {RevisionData} data
   */
  data: Tramite33302State;
}