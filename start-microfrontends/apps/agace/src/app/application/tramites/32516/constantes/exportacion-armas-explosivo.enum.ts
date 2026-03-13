/**
* Constantes utilizadas en el trámite 32516 para la configuración de pasos, mensajes y datos relacionados con el procedimiento de exportación de armas y explosivos.
*
* Este archivo contiene configuraciones que definen los pasos del trámite, el título del mensaje, los textos de requisitos,
* y el identificador único del procedimiento.
*/

/**
* Configuración de los pasos del trámite de exportación de armas y explosivos.
*
* Cada paso está representado por un objeto que contiene las siguientes propiedades:
* - `indice`: Número del paso.
* - `titulo`: Título descriptivo del paso.
* - `activo`: Indica si el paso está activo.
* - `completado`: Indica si el paso ha sido completado.
*
* @constant {Array<Object>}
*/
export const PASOS = [
    {
      /**
       * @property {number} indice
       * Índice del paso en el flujo.
       */
      indice: 1,

      /**
       * @property {string} titulo
       * Título descriptivo del paso.
       */
      titulo: 'Capturar solicitud',

      /**
       * @property {boolean} activo
       * Indica si el paso está activo.
       */
      activo: true,

      /**
       * @property {boolean} completado
       * Indica si el paso está completado.
       */
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
* Título del mensaje relacionado con el trámite 32516 de exportación de armas y explosivos.
*
* @constant {string}
*/
export const TITULOMENSAJE =
    'Solicitud Permiso ordinario para la importación de armamento, municiones y diverso material para personas físicas y morales';

/**
* Texto de requisitos para el trámite 32516 de exportación de armas y explosivos.
*
* Contiene información sobre el número temporal de la solicitud y su validez.
*
* @constant {string}
*/
export const TEXTOS_REQUISITOS =
    'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
* Identificador único del procedimiento 32516 de exportación de armas y explosivos.
*
* @constant {number}
*/
export const ID_PROCEDIMIENTO = 240121;
  