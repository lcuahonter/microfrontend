/**
 * Arreglo que contiene los pasos del flujo del trámite con sus respectivos estados.
 * Cada paso está representado por un objeto que incluye su índice, título, estado activo y completado.
 * 
 * @type {object[]}
 */
export const AVISO_SIGLOS = [
  {
    /**
     * Indica el número del paso dentro del flujo del trámite.
     * 
     * @property {number} indice
     */
    indice: 1,

    /**
     * Define el título descriptivo del paso.
     * 
     * @property {string} titulo
     */
    titulo: 'Capturar solicitud',

    /**
     * Indica si el paso está activo en el flujo actual.
     * Por defecto, el primer paso está activo.
     * 
     * @property {boolean} activo
     * @default true
     */
    activo: true,

    /**
     * Indica si el paso ha sido completado.
     * Por defecto, el primer paso está completado.
     * 
     * @property {boolean} completado
     * @default true
     */
    completado: true,
  },
  {
    /**
     * Indica el número del paso dentro del flujo del trámite.
     * 
     * @property {number} indice
     */
    indice: 2,

    /**
     * Define el título descriptivo del paso.
     * 
     * @property {string} titulo
     */
    titulo: 'Anexar requisitos',

    /**
     * Indica si el paso está activo en el flujo actual.
     * 
     * @property {boolean} activo
     * @default false
     */
    activo: false,

    /**
     * Indica si el paso ha sido completado.
     * 
     * @property {boolean} completado
     * @default false
     */
    completado: false,
  },
  {
    /**
     * Indica el número del paso dentro del flujo del trámite.
     * 
     * @property {number} indice
     */
    indice: 3,

    /**
     * Define el título descriptivo del paso.
     * 
     * @property {string} titulo
     */
    titulo: 'Firmar solicitud',

    /**
     * Indica si el paso está activo en el flujo actual.
     * 
     * @property {boolean} activo
     * @default false
     */
    activo: false,

    /**
     * Indica si el paso ha sido completado.
     * 
     * @property {boolean} completado
     * @default false
     */
    completado: false,
  },
];

/**
 * Arreglo que contiene las opciones para el botón de radio relacionado con el marco de la obra de arte.
 * Cada opción está representada por un objeto que incluye una etiqueta visible para el usuario y un valor asociado utilizado en la lógica de la aplicación.
 * 
 * @type {object[]}
 */
export const OPCIONES_DE_BOTON_DE_RADIO = [
  {
    /**
     * Define la etiqueta que describe la opción visible para el usuario.
     * En este caso, la opción indica si la obra de arte tiene marco.
     * 
     * @property {string} label
     */
    label: 'Con marco',

    /**
     * Representa el valor asociado a la opción. Este valor es usado en la lógica de la aplicación.
     * En este caso, '1' representa una obra con marco.
     * 
     * @property {string} value
     */
    value: '1',
  },
  {
    /**
     * Define la etiqueta que describe la opción visible para el usuario.
     * En este caso, la opción indica si la obra de arte no tiene marco.
     * 
     * @property {string} label
     */
    label: 'Sin marco',

    /**
     * Representa el valor asociado a la opción. Este valor es usado en la lógica de la aplicación.
     * En este caso, '0' representa una obra sin marco.
     * 
     * @property {string} value
     */
    value: '0',
  },
];

export const TEXTO_MANIFIESTO_ALERT = `
<div>
  <div class="form-check">
    <input class="form-check-input" type="checkbox" id="manifiestoCheckbox">
    <p>Manifiesto que la información sobre la propiedád de la obra(s) y los datos técnicos de la obra(s) son ciertos y verdaderos.*</p>
  </div>
</div>
`;

