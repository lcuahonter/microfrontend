/**
 * Representa los datos de la tabla de Solicitud.
 */
export interface SolicitudTablaDatos {
  /**
   * Lista de Solicitud en la tabla.
   */
  datos: SolicitudTabla[];
}

/**
 * Representa un Solicitud en la tabla de Solicitud.
 */
export interface SolicitudTabla {
  /**
   * Identificador único del Solicitud.
   */
  id: number;

  /**
   * Marca del Solicitud.
   */
  marca: string;

  /**
   * Modelo del Solicitud.
   */
  modelo: string;

  /**
   * Número de serie del Solicitud.
   */
  numeroDeSerie: string;

  /**
   * Tipo del Solicitud.
   */
  tipo: string;

  /**
   * Descripción de la mercancía del Solicitud.
   */
  descripcionMercancia: string;

  /**
   * Especificación de la mercancía del Solicitud.
   */
  espeMercancia: string;

  /**
   * Número de parte de la mercancía del Solicitud.
   */
  numParteMercancia: string;

  
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
 * Modelos utilizados en el trámite 6403.
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

export interface SolicitudFormulario {
  /**
   * Clave de la aduana.
   */
  cveAduana: string;

  /**
   * Clave de la sección aduanal.
   */
  cveSeccionAduanal: string;

  /**
   * Clave del recinto fiscalizado.
   */
  cveRecintoFiscalizado: string;

  /**
   * Clave del tipo de documento.
   */
  cveTipoDocumento: string;

  /**
   * Estado del tipo de documento.
   */
  estadoTipoDocumento: string;

  /**
   * Nombre de la aduana.
   */
  aduana: string;

  /**
   * Patente asociada.
   */
  patente: string;

  /**
   * Número de pedimento.
   */
  pedimento: string;

  /**
   * Folio de importación temporal.
   */
  folioImportacionTemporal: string;

  /**
   * Folio del formato oficial.
   */
  folioFormatoOficial: string;

  /**
   * Indica si es una prórroga.
   */
  checkProrroga: boolean;

  /**
   * Folio oficial de la prórroga.
   */
  folioOficialProrroga: string;

  /**
   * Fecha de importación temporal.
   */
  fechaImportacionTemporal: string;

  /**
   * Fecha de vencimiento.
   */
  fechaVencimiento: string;

  /**
   * Descripción de la mercancía.
   */
  descMercancia: string;

  /**
   * Marca de la mercancía.
   */
  marca: string;

  /**
   * Modelo de la mercancía.
   */
  modelo: string;

  /**
   * Número de serie de la mercancía.
   */
  numeroSerie: string;

  /**
   * Tipo de mercancía.
   */
  tipo: string;

  /**
   * Clave del medio de transporte.
   */
  cveMedioTrasporte: string;

  /**
   * Guía master.
   */
  guiaMaster: string;

  /**
   * Guía BL.
   */
  guiaBl: string;

  /**
   * Número BL.
   */
  numeroBl: string;

  /**
   * RFC de la empresa transportista.
   */
  rfcEmpresaTransportista: string;

  /**
   * Estado del medio de transporte.
   */
  estadoMedioTransporte: string;

  /**
   * Carta porte.
   */
  cartaPorte: string;

  /**
   * Clave del país de procedencia.
   */
  cvePaisProcedencia: string;

  /**
   * Guía house.
   */
  guiaHouse: string;

  /**
   * Número del buque.
   */
  numeroBuque: string;

  /**
   * Número del equipo.
   */
  numeroEquipo: string;

  /**
   * Fecha de la carta porte.
   */
  fechaCartaPorte: string;

  /**
   * Tipo de contenedor.
   */
  tipContenedor: string;

  /**
   * Marca del transporte.
   */
  tranporteMarca: string;

  /**
   * Modelo del transporte.
   */
  tranporteModelo: string;

  /**
   * Placa del transporte.
   */
  tranportePlaca: string;

  /**
   * Observaciones.
   */
  observaciones: string;

  /**
   * Con destino.
   */
  conDestino: string;

  /**
   * Clave del tipo de destino.
   */
  cveTipoDestino: string;

  /**
   * Clave del tipo de documento reemplazada.
   */
  cveTipoDocumentoReemplazada: string;

  /**
   * Número del acta de destrucción.
   */
  numeroActaDescruccion: string;

  /**
   * Clave de la aduana de destino.
   */
  cveAduanaDestino: string;

  /**
   * Clave de la patente de destino.
   */
  cvePatenteDestino: string;

  /**
   * Clave del pedimento de destino.
   */
  cvePedimentoDestino: string;

  /**
   * Folio VUCEM de retorno.
   */
  folioVucemRetorno: string;

  /**
   * Folio del formato oficial de destino.
   */
  folioFormatoOficialDestino: string;

  /**
   * Fecha de destrucción en el destino.
   */
  fechaDescruccionDestino: string;

  /**
   * Estado del tipo de documento en el destino.
   */
  estadoTipoDocumentoDestino: string;

  /**
   * Autoridad que presentó el aviso de destrucción.
   */
  autoridadPresentoAvisoDestruccion: string;
}

export interface MercanciaFormulario {
  /**
   * Descripción de la mercancía.
   */
  modalDescMercancia: string;

  /**
   * Especificaciones de la mercancía.
   */
  espeMercancia: string;

  /**
   * Marca de la mercancía.
   */
  marcaMercancia: string;

  /**
   * Modelo de la mercancía.
   */
  modeloMercancia: string;

  /**
   * Número de serie de la mercancía.
   */
  numSerieMercancia: string;

  /**
   * Número de parte de la mercancía.
   */
  numParteMercancia: string;

  /**
   * Tipo de mercancía.
   */
  tipoMercancia: string;
}

/**
 * Representa los datos del solicitante.
 */
export interface DatosSolicitante {
  /**
   * RFC del solicitante.
   */
  rfc: string;

  /**
   * Denominación o razón social del solicitante.
   */
  denominacion: string;

  /**
   * Actividad económica del solicitante.
   */
  actividadEconomica: string;

  /**
   * Correo electrónico del solicitante.
   */
  correoElectronico: string;

  /**
   * País del domicilio del solicitante.
   */
  pais: string;

  /**
   * Código postal del domicilio del solicitante.
   */
  codigoPostal: string;

  /**
   * Hora de destrucción asociada al solicitante.
   */
  horaDestruccion: string;

  /**
   * Fecha de destrucción asociada al solicitante.
   */
  fechaDestruccion: string;

  /**
   * Entidad federativa del domicilio del solicitante.
   */
  entidadFederativa: string;

  /**
   * Municipio del domicilio del solicitante.
   */
  municipio: string;

  /**
   * Localidad del domicilio del solicitante.
   */
  localidad: string;

  /**
   * Colonia del domicilio del solicitante.
   */
  colonia: string;

  /**
   * Calle del domicilio del solicitante.
   */
  calle: string;

  /**
   * Número exterior del domicilio del solicitante.
   */
  nExt: string;

  /**
   * Número interior del domicilio del solicitante.
   */
  nInt: string;

  /**
   * Lada telefónica del solicitante.
   */
  lada: string;

  /**
   * Teléfono del solicitante.
   */
  telefono: string;

  /**
   * ADACE asociada al solicitante.
   */
  adace: string;
}

export interface RespuestaConsulta {
  /**
   * Indica si la consulta fue exitosa.
   * @type {boolean}
   */
  success: boolean;

  /**
   * Datos resultantes de la consulta.
   * @type {ConsultaDatos}
   */
  datos: ConsultaDatos;

  /**
   * Mensaje de la respuesta.
   * @type {string}
   */
  message: string;
}

export interface ConsultaDatos {
  /**
   * Información sobre exención de impuestos.
   * @type {TecnicaForm}
   */
  solicitudFormulario: SolicitudFormulario;

  /**
   * Formulario reactivo que contiene los datos de la mercancía.
   *
   * Esta propiedad almacena una instancia de `MercanciaFormulario`,
   * la cual define los controles y validaciones relacionados con
   * la captura de información de la mercancía (marca, modelo, tipo,
   * número de serie, descripción, etc.).
   *
   * Se utiliza en los métodos que agregan, modifican, consultan o
   * cancelan registros de mercancías dentro del flujo de la aplicación.
   */
  mercanciaFormulario: MercanciaFormulario;

  /**
   * Arreglo con los datos de la tabla de partes reemplazadas.
   *
   * Contiene la información de las partes que han sido reemplazadas
   * en el proceso de solicitud del trámite.
   */
  tablaPartesReemplazadasDatos: SolicitudTabla[];
}
