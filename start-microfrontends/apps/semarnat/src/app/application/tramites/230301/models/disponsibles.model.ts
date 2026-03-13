/**
 * Interfaz que representa una lista de pasos en un asistente.
 */
export interface ListaPasosWizard {
  /**
   * Índice del paso en el asistente.
   * @type {number}
   */
  indice: number;

  /**
   * Título del paso.
   * @type {string}
   */
  titulo: string;

  /**
   * Indica si el paso está activo.
   * @type {boolean}
   */
  activo: boolean;

  /**
   * Indica si el paso ha sido completado.
   * @type {boolean}
   */
  completado: boolean;
}

/**
 * Constante que define los pasos del asistente.
 * @type {Array<ListaPasosWizard>}
 */
export const PASOS = [
  {
    /**
     * Índice del primer paso.
     */
    indice: 1,
    /**
     * Título del primer paso.
     */
    titulo: 'Capturar solicitud',
    /**
     * Indica si el primer paso está activo.
     */
    activo: true,
    /**
     * Indica si el primer paso ha sido completado.
     */
    completado: true,
  },
  {
    /**
     * Índice del segundo paso.
     */
    indice: 2,
    /**
     * Título del segundo paso.
     */
    titulo: 'Firmar solicitud',
    /**
     * Indica si el segundo paso está activo.
     */
    activo: false,
    /**
     * Indica si el segundo paso ha sido completado.
     */
    completado: false,
  },
];

/**
 * Interfaz que representa el formulario de desistimiento.
 */
export interface DesistimientoForm {
  /**
   * Folio del desistimiento.
   * @type {string}
   */
  desistimientoFolio: string;

  /**
   * Tipo de solicitud asociada al desistimiento.
   * @type {string}
   */
  solicitudTipo: string;

  /**
   * Motivo del desistimiento.
   * @type {string}
   */
  desistimientoMotivo: string;
}

/**
 * Interfaz que representa la respuesta de una solicitud de desistimiento.
 */
export interface RespuestaDesistimientoSolicitud {
  /**
   * Código de respuesta.
   * @type {number}
   */
  code: number;

  /**
   * Datos del formulario de desistimiento.
   * @type {DesistimientoForm}
   */
  data: DesistimientoForm;

  /**
   * Mensaje asociado a la respuesta.
   * @type {string}
   */
  message: string;
}