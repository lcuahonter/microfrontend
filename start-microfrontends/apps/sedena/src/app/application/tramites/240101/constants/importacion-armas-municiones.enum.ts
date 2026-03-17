/**
 * PASOS define la estructura del flujo del trámite,
 * indicando el orden, título, y el estado (activo y completado) de cada paso.
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
 * TITULOMENSAJE representa el título principal mostrado en la sección
 * de confirmación o resumen de la solicitud.
 */
export const TITULOMENSAJE =
  'Solicitud Permiso ordinario para la importación de armamento, municiones y diverso material para personas físicas y morales';

/**
 * TEXTOS_REQUISITOS contiene el mensaje informativo que se muestra
 * al registrar una solicitud con número temporal, aclarando su carácter no oficial.
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [ID_SOLICITUD]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * ID_PROCEDIMIENTO representa el identificador numérico del procedimiento
 * asociado a este tipo de solicitud específica.
 */
export const ID_PROCEDIMIENTO = 240101;
