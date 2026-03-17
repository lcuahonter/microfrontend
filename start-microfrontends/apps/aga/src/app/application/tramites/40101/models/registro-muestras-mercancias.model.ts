
/**
 * Representa la estructura de datos para un domicilio.
 *
 * @property pais - El país del domicilio.
 * @property codigo_postal - El código postal del domicilio.
 * @property estado - El estado o región del domicilio.
 * @property municipio - El municipio del domicilio (puede ser null si no aplica).
 * @property localidad - La localidad o ciudad del domicilio (puede ser null si no aplica).
 * @property colonia - La colonia o barrio del domicilio (puede ser null si no aplica).
 * @property calle - La calle del domicilio.
 * @property numero_exterior - El número exterior del domicilio.
 * @property numero_interior - El número interior del domicilio (puede estar vacío si no aplica).
 * @property lada - La clave de lada o código de área para el teléfono (puede ser null).
 * @property telefono - El número de teléfono asociado al domicilio (puede ser null).
 */
export interface Domicilio {
  pais: string;
  codigo_postal: string;
  estado: string;
  municipio: string | null;
  localidad: string | null;
  colonia: string | null;
  calle: string;
  numero_exterior: string;
  numero_interior: string;
  lada: string | null;
  telefono: string | null;
}
/**
 * Representa la estructura de datos de un solicitante.
 *
 * @property id_persona_solicitud - Identificador único de la persona o entidad que realiza la solicitud (puede ser null si no aplica).
 * @property rfc - Registro Federal de Contribuyentes del solicitante (puede ser null si no aplica).
 * @property razon_social - Razón social o nombre completo del solicitante (puede ser null si no aplica).
 * @property correo_electronico - Correo electrónico del solicitante (puede ser null si no aplica).
 * @property descripcion_giro - Descripción del giro o actividad del solicitante (puede ser null si no aplica).
 * @property domicilio - Domicilio del solicitante, de tipo `Domicilio`.
 */
export interface Solicitante {
  id_persona_solicitud: number | null;
  rfc: string | null;
  razon_social: string | null;
  correo_electronico: string | null;
  descripcion_giro: string | null;
  domicilio: Domicilio;
}

/**
 * Representa la estructura de la respuesta de la API para un solicitante.
 *
 * @property codigo - Código de estatus de la respuesta de la API.
 * @property mensaje - Mensaje general de la respuesta de la API.
 * @property datos - Objeto que contiene la información específica de la solicitud.
 */

export interface ApiResponseSolicitante {
  codigo: string;
  mensaje: string;
  datos: {
    mostrar_director_general: boolean;
    cve_folio_caat?: string;
    num_folio_caat?: string;
    fecha_de_vigencia?: string;
    id_solicitud?: number;
    is_extranjero?: boolean;
    documento_detalle?: {
      llave_archivo?: string;
      contenido?: string
      nombre_archivo?: string;
      url_archivo?: string;
    };
    solicitante: Solicitante;
    caat_existe: boolean;
    mensaje: string
  };
}
/**
 * Representa la estructura de la respuesta de la API para un chofer.
 *
 * @property codigo - Código de estatus de la respuesta de la API (puede ser null).
 * @property mensaje - Mensaje general de la respuesta de la API (puede ser null).
 * @property datos - Objeto que contiene la información específica del chofer.
 */
export interface ApiResponseChofer {
  codigo: string | null;
  mensaje: string | null;
  datos: {
    curp: string | null;
    rfc: string | null;
    nss: string | null;
    nombre: string | null;
    primer_apellido: string | null;
    segundo_apellido: string | null;
    nacionalidad: string | null;
    numero_de_gafete: string | null;
    vigencia_del_gafete: string | null;
    estado_fisico_gafete: string | null;
    estado_gafete: string | null;
    estado_solicitud: string | null;
    domicilio: {
      pais: string | null;
      codigo_postal: string | null;
      correo_electronico: string | null;
      pais_de_residencia: string | null
      estado: string | null;
      municipio: string | null;
      localidad: string | null;
      colonia: string | null;
      ciudad: string | null
      calle: string | null;
      numero_exterior: string | null;
      numero_interior: string | null;
      lada: string | null;
      telefono: string | null;
    };
  };
}


/**
 * Representa la configuración de la tabla de unidades de arrastre.
 *
 * @property encabezadas - Lista de encabezados de la tabla, cada uno con su texto, función para extraer valor y orden.
 * @property datos - Lista de datos de unidades de arrastre que se mostrarán en la tabla.
 */
export interface UnidadTablaConfig {
  /**
   * Lista de encabezados de la tabla.
   */
  encabezadas: {
    encabezado: string;
    clave: (item: UnidadTabla) => string;
    orden: number;
  }[];

  /**
   * Lista de datos de unidades de arrastre que se mostrarán en la tabla.
   */
  datos: UnidadTabla[];
}
/**
 * Interfaz que representa un catálogo importante de selección.
 *
 */
import { Catalogo, CatalogosSelect } from '@ng-mf/data-access-user';
import { TableData } from '@ng-mf/data-access-user';

/**
 * Representa una selección importante del catálogo para el registro de muestras de mercancías.
 *
 * @property {CatalogosSelect} importadorExportadorPrevio - Selección previa del importador/exportador.
 * @property {CatalogosSelect} fraccionArancelariaAga - Selección de la fracción arancelaria AGA.
 * @property {CatalogosSelect} nico - Selección del NICO.
 * @property {CatalogosSelect} ideGenerica - Selección de la IDE genérica.
 * @property {CatalogosSelect} tomaMuestraDespacho - Selección de la toma de muestra en despacho.
 * @property {TableData} requisitosObligatoriosTabla - Tabla de requisitos obligatorios.
 * @property {TableData} tablaDeTarifasDePago - Tabla de tarifas de pago.
 */
export interface ImportanteCatalogoSeleccion {
  /**
   * Selección previa del importador/exportador.
   */
  importadorExportadorPrevio: CatalogosSelect;

  /**
   * Selección de la fracción arancelaria AGA.
   */
  fraccionArancelariaAga: CatalogosSelect;

  /**
   *  Selección del NICO.
   */
  nico: CatalogosSelect;

  /**
   * Selección de la IDE genérica.
   */
  ideGenerica: CatalogosSelect;
  /**
   * Selección de la toma de muestra en despacho.
   */
  tomaMuestraDespacho: CatalogosSelect;
  /**
   * Tabla de requisitos obligatorios.
   */
  requisitosObligatoriosTabla: TableData;

  /**
   *  Tabla de tarifas de pago.
   */
  tablaDeTarifasDePago: TableData;

  /**
   * Almacena las fechas de validez de la autorización.
   */
  validezDeLaAutorizacion: ListaDeFechas;

  /**
   * Almacena los datos del registro de muestras.
   */
  registroMuestrasDatos: RegistroMuestras;

  /**
   * Lista de pagos de derechos asociados a la solicitud.
   * Contiene información sobre los pagos realizados o pendientes.
   */
  datosDelChoferNacional: DatosDelChoferNacional[];
}
/**
 * Representa un registro de muestras de mercancías.
 */
export interface RegistroMuestras {
  /**
   * Opción del importador seleccionada en el registro.
   */
  opcionDeImportador: string;

  /**
   * Indica si se tomó una muestra en el despacho.
   */
  tomaMuestraDespacho: string;

  /**
   * Motivo de la falta de muestra, si no se realizó la toma de muestra.
   */
  descMotivoFaltaMuestra: string;

  /**
   * Valor combinado de fracción arancelaria seleccionado en un combo.
   */
  comboFraccionConcatenada: string;

  /**
   * Código de la fracción arancelaria.
   */
  fraccionConcatenada: string;

  /**
   * Descripción de la fracción arancelaria.
   */
  fracciondescripcion: string;

  /**
   * Valor combinado de NICOS seleccionado en un combo.
   */
  comboNicos: string;

  /**
   * Descripción del NICOS asociado.
   */
  nicoDescripcion: string;

  /**
   * Nombre químico de la sustancia o mercancía.
   */
  nombreQuimico: string;

  /**
   * Nombre comercial de la sustancia o mercancía.
   */
  nombreComercial: string;

  /**
   * Número CAS (Chemical Abstracts Service) de la sustancia.
   */
  numeroCAS: string;

  /**
   * Identificación genérica de la mercancía.
   */
  ideGenerica: number;

  /**
   * Descripción detallada del producto en formato CLOB (Character Large Object).
   */
  descClobGenerica: string;
}

/**
 * Representa una lista de fechas.
 */
export interface ListaDeFechas {
  /**
   * Representa la fecha de inicio de vigencia.
   */
  fechaInicioVigencia: string;
  /**
   * Representa la fecha de fin de vigencia.
   */
  fechaFinVigencia: string;
}

/**
 * Interfaz que representa el estado de almacenamiento de muestras de mercancías.
 * Contiene información sobre autorizaciones, registros, pagos y catálogos relacionados
 * con importaciones y exportaciones.
 */
export interface MuestrasMercanciasStore {
  /**
   * Almacena las fechas de validez de la autorización.
   */
  validezDeLaAutorizacion: ListaDeFechas;

  /**
   * Almacena los registros de muestras y sus renovaciones.
   */
  renovacionesDeRegistro: RegistroMuestras;

  /**
   * Almacena los detalles del pago, incluyendo encabezados y datos de la tabla.
   */
  pagoDeDerechos: TableData;

  /**
   * Almacena el catálogo de importadores/exportadores previos.
   */
  importadorExportadorPrevio: CatalogosSelect;

  /**
   * Almacena el catálogo de fracciones arancelarias de la AGA (Aduana General de la Nación).
   */
  fraccionArancelariaAga: CatalogosSelect;

  /**
   * Almacena el catálogo de NICO (Número de Identificación Comercial).
   */
  nico: CatalogosSelect;

  /**
   * Almacena el catálogo de IDE genérico (Identificación de Especificaciones).
   */
  ideGenerica: CatalogosSelect;

  /**
   * Almacena el catálogo relacionado con la toma de muestras durante el despacho.
   */
  tomaMuestraDespacho: CatalogosSelect;
}



/**
 * Representa los datos de un chofer nacional.
 *
 * @property id - Identificador del chofer (tipo desconocido, puede adaptarse según la implementación).
 * @property curp - CURP del chofer (opcional).
 * @property rfc - RFC del chofer (opcional).
 * @property nombre - Nombre del chofer (opcional).
 * @property primerApellido - Primer apellido del chofer (opcional).
 * @property segundoApellido - Segundo apellido del chofer (opcional).
 * @property numeroDeGafete - Número del gafete del chofer (opcional).
 * @property vigenciaGafete - Fecha de vigencia del gafete (opcional).
 * @property calle - Calle del domicilio del chofer (opcional).
 * @property numeroExterior - Número exterior del domicilio (opcional).
 * @property numeroInterior - Número interior del domicilio (opcional).
 * @property pais - País del domicilio (opcional).
 * @property estado - Estado o región del domicilio (opcional).
 * @property municipioAlcaldia - Municipio o alcaldía del domicilio (opcional).
 * @property colonia - Colonia o barrio del domicilio (opcional).
 * @property paisDeResidencia - País de residencia del chofer (opcional).
 * @property ciudad - Ciudad del domicilio (opcional).
 * @property localidad - Localidad del domicilio (opcional).
 * @property codigoPostal - Código postal del domicilio (opcional).
 * @property telefono - Teléfono del chofer.
 * @property correoElectronico - Correo electrónico del chofer.
 */
export interface DatosDelChoferNacional {
  id: unknown;
  curp?: string;
  rfc?: string;

  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  numeroDeGafete?: string;
  vigenciaGafete?: string;


  calle?: string;
  numeroExterior?: string;
  numeroInterior?: string;
  pais?: string;
  estado?: string;
  municipioAlcaldia?: string;
  colonia?: string;
  paisDeResidencia?: string;
  ciudad?: string;
  localidad?: string;
  codigoPostal?: string;


  telefono: string;
  correoElectronico: string;
}

/**
 * Representa los datos de choferes extranjeros.
 *
 * @property nombre - Nombre del chofer (opcional).
 * @property primerApellido - Primer apellido del chofer (opcional).
 * @property segundoApellido - Segundo apellido del chofer (opcional).
 * @property nacionalidad - Nacionalidad del chofer (opcional).
 * @property numeroDeGafete - Número del gafete del chofer (opcional).
 * @property vigenciaGafete - Fecha de vigencia del gafete (opcional).
 * @property numeroDelSeguroSocial - Número de seguro social (opcional).
 * @property numberDeIdeFiscal - Número de identificación fiscal (opcional).
 * @property identificadorFiscal - Identificador fiscal del chofer (opcional).
 * @property pais - País de origen del chofer (opcional).
 * @property apellidoPaterno - Apellido paterno del chofer (opcional).
 * @property codigoPostal - Código postal del domicilio del chofer (opcional).
 * @property estado - Estado o región del domicilio (opcional).
 * @property calle - Calle del domicilio (opcional).
 * @property numeroExterior - Número exterior del domicilio (opcional).
 * @property numeroInterior - Número interior del domicilio (opcional).
 * @property paisDeResidencia - País de residencia del chofer (opcional).
 * @property ciudad - Ciudad del domicilio (opcional).
 * @property correoElectronico - Correo electrónico del chofer (opcional).
 * @property telefono - Teléfono del chofer (opcional).
 */

export interface ChoferesExtranjeros {
  /** Línea de captura del pago. */
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;

  nacionalidad?: string;
  numeroDeGafete?: string;
  vigenciaGafete?: string;

  numeroDelSeguroSocial?: string;
  numberDeIdeFiscal?: string;
  identificadorFiscal?: string
  pais?: string;

  apellidoPaterno?: string;
  codigoPostal?: string;
  estado?: string;

  calle?: string;
  numeroExterior?: string;
  numeroInterior?: string;

  paisDeResidencia?: string;
  ciudad?: string;

  correoElectronico?: string;
  telefono?: string;
}

/**
 * Representa los datos de la lista de pagos de derechos.
 *
 * @property numero - Línea de captura del pago (opcional).
 * @property calle - Calle del domicilio (opcional).
 * @property estado - Estado o región del domicilio (opcional).
 * @property pais - País del domicilio (opcional).
 * @property apellidoPaterno - Apellido paterno de la persona (opcional).
 * @property apellidoMaterno - Apellido materno de la persona (opcional).
 * @property rfc - Registro Federal de Contribuyentes (opcional).
 * @property gafete - Número del gafete (opcional).
 * @property vigenciaGafete - Fecha de vigencia del gafete (opcional).
 * @property municipio - Municipio del domicilio (opcional).
 * @property colonia - Colonia o barrio del domicilio (opcional).
 * @property paisOrigen - País de origen de la persona (opcional).
 * @property ciudad - Ciudad del domicilio (opcional).
 * @property curp - CURP de la persona (opcional).
 * @property númeroExterior - Número exterior del domicilio (opcional).
 * @property númeroInterior - Número interior del domicilio (opcional).
 * @property país - País de residencia de la persona (opcional, puede diferir de `pais`).
 * @property primerApellido - Primer apellido de la persona (opcional).
 * @property segundoApellido - Segundo apellido de la persona (opcional).
 * @property númeroDeGafete - Número del gafete (opcional, puede duplicar `gafete`).
 * @property fechaFindDeVigencia - Fecha final de vigencia del gafete (opcional).
 * @property municipioAlcaldía - Municipio o alcaldía del domicilio (opcional).
 * @property PaísDeResidencia - País de residencia de la persona (opcional, diferente de `pais` y `paisOrigen`).
 */
export interface PagoDerechosLista {
  /** Línea de captura del pago. */
  numero?: string;
  calle?: string;
  estado?: string;
  pais?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  rfc?: string;
  gafete?: string;
  vigenciaGafete?: string;
  municipio?: string;
  colonia?: string;
  paisOrigen?: string;
  ciudad?: string;
  curp?: string;
  númeroExterior?: string;
  númeroInterior?: string;
  país?: string;
  primerApellido?: string;
  segundoApellido?: string;
  númeroDeGafete?: string;
  fechaFindDeVigencia?: string;
  municipioAlcaldía?: string;
  PaísDeResidencia?: string;
}

/**
 * Representa la información de un vehículo relacionado con una solicitud.
 *
 * @property id - Identificador único del vehículo.
 * @property solicitudVehiculoVin2 - Número de identificación del vehículo (VIN).
 * @property solicitudVehiculoTipoVehiculo - Tipo de vehículo (por ejemplo, automóvil, camión).
 * @property solicitudVehiculoNumeroEconomico - Número económico asignado al vehículo.
 * @property solicitudVehiculoNumeroPlacas - Número de placas del vehículo.
 * @property solicitudVehiculoPaisEmisor - País que emitió las placas del vehículo.
 * @property solicitudDomicilioEstado - Estado de registro del vehículo.
 * @property solicitudVehiculoMarca - Marca del vehículo.
 * @property solicitudVehiculoModelo - Modelo del vehículo.
 * @property anioVehiculoVEH - Año del vehículo.
 * @property solicitudVehiculoTransponder - Número del transponder del vehículo.
 * @property solicitudVehiculoColor - Color del vehículo.
 * @property solicitudVehiculoNumero2daPlaca - Número de la segunda placa (opcional).
 * @property solicitudVehiculoEmisor2daPlaca - Emisor de la segunda placa (opcional).
 * @property solicitudVehiculoPaisEmisorSegundaPlaca - País emisor de la segunda placa (opcional).
 * @property solicitudVehiculoDesc - Descripción adicional del vehículo (opcional).
 */

export interface Vehiculo {
  id: number;
  solicitudVehiculoVin2: string;
  solicitudVehiculoTipoVehiculo: string;
  solicitudVehiculoNumeroEconomico: string;
  solicitudVehiculoNumeroPlacas: string;
  solicitudVehiculoPaisEmisor: string;
  solicitudDomicilioEstado: string;
  solicitudVehiculoMarca: string;
  solicitudVehiculoModelo: string;
  anioVehiculoVEH: string;
  solicitudVehiculoTransponder: string;
  solicitudVehiculoColor: string;
  solicitudVehiculoNumero2daPlaca?: string;
  solicitudVehiculoEmisor2daPlaca?: string;
  solicitudVehiculoPaisEmisorSegundaPlaca?: string;
  solicitudVehiculoDesc?: string;
}

/**
 * Representa la información de un chofer, incluyendo datos personales,
 * de contacto y fiscales, así como información de gafete y domicilio.
 *
 * @property descripcion - Descripción del chofer o su rol.
 * @property clave - Clave identificadora del chofer.
 * @property id - Identificador único del chofer.
 * @property curp - CURP del chofer (opcional).
 * @property rfc - RFC del chofer (opcional).
 * @property nombre - Nombre del chofer (opcional).
 * @property apellidoPaterno - Apellido paterno del chofer (opcional).
 * @property apellidoMaterno - Apellido materno del chofer (opcional).
 * @property gafete - Número de gafete del chofer (opcional).
 * @property vigenciagafete - Fecha de vigencia del gafete (opcional).
 * @property calle - Calle del domicilio del chofer (opcional).
 * @property numeroExterior - Número exterior del domicilio (opcional).
 * @property numeroInterior - Número interior del domicilio (opcional).
 * @property ciudad - Ciudad del domicilio (opcional).
 * @property localidad - Localidad del domicilio (opcional).
 * @property codigoPostal - Código postal del domicilio (opcional).
 * @property paisChn - País del domicilio en formato CHN (opcional).
 * @property estado - Estado o región del domicilio (opcional).
 * @property numerodelsegurosocial - Número de seguro social (opcional).
 * @property entidadFederativaCHN - Entidad federativa en formato CHN (opcional).
 * @property delegacionCHN - Delegación en formato CHN (opcional).
 * @property coloniaCHN - Colonia en formato CHN (opcional).
 * @property paisOrigenCHN - País de origen en formato CHN (opcional).
 * @property correo - Correo electrónico del chofer (opcional).
 * @property telefono - Teléfono del chofer (opcional).
 * @property nacionalidadCHE - Nacionalidad en formato CHE (opcional).
 * @property nss - Número de seguro social (opcional, duplicado de numerodelsegurosocial).
 * @property ideFiscal - Identificador fiscal (opcional).
 * @property paisCHE - País en formato CHE (opcional).
 * @property entidadFederativaCHE - Entidad federativa en formato CHE (opcional).
 * @property paisOrigenCHE - País de origen en formato CHE (opcional).
 */

export interface Chofer {
  descripcion: string;
  clave: string;
  id: number;
  curp?: string;
  rfc?: string;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  gafete?: string;
  vigenciagafete?: string;
  calle?: string;
  numeroExterior?: string;
  numeroInterior?: string;
  ciudad?: string;
  localidad?: string;
  codigoPostal?: string;
  paisChn?: string;
  estado?: string;
  numerodelsegurosocial?: string;
  entidadFederativaCHN?: string;
  delegacionCHN?: string;
  coloniaCHN?: string;
  paisOrigenCHN?: string;
  correo?: string;
  telefono?: string;
  nacionalidadCHE?: string;
  nss?: string;
  ideFiscal?: string;
  paisCHE?: string;
  entidadFederativaCHE?: string;
  paisOrigenCHE?: string;
}

/**
 * Representa la estructura de datos para un Director General.
 *
 * @property nombre - El nombre del Director General.
 * @property primerApellido - El primer apellido del Director General.
 * @property segundoApellido - El segundo apellido del Director General.
 * @property apellidoPaterno - El apellido paterno del Director General.
 * @property apellidoMaternoCHN - El apellido materno del Director General en formato CHN.
 */
export interface DirectorGeneralData {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  apellidoPaterno: string;
  apellidoMaternoCHN: string;
}


/**
 * Interfaz que representa la estructura de la tabla de vehículos.
 *
 * @property datos - Lista de vehículos.
 * @property numero - Número del vehículo.
 * @property tipoDeVehiculo - Tipo de vehículo.
 * @property idDeVehiculo - Identificador del vehículo.
 * @property numeroPlaca - Número de placa.
 * @property paisEmisor - País emisor.
 * @property estado - Estado.
 * @property marca - Marca.
 * @property modelo - Modelo.
 * @property ano - Año.
 * @property transponder - Transponder.
 * @property colorVehiculo - Color del vehículo.
 * @property numuroEconomico - Número económico.
 * @property numero2daPlaca - Número de segunda placa.
 * @property estado2daPlaca - Estado de la segunda placa.
 * @property paisEmisor2daPlaca - País emisor de la segunda placa.
 * @property descripcion - Descripción.
 */
export interface VehiculoTabla {
  datos: VehiculoTabla[];
  numero: string;
  tipoDeVehiculo: string;
  idDeVehiculo: string;
  numeroPlaca: string;
  paisEmisor: string;
  estado: string;
  marca: string;
  modelo: string;
  ano: string;
  transponder: string;
  colorVehiculo: string;
  numuroEconomico: string;
  numero2daPlaca: string;
  estado2daPlaca: string;
  paisEmisor2daPlaca: string;
  descripcion: string;
}
/**
 * Interfaz que representa los datos de un vehículo.
 *
 * @property numero - Número del vehículo.
 * @property tipoDeVehiculo - Tipo de vehículo.
 * @property idDeVehiculo - Identificador del vehículo.
 * @property numeroPlaca - Número de placa.
 * @property paisEmisor - País emisor.
 * @property estado - Estado.
 * @property marca - Marca.
 * @property modelo - Modelo.
 * @property ano - Año.
 * @property transponder - Transponder.
 * @property colorVehiculo - Color del vehículo.
 * @property numuroEconomico - Número económico.
 * @property numero2daPlaca - Número de segunda placa.
 * @property estado2daPlaca - Estado de la segunda placa.
 * @property paisEmisor2daPlaca - País emisor de la segunda placa.
 * @property descripcion - Descripción.
 */
export interface DatosVehiculo {
  numero: string;
  tipoDeVehiculo: string;
  idDeVehiculo: string;
  numeroPlaca: string;
  paisEmisor: string;
  estado: string;
  marca: string;
  modelo: string;
  ano: string;
  transponder: string;
  colorVehiculo: string;
  numuroEconomico: string;
  numero2daPlaca: string;
  estado2daPlaca: string;
  paisEmisor2daPlaca: string;
  descripcion: string;
}
/**
 * Interfaz que representa los datos de una unidad de arrastre.
 *
 * @property vinVehiculo - VIN del vehículo.
 * @property tipoDeUnidadArrastre - Tipo de unidad de arrastre.
 * @property idDeVehiculo - Identificador del vehículo.
 * @property numeroEconomico - Número económico.
 * @property numeroPlaca - Número de placa.
 * @property paisEmisor - País emisor.
 * @property estado - Estado.
 * @property colorVehiculo - Color del vehículo.
 * @property numero2daPlaca - Número de segunda placa.
 * @property estado2daPlaca - Estado de la segunda placa.
 * @property paisEmisor2daPlaca - País emisor de la segunda placa.
 * @property descripcion - Descripción.
 */
export interface DatosUnidad {
  vinVehiculo: string;
  tipoDeUnidadArrastre: string;
  idDeVehiculoUnidad: string;
  numeroEconomico: string;
  numeroPlaca: string;
  paisEmisor: string;
  estado: string;
  colorVehiculo: string;
  numero2daPlaca: string;
  estado2daPlaca: string;
  paisEmisor2daPlaca: string;
  descripcion: string;
}

/**
 * Interfaz que representa una lista de catálogos.
 *
 * @property datos - Lista de catálogos.
 */
export interface CatalogoLista {
  codigo: string;
  mensaje: string;
  datos: Catalogo[];
}

/**
 * Interfaz que representa los datos de la tabla de vehículos.
 *
 * @property datos - Lista de vehículos en la tabla.
 */
export interface VehiculoTablaDatos {
  /**
   * Lista de mercancías en la tabla.
   */
  datos: VehiculoTabla[];
}
/**
 * Interfaz que representa una unidad de arrastre en la tabla.
 *
 * @property vinVehiculo - VIN del vehículo.
 * @property tipoDeUnidadArrastre - Tipo de unidad de arrastre.
 * @property numeroEconomico - Número económico.
 * @property numeroPlaca - Número de placa.
 * @property paisEmisor - País emisor.
 * @property estado - Estado.
 */
export interface UnidadTabla {
  idDeVehiculoUnidad: number;
  vinVehiculo: string;
  tipoDeUnidadArrastre: string;
  numeroEconomico: string;
  numeroPlaca: string;
  paisEmisor: string;
  estado: string;

  // Se agregaron los campos que faltaban de sus datos.
  colorVehiculo: string;
  descripcion: string;
  estado2daPlaca: string;
  numero2daPlaca: string;
  paisEmisor2daPlaca: string;
}

/**
 * Interfaz que define la configuración de la tabla de vehículos.
 * Contiene encabezados y datos para la visualización en una tabla.
 */
export interface VehiculoTablaConfig {
  /**
   * Lista de encabezados de la tabla.
   */
  encabezadas: {
    encabezado: string;
    clave: (item: VehiculoTabla) => string;
    orden: number;
  }[];

  /**
   * Lista de datos de vehículos que se mostrarán en la tabla.
   */
  datos: VehiculoTabla[];
}
