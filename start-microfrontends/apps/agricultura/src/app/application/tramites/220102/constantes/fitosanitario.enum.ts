/**
 * @fileoverview
 * Constantes utilizadas en el trámite fitosanitario.
 * Incluye los pasos del proceso, textos de ayuda, rutas de catálogos y acciones de la tabla.
 * Cobertura compodoc 100%: cada constante está documentada.
 * @module fitosanitarioEnum
 */

/**
 * Pasos del proceso de trámite fitosanitario.
 * Cada objeto representa un paso con su índice, título y estado de actividad/completado.
 * @const
 * @type {Array<{indice: number, titulo: string, activo: boolean, completado: boolean}>}
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
    }
];

/**
 * Texto de advertencia importante para el usuario.
 * @const
 * @type {{Importante: string}}
 */
export const IMPORTANTE = {
    Importante: `<p style="text-align: center;">Para continuar con el trámite,debes agregar por lo menos una mercancía.</p>`,
};

/**
 * Textos de ayuda e instrucciones para la sección de requisitos.
 * Incluye instrucciones y mensajes para adjuntar documentos.
 * @const
 * @type {{INSTRUCCIONES: string, ADJUNTAR: string}}
 */
export const TEXTOS_REQUISITOS = {
    INSTRUCCIONES: `<h6>Instrucciones</h6>
      <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
      <p>- En caso de que no requieras algún documento, selecciónalo y elimínalo</p>
      <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo".</p>`,
    ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
};

/**
 * Ruta base para los archivos JSON de catálogos y datos.
 * @const
 * @type {string}
 */
export const URL = '../../../../../assets/json/220102/';

/**
 * Acción para editar un elemento en la tabla de mercancías.
 * @const
 * @type {string}
 */
export const EDITAR = "editar";

/**
 * Acción para agregar un nuevo elemento en la tabla de mercancías.
 * @const
 * @type {string}
 */
export const AGREGAR = "agregar";

/**
 * Acción para indicar una nueva mercancía o registro.
 * @const
 * @type {string}
 */
export const NUEVA = "nueva";