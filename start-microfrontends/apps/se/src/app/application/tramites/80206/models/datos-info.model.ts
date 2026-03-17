/**
 * Este archivo define las interfaces utilizadas en el módulo de ampliación de servicios.
 * Proporciona estructuras de datos para sectores, fracciones arancelarias, importaciones, respuestas de API y otros modelos relacionados.
 * 
 * Este archivo contiene las definiciones de las interfaces necesarias para manejar los datos relacionados con sectores, fracciones arancelarias,
 * importaciones, servicios y respuestas de API en el módulo de ampliación de servicios.
 */

/**
 * Interfaz que representa un sector.
 */
export interface Sector {
  clave?: string;
  /**
   * Descripción detallada del sector.
   */
  descripcion?: string;
}

/**
 * Interfaz que representa una fracción arancelaria.
 */
export interface Arancelaria {
  /**
   * Número de fracción.
   */
  fraccion: string;

  /**
   * Fracción arancelaria.
   */
  fraccionArancelaria: string;

  /**
   * Descripción comercial de la fracción.
   */
  descripcionComercial?: string;

  /**
   * Información del Anexo II.
   */
  anexoII: string;

  /**
   * Tipo de fracción.
   */
  tipo: string;

  /**
   * Unidad de medida de la fracción.
   */
  umt: string;

  /**
   * Categoría de la fracción.
   */
  categoria: string;

  /**
   * Valor mensual de la fracción.
   */
  valorMensual: string;

  /**
   * Valor anual de la fracción.
   */
  valorAnual: string;

  /**
   * Volumen mensual de la fracción.
   */
  volumenrMensual: string;

  /**
   * Volumen anual de la fracción.
   */
  volumenAnual: string;
}

/**
 * Interfaz que representa una fracción arancelaria de importación.
 */
export interface ArancelariaImportacion {
  /**
   * Número de fracción.
   */
  fraccion: string;

  /**
   * Fracción arancelaria del producto de exportación.
   */
  fraccionArancelaria: string;

  /**
   * Fracción arancelaria de la mercancía de importación.
   */
  fraccionArancelariaImportacion: string;

  /**
   * Descripción comercial de la mercancía de importación.
   */
  descripcionComercialImportacion: string;

  /**
   * Descripción Fraccion Arancelaria.
   */
  descripcionFraccionPadre: string;

  /**
   * Información del Anexo II.
   */
  anexoII: string;

  /**
   * Tipo de fracción.
   */
  tipo: string;

  /**
   * Unidad de medida de la fracción.
   */
  umt: string;

  /**
   * Categoría de la fracción.
   */
  categoria: string;

  /**
   * Valor mensual de la fracción.
   */
  valorMensual: string;

  /**
   * Valor anual de la fracción.
   */
  valorAnual: string;

  /**
   * Volumen mensual de la fracción.
   */
  volumenrMensual: string;

  /**
   * Volumen anual de la fracción.
   */
  volumenAnual: string;
}

/**
 * Interfaz que representa la respuesta de datos de una API.
 */
export interface DatosResponse {
  /**
   * Código de respuesta.
   */
  code: number;

  /**
   * Datos de la respuesta.
   */
  data: {
    /**
     * Identificador del subfabricante.
     */
    idsubmanufacturer: string;

    /**
     * Información de los servicios.
     */
    infoServicios: {
      seleccionaLaModalidad: string;
      folio: string;
      ano: string;
    };
  };
}

/**
 * Interfaz que representa la información de los servicios.
 */
export interface InfoServicios {
  /**
   * Modalidad seleccionada.
   */
  seleccionaLaModalidad: string;

  /**
   * Folio del servicio.
   */
  folio: string;

  /**
   * Año del servicio.
   */
  ano: string;
}

/**
 * Interfaz que representa los servicios.
 */
export interface Servicios {
  /**
   * Modalidad seleccionada.
   */
  seleccionaLaModalidad: string;

  /**
   * Folio del servicio.
   */
  folio: string;

  /**
   * Año del servicio.
   */
  ano: string;
}

/**
 * Interfaz que representa los datos de respuesta de una API.
 */
export interface ResponseData {
  /**
   * Identificador del subfabricante.
   */
  idsubmanufacturer: string;

  /**
   * Información de los servicios.
   */
  infoServicios: InfoServicios;
}

/**
 * Interfaz que representa la respuesta de una API.
 */
export interface ApiResponse {
  /**
   * Código de respuesta.
   */
  code: number;

  /**
   * Datos de la respuesta.
   */
  data: ResponseData;

  /**
   * Información de los servicios.
   */
  infoServicios: InfoServicios;
}

/**
 * Interfaz que representa una acción de un botón.
 */
export interface AccionBoton {
  /**
   * Acción del botón.
   */
  accion: string;

  /**
   * Valor asociado a la acción.
   */
  valor: number;
}

/**
 * Payload para la búsqueda de información relacionada con trámites.
 */
export interface BuscarPayload {
      fraccion: string,
      tipoSolicitud:number
}
/**
 * Representa la información de una fracción arancelaria para importación.
 * 
 */
export interface FraccionArancelariaImportacion{
  fraccion?: string,
  fraccionPadre?: string,
  tipoSolicitud?: string,
  idPrograma?: string,
  idSolicitud?: string,
  idProductoPadre?: string

}
/**
 * Interface for API fraccion arancelaria response data
 */
export interface FraccionArancelariaApiResponse {
  fraccionPadre?: string | null;
  descripcionFraccionPadre?: string | null;
  tipoFraccion?: string;
  exenta?: string | null;
  fraccionCompuesta?: string | null;
  claveFraccionPadre?: string | null;
  unidadMedida?: string;
  fraccionConcatenada?: string | null;
  descripcionTestado?: string | null;
  testado?: boolean;
  tipoOperacion?: string;
  valorMonedaMensual?: number | null;
  valorMonedaAnual?: number | null;
  valorProduccionMensual?: number | null;
  valorProduccionAnual?: number | null;
  valorProduccionAnualSolicitada?: number | null;
  claveCategoria?: string | null;
  descripcionCategoria?: string | null;
  mensaje?: string | null;
  descripcionUsuario?: string;
  umt?: string;
  idFraccion?: string | null;
  idProducto?: string | null;
  idProductoPadre?: string | null;
  claveProductoExportacion?: string | null;
  descripcionServicio?: string | null;
  rowID?: string | null;
  cveFraccion?: string;
  capitulo?: string;
  partida?: string;
  subPartida?: string;
  descripcion?: string;
  fechaCaptura?: string;
  fechaInicioVigencia?: string;
  fechaFinVigencia?: string | null;
  cveUsuario?: string;
  cveCapituloFraccion?: string | null;
  cvePartidaFraccion?: string | null;
  cveSubPartidaFraccion?: string | null;
  activo?: boolean;
  activoAnexo28?: boolean | null;
  decretoImmex?: string | null;
  sector?: string | null;
  cveServicioImmex?: string | null;
  listaProveedores?: unknown[] | null;
  listaProyecto?: unknown[] | null;
  nicoDtos?: unknown[] | null;
}