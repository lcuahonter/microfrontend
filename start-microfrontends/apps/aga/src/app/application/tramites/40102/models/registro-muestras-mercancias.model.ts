/**
 * Modelos de datos para el trámite 40102 relacionado con el registro de muestras de mercancías.
 *
 * Este archivo contiene todas las interfaces y tipos de datos utilizados en el proceso
 * de registro de muestras de mercancías, incluyendo catálogos de selección, datos de 
 * choferes nacionales y extranjeros, información de vehículos, y configuraciones de tablas.
 * Las interfaces definen la estructura de datos para la gestión de autorizaciones,
 * pagos de derechos, y validación de información.
 *
 * @file registro-muestras-mercancias.model.ts
 * @author Sistema de Gestión de Trámites - Models Team
 * @version 1.0.0
 * @since 1.0.0
 */



/**
 * Representa la respuesta de la API para información de un solicitante.
 *
 * @property codigo - Código de respuesta de la API (opcional).
 * @property mensaje - Mensaje general de la API (opcional).
 * @property datos - Objeto que contiene la información específica de la respuesta.
 * @property datos.mostrar_director_general - Indica si se debe mostrar la información del director general (opcional).
 * @property datos.solicitante - Información del solicitante (opcional).
 * @property datos.director_general - Información del director general asociada al solicitante (opcional).
 * @property datos.caat_existe - Indica si existe un registro CAAT para el solicitante (opcional).
 * @property datos.mensaje - Mensaje específico dentro de los datos (opcional).
 * @property error - Mensaje de error de la API (opcional).
 * @property mensage - Mensaje adicional de la API (opcional, posible duplicado de `mensaje`).
 */

export interface ApiResponseSolicitante {
  codigo: string | null;
  mensaje: string | null;
  datos: {
    mostrar_director_general: boolean | null;
    solicitante: Solicitante | null;
    director_general: DirectorGeneral | null
    caat_existe: boolean | null;
    mensaje: string | null
  };
  error: string | null;
  mensage: string | null;
}

/**
 * Representa la información de un Director General.
 *
 * @property nombre - Nombre del Director General (opcional, puede ser null).
 * @property primer_apellido - Primer apellido del Director General (opcional, puede ser null).
 * @property segundo_apellido - Segundo apellido del Director General (opcional, puede ser null).
 */

interface DirectorGeneral {
  nombre: string | null;
  primer_apellido: string | null;
  segundo_apellido: string | null;
}


/**
 * Representa la información de un solicitante, incluyendo datos fiscales, 
 * de contacto y su domicilio.
 *
 * @property id_persona_solicitud - Identificador único de la persona que realiza la solicitud (opcional, puede ser null).
 * @property rfc - Registro Federal de Contribuyentes del solicitante (opcional, puede ser null).
 * @property razon_social - Razón social de la persona o entidad solicitante (opcional, puede ser null).
 * @property correo_electronico - Correo electrónico del solicitante (opcional, puede ser null).
 * @property descripcion_giro - Descripción del giro o actividad del solicitante (opcional, puede ser null).
 * @property domicilio - Información del domicilio del solicitante, de tipo `Domicilio`.
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
 * Representa la información de un domicilio.
 *
 * @property pais - País del domicilio.
 * @property codigo_postal - Código postal del domicilio.
 * @property estado - Estado o región del domicilio.
 * @property municipio - Municipio del domicilio (opcional, puede ser null).
 * @property localidad - Localidad del domicilio (opcional, puede ser null).
 * @property colonia - Colonia o barrio del domicilio (opcional, puede ser null).
 * @property calle - Nombre de la calle del domicilio.
 * @property numero_exterior - Número exterior del domicilio.
 * @property numero_interior - Número interior del domicilio (opcional, puede ser vacío).
 * @property lada - Código LADA para llamadas telefónicas (opcional, puede ser null).
 * @property telefono - Número de teléfono asociado al domicilio (opcional, puede ser null).
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
 * Interfaz que representa un catálogo importante de selección.
 *
 */
import { Catalogo, CatalogosSelect } from '@ng-mf/data-access-user';
import { TableData } from '@ng-mf/data-access-user';

/**
 * Representa una selección importante del catálogo para el registro de muestras de mercancías.
 *
 * Esta interfaz define la estructura principal que contiene todas las selecciones de catálogos
 * necesarias para el proceso de registro de muestras, incluyendo datos de importadores,
 * fracciones arancelarias, fechas de validez y información de choferes.
 *
 * @interface ImportanteCatalogoSeleccion
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const catalogoSeleccion: ImportanteCatalogoSeleccion = {
 *   importadorExportadorPrevio: catalogoImportadores,
 *   fraccionArancelariaAga: catalogoFracciones,
 *   validezDeLaAutorizacion: { 
 *     fechaInicioVigencia: "2024-01-01",
 *     fechaFinVigencia: "2024-12-31"
 *   },
 *   datosDelChoferNacional: choferesData
 * };
 * ```
 */
export interface ImportanteCatalogoSeleccion {
  /**
   * @property {CatalogosSelect} importadorExportadorPrevio
   * Selección previa del importador/exportador.
   * Contiene la información del catálogo para identificar importadores y exportadores previamente registrados.
   */
  importadorExportadorPrevio: CatalogosSelect;

  /**
   * @property {CatalogosSelect} fraccionArancelariaAga
   * Selección de la fracción arancelaria AGA.
   * Define la clasificación arancelaria específica administrada por la Aduana General de la Nación.
   */
  fraccionArancelariaAga: CatalogosSelect;

  /**
   * @property {CatalogosSelect} nico
   * Selección del NICO (Número de Identificación Comercial).
   * Código único para identificar productos en el comercio internacional.
   */
  nico: CatalogosSelect;

  /**
   * @property {CatalogosSelect} ideGenerica
   * Selección de la IDE genérica (Identificación de Especificaciones).
   * Catálogo que contiene identificaciones genéricas para clasificación de mercancías.
   */
  ideGenerica: CatalogosSelect;

  /**
   * @property {CatalogosSelect} tomaMuestraDespacho
   * Selección de la toma de muestra en despacho.
   * Opciones disponibles para el proceso de toma de muestras durante el despacho aduanero.
   */
  tomaMuestraDespacho: CatalogosSelect;

  /**
   * @property {TableData} requisitosObligatoriosTabla
   * Tabla de requisitos obligatorios.
   * Contiene los requisitos que deben cumplirse obligatoriamente para el trámite.
   */
  requisitosObligatoriosTabla: TableData;

  /**
   * @property {TableData} tablaDeTarifasDePago
   * Tabla de tarifas de pago.
   * Información detallada sobre las tarifas y costos asociados al trámite.
   */
  tablaDeTarifasDePago: TableData;

  /**
   * @property {ListaDeFechas} validezDeLaAutorizacion
   * Almacena las fechas de validez de la autorización.
   * Define el período durante el cual la autorización es válida.
   */
  validezDeLaAutorizacion: ListaDeFechas;

  /**
   * @property {RegistroMuestras} registroMuestrasDatos
   * Almacena los datos del registro de muestras.
   * Contiene toda la información específica del registro de muestras de mercancías.
   */
  registroMuestrasDatos: RegistroMuestras;

  /**
   * @property {DatosDelChoferNacional[]} datosDelChoferNacional
   * Lista de datos de choferes nacionales asociados a la solicitud.
   * Contiene información completa de identificación y domicilio de los choferes.
   */
  datosDelChoferNacional: DatosDelChoferNacional[];
}
/**
 * Representa un registro de muestras de mercancías.
 *
 * Esta interfaz contiene toda la información necesaria para el registro
 * de muestras de mercancías, incluyendo datos del importador, información
 * sobre la toma de muestras, clasificación arancelaria y características
 * químicas y comerciales de las mercancías.
 *
 * @interface RegistroMuestras
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const registroMuestra: RegistroMuestras = {
 *   opcionDeImportador: "importador_001",
 *   tomaMuestraDespacho: "SI",
 *   nombreQuimico: "Acetato de sodio",
 *   nombreComercial: "Sal comercial",
 *   numeroCAS: "127-09-3",
 *   ideGenerica: 12345
 * };
 * ```
 */
export interface RegistroMuestras {
  /**
   * @property {string} opcionDeImportador
   * Opción del importador seleccionada en el registro.
   * Identificador único del importador autorizado para el trámite.
   */
  opcionDeImportador: string;

  /**
   * @property {string} tomaMuestraDespacho
   * Indica si se tomó una muestra en el despacho.
   * Valores típicos: "SI", "NO", "PENDIENTE".
   */
  tomaMuestraDespacho: string;

  /**
   * @property {string} descMotivoFaltaMuestra
   * Motivo de la falta de muestra, si no se realizó la toma de muestra.
   * Descripción detallada de las razones por las cuales no fue posible obtener la muestra.
   */
  descMotivoFaltaMuestra: string;

  /**
   * @property {string} comboFraccionConcatenada
   * Valor combinado de fracción arancelaria seleccionado en un combo.
   * Cadena que contiene la fracción arancelaria concatenada con información adicional.
   */
  comboFraccionConcatenada: string;

  /**
   * @property {string} fraccionConcatenada
   * Código de la fracción arancelaria.
   * Código oficial de clasificación arancelaria según el Sistema Armonizado.
   */
  fraccionConcatenada: string;

  /**
   * @property {string} fracciondescripcion
   * Descripción de la fracción arancelaria.
   * Descripción oficial completa de la clasificación arancelaria aplicable.
   */
  fracciondescripcion: string;

  /**
   * @property {string} comboNicos
   * Valor combinado de NICOS seleccionado en un combo.
   * Combinación del código NICO con información descriptiva adicional.
   */
  comboNicos: string;

  /**
   * @property {string} nicoDescripcion
   * Descripción del NICOS (Número de Identificación Comercial) asociado.
   * Descripción completa del producto según la clasificación NICO.
   */
  nicoDescripcion: string;

  /**
   * @property {string} nombreQuimico
   * Nombre químico de la sustancia o mercancía.
   * Denominación química oficial según nomenclatura internacional (IUPAC).
   */
  nombreQuimico: string;

  /**
   * @property {string} nombreComercial
   * Nombre comercial de la sustancia o mercancía.
   * Denominación comercial o marca bajo la cual se comercializa el producto.
   */
  nombreComercial: string;

  /**
   * @property {string} numeroCAS
   * Número CAS (Chemical Abstracts Service) de la sustancia.
   * Identificador único numérico asignado por Chemical Abstracts Service.
   */
  numeroCAS: string;

  /**
   * @property {number} ideGenerica
   * Identificación genérica de la mercancía.
   * Código numérico que identifica el tipo genérico de la mercancía.
   */
  ideGenerica: number;

  /**
   * @property {string} descClobGenerica
   * Descripción detallada del producto en formato CLOB (Character Large Object).
   * Descripción extensa que puede contener gran cantidad de texto sobre el producto.
   */
  descClobGenerica: string;
}

/**
 * Representa una lista de fechas para validez de autorizaciones.
 *
 * Esta interfaz define el período de vigencia de una autorización
 * mediante fechas de inicio y fin, utilizadas para determinar
 * la validez temporal de permisos y autorizaciones.
 *
 * @interface ListaDeFechas
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const fechasValidez: ListaDeFechas = {
 *   fechaInicioVigencia: "2024-01-01",
 *   fechaFinVigencia: "2024-12-31"
 * };
 * ```
 */
export interface ListaDeFechas {
  /**
   * @property {string} fechaInicioVigencia
   * Representa la fecha de inicio de vigencia.
   * Formato: "YYYY-MM-DD" - Fecha a partir de la cual la autorización es válida.
   */
  fechaInicioVigencia: string;

  /**
   * @property {string} fechaFinVigencia
   * Representa la fecha de fin de vigencia.
   * Formato: "YYYY-MM-DD" - Fecha hasta la cual la autorización mantiene su validez.
   */
  fechaFinVigencia: string;
}

/**
 * Interfaz que representa el estado de almacenamiento de muestras de mercancías.
 *
 * Define la estructura del store para el manejo de estado de la aplicación
 * relacionada con muestras de mercancías. Contiene información sobre autorizaciones,
 * registros, pagos y catálogos relacionados con importaciones y exportaciones.
 * Se utiliza para mantener la consistencia de datos a través de la aplicación.
 *
 * @interface MuestrasMercanciasStore
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const storeState: MuestrasMercanciasStore = {
 *   validezDeLaAutorizacion: { fechaInicioVigencia: "2024-01-01", fechaFinVigencia: "2024-12-31" },
 *   renovacionesDeRegistro: registroData,
 *   pagoDeDerechos: tablaPageData,
 *   importadorExportadorPrevio: catalogoImportadores
 * };
 * ```
 */
export interface MuestrasMercanciasStore {
  /**
   * @property {ListaDeFechas} validezDeLaAutorizacion
   * Almacena las fechas de validez de la autorización.
   * Define el período durante el cual la autorización para el registro de muestras es válida.
   */
  validezDeLaAutorizacion: ListaDeFechas;

  /**
   * @property {RegistroMuestras} renovacionesDeRegistro
   * Almacena los registros de muestras y sus renovaciones.
   * Contiene información completa sobre el registro actual y sus posibles renovaciones.
   */
  renovacionesDeRegistro: RegistroMuestras;

  /**
   * @property {TableData} pagoDeDerechos
   * Almacena los detalles del pago, incluyendo encabezados y datos de la tabla.
   * Información estructurada sobre los pagos de derechos asociados al trámite.
   */
  pagoDeDerechos: TableData;

  /**
   * @property {CatalogosSelect} importadorExportadorPrevio
   * Almacena el catálogo de importadores/exportadores previos.
   * Catálogo de entidades previamente autorizadas para operaciones de importación/exportación.
   */
  importadorExportadorPrevio: CatalogosSelect;

  /**
   * @property {CatalogosSelect} fraccionArancelariaAga
   * Almacena el catálogo de fracciones arancelarias de la AGA (Aduana General de la Nación).
   * Clasificaciones arancelarias oficiales administradas por la autoridad aduanera.
   */
  fraccionArancelariaAga: CatalogosSelect;

  /**
   * @property {CatalogosSelect} nico
   * Almacena el catálogo de NICO (Número de Identificación Comercial).
   * Códigos únicos para identificación de productos en el comercio internacional.
   */
  nico: CatalogosSelect;

  /**
   * @property {CatalogosSelect} ideGenerica
   * Almacena el catálogo de IDE genérico (Identificación de Especificaciones).
   * Catálogo de identificaciones genéricas para clasificación de especificaciones de productos.
   */
  ideGenerica: CatalogosSelect;

  /**
   * @property {CatalogosSelect} tomaMuestraDespacho
   * Almacena el catálogo relacionado con la toma de muestras durante el despacho.
   * Opciones y procedimientos disponibles para la toma de muestras en procesos aduaneros.
   */
  tomaMuestraDespacho: CatalogosSelect;
}

/**
 * Interfaz que representa los datos completos de un chofer nacional.
 *
 * Esta interfaz contiene toda la información personal, de identificación
 * y domiciliaria necesaria para el registro de choferes nacionales en el
 * sistema de autorización de transporte. Incluye datos oficiales como
 * CURP, RFC, gafete, así como información de contacto y domicilio.
 *
 * @interface DatosDelChoferNacional
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const choferNacional: DatosDelChoferNacional = {
 *   id: "CHN001",
 *   curp: "ABCD123456HDFLNR01",
 *   rfc: "ABCD123456ABC",
 *   nombre: "Juan",
 *   primerApellido: "Pérez",
 *   segundoApellido: "García",
 *   numeroDeGafete: "GAF001",
 *   telefono: "5551234567",
 *   correoElectronico: "juan.perez@email.com"
 * };
 * ```
 */
export interface DatosDelChoferNacional {
  /**
   * @property {unknown} id
   * Identificador único del chofer en el sistema.
   * Puede ser numérico o alfanumérico dependiendo del sistema de generación.
   */
  id: unknown;

  /**
   * @property {string} curp
   * Clave Única de Registro de Población del chofer nacional.
   * Identificador oficial de 18 caracteres emitido por el gobierno mexicano.
   */
  curp?: string;

  /**
   * @property {string} rfc
   * Registro Federal de Contribuyentes del chofer.
   * Clave de identificación fiscal de 13 caracteres para personas físicas.
   */
  rfc?: string;

  /**
   * @property {string} nombre
   * Nombre(s) del chofer nacional.
   * Nombre oficial según documentos de identificación.
   */
  nombre?: string;

  /**
   * @property {string} primerApellido
   * Primer apellido del chofer nacional.
   * Apellido paterno según documentos oficiales.
   */
  primerApellido?: string;

  /**
   * @property {string} segundoApellido
   * Segundo apellido del chofer nacional.
   * Apellido materno según documentos oficiales.
   */
  segundoApellido?: string;

  /**
   * @property {string} numeroDeGafete
   * Número de gafete de identificación del chofer.
   * Identificador único del gafete oficial emitido por la autoridad competente.
   */
  numeroDeGafete?: string;

  /**
   * @property {string} vigenciaGafete
   * Fecha de vigencia del gafete de identificación.
   * Formato: "YYYY-MM-DD" - Fecha hasta la cual el gafete es válido.
   */
  vigenciaGafete?: string;

  /**
   * @property {string} calle
   * Nombre de la calle del domicilio del chofer.
   * Vía pública donde se ubica el domicilio.
   */
  calle?: string;

  /**
   * @property {string} numeroExterior
   * Número exterior del domicilio.
   * Numeración oficial de la propiedad en la vía pública.
   */
  numeroExterior?: string;

  /**
   * @property {string} numeroInterior
   * Número interior del domicilio, si aplica.
   * Numeración interna de departamento, oficina o local.
   */
  numeroInterior?: string;

  /**
   * @property {string} pais
   * País del domicilio del chofer.
   * Denominación oficial del país de residencia.
   */
  pais?: string;

  /**
   * @property {string} estado
   * Estado o entidad federativa del domicilio.
   * División política administrativa de primer nivel.
   */
  estado?: string;

  /**
   * @property {string} municipioAlcaldia
   * Municipio o alcaldía del domicilio.
   * División política administrativa de segundo nivel.
   */
  municipioAlcaldia?: string;

  /**
   * @property {string} colonia
   * Colonia o barrio del domicilio.
   * Área geográfica específica dentro del municipio.
   */
  colonia?: string;

  /**
   * @property {string} paisDeResidencia
   * País de residencia habitual del chofer.
   * Puede diferir del país del domicilio registrado.
   */
  paisDeResidencia?: string;

  /**
   * @property {string} ciudad
   * Ciudad del domicilio del chofer.
   * Localidad urbana principal del domicilio.
   */
  ciudad?: string;

  /**
   * @property {string} localidad
   * Localidad específica del domicilio.
   * Área geográfica más específica que la ciudad.
   */
  localidad?: string;

  /**
   * @property {string} codigoPostal
   * Código postal del domicilio.
   * Código numérico de 5 dígitos para identificación postal en México.
   */
  codigoPostal?: string;

  /**
   * @property {string} telefono
   * Número de teléfono de contacto del chofer.
   * Número telefónico para comunicación directa, incluyendo código de área.
   */
  telefono: string;

  /**
   * @property {string} correoElectronico
   * Dirección de correo electrónico del chofer.
   * Email válido para notificaciones y comunicación oficial.
   */
  correoElectronico: string;
}

/**
 * Interfaz que representa los datos de choferes extranjeros.
 *
 * Esta interfaz define la estructura de datos necesaria para el registro
 * de choferes de nacionalidad extranjera que operan en territorio nacional.
 * Incluye información específica para extranjeros como nacionalidad,
 * número de seguro social y datos de identificación fiscal.
 *
 * @interface ChoferesExtranjeros
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const choferExtranjero: ChoferesExtranjeros = {
 *   numero: "CHE001",
 *   primerApellido: "Smith",
 *   segundoApellido: "Johnson",
 *   nacionalidad: "Estadounidense",
 *   numeroDelSeguroSocial: "123-45-6789",
 *   telefono: "+1-555-1234567",
 *   correoElectronico: "smith@email.com"
 * };
 * ```
 */
export interface ChoferesExtranjeros {
  /**
   * @property {string} numero
   * Número de identificación del chofer extranjero.
   * Identificador único asignado al chofer en el sistema.
   */
  numero?: string;

  /**
   * @property {string} primerApellido
   * Primer apellido del chofer extranjero.
   * Apellido principal según documentos de identificación extranjeros.
   */
  primerApellido?: string;

  /**
   * @property {string} segundoApellido
   * Segundo apellido del chofer extranjero.
   * Segundo apellido o apellido materno si aplica según las leyes del país de origen.
   */
  segundoApellido?: string;

  /**
   * @property {string} nacionalidad
   * Nacionalidad del chofer extranjero.
   * País de nacionalidad según documentos oficiales de identificación.
   */
  nacionalidad?: string;

  /**
   * @property {string} numeroDeGafete
   * Número de gafete de identificación del chofer extranjero.
   * Identificador único del gafete emitido por autoridades mexicanas.
   */
  numeroDeGafete?: string;

  /**
   * @property {string} vigenciaGafete
   * Fecha de vigencia del gafete del chofer extranjero.
   * Formato: "YYYY-MM-DD" - Fecha de vencimiento del gafete de identificación.
   */
  vigenciaGafete?: string;

  /**
   * @property {string} numeroDelSeguroSocial
   * Número de seguro social del país de origen.
   * Número de identificación de seguridad social según el sistema del país de origen.
   */
  numeroDelSeguroSocial?: string;

  /**
   * @property {string} numberDeIdeFiscal
   * Número de identificación fiscal del país de origen.
   * Identificador fiscal oficial del chofer en su país de origen.
   */
  numberDeIdeFiscal?: string;

  /**
   * @property {string} pais
   * País de origen del chofer extranjero.
   * Denominación oficial del país de procedencia.
   */
  pais?: string;

  /**
   * @property {string} apellidoPaterno
   * Apellido paterno del chofer (formato mexicano).
   * Adaptación del apellido paterno al formato de registro mexicano.
   */
  apellidoPaterno?: string;

  /**
   * @property {string} codigoPostal
   * Código postal del domicilio en México.
   * Código postal mexicano del lugar de residencia temporal o permanente.
   */
  codigoPostal?: string;

  /**
   * @property {string} estado
   * Estado mexicano de residencia.
   * Entidad federativa donde reside el chofer extranjero en México.
   */
  estado?: string;

  /**
   * @property {string} calle
   * Calle del domicilio en México.
   * Nombre de la vía pública del domicilio registrado en México.
   */
  calle?: string;

  /**
   * @property {string} numeroExterior
   * Número exterior del domicilio en México.
   * Numeración oficial de la propiedad donde reside en México.
   */
  numeroExterior?: string;

  /**
   * @property {string} numeroInterior
   * Número interior del domicilio en México, si aplica.
   * Numeración interna de departamento o local en México.
   */
  numeroInterior?: string;

  /**
   * @property {string} paisDeResidencia
   * País de residencia actual del chofer.
   * Puede ser México u otro país donde reside actualmente.
   */
  paisDeResidencia?: string;

  /**
   * @property {string} ciudad
   * Ciudad de residencia en México.
   * Localidad urbana donde se encuentra domiciliado en México.
   */
  ciudad?: string;

  /**
   * @property {string} correoElectronico
   * Dirección de correo electrónico del chofer extranjero.
   * Email válido para comunicación oficial y notificaciones.
   */
  correoElectronico?: string;

  /**
   * @property {string} telefono
   * Número de teléfono de contacto del chofer extranjero.
   * Número telefónico para comunicación directa, puede incluir código internacional.
   */
  telefono?: string;
}
/**
 * Interfaz que representa la lista de pagos de derechos.
 *
 * Esta interfaz define la estructura para el manejo de información relacionada
 * con pagos de derechos, incluyendo datos personales, domiciliarios y de identificación
 * de los contribuyentes. Contiene campos para el registro completo de información
 * fiscal y de ubicación necesaria para el procesamiento de pagos.
 *
 * @interface PagoDerechosLista
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const pagoDerechos: PagoDerechosLista = {
 *   numero: "PAG001",
 *   apellidoPaterno: "García",
 *   apellidoMaterno: "López",
 *   rfc: "GALO123456ABC",
 *   curp: "GALO123456HDFLPR01",
 *   gafete: "GAF123",
 *   calle: "Av. Principal",
 *   estado: "CDMX"
 * };
 * ```
 */
export interface PagoDerechosLista {
  /**
   * @property {string} numero
   * Línea de captura del pago.
   * Número único que identifica la línea de captura para el pago de derechos.
   */
  numero?: string;

  /**
   * @property {string} calle
   * Nombre de la calle del domicilio fiscal.
   * Vía pública donde se encuentra ubicado el domicilio para efectos fiscales.
   */
  calle?: string;

  /**
   * @property {string} estado
   * Estado o entidad federativa del domicilio fiscal.
   * División política administrativa de primer nivel donde se ubica el contribuyente.
   */
  estado?: string;

  /**
   * @property {string} pais
   * País del domicilio fiscal.
   * Denominación oficial del país donde se encuentra el domicilio fiscal.
   */
  pais?: string;

  /**
   * @property {string} apellidoPaterno
   * Apellido paterno del contribuyente.
   * Primer apellido según documentos oficiales de identificación.
   */
  apellidoPaterno?: string;

  /**
   * @property {string} apellidoMaterno
   * Apellido materno del contribuyente.
   * Segundo apellido según documentos oficiales de identificación.
   */
  apellidoMaterno?: string;

  /**
   * @property {string} rfc
   * Registro Federal de Contribuyentes.
   * Clave de identificación fiscal de 12 o 13 caracteres para personas físicas o morales.
   */
  rfc?: string;

  /**
   * @property {string} gafete
   * Número de gafete de identificación.
   * Identificador único del gafete oficial emitido por la autoridad competente.
   */
  gafete?: string;

  /**
   * @property {string} vigenciaGafete
   * Fecha de vigencia del gafete.
   * Formato: "YYYY-MM-DD" - Fecha hasta la cual el gafete mantiene su validez.
   */
  vigenciaGafete?: string;

  /**
   * @property {string} municipio
   * Municipio del domicilio fiscal.
   * División política administrativa de segundo nivel.
   */
  municipio?: string;

  /**
   * @property {string} colonia
   * Colonia o barrio del domicilio fiscal.
   * Área geográfica específica dentro del municipio.
   */
  colonia?: string;

  /**
   * @property {string} paisOrigen
   * País de origen del contribuyente.
   * País de nacimiento o nacionalidad original del contribuyente.
   */
  paisOrigen?: string;

  /**
   * @property {string} ciudad
   * Ciudad del domicilio fiscal.
   * Localidad urbana principal donde se encuentra el domicilio.
   */
  ciudad?: string;

  /**
   * @property {string} curp
   * Clave Única de Registro de Población.
   * Identificador oficial de 18 caracteres emitido por el gobierno mexicano.
   */
  curp?: string;

  /**
   * @property {string} númeroExterior
   * Número exterior del domicilio fiscal.
   * Numeración oficial de la propiedad en la vía pública.
   */
  númeroExterior?: string;

  /**
   * @property {string} númeroInterior
   * Número interior del domicilio fiscal, si aplica.
   * Numeración interna de departamento, oficina o local.
   */
  númeroInterior?: string;

  /**
   * @property {string} país
   * País del domicilio (campo alternativo).
   * Denominación del país, puede ser una variante del campo 'pais'.
   */
  país?: string;

  /**
   * @property {string} primerApellido
   * Primer apellido del contribuyente.
   * Apellido paterno en formato alternativo de registro.
   */
  primerApellido?: string;

  /**
   * @property {string} segundoApellido
   * Segundo apellido del contribuyente.
   * Apellido materno en formato alternativo de registro.
   */
  segundoApellido?: string;

  /**
   * @property {string} númeroDeGafete
   * Número de gafete (campo alternativo).
   * Identificador del gafete en formato alternativo de registro.
   */
  númeroDeGafete?: string;

  /**
   * @property {string} fechaFindDeVigencia
   * Fecha de fin de vigencia.
   * Formato: "YYYY-MM-DD" - Fecha de vencimiento de la vigencia del documento o autorización.
   */
  fechaFindDeVigencia?: string;

  /**
   * @property {string} municipioAlcaldía
   * Municipio o alcaldía del domicilio.
   * División política administrativa, especialmente para Ciudad de México.
   */
  municipioAlcaldía?: string;

  /**
   * @property {string} PaísDeResidencia
   * País de residencia del contribuyente.
   * País donde reside habitualmente el contribuyente.
   */
  PaísDeResidencia?: string;
}

/**
 * Interfaz que representa la información completa de un vehículo de transporte.
 *
 * Esta interfaz define todos los datos necesarios para el registro de vehículos
 * utilizados en operaciones de transporte de mercancías. Incluye información
 * de identificación del vehículo, características técnicas, placas y documentación.
 *
 * @interface Vehiculo
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const vehiculo: Vehiculo = {
 *   id: 1,
 *   solicitudVehiculoVin2: "1HGBH41JXMN109186",
 *   solicitudVehiculoTipoVehiculo: "TRACTOCAMION",
 *   solicitudVehiculoNumeroEconomico: "ECO001",
 *   solicitudVehiculoNumeroPlacas: "ABC-123",
 *   solicitudVehiculoPaisEmisor: "México",
 *   solicitudVehiculoMarca: "Volvo",
 *   solicitudVehiculoModelo: "VNL780",
 *   anioVehiculoVEH: "2023"
 * };
 * ```
 */
export interface Vehiculo {
  /**
   * @property {number} id
   * Identificador único del vehículo en el sistema.
   * Clave primaria numérica para identificación interna del vehículo.
   */
  id: number;

  /**
   * @property {string} solicitudVehiculoVin2
   * Número VIN (Vehicle Identification Number) del vehículo.
   * Código alfanumérico de 17 caracteres que identifica únicamente al vehículo.
   */
  solicitudVehiculoVin2: string;

  /**
   * @property {string} solicitudVehiculoTipoVehiculo
   * Tipo de vehículo según clasificación oficial.
   * Categorización del vehículo: TRACTOCAMION, CAMION, REMOLQUE, etc.
   */
  solicitudVehiculoTipoVehiculo: string;

  /**
   * @property {string} solicitudVehiculoNumeroEconomico
   * Número económico asignado al vehículo por la empresa.
   * Identificador interno utilizado por la empresa transportista.
   */
  solicitudVehiculoNumeroEconomico: string;

  /**
   * @property {string} solicitudVehiculoNumeroPlacas
   * Número de placas de circulación del vehículo.
   * Matrícula oficial emitida por las autoridades de tránsito.
   */
  solicitudVehiculoNumeroPlacas: string;

  /**
   * @property {string} solicitudVehiculoPaisEmisor
   * País emisor de las placas de circulación.
   * País cuyas autoridades emitieron las placas de circulación.
   */
  solicitudVehiculoPaisEmisor: string;

  /**
   * @property {string} solicitudDomicilioEstado
   * Estado donde está registrado el domicilio del vehículo.
   * Entidad federativa de registro domiciliario del vehículo.
   */
  solicitudDomicilioEstado: string;

  /**
   * @property {string} solicitudVehiculoMarca
   * Marca del vehículo.
   * Fabricante o marca comercial del vehículo (Volvo, Freightliner, etc.).
   */
  solicitudVehiculoMarca: string;

  /**
   * @property {string} solicitudVehiculoModelo
   * Modelo específico del vehículo.
   * Modelo comercial del vehículo según el fabricante.
   */
  solicitudVehiculoModelo: string;

  /**
   * @property {string} anioVehiculoVEH
   * Año de fabricación del vehículo.
   * Año modelo del vehículo según especificaciones del fabricante.
   */
  anioVehiculoVEH: string;

  /**
   * @property {string} solicitudVehiculoTransponder
   * Número de transponder del vehículo.
   * Dispositivo electrónico para identificación y seguimiento del vehículo.
   */
  solicitudVehiculoTransponder: string;

  /**
   * @property {string} solicitudVehiculoColor
   * Color principal del vehículo.
   * Color predominante del vehículo según registro oficial.
   */
  solicitudVehiculoColor: string;

  /**
   * @property {string} solicitudVehiculoNumero2daPlaca
   * Número de segunda placa, si aplica.
   * Placa adicional o secundaria del vehículo cuando sea requerida.
   */
  solicitudVehiculoNumero2daPlaca?: string;

  /**
   * @property {string} solicitudVehiculoEmisor2daPlaca
   * Emisor de la segunda placa.
   * Autoridad o jurisdicción que emitió la segunda placa del vehículo.
   */
  solicitudVehiculoEmisor2daPlaca?: string;

  /**
   * @property {string} solicitudVehiculoPaisEmisorSegundaPlaca
   * País emisor de la segunda placa.
   * País cuyas autoridades emitieron la segunda placa de circulación.
   */
  solicitudVehiculoPaisEmisorSegundaPlaca?: string;

  /**
   * @property {string} solicitudVehiculoDesc
   * Descripción adicional del vehículo.
   * Información complementaria o características especiales del vehículo.
   */
  solicitudVehiculoDesc?: string;
}

/**
 * Interfaz que representa la información completa de un chofer (nacional o extranjero).
 *
 * Esta interfaz unifica la información de choferes tanto nacionales como extranjeros,
 * proporcionando campos para todos los tipos de datos de identificación, domicilio
 * y contacto necesarios. Incluye campos específicos para cada tipo de chofer
 * (CHN - Chofer Nacional, CHE - Chofer Extranjero).
 *
 * @interface Chofer
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const chofer: Chofer = {
 *   id: 1,
 *   descripcion: "Chofer Nacional Autorizado",
 *   clave: "CHN001",
 *   curp: "ABCD123456HDFLNR01",
 *   rfc: "ABCD123456ABC",
 *   nombre: "Juan Carlos",
 *   apellidoPaterno: "García",
 *   apellidoMaterno: "López",
 *   gafete: "GAF001",
 *   telefono: "5551234567",
 *   correo: "juan.garcia@email.com"
 * };
 * ```
 */
export interface Chofer {
  /**
   * @property {string} descripcion
   * Descripción del chofer.
   * Descripción textual que identifica el tipo o categoría del chofer.
   */
  descripcion: string;

  /**
   * @property {string} clave
   * Clave única del chofer en el sistema.
   * Identificador alfanumérico único asignado al chofer.
   */
  clave: string;

  /**
   * @property {number} id
   * Identificador numérico único del chofer.
   * Clave primaria numérica para identificación interna del chofer.
   */
  id: number;

  /**
   * @property {string} curp
   * Clave Única de Registro de Población (solo choferes nacionales).
   * Identificador oficial de 18 caracteres emitido por el gobierno mexicano.
   */
  curp?: string;

  /**
   * @property {string} rfc
   * Registro Federal de Contribuyentes.
   * Clave de identificación fiscal para choferes que operan en México.
   */
  rfc?: string;

  /**
   * @property {string} nombre
   * Nombre(s) del chofer.
   * Nombre completo o nombres según documentos oficiales.
   */
  nombre?: string;

  /**
   * @property {string} apellidoPaterno
   * Apellido paterno del chofer.
   * Primer apellido según documentos oficiales de identificación.
   */
  apellidoPaterno?: string;

  /**
   * @property {string} apellidoMaterno
   * Apellido materno del chofer.
   * Segundo apellido según documentos oficiales de identificación.
   */
  apellidoMaterno?: string;

  /**
   * @property {string} gafete
   * Número de gafete de identificación del chofer.
   * Identificador único del gafete oficial emitido por la autoridad competente.
   */
  gafete?: string;

  /**
   * @property {string} vigenciagafete
   * Fecha de vigencia del gafete.
   * Formato: "YYYY-MM-DD" - Fecha hasta la cual el gafete es válido.
   */
  vigenciagafete?: string;

  /**
   * @property {string} calle
   * Nombre de la calle del domicilio.
   * Vía pública donde se ubica el domicilio del chofer.
   */
  calle?: string;

  /**
   * @property {string} numeroExterior
   * Número exterior del domicilio.
   * Numeración oficial de la propiedad en la vía pública.
   */
  numeroExterior?: string;

  /**
   * @property {string} numeroInterior
   * Número interior del domicilio, si aplica.
   * Numeración interna de departamento, oficina o local.
   */
  numeroInterior?: string;

  /**
   * @property {string} ciudad
   * Ciudad del domicilio.
   * Localidad urbana donde se encuentra el domicilio.
   */
  ciudad?: string;

  /**
   * @property {string} localidad
   * Localidad específica del domicilio.
   * Área geográfica más específica que la ciudad.
   */
  localidad?: string;

  /**
   * @property {string} codigoPostal
   * Código postal del domicilio.
   * Código numérico para identificación postal.
   */
  codigoPostal?: string;

  /**
   * @property {string} paisChn
   * País del chofer nacional.
   * País de residencia específico para choferes nacionales.
   */
  paisChn?: string;

  /**
   * @property {string} estado
   * Estado o entidad federativa del domicilio.
   * División política administrativa de primer nivel.
   */
  estado?: string;

  /**
   * @property {string} numerodelsegurosocial
   * Número del seguro social.
   * Número de afiliación al sistema de seguridad social.
   */
  numerodelsegurosocial?: string;

  /**
   * @property {string} entidadFederativaCHN
   * Entidad federativa para chofer nacional.
   * Estado específico en el registro de chofer nacional.
   */
  entidadFederativaCHN?: string;

  /**
   * @property {string} delegacionCHN
   * Delegación para chofer nacional.
   * División administrativa específica para choferes nacionales.
   */
  delegacionCHN?: string;

  /**
   * @property {string} coloniaCHN
   * Colonia para chofer nacional.
   * Colonia específica en el registro de chofer nacional.
   */
  coloniaCHN?: string;

  /**
   * @property {string} paisOrigenCHN
   * País de origen para chofer nacional.
   * País de nacimiento del chofer nacional.
   */
  paisOrigenCHN?: string;

  /**
   * @property {string} correo
   * Dirección de correo electrónico del chofer.
   * Email válido para comunicación oficial y notificaciones.
   */
  correo?: string;

  /**
   * @property {string} telefono
   * Número de teléfono de contacto del chofer.
   * Número telefónico para comunicación directa.
   */
  telefono?: string;

  /**
   * @property {string} nacionalidadCHE
   * Nacionalidad para chofer extranjero.
   * País de nacionalidad específico para choferes extranjeros.
   */
  nacionalidadCHE?: string;

  /**
   * @property {string} nss
   * Número de Seguro Social.
   * Número de afiliación al seguro social (formato abreviado).
   */
  nss?: string;

  /**
   * @property {string} ideFiscal
   * Identificación fiscal.
   * Número de identificación fiscal del país de origen para choferes extranjeros.
   */
  ideFiscal?: string;

  /**
   * @property {string} paisCHE
   * País para chofer extranjero.
   * País específico en el registro de chofer extranjero.
   */
  paisCHE?: string;

  /**
   * @property {string} entidadFederativaCHE
   * Entidad federativa para chofer extranjero.
   * Estado de residencia en México para choferes extranjeros.
   */
  entidadFederativaCHE?: string;

  /**
   * @property {string} paisOrigenCHE
   * País de origen para chofer extranjero.
   * País de nacimiento o procedencia del chofer extranjero.
   */
  paisOrigenCHE?: string;
}

/**
 * Representa la estructura de datos para un Director General.
 *
 * Esta interfaz define la información personal completa de un Director General,
 * incluyendo nombres y apellidos en diferentes formatos según los requerimientos
 * del sistema. Se utiliza para el registro de directores generales en procesos
 * de autorización y documentación oficial.
 *
 * @interface DirectorGeneralData
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const directorGeneral: DirectorGeneralData = {
 *   nombre: "José Luis",
 *   primerApellido: "González",
 *   segundoApellido: "Martínez",
 *   apellidoPaterno: "González",
 *   apellidoMaternoCHN: "Martínez"
 * };
 * ```
 */
export interface DirectorGeneralData {
  /**
   * @property {string} nombre
   * El nombre del Director General.
   * Nombre completo o nombres del titular del cargo.
   */
  nombre: string;

  /**
   * @property {string} primerApellido
   * El primer apellido del Director General.
   * Apellido paterno según documentos oficiales de identificación.
   */
  primerApellido: string;

  /**
   * @property {string} segundoApellido
   * El segundo apellido del Director General.
   * Apellido materno según documentos oficiales de identificación.
   */
  segundoApellido: string;

  /**
   * @property {string} apellidoPaterno
   * El apellido paterno del Director General.
   * Apellido paterno en formato estándar para documentos oficiales.
   */
  apellidoPaterno: string;

  /**
   * @property {string} apellidoMaternoCHN
   * El apellido materno del Director General en formato CHN.
   * Apellido materno adaptado al formato CHN (Chofer Nacional) del sistema.
   */
  apellidoMaternoCHN: string;
}


/**
 * Interfaz que representa la información completa de un vehículo para su visualización en tabla.
 *
 * Esta interfaz define la estructura de datos para mostrar información detallada
 * de vehículos en formatos tabulares dentro del sistema aduanero. Incluye datos
 * de identificación, especificaciones técnicas y documentación legal del vehículo.
 * Se utiliza especialmente en trámites de registro de muestras y mercancías
 * para el control vehicular en operaciones aduaneras.
 *
 * @interface VehiculoTabla
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const vehiculoTabla: VehiculoTabla = {
 *   datos: [],
 *   numero: "VEH001",
 *   tipoDeVehiculo: "Camión de carga",
 *   idDeVehiculo: "VIN123456789",
 *   numeroPlaca: "ABC-123-DEF",
 *   paisEmisor: "México",
 *   estado: "Ciudad de México",
 *   marca: "Volvo",
 *   modelo: "FH16",
 *   ano: "2023",
 *   transponder: "TRP001234",
 *   colorVehiculo: "Blanco",
 *   numuroEconomico: "ECO456",
 *   numero2daPlaca: "GHI-789-JKL",
 *   estado2daPlaca: "Nuevo León",
 *   paisEmisor2daPlaca: "México",
 *   descripcion: "Vehículo de carga pesada para transporte comercial"
 * };
 * ```
 */
export interface VehiculoTabla {
  /**
   * @property {VehiculoTabla[]} datos
   * Array de datos de vehículos adicionales.
   * Lista recursiva que puede contener información de vehículos relacionados o dependientes.
   */
  datos: VehiculoTabla[];

  /**
   * @property {string} numero
   * Número único del vehículo en el sistema.
   * Identificador secuencial asignado internamente para control administrativo.
   */
  numero: string;

  /**
   * @property {string} tipoDeVehiculo
   * Tipo o categoría del vehículo.
   * Clasificación del vehículo según su uso: carga, pasajeros, especializado, etc.
   */
  tipoDeVehiculo: string;

  /**
   * @property {string} idDeVehiculo
   * Identificador único del vehículo (VIN).
   * Número de identificación vehicular de 17 caracteres asignado por el fabricante.
   */
  idDeVehiculo: string;

  /**
   * @property {string} numeroPlaca
   * Número de placa vehicular oficial.
   * Matrícula o placas de circulación emitidas por la autoridad competente.
   */
  numeroPlaca: string;

  /**
   * @property {string} paisEmisor
   * País que emitió la placa vehicular.
   * Nación donde fue registrado el vehículo y emitidas las placas de circulación.
   */
  paisEmisor: string;

  /**
   * @property {string} estado
   * Estado o provincia donde fue registrado el vehículo.
   * Entidad federativa o división administrativa que emitió el registro vehicular.
   */
  estado: string;

  /**
   * @property {string} marca
   * Marca o fabricante del vehículo.
   * Nombre comercial de la empresa que manufacturó el vehículo.
   */
  marca: string;

  /**
   * @property {string} modelo
   * Modelo específico del vehículo.
   * Denominación comercial del modelo según el fabricante.
   */
  modelo: string;

  /**
   * @property {string} ano
   * Año de fabricación del vehículo.
   * Año modelo en que fue manufacturado el vehículo, formato YYYY.
   */
  ano: string;

  /**
   * @property {string} transponder
   * Número de transponder o dispositivo de identificación electrónica.
   * Identificador del dispositivo RFID o similar para control de acceso automatizado.
   */
  transponder: string;

  /**
   * @property {string} colorVehiculo
   * Color principal del vehículo.
   * Descripción del color predominante del vehículo según documentos oficiales.
   */
  colorVehiculo: string;

  /**
   * @property {string} numuroEconomico
   * Número económico del vehículo.
   * Identificador numérico interno asignado por la empresa transportista.
   */
  numuroEconomico: string;

  /**
   * @property {string} numero2daPlaca
   * Número de segunda placa vehicular, si aplica.
   * Matrícula adicional para vehículos que requieren doble placa (remolques, etc.).
   */
  numero2daPlaca: string;

  /**
   * @property {string} estado2daPlaca
   * Estado emisor de la segunda placa vehicular.
   * Entidad federativa que emitió la segunda matrícula del vehículo.
   */
  estado2daPlaca: string;

  /**
   * @property {string} paisEmisor2daPlaca
   * País emisor de la segunda placa vehicular.
   * Nación donde fue registrada y emitida la segunda matrícula del vehículo.
   */
  paisEmisor2daPlaca: string;

  /**
   * @property {string} descripcion
   * Descripción adicional del vehículo.
   * Información complementaria sobre características especiales o uso del vehículo.
   */
  descripcion: string;
}
/**
 * Interfaz que representa los datos completos de un vehículo.
 *
 * Esta interfaz define la estructura de datos para almacenar información
 * detallada de vehículos utilizados en operaciones de comercio exterior.
 * Incluye especificaciones técnicas, documentación legal y datos de
 * identificación necesarios para el control aduanero y registro de
 * movimientos de mercancías.
 *
 * @interface DatosVehiculo
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const datosVehiculo: DatosVehiculo = {
 *   numero: "VEH001",
 *   tipoDeVehiculo: "Camión de carga",
 *   idDeVehiculo: "1HGBH41JXMN109186",
 *   numeroPlaca: "ABC-123-DEF",
 *   paisEmisor: "México",
 *   estado: "Ciudad de México",
 *   marca: "Volvo",
 *   modelo: "FH16",
 *   ano: "2023",
 *   transponder: "TRP001234",
 *   colorVehiculo: "Blanco",
 *   numuroEconomico: "ECO456",
 *   numero2daPlaca: "GHI-789-JKL",
 *   estado2daPlaca: "Nuevo León",
 *   paisEmisor2daPlaca: "México",
 *   descripcion: "Vehículo de carga pesada para transporte comercial"
 * };
 * ```
 */
export interface DatosVehiculo {
  /**
   * @property {string} numero
   * Número único del vehículo en el sistema.
   * Identificador secuencial asignado internamente para control administrativo.
   */
  numero: string;

  /**
   * @property {string} tipoDeVehiculo
   * Tipo o categoría del vehículo.
   * Clasificación del vehículo según su uso: carga, pasajeros, especializado, etc.
   */
  tipoDeVehiculo: string;

  /**
   * @property {string} idDeVehiculo
   * Identificador único del vehículo (VIN).
   * Número de identificación vehicular de 17 caracteres asignado por el fabricante.
   */
  idDeVehiculo: string;

  /**
   * @property {string} numeroPlaca
   * Número de placa vehicular oficial.
   * Matrícula o placas de circulación emitidas por la autoridad competente.
   */
  numeroPlaca: string;

  /**
   * @property {string} paisEmisor
   * País que emitió la placa vehicular.
   * Nación donde fue registrado el vehículo y emitidas las placas de circulación.
   */
  paisEmisor: string;

  /**
   * @property {string} estado
   * Estado o provincia donde fue registrado el vehículo.
   * Entidad federativa o división administrativa que emitió el registro vehicular.
   */
  estado: string;

  /**
   * @property {string} marca
   * Marca o fabricante del vehículo.
   * Nombre comercial de la empresa que manufacturó el vehículo.
   */
  marca: string;

  /**
   * @property {string} modelo
   * Modelo específico del vehículo.
   * Denominación comercial del modelo según el fabricante.
   */
  modelo: string;

  /**
   * @property {string} ano
   * Año de fabricación del vehículo.
   * Año modelo en que fue manufacturado el vehículo, formato YYYY.
   */
  ano: string;

  /**
   * @property {string} transponder
   * Número de transponder o dispositivo de identificación electrónica.
   * Identificador del dispositivo RFID o similar para control de acceso automatizado.
   */
  transponder: string;

  /**
   * @property {string} colorVehiculo
   * Color principal del vehículo.
   * Descripción del color predominante del vehículo según documentos oficiales.
   */
  colorVehiculo: string;

  /**
   * @property {string} numuroEconomico
   * Número económico del vehículo.
   * Identificador numérico interno asignado por la empresa transportista.
   */
  numuroEconomico: string;

  /**
   * @property {string} numero2daPlaca
   * Número de segunda placa vehicular, si aplica.
   * Matrícula adicional para vehículos que requieren doble placa (remolques, etc.).
   */
  numero2daPlaca: string;

  /**
   * @property {string} estado2daPlaca
   * Estado emisor de la segunda placa vehicular.
   * Entidad federativa que emitió la segunda matrícula del vehículo.
   */
  estado2daPlaca: string;

  /**
   * @property {string} paisEmisor2daPlaca
   * País emisor de la segunda placa vehicular.
   * Nación donde fue registrada y emitida la segunda matrícula del vehículo.
   */
  paisEmisor2daPlaca: string;

  /**
   * @property {string} descripcion
   * Descripción adicional del vehículo.
   * Información complementaria sobre características especiales o uso del vehículo.
   */
  descripcion: string;
}
/**
 * Interfaz que representa los datos de una unidad de arrastre.
 *
 * Esta interfaz define la estructura de datos para unidades de arrastre,
 * como remolques, semirremolques y otros vehículos auxiliares utilizados
 * en el transporte de mercancías. Incluye información técnica, legal y
 * de identificación necesaria para el control aduanero de este tipo de
 * vehículos especializados en operaciones de comercio exterior.
 *
 * @interface DatosUnidad
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const datosUnidad: DatosUnidad = {
 *   vinVehiculo: "1HGBH41JXMN109186",
 *   tipoDeUnidadArrastre: "Semirremolque",
 *   idDeVehiculo: "REM001",
 *   numeroEconomico: "ECO789",
 *   numeroPlaca: "REM-456-GHI",
 *   paisEmisor: "México",
 *   estado: "Nuevo León",
 *   colorVehiculo: "Azul",
 *   numero2daPlaca: "AUX-123-JKL",
 *   estado2daPlaca: "Tamaulipas",
 *   paisEmisor2daPlaca: "México",
 *   descripcion: "Remolque para transporte de contenedores"
 * };
 * ```
 */
export interface DatosUnidad {
  /**
   * @property {string} vinVehiculo
   * Número de identificación vehicular (VIN) de la unidad.
   * Código alfanumérico único de 17 caracteres asignado por el fabricante.
   */
  vinVehiculo: string;

  /**
   * @property {string} tipoDeUnidadArrastre
   * Tipo específico de unidad de arrastre.
   * Clasificación del vehículo: remolque, semirremolque, caja seca, etc.
   */
  tipoDeUnidadArrastre: string;

  /**
   * @property {string} idDeVehiculo
   * Identificador único del vehículo en el sistema.
   * Código interno asignado para identificación y control administrativo.
   */
  idDeVehiculo: string;

  /**
   * @property {string} numeroEconomico
   * Número económico de la unidad de arrastre.
   * Identificador numérico interno asignado por la empresa transportista.
   */
  numeroEconomico: string;

  /**
   * @property {string} numeroPlaca
   * Número de placa oficial de la unidad de arrastre.
   * Matrícula vehicular emitida por la autoridad competente.
   */
  numeroPlaca: string;

  /**
   * @property {string} paisEmisor
   * País que emitió la placa de la unidad de arrastre.
   * Nación donde fue registrada la unidad y emitidas las placas oficiales.
   */
  paisEmisor: string;

  /**
   * @property {string} estado
   * Estado o provincia emisor de la placa.
   * Entidad federativa o división administrativa que emitió el registro.
   */
  estado: string;

  /**
   * @property {string} colorVehiculo
   * Color principal de la unidad de arrastre.
   * Descripción del color predominante según documentos oficiales.
   */
  colorVehiculo: string;

  /**
   * @property {string} numero2daPlaca
   * Número de segunda placa, si aplica.
   * Matrícula adicional para unidades que requieren doble identificación.
   */
  numero2daPlaca: string;

  /**
   * @property {string} estado2daPlaca
   * Estado emisor de la segunda placa.
   * Entidad federativa que emitió la segunda matrícula de la unidad.
   */
  estado2daPlaca: string;

  /**
   * @property {string} paisEmisor2daPlaca
   * País emisor de la segunda placa.
   * Nación donde fue registrada y emitida la segunda matrícula.
   */
  paisEmisor2daPlaca: string;

  /**
   * @property {string} descripcion
   * Descripción adicional de la unidad de arrastre.
   * Información complementaria sobre características o uso específico.
   */
  descripcion: string;
}

/**
 * Interfaz que representa una lista de catálogos.
 *
 * Esta interfaz define una estructura genérica para contener listas
 * de elementos de catálogo. Se utiliza para agrupar múltiples opciones
 * de catálogos que pueden ser utilizados en selecciones y configuraciones.
 *
 * @interface CatalogoLista
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const listaCatalogos: CatalogoLista = {
 *   datos: [
 *     { id: 1, descripcion: "Opción 1", clave: "OPC1" },
 *     { id: 2, descripcion: "Opción 2", clave: "OPC2" }
 *   ]
 * };
 * ```
 */
export interface CatalogoLista {
  /**
   * @property {Catalogo[]} datos
   * Lista de catálogos.
   * Array que contiene todos los elementos del catálogo disponibles para selección.
   */
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
 * Interfaz que representa una unidad de arrastre en formato tabla.
 *
 * Esta interfaz define la estructura de datos para mostrar información
 * simplificada de unidades de arrastre en formatos tabulares. Contiene
 * los campos esenciales necesarios para la visualización y gestión de
 * unidades de arrastre en el sistema aduanero, optimizada para presentación
 * en tablas y grillas de datos.
 *
 * @interface UnidadTabla
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const unidadTabla: UnidadTabla = {
 *   vinVehiculo: "1HGBH41JXMN109186",
 *   tipoDeUnidadArrastre: "Semirremolque",
 *   numeroEconomico: "ECO789",
 *   numeroPlaca: "REM-456-GHI",
 *   paisEmisor: "México",
 *   estado: "Nuevo León"
 * };
 * ```
 */
export interface UnidadTabla {
  /**
   * @property {string} vinVehiculo
   * Número de identificación vehicular (VIN) de la unidad.
   * Código alfanumérico único de 17 caracteres asignado por el fabricante para identificación vehicular.
   */
  vinVehiculo: string;

  /**
   * @property {string} tipoDeUnidadArrastre
   * Tipo específico de unidad de arrastre.
   * Clasificación del vehículo auxiliar: remolque, semirremolque, caja seca, etc.
   */
  tipoDeUnidadArrastre: string;

  /**
   * @property {string} numeroEconomico
   * Número económico de la unidad de arrastre.
   * Identificador numérico interno asignado por la empresa transportista para control operativo.
   */
  numeroEconomico: string;

  /**
   * @property {string} numeroPlaca
   * Número de placa oficial de la unidad de arrastre.
   * Matrícula vehicular emitida por la autoridad competente para circulación legal.
   */
  numeroPlaca: string;

  /**
   * @property {string} paisEmisor
   * País que emitió la placa de la unidad de arrastre.
   * Nación donde fue registrada la unidad y emitidas las placas oficiales de circulación.
   */
  paisEmisor: string;

  /**
   * @property {string} estado
   * Estado o provincia emisor de la placa.
   * Entidad federativa o división administrativa que emitió el registro vehicular.
   */
  estado: string;

}

/**
 * Interfaz que define la configuración completa de la tabla de unidades.
 *
 * Esta interfaz establece la estructura para configurar tablas de unidades
 * de arrastre, incluyendo tanto los encabezados de las columnas como los
 * datos que se mostrarán. Proporciona una configuración flexible para
 * la presentación tabular de información de unidades.
 *
 * @interface UnidadTablaConfig
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const configTabla: UnidadTablaConfig = {
 *   encabezadas: [
 *     { encabezado: "VIN", clave: (item) => item.vinVehiculo, orden: 1 },
 *     { encabezado: "Tipo", clave: (item) => item.tipoDeUnidadArrastre, orden: 2 }
 *   ],
 *   datos: [
 *     { vinVehiculo: "ABC123", tipoDeUnidadArrastre: "Remolque", numeroEconomico: "REM001" }
 *   ]
 * };
 * ```
 */
export interface UnidadTablaConfig {
  /**
   * @property {Array<Object>} encabezadas
   * Lista de configuración de encabezados de la tabla.
   * Define las columnas de la tabla con su texto de encabezado, función de extracción de datos y orden.
   */
  encabezadas: {
    /**
     * @property {string} encabezado
     * Texto del encabezado de la columna.
     * Título que se mostrará en la cabecera de cada columna de la tabla.
     */
    encabezado: string;

    /**
     * @property {Function} clave
     * Función que extrae el valor de la columna desde el objeto de datos.
     * Función que recibe un item de UnidadTabla y retorna el valor a mostrar en la columna.
     */
    clave: (item: UnidadTabla) => string;

    /**
     * @property {number} orden
     * Orden de aparición de la columna en la tabla.
     * Número que determina la secuencia de las columnas de izquierda a derecha.
     */
    orden: number;
  }[];

  /**
   * @property {UnidadTabla[]} datos
   * Lista de datos de las unidades para mostrar en la tabla.
   * Array de objetos que contienen la información de cada unidad de arrastre.
   */
  datos: UnidadTabla[];
} 