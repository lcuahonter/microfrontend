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
/**
 * Interfaz que define las mercancías seleccionadas en la tabla.
 *
 * Contiene información como RFC del productor, fracción arancelaria, cantidad, unidad de medida,
 * valor de la mercancía, tipo de factura, número de factura, complemento de descripción y fecha de factura.
 */
export interface SeleccionadasTabla {
  /** Identificador de la mercancía. */
  id: number;
  /** RFC del productor. */
  rfcProductor: string;
  /** Fracción arancelaria. */
  fraccionArancelaria: string;
  /** Cantidad. */
  cantidad: string;
  /** Unidad de medida. */
  unidadMedida: string;
  /** Valor de la mercancía. */
  valorMercancia: string;
  /** Tipo de factura. */
  tipoFactura: string;
  /** Número de factura. */
  numFactura: string;
  /** Complemento de la descripción. */
  complementoDescripcion: string;
  /** Fecha de la factura. */
  fechaFactura: string;
}

/**
 * Interfaz que define las mercancías disponibles en la tabla.
 * 
 * Contiene información como fracción arancelaria, nombre técnico, nombre comercial,
 * número de registro de productos, fecha de expedición y fecha de vencimiento.
 */
/**
 * Interfaz que define las mercancías disponibles en la tabla.
 *
 * Contiene información como fracción arancelaria, nombre técnico, nombre comercial,
 * número de registro de productos, fecha de expedición y fecha de vencimiento.
 */
export interface DisponiblesTabla {
  /** Fracción arancelaria. */
  fraccionArancelaria: string;
  /** Nombre técnico. */
  nombreTecnico: string;
  /** Nombre comercial. */
  nombreComercial: string;
  /** Número de registro de productos. */
  numeroRegistroProductos: string;
  /** Fecha de expedición. */
  fechaExpedicion: string;
  /** Fecha de vencimiento. */
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
 * Contiene un identificador único y una descripción.
 */
export interface Catalogo {
  /**
   * Identificador único del elemento de catálogo.
   */
  id: number;
  /**
   * Descripción del elemento de catálogo.
   */
  descripcion: string;
}

/**
 * Interfaz que define una acción de botón.
 * 
 * Contiene la acción a realizar y un valor asociado.
 */
export interface AccionBoton {
  /**
   * Acción a realizar por el botón.
   */
  accion: string;
  /**
   * Valor asociado a la acción del botón.
   */
  valor: number;
}

/**
 * Interfaz que define los datos del grupo representativo.
 * 
 * Contiene información como lugar, nombre del exportador, empresa, cargo, teléfono y correo electrónico.
 */
/**
 * Interfaz que define los datos del grupo representativo.
 *
 * Contiene información como lugar, nombre del exportador, empresa, cargo, teléfono y correo electrónico.
 */
export interface GrupoRepresentativo {
  /** Lugar del grupo representativo. */
  lugar: string;
  /** Nombre del exportador. */
  nombreExportador: string;
  /** Empresa asociada. */
  empresa: string;
  /** Cargo del representante. */
  cargo: string;
  /** Teléfono de contacto. */
  telefono: string;
  /** Correo electrónico de contacto. */
  correoElectronico: string;
}

/**
 * Interfaz que define los datos del grupo receptor.
 * 
 * Contiene información como nombre, apellidos, número fiscal y razón social.
 */
/**
 * Interfaz que define los datos del grupo receptor.
 *
 * Contiene información como nombre, apellidos, número fiscal y razón social.
 */
export interface GrupoReceptor {
  /** Nombre del receptor. */
  nombre: string;
  /** Primer apellido del receptor. */
  apellidoPrimer: string;
  /** Segundo apellido del receptor. */
  apellidoSegundo: string;
  /** Número fiscal del receptor. */
  numeroFiscal: string;
  /** Razón social del receptor. */
  razonSocial: string;
}

/**
 * Interfaz que define los datos del grupo de direcciones.
 * 
 * Contiene información como ciudad, calle, número o letra, teléfono y correo electrónico.
 */
/**
 * Interfaz que define los datos del grupo de direcciones.
 *
 * Contiene información como ciudad, calle, número o letra, teléfono y correo electrónico.
 */
export interface GrupoDeDirecciones {
  /** Ciudad. */
  ciudad: string;
  /** Calle. */
  calle: string;
  /** Número o letra. */
  numeroLetra: string;
  /** Teléfono de contacto. */
  telefono: string;
  /** Correo electrónico de contacto. */
  correoElectronico: string;
}

/**
 * Interfaz que define los datos del formulario para agregar información del productor.
 * 
 * Contiene el número de registro fiscal del productor.
 */
/**
 * Interfaz que define los datos del formulario para agregar información del productor.
 * Contiene el número de registro fiscal y fax del productor.
 */
export interface AgregarDatosProductorFormulario {
  /**
   * Número de registro fiscal del productor.
   */
  numeroRegistroFiscal?: string;
  /**
   * Fax del productor.
   */
  fax?: string;
}

/**
 * Interfaz que define los datos del formulario de mercancías.
 * 
 * Contiene información detallada de la mercancía, como fracción arancelaria, nombres, criterios,
 * valores, cantidades, país, valor de la mercancía, descripción, número de serie, fecha, factura y tipo de factura.
 */
/**
 * Interfaz que define los datos del formulario de mercancías.
 *
 * Contiene información detallada de la mercancía, como fracción arancelaria, nombres, criterios,
 * valores, cantidades, país, valor de la mercancía, descripción, número de serie, fecha, factura y tipo de factura.
 */
export interface FormularioMercancia {
  /** Fracción arancelaria de la mercancía. */
  fraccionMercanciaArancelaria: string;
  /** Nombre comercial de la mercancía. */
  nombreComercialDelaMercancia: string;
  /** Nombre técnico de la mercancía. */
  nombreTecnico: string;
  /** Nombre en inglés de la mercancía. */
  nombreEnIngles: string;
  /** Criterio de trato preferencial. */
  criterioTratoPreferencial: string;
  /** Valor de contenido regional. */
  valorContenidoRegional: string;
  /** Otras instancias relacionadas. */
  otrasInstancias: string;
  /** Cantidad de mercancía. */
  cantidad: string;
  /** País de origen. */
  pais: string;
  /** Valor de la mercancía. */
  valorDelaMercancia: string;
  /** Complemento de la descripción. */
  complementoDelaDescripcion: string;
  /** Número de serie. */
  numeroSerie: string;
  /** Fecha asociada. */
  fecha: string;
  /** Número de factura. */
  numeroFactura: string;
  /** Tipo de factura. */
  tipoFactura: string;
}

/**
 * Interfaz que define los datos del grupo tratado.
 * 
 * Contiene información como tratado, país, fracción arancelaria, número de registro,
 * nombre comercial y fechas de inicio y fin.
 */
/**
 * Interfaz que define los datos del grupo tratado.
 *
 * Contiene información como tratado, país, fracción arancelaria, número de registro,
 * nombre comercial y fechas de inicio y fin.
 */
export interface GrupoTratado {
  /** Nombre del tratado. */
  tratado: string;
  /** País asociado al tratado. */
  pais: string;
  /** Fracción arancelaria. */
  fraccionArancelaria: string;
  /** Número de registro. */
  numeroRegistro: string;
  /** Nombre comercial. */
  nombreComercial: string;
  /** Fecha final. */
  fechaFinalInput: string;
  /** Fecha inicial. */
  fechaInicialInput: string;
}

/**
 * Interfaz que define los datos del grupo operador.
 *
 * Contiene información como nombre, apellidos, registro fiscal y razón social del tercer operador.
 */
export interface GrupoOperador {
  /** Nombre del tercer operador. */
  nombreTercerOperador: string;
  /** Primer apellido del tercer operador. */
  primerApellidoTercerOperador: string;
  /** Segundo apellido del tercer operador. */
  segundoApellidoTercerOperador: string;
  /** Registro fiscal del tercer operador. */
  registroFiscalTercerOperador: string;
  /** Razón social del tercer operador. */
  razonSocialTercerOperador: string;
}
/**
 * Interfaz que define los datos de un acuse en la lista.
 * 
 * Contiene información como el identificador único del acuse, el nombre del documento
 * y un enlace para descargar el archivo asociado.
 */
/**
 * Interfaz que representa la respuesta de una consulta.
 * @property {boolean} success - Indica si la consulta fue exitosa.
 * @property {ConsultaDatos} datos - Datos obtenidos de la consulta.
 * @property {string} message - Mensaje de la respuesta.
 */
/**
 * Interfaz que define los datos de un acuse en la lista.
 *
 * Contiene información como el identificador único del acuse, el nombre del documento
 * y un enlace para descargar el archivo asociado.
 */
export interface AcuseLista {
  /** Identificador único del acuse. */
  id: number;
  /** Nombre del documento. */
  documento: string;
  /** Enlace para descargar el archivo asociado. */
  descargar: string;
}

/**
 * Interfaz que representa los datos del grupo operador.
 * @property {string} nombreTercerOperador - Nombre del tercer operador.
 * @property {string} primerApellidoTercerOperador - Primer apellido del tercer operador.
 * @property {string} segundoApellidoTercerOperador - Segundo apellido del tercer operador.
 * @property {string} registroFiscalTercerOperador - Registro fiscal del tercer operador.
 * @property {string} razonSocialTercerOperador - Razón social del tercer operador.
 */
/**
 * @interface RespuestaConsulta
 * @description Representa la respuesta de una consulta realizada en el trámite.
 * 
 * @property {boolean} success - Indica si la consulta fue exitosa.
 * @property {ConsultaDatos} datos - Contiene los datos obtenidos de la consulta.
 * @property {string} message - Mensaje asociado a la respuesta de la consulta.

/**
 * Interfaz que representa los datos obtenidos de una consulta.
 * @property {boolean} tercerOperador - Indica si hay tercer operador.
 * @property {string} blnPeriodo - Indica si está en periodo.
 * @property {GrupoOperador} grupoOperador - Grupo operador.
 * @property {GrupoTratado} grupoTratado - Grupo tratado.
 * @property {SeleccionadasTabla[]} mercanciaSeleccionadasTablaDatos - Mercancías seleccionadas.
 * @property {DisponiblesTabla[]} mercanciaDisponsiblesTablaDatos - Mercancías disponibles.
 * @property {string} observaciones - Observaciones.
 * @property {string} idioma - Idioma.
 * @property {string} entidadFederativa - Entidad federativa.
 * @property {string} representacionFederal - Representación federal.
 * @property {GrupoReceptor} grupoReceptor - Grupo receptor.
 * @property {GrupoDeDirecciones} grupoDeDirecciones - Grupo de direcciones.
 * @property {GrupoRepresentativo} grupoRepresentativo - Grupo representativo.
 * @property {boolean} datosConfidencialesProductor - Si los datos del productor son confidenciales.
 * @property {boolean} productorMismoExportador - Si el productor es el mismo exportador.
 * @property {HistoricoColumnas[]} productoresExportador - Productores exportador.
 * @property {SeleccionadasTabla[]} historicoMercanciaSeleccionadasTablaDatos - Historial de mercancías seleccionadas.
 * @property {string} nombreTercerOperador - Nombre del tercer operador.
 * @property {string} primerApellidoTercerOperador - Primer apellido del tercer operador.
 * @property {string} segundoApellidoTercerOperador - Segundo apellido del tercer operador.
 * @property {string} registroFiscalTercerOperador - Registro fiscal del tercer operador.
 * @property {string} razonSocialTercerOperador - Razón social del tercer operador.
 */
/**
 * Interfaz que representa la respuesta de una consulta.
 *
 * Incluye si la consulta fue exitosa, los datos obtenidos y un mensaje de respuesta.
 */
export interface RespuestaConsulta {
  /** Indica si la consulta fue exitosa. */
  success: boolean;
  /** Datos obtenidos de la consulta. */
  datos: ConsultaDatos;
  /** Mensaje de la respuesta. */
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
/**
 * Interfaz que representa los datos obtenidos de una consulta.
 *
 * Incluye información sobre operadores, tratados, mercancías, observaciones, idioma, entidades, grupos y productores.
 */
export interface ConsultaDatos {
  /** Indica si hay tercer operador. */
  tercerOperador: boolean;
  /** Indica si está en periodo. */
  blnPeriodo: string;
  /** Grupo operador. */
  grupoOperador: GrupoOperador;
  /** Grupo tratado. */
  grupoTratado: GrupoTratado;
  /** Mercancías seleccionadas. */
  mercanciaSeleccionadasTablaDatos: SeleccionadasTabla[];
  /** Mercancías disponibles. */
  mercanciaDisponsiblesTablaDatos: DisponiblesTabla[];
  /** Observaciones. */
  observaciones: string;
  /** Idioma. */
  idioma: string;
  /** Entidad federativa. */
  entidadFederativa: string;
  /** Representación federal. */
  representacionFederal: string;
  /** Grupo receptor. */
  grupoReceptor: GrupoReceptor;
  /** Grupo de direcciones. */
  grupoDeDirecciones: GrupoDeDirecciones;
  /** Grupo representativo. */
  grupoRepresentativo: GrupoRepresentativo;
  /** Si los datos del productor son confidenciales. */
  datosConfidencialesProductor: boolean;
  /** Si el productor es el mismo exportador. */
  productorMismoExportador: boolean;
  /** Productores exportador. */
  productoresExportador: HistoricoColumnas[];
  /** Historial de mercancías seleccionadas. */
  historicoMercanciaSeleccionadasTablaDatos: SeleccionadasTabla[];
  /** Nombre del tercer operador. */
  nombreTercerOperador: string;
  /** Primer apellido del tercer operador. */
  primerApellidoTercerOperador: string;
  /** Segundo apellido del tercer operador. */
  segundoApellidoTercerOperador: string;
  /** Registro fiscal del tercer operador. */
  registroFiscalTercerOperador: string;
  /** Razón social del tercer operador. */
  razonSocialTercerOperador: string;
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
/**
 * Interfaz que representa la tabla de mercancías.
 *
 * Contiene información detallada sobre las mercancías, incluyendo fracción arancelaria,
 * tipo de factura, cantidad, unidad de medida, nombres técnicos y comerciales, valor de la mercancía y RFC del productor.
 */
export interface MercanciaTabla {
  /** Fracción arancelaria. */
  fraccionArancelaria?: string;
  /** Tipo de factura. */
  tipoFactura?: string;
  /** Cantidad. */
  cantidad?: string;
  /** Unidad de medida. */
  unidadMedida?: string;
  /** Nombre técnico. */
  nombreTecnico?: string;
  /** Nombre comercial. */
  nombreComercial?: string;
  /** Valor de la mercancía. */
  valorMercancia: string;
  /** RFC del productor. */
  rfcProductor?: string;
  /** Número de factura. */
  numeroFactura?: string;
  /** Complemento. */
  complemento?: string;
  /** Complemento de la descripción. */
  complementoDescripcion?: string;
  /** Factura asociada. */
  fetchFactura?: string;
  /** RFC alternativo del productor. */
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