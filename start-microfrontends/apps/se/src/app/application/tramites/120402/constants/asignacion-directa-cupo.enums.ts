/**
 * @fileoverview
 * Este archivo define la configuración de la tabla de cupos disponibles utilizada en la aplicación.
 * Proporciona una estructura para personalizar las columnas de la tabla, incluyendo encabezados,
 * claves de acceso a los datos y el orden en que se deben mostrar.
 * 
 * @module AsignacionDirectaCupoEnums
 * @description
 * Este archivo contiene la configuración de la tabla de cupos disponibles, que se utiliza para
 * mostrar información relevante como el nombre del producto, subproducto, mecanismo de asignación,
 * fracciones arancelarias y tipo de cupo.
 */

import { SeleccionDelCupoTabla } from '../models/asignacion-directa-cupo.model';

/**
 * Configuración de la tabla de cupos disponibles utilizada en la aplicación.
 * 
 * Este arreglo define las columnas de la tabla, incluyendo encabezados, claves de acceso
 * a los datos y el orden en que se deben mostrar. Cada columna está representada por un objeto
 * que contiene las siguientes propiedades:
 * 
 * - `encabezado`: El título de la columna que se mostrará en la tabla.
 * - `clave`: Una función que toma un elemento de tipo `SeleccionDelCupoTabla` y devuelve
 *   el valor correspondiente a mostrar en la columna. Puede devolver un `string` o `undefined`.
 * - `orden`: Un número que indica la posición de la columna en la tabla.
 * 
 * @constant {Array<Object>}
 * @type {Array<{ encabezado: string, clave: (ele: SeleccionDelCupoTabla) => string | undefined, orden: number }>}
 * 
 * @example
 * // Ejemplo de uso:
 * const columnas = CONFIGURACION_CUPOS_DISPONIBLES_TABLA.map(col => col.encabezado);
 * console.log(columnas); // ['Nombre de producto', 'Nombre del subproducto', ...]
 */
export const CONFIGURACION_CUPOS_DISPONIBLES_TABLA = [
  {
    /**
     * Columna que muestra el nombre del producto.
     * @property {string} encabezado - Título de la columna.
     * @property {function} clave - Función que devuelve el nombre del producto.
     * @property {number} orden - Posición de la columna en la tabla.
     */
    encabezado: 'Nombre de producto',
    clave: (ele: SeleccionDelCupoTabla): string | undefined => ele.nombreProducto,
    orden: 1,
  },
  {
    /**
     * Columna que muestra el nombre del subproducto.
     * @property {string} encabezado - Título de la columna.
     * @property {function} clave - Función que devuelve el nombre del subproducto.
     * @property {number} orden - Posición de la columna en la tabla.
     */
    encabezado: 'Nombre del subproducto',
    clave: (ele: SeleccionDelCupoTabla): string | undefined => ele.nombreSubproducto,
    orden: 2,
  },
  {
    /**
     * Columna que muestra el mecanismo de asignación.
     * @property {string} encabezado - Título de la columna.
     * @property {function} clave - Función que devuelve el mecanismo de asignación.
     * @property {number} orden - Posición de la columna en la tabla.
     */
    encabezado: 'Mecanismo de asignacións',
    clave: (ele: SeleccionDelCupoTabla): string | undefined => ele.mecanismoAsignacion,
    orden: 3,
  },
  {
    /**
     * Columna que muestra las fracciones arancelarias.
     * @property {string} encabezado - Título de la columna.
     * @property {function} clave - Función que devuelve las fracciones arancelarias.
     * @property {number} orden - Posición de la columna en la tabla.
     */
    encabezado: 'Fracciones arancelarias',
    clave: (ele: SeleccionDelCupoTabla): string | undefined => ele.fracciones,
    orden: 4,
  },
  {
    /**
     * Columna que muestra el tipo de cupo.
     * @property {string} encabezado - Título de la columna.
     * @property {function} clave - Función que devuelve el tipo de cupo.
     * @property {number} orden - Posición de la columna en la tabla.
     */
    encabezado: 'Tipo cupos',
    clave: (ele: SeleccionDelCupoTabla): string | undefined => ele.tipoCupo,
    orden: 5,
  },
];

/** Genera el mensaje HTML para registro exitoso
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado al momento en que ésta sea firmada.</p>`;