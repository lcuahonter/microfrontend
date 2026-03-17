/**
 * @interface DatosDelMercancia
 * @description Representa la estructura de los datos de una mercancía para el trámite de exención de impuestos.
 * @property {string} tipoDeMercancia - Tipo de mercancía.
 * @property {string} usoEspecifico - Uso específico de la mercancía.
 * @property {string | number} cantidad - Cantidad de mercancía.
 * @property {string} unidadMedida - Unidad de medida de la mercancía.
 * @property {string | number} [ano] - Año del modelo (opcional).
 * @property {string} [modelo] - Modelo de la mercancía (opcional).
 * @property {string} [marca] - Marca de la mercancía (opcional).
 * @property {string} [serie] - Número de serie de la mercancía (opcional).
 * @property {string} condicionMercancia - Condición de la mercancía.
 * @property {boolean} [vehiculo] - Indica si la mercancía es un vehículo (opcional).
 */
export interface DatosDelMercancia {
  tipoDeMercancia: string;
  usoEspecifico: string;
  cantidad: string | number;
  unidadMedida: string;
  ano?: string | number;
  modelo?: string;
  marca?: string;
  serie?: string;
  condicionMercancia: string;
  vehiculo?: boolean;
}

/**
 * @constant RADIO_OPCIONS
 * @description Opciones de radio para seleccionar "Sí" o "No" en el formulario de exención de impuestos.
 * @type {Array<{label: string, value: string}>}
 */
export const RADIO_OPCIONS = [
  { label: 'Sí', value: 'Si' },
  { label: 'No', value: 'No' },
];
