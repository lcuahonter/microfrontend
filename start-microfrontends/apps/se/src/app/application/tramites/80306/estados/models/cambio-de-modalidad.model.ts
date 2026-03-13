
/**
 * Representa el formulario para el cambio de modalidad.
 * @interface CambioDeModalidadForm
 */
export interface CambioDeModalidadForm {
    /** Modalidad seleccionada */
    seleccionaLaModalidad: string;
    /** Folio del trámite */
    folio: number;
    /** Año del trámite */
    ano: number;
    /** Modalidad seleccionada */
    seleccionaModalidad: string;
    /** Cambio de modalidad */
    cambioModalidad: string;
}

/**
 * Representa una modalidad de cambio disponible.
 * @interface CambioModalidad
 */
export interface CambioModalidad {
    /** Identificador de la modalidad */
    id: number;
    /** Descripción de la modalidad */
    descripcion: string;
}

/**
 * Respuesta de la API para el cambio de modalidad.
 * @interface CambioModalidadResponse
 */
export interface CambioModalidadResponse {
    /** Objeto con la lista de modalidades */
    cambioModalidad: {
        /** Lista de modalidades */
        data: CambioModalidad[];
    };
}

/**
 * Configuración de columnas para la tabla de servicios.
 * @const {Array<{encabezado: string, clave: Function, orden: number}>}
 */
export const CONFIGURACION_SERVICIO = [
    {
        /** Encabezado de la columna */
        encabezado: 'Descripción del servicio',
        /** Función para obtener la descripción del servicio */
        clave: (ele: ServicioInfo): string | undefined => ele.descripcionDelServicio,
        /** Orden de la columna */
        orden: 1
    },
    {
        /** Encabezado de la columna */
        encabezado: 'Tipo de servicio',
        /** Función para obtener el tipo de servicio */
        clave: (ele: ServicioInfo): string | undefined => ele.tipoDeServicio,
        /** Orden de la columna */
        orden: 2
    },
];

/**
 * Representa la información de un servicio.
 * @interface ServicioInfo
 */
export interface ServicioInfo {
    /** Descripción del servicio */
    descripcionDelServicio: string;
    /** Tipo de servicio */
    tipoDeServicio: string;
    /** Estatus del servicio */
    estatus: boolean;
}

/**
 * Representa la configuración de una columna en una tabla genérica.
 * @template T Tipo de los datos de la fila.
 * @interface ConfiguracionColumna
 */
export interface ConfiguracionColumna<T> {
    /** Título de la columna */
    encabezado: string;
    /** Función que devuelve el valor de la columna para cada fila */
    clave: (ele: T) => string | number | undefined | boolean;
    /** Orden de la columna en la tabla */
    orden: number;
}