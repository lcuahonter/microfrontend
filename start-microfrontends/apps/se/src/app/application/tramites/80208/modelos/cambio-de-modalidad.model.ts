import { Catalogo } from "@libs/shared/data-access-user/src";
import { EmpresaNacional } from "../../../shared/models/modelo-interface.model";

/**
 * @interface CambioDeModalidadForm
 * @description
 * Representa el formulario para el cambio de modalidad.
 *
 */
export interface CambioDeModalidadForm {
  /**
   * Mensaje descriptivo del resultado de la operación.
   * @property {string} seleccionaLaModalidad - Modalidad seleccionada.
   */
    seleccionaLaModalidad: string;
    /** 
     * Folio del trámite.
     * @property {number} folio - Número de folio.
     */
    folio: number;
    /** 
     * Año del trámite.
     * @property {number} ano - Año del trámite.
     */
    ano: number;
    /** 
     * Modalidad seleccionada para el cambio.
     * @property {string} seleccionaModalidad - Modalidad seleccionada.
     */
    seleccionaModalidad: string;
    /** 
     * Modalidad de cambio.
     * @property {string} cambioModalidad - Modalidad de cambio.
     */
    cambioModalidad: string;
}

/**
 * @interface CambioModalidad
 * @description
 * Representa una modalidad de cambio.
 *
 */
export interface CambioModalidad {
  /**
   * Identificador único de la modalidad.
   * @property {number} id - Identificador único de la modalidad.
   */
  id: number;
  /**
   * Clave de la modalidad.
   * @property {number} clave - Clave de la modalidad.
   */
  clave: number;
  /**
   * Descripción de la modalidad.
   * @property {string} descripcion - Descripción de la modalidad.
   */
  descripcion: string;
}
export interface ServicioInmex {
    /**
     * Nombre del servicio asociado.
     */
    servicio?: string;
  
    /**
     * Registro de contribuyentes relacionado.
     */
    registroContribuyentes?: string;
  
    /**
     * Denominación social de la empresa.
     */
    denominacionSocial?: string;
  
    /**
     * Número del programa IMMEX.
     */
    numeroIMMEX?: string;
  
    /**
     * Año de inicio del programa IMMEX.
     */
    anoIMMEX?: string;
  }

/**
 * @interface CambioModalidadResponse
 * @description
 * Representa la respuesta de la API para las modalidades de cambio.
 *
 */
export interface CambioModalidadResponse {
  /**
   * Código de respuesta de la API.
   * @property {string} codigo - Código de respuesta de la API.
   */
  codigo: string;
  /** 
   * Mensaje descriptivo de la respuesta.
   * @property {string} mensaje - Mensaje descriptivo de la respuesta.
   */
  mensaje: string;
  /** 
   * Lista de modalidades de cambio.
   * @property {CambioModalidad[]} datos - Lista de modalidades de cambio.
   */
  datos: CambioModalidad[];
}

/**
 * Representa la respuesta de un conjunto de catálogos.
 */
export interface RespuestaCatalogos {
  /**
   * Código de respuesta del servidor.
   * @property {string} codigo - Código de respuesta del servidor.
   */
  codigo: string;
  /**
   * Mensaje descriptivo de la respuesta.
   * @property {string} mensaje - Mensaje descriptivo de la respuesta.
   */
  mensaje: string;
  /** 
   * Datos de los catálogos.
   * @property {Catalogo[]} datos - Datos de los catálogos.
   */
  datos: Catalogo[];
}

/**
 * @const CONFIGURACION_SERVICIO
 * @description
 * Configuración de las columnas para la tabla de servicios.
 *
 */
export const CONFIGURACION_SERVICIO = [
  /**
   * Título de la columna.
   * @property {string} encabezado - Título de la columna.
   * @property {function} clave - Función que devuelve el valor de la columna para cada fila.
   * @property {number} orden - Orden de la columna en la tabla.
   */
    {
        encabezado: 'Descripción del servicio',
        clave: (ele: ServicioInfo): string | undefined => ele.descripcion,
        orden: 1
    },
    /**
     * Título de la columna.
     * @property {string} encabezado - Título de la columna.
     * @property {function} clave - Función que devuelve el valor de la columna para cada fila.
     * @property {number} orden - Orden de la columna en la tabla.
     */
    {
        encabezado: 'Tipo de servicio',
        clave: (ele: ServicioInfo): string | undefined => ele.descripcionTipo,
        orden: 2
    },
]

/**
 * @interface ServicioInfo
 * @description
 * Representa la información de un servicio.
 *
 */
export interface ServicioInfo {
  /**
   * Identificador único del servicio.
   * @property {string} idServicio - Identificador único del servicio.
   */
  idServicio: string;
  /**
   * Descripción del servicio.
   * @property {string} descripcion - Descripción del servicio.
   */
  descripcion: string;
  /**
   * Tipo de servicio.
   * @property {string} tipoServicio - Tipo de servicio.
   */
  tipoServicio: string;
  /**
   * Descripción del tipo de servicio.
   * @property {string} descripcionTipo - Descripción del tipo de servicio.
   */
  descripcionTipo: string;
  /**
   * Clave del servicio.
   * @property {string} claveServicio - Clave del servicio.
   */
  claveServicio: string;
    testado?: boolean;
}

/**
 * @interface ConfiguracionColumna<T>
 * @description
 * Representa la configuración de una columna en una tabla.
 */
export interface ConfiguracionColumna<T> {
  /**
   * Título de la columna.
   * @property {string} encabezado - Título de la columna.
   * @property {function} clave - Función que devuelve el valor de la columna para cada fila.
   * @property {number} orden - Orden de la columna en la tabla.
   */
    encabezado: string; // Título de la columna
    clave: (ele: T) => string | number | undefined | boolean; // Función que devuelve el valor de la columna para cada fila
    orden: number; // Orden de la columna en la tabla
}

/**
 * @interface ServiciosState
 * @description
 * Representa el estado relacionado con los servicios en el cambio de modalidad.
 *
 */
export interface ServiciosState {
  /**
   * Datos del formulario de cambio de modalidad.
   * @property {CambioDeModalidadForm} combioDeModalidaDatos - Datos del formulario de cambio de modalidad.
   */
  combioDeModalidaDatos: CambioDeModalidadForm;
  /**
   * Respuesta de la API con las modalidades de cambio.
   * @property {CambioModalidadResponse} cambioModalidad - Respuesta de la API con las modalidades de cambio.
   */
  cambioModalidad: CambioModalidadResponse;
  /**
   * Información adicional de servicios IMMEX.
   * @property {string} serviciosImmx - Información adicional de servicios IMMEX.
   */
  serviciosImmx: string;
}
/**
 * Interfaz que define la estructura de la respuesta de una operación de cambio de modalidad.
 * @interface RespuestaCambioModalidad
 * @description Representa la respuesta de una operación de cambio de modalidad, incluyendo el código de respuesta,
 * el mensaje descriptivo y los datos adicionales relacionados con la solicitud.
 */
export const CONFIGURACION_DOMICILIOS = [
  /**
   * Título de la columna.
   * @property {string} encabezado - Título de la columna.
   * @property {function} clave - Función que devuelve el valor de la columna para cada fila.
   * @property {number} orden - Orden de la columna en la tabla.
   */
  {
    encabezado: 'Servicio',
    clave: (ele: EmpresaNacional): string => ele.descripcionServicio,
    orden: 1,
  },
  /**
   * Título de la columna.
   * @property {string} encabezado - Título de la columna.
   * @property {function} clave - Función que devuelve el valor de la columna para cada fila.
   * @property {number} orden - Orden de la columna en la tabla.
   */
  {
    encabezado: 'Registro federal de contribuyentes',
    clave: (ele: EmpresaNacional): string => ele.rfc,
    orden: 2,
  },
  /**
   * Título de la columna.
   * @property {string} encabezado - Título de la columna.
   * @property {function} clave - Función que devuelve el valor de la columna para cada fila.
   * @property {number} orden - Orden de la columna en la tabla.
   */
  {
    encabezado: 'Denominación o razón social',
    clave: (ele: EmpresaNacional): string => ele.razonSocial,
    orden: 3,
  },
  /**
   * Título de la columna.
   * @property {string} encabezado - Título de la columna.
   * @property {function} clave - Función que devuelve el valor de la columna para cada fila.
   * @property {number} orden - Orden de la columna en la tabla.
   */
  {
    encabezado: 'Número del programa IMMEX',
    clave: (ele: EmpresaNacional): string => ele.numeroPrograma,
    orden: 4,
  },
  /**
   * Título de la columna.
   * @property {string} encabezado - Título de la columna.
   * @property {function} clave - Función que devuelve el valor de la columna para cada fila.
   * @property {number} orden - Orden de la columna en la tabla.
   */
  {
    encabezado: 'Año del programa IMMEX',
    clave: (ele: EmpresaNacional): string => ele.tiempoPrograma,
    orden: 5,
  },
];