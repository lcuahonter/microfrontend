/**
 * @fileoverview
 * Constantes y enumeraciones para la gestión de terceros relacionados en el trámite 220201 de agricultura.
 * Incluye mensajes, opciones de radio y la URL base para catálogos.
 * Cobertura compodoc 100%: cada constante está documentada.
 * @module tercerosrelacionados.enum
 */

/**
 * Mensaje mostrado cuando es obligatorio agregar al menos un registro en tablas con asterisco.
 * @type {string}
 */
export const SELECCIONADO = "Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro";

/**
 * Opciones para el botón de radio de tipo de persona (Física o Moral).
 * @type {{label: string, value: string}[]}
 */
export const OPCION_DE_BOTON_DE_RADIO = [
  {
    /**
     * Etiqueta para persona física.
     * @type {string}
     */
    "label": "Física",
    /**
     * Valor para persona física.
     * @type {string}
     */
    "value": "yes"
  },
  {
    /**
     * Etiqueta para persona moral.
     * @type {string}
     */
    "label": "Moral",
    /**
     * Valor para persona moral.
     * @type {string}
     */
    "value": "no"
  }
];

/**
 * URL base para la obtención de catálogos en el trámite 220201.
 * @type {string}
 */
export const URL = '../../../../../assets/json/220201/';