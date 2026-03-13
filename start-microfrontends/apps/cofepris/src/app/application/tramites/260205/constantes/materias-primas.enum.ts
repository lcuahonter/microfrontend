
/**
 * Constante que representa el título del mensaje utilizado en el permiso sanitario
 * de importación de medicamentos y materias primas destinados a investigación en humanos.
 * 
 * Esta constante se utiliza para mostrar un mensaje descriptivo en la interfaz de usuario
 * relacionado con el trámite correspondiente. Proporciona información clara y específica
 * sobre el propósito del permiso sanitario.
 * 
 * @constant
 * @type {string}
 */
export const TITULO_MENSAJE =
  'Permiso sanitario de importación de medicamentos y materias primas destinados a investigación en humanos';

/**
 * Representa los pasos de un proceso en una solicitud.
 * 
 * Cada objeto en el arreglo `PASOS` describe un paso específico con información sobre su índice,
 * título, estado de actividad y estado de completado.
 * 
 * Propiedades de cada paso:
 * - `indice`: Número entero que indica el orden del paso en el proceso.
 * - `titulo`: Cadena de texto que describe el nombre o propósito del paso.
 * - `activo`: Valor booleano que indica si el paso está actualmente activo.
 * - `completado`: Valor booleano que indica si el paso ha sido completado.
 * 
 * Ejemplo de uso:
 * ```typescript
 * console.log(PASOS[0].titulo); // Salida: 'Capturar solicitud'
 * ```
 */
export const PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 4,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Lista de elementos de datos obligatorios requeridos para completar la solicitud del trámite.
 * 
 * @description Arreglo que contiene los nombres de los campos del formulario que son 
 * indispensables para procesar la solicitud de permiso sanitario. Estos elementos son 
 * validados en el frontend antes del envío y deben estar presentes para continuar con el proceso.
 * 
 * @type {Array<string>}
 * @constant
 * @readonly
 * @since 1.0.0
 * 
 * @property {string} denominacionRazon - Denominación o razón social del solicitante
 * @property {string} correoElectronico - Dirección de correo electrónico para notificaciones
 * 
 * @example
 * // Validación de campos requeridos
 * const camposCompletos = ELEMENTOS_REQUERIDOS.every(campo => 
 *   formulario[campo] && formulario[campo].trim() !== ''
 * );
 * 
 * @todo Considerar agregar validación de formato para cada elemento
 */
export const ELEMENTOS_REQUERIDOS = [
  
  'fabricante'
];

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';

export const ID_PROCEDIMIENTO = 260205;

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_PAGE= '¿Está seguro que su solicitud no requiere los datos del Pago de derechos?';

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION_PAGO_DERECHOS = '<div>¿Está seguro que su solicitud no requiere los datos del Pago de derechos?</div>';