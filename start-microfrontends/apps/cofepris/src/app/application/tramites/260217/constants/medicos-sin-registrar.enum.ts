/**
 * Configuración de los pasos del proceso de solicitud para dispositivos médicos sin registro.
 * Define la secuencia de pasos que debe seguir el usuario para completar el trámite.
 * 
 * @description Cada paso contiene:
 * - indice: Número secuencial del paso en el proceso
 * - titulo: Descripción breve de la acción a realizar en el paso
 * - activo: Indica si el paso está disponible para interacción del usuario
 * - completado: Indica si el paso ha sido finalizado exitosamente
 * 
 * @type {Array<{indice: number, titulo: string, activo: boolean, completado: boolean}>}
 * @constant
 */
export const PASOS = [
  {
    /** @description Número de orden del primer paso */
    indice: 1,
    /** @description Descripción del primer paso: captura de datos de la solicitud */
    titulo: 'Capturar solicitud',
    /** @description Estado actual: paso activo y disponible para el usuario */
    activo: true,
    /** @description Estado de finalización: paso completado */
    completado: true,
  },
  {
    /** @description Número de orden del segundo paso */
    indice: 2,
    /** @description Descripción del segundo paso: adjuntar documentos requeridos */
    titulo: 'Anexar necesarios',
    /** @description Estado actual: paso inactivo, no disponible para el usuario */
    activo: false,
    /** @description Estado de finalización: paso pendiente de completar */
    completado: false,
  },
  {
    /** @description Número de orden del tercer paso */
    indice: 3,
    /** @description Descripción del tercer paso: firma digital de la solicitud */
    titulo: 'Firmar solicitud',
    /** @description Estado actual: paso inactivo, no disponible para el usuario */
    activo: false,
    /** @description Estado de finalización: paso pendiente de completar */
    completado: false,
  },
];

/**
 * Título del mensaje para el permiso sanitario de importación de dispositivos médicos usados sin registro.
 * 
 * @description Texto principal que se muestra al usuario como encabezado del formulario
 * de solicitud de permiso sanitario para la importación de dispositivos médicos usados
 * que no cuentan con registro sanitario en México.
 * 
 * @type {string}
 * @constant
 * @since 1.0.0
 */
export const TITULOMENSAJE = 
  'Permiso sanitario de importación de dispositivos médicos, sin registro, usados';

/**
 * Texto informativo sobre los requisitos y el número temporal de solicitud.
 * 
 * @description Mensaje que se presenta al usuario después de registrar su solicitud,
 * explicando el estado temporal del número asignado y el proceso de obtención del
 * folio oficial mediante la firma digital. Incluye información importante sobre
 * la validez legal del número temporal.
 * 
 * @example
 * // El texto se muestra después del registro inicial:
 * // "La solicitud ha quedado registrada con el número temporal [202767640]..."
 * 
 * @type {string}
 * @constant
 * @since 1.0.0
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * Identificador numérico único del procedimiento administrativo.
 * 
 * @description Código oficial asignado por COFEPRIS para identificar el trámite de
 * "Permiso sanitario de importación de dispositivos médicos sin registro, usados".
 * Este identificador se utiliza para referenciar el procedimiento en sistemas
 * internos, bases de datos y documentación oficial.
 * 
 * @example
 * // Uso típico para validaciones o consultas:
 * if (procedimiento === ID_PROCEDIMIENTO) {
 *   // Lógica específica para este trámite
 * }
 * 
 * @type {number}
 * @constant
 * @readonly
 * @since 1.0.0
 */
export const ID_PROCEDIMIENTO = 260217;

/**
 * @const ELEMENTOS_REQUERIDOS
 * @description Lista de elementos requeridos para el trámite.
 */
export const ELEMENTOS_REQUERIDOS = [
  'fabricante'
];

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_PAGE= '¿Está seguro que su solicitud no requiere los datos del Pago de derechos?';

export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
  `<p style="text-align: center;">
    La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. 
    Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. 
    Un folio oficial le será asignado al momento en que ésta sea firmada.
  </p>`;