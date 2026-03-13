/**
 * Lista de PASOS para selección.
 * @constant
 * @type {string[]}
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
 * Lista de TEXTOS_REQUISITOS para selección.
 * @constant
 * @type {string[]}
 */

export const TEXTOS_REQUISITOS = {
  INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, selecciónalo y elimínalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo".</p>`,
  ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
};

/**
 * Lista de TEXTOS para selección.
 * @constant
 * @type {string[]}
 */

export const TEXTOS = {
  TEXTOS_SOLICITUD: 'Al dar doble-clic en una Solicitud, se copiar&aacute;n sus datos en esta Solicitud.',
  MERCANCIAS: 'Se permite agregar solo una Fracción Arancelaria por solicitud'
};
