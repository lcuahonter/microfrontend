import { CrossListLable } from "../../../tramites/components/crosslist/crosslist.component";

/**
 * Lista de países disponibles para la selección en el formulario.
 * Cada elemento de la lista representa el nombre oficial de un país o territorio.
 */
export const CROSLISTA_DE_PAISES: string[] = [
  "AFGANISTÁN (EMIRATO ISLÁMICO)",
  "ALBANIA (REPÚBLICA DE)",
  "ALEMANIA (REPÚBLICA FEDERAL DE)",
  "ANDORRA (PRINCIPADO DE)",
  "ANGOLA (REPÚBLICA DE)",
  "ANGUILLA",
  "ANTIGUA Y BARBUDA",
  "ARABIA SAUDITA (COMUNIDAD ECONÓMICA EUROPEA)",
  "ARGELIA (REPÚBLICA DEMOCRÁTICA Y POPULAR DE)",
  "ARGENTINA (REPÚBLICA)",
  "AUSTRALIA (COMMONWEALTH OF)",
  "AUSTRIA (REPUBLIC OF)",
  "BAHAMAS (COMMONWEALTH OF THE)",
  "BAHRAIN (KINGDOM OF)",
  "BANGLADESH (PEOPLE'S REPUBLIC OF)",
  "BARBADOS",
  "BELGIUM (KINGDOM OF)",
  "BELIZE",
  "BENIN (REPUBLIC OF)",
  "BHUTAN (KINGDOM OF)"
];
 
/**
 * Constante que representa una acción para continuar un proceso.
 * Valor "t" indica la continuidad o confirmación de una acción específica.
 */
export const CONTINUAR: string = "t";

/**
 * Etiquetas utilizadas para mostrar los títulos en la interfaz de selección de país.
 * 
 * @property {string} tituluDeLaIzquierda - Título que se muestra en la parte izquierda, indicando el país de procedencia.
 * @property {string} derecha - Título que se muestra en la parte derecha, indicando los países seleccionados.
 */
export const ETIQUETA : CrossListLable ={
  tituluDeLaIzquierda: 'País de procedencia',
  derecha: 'País(es) seleccionados',
}

/**
 * Constante que representa la información relacionada con la fecha de fabricación.
 *
 * @property {string} labelNombre - Etiqueta descriptiva para la fecha de fabricación.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado o no.
 */
export const FECHA_DE_FABRICACION = {
  labelNombre: 'Fecha de fabricación',
  required: true,
  habilitado: false,
};

/**
 * Constante que representa la configuración para el campo "Fecha de caducidad".
 *
 * @property {string} labelNombre - Etiqueta que se muestra para el campo.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado o no.
 */
export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha de caducidad',
  required: true,
  habilitado: false,
};

/**
 * Opciones para un botón de radio que permite seleccionar entre "Sí" y "No".
 *
 * @remarks
 * Este arreglo se utiliza para representar las opciones de un componente de botón de radio,
 * donde cada opción contiene una etiqueta (`label`) y un valor (`value`).
 *
 * @example
 * // Uso típico en un formulario:
 * OPCIONES_DE_BOTON_DE_RADIO.map(opcion => (
 *   <RadioButton label={opcion.label} value={opcion.value} />
 * ));
 *
 * @property {string} label - Texto que se muestra al usuario ("No" o "Si").
 * @property {string} value - Valor asociado a la opción ("0" para "No", "1" para "Si").
 */
export const OPCIONES_DE_BOTON_DE_RADIO = [
  {
      label: 'No',
      value: '0',
  },
  {
      label: 'Si',
      value: '1',
  }
];

/**
 * Constante que representa los valores predeterminados para un formulario de domicilio.
 *
 * @property {number} nombre - Identificador numérico para el campo 'nombre'.
 * @property {string} apellidoPaterno - Valor predeterminado para el campo 'apellido paterno'.
 * @property {string} apellidoMaterno - Valor predeterminado para el campo 'apellido materno'.
 */
export const VALOR_FORMULARIO = {
  nombre: 47875,
  apellidoPaterno: 'Paterno',
  apellidoMaterno: 'Materno',
}
 