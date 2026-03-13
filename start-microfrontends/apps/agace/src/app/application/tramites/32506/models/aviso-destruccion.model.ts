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
  /**
   * Identificador único del aviso.
   */
  id: number;

  /**
   * Nombre comercial asociado al aviso.
   */
  nombreComercial: string;

  /**
   * Entidad federativa asociada al aviso.
   */
  entidadFederativa: string;

  /**
   * Alcaldía o municipio asociado al aviso.
   */
  alcaldioOMuncipio: string;

  /**
   * Colonia asociada al aviso.
   */
  colonia: string;

  /**
   * Calle asociada al aviso.
   */
  calle?: string;

  /**
   * Número exterior asociado al aviso.
   */
  numeroExterior?: string;

  /**
   * Número interior asociado al aviso.
   */
  numeroInterior?: string;

  /**
   * Código postal asociado al aviso.
   */
  codigoPostal?: string;

  /**
   * RFC asociado al aviso.
   */
  rfc?: string;

  /**
   * Hora de destrucción asociada al aviso.
   */
  horaDestruccion: string;

  /**
   * Fecha de destrucción asociada al aviso.
   */
  fechaDestruccion: string;

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
 * Modelos utilizados en el trámite 32506.
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
/**
 * Representa los datos de la tabla de mercancías.
 */
export interface PedimentoTablaDatos {
  /**
   * Lista de mercancías en la tabla.
   */
  datos: PedimentoTabla[];
}

/**
 * Representa un pedimento en la tabla de pedimentos.
 */
export interface PedimentoTabla {
  /**
   * Identificador único del pedimento.
   */
  id: number;

  /**
   * Patente de autorización asociada al pedimento.
   */
  patenteAutorizacion: string;

  /**
   * Número del pedimento.
   */
  pedimento: string;

  /**
   * Clave de la aduana asociada al pedimento.
   */
  claveAduanaPedimento: string;

  /**
   * Clave de la fracción arancelaria asociada al pedimento.
   */
  claveFraccionArancelariaPedimento: string;

  /**
   * Número de Identificación Comercial (NICO) asociado al pedimento.
   */
  nicoPedimento: string;

  /**
   * Cantidad asociada al pedimento.
   */
  cantidadPedimento: string;

  /**
   * Clave de la unidad de medida asociada al pedimento.
   */
  claveUnidadMedidaPedimento: string;
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
  /**
   * Identificador único del tipo de documento.
   */
  id: number;

  /**
   * Descripción del tipo de documento.
   */
  descripcion: string;

  /**
   * Indica si el tipo de documento debe controlar caja.
   */
  controlarCaja: boolean;
}

/**
 * Representa el formulario de un domicilio.
 */
export interface DomicilioFormulario {
  /**
   * Nombre comercial asociado al domicilio.
   */
  nombreComercial: string;

  /**
   * Clave de la entidad federativa asociada al domicilio.
   */
  claveEntidadFederativa: string;

  /**
   * Clave de la delegación o municipio asociado al domicilio.
   */
  claveDelegacionMunicipio: string;

  /**
   * Clave de la colonia asociada al domicilio.
   */
  claveColonia: string;

  /**
   * Calle asociada al domicilio.
   */
  calle: string;

  /**
   * Número exterior asociado al domicilio.
   */
  numeroExterior: string;

  /**
   * Número interior asociado al domicilio.
   */
  numeroInterior: string;

  /**
   * Código postal asociado al domicilio.
   */
  codigoPostal: string;

  /**
   * RFC asociado al domicilio.
   */
  rfc: string;
}

/**
 * Representa el formulario de un aviso.
 */
export interface AvisoFormulario {
  /**
   * ADACE asociada al aviso.
   */
  adace: string;

  /**
   * Valor del programa IMMEX asociado al aviso.
   */
  valorProgramaImmex: string;

  /**
   * Año del programa IMMEX asociado al aviso.
   */
  valorAnioProgramaImmex: string;

  /**
   * Tipo de aviso.
   */
  tipoAviso: string;

  /**
   * Justificación del aviso.
   */
  justificacion: string;

  /**
   * Periodicidad mensual de destrucción asociada al aviso.
   */
  periodicidadMensualDestruccion: string;

  /**
   * Fecha de traslado asociada al aviso.
   */
  fechaTranslado: string;

  /**
   * Nombre comercial asociado al aviso.
   */
  nombreComercial: string;

  /**
   * Clave de la entidad federativa asociada al aviso.
   */
  claveEntidadFederativa: string;

  /**
   * Clave de la delegación o municipio asociado al aviso.
   */
  claveDelegacionMunicipio: string;

  /**
   * Clave de la colonia asociada al aviso.
   */
  claveColonia: string;

  /**
   * Calle asociada al aviso.
   */
  calle: string;

  /**
   * Número exterior asociado al aviso.
   */
  numeroExterior: string;

  /**
   * Número interior asociado al aviso.
   */
  numeroInterior: string;

  /**
   * Código postal asociado al aviso.
   */
  codigoPostal: string;

  /**
   * Hora de destrucción asociada al aviso.
   */
  horaDestruccion: string;

  /**
   * Fecha de destrucción asociada al aviso.
   */
  fechaDestruccion: string;

  /**
   * Tipo de carga asociada al aviso.
   */
  tipoCarga: string;
}

/**
 * Representa los datos de la tabla de procesos.
 */
export interface ProcesoTablaDatos {
  /**
   * Lista de procesos en la tabla.
   */
  datos: ProcesoTabla[];
}

/**
 * Representa una proceso en la tabla de proceso.
 */
export interface ProcesoTabla {
  /**
   * Identificador único del proceso.
   */
  id: number;

  /**
   * Descripción del proceso de destrucción.
   */
  descripcionProcesoDestruccion: string;
}

/**
 * Representa los datos de la tabla de desperdicios.
 */
export interface DesperdicioTablaDatos {
  /**
   * Lista de desperdicios en la tabla.
   */
  datos: DesperdicioTabla[];
}

/**
 * Representa el formulario de una desperdicio.
 */

export interface DesperdicioTabla {
  /**
   * Identificador único del desperdicio.
   */
  id: number;

  /**
   * Descripción del proceso de destrucción asociado al desperdicio.
   */
  descripcionProcesoDestruccion: string;
}

/**
 * Representa el formulario de una proceso.
 */

export interface ProcesoFormulario {
  /**
   * Descripción del proceso de destrucción asociado al formulario.
   */
  descripcionProcesoDestruccion: string;
}

/**
 * Representa el formulario de un pedimento con los datos necesarios para su procesamiento.
 */
export interface PedimentoFormulario {
  /**
   * La patente de autorización asociada al pedimento.
   */
  patenteAutorizacion: string;

  /**
   * El número del pedimento.
   */
  pedimento: string;

  /**
   * La clave de la aduana correspondiente al pedimento.
   */
  claveAduanaPedimento: string;

  /**
   * La clave de la fracción arancelaria asociada al pedimento.
   */
  claveFraccionArancelariaPedimento: string;

  /**
   * El número de identificación comercial (NICO) del pedimento.
   */
  nicoPedimento: string;

  /**
   * La cantidad declarada en el pedimento.
   */
  cantidadPedimento: string;

  /**
   * La clave de la unidad de medida utilizada en el pedimento.
   */
  claveUnidadMedidaPedimento: string;
}

/**
 * Representa el formulario de una desperdicio.
 */
export interface DesperdicioFormulario {
  /**
   * Descripción del desperdicio.
   */
  descripcionDesperdicio: string;

  /**
   * Cantidad del desperdicio.
   */
  cantidadDesp: string;

  /**
   * Clave de la unidad de medida del desperdicio.
   */
  claveUnidadMedidaDesp: string;

  /**
   * Porcentaje del desperdicio.
   */
  porcentaje: string;

  /**
   * Descripción de la mercancía asociada al desperdicio.
   */
  descripcionMercancia: string;

  /**
   * Circunstancia de los hechos relacionados con el desperdicio.
   */
  circunstanciaHechos: string;
}


/**
 * Representa un archivo de documentos.
 */
export interface ArchivoDocumentos {

  /**
   * Nombre del archivo.
   */
  nombreDelArchivo: string;

  /**
   * Tamaño del archivo en bytes.
   */
  tamano: number;

  /**
   * Resolución del archivo (e.g., 1920x1080).
   */
  resolucion: string;

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
/**
 * Representa la estructura de los datos del trámite 32506 para el aviso.
 */
export interface ConsultaDatos {
 
  /**
   * Información del solicitante que realiza el trámite.
   */
  datosSolicitante: DatosSolicitante;

  /**
   * Datos del domicilio relacionados con el formulario.
   */
  domicilioFormulario: DomicilioFormulario;

  /**
   * Información general del aviso (empresa, traslado, justificación, etc.).
   */
  avisoFormulario: AvisoFormulario;

  /**
   * Detalles del proceso de destrucción del desperdicio.
   */
  procesoFormulario: ProcesoFormulario;

  /**
   * Información sobre el desperdicio a declarar.
   */
  desperdicioFormulario: DesperdicioFormulario;

  /**
   * Información del pedimento relacionado con la mercancía.
   */
  pedimentoFormulario: PedimentoFormulario;

  /**
   * Tipo de documento relacionado al trámite.
   */
  tipoDocumento: string;

  /**
   * Información sobre la destrucción de mercancías.
   */
  destruccionMercanciasTabla: AvisoTabla[];
}
