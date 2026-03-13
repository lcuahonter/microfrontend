/**
 * Lista de pasos para el proceso de importación de armas y municiones.
 *
 * Cada paso contiene:
 * - `indice`: El número de orden del paso.
 * - `titulo`: Descripción breve del paso.
 * - `activo`: Indica si el paso está actualmente activo.
 * - `completado`: Indica si el paso ha sido completado.
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
 * Mensaje de título utilizado para la solicitud de permiso extraordinario
 * para la importación de armamento, municiones y diverso material para personas físicas y morales.
 */
export const TITULOMENSAJE =
  'Solicitud Permiso extraordinario para la importación de armamento, municiones y diverso material para personas físicas y morales';

/**
 * Mensaje informativo que se muestra al registrar una solicitud.
 * Indica que el número temporal asignado no tiene validez legal y solo sirve para identificar la solicitud.
 * Un folio oficial será asignado cuando la solicitud sea firmada.
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';


/**
 * Identificador único para el trámite de "Importación de armas y municiones".
 *
 * @remarks
 * Esta constante se utiliza para referenciar el trámite específico dentro de la aplicación.
 */
export const ID_PROCEDIMIENTO = 240102;
