/**
 * Definición de la interfaz `TableDataNgTable`.
 * Representa la estructura de los datos de una tabla, incluyendo sus encabezados y el cuerpo de la tabla.
 */
export interface TableDataNgTable {
  /**
   * Array de cadenas que representan los encabezados de la tabla.
   */
  tableHeader: string[];

  /**
   * Array de objetos `TBodyData` que contienen los datos del cuerpo de la tabla.
   */
  tableBody: TBodyData[];
}


/**
 * Definición de la interfaz `TBodyData`.
 * Representa la estructura de los datos que conforman el cuerpo de una tabla.
 */
export interface TBodyData {
  /**
   * Datos de las filas del cuerpo de la tabla.
   * Se almacenan en un array de cadenas.
   */
  tbodyData: string[];
}


/**
 * Definición de la interfaz `RatioOption`.
 * Representa una estructura utilizada para almacenar opciones con una etiqueta (`label`) y un valor (`value`).
 */
export interface RatioOption {
  /**
   * Etiqueta que describe la opción.
   */
  label: string;

  /**
   * Valor asociado a la opción, que puede ser un número o una cadena de texto.
   */
  value: string | number;
}

/**
 * Definición de la interfaz `MercanciaInstalada`.
 * Representa la estructura de los datos relacionados con mercancías instaladas.
 */
export interface MercanciaInstalada {
  "TipoDeMercancía": string;
  "Cantidad": string;
  "UnidadDeMedidaDeComercialización": string;
  "Año": string;
  "Modelo": string;
  "Marco": string;
  "NúmeroDeSerie": string;
  "UsoEspecíficoDeLaMercancía": string;
  "CondiciónDeLaMercancía": string;
  "Vehículo": string;
}
