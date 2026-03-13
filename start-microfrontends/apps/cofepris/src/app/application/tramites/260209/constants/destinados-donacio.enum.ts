/**
 * Definición de los pasos secuenciales del proceso de tramitación de permisos sanitarios.
 * Representa el flujo de trabajo que debe seguir el usuario para completar su solicitud.
 * 
 * @description Contiene tres etapas principales del proceso:
 * 1. Capturar solicitud - Introducción de datos básicos
 * 2. Anexar requisitos - Carga de documentos obligatorios
 * 3. Firmar solicitud - Validación final y firma digital
 * 
 * @type {Array<{indice: number, titulo: string, activo: boolean, completado: boolean}>}
 * @constant
 * @since 1.0.0
 * @author Sistema VUCEM 3.0
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
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Título del mensaje informativo para el permiso sanitario de importación de medicamentos destinados a donación.
 * 
 * @description Texto descriptivo que se muestra al usuario para identificar el tipo específico 
 * de trámite que está realizando. Este título aparece en la interfaz de usuario como encabezado 
 * principal del formulario de solicitud.
 * 
 * @type {string}
 * @constant
 * @readonly
 * @since 1.0.0
 * @example
 * // Uso en componente de interfaz
 * <h1>{TITULO_MENSAJE}</h1>
 */
export const TITULO_MENSAJE = 
  'Permiso sanitario de importación de medicamentos destinados a donación';

/**
 * Texto informativo sobre el registro temporal de la solicitud y el proceso de asignación de folio oficial.
 * 
 * @description Mensaje que se presenta al usuario después de registrar su solicitud, explicando:
 * - El número temporal asignado (sin validez legal)
 * - La función identificativa del número temporal
 * - El proceso de asignación del folio oficial mediante firma
 * 
 * @type {string}
 * @constant
 * @readonly
 * @since 1.0.0
 * @note El número temporal [202767640] es un ejemplo y debe ser reemplazado dinámicamente
 * @todo Implementar reemplazo dinámico del número temporal
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

export const ID_PROCEDIMIENTO = 260209;

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
  'denominacionRazon',
  'correoElectronico',
  'scian',
  'manifesto',
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

 /**
 * Texto del mensaje de título utilizado en el trámite.
 *
 * Este texto se utiliza para mostrar el título principal relacionado con el trámite de dispositivos médicos.
 */
export const TITULOMENSAJE =
  'Permiso sanitario de importación de dispositivos médicos para donación';


   export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
    `<p style="text-align: center;">
      La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. 
      Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. 
      Un folio oficial le será asignado al momento en que ésta sea firmada.
    </p>`;