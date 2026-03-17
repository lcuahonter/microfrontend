import { DatosDelMercancia } from "../models/modificacion-donaciones-immex.model";

/**
 * Objeto que contiene las etiquetas y valores predeterminados utilizados para 
 * capturar la información relacionada con la mercancía en formularios de importación.
 */
export const DATOS_DE_LA_MERCANCIA = {
  /**
   * Opción por defecto para listas desplegables donde el usuario debe seleccionar un valor.
   */
  PRIMAR_OPCION: 'Selecccione un Valor',

  /**
   * Etiqueta para el campo que solicita el propósito o uso final de la mercancía.
   */
  PROPOSITO_DE_LA_MERCANCIA_LABEL_NOMBRE: 'Fin al cual desinará la mercancía',

  /**
   * Etiqueta para el campo donde se indica la aduana de ingreso de la mercancía.
   */
  ADUANA_LABEL_NOMBRE: 'Aduana por la que ingresará la mercancía',

  /**
   * Etiqueta para el campo que describe el tipo de mercancía a importar.
   */
  TIO_DE_MERCANCIA: 'Tipo de mercancía',

  /**
   * Etiqueta para el campo que indica la cantidad de unidades de la mercancía.
   */
  CANTIDAD: 'Cantidad',

  /**
   * Etiqueta para la unidad de medida en que se comercializa la mercancía (kg, litros, unidades, etc.).
   */
  UNIDAD_DE_MEDIDA_DE_COMERCIALIZACION: 'Unidad de medida de comercialización',

  /**
   * Etiqueta para el año en que se realiza una importación temporal.
   */
  ANO_DE_IMPORTACION_TEMPORAL: 'Año de importación temporal',

  /**
   * Etiqueta del campo que indica el modelo de la mercancía (por ejemplo, modelo de un vehículo).
   */
  MODEL: 'Modelo',

  /**
   * Etiqueta para especificar la marca del producto o mercancía.
   */
  MARCA: 'Marca',

  /**
   * Etiqueta para ingresar el número de serie único de la mercancía.
   */
  NUMBERO_DE_SERIE: 'Número de serie',
};

/**
 * Configuración de las columnas para la tabla que muestra la información de la mercancía.
 */
export const MERCANCIA_TABLA_CONFIGURACION = [{
  encabezado: 'Tipo de mercancía',
  clave: (ele: DatosDelMercancia): string | undefined => ele.tipoDeMercancia,
  orden: 1
}, {
  encabezado: 'Cantidad',
  clave: (ele: DatosDelMercancia): string | undefined => ele.cantidad,
  orden: 2
}, {
  encabezado: 'Unidad de medida de Comercialización',
  clave: (ele: DatosDelMercancia): string | number => ele.unidadMedida,
  orden: 3
}, {
  encabezado: 'Año de importación temporal',
  clave: (ele: DatosDelMercancia): string | number => ele.ano,
  orden: 4
}, {
  encabezado: 'Modelo',
  clave: (ele: DatosDelMercancia): string | undefined => ele.modelo,
  orden: 5
}, {
  encabezado: 'Marca',
  clave: (ele: DatosDelMercancia): string | undefined => ele.marca,
  orden: 6
}, {
  encabezado: 'Numero de serie',
  clave: (ele: DatosDelMercancia): string | undefined => ele.serie,
  orden: 7
}, {
  encabezado: 'Condición de la mercancía',
  clave: (ele: DatosDelMercancia): string | number => ele.condicionMercancia,
  orden: 8
}]; 