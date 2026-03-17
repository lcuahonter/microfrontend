/**
 * Constantes utilizadas en el trámite 260216 para la configuración de pasos y textos relacionados con el procedimiento de dispositivos médicos.
 *
 * Este archivo contiene configuraciones que definen los pasos del trámite, así como textos y el identificador único del procedimiento.
 */

/**
 * Configuración de los pasos del trámite.
 *
 * Cada paso está representado por un objeto que contiene las siguientes propiedades:
 * - `indice`: Número del paso.
 * - `titulo`: Título descriptivo del paso.
 * - `activo`: Indica si el paso está activo.
 * - `completado`: Indica si el paso ha sido completado.
 */
export const PASOS = [
  {
    /**
     * @property {number} indice
     * @description Índice del paso.
     */
    indice: 1,
    /**
     * @property {string} titulo
     * @description Título descriptivo del paso.
     */
    titulo: 'Capturar solicitud',
    /**
     * @property {boolean} activo
     * @description Indica si el paso está activo.
     */
    activo: true,
    /**
     * @property {boolean} completado
     * @description Indica si el paso está completado.
     */
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar necesarios',
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
 * Identificador único del procedimiento del trámite.
 *
 * Este identificador se utiliza para referenciar el trámite específico dentro del sistema.
 */
export const ID_PROCEDIMIENTO = 261101;

/**
 * @constant {string} FALTAN_CAMPOS_POR_CAPTURAR
 * @description
 * Mensaje de error en formato **HTML** que se muestra cuando
 * el usuario no ha completado todos los campos obligatorios
 * en el formulario.  
 *
 * Incluye un título en negritas **"¡Error de registro!"**
 * y el texto informativo: *"Faltan campos por capturar."*.
 *
 * @example
 * // Uso dentro de un componente Angular
 * this.errorMessage = FALTAN_CAMPOS_POR_CAPTURAR;
 */
export const FALTAN_CAMPOS_POR_CAPTURAR = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';


export const MENSAJE_DE_VALIDACION = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';

export const MENSAJE_DE_PAGE= '¿Está seguro que su solicitud no requiere los datos del Pago de derechos?';

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION_PAGO_DERECHOS = '<div>¿Está seguro que su solicitud no requiere los datos del Pago de derechos?</div>';

export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
  `<p style="text-align: center;">
    La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. 
    Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. 
    Un folio oficial le será asignado al momento en que ésta sea firmada.
  </p>`;