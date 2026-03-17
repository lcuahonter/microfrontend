
/**
 * @fileoverview Modelos de datos para el cambio de modalidad del trámite 80302
 * @description Este archivo contiene todas las interfaces, tipos y configuraciones utilizadas
 * para manejar los cambios de modalidad en programas IMMEX dentro del trámite 80302
 * @author Sistema VUCEM
 * @version 1.0.0
 * @since 2024
 */

/**
 * Interfaz para el formulario de cambio de modalidad
 * @interface CambioDeModalidadForm
 * @description Define la estructura del formulario utilizado para solicitar cambios de modalidad
 * en programas IMMEX, incluyendo selecciones y datos de identificación
 */
export interface CambioDeModalidadForm {
    /** 
     * Modalidad seleccionada inicialmente
     * @type {string}
     * @description Primera selección de modalidad en el proceso de cambio
     */
    seleccionaLaModalidad: string;
    /** 
     * Número de folio del programa
     * @type {number}
     * @description Folio único del programa IMMEX al cual se aplicará el cambio de modalidad
     */
    folio: number;
    /** 
     * Año del programa
     * @type {number}
     * @description Año de registro o vigencia del programa IMMEX
     */
    ano: number;
    /** 
     * Nueva modalidad seleccionada
     * @type {string}
     * @description Modalidad de destino a la cual se desea cambiar el programa
     */
    seleccionaModalidad: string;
    /** 
     * Descripción del cambio de modalidad
     * @type {string}
     * @description Detalle o justificación del cambio de modalidad solicitado
     */
    cambioModalidad: string;
}

/**
 * Interfaz para datos de cambio de modalidad
 * @interface CambioModalidad
 * @description Define la estructura básica de información para opciones de cambio de modalidad disponibles
 */
export interface CambioModalidad {
    /** 
     * Identificador único de la modalidad
     * @type {number}
     * @description ID numérico único para cada tipo de modalidad disponible
     */
    id: number;
    /** 
     * Descripción de la modalidad
     * @type {string}
     * @description Nombre o descripción completa de la modalidad IMMEX
     */
    descripcion: string;
}

/**
 * Interfaz para respuesta de consulta de cambios de modalidad
 * @interface CambioModalidadResponse
 * @description Define la estructura de respuesta del servicio que retorna las opciones
 * de cambio de modalidad disponibles
 */
export interface CambioModalidadResponse {
    /** 
     * Datos de cambio de modalidad
     * @type {Object}
     * @description Objeto contenedor con la lista de modalidades disponibles
     */
    cambioModalidad: {
        /** 
         * Lista de modalidades disponibles
         * @type {CambioModalidad[]}
         * @description Array con todas las opciones de modalidad para cambio
         */
        data: CambioModalidad[];
    };
}

/**
 * Configuración de columnas para tabla de servicios
 * @constant CONFIGURACION_SERVICIO
 * @type {ConfiguracionColumna<ServicioInfo>[]}
 * @description Array de configuración que define las columnas y su comportamiento
 * para la visualización de información de servicios en tablas
 */
export const CONFIGURACION_SERVICIO = [
    {
        /** Encabezado para la columna de descripción del servicio */
        encabezado: 'Descripción del servicio',
        /** Función que extrae la descripción del servicio de cada elemento */
        clave: (ele: ServicioInfo): string | undefined => ele.descripcionDelServicio,
        /** Orden de aparición en la tabla */
        orden: 1
    },
    {
        /** Encabezado para la columna de tipo de servicio */
        encabezado: 'Tipo de servicio',
        /** Función que extrae el tipo de servicio de cada elemento */
        clave: (ele: ServicioInfo): string | undefined => ele.tipoDeServicio,
        /** Orden de aparición en la tabla */
        orden: 2
    },
]

/**
 * Interfaz para información de servicios
 * @interface ServicioInfo
 * @description Define la estructura de datos para información de servicios IMMEX
 * incluyendo descripción, tipo y estado del servicio
 */
export interface ServicioInfo {
    /** 
     * Descripción detallada del servicio
     * @type {string}
     * @description Descripción completa del servicio IMMEX ofrecido
     */
    descripcionDelServicio: string;
    /** 
     * Tipo de servicio
     * @type {string}
     * @description Clasificación o categoría del tipo de servicio IMMEX
     */
    tipoDeServicio: string;
    /** 
     * Estado del servicio
     * @type {boolean}
     * @description Indicador booleano del estado activo/inactivo del servicio
     */
    estatus: boolean;
}

/**
 * Interfaz genérica para configuración de columnas de tabla
 * @interface ConfiguracionColumna
 * @template T - Tipo de datos que contendrá cada fila de la tabla
 * @description Define la estructura para configurar columnas dinámicas en tablas,
 * permitiendo especificar encabezados, funciones de extracción y orden
 */
export interface ConfiguracionColumna<T> {
    /** 
     * Título de la columna
     * @type {string}
     * @description Texto que se mostrará como encabezado de la columna en la tabla
     */
    encabezado: string;
    /** 
     * Función extractora de valor
     * @type {function}
     * @description Función que recibe un elemento de tipo T y devuelve el valor
     * correspondiente para mostrar en la columna
     * @param {T} ele - Elemento de datos de la fila
     * @returns {string | number | undefined | boolean} Valor a mostrar en la celda
     */
    clave: (ele: T) => string | number | undefined | boolean;
    /** 
     * Orden de la columna en la tabla
     * @type {number}
     * @description Número que determina la posición de la columna en la tabla
     */
    orden: number;
}