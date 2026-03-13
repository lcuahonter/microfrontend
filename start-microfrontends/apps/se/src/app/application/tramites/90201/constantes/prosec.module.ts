/**
 * @constant PASOS
 * @description
 * Arreglo de objetos que representa los pasos del asistente (wizard) del trámite PROSEC.
 * Cada objeto contiene el índice, el título, y los estados de activo y completado para cada paso del flujo.
 * Este arreglo se utiliza para controlar la navegación y visualización de los pasos en el wizard del trámite.
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
 * @constant TEXTO
 * @description
 * Texto de ayuda que indica al usuario que debe agregar al menos una planta para continuar con el trámite.
 */
export const TEXTO = 'Para continuar con el tramite, debes agregar por lo menos una planta'

/**
 * @constant PARATEXTO
 * @description
 * Texto de ayuda que indica al usuario que debe agregar al menos una mercancía para continuar con el trámite.
 */
export const PARATEXTO = 'Para continuar con el trámite, debes agregar por lo menos una mercancía.';

/**
 * @constant TEXTOS_REQUISITOS
 * @description
 * Objeto que contiene los textos de instrucciones y ayuda para la sección de requisitos del trámite PROSEC.
 * Incluye instrucciones generales y el mensaje para adjuntar nuevos documentos.
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
export const ERROR_FORMA_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Faltan campos por capturar.
    </div>
  </div>
</div>
`