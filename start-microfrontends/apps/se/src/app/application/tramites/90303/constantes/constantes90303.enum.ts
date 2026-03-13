import { Bitacora, ListaSectoresTabla } from "../models/registro.model";
import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";

/**
 * Configuración de columnas para la tabla de sectores activos.
 * Define las columnas que se mostrarán en la tabla de sectores activos,
 * incluyendo encabezados, claves y el orden de las columnas.
 */
export const LISTA_DE_SECTORS: ConfiguracionColumna<ListaSectoresTabla>[] = [
    {
        encabezado: 'Estatus', // Encabezado de la columna "Estatus".
        clave: (ele: ListaSectoresTabla) => ele.descripcionTestado, // Clave que define el valor de la columna.
        orden: 1, // Orden en el que se mostrará la columna.
    },
    {
        encabezado: 'Clave del sector', // Encabezado de la columna "Clave de sector".
        clave: (ele: ListaSectoresTabla) => ele.cvSectorCatalogo, // Clave que define el valor de la columna.
        orden: 2, // Orden en el que se mostrará la columna.
    },
    {
        encabezado: 'Sector', // Encabezado de la columna "Sector".
        clave: (ele: ListaSectoresTabla) => ele.sector, // Clave que define el valor de la columna.
        orden: 3, // Orden en el que se mostrará la columna.
    },
];

/**
 * Configuración de columnas para la tabla de bitácoras.
 * Define las columnas que se mostrarán en la tabla de bitácoras,
 * incluyendo encabezados, claves y el orden de las columnas.
 * @constant {ConfiguracionColumna<Bitacora>[]} CONFIGURACION_BITACORA
 */
export const CONFIGURACION_BITACORA = [
  {
    /**
     * Encabezado de la columna: Tipo modificación.
     * @property {string} encabezado
     */
    encabezado: 'Tipo modificación',

    /**
     * Función que devuelve el valor del tipo de modificación.
     * @property {(ele: Bitacora) => string | undefined} clave
     */
    clave: (ele: Bitacora): string | undefined => ele.tipoModificacion,

    /**
     * Orden de la columna.
     * @property {number} orden
     */
    orden: 1,
  },
  {
    encabezado: 'Fecha modificación',
    clave: (ele: Bitacora): string | undefined => ele.fechaModificacion,
    orden: 2,
  },
  {
    encabezado: 'Valores anteriores',
    clave: (ele: Bitacora): string | undefined => ele.valoresAnteriores,
    orden: 3,
  },
  {
    encabezado: 'Valores nuevos',
    clave: (ele: Bitacora): string | undefined => ele.valoresNuevos,
    orden: 4,
  },
];

/**
 * Título del componente para el registro de solicitud de modificación del programa PROSEC.
 * @constant {string} TITULO
 */
export const TITULO = 'Registro de solicitud modificación programa PROSEC (Baja de sector)';

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
 * Constante que define el valor del discriminador para el trámite 90303.
 */
export const DISCRIMINATOR_VALUE = '90303';

/**
 * Expresión regular para identificar comas al final de una cadena.
 */
export const REGEX_COMAS_FINALES = /,+$/;

/**
 * Genera un mensaje HTML que indica el registro exitoso de una solicitud.
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.</p>`;