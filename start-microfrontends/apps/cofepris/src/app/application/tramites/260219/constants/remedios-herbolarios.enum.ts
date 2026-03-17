/**
 * Constantes utilizadas en el trámite 260219 para la configuración de pasos, mensajes y datos relacionados con el procedimiento.
 *
 * Este archivo contiene configuraciones que definen los pasos del trámite, el título del mensaje, los textos de requisitos,
 * y el identificador único del procedimiento.
 */

/**
 * Configuración de los pasos del trámite.
 *
 * Cada paso está representado por un objeto que contiene las siguientes propiedades:
 * - `indice`: Número del paso.
 * - `titulo`: Título descriptivo del paso.
 * - `activo`: Indica si el paso está activo.
 * - `completado`: Indica si el paso ha sido completado.
 *
 * @constant {Array<Object>}
 */
export const PASOS = [
  {
    /**
     * @property {number} indice
     * Índice del paso en el flujo.
     */
    indice: 1,

    /**
     * @property {string} titulo
     * Título descriptivo del paso.
     */
    titulo: 'Capturar solicitud',

    /**
     * @property {boolean} activo
     * Indica si el paso está activo.
     */
    activo: true,

    /**
     * @property {boolean} completado
     * Indica si el paso está completado.
     */
    completado: true,
  },
  {
    /**
     * @property {number} indice
     * Índice del paso en el flujo.
     */
    indice: 2,

    /**
     * @property {string} titulo
     * Título descriptivo del paso.
     */
    titulo: 'Anexar requisitos',

    /**
     * @property {boolean} activo
     * Indica si el paso está activo.
     */
    activo: false,

    /**
     * @property {boolean} completado
     * Indica si el paso está completado.
     */
    completado: false,
  },
  {
    /**
     * @property {number} indice
     * Índice del paso en el flujo.
     */
    indice: 3,

    /**
     * @property {string} titulo
     * Título descriptivo del paso.
     */
    titulo: 'Firmar solicitud',

    /**
     * @property {boolean} activo
     * Indica si el paso está activo.
     */
    activo: false,

    /**
     * @property {boolean} completado
     * Indica si el paso está completado.
     */
    completado: false,
  },
];

/**
 * Título del mensaje relacionado con el trámite 260219.
 *
 * @constant {string}
 */
export const TITULO_MENSAJE =
  'Permiso sanitario de importación de remedios herbolarios';

/**
 * Texto de requisitos para el trámite 260219.
 *
 * Contiene información sobre el número temporal de la solicitud y su validez.
 *
 * @constant {string}
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * Identificador único del procedimiento 260219.
 *
 * @constant {number}
 */
export const ID_PROCEDIMIENTO = 260219;

/**
 * Lista de elementos requeridos para completar el formulario o proceso.
 *
 * @constant {Array<string>}
 *
 * @example
 * ```typescript
 * const ELEMENTOS_REQUERIDOS = [
 *   'denominacionRazon',
 *   'scian',
 *   'correoElectronico',
 *   'rfcSanitario',
 *   'fabricante',
 *   'destinoFinal'
 * ];
 * ```
 */
export const ELEMENTOS_REQUERIDOS = [
  /**
   * @property {string} denominacionRazon
   * Denominación o razón social del solicitante.
   */
  'denominacionRazon',

  /**
   * @property {string} scian
   * Código SCIAN relacionado con la actividad económica.
   */
  'scian',

  /**
   * @property {string} correoElectronico
   * Dirección de correo electrónico del solicitante.
   */
  'correoElectronico',

  /**
   * @property {string} rfcSanitario
   * RFC del solicitante relacionado con el trámite sanitario.
   */
  'rfcSanitario',

  /**
   * @property {string} fabricante
   * Información del fabricante del remedio herbolario.
   */
  'fabricante',

  /**
   * @property {string} destinoFinal
   * Destino final del remedio herbolario.
   */
  'destinoFinal',
  /**
   * @property {string} manifesto
   * Indica si el remedio herbolario está incluido en un manifiesto.
   */
  'manifesto'
];