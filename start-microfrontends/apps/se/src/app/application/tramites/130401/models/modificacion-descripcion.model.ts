/**
 * Representa una acción de un botón.
 * 
 * Contiene información sobre la acción que se debe realizar y el valor asociado.
 */
export interface AccionBoton {
  /**
   * Acción que se debe realizar (e.g., "guardar", "eliminar").
   */
  accion: string;

  /**
   * Valor asociado a la acción (e.g., identificador del elemento).
   */
  valor: number;
}

/**
 * Representa una lista de elementos de un catálogo.
 * 
 * Contiene un array de elementos del catálogo.
 */
export interface CatalogoLista {
  /**
   * Lista de elementos del catálogo.
   */
  datos: Catalogo[];
}

/**
 * Representa un elemento de un catálogo.
 * 
 * Contiene información básica como el identificador y la descripción.
 */
export interface Catalogo {
  /**
   * Identificador único del elemento del catálogo.
   */
  id: number;

  /**
   * Descripción del elemento del catálogo.
   */
  descripcion: string;
}

/**
 * Representa los datos de una solicitud.
 * 
 * Contiene información detallada sobre la solicitud, como el número de folio, régimen, mercancías, entre otros.
 */
export interface DatosSolicitud {
  numeroFolioTramiteOriginal: string;
  numeroFolioResolucion: string;
  tramite: {
    solicitud: boolean;
  };
  mercancia: string;
  tipoSolicitudPexim: string;
  mercanciaResponseDto:{
    tipoSolicitudPexim:string;
    regimen: string;
    clasificacionRegimen: string;
    condicionMercancia: string;
    descripcion:string;
    fraccionArancelaria: string;
    unidadMedidaTarifaria: string;
    unidadesAutorizadas: string;
    importeFacturaAutorizadoUSD: string;
  }
  solicitud: string;
  clasificacionRegimen: string;
  condicionMercancia: string;
  mercanciaDescripcion: string;
  fraccionArancelaria: string; 
  unidadMedidaTarifaria: string; 
  unidadesAutorizadas: string;
  importeFacturaAutorizadoUSD: string;
  usoEspecifico: string;
  justificacionImportacionExportacion: string;
  observaciones: string;
  representacionFederal: string;
  paises: string;
  partidasMercancia?: SolicitudTablaDatos[]; 
  modificationDescripcion?: Mercancia; 
  partidasModificationDescripcion?: MercanciaTablaDatos[]; 
}

/**
 * Representa los datos de una tabla de solicitudes.
 * 
 * Contiene información como cantidad, descripción, precio unitario y total en USD.
 */
export interface SolicitudTablaDatos {
  idPartidaSol: number;
  unidadesAutorizadas: string;
  descripcionAutorizada: string;
  importeUnitarioUSDAutorizado: string;
  importeTotalUSDAutorizado: string;
}

/**
 * Representa una lista de partidas.
 * 
 * Contiene un array de datos de la tabla de solicitudes.
 */
export interface PartidasLista {
  /**
   * Lista de datos de la tabla de solicitudes.
   */
  datos: SolicitudTablaDatos[];
}

/**
 * Representa los datos de una arancelaria.
 * 
 * Contiene información como el identificador, fracción arancelaria y descripción.
 */
export interface DatosArancelaria {
  id: number;
  fraccionArancelaria: string;
  descripcion: string;
}

/**
 * Representa una lista de arancelarias.
 * 
 * Contiene un array de datos de arancelarias.
 */
export interface ArancelariaLista {
  /**
   * Lista de datos de arancelarias.
   */
  datos: DatosArancelaria[];
}

/**
 * Representa una solicitud.
 * 
 * Contiene información detallada sobre la solicitud, como el número de folio, régimen, mercancías, entre otros.
 */
export interface Solicitud {
  numeroFolioTramiteOriginal: string;
  numeroFolioResolucion: string;
  tramite: {
    solicitud: boolean;
  };
  mercancia: string;
  mercanciaResponseDto:{
    descripcion:string;
    valorFacturaUSD: string;
  };
  solicitud: string;
  regimen: string;
  clasificacionRegimen: string;
  condicionMercancia: string;
  mercanciaDescripcion: string;
  fraccionArancelaria: string;
  unidadMedidaComercial: string;
  unidadesAutorizadas: string;
  importeFacturaAutorizadoUSD: string;
  usoEspecifico: string;
  justificacionImportacionExportacion: string;
  observaciones: string;
  representacionFederal: string;
}

/**
 * Representa una lista de solicitudes.
 * 
 * Contiene un array de datos de solicitudes.
 */
export interface SolicitudLista {
  /**
   * Lista de datos de solicitudes.
   */
  datos: Solicitud;
}

/**
 * Representa una mercancía.
 * 
 * Contiene información sobre la mercancía, como el número de folio, cantidad, descripción y modificaciones.
 */
export interface Mercancia {
  numeroFolioResolucion: string;
  cantidadLibreMercancia: string;
  descripcion: string;
  descripcionNuevaMercanciaPexim: string;
}

/**
 * Representa una lista de mercancías.
 * 
 * Contiene un array de datos de mercancías.
 */
export interface MercanciaLista {
  /**
   * Lista de datos de mercancías.
   */
  datos: Mercancia;
}

/**
 * Representa los datos de una tabla de mercancías.
 * 
 * Contiene información como cantidad, descripción autorizada, descripción solicitada, precio unitario y total en USD.
 */
export interface MercanciaTablaDatos {
  idPartidaSol: number;
  unidadesAutorizadas: string;
  descripcionAutorizada: string;
  descripcionSolicitada: string;
  importeUnitarioUSDAutorizado: string;
  importeTotalUSDAutorizado: string;
}

/**
 * Representa una lista de datos de la tabla de mercancías.
 * 
 * Contiene un array de datos de la tabla de mercancías.
 */
export interface MercanciaTablaLista {
  /**
   * Lista de datos de la tabla de mercancías.
   */
  datos: MercanciaTablaDatos[];
}
/**
 * Representa la respuesta de una consulta.
 * 
 * Contiene información sobre el éxito de la operación, los datos obtenidos y un mensaje relacionado.
 */
export interface RespuestaConsulta {
  success: boolean;
  datos: ConsultaDatos;
  message: string;
}
/**
 * Representa los datos obtenidos de una consulta.
 * 
 * Contiene información sobre la solicitud, la mercancía y los datos de la tabla de mercancías.
 */
export interface ConsultaDatos {
  datosSolicitud: DatosSolicitud;
  mercancia: Mercancia;
  mercanciaTablaDatos: MercanciaTablaDatos[];
}