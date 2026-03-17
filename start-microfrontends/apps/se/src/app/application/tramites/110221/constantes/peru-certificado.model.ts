
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
export const ID_PROCEDIMIENTO = 110221;

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
/**
 * @const ID_PROCEDIMIENTO
 * @description Identificador único del procedimiento asociado al trámite.
 */
export const IDPROCEDIMIENTO = 110221;

/**
 * @interface Payload
 * @description Estructura de datos para la respuesta del servidor al guardar una solicitud.
 */
export interface Payload { 
  /** 
   * Código de respuesta del servidor que indica el resultado de la operación.
   * @description '00' indica éxito, cualquier otro código indica error.
   * @example '00' | '01' | '02'
   */
  codigo: string; 
  
  /** 
   * Mensaje descriptivo del resultado de la operación.
   * @description Proporciona información detallada sobre el resultado de la petición.
   * @example 'Operación exitosa' | 'Error de validación' | 'Servicio no disponible'
   */
  mensaje: string; 
  
  /** 
   * Datos adicionales de la respuesta, incluyendo el ID de la solicitud generada.
   * @description Opcional. Se incluye cuando la operación genera o modifica una solicitud.
   * @example { id_solicitud: 12345 }
   */
  datos?: { 
    /** Identificador único de la solicitud generada o modificada */
    id_solicitud: number 
  } 
}