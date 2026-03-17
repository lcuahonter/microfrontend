/**
 * @fileoverview Modelos de datos para payloads del trámite 80302
 * @description Este archivo contiene las interfaces utilizadas para estructurar los payloads
 * de solicitudes, parámetros y programas del trámite 80302 del sistema VUCEM
 * @author Sistema VUCEM
 * @version 1.0.0
 * @since 2024
 */

/**
 * Interfaz para payload de socios y accionistas
 * @interface SocioAccionistaPayload
 * @description Define la estructura del payload para manejar información de socios y accionistas
 * en las solicitudes del trámite 80302
 */
export interface SocioAccionistaPayload{
  /** 
   * Lista de identificadores de solicitudes asociadas a socios y accionistas
   * @type {number[]}
   * @description Array de IDs numéricos que referencian las solicitudes donde participan
   * los socios y accionistas (puede ser indefinido)
   */
  idSolicitud?: number[];
}

/**
 * Interfaz para parámetros de consulta
 * @interface Params
 * @description Define los parámetros utilizados en las consultas y operaciones del trámite 80302
 */
export interface Params{
  /** 
   * Identificador único de la solicitud
   * @type {string}
   * @description ID de la solicitud como cadena de texto (puede ser indefinido)
   */
  idSolicitud?: string;
  /** 
   * Identificador del programa IMMEX
   * @type {string}
   * @description ID del programa de la Industria Manufacturera, Maquiladora y de Servicios
   * de Exportación (puede ser indefinido)
   */
  idPrograma?: string;
  /** 
   * RFC del contribuyente
   * @type {string}
   * @description Registro Federal de Contribuyentes del solicitante (puede ser indefinido)
   */
  rfc?: string;

  /** 
   * Tipo de programa seleccionado
   * @type {string}
   * @description Indica si el programa es IMMEX o PROSEC (puede ser indefinido)
   */
  tipoPrograma?: string;
}

/**
 * Interfaz para información de programas IMMEX
 * @interface Programa
 * @description Define la estructura completa de un programa de la Industria Manufacturera,
 * Maquiladora y de Servicios de Exportación con sus identificadores y características principales
 */
export interface Programa {
  /** 
   * RFC del titular del programa
   * @type {string | null}
   * @description Registro Federal de Contribuyentes de la empresa titular del programa IMMEX
   */
  rfc: string | null;
  /** 
   * Identificador único del programa
   * @type {string | null}
   * @description ID único asignado al programa IMMEX en el sistema
   */
  idPrograma: string | null;
  /** 
   * Tipo de programa IMMEX
   * @type {string | null}
   * @description Clasificación del programa según su modalidad (Controladora, Industrial, etc.)
   */
  tipoPrograma: string | null;
  /** 
   * Folio oficial del programa
   * @type {string | null}
   * @description Número de folio oficial asignado por la autoridad al programa IMMEX
   */
  folioPrograma: string | null;
  /** 
   * Discriminador del programa
   * @type {string | null}
   * @description Campo utilizado para distinguir entre diferentes tipos de programas
   * en la persistencia de datos
   */
  discriminator: string | null;
}


/**
 * Representa un programa IMMEX en una lista o tabla.
 * Contiene información básica del programa.
 * @interface ProgramaLista
 */
export interface ProgramaLista {
  /**
   * Identificador único del programa autorizado.
   */
  idProgramaAutorizado?: string;

  /**
   * Folio único del programa IMMEX.
   */
  folioPrograma?: string;

  /**
   * Tipo de programa IMMEX.
   */
  tipoPrograma: string;

  /**
   * RFC asociado al programa IMMEX.
   */
  rfc?: string;

  /**
   * Identificador compuesto del programa IMMEX.
   */
  idProgramaCompuesto: string;
}

/**
 * Configuración de la lista de programas utilizada para definir las columnas
 * y el orden de visualización en una tabla o lista.
 */
export const CONFIGURACION_LISTA_PROGRAMA = [
    {
      /** Encabezado de la columna */
      encabezado: 'Folio de programa',
      /** Función para obtener el valor de la columna desde un objeto ProgramaLista */
      clave: (ele: ProgramaLista): string | undefined => ele.idProgramaCompuesto,
      /** Orden de la columna */
      orden: 1,
    },
    {
      /** Encabezado de la columna */
      encabezado: 'Tipo de programa',
      /** Función para obtener el valor de la columna desde un objeto ProgramaLista */
      clave: (ele: ProgramaLista): string | undefined => ele.tipoPrograma,
      /** Orden de la columna */
      orden: 2,
    }
];

/**
 * Constante que define los tipos de TICPSE disponibles.
 */
export const TICPSE = {
  /**
   * Tipo TICPSE para IMMEX.
   */
  TICPSE_IMMEX: 'TICPSE.IMMEX',

  /**
   * Tipo TICPSE para PROSEC.
   */
  TICPSE_PROSEC: 'TICPSE.PROSEC'
}

/**
 * Constante que define el valor del discriminador para el trámite 80301.
 */
export const DISCRIMINATOR_VALUE = '80302';