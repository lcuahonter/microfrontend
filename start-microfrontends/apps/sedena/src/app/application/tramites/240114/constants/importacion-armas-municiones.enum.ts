/**
 * PASOS: Represents the steps involved in the procedure.
 * Each step contains:
 * - `indice`: The numeric index of the step.
 * - `titulo`: The title or description of the step.
 * - `activo`: A boolean indicating if the step is currently active.
 * - `completado`: A boolean indicating if the step is completed.
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
 * TITULOMENSAJE: A string constant containing the title of the procedure message.
 * This title is displayed as the header or main description of the procedure.
 */
export const TITULOMENSAJE =
  'Solicitud permiso ordinario para la exportación de armamento, municiones y diverso material para personas físicas y morales';

/**
 * TEXTOS_REQUISITOS: A string constant describing the temporary registration number and its purpose.
 * It informs the user that the temporary number is for identification purposes only and will be replaced
 * by an official number once the request is signed.
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * ID_PROCEDIMIENTO: A numeric constant representing the unique identifier for the procedure.
 * This ID is used to identify the procedure in the application logic or API calls.
 */
export const ID_PROCEDIMIENTO = 240114;