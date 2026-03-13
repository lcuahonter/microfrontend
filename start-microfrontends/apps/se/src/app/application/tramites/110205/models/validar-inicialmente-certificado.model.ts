/**
 * Interfaz que define los datos del productor exportador.
 * 
 * Contiene información histórica de los productores exportadores, como nombre, número de registro fiscal,
 * dirección, correo electrónico, teléfono y fax.
 */
export interface ProductorExportador {
  /**
   * Lista de columnas históricas de los productores exportadores.
   */
  datos: HistoricoColumnas[];
}

/**
 * Interfaz que define las columnas históricas de los productores exportadores.
 * 
 * Contiene información detallada de cada productor exportador.
 */
export interface HistoricoColumnas {
  /**
   * Identificador único del productor.
   */
  id: number;

  /**
   * Nombre del productor.
   */
  nombreProductor: string;

  /**
   * Número de registro fiscal del productor.
   */
  numeroRegistroFiscal: string;

  /**
   * Dirección del productor.
   */
  direccion: string;

  /**
   * Correo electrónico del productor.
   */
  correoElectronico: string;

  /**
   * Teléfono del productor.
   */
  telefono: string;

  /**
   * Fax del productor.
   */
  fax: string;

  /** Indica si el productor es nuevo. */
  nuevo?: boolean;

}

/**
 * Interfaz que define las mercancías seleccionadas en la tabla.
 * 
 * Contiene información como RFC del productor, fracción arancelaria, cantidad, unidad de medida,
 * valor de la mercancía, tipo de factura, número de factura, complemento de descripción y fecha de factura.
 */
export interface SeleccionadasTabla {
  id: number;
  rfcProductor: string;
  fraccionArancelaria: string;
  cantidad: string;
  unidadMedida: string;
  valorMercancia: string;
  tipoFactura: string;
  numFactura: string;
  complementoDescripcion: string;
  fechaFactura: string;
}

/**
 * Interfaz que define las mercancías disponibles en la tabla.
 * 
 * Contiene información como fracción arancelaria, nombre técnico, nombre comercial,
 * número de registro de productos, fecha de expedición y fecha de vencimiento.
 */
export interface DisponiblesTabla {
  fraccionArancelaria: string;
  nombreTecnico: string;
  nombreComercial: string;
  numeroRegistroProductos: string;
  fechaExpedicion: string;
  fechaVencimiento: string;
}

/**
 * Interfaz que define una lista de catálogos.
 * 
 * Contiene un arreglo de objetos de tipo `Catalogo`.
 */
export interface CatalogoLista {
  /**
   * Lista de elementos del catálogo.
   */
  datos: Catalogo[];
}

/**
 * Interfaz que define un elemento de catálogo.
 * 
 * Contiene un identificador único y una descripción.
 */
export interface Catalogo {
  id: number;
  descripcion: string;
}

/**
 * Interfaz que define una acción de botón.
 * 
 * Contiene la acción a realizar y un valor asociado.
 */
export interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * Interfaz que define los datos del grupo representativo.
 * 
 * Contiene información como lugar, nombre del exportador, empresa, cargo, teléfono y correo electrónico.
 */
export interface GrupoRepresentativo {
  lugar: string;
  nombreExportador: string;
  empresa: string;
  cargo: string;
  telefono: string;
  correoElectronico: string;
}

/**
 * Interfaz que define los datos del grupo receptor.
 * 
 * Contiene información como nombre, apellidos, número fiscal y razón social.
 */
export interface GrupoReceptor {
  nombre: string;
  apellidoPrimer: string;
  apellidoSegundo: string;
  numeroFiscal: string;
  razonSocial: string;
}

/**
 * Interfaz que define los datos del grupo de direcciones.
 * 
 * Contiene información como ciudad, calle, número o letra, teléfono y correo electrónico.
 */
export interface GrupoDeDirecciones {
  ciudad: string;
  calle: string;
  numeroLetra: string;
  telefono: string;
  correoElectronico: string;
}

/**
 * Interfaz que define los datos del formulario para agregar información del productor.
 * 
 * Contiene el número de registro fiscal del productor.
 */
export interface AgregarDatosProductorFormulario {
  numeroRegistroFiscal?: string;
  fax?: string;
}

/**
 * Interfaz que define los datos del formulario de mercancías.
 * 
 * Contiene información detallada de la mercancía, como fracción arancelaria, nombres, criterios,
 * valores, cantidades, país, valor de la mercancía, descripción, número de serie, fecha, factura y tipo de factura.
 */
export interface FormularioMercancia {
  fraccionMercanciaArancelaria: string;
  nombreComercialDelaMercancia: string;
  nombreTecnico: string;
  nombreEnIngles: string;
  criterioTratoPreferencial: string;
  valorContenidoRegional: string;
  otrasInstancias: string;
  cantidad: string;
  pais: string;
  valorDelaMercancia: string;
  complementoDelaDescripcion: string;
  numeroSerie: string;
  fecha: string;
  numeroFactura: string;
  tipoFactura: string;
}

/**
 * Interfaz que define los datos del grupo tratado.
 * 
 * Contiene información como tratado, país, fracción arancelaria, número de registro,
 * nombre comercial y fechas de inicio y fin.
 */
export interface GrupoTratado {
  tratado: string; 
  pais: string;
  fraccionArancelaria: string;
  numeroRegistro: string;
  nombreComercial: string;
  fechaFinalInput: string;
  fechaInicialInput: string;
}

export interface GrupoOperador {
  nombreTercerOperador: string;
  primerApellidoTercerOperador: string;
  segundoApellidoTercerOperador: string;
  registroFiscalTercerOperador: string;
  razonSocialTercerOperador: string;
}
/**
 * Interfaz que define los datos de un acuse en la lista.
 * 
 * Contiene información como el identificador único del acuse, el nombre del documento
 * y un enlace para descargar el archivo asociado.
 */
export interface AcuseLista {
  id: number;
  documento: string;
  descargar: string;
}
/**
 * @interface RespuestaConsulta
 * @description Representa la respuesta de una consulta realizada en el trámite.
 * 
 * @property {boolean} success - Indica si la consulta fue exitosa.
 * @property {ConsultaDatos} datos - Contiene los datos obtenidos de la consulta.
 * @property {string} message - Mensaje asociado a la respuesta de la consulta.
 */
export interface RespuestaConsulta {
  success: boolean;
  datos: ConsultaDatos;
  message: string;
}
/**
 * @interface ConsultaDatos
 * @description Representa los datos obtenidos de una consulta en el trámite.
 * 
 * @property {boolean} tercerOperador - Indica si existe un tercer operador involucrado.
 * @property {string} blnPeriodo - Indica si el trámite está dentro de un periodo específico.
 * @property {GrupoOperador} grupoOperador - Información del grupo operador.
 * @property {GrupoTratado} grupoTratado - Información del grupo tratado.
 * @property {SeleccionadasTabla[]} mercanciaSeleccionadasTablaDatos - Lista de mercancías seleccionadas en la tabla de datos.
 * @property {DisponiblesTabla[]} mercanciaDisponsiblesTablaDatos - Lista de mercancías disponibles en la tabla de datos.
 * @property {string} observaciones - Observaciones relacionadas con la consulta.
 * @property {string} idioma - Idioma utilizado en la consulta.
 * @property {string} entidadFederativa - Entidad federativa asociada a la consulta.
 * @property {string} representacionFederal - Representación federal asociada a la consulta.
 * @property {GrupoReceptor} grupoReceptor - Información del grupo receptor.
 * @property {GrupoDeDirecciones} grupoDeDirecciones - Información del grupo de direcciones.
 * @property {GrupoRepresentativo} grupoRepresentativo - Información del grupo representativo.
 * @property {boolean} datosConfidencialesProductor - Indica si los datos del productor son confidenciales.
 * @property {boolean} productorMismoExportador - Indica si el productor es el mismo exportador.
 * @property {HistoricoColumnas[]} productoresExportador - Lista de productores asociados al exportador.
 * @property {SeleccionadasTabla[]} historicoMercanciaSeleccionadasTablaDatos - Historial de mercancías seleccionadas en la tabla de datos.
 */
export interface ConsultaDatos {
  tercerOperador: boolean;
  blnPeriodo: string;
  grupoOperador: GrupoOperador;
  grupoTratado: GrupoTratado;
  mercanciaSeleccionadasTablaDatos: SeleccionadasTabla[]
  mercanciaDisponsiblesTablaDatos: DisponiblesTabla[];
  observaciones: string;
  idioma: string;
  entidadFederativa: string;
  representacionFederal: string;
  grupoReceptor: GrupoReceptor;
  grupoDeDirecciones: GrupoDeDirecciones;
  grupoRepresentativo: GrupoRepresentativo;
  datosConfidencialesProductor: boolean;
  productorMismoExportador: boolean;
  productoresExportador: HistoricoColumnas[];
  historicoMercanciaSeleccionadasTablaDatos: SeleccionadasTabla[];
  nombreTercerOperador : string,
  primerApellidoTercerOperador : string,
  segundoApellidoTercerOperador : string,
  registroFiscalTercerOperador : string,
  razonSocialTercerOperador : string,
}

/**
 * @interface MercanciaTabla
 * @description
 * Interfaz que representa la tabla de mercancías.
 * Contiene información detallada sobre las mercancías, incluyendo fracción arancelaria,
 * tipo de factura, cantidad, unidad de medida, nombres técnicos y comerciales, 
 * valor de la mercancía y RFC del productor.
 * 
 */
export interface MercanciaTabla {
  fraccionArancelaria?: string;
  tipoFactura?: string;
  cantidad?: string;
  unidadMedida?: string;
  nombreTecnico?: string;
  nombreComercial?: string;
  valorMercancia: string;
  rfcProductor?: string;
  numeroFactura?: string;
  complemento?: string;
  complementoDescripcion?: string;
  fetchFactura?: string;
  rfcProductor1?: string;
}

/**
 * @interface MercanciasHistorico
 * @description
 * Interfaz que representa el historial de mercancías.
 * Contiene una lista de objetos de tipo `MercanciaTabla` que almacenan los datos históricos de las mercancías asociadas al trámite.
 * 
 */
export interface MercanciasHistorico {
  /**
  * @property {MercanciaTabla[]} datos - Lista de datos históricos de mercancías.
  * @description
  * Arreglo que contiene los datos históricos de mercancías, cada uno representado por un
  * objeto de tipo `MercanciaTabla`.
  */
  datos: MercanciaTabla[];
}