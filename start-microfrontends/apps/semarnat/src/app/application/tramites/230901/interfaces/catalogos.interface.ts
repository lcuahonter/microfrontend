export type SimpleCatalogoResponse<T> = Pick<
    CatalogosResponse,
    'codigo' | 'mensaje'
> & { datos: T };



/** Modelo para almacenar la respuesta de las apis de catálogos */
export interface CatalogosResponse {
    codigo: string;
    mensaje: string;
    datos: Catalogos[];
}

/** Modelo para almacenar la respuesta de las apis de catálogos */
export interface Catalogos {
    codigo: string;
    mensaje: string;
    datos: string[];
}


/**
 * Modelo para cada uno de los registros regresados por las diferentes APIs
 */
export interface DatosCatalogos {
    clave: string;
    descripcion: string;
    title?: string; // Campo opcional para almacenar el título
}

export interface GuardaSolicitud {
    id_solicitud: string;
    fecha_creacion: string;
}


export interface TiposMovimientos {
    codigo: string;
    mensaje: string;
    datos: Catalogos[];
}

export interface TipoMovimiento {
    descripcion: string;
    clave: string;
}


/**
 * Interfaz Fracción arancelaria.
 * 
 * @accion La acción que se va a realizar.
 * @valor El valor asociado a la acción.
 */
export interface FraccionArancelaria {
    descripcion_alternativa: string;
    descripcion: string;
    id_fraccion_gubernamental: number;
    cve_fraccion: string;
}




/**
 * Interfaz que representa los tabs del paso 1.
 */
export interface TabCapturarSolicitud {
    indice: number,
    titulo: string,
    activo: boolean,
    disabled?: boolean
}

/**
 * Interfaz que representa la acción de un botón.
 * 
 * @accion La acción que se va a realizar.
 * @valor El valor asociado a la acción.
 */
export interface AccionBoton {
    accion: string;
    valor: number;
}


/**
 * Interfaz que representa la validacion de forulario y tab correspondiente.
 * 
 * @isFormValid Si es valido el formulario.
 * @tabRequired El tab al que pertence el formulario
 */
export interface ValidacionFormularios {
    isFormValid: boolean;
    isGuardForm: boolean;
    tabRequired: number
}