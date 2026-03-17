/**
 * Representa las columnas del histórico de productores.
 */
export interface HistoricoColumnas {
  /** Identificador único del productor. */
  id: number;

  /** Nombre completo del productor. */
  nombreProductor: string;

  /** Número de registro fiscal del productor. */
  numeroRegistroFiscal: string;

  /** Dirección del productor. */
  direccion: string;

  /** Correo electrónico del productor. */
  correoElectronico: string;

  /** Número de teléfono de contacto. */
  telefono: string;

  /** Número de fax del productor. */
  fax: string;
}

/**
 * Representa los datos del productor exportador.
 */
export interface ProductorExportador {
  /** Lista de datos históricos de productores. */
  datos: HistoricoColumnas[];
}

/**
 * Representa un elemento de un catálogo.
 */
export interface Catalogo {
  /** Identificador único del elemento del catálogo. */
  id: number;

  /** Descripción del elemento del catálogo. */
  descripcion: string;
}

/**
 * Representa una lista de elementos de un catálogo.
 */
export interface CatalogoLista {
  /** Lista de elementos pertenecientes al catálogo. */
  datos: Catalogo[];
}

/**
 * Representa el formulario para agregar datos del productor.
 */
export interface AgregarDatosProductorFormulario {
  /** Número de registro fiscal del productor. */
  numeroRegistroFiscal: string;

  /** Número de fax del productor. */
  fax: string;
}

/**
 * Representa los datos del grupo receptor.
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
 * Representa los datos del grupo de direcciones.
 */
export interface GrupoDeDirecciones {
  /** Ciudad del domicilio. */
  ciudad: string;

  /** Calle del domicilio. */
  calle: string;

  /** Número o letra del domicilio. */
  numeroLetra: string;

  /** Lada telefónica. */
  lada: string;

  /** Número telefónico. */
  telefono: string;

  /** Número de fax. */
  fax: string;

  /** Correo electrónico. */
  correoElectronico: string;

  /** País correspondiente. */
  pais: string;
}

/**
 * Representa los datos de contacto del certificado de origen.
 */
export interface GrupoCertificadoOrigen {
  /** País del certificado. */
  pais: string;

  /** Ciudad donde se emite el certificado. */
  ciudad: string;

  /** Calle del domicilio indicado. */
  calle: string;

  /** Número o letra del domicilio. */
  numeroLetra: string;

  /** Lada telefónica. */
  lada: string;

  /** Número telefónico. */
  telefono: string;

  /** Número de fax. */
  fax: string;

  /** Correo electrónico de contacto. */
  correoElectronico: string;
}

/**
 * Representa los datos del grupo representativo.
 */
export interface GrupoRepresentativo {
  /** Lugar donde se realiza la representación. */
  lugar: string;

  /** Nombre del exportador. */
  nombreExportador: string;

  /** Nombre de la empresa. */
  empresa: string;

  /** Cargo del representante. */
  cargo: string;

  /** Lada telefónica. */
  lada: string;

  /** Número telefónico. */
  telefono: string;

  /** Número de fax. */
  fax: string;

  /** Correo electrónico del representante. */
  correoElectronico: string;
}

/**
 * Representa una acción asociada a un botón.
 */
export interface AccionBoton {
  /** Nombre o tipo de la acción. */
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
 * Representa los datos del grupo tratado.
 */
export interface GrupoTratado {
  /** Nombre del tratado comercial. */
  tratado: string;

  /** País asociado al tratado. */
  pais: string;

  /** Fracción arancelaria. */
  fraccionArancelaria: string;

  /** Número de registro del tratado. */
  numeroRegistro: string;

  /** Nombre comercial. */
  nombreComercial: string;

  /** Fecha final de vigencia. */
  fechaFinalInput: string;

  /** Fecha inicial de vigencia. */
  fechaInicialInput: string;
}

/**
 * Representa los datos de la tabla de mercancías disponibles.
 */
export interface DisponiblesTabla {
  /** Identificador único de la mercancía. */
  id?: number;

  /** Fracción arancelaria de la mercancía. */
  fraccionArancelaria: string;

  /** Nombre técnico de la mercancía. */
  nombreTecnico: string;

  /** Nombre comercial de la mercancía. */
  nombreComercial: string;

  /** Número de registro de productos. */
  numeroRegistroProductos: string;

  /** Fecha de expedición del producto. */
  fechaExpedicion: string;

  /** Fecha de vencimiento del producto. */
  fechaVencimiento: string;
}

/**
 * Representa los datos de la tabla de mercancías seleccionadas.
 */
export interface SeleccionadasTabla {
  /** Identificador único de la mercancía seleccionada. */
  id: number;

  /** Fracción arancelaria. */
  fraccionArancelaria: string;

  /** Cantidad de mercancía. */
  cantidad: string;

  /** Unidad de medida. */
  unidadMedida: string;

  /** Valor de la mercancía. */
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
 * Representa los datos del formulario de mercancías.
 */
export interface FormularioMercancia {
  /** Fracción arancelaria de la mercancía. */
  fraccionMercanciaArancelaria: string;

  /** Nombre técnico de la mercancía. */
  nombreTecnico: string;

  /** Nombre comercial de la mercancía. */
  nombreComercialDelaMercancia: string;

  /** Criterio para conferir origen. */
  criterioParaConferir: string;

  /** Nombre en inglés. */
  nombreEnIngles: string;

  /** Otras instancias relacionadas. */
  otrasInstancias: string;

  /** Cantidad de mercancía. */
  cantidad: string;

  /** País de origen. */
  pais: string;

  /** Valor de la mercancía. */
  valorDelaMercancia: string;

  /** Descripción complementaria. */
  complementoDelaDescripcion: string;

  /** Tipo de factura. */
  tipoFactura: string;

  /** Fecha de la factura. */
  fecha: string;

  /** Número de factura. */
  numeroFactura: string;
}

/**
 * Representa la respuesta de una consulta realizada en el trámite.
 */
export interface RespuestaConsulta {
  /** Indica si la consulta fue exitosa. */
  success: boolean;

  /** Contiene los datos obtenidos de la consulta. */
  datos: ConsultaDatos;

  /** Mensaje asociado a la respuesta. */
  message: string;
}

/**
 * Representa los datos obtenidos de una consulta en el trámite.
 */
export interface ConsultaDatos {
  /** Indica si existe un tercer operador involucrado. */
  tercerOperador: boolean;

  /** Información del grupo operador. */
  grupoOperador: GrupoOperador;

  /** Información del grupo tratado. */
  grupoTratado: GrupoTratado;

  /** Lista de mercancías seleccionadas. */
  mercanciaSeleccionadasTablaDatos: SeleccionadasTabla[];

  /** Lista de mercancías disponibles. */
  mercanciaDisponsiblesTablaDatos: DisponiblesTabla[];

  /** Observaciones relacionadas con la consulta. */
  observaciones: string;

  /** Idioma utilizado en la consulta. */
  idioma: string;

  /** Entidad federativa asociada. */
  entidadFederativa: string;

  /** Representación federal correspondiente. */
  representacionFederal: string;

  /** Información del grupo receptor. */
  grupoReceptor: GrupoReceptor;

  /** Información del grupo de direcciones. */
  grupoDeDirecciones: GrupoDeDirecciones;

  /** Información de contacto del certificado de origen. */
  grupoCertificadoOrigen: GrupoCertificadoOrigen;

  /** Información del grupo representativo. */
  grupoRepresentativo: GrupoRepresentativo;
}
