/**
 * Representa las columnas del histórico de productores.
 * 
 * Esta interfaz define la estructura de datos para mostrar información
 * histórica de los productores registrados en el sistema.
 */
export interface HistoricoColumnas {
  /** Identificador único del productor */
  id: number;
  
  /** Nombre completo del productor */
  nombreProductor: string;
  
  /** Número de registro fiscal del productor */
  numeroRegistroFiscal: string;
  
  /** Dirección completa del productor */
  direccion: string;
  
  /** Correo electrónico de contacto del productor */
  correoElectronico: string;
  
  /** Número telefónico de contacto del productor */
  telefono: string;
  
  /** Número de fax del productor (opcional) */
  fax: string;

  /** Indica si el productor es nuevo. */
  nuevo?: boolean;
}
/**
 * Representa los datos del productor exportador.
 * 
 * Esta interfaz encapsula la información relacionada con
 * el productor que actúa como exportador en las operaciones comerciales.
 */
export interface ProductorExportador {
  /** Array de datos históricos de las columnas del productor */
  datos: HistoricoColumnas[];
}
/**
 * Representa un elemento de un catálogo.
 * 
 * Esta interfaz define la estructura básica de los elementos
 * que forman parte de los catálogos del sistema.
 */
export interface Catalogo {
  /** Identificador único del elemento del catálogo */
  id: number;
  
  /** Descripción textual del elemento del catálogo */
  descripcion: string;
}
/**
 * Representa una lista de elementos de un catálogo.
 * 
 * Esta interfaz encapsula un conjunto de elementos del catálogo
 * que pueden ser utilizados en diferentes partes del sistema.
 */
export interface CatalogoLista {
  /** Array de elementos del catálogo */
  datos: Catalogo[];
}
/**
 * Representa el formulario para agregar datos del productor.
 * 
 * Esta interfaz define la estructura de datos necesaria
 * para capturar información adicional del productor.
 */
export interface AgregarDatosProductorFormulario {
  /** Número de registro fiscal del productor */
  numeroRegistroFiscal: string;
  
  /** Número de fax del productor (opcional) */
  fax: string;
}
/**
 * Representa los datos del grupo receptor.
 * 
 * Esta interfaz define la información personal y comercial
 * del receptor de las mercancías en el certificado de origen.
 */
export interface GrupoReceptor {
  /** Nombre del receptor */
  nombres: string;
  
  /** Primer apellido del receptor */
  primerApellido: string;
  
  /** Segundo apellido del receptor */
  segundoApellido: string;
  
  /** Número fiscal del receptor */
  numeroDeRegistroFiscal: string;
  
  /** Razón social del receptor (para personas morales) */
  razonSocial: string;
}
/**
 * Representa los datos del grupo de direcciones.
 * 
 * Esta interfaz contiene la información de ubicación y contacto
 * utilizada en los certificados de origen.
 */
export interface GrupoDeDirecciones {
  /** Ciudad donde se encuentra la dirección */
  ciudad: string;
  
  /** Nombre de la calle de la dirección */
  calle: string;
  
  /** Número y letra de la dirección */
  numeroLetra: string;
  
  /** Código de área telefónica (LADA) */
  lada: string;
  
  /** Número telefónico de contacto */
  telefono: string;
  
  /** Número de fax (opcional) */
  fax: string;
  
  /** Dirección de correo electrónico */
  correoElectronico: string;

  /** Pais */
  pais: string;
}
/**
 * Representa los datos del grupo representativo.
 * 
 * Esta interfaz define la información del representante legal
 * o comercial del exportador en las operaciones.
 */
export interface GrupoRepresentativo {
  /** Lugar donde se encuentra el representante */
  lugar: string;
  
  /** Nombre del exportador representado */
  nombreExportador: string;
  
  /** Empresa del representante */
  empresa: string;
  
  /** Cargo del representante en la empresa */
  cargo: string;
  
  /** Código de área telefónica (LADA) */
  lada: string;
  
  /** Número telefónico del representante */
  telefono: string;
  
  /** Número de fax del representante (opcional) */
  fax: string;
  
  /** Dirección de correo electrónico del representante */
  correoElectronico: string;
}
/**
 * Representa los datos del grupo de transporte.
 * 
 * Esta interfaz contiene la información relacionada con el transporte
 * de las mercancías en el proceso de exportación.
 */
export interface GrupoDeTransporte {
  /** Puerto de embarque de las mercancías */
  puertoEmbarque: string;
  
  /** Puerto de desembarque de las mercancías */
  puertoDesembarque: string;
  
  /** Puerto de tránsito (si aplica) */
  puertoTransito: string;
  
  /** Nombre de la embarcación utilizada para el transporte */
  nombreEmbarcacion: string;
  
  /** Número de vuelo (para transporte aéreo) */
  numeroVuelo: string;
}
/**
 * Representa una acción de un botón.
 * 
 * Esta interfaz define la estructura para las acciones
 * que pueden ejecutarse a través de botones en la interfaz.
 */
export interface AccionBoton {
  /** Nombre de la acción a ejecutar */
  accion: string;
  
  /** Valor numérico asociado a la acción */
  valor: number;
}

/**
 * Representa los datos del grupo operador.
 * 
 * Esta interfaz define la información personal y comercial
 * del operador responsable de las operaciones comerciales.
 */
export interface GrupoOperador {
  /** Nombre del operador */
  nombre: string;
  
  /** Primer apellido del operador */
  apellidoPrimer: string;
  
  /** Segundo apellido del operador */
  apellidoSegundo: string;
  
  /** Número fiscal del operador */
  numeroFiscal: string;
  
  /** Razón social del operador (para personas morales) */
  razonSocial: string;
}
/**
 * Representa los datos del grupo de domicilio.
 * 
 * Esta interfaz contiene la información completa de ubicación
 * y contacto del domicilio relacionado con el certificado.
 */
export interface GrupoDeDomicilio {
  /** País donde se encuentra el domicilio */
  pais: string;
  
  /** Ciudad del domicilio */
  ciudad: string;
  
  /** Nombre de la calle del domicilio */
  calle: string;
  
  /** Número y letra del domicilio */
  numeroLetra: string;
  
  /** Código de área telefónica (LADA) */
  lada: string;
  
  /** Número telefónico del domicilio */
  telefono: string;
  
  /** Número de fax del domicilio (opcional) */
  fax: string;
  
  /** Dirección de correo electrónico del domicilio */
  correoElectronico: string;
}
/**
 * Representa los datos del grupo tratado.
 * 
 * Esta interfaz define la información relacionada con los tratados
 * comerciales y la clasificación arancelaria de las mercancías.
 */
export interface GrupoTratado {
  /** Nombre del tratado comercial aplicable */
  tratado: string;
  
  /** País asociado al tratado */
  pais: string;
  
  /** Fracción arancelaria de la mercancía */
  fraccionArancelaria: string;
  
  /** Número de registro asociado */
  numeroRegistro: string;
  
  /** Nombre comercial de la mercancía */
  nombreComercial: string;
  
  /** Fecha final de vigencia (formato input) */
  fechaFinalInput: string;
  
  /** Fecha inicial de vigencia (formato input) */
  fechaInicialInput: string;
}

/**
 * Representa los datos de la tabla de mercancías disponibles.
 * 
 * Esta interfaz define la estructura de las mercancías que están
 * disponibles para ser incluidas en el certificado de origen.
 */
export interface DisponiblesTabla {
  /** Identificador único de la mercancía (opcional) */
  id?: number;
  
  /** Fracción arancelaria de la mercancía */
  fraccionArancelaria: string;
  
  /** Nombre técnico de la mercancía */
  nombreTecnico: string;
  
  /** Nombre comercial de la mercancía */
  nombreComercial: string;
  
  /** Número de registro de productos */
  numeroRegistroProductos: string;
  
  /** Fecha de expedición del registro */
  fechaExpedicion: string;
  
  /** Fecha de vencimiento del registro */
  fechaVencimiento: string;
}
/**
 * Representa los datos de la tabla de mercancías seleccionadas.
 * 
 * Esta interfaz define la estructura de las mercancías que han sido
 * seleccionadas para incluir en el certificado de origen.
 */
export interface SeleccionadasTabla {
  /** Identificador único de la mercancía seleccionada */
  id: number;
  
  /** Fracción arancelaria de la mercancía */
  fraccionArancelaria: string;
  
  /** Cantidad de la mercancía */
  cantidad: string;
  
  /** Unidad de medida de la cantidad */
  unidadMedida: string;
  
  /** Valor monetario de la mercancía */
  valorMercancia: string;
  
  /** Tipo de factura asociada */
  tipoFactura: string;
  
  /** Número de la factura */
  numFactura: string;
  
  /** Descripción complementaria de la mercancía */
  complementoDescripcion: string;
  
  /** Fecha de emisión de la factura */
  fechaFactura: string;
}
/**
 * Representa los datos del formulario de mercancías.
 * 
 * Esta interfaz define la estructura completa del formulario
 * utilizado para capturar información detallada de las mercancías.
 */
export interface FormularioMercancia {
  /** Fracción arancelaria de la mercancía */
  fraccionMercanciaArancelaria: string;
  
  /** Nombre técnico de la mercancía */
  nombreTecnico: string;
  
  /** Nombre comercial de la mercancía */
  nombreComercialDelaMercancia: string;
  
  /** Criterio utilizado para conferir el origen */
  criterioParaConferir: string;
  
  /** Nombre de la mercancía en idioma inglés */
  nombreEnIngles: string;
  
  /** Otras instancias relacionadas con la mercancía */
  otrasInstancias: string;
  
  /** Cantidad de la mercancía */
  cantidad: string;
  
  /** País de origen de la mercancía */
  pais: string;
  
  /** Valor monetario de la mercancía */
  valorDelaMercancia: string;
  
  /** Descripción complementaria de la mercancía */
  complementoDelaDescripcion: string;
  
  /** Tipo de factura asociada */
  tipoFactura: string;
  
  /** Fecha relacionada con la mercancía */
  fecha: string;
  
  /** Número de la factura */
  numeroFactura: string;
}

/**
 * Representa la respuesta de una consulta del certificado de origen.
 * 
 * Esta interfaz define la estructura de la respuesta que se recibe
 * al realizar consultas relacionadas con certificados de origen.
 * 
 * @interface RespuestaConsulta
 */
export interface RespuestaConsulta {
  /** Indica si la consulta fue exitosa */
  success: boolean;
  
  /** Datos obtenidos de la consulta */
  datos: ConsultaDatos;
  
  /** Mensaje informativo sobre el resultado de la consulta */
  message: string;
}

/**
 * Representa los datos de la consulta del certificado de origen.
 * 
 * Esta interfaz contiene toda la información necesaria para procesar
 * y gestionar un certificado de origen, incluyendo datos del operador,
 * mercancías, transporte y documentación relacionada.
 * 
 * @interface ConsultaDatos
 */
export interface ConsultaDatos {
  /** Indica si se utiliza un tercer operador */
  tercerOperador: boolean;
  
  /** Información del grupo operador */
  grupoOperador: GrupoOperador;
  
  /** Información del grupo tratado */
  grupoTratado: GrupoTratado;
  
  /** Información del grupo de domicilio */
  grupoDeDomicilio: GrupoDeDomicilio;
  
  /** Array de mercancías seleccionadas en la tabla */
  mercanciaSeleccionadasTablaDatos: SeleccionadasTabla[];
  
  /** Array de mercancías disponibles en la tabla */
  mercanciaDisponsiblesTablaDatos: DisponiblesTabla[];
  
  /** Observaciones adicionales del certificado */
  observaciones: string;
  
  /** Idioma del certificado */
  idioma: string;
  
  /** Entidad federativa asociada */
  entidadFederativa: string;
  
  /** Representación federal correspondiente */
  representacionFederal: string;
  
  /** Información del grupo receptor */
  grupoReceptor: GrupoReceptor;
  
  /** Información del grupo de direcciones */
  grupoDeDirecciones: GrupoDeDirecciones;
  
  /** Información del grupo representativo */
  grupoRepresentativo: GrupoRepresentativo;
  
  /** Información del grupo de transporte */
  grupoDeTransporte: GrupoDeTransporte;
  
  /** Indica si los datos del productor son confidenciales */
  datosConfidencialesProductor: boolean;
  
  /** Indica si el productor es el mismo exportador */
  productorMismoExportador: boolean;
  
  /** Array de productores exportadores históricos */
  productoresExportador: HistoricoColumnas[];
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
