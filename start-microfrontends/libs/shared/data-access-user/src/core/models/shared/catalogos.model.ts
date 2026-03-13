

/**
 * Representa la respuesta de un catálogo básico.
 */
export interface CatalogoResponse {
  /** Identificador único del catálogo. */
  id: number;
  /** Descripción del catálogo. */
  descripcion: string;
}

/**
 * Representa una respuesta en formato JSON con datos adicionales.
 */
export interface JSONResponse {
  /** Identificador único del elemento. */
  id: number;
  /** Descripción del elemento. */
  descripcion: string;
  /** Código asociado al elemento. */
  codigo: string;
  /** Datos adicionales en formato string. */
  data: string;
  /** Datos adicionales en formato JSON. */
  datos?: Array<unknown>;
  /** Mensaje en formato string. */
  mensaje?: string;
  /** Error en formato string. */
  error?: string;
}

/**
 * Representa la respuesta de un conjunto de catálogos.
 */
export interface RespuestaCatalogos {
  /** Código de estado de la respuesta. */
  code: number;
  /** Lista de catálogos incluidos en la respuesta. */
  data: Catalogo[];
  /** Mensaje asociado a la respuesta. */
  message: string;
  datos: any; 
}

export interface ApiResponse<T> {
  codigo: string;
  mensaje: string;
  datos: T[];
}

/**
 * Representa un catálogo genérico utilizado en el sistema.
 *
 * @interface Catalogo
 *
 * @property {number} id - Identificador único del catálogo.
 * @property {string} descripcion - Descripción del catálogo.
 * @property {string} [clave] - Clave opcional asociada al catálogo pais.
 * @property {number} [relacionadaUmtId] - Identificador opcional relacionado con una unidad de medida y tipo (UMT).
 * @property {number} [relacionadaAcotacionId] - Identificador opcional relacionado con una acotación específica.
 */
export interface Catalogo {
  /** Identificador único del catálogo. */
  id: number;
  /** Descripción del catálogo. */
  descripcion: string;
  /** Clave opcional del catálogo. */
  clave?: string;
  /** Tamaño opcional del catálogo. */
  relacionadaUmtId?: number;
  /** Identificador relacionado con acotación opcional. */
  relacionadaAcotacionId?: number;
  /** Decripcion del titulo del select, cuando se requiera. */
  title?: string;
  /** Decripcion del titulo del bloque, cuando se requiera. */
  bloque?: string;
  /** Descripción del NICO, cuando se requiera. */
  nicoDescription?: string;
  /** Clave de la unidad de medida, cuando se requiera. */
  cve_unidad_medida?: string;
  /** Nombre del catálogo, cuando se requiera. */
  nombre?: string;

}

export interface CatalogoLista {
  /**
   * Lista de catálogos.
   * 
   * @property {Catalogo[]} datos
   * Array que contiene los elementos del catálogo
   */
  codigo: string;
  mensaje: string;
  datos: Catalogo[];
}


/**
 * Representa la estructura de una respuesta JSON que contiene datos de catálogo.
 *
 * @property codigo - El código de respuesta que indica el estado de la solicitud.
 * @property datos - Un arreglo de objetos `Catalogo` que contiene los datos del catálogo.
 * @property mensaje - Un mensaje que proporciona información adicional sobre la respuesta.
 */
export interface JsonResponseCatalogo {
  codigo: string
  datos: Catalogo[]
  mensaje: string
}

/**
 * Representa un catálogo de documentos que extiende las propiedades de un catálogo genérico.
 *
 * @interface CatalogoDocumento
 * @extends {Catalogo}
 *
 * @property {string} [tam] - Tamaño del documento, especificado como una cadena de texto.
 * @property {string} [dpi] - Resolución del documento en puntos por pulgada (DPI).
 * @property {boolean} [nuevo] - Indica si el documento es nuevo.
 * @property {string} [uniqueId] - Identificador único del documento.
 * @property {CatalogoDocumento[]} [adicionales] - Lista de documentos adicionales relacionados.
 * @property {boolean} [cargado] - Indica si el documento ha sido cargado.
 */
export interface CatalogoDocumento extends Catalogo {
  tam?: string;
  dpi?: string;
  nuevo?: boolean;
  uniqueId?: string;
  adicionales?: CatalogoDocumento[];
  cargado?: boolean;
}

/**
 * Representa la respuesta de un catálogo de países.
 * @property {CatalogoPaises[]} datos - Lista de países.
 */
export interface CatalogoPaisesResponse {
  datos: CatalogoPaises[];
}

/**
 * Representa un catálogo de países.
 */
export interface CatalogoPaises {
  /** Identificador único del país. */
  clave: number;
  /** Código ISO del país. */
  codigoIso?: string;

  /** Descripcion del país. */
  descripcion: string;

  /** Nombre del país. */
  /**
   * @deprecated La propiedad 'nombre' está obsoleta, utiliza 'descripcion' en su lugar.
   */
  nombre?: string;
  /** Clave del país. */
  /**
   * @deprecated La propiedad 'id' está obsoleta, utiliza 'clave' en su lugar.
   */
  id?: number;
}

/**
 * Representa un encabezado de tabla para un acuse.
 */
export interface HeaderTablaAcuse {
  /** Clave que corresponde a una propiedad de BodyTablaAcuse. */
  key: keyof BodyTablaAcuse;
  /** Valor asociado al encabezado. */
  valor: string;
}

/**
 * Representa el cuerpo de una tabla de acuse.
 */
export interface BodyTablaAcuse {
  /** Identificador único del acuse. */
  id: number;
  /** Identificador del documento asociado. */
  idDocumento: string;
  /** Nombre del documento. */
  documento: string;
  /** URL del PDF asociado al documento. */
  urlPdf: string;
}

/**
 * Representa la respuesta de documentos requeridos.
 */
export interface RespuestaDocuemntosRequeridos {
  /** Identificador único del documento requerido. */
  id: number;
  /** Indica si el documento es requerido. */
  requerido: boolean;
  /** Tipo de documento requerido. */
  tipoDocumento: string;
  /** Nombre del archivo asociado al documento. */
  nombreArchivo: string;
  /** Estatus del documento requerido. */
  estatus: string;
}

export interface CatalogoTipoDocumento {
  /**
   * Identificador único del documento.
   */
  id: number;
  /**
   * Descripción del documento.
   */
  description: string;
}
/**
 * @descripcion
 * Representa el detalle de un procedimiento, incluyendo su identificador, título y la información del botón inferior.
 * @interface ProcedureDetalle
 */
export interface ProcedureDetalle {
  /** Identificador del procedimiento */
  procedure: number;
  /** Título del procedimiento */
  titulo: string;
  /** Información del botón inferior */
  botonInferior?: BotonInferior;
  /** Lista de identificadores de documentos asociados al procedimiento. */
  documento?: number[];
}

/**
 * @descripcion
 * Representa la información de un botón inferior, incluyendo su título y su identificador.
 * @interface BotonInferior
 */
export interface BotonInferior {
  /** Título del botón */
  titulo: string;
  /** Identificador del botón */
  url?: string;
}

/**
 * @descripcion
 * Representa la información de un acuse de resoluciones, incluyendo el identificador del documento oficial, la descripción y el nombre del documento en MinIO.
 * @interface AcuseResoluciones
 */
export interface AcuseResoluciones {
  /** Identificador del documento oficial */
  id_documento_oficial: number;
  /** Descripción del documento */
  desc_documento: string;
  /** Nombre del documento en MinIO */
  documento_minio: string;
}

/**
 * @descripcion
 * Representa la respuesta de acuses de resoluciones, incluyendo la lista de acuses y documentos oficiales.
 * @interface AcuseResolucionesResponse
 */
export interface AcuseResolucionesResponse {
  /** Lista de acuses de resoluciones */
  acuses: AcuseResoluciones[];
  /** Lista de documentos oficiales */
  documentos_oficiales: AcuseResoluciones[];
}
/**
 * @descripcion
 * Representa la respuesta al guardar un acuse, incluyendo el nombre y el identificador del documento generado.
 * @interface AcuseGuardarResponse
 */
export interface AcuseGuardarResponse {
  /** Nombre del documento generado */
  nombre_documento: string;
  /** Identificador único del documento generado */
  identificador_documento: number;
}

/**
 * Representa la respuesta al abrir la razón social de una empresa.
 */
export interface AbrirRazonSocialResponse {
  codigo: string;
  datos: {
    razon_social: string;
  };
}