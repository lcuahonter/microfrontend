/**
 * @fileoverview Configuraciones de tablas y constantes para la gestión de choferes en el trámite 40102
 * 
 * Este archivo contiene las configuraciones de columnas para las tablas de choferes nacionales
 * y extranjeros, así como mensajes informativos utilizados en la interfaz de usuario.
 * Las configuraciones definen la estructura de presentación de datos, incluyendo encabezados,
 * funciones de acceso a propiedades y orden de columnas.
 * 
 * Las constantes están organizadas por tipo de chofer:
 * - Configuración para choferes nacionales (CURP, domicilio, etc.)
 * - Configuración para choferes extranjeros (NSS, datos internacionales)
 * - Textos informativos para operaciones de modificación y baja
 * 
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module ChoferesEnum
 */

import { ChoferesExtranjeros, DatosDelChoferNacional } from "../models/registro-muestras-mercancias.model";
import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";

/**
 * Configuración de columnas para la tabla de choferes nacionales en operaciones de alta.
 * 
 * Esta configuración define la estructura de la tabla utilizada para mostrar información
 * de choferes nacionales que serán dados de alta en el sistema. Cada elemento del array
 * especifica una columna de la tabla con su encabezado, función de acceso a datos y orden.
 * 
 * La configuración incluye información personal y de domicilio necesaria para la
 * identificación y registro de choferes mexicanos, incluyendo:
 * - Datos de identificación (CURP, nombre)
 * - Información de domicilio (calle, números, ubicación geográfica)
 * - Datos de residencia y contacto
 * 
 * @constant {ConfiguracionColumna<DatosDelChoferNacional>[]} CHOFERES_NACIONALES_ALTA
 * 
 * @example
 * ```typescript
 * // Usar la configuración en un componente de tabla
 * const configColumnas = CHOFERES_NACIONALES_ALTA;
 * 
 * // Acceder a los encabezados
 * const encabezados = configColumnas.map(col => col.encabezado);
 * 
 * // Obtener datos de una fila específica
 * const chofer: DatosDelChoferNacional = {...};
 * const curp = configColumnas[0].clave(chofer); // Obtiene CURP
 * ```
 * 
 * @since 1.0.0
 */
export const CHOFERES_NACIONALES_ALTA: ConfiguracionColumna<DatosDelChoferNacional>[] = [
    {
        /**
         * Columna para la CURP (Clave Única de Registro de Población).
         * 
         * @property {string} encabezado - 'CURP'
         * @property {Function} clave - Función que obtiene item.curp
         * @property {number} orden - Posición 1 en la tabla
         */
        encabezado: 'CURP',
        clave: (item: DatosDelChoferNacional) => item.curp,
        orden: 1,
    },
    {
        /**
         * Columna para el nombre del chofer nacional.
         * 
         * @property {string} encabezado - 'Número'
         * @property {Function} clave - Función que obtiene item.nombre
         * @property {number} orden - Posición 2 en la tabla
         */
        encabezado: 'Número',
        clave: (item: DatosDelChoferNacional) => item.nombre,
        orden: 2,
    },
    {
        /**
         * Columna para la calle del domicilio.
         * 
         * @property {string} encabezado - 'calle'
         * @property {Function} clave - Función que obtiene item.calle
         * @property {number} orden - Posición 3 en la tabla
         */
        encabezado: 'calle',
        clave: (item: DatosDelChoferNacional) => item.calle,
        orden: 3,
    },
    {
        /**
         * Columna para el número exterior del domicilio.
         * 
         * @property {string} encabezado - 'Numero exterior'
         * @property {Function} clave - Función que obtiene item.numeroExterior
         * @property {number} orden - Posición 4 en la tabla
         */
        encabezado: 'Numero exterior',
        clave: (item: DatosDelChoferNacional) => item.numeroExterior,
        orden: 4,
    },
    {
        /**
         * Columna para el número interior del domicilio.
         * 
         * @property {string} encabezado - 'Numero interior'
         * @property {Function} clave - Función que obtiene item.numeroInterior
         * @property {number} orden - Posición 5 en la tabla
         */
        encabezado: 'Numero interior',
        clave: (item: DatosDelChoferNacional) => item.numeroInterior,
        orden: 5,
    },
    {
        /**
         * Columna para el país del domicilio.
         * 
         * @property {string} encabezado - 'País'
         * @property {Function} clave - Función que obtiene item.pais
         * @property {number} orden - Posición 6 en la tabla
         */
        encabezado: 'País',
        clave: (item: DatosDelChoferNacional) => item.pais,
        orden: 6,
    },
    {
        /**
         * Columna para el estado o entidad federativa.
         * 
         * @property {string} encabezado - 'Estado'
         * @property {Function} clave - Función que obtiene item.estado
         * @property {number} orden - Posición 7 en la tabla
         */
        encabezado: 'Estado',
        clave: (item: DatosDelChoferNacional) => item.estado,
        orden: 7,
    },
    {
        /**
         * Columna para el municipio o alcaldía.
         * 
         * @property {string} encabezado - 'Municipio o Alcaldía'
         * @property {Function} clave - Función que obtiene item.municipioAlcaldia
         * @property {number} orden - Posición 8 en la tabla
         */
        encabezado: 'Municipio o Alcaldía',
        clave: (item: DatosDelChoferNacional) => item.municipioAlcaldia,
        orden: 8,
    },
    {
        /**
         * Columna para la colonia del domicilio.
         * 
         * @property {string} encabezado - 'Colonia'
         * @property {Function} clave - Función que obtiene item.colonia
         * @property {number} orden - Posición 9 en la tabla
         */
        encabezado: 'Colonia',
        clave: (item: DatosDelChoferNacional) => item.colonia,
        orden: 9,
    },
    {
        /**
         * Columna para la localidad del domicilio.
         * 
         * @property {string} encabezado - 'Localidad'
         * @property {Function} clave - Función que obtiene item.localidad
         * @property {number} orden - Posición 10 en la tabla
         */
        encabezado: 'Localidad',
        clave: (item: DatosDelChoferNacional) => item.localidad,
        orden: 10,
    },
    {
        /**
         * Columna para el código postal del domicilio.
         * 
         * @property {string} encabezado - 'Codigo Postal'
         * @property {Function} clave - Función que obtiene item.codigoPostal
         * @property {number} orden - Posición 11 en la tabla
         */
        encabezado: 'Codigo Postal',
        clave: (item: DatosDelChoferNacional) => item.codigoPostal,
        orden: 11,
    },
    {
        /**
         * Columna para el país de residencia del chofer.
         * 
         * @property {string} encabezado - 'País de Residencia'
         * @property {Function} clave - Función que obtiene item.paisDeResidencia
         * @property {number} orden - Posición 12 en la tabla
         */
        encabezado: 'País de Residencia',
        clave: (item: DatosDelChoferNacional) => item.paisDeResidencia,
        orden: 12,
    }
];

/**
 * Configuración de columnas para la tabla de choferes extranjeros.
 * 
 * Esta configuración define la estructura de la tabla utilizada para mostrar información
 * de choferes extranjeros en el sistema. Cada elemento del array especifica una columna
 * de la tabla con su encabezado, función de acceso a datos y orden de presentación.
 * 
 * La configuración incluye información específica para choferes internacionales:
 * - Datos de identificación internacional (NSS, número de chofer)
 * - Información de domicilio extranjero (adaptada a diferentes países)
 * - Datos de residencia y ubicación geográfica internacional
 * 
 * Esta tabla se diferencia de la de choferes nacionales en que maneja documentación
 * y formatos de dirección internacionales, sin campos específicos mexicanos como CURP.
 * 
 * @constant {ConfiguracionColumna<ChoferesExtranjeros>[]} CHOFERES_EXTRANJEROS_TABLA
 * 
 * @example
 * ```typescript
 * // Usar la configuración en un componente de tabla
 * const configColumnasExtranjeros = CHOFERES_EXTRANJEROS_TABLA;
 * 
 * // Acceder a los encabezados
 * const encabezados = configColumnasExtranjeros.map(col => col.encabezado);
 * 
 * // Obtener datos de una fila específica
 * const choferExtranjero: ChoferesExtranjeros = {...};
 * const nss = configColumnasExtranjeros[0].clave(choferExtranjero); // Obtiene NSS
 * ```
 * 
 * @since 1.0.0
 */
export const CHOFERES_EXTRANJEROS_TABLA: ConfiguracionColumna<ChoferesExtranjeros>[] = [
    {
        /**
         * Columna para el número del seguro social extranjero.
         * 
         * @property {string} encabezado - 'Número del seguro social'
         * @property {Function} clave - Función que obtiene item.numeroDelSeguroSocial
         * @property {number} orden - Posición 1 en la tabla
         */
        encabezado: 'Número del seguro social',
        clave: (item: ChoferesExtranjeros) => item.numeroDelSeguroSocial,
        orden: 1,
    },
    {
        /**
         * Columna para el número identificador del chofer extranjero.
         * 
         * @property {string} encabezado - 'Número'
         * @property {Function} clave - Función que obtiene item.numero
         * @property {number} orden - Posición 2 en la tabla
         */
        encabezado: 'Número',
        clave: (item: ChoferesExtranjeros) => item.numero,
        orden: 2,
    },
    {
        /**
         * Columna para la calle del domicilio extranjero.
         * 
         * @property {string} encabezado - 'Calle'
         * @property {Function} clave - Función que obtiene item.calle
         * @property {number} orden - Posición 3 en la tabla
         */
        encabezado: 'Calle',
        clave: (item: ChoferesExtranjeros) => item.calle,
        orden: 3,
    },
    {
        /**
         * Columna para el número exterior del domicilio.
         * 
         * @property {string} encabezado - 'Número Exterior'
         * @property {Function} clave - Función que obtiene item.numeroExterior
         * @property {number} orden - Posición 4 en la tabla
         */
        encabezado: 'Número Exterior',
        clave: (item: ChoferesExtranjeros) => item.numeroExterior,
        orden: 4,
    },
    {
        /**
         * Columna para el número interior del domicilio.
         * 
         * @property {string} encabezado - 'Número Interior'
         * @property {Function} clave - Función que obtiene item.numeroInterior
         * @property {number} orden - Posición 5 en la tabla
         */
        encabezado: 'Número Interior',
        clave: (item: ChoferesExtranjeros) => item.numeroInterior,
        orden: 5,
    },
    {
        /**
         * Columna para el estado o provincia extranjero.
         * 
         * @property {string} encabezado - 'Estado'
         * @property {Function} clave - Función que obtiene item.estado
         * @property {number} orden - Posición 6 en la tabla
         */
        encabezado: 'Estado',
        clave: (item: ChoferesExtranjeros) => item.estado,
        orden: 6,
    },
    {
        /**
         * Columna para el país del domicilio extranjero.
         * 
         * @property {string} encabezado - 'País'
         * @property {Function} clave - Función que obtiene item.pais
         * @property {number} orden - Posición 7 en la tabla
         */
        encabezado: 'País',
        clave: (item: ChoferesExtranjeros) => item.pais,
        orden: 7,
    },
    {
        /**
         * Columna para la ciudad del domicilio extranjero.
         * 
         * @property {string} encabezado - 'Ciudad'
         * @property {Function} clave - Función que obtiene item.ciudad
         * @property {number} orden - Posición 8 en la tabla
         */
        encabezado: 'Ciudad',
        clave: (item: ChoferesExtranjeros) => item.ciudad,
        orden: 8,
    },
    {
        /**
         * Columna para el código postal internacional.
         * 
         * @property {string} encabezado - 'Código Postal'
         * @property {Function} clave - Función que obtiene item.codigoPostal
         * @property {number} orden - Posición 9 en la tabla
         */
        encabezado: 'Código Postal',
        clave: (item: ChoferesExtranjeros) => item.codigoPostal,
        orden: 9,
    },
    {
        /**
         * Columna para el país de residencia del chofer extranjero.
         * 
         * @property {string} encabezado - 'País de residencia'
         * @property {Function} clave - Función que obtiene item.paisDeResidencia
         * @property {number} orden - Posición 10 en la tabla
         */
        encabezado: 'País de residencia',
        clave: (item: ChoferesExtranjeros) => item.paisDeResidencia,
        orden: 10,
    },
];

/**
 * Mensajes informativos para operaciones con choferes en el trámite 40102.
 * 
 * Este objeto contiene los textos utilizados para informar a los usuarios sobre
 * los procedimientos necesarios para modificar o dar de baja choferes existentes
 * en el sistema CAAT (Certificación Aduanera de Autotransporte Terrestre).
 * 
 * Los mensajes están organizados por tipo de chofer:
 * - Mensajes para choferes nacionales
 * - Mensajes para choferes extranjeros
 * 
 * Cada mensaje explica el procedimiento requerido antes de realizar operaciones
 * de modificación o baja, enfatizando la necesidad de realizar búsquedas previas.
 * 
 * @constant {Object} TEXTOS
 * 
 * @example
 * ```typescript
 * // Mostrar mensaje para choferes nacionales
 * const mensajeNacional = TEXTOS.MENSAJE_NACIONAL;
 * this.mostrarInformacion(mensajeNacional);
 * 
 * // Mostrar mensaje para choferes extranjeros
 * const mensajeExtranjero = TEXTOS.MENSAJE_EXTRANJERO;
 * this.mostrarInformacion(mensajeExtranjero);
 * ```
 * 
 * @since 1.0.0
 */
export const TEXTOS = {
    /**
     * Mensaje informativo para operaciones con choferes nacionales.
     * 
     * Informa al usuario sobre el procedimiento requerido para modificar o dar de baja
     * un chofer nacional existente en el sistema CAAT. Requiere realizar una búsqueda
     * previa antes de proceder con las operaciones de modificación o baja.
     * 
     * @property {string} MENSAJE_NACIONAL
     * Contiene HTML con instrucciones para choferes nacionales
     */
    MENSAJE_NACIONAL: `<p>Para modificar o dar de baja un chófer nacional existente en su CAAT, primero debe realizar su búsqueda.</p>`,
    
    /**
     * Mensaje informativo para operaciones con choferes extranjeros.
     * 
     * Informa al usuario sobre el procedimiento requerido para modificar o dar de baja
     * un chofer extranjero existente en el sistema CAAT. Al igual que con choferes
     * nacionales, requiere realizar una búsqueda previa antes de las operaciones.
     * 
     * @property {string} MENSAJE_EXTRANJERO
     * Contiene HTML con instrucciones para choferes extranjeros
     */
    MENSAJE_EXTRANJERO: `<p>Para modificar o dar de baja un chófer extranjero existente en su CAAT, primero debe realizar su búsqueda.</p>`,
};
