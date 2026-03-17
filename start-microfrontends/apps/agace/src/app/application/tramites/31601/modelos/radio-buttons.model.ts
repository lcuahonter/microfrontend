/**
 * Interfaz que define una opción para un control de selección tipo radio button.
 * 
 * @interface RadioOpcion
 * @property {string} label - Etiqueta visible para el usuario.
 * @property {string} value - Valor interno asignado a la opción seleccionada.
 */
export interface RadioBotons {
    label: string;
    value: string;
}  

  /**
 * Configuración para la fecha final de vigencia.
 * Contiene las propiedades necesarias para mostrar y validar el campo en el formulario.
 */
  export const FECHA_FINAL = {
    labelNombre: '*Fecha de pago',
    required: false,
    habilitado: true
  };