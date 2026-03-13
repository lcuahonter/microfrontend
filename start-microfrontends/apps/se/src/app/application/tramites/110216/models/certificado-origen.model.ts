/**
 * Representa las columnas del historial de productores.
 */
export interface HistoricoColumnas {
  /** Identificador único del productor. */
  id: number;
  /** Nombre del productor. */
  nombreProductor: string;
  /** Número de registro fiscal del productor. */
  numeroRegistroFiscal: string;
  /** Dirección del productor. */
  direccion: string;
  /** Correo electrónico del productor. */
  correoElectronico: string;
  /** Número telefónico del productor. */
  telefono: string;
  /** Número de fax del productor. */
  fax: string;
  /** Indica si el productor es nuevo. */
  nuevo?: boolean;
}

/**
 * Representa los datos agrupados de productores exportadores.
 */
export interface ProductorExportador {
  /** Lista de productores exportadores. */
  datos: HistoricoColumnas[];
}

/**
 * Representa un elemento genérico de catálogo.
 */
export interface Catalogo {
  /** Identificador del elemento. */
  id: number;
  /** Descripción del elemento. */
  descripcion: string;
}

/**
 * Representa una lista de elementos de catálogo.
 */
export interface CatalogoLista {
  /** Arreglo de elementos del catálogo. */
  datos: Catalogo[];
}

/**
 * Representa los datos del formulario para agregar un nuevo productor.
 */
export interface AgregarDatosProductorFormulario {
  /** Número de registro fiscal del productor. */
  numeroRegistroFiscal: string;
  /** Número de fax del productor. */
  fax: string;
}

/**
 * Representa los datos del grupo receptor (persona o entidad que recibe).
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
 * Representa los datos de contacto y ubicación del receptor.
 */
export interface GrupoDeDirecciones {
  /** Ciudad del domicilio. */
  ciudad: string;
  /** Calle del domicilio. */
  calle: string;
  /** Número o letra del domicilio. */
  numeroLetra: string;
  /** Clave LADA. */
  lada: string;
  /** Teléfono de contacto. */
  telefono: string;
  /** Número de fax. */
  fax: string;
  /** Correo electrónico de contacto. */
  correoElectronico: string;
}

/**
 * Representa los datos del exportador o su representante.
 */
export interface GrupoRepresentativo {
  /** Lugar donde se realiza la representación. */
  lugar: string;
  /** Nombre del exportador. */
  nombreExportador: string;
  /** Nombre de la empresa. */
  empresa: string;
  /** Cargo o puesto del representante. */
  cargo: string;
  /** LADA del número telefónico. */
  lada: string;
  /** Número telefónico. */
  telefono: string;
  /** Número de fax. */
  fax: string;
  /** Correo electrónico. */
  correoElectronico: string;
}

/**
 * Representa los datos del transporte internacional.
 */
export interface GrupoDeTransporte {
  /** Puerto de embarque. */
  puertoEmbarque: string;
  /** Puerto de desembarque. */
  puertoDesembarque: string;
  /** Puerto de tránsito. */
  puertoTransito: string;
  /** Nombre de la embarcación. */
  nombreEmbarcacion: string;
  /** Número de vuelo. */
  numeroVuelo: string;
}

/**
 * Representa una acción emitida desde un botón interactivo.
 */
export interface AccionBoton {
  /** Tipo de acción. */
  accion: string;
  /** Valor asociado a la acción. */
  valor: number;
}

/**
 * Representa los datos del grupo operador.
 */
export interface GrupoOperador {
  /** Nombre del operador. */
  nombre: string;
  /** Primer apellido del operador. */
  apellidoPrimer: string;
  /** Segundo apellido del operador. */
  apellidoSegundo: string;
  /** Número fiscal del operador. */
  numeroFiscal: string;
  /** Razón social del operador. */
  razonSocial: string;
}

/**
 * Representa la información de domicilio del operador.
 */
export interface GrupoDeDomicilio {
  /** País del domicilio. */
  pais: string;
  /** Ciudad del domicilio. */
  ciudad: string;
  /** Calle del domicilio. */
  calle: string;
  /** Número o letra de domicilio. */
  numeroLetra: string;
  /** LADA del número telefónico. */
  lada: string;
  /** Número telefónico. */
  telefono: string;
  /** Número de fax. */
  fax: string;
  /** Correo electrónico. */
  correoElectronico: string;
}

/**
 * Representa los datos del tratado comercial aplicable.
 */
export interface GrupoTratado {
  /** Nombre del tratado. */
  tratado: string;
  /** País relacionado con el tratado. */
  pais: string;
  /** Fracción arancelaria. */
  fraccionArancelaria: string;
  /** Número de registro del tratado. */
  numeroRegistro: string;
  /** Nombre comercial del producto. */
  nombreComercial: string;
  /** Fecha de vigencia final del tratado. */
  fechaFinalInput: string;
  /** Fecha de vigencia inicial del tratado. */
  fechaInicialInput: string;
}

/**
 * Representa una mercancía disponible para selección.
 */
export interface DisponiblesTabla {
  /** Identificador único (opcional). */
  id?: number;
  /** Fracción arancelaria de la mercancía. */
  fraccionArancelaria: string;
  /** Nombre técnico. */
  nombreTecnico: string;
  /** Nombre comercial. */
  nombreComercial: string;
  /** Número de registro del producto. */
  numeroRegistroProductos: string;
  /** Fecha de expedición del producto. */
  fechaExpedicion: string;
  /** Fecha de vencimiento del producto. */
  fechaVencimiento: string;
}

/**
 * Representa una mercancía seleccionada por el usuario.
 */
export interface SeleccionadasTabla {
  /** Identificador único. */
  id: number;
  /** Fracción arancelaria. */
  fraccionArancelaria: string;
  /** Cantidad de mercancía. */
  cantidad: string;
  /** Unidad de medida. */
  unidadMedida: string;
  /** Valor total de la mercancía. */
  valorMercancia: string;
  /** Tipo de factura. */
  tipoFactura: string;
  /** Número de factura. */
  numFactura: string;
  /** Descripción complementaria. */
  complementoDescripcion: string;
  /** Fecha de la factura. */
  fechaFactura: string;
}

/**
 * Representa los datos del formulario de ingreso de mercancías.
 */
export interface FormularioMercancia {
  /** Fracción arancelaria. */
  fraccionMercanciaArancelaria: string;
  /** Nombre técnico. */
  nombreTecnico: string;
  /** Nombre comercial. */
  nombreComercialDelaMercancia: string;
  /** Criterio para conferir origen. */
  criterioParaConferir: string;
  /** Nombre en inglés del producto. */
  nombreEnIngles: string;
  /** Información sobre otras instancias. */
  otrasInstancias: string;
  /** Cantidad. */
  cantidad: string;
  /** País de origen o destino. */
  pais: string;
  /** Valor económico de la mercancía. */
  valorDelaMercancia: string;
  /** Descripción complementaria. */
  complementoDescripcion: string;
  /** Tipo de factura. */
  tipoFactura: string;
  /** Fecha de emisión. */
  fecha: string;
  /** Número de factura. */
  numeroFactura: string;
}

/**
 * Representa la respuesta de una operación de consulta.
 */
export interface RespuestaConsulta {
  /** Indica si la consulta fue exitosa. */
  success: boolean;
  /** Datos obtenidos en la consulta. */
  datos: ConsultaDatos;
  /** Mensaje relacionado con el resultado. */
  message: string;
}

/**
 * Representa el conjunto de datos obtenidos tras una consulta.
 */
export interface ConsultaDatos {
  /** Indica si se trata de un operador tercero. */
  tercerOperador: boolean;
  /** Datos del grupo operador. */
  grupoOperador: GrupoOperador;
  /** Datos del grupo tratado. */
  grupoTratado: GrupoTratado;
  /** Datos del domicilio del operador. */
  grupoDeDomicilio: GrupoDeDomicilio;
  /** Mercancías seleccionadas. */
  mercanciaSeleccionadasTablaDatos: SeleccionadasTabla[];
  /** Mercancías disponibles. */
  mercanciaDisponsiblesTablaDatos: DisponiblesTabla[];
  /** Observaciones del trámite. */
  observaciones: string;
  /** Idioma de los datos. */
  idioma: string;
  /** Entidad federativa asociada. */
  entidadFederativa: string;
  /** Representación federal correspondiente. */
  representacionFederal: string;
  /** Datos del grupo receptor. */
  grupoReceptor: GrupoReceptor;
  /** Dirección del receptor. */
  grupoDeDirecciones: GrupoDeDirecciones;
  /** Datos del representante o exportador. */
  grupoRepresentativo: GrupoRepresentativo;
  /** Información del transporte utilizado. */
  grupoDeTransporte: GrupoDeTransporte;
  /** Indica si los datos del productor son confidenciales. */
  datosConfidencialesProductor: boolean;
  /** Indica si el productor es el mismo que el exportador. */
  productorMismoExportador: boolean;
  /** Lista de productores asociados al exportador. */
  productoresExportador: HistoricoColumnas[];
}

/**
 * Representa los datos detallados de una mercancía.
 */
export interface Mercancia {
  /** Fracción Naladi principal. */
  fraccionNaladi: string;
  /** Fracción Naladi SA 93. */
  fraccionNaladiSa93: string;
  /** Fracción Naladi SA 96. */
  fraccionNaladiSa96: string;
  /** Fracción Naladi SA 02. */
  fraccionNaladiSa02: string;
  /** Nombre técnico del producto. */
  nombreTecnico: string;
  /** Nombre comercial del producto. */
  nombreComercial: string;
  /** Norma de origen aplicable. */
  normaOrigen?: string;
  /** Identificador único. */
  id?: string;
  /** Cantidad total. */
  cantidad?: string;
  /** Unidad de medida comercial. */
  umc?: string;
  /** Tipo de factura. */
  tipoFactura?: string;
  /** Valor total de la mercancía. */
  valorMercancia?: string;
  /** Fecha final de validez. */
  fechaFinalInput?: string;
  /** Número de factura. */
  numeroFactura?: string;
  /** Código Nalad. */
  nalad?: string;
  /** Clasificación adicional. */
  complementoClasificacion?: string;
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
