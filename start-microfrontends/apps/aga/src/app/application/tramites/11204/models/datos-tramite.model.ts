/**
 * Interfaz que representa una aduana.
 * Utilizamos esta interfaz para definir la estructura de los datos de una aduana.
 */
export interface Aduanas {
  /**
   * Descripción de la aduana.
   */
  descripcion: string;

  /**
   * Identificador de la aduana.
   */
  id: number;
}

/**
 * Interfaz que representa un contenedor.
 * Utilizamos esta interfaz para definir la estructura de los datos de un contenedor.
 */
export interface Contenedores {
  /**
   * Tipo de contenedor.
   */
  tipo: string;

  /**
   * Identificador del contenedor.
   */
  id: string;
}

/**
 * Interfaz que representa los datos de un contenedor.
 * Utilizamos esta interfaz para definir la estructura de los datos detallados de un contenedor.
 */
export interface DatosDelContenedor {
  /**
   * Identificador del contenedor.
   */
  id: number;

  /**
   * Iniciales del equipo.
   */
  iniciales_contenedor: string;

  /**
   * Número del equipo.
   */
  numero_contenedor: number;

  /**
   * Dígito verificador del equipo.
   */
  digito_verificador: number;

  /**
   * Tipo de equipo.
   */
  tipo_contenedor: string;

  /**
   * Identificador de la aduana.
   */
  aduana: number;

  /**
   * Fecha de ingreso del equipo.
   */
  fecha_ingreso: string;

  /**
   * Vigencia del equipo.
   */
  vigencia: string;

  /**
   * Estado actual del equipo o contenedor.
   */
  estado: string;

  /**
   * Indica si el equipo o contenedor existe en el sistema.
   */
  existe: string;

  /**
   * Indica si se puede registrar el contenedor.
   */
  puede_registrar: string;
  /**
   * Indica si existe en VUCEM.
   */
  existe_en_vucem: string;
  
}

/**
 * Interfaz que representa los datos de un csv.
 * Utilizamos esta interfaz para definir la estructura de los datos detallados de un contenedor.
 */
export interface DatosDelCsvArchivo {
  /**
   * Identificador del contenedor.
   */
  id: number;

  /**
   * Iniciales del equipo.
   */
  iniciales_contenedor: string;

  /**
   * Número del equipo.
   */
  numero_contenedor: number;

  /**
   * Dígito verificador del equipo.
   */
  digito_verificador: number;

  /**
   * Tipo de equipo.
   */
  tipo_contenedor: string;

  /**
   * Identificador de la aduana.
   */
  aduana: number;

  /**
   * Fecha de ingreso del equipo.
   */
  fecha_ingreso: string;

  /**
   * Vigencia del equipo.
   */
  vigencia: string;

  
  /**
   * Estado actual del equipo o contenedor.
   */
  estado: string;

  /**
   * Indica si el equipo o contenedor existe en el sistema.
   */
  existe: string;

    /**
   * Indica si se puede registrar el contenedor.
   */
  puede_registrar: string;
  /**
   * Indica si existe en VUCEM.
   */
  existe_en_vucem: string;

}

/**
 * Interfaz que representa la respuesta de una operación relacionada con un contenedor.
 * Utilizamos esta interfaz para definir la estructura de la respuesta de una operación que involucra un contenedor.
 */
export interface RespuestaContenedor {
  /**
   * Indica si la operación fue exitosa.
   */
  success: boolean;

  /**
   * Datos del contenedor.
   */
  datos: DatosDelContenedor;

  /**
   * Mensaje de la respuesta.
   */
  message: string;
}

/**
 * Interfaz que representa una respuesta genérica de una API.
 * Utilizamos esta interfaz para definir la estructura de una respuesta genérica de una API.
 */
export interface RespuestaApi {
  /**
   * Indica si la operación fue exitosa.
   */
  success: boolean;

  /**
   * Mensaje de la respuesta.
   */
  message: string;
}

/**
 * Interfaz que representa la respuesta de una operación que devuelve un arreglo de contenedores.
 * Utilizamos esta interfaz para definir la estructura de la respuesta de una operación que involucra múltiples contenedores.
 */
export interface RespuestaContenedores {
  /**
   * Código de la respuesta.
   */
  code: number;

  /**
   * Arreglo de contenedores.
   */
  data: Contenedores[];

  /**
   * Mensaje de la respuesta.
   */
  message: string;
}

/**
 * Interfaz que representa la respuesta de una operación que devuelve un arreglo de aduanas.
 * Utilizamos esta interfaz para definir la estructura de la respuesta de una operación que involucra múltiples aduanas.
 */
export interface RespuestaAduanas {
  /**
   * Código de la respuesta.
   */
  code: number;

  /**
   * Arreglo de aduanas.
   */
  data: Aduanas[];

  /**
   * Mensaje de la respuesta.
   */
  message: string;
}

/**
 * Interfaz que representa la respuesta de una consulta.
 * Utilizada para definir la estructura de la respuesta al consultar datos generales del trámite.
 */
export interface RespuestaConsulta {
  /**
   * Indica si la operación fue exitosa.
   */
  success: boolean;

  /**
   * Datos generales obtenidos de la consulta.
   */
  datos: ConsultaDatos;

  /**
   * Mensaje de la respuesta.
   */
  message: string;
}

/**
 * Interfaz que representa los datos generales obtenidos de una consulta.
 * Incluye información relevante del trámite y los contenedores asociados.
 */
export interface ConsultaDatos {
  /**
   * Tipo de búsqueda realizada.
   */
  tipoBusqueda: string;

  /**
   * Aduana relacionada con la consulta.
   */
  aduana: string;

  /**
   * Fecha de ingreso registrada.
   */
  fechaIngreso: string;

  /**
   * Vigencia del trámite o contenedor.
   */
  vigencia: string;

  /**
   * Iniciales del contenedor.
   */
  inicialesContenedor: string;

  /**
   * Número del contenedor.
   */
  numeroContenedor: string;

  /**
   * Dígito de control del contenedor.
   */
  digitoDeControl: string;

  /**
   * Contenedores asociados.
   */
  contenedores: string;

  /**
   * Menú desplegable de aduanas.
   */
  aduanaMenuDesplegable: string;

  /**
   * Estado actual del trámite o contenedor.
   */
  estado: string;

  /**
   * Indica si existe en el sistema.
   */
  existe: string;

  /**
   * Detalle de los datos de los contenedores.
   */
  datosDelContenedor: DatosDelContenedor[];
}

/**
 * Interfaz que representa la respuesta de un catálogo.
 * Utilizada para definir la estructura de la respuesta al consultar catálogos relacionados con el trámite.
 */
export interface RespuestaCatalog {
  /**
   * Indica si la operación fue exitosa.
   */
  success: boolean;

  /**
   * Mensaje de la respuesta.
   */
  message: string;

  /**
   * Datos generales del catálogo consultado.
   */
  datos: {
    /**
     * Tipo de búsqueda realizada.
     */
    tipoBusqueda: string;

    /**
     * Aduana relacionada con la consulta.
     */
    aduana: number;

    /**
     * Fecha de ingreso registrada.
     */
    fechaIngreso: string;

    /**
     * Vigencia del trámite o contenedor.
     */
    vigencia: string;

    /**
     * Iniciales del contenedor.
     */
    inicialesContenedor: string;

    /**
     * Número del contenedor.
     */
    numeroContenedor: number;

    /**
     * Dígito de control del contenedor.
     */
    digitoDeControl: number;

    /**
     * Estado de la constancia.
     */
    estadoConstancia: string;

    /**
     * Indica si existe en VUCEM.
     */
    existeEnVUCEM: string;

    /**
     * Detalle de los datos de los contenedores asociados.
     */
    datosDelContenedor: DatosDelContenedor[];
  };
}