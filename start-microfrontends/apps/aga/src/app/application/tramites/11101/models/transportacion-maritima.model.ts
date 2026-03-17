
/**
 * DiscripccionDeLaMercanciaForm: Interface para la información de la persona fisca
 * @interface DiscripccionDeLaMercancia
 */
export interface DiscripccionDeLaMercanciaForm {
   
   consecutivo: string;
   estado: string;
   formaParteDePatrimonio: string;
   descripcion: string;
   cantidad: string;
   unidadmedida: string;
   fraccionarancelaria: string;
   valor: string;
   moneda: string;
   fin: string;
   nico: string;
   marca: string;
   modelo: string;
   numerodeserie: string;
   especifique: string;
}

/**
 * RespuestaMercancia: Interface para la respuesta de la mercancía
 * @interface RespuestaMercancia
 */
export interface RespuestaMercancia {
  success: boolean;
  datos: DiscripccionDeLaMercanciaForm[];
  message: string;
}

/**
 * Interfaz que representa los datos de un solicitante.
 */
export interface SolicitanteMockData {
  /**
   * RFC del solicitante
   * @type {string}
   */
  rfc: string;

  /**
   * Denominación o razón social del solicitante
   * @type {string}
   */
  denominacion: string;

  /**
   * Actividad económica del solicitante
   * @type {string}
   */
  actividadEconomica: string;

  /**
   * Correo electrónico del solicitante
   * @type {string}
   */
  correoElectronico: string;

  /**
   * Lada telefónica
   * @type {string}
   */
  lada: string;

  /**
   * País del solicitante
   * @type {string}
   */
  pais: string;

  /**
   * Código postal
   * @type {string}
   */
  codigoPostal: string;

  /**
   * Municipio o alcaldía
   * @type {string}
   */
  municipioOAlcadia: string;

  /**
   * Estado
   * @type {string}
   */
  estado: string;

  /**
   * Calle
   * @type {string}
   */
  calle: string;

  /**
   * Número exterior
   * @type {string}
   */
  numeroExterior: string;

  /**
   * Número interior
   * @type {string}
   */
  numeroInterior: string;

  /**
   * Teléfono
   * @type {string}
   */
  telefono: string;
}
