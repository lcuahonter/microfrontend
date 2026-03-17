/**
 * Representa el formulario para el cambio de modalidad.
 */
export interface CambioDeModalidadForm {
    /**
     * Modalidad seleccionada.
     */
    seleccionaLaModalidad: string;

    /**
     * Folio asociado al trámite.
     */
    folio: number;

    /**
     * Año del trámite.
     */
    ano: number;

    /**
     * Modalidad seleccionada para el cambio.
     */
    seleccionaModalidad: string;

    /**
     * Modalidad a la que se desea cambiar.
     */
    cambioModalidad: string;
}

/**
 * Representa un cambio de modalidad.
 */
export interface CambioModalidad {
    /**
     * Identificador único del cambio de modalidad.
     */
    id: number;

    /**
     * Descripción del cambio de modalidad.
     */
    descripcion: string;
}

/**
 * Respuesta del servicio para obtener los cambios de modalidad.
 */
export interface CambioModalidadResponse {
    /**
     * Datos relacionados con los cambios de modalidad.
     */
    cambioModalidad: {
        /**
         * Lista de cambios de modalidad disponibles.
         */
        data: CambioModalidad[];
    };
}

/**
 * Configuración de las columnas para la tabla de servicios.
 * 
 * @constant
 * @type {Array<{ encabezado: string, clave: (ele: ServicioInfo) => string | undefined, orden: number }>}
 * @property {string} encabezado - Encabezado de la columna.
 * @property {(ele: ServicioInfo) => string | undefined} clave - Función que obtiene el valor de la clave del elemento.
 * @property {number} orden - Orden de la columna en la tabla.
 */
export const CONFIGURACION_SERVICIO = [
    {
        encabezado: 'Descripción del servicio',
        clave: (ele: ServicioInfo): string | undefined => ele.descripcionDelServicio,
        orden: 1
    },
    {
        encabezado: 'Tipo de servicio',
        clave: (ele: ServicioInfo): string | undefined => ele.tipoDeServicio,
        orden: 2
    },
];

/**
 * Representa la información de un servicio.
 *
 * @interface ServicioInfo
 * @property {string} descripcionDelServicio - Descripción detallada del servicio.
 * @property {string} tipoDeServicio - Tipo o categoría del servicio.
 * @property {boolean} estatus - Indica si el servicio está activo (true) o inactivo (false).
 */
export interface ServicioInfo {
    descripcionDelServicio: string;
    tipoDeServicio: string;
    estatus: boolean;
}

/**
 * Representa la configuración de una columna en una tabla.
 * @typeParam T - Tipo genérico que representa el tipo de datos de la columna.
 */
export interface ConfiguracionColumna<T> {
    /**
     * Encabezado de la columna.
     */
    encabezado: string;

    /**
     * Función que obtiene el valor de la clave de un elemento.
     * @param ele - Elemento del tipo genérico T.
     * @returns Valor de la clave que puede ser string, number, undefined o boolean.
     */
    clave: (ele: T) => string | number | undefined | boolean;

    /**
     * Orden de la columna en la tabla.
     */
    orden: number;
}