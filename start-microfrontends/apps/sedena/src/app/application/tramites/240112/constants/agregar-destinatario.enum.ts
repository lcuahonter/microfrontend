
/**
 * Constante que define los pasos del proceso de trámite.
 *
 * @remarks
 * Cada elemento del arreglo representa un paso en el flujo de la aplicación, incluyendo su índice, título, y los estados de activo y completado.
 *
 * @const
 * @type {{
 *   indice: number;
 *   titulo: string;
 *   activo: boolean;
 *   completado: boolean;
 * }[]}
 *
 * @property {number} indice - Índice secuencial del paso dentro del proceso.
 * @property {string} titulo - Descripción o nombre del paso.
 * @property {boolean} activo - Indica si el paso está activo actualmente.
 * @property {boolean} completado - Indica si el paso ya ha sido completado.
 *
 * @example
 * // Acceder al título del primer paso
 * const primerTitulo = PASOS[0].titulo;
 */
export const PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud', // Paso 1: Capturar la información de la solicitud
    activo: true, // Este paso está activo actualmente
    completado: true, // Ya se ha completado este paso
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos', // Paso 2: Subir o anexar los documentos requeridos
    activo: false, // Este paso aún no está activo
    completado: false, // Este paso no ha sido completado
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud', // Paso 3: Firmar electrónicamente la solicitud
    activo: false, // Este paso aún no está activo
    completado: false, // Este paso no ha sido completado
  },
];


/**
 * Título del mensaje utilizado en la solicitud de permiso extraordinario
 * para la importación de material explosivo.
 *
 * @constant
 * @type {string}
 */
export const TITULOMENSAJE =
  'Solicitud Permiso extraordinario para la importación de material explosivo';


/**
 * Texto que informa al usuario que su solicitud ha sido registrada con un número temporal.
 * 
 * @remarks
 * Este mensaje aclara que el número proporcionado no tiene validez legal y solo sirve para identificar la solicitud de manera temporal.
 * El folio oficial será asignado una vez que la solicitud sea firmada.
 * 
 * @const
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [ID_SOLICITUD]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * Identificador único del procedimiento utilizado en el sistema.
 * 
 * @constant
 * @type {number}
 * @default 240112
 * @description Este valor representa el ID del procedimiento específico para la gestión de trámites en la aplicación.
 */
export const ID_PROCEDIMIENTO = 240112;