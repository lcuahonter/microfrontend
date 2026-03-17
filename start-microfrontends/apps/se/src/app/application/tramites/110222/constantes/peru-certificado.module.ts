/**
 * @descripcion
 * Constante que define los pasos del proceso de solicitud en el módulo CAM.
 */
export const PASOS = [
  {
    /**
     * @descripcion
     * Índice del paso en el proceso.
     */
    indice: 1,

    /**
     * @descripcion
     * Título descriptivo del paso.
     */
    titulo: 'Capturar solicitud',

    /**
     * @descripcion
     * Indica si el paso está activo.
     */
    activo: true,

    /**
     * @descripcion
     * Indica si el paso ha sido completado.
     */
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * @descripcion
 * Constante que define las propiedades de la fecha de pago en el formulario.
 */
export const FECHA = {
  /**
   * @descripcion
   * Etiqueta asociada al campo de fecha.
   */
  labelNombre: 'Fecha de factura / Referencia',

  /**
   * @descripcion
   * Indica si el campo de fecha es obligatorio.
   */
  required: true,

  /**
   * @descripcion
   * Indica si el campo de fecha está habilitado.
   */
  habilitado: false,
};

/**
 * @descripcion
 * Identificador único del procedimiento.
 */
export const ID_PROCEDIMIENTO = 110222;

/**
 * @const ELEMENTOS_REQUERIDOS
 * @description Lista de elementos requeridos para completar el formulario o proceso.
 */
export const ELEMENTOS_REQUERIDOS = [
  'nombres',
  'primerApellido',
  'numeroDeRegistroFiscal',
  'razonSocial',
  'calle',
  'numeroLetra'
];
