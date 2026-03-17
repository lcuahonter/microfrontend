/**
 * Arreglo constante que define los pasos del proceso para la gestión de permisos.
 * Cada objeto representa un paso específico con su índice, título, y los estados de activo y completado.
 *
 * @property {number} indice - El número de orden del paso dentro del proceso.
 * @property {string} titulo - El nombre descriptivo del paso.
 * @property {boolean} activo - Indica si el paso está actualmente activo para el usuario.
 * @property {boolean} completado - Indica si el paso ya ha sido completado.
 *
 * Ejemplo de uso:
 * - Para mostrar el flujo de pasos en un formulario de solicitud.
 * - Para controlar la navegación entre pasos según el estado de cada uno.
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
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  }
];

/**
 * Contiene los textos informativos y de instrucciones que se muestran al usuario sobre los requisitos y el proceso de adjuntar documentos.
 *
 * @property {string} INSTRUCCIONES - Instrucciones generales para el usuario sobre la obligatoriedad de los documentos, cómo eliminar documentos no requeridos y cómo agregar múltiples documentos del mismo tipo.
 * @property {string} ADJUNTAR - Mensaje que indica al usuario cómo adjuntar un nuevo documento utilizando la opción correspondiente y el botón "Adjuntar documentos".
 *
 * @usage
 * Estos textos se utilizan en la interfaz de usuario para guiar al solicitante en la gestión y adjuntado de documentos requeridos en el trámite.
 *
 * @example
 * ```typescript
 * import { TEXTOS_REQUISITOS } from './constants/intropermiso.enum';
 *
 * // Mostrar instrucciones en la interfaz
 * mostrarHtml(TEXTOS_REQUISITOS.INSTRUCCIONES);
 *
 * // Mostrar mensaje para adjuntar documentos
 * mostrarHtml(TEXTOS_REQUISITOS.ADJUNTAR);
 * ```
 */
export const TEXTOS_REQUISITOS = {
  INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, selecciónalo y elimínalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo".</p>`,
  ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
};

/**
 * @constant ERROR_FORMA_ALERT
 * @description
 * Mensaje HTML que se muestra como alerta cuando faltan campos por capturar en el formulario.
 * Se utiliza para informar al usuario que debe completar todos los campos requeridos antes de continuar.
 */
export const ERROR_FORMA_ALERT = `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Faltan campos por capturar..
    </div>
  </div>
</div>
`;

/**
 * @constant TODOS_PASOS
 * @description
 * Mensaje HTML que se muestra al usuario una vez que ha completado todos los pasos del proceso.
 * Incluye información importante sobre el número temporal de la solicitud y su validez.
 * Este mensaje sirve para confirmar que la solicitud ha sido registrada correctamente y proporciona detalles sobre el siguiente paso en el proceso.
 * @example
 * mostrarHtml(TODOS_PASOS.Importante);
 * */

export const TODOS_PASOS = {
  Importante: `<div class="d-flex justify-content-center text-center">
    <p>La solicitud ha quedado registrada con el número temporal 202785501. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.
    </p>
    </div>`,
};
