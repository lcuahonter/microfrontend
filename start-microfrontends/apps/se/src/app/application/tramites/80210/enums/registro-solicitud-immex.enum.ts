import { ConfiguracionColumna } from "@libs/shared/data-access-user/src"
import { Plantas } from "../modelos/registro-solicitud-immex.model"

/**
 *  CONFIGURACION_TABLA_PLANTAS
 * @description Configuración de las columnas para la tabla de plantas en el módulo de trámites IMMEX.
 * Cada columna está definida con un encabezado, una clave que especifica cómo obtener el valor de la propiedad
 * correspondiente del objeto `Plantas`, y un orden que determina la posición de la columna en la tabla.
 * 
 * @type {ConfiguracionColumna<Plantas>[]}
 * 
 * @property {string} encabezado - El título de la columna que se mostrará en la tabla.
 * @property {Function} clave - Una función que recibe un objeto `Plantas` y devuelve el valor de la propiedad correspondiente.
 * @property {number} orden - El orden en el que se mostrará la columna en la tabla.
 * 
 * @example
 * // Ejemplo de uso:
 * CONFIGURACION_TABLA_PLANTAS.forEach(columna => {
 *   console.log(columna.encabezado, columna.clave(item), columna.orden);
 * });
 */
export const CONFIGURACION_TABLA_PLANTAS: ConfiguracionColumna<Plantas>[] = [
{encabezado:'Calle', clave: (item: Plantas):string=>item.calle, orden:1 },
{encabezado:'Número exterior', clave: (item: Plantas):string=>item.numExterior, orden:2 },
{encabezado:'Número interior', clave: (item: Plantas):string=>item.numInterior, orden:3 },
{encabezado:'Código postal', clave: (item: Plantas):string=>item.codigoPostal, orden:4 },
{encabezado:'Colonia', clave: (item: Plantas):string=>item.colonia, orden:5 },
{encabezado:'Municipio o delegación', clave: (item: Plantas):string=>item.municipio, orden:6 },
{encabezado:'Entidad federativa', clave: (item: Plantas):string=>item.entidadFederativa, orden:7 },
{encabezado:'País', clave: (item: Plantas):string=>item.pais, orden:8 },
{encabezado:'Registro federal de contribuyen', clave: (item: Plantas):string=>item.registroFederal, orden:9 },
{encabezado:'Domicilio fiscal del solicitante', clave: (item: Plantas):string=>item.domicilio, orden:10 },
{encabezado:'Razón social', clave: (item: Plantas):string=>item.razon, orden:11 }
]