
/**
 * Interfaz que representa la información aduanera.
 * 
 * @export
 * @interface AduanerasInformaciones
 */
export interface AduanerasInformaciones {
  /**
   * Número de permiso de importación.
   * 
   * @type {string}
   * @memberof AduanerasInformaciones
   */
  importPermitNumber: string;

  /**
   * Lista de aduanas actuales.
   * 
   * @type {string[]}
   * @memberof AduanerasInformaciones
   */
  currentCustoms: string[];

  /**
   * Lista de aduanas disponibles.
   * 
   * @type {string[]}
   * @memberof AduanerasInformaciones
   */
  availableCustoms: string[];

  /**
   * Lista de aduanas seleccionadas.
   * 
   * @type {string[]}
   * @memberof AduanerasInformaciones
   */
  selectedCustoms: string[];

  /**
   * Justificación técnica para la información aduanera.
   * 
   * @type {string}
   * @memberof AduanerasInformaciones
   */
  technicalJustification: string;
}

/**
 * Interfaz que representa una aduana.
 * 
 * @export
 * @interface Aduana
 */
export interface Aduana {
  id: number;
  name: string;
}
/**
 * Interfaz para los datos de prueba del representante.
 */
/**
 * Interfaz que representa los datos de un representante.
 * 
 * @property {string} rfc - Registro Federal de Contribuyentes del representante.
 * @property {string} nombre - Nombre del representante.
 * @property {string} apellidoPaterno - Apellido paterno del representante.
 * @property {string} apellidoMaterno - Apellido materno del representante.
 */
export interface ReprestantanteData {
  rfc: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

