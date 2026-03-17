/**
 * Representa los datos de la tabla de avisos.
 */
export interface AvisoTablaDatos {
  /**
   * Lista de avisos en la tabla.
   */
  datos: AvisoTabla[];
}
/**
 * Representa un aviso en la tabla de avisos.
 */
export interface AvisoTabla {
  id: number;
  rfc: string;
  nombreComercial: string;
  claveEntidadFederativa: string;
  claveDelegacionMunicipio: string;
  claveColonia: string;
  descripcionEntidadFederativa?: string;
  descripcionDelegacionMunicipio?: string;
  descripcionColonia?: string;
}
/**
 * Representa una lista de elementos de un catálogo.
 */
export interface CatalogoLista {
  /**
   * Lista de elementos del catálogo.
   */
  datos: Catalogo[];
}
/**
 * Modelos utilizados en el trámite 32503.
 * 
 * Este archivo contiene las interfaces que definen las estructuras de datos utilizadas
 * en el trámite de aviso de traslado, incluyendo catálogos, datos del solicitante,
 * tablas de avisos, tablas de mercancías, formularios y documentos.
 */

/**
 * Representa un elemento de un catálogo.
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

  clave: string;
}
/**
 * Representa los datos generales del solicitante.
 */
export interface DatosSolicitante {
  rfc: string;
  denominacion: string;
  actividadEconomica: string;
  correoElectronico: string;
  pais: string;
  codigoPostal: string;
  entidadFederativa: string;
  municipio: string;
  localidad: string;
  colonia: string;
  calle: string;
  nExt: string;
  nInt: string;
  lada: string;
  telefono: string;
  adace: string;
}
/**
 * Representa los datos de la tabla de mercancías.
 */
export interface MercanciaTablaDatos {
  /**
   * Lista de mercancías en la tabla.
   */
  datos: MercanciaTabla[];
}
/**
 * Representa una mercancía en la tabla de mercancías.
 */
export interface MercanciaTabla {
  id: number;
  claveFraccionArancelaria: string;
  nico: string;
  cantidad: string;
  claveUnidadMedida: string;
  valorUSD: string;
  numPedimentoExportacion: string;
  numPedimentoImportacion: string;
  // Descripciones para mostrar en la tabla
  descripcionFraccionArancelaria?: string;
  descripcionUnidadMedida?: string;
}
/**
 * Representa una acción de un botón en el wizard.
 */
export interface AccionBoton {
  /**
   * Acción realizada por el botón (e.g., "cont" para continuar, "atras" para retroceder).
   */
  accion: string;

  /**
   * Valor asociado a la acción (e.g., índice del paso en el wizard).
   */
  valor: number;
}
/**
 * Representa un tipo de documento.
 */
export interface TipoDocumento {
  id: number;
  descripcion: string;
  controlarCaja: boolean;
}
/**
 * Representa el formulario de una mercancía.
 */
export interface MercanciaFormulario {
  claveFraccionArancelaria: string;
  nico: string;
  cantidad: string;
  claveUnidadMedida: string;
  valorUSD: string;
  descripcionMercancia: string;
  descripcionProceso: string;
  numPedimentoExportacion: string;
  numPedimentoImportacion: string;
}
/**
 * Representa el formulario de un domicilio.
 */
export interface DomicilioFormulario {
  nombreComercial: string;
  claveEntidadFederativa: string;
  claveDelegacionMunicipio: string;
  claveColonia: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  codigoPostal: string;
  rfc: string;
}
/**
 * Representa el formulario de un aviso.
 */
export interface AvisoFormulario {
  adace: string;
  valorProgramaImmex: string;
  valorAnioProgramaImmex: string;
  tipoAviso: string;
  tieneIdTransaccionVucem: string;
  idTransaccion: string;
  motivoProrroga: string;
  fechaTranslado: string;
  nombreComercial: string;
  claveEntidadFederativa: string;
  claveDelegacionMunicipio: string;
  claveColonia: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  codigoPostal: string;
  tipoCarga: string;
}
/**
 * Representa un archivo de documentos.
 */
export interface ArchivoDocumentos {
  nombreDelArchivo: string;
  tamano: number;
  resolucion: string;
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
 * Contiene información sobre el formulario de aviso y la tabla de datos.
 */
export interface ConsultaDatos {
  avisoFormulario: AvisoFormulario;
  tablaDeDatos: AvisoTabla[]
}


/**
 * Representa los datos de ADACE.
 * @interface AdaceDatos
 * @property {string} adace - Valor de ADACE obtenido del servicio.
 */
export interface AdaceDatos {
  adace: string;
}