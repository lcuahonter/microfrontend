/**
 * Configuración estática del catálogo de tipos de documento.
 *
 * Contiene la definición de las opciones disponibles en el formulario,
 * así como parámetros adicionales para su renderizado y validación.
 *
 * @constant
 * @property {Array<{id: number, descripcion: string}>} catalogos - Lista de tipos de documento disponibles.
 * @property {boolean} required - Indica si el campo es obligatorio en el formulario.
 * @property {string} labelNombre - Etiqueta que se mostrará junto al campo.
 * @property {string} primerOpcion - Texto de la opción por defecto que se muestra en el selector.
 */
export const TIPO_DE_DOCUMENTO = {
  catalogos: [
    {
      id: 1,
      descripcion: 'Otros',
    },
  ],
  required: false,
  labelNombre: 'Tipo de documento',
  primerOpcion: 'Seleccione un tipo de documento',
};
