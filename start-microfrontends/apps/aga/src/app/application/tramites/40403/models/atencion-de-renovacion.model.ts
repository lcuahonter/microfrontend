/**
 * Modelo de datos para la respuesta de CAAT
 * @interface CAAT
 */
export interface CAAT {
    /**
     * Clave de folio CAAT
     * @type {string}
     */
    claveFolioCAAT: string;

    /**
     * Clave de folio CAAT
     * @type {string}
     */
    cveFolioCaat: string;

    /**
     * Descripción del tipo de CAAT
     * @type {string}
     */
    descripcionTipoCaat: string;

    /**
     * Tipo de CAAT aéreo
     * @type {string}
     */
    tipoDeCaatAerea: string;

    /**
     * Código de transportación aérea
     * @type {string}
     */
    ideCodTransportacionAerea: string;

    /**
     * Código IATA/ICAO
     * @type {string}
     */
    codIataIcao: string;
}

/**
 * Modelo de datos para la respuesta de CAAT
 * @interface CAATRespuesta
 */
export interface CAATRespuesta {
    /**
     * Código de respuesta
     * @type {number}
     */
    code: number;

    /**
     * Datos de CAAT
     * @type {CAAT[]}
     */
    data: CAAT[];

    /**
     * Mensaje de respuesta
     * @type {string}
     */
    message: string;
}

/**
 * @interface RespuestaConsulta
 * @description Representa la respuesta de la API para una consulta.
 * 
 * @property {boolean} success - Indica si la operación fue exitosa.
 * @property {ConsultaDatos} datos - Datos de la consulta.
 * @property {string} message - Mensaje de la respuesta.
 */
export interface RespuestaConsulta {
  success: boolean;
  datos: ConsultaDatos;
  message: string;
}

/**
 * @interface ConsultaDatos
 * @description Representa los datos de una consulta de CAAT.
 * 
 * @property {string} claveFolioCAAT - Clave del folio CAAT.
 * @property {string} cveFolioCaat - Clave del folio CAAT.
 * @property {string} descripcionTipoCaat - Descripción del tipo de CAAT.
 * @property {string} tipoDeCaatAerea - Tipo de CAAT aéreo.
 * @property {string} ideCodTransportacionAerea - Código de transportación aérea.
 * @property {string} codIataIcao - Código IATA/ICAO.
 */
export interface ConsultaDatos {
    claveFolioCAAT: string;
    cveFolioCaat: string; 
    descripcionTipoCaat: string;
    tipoDeCaatAerea: string;
    ideCodTransportacionAerea: string;
    codIataIcao: string;
  
}