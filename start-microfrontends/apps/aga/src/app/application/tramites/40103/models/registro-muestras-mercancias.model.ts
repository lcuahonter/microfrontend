/**
 * @fileoverview Modelos de datos para el registro de muestras de mercancías en el trámite 40103
 * 
 * Este archivo contiene las interfaces y tipos de datos utilizados en el trámite 40103
 * para el registro y gestión de muestras de mercancías. Define estructuras de datos
 * para catálogos, registros de muestras, información de vehículos, choferes y
 * documentación relacionada con el proceso de importación/exportación.
 * 
 * Las interfaces están organizadas por funcionalidad:
 * - Catálogos y selecciones importantes
 * - Registros de muestras y fechas de validez
 * - Información de transportistas (nacionales y extranjeros)
 * - Datos de vehículos y unidades de arrastre
 * - Estructuras de almacenamiento y gestión de estado
 * 
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module RegistroMuestrasMercanciasModel
 */

import { Catalogo, CatalogosSelect } from '@ng-mf/data-access-user';
import { TableData } from '@ng-mf/data-access-user';



/**
 * Define la estructura del domicilio en la respuesta de la API para un chofer nacional.
 */
export interface DomicilioAPI {
  pais: string;
  codigo_postal: string;
  estado: string;
  municipio: string;
  localidad: string;
  colonia: string;
  calle: string;
  numero_exterior: string;
  numero_interior: string;
  pais_de_residencia:string
  ciudad:string
  correo_electronico:string
  telefono: string
}

/**
 * Define la estructura de los datos del chofer en la respuesta de la API.
 */
export interface DatosChoferAPI {
  curp: string;
  rfc: string;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  numero_de_gafete: string;
  vigencia_del_gafete: string;
  domicilio: DomicilioAPI;
}

/**
 * Define la estructura completa de la respuesta de la API para la búsqueda de un chofer nacional.
 */
export interface ApiResponseChoferNacional {
  codigo: string;
  mensaje: string;
  datos: DatosChoferAPI;
}

/**
 * Define la estructura de los datos del chofer extranjero en la respuesta de la API.
 */
export interface DatosChoferExtranjeroAPI {
    nss: string;
    nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    nacionalidad: string;
    numero_de_gafete: string;
    vigencia_del_gafete: string;
}

/**
 * Define la estructura completa de la respuesta de la API para la búsqueda de un chofer extranjero.
 */
export interface ApiResponseChoferExtranjero {
  codigo: string;
  mensaje: string;
  datos: DatosChoferExtranjeroAPI;
}

/**
 * Define la estructura de los datos del parque vehicular en la respuesta de la API.
 */
export interface DatosParqueVehicularAPI {
    numero_identificacion_vehicular: string;
    tipo_vehiculo: string;
    id_vehiculo: string;
    numero_placas: string;
    pais_emisor: string;
    estado_provincia: string;
    color_vehiculo: number;
    numero_economico: string;
    numero_2da_placa: string;
    estado_emisor_2da_placa: string;
    pais_emisor_2da_placa: string;
    descripcion_vehiculo: string;
    marca: string;
    modelo: string;
    anio: string;
    transponder: string;
}

/**
 * Define la estructura completa de la respuesta de la API para la búsqueda de un vehículo del parque vehicular.
 */
export interface ApiResponseParqueVehicular {
  codigo: string;
  mensaje: string;
  datos: DatosParqueVehicularAPI;
}

/**
 * Define la estructura de los datos de la unidad de arrastre en la respuesta de la API.
 */
export interface DatosUnidadArrastreAPI {
    numero_identificacion_vehicular: string;
    id_vehiculo: string;
    numero_placas: string;
    pais_emisor: string;
    estado_provincia: string;
    color_vehiculo: number;
    numero_economico: string;
    numero_2da_placa: string;
    estado_emisor_2da_placa: string;
    pais_emisor_2da_placa: string;
    descripcion_vehiculo: string;
    id_vehiculo_arrastre: string;
    color_vehiculo_arrastre: number;
    descripcion_unidad_arrastre: string;
    marca: string;
    modelo: string;
    anio: string;
    transponder: string;
    tipo_vehiculo: string;
}

/**
 * Define la estructura completa de la respuesta de la API para la búsqueda de una unidad de arrastre.
 */
export interface ApiResponseUnidadArrastre {
  codigo: string;
  mensaje: string;
  datos: DatosUnidadArrastreAPI;
}

/**
 * Representa la respuesta de la API para la información de un solicitante.
 *
 * @property codigo - Código de respuesta de la API (opcional, puede ser null).
 * @property mensaje - Mensaje general de la API (opcional, puede ser null).
 * @property datos - Objeto que contiene la información específica de la respuesta.
 * @property datos.mostrar_director_general - Indica si se debe mostrar la información del director general (opcional, puede ser null).
 * @property datos.solicitante - Información del solicitante, de tipo `Solicitante` (opcional, puede ser null).
 * @property datos.director_general - Información del director general asociada al solicitante, de tipo `DirectorGeneral` (opcional, puede ser null).
 * @property datos.caat_existe - Indica si existe un registro CAAT para el solicitante (opcional, puede ser null).
 * @property datos.mensaje - Mensaje específico dentro de los datos de la API (opcional, puede ser null).
 */
export interface ApiResponseSolicitante {
  codigo: string | null;
  mensaje: string | null;
  error:string | null;
  datos: {
    mostrar_director_general: boolean | null;
    solicitante: Solicitante | null;
    director_general: DirectorGeneral | null
    caat_existe: boolean | null;
    mensaje: string | null
  };
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
 * Interfaz que representa una selección importante del catálogo para el registro de muestras de mercancías.
 * 
 * Esta interfaz define la estructura de datos principales utilizados en el trámite 40103
 * para el registro de muestras de mercancías. Incluye catálogos de selección para
 * importadores/exportadores, fracciones arancelarias, códigos NICO, y otras
 * clasificaciones necesarias para el proceso de registro.
 * 
 * La interfaz agrupa elementos relacionados con:
 * - Catálogos de selección para clasificación de mercancías
 * - Tablas de datos para requisitos y tarifas
 * - Información de validez y fechas de autorización
 * - Datos específicos del registro y transportistas
 * 
 * @interface ImportanteCatalogoSeleccion
 * 
 * @example
 * ```typescript
 * const catalogoSeleccion: ImportanteCatalogoSeleccion = {
 *   importadorExportadorPrevio: catalogoImportador,
 *   fraccionArancelariaAga: catalogoFraccion,
 *   nico: catalogoNico,
 *   ideGenerica: catalogoIde,
 *   tomaMuestraDespacho: catalogoMuestra,
 *   requisitosObligatoriosTabla: tablaRequisitos,
 *   tablaDeTarifasDePago: tablaTarifas,
 *   validezDeLaAutorizacion: fechasValidez,
 *   registroMuestrasDatos: datosRegistro,
 *   datosDelChoferNacional: [choferNacional]
 * };
 * ```
 * 
 * @since 1.0.0
 */
export interface ImportanteCatalogoSeleccion {
  /**
   * Selección previa del importador/exportador.
   * 
   * @property {CatalogosSelect} importadorExportadorPrevio
   * Catálogo que contiene los importadores/exportadores previamente registrados
   */
  importadorExportadorPrevio: CatalogosSelect;

  /**
   * Selección de la fracción arancelaria AGA.
   * 
   * @property {CatalogosSelect} fraccionArancelariaAga
   * Catálogo de fracciones arancelarias gestionadas por la Aduana General
   */
  fraccionArancelariaAga: CatalogosSelect;

  /**
   * Selección del código NICO.
   * 
   * @property {CatalogosSelect} nico
   * Catálogo de códigos NICO (Número de Identificación Comercial)
   */
  nico: CatalogosSelect;

  /**
   * Selección de la IDE genérica.
   * 
   * @property {CatalogosSelect} ideGenerica
   * Catálogo de identificaciones genéricas de productos
   */
  ideGenerica: CatalogosSelect;
  
  /**
   * Selección de la toma de muestra en despacho.
   * 
   * @property {CatalogosSelect} tomaMuestraDespacho
   * Catálogo de opciones para toma de muestras durante el despacho aduanero
   */
  tomaMuestraDespacho: CatalogosSelect;
  
  /**
   * Tabla de requisitos obligatorios.
   * 
   * @property {TableData} requisitosObligatoriosTabla
   * Estructura de datos que contiene los requisitos obligatorios del trámite
   */
  requisitosObligatoriosTabla: TableData;

  /**
   * Tabla de tarifas de pago.
   * 
   * @property {TableData} tablaDeTarifasDePago
   * Estructura de datos con las tarifas y costos asociados al trámite
   */
  tablaDeTarifasDePago: TableData;

  /**
   * Fechas de validez de la autorización.
   * 
   * @property {ListaDeFechas} validezDeLaAutorizacion
   * Almacena las fechas de inicio y fin de vigencia de la autorización
   */
  validezDeLaAutorizacion: ListaDeFechas;

  /**
   * Datos del registro de muestras.
   * 
   * @property {RegistroMuestras} registroMuestrasDatos
   * Información detallada del registro de muestras de mercancías
   */
  registroMuestrasDatos: RegistroMuestras;

  /**
   * Lista de datos de choferes nacionales.
   * 
   * @property {DatosDelChoferNacional[]} datosDelChoferNacional
   * Array que contiene información de choferes nacionales asociados al trámite
   */
  datosDelChoferNacional: DatosDelChoferNacional[];
}
/**
 * Interfaz que representa un registro de muestras de mercancías.
 * 
 * Esta interfaz define la estructura de datos específica para el registro
 * de muestras de mercancías en el trámite 40103. Incluye información sobre
 * la clasificación arancelaria, identificación comercial, características
 * químicas y detalles específicos del producto muestreado.
 * 
 * Contiene información esencial para:
 * - Identificación del importador y tipo de muestra
 * - Clasificación arancelaria y comercial de la mercancía
 * - Características químicas y comerciales del producto
 * - Descripción detallada y especificaciones técnicas
 * 
 * @interface RegistroMuestras
 * 
 * @example
 * ```typescript
 * const registroMuestra: RegistroMuestras = {
 *   opcionDeImportador: 'EMPRESA_ABC',
 *   tomaMuestraDespacho: 'SI',
 *   descMotivoFaltaMuestra: '',
 *   comboFraccionConcatenada: '2936.29.01|Vitaminas',
 *   fraccionConcatenada: '2936.29.01',
 *   fracciondescripcion: 'Vitaminas del complejo B',
 *   comboNicos: 'V001|Vitamina B12',
 *   nicoDescripcion: 'Vitamina B12 sintética',
 *   nombreQuimico: 'Cianocobalamina',
 *   nombreComercial: 'B12 Premium',
 *   numeroCAS: '68-19-9',
 *   ideGenerica: 12345,
 *   descClobGenerica: 'Vitamina B12 en polvo cristalino...'
 * };
 * ```
 * 
 * @since 1.0.0
 */
export interface RegistroMuestras {
  /**
   * Opción del importador seleccionada en el registro.
   * 
   * @property {string} opcionDeImportador
   * Identificador o nombre del importador seleccionado para el registro de la muestra
   */
  opcionDeImportador: string;

  /**
   * Indica si se tomó una muestra en el despacho.
   * 
   * @property {string} tomaMuestraDespacho
   * Valor que indica si se realizó toma de muestra durante el despacho aduanero
   */
  tomaMuestraDespacho: string;

  /**
   * Motivo de la falta de muestra, si no se realizó la toma de muestra.
   * 
   * @property {string} descMotivoFaltaMuestra
   * Descripción del motivo por el cual no se pudo realizar la toma de muestra
   */
  descMotivoFaltaMuestra: string;

  /**
   * Valor combinado de fracción arancelaria seleccionado en un combo.
   * 
   * @property {string} comboFraccionConcatenada
   * Valor concatenado que incluye código y descripción de la fracción arancelaria
   */
  comboFraccionConcatenada: string;

  /**
   * Código de la fracción arancelaria.
   * 
   * @property {string} fraccionConcatenada
   * Código numérico de la fracción arancelaria según la clasificación oficial
   */
  fraccionConcatenada: string;

  /**
   * Descripción de la fracción arancelaria.
   * 
   * @property {string} fracciondescripcion
   * Descripción textual detallada de la fracción arancelaria
   */
  fracciondescripcion: string;

  /**
   * Valor combinado de NICOS seleccionado en un combo.
   * 
   * @property {string} comboNicos
   * Valor concatenado que incluye código y descripción del NICO
   */
  comboNicos: string;

  /**
   * Descripción del NICOS asociado.
   * 
   * @property {string} nicoDescripcion
   * Descripción textual del código NICO (Número de Identificación Comercial)
   */
  nicoDescripcion: string;

  /**
   * Nombre químico de la sustancia o mercancía.
   * 
   * @property {string} nombreQuimico
   * Denominación química oficial de la sustancia según nomenclatura internacional
   */
  nombreQuimico: string;

  /**
   * Nombre comercial de la sustancia o mercancía.
   * 
   * @property {string} nombreComercial
   * Nombre comercial bajo el cual se comercializa el producto
   */
  nombreComercial: string;

  /**
   * Número CAS (Chemical Abstracts Service) de la sustancia.
   * 
   * @property {string} numeroCAS
   * Número de registro único asignado por el Chemical Abstracts Service
   */
  numeroCAS: string;

  /**
   * Identificación genérica de la mercancía.
   * 
   * @property {number} ideGenerica
   * Código numérico de identificación genérica del producto
   */
  ideGenerica: number;

  /**
   * Descripción detallada del producto en formato CLOB (Character Large Object).
   * 
   * @property {string} descClobGenerica
   * Descripción extensa del producto que puede contener gran cantidad de texto
   */
  descClobGenerica: string;
}

/**
 * Interfaz que representa una lista de fechas de validez.
 * 
 * Esta interfaz define el período de vigencia de autorizaciones y permisos
 * en el trámite 40103. Las fechas se almacenan en formato string para
 * compatibilidad con diferentes formatos de fecha y facilitar la serialización.
 * 
 * @interface ListaDeFechas
 * 
 * @example
 * ```typescript
 * const fechasValidez: ListaDeFechas = {
 *   fechaInicioVigencia: '2024-01-01',
 *   fechaFinVigencia: '2024-12-31'
 * };
 * 
 * // Validar vigencia actual
 * const hoy = new Date().toISOString().split('T')[0];
 * const estaVigente = hoy >= fechasValidez.fechaInicioVigencia && 
 *                     hoy <= fechasValidez.fechaFinVigencia;
 * ```
 * 
 * @since 1.0.0
 */
export interface ListaDeFechas {
  /**
   * Fecha de inicio de vigencia.
   * 
   * @property {string} fechaInicioVigencia
   * Fecha de inicio del período de validez en formato string (YYYY-MM-DD)
   */
  fechaInicioVigencia: string;
  
  /**
   * Fecha de fin de vigencia.
   * 
   * @property {string} fechaFinVigencia
   * Fecha de finalización del período de validez en formato string (YYYY-MM-DD)
   */
  fechaFinVigencia: string;
}

/**
 * Interfaz que representa el estado de almacenamiento de muestras de mercancías.
 * 
 * Esta interfaz define la estructura del store de estado para el manejo de
 * muestras de mercancías en el trámite 40103. Centraliza la información de
 * autorizaciones, registros, pagos y catálogos relacionados con el proceso
 * de importación y exportación de muestras.
 * 
 * El store incluye:
 * - Gestión de fechas de validez y renovaciones
 * - Información de pagos y derechos
 * - Catálogos de clasificación y selección
 * - Estado de autorizaciones y registros
 * 
 * @interface MuestrasMercanciasStore
 * 
 * @example
 * ```typescript
 * const storeState: MuestrasMercanciasStore = {
 *   validezDeLaAutorizacion: { fechaInicioVigencia: '2024-01-01', fechaFinVigencia: '2024-12-31' },
 *   renovacionesDeRegistro: registroMuestras,
 *   pagoDeDerechos: tablaDerechosData,
 *   importadorExportadorPrevio: catalogoImportadores,
 *   fraccionArancelariaAga: catalogoFracciones,
 *   nico: catalogoNicos,
 *   ideGenerica: catalogoIdes,
 *   tomaMuestraDespacho: catalogoMuestras
 * };
 * ```
 * 
 * @since 1.0.0
 */
export interface MuestrasMercanciasStore {
  /**
   * Fechas de validez de la autorización.
   * 
   * @property {ListaDeFechas} validezDeLaAutorizacion
   * Almacena las fechas de inicio y fin de vigencia de la autorización
   */
  validezDeLaAutorizacion: ListaDeFechas;

  /**
   * Registros de muestras y sus renovaciones.
   * 
   * @property {RegistroMuestras} renovacionesDeRegistro
   * Almacena los datos de registro de muestras y sus renovaciones
   */
  renovacionesDeRegistro: RegistroMuestras;

  /**
   * Detalles del pago de derechos.
   * 
   * @property {TableData} pagoDeDerechos
   * Almacena información detallada del pago, incluyendo encabezados y datos de la tabla
   */
  pagoDeDerechos: TableData;

  /**
   * Catálogo de importadores/exportadores previos.
   * 
   * @property {CatalogosSelect} importadorExportadorPrevio
   * Almacena el catálogo de importadores/exportadores previamente registrados
   */
  importadorExportadorPrevio: CatalogosSelect;

  /**
   * Catálogo de fracciones arancelarias AGA.
   * 
   * @property {CatalogosSelect} fraccionArancelariaAga
   * Almacena el catálogo de fracciones arancelarias de la Aduana General
   */
  fraccionArancelariaAga: CatalogosSelect;

  /**
   * Catálogo de códigos NICO.
   * 
   * @property {CatalogosSelect} nico
   * Almacena el catálogo de NICO (Número de Identificación Comercial)
   */
  nico: CatalogosSelect;

  /**
   * Catálogo de IDE genérico.
   * 
   * @property {CatalogosSelect} ideGenerica
   * Almacena el catálogo de IDE genérico (Identificación de Especificaciones)
   */
  ideGenerica: CatalogosSelect;

  /**
   * Catálogo de toma de muestras en despacho.
   * 
   * @property {CatalogosSelect} tomaMuestraDespacho
   * Almacena el catálogo relacionado con la toma de muestras durante el despacho
   */
  tomaMuestraDespacho: CatalogosSelect;
}

/**
 * Interfaz que representa los datos de un chofer nacional.
 * 
 * Esta interfaz define la estructura de información personal, documentación
 * oficial y datos de contacto de choferes nacionales mexicanos para el
 * trámite 40103. Incluye información requerida por las autoridades aduaneras
 * y de transporte para el manejo de mercancías.
 * 
 * Contiene datos esenciales como:
 * - Identificación personal (CURP, RFC, nombre completo)
 * - Documentación de conductor (gafete, vigencia)
 * - Información de domicilio completo
 * - Datos de contacto obligatorios
 * 
 * @interface DatosDelChoferNacional
 * 
 * @example
 * ```typescript
 * const choferNacional: DatosDelChoferNacional = {
 *   id: 'CHF001',
 *   curp: 'PAMC850315HDFRRR09',
 *   rfc: 'PAMC850315ABC',
 *   nombre: 'Carlos',
 *   primerApellido: 'Pérez',
 *   segundoApellido: 'Martínez',
 *   numeroDeGafete: '123456789',
 *   vigenciaGafete: '2025-12-31',
 *   calle: 'Av. Insurgentes',
 *   numeroExterior: '1234',
 *   numeroInterior: 'A',
 *   pais: 'México',
 *   estado: 'Ciudad de México',
 *   municipioAlcaldia: 'Benito Juárez',
 *   colonia: 'Roma Norte',
 *   telefono: '5551234567',
 *   correoElectronico: 'carlos.perez@email.com'
 * };
 * ```
 * 
 * @since 1.0.0
 */
export interface DatosDelChoferNacional {
  /**
   * Identificador único del chofer.
   * 
   * @property {unknown} id
   * Identificador único del registro del chofer nacional
   */
  id: unknown;
  
  /**
   * CURP del chofer nacional.
   * 
   * @property {string} [curp]
   * Clave Única de Registro de Población (18 caracteres)
   */
  curp?: string;
  
  /**
   * RFC del chofer nacional.
   * 
   * @property {string} [rfc]
   * Registro Federal de Contribuyentes (13 caracteres para persona física)
   */
  rfc?: string;

  /**
   * Nombre del chofer nacional.
   * 
   * @property {string} [nombre]
   * Nombre de pila del conductor
   */
  nombre?:string;
  
  /**
   * Primer apellido del chofer.
   * 
   * @property {string} [primerApellido]
   * Apellido paterno del conductor
   */
  primerApellido?: string;
  
  /**
   * Segundo apellido del chofer.
   * 
   * @property {string} [segundoApellido]
   * Apellido materno del conductor
   */
  segundoApellido?: string;
  
  /**
   * Número de gafete del chofer.
   * 
   * @property {string} [numeroDeGafete]
   * Número de identificación del gafete de conductor profesional
   */
  numeroDeGafete?: string;
  
  /**
   * Vigencia del gafete.
   * 
   * @property {string} [vigenciaGafete]
   * Fecha de vencimiento del gafete en formato string
   */
  vigenciaGafete?: string;
  

  /**
   * Calle del domicilio.
   * 
   * @property {string} [calle]
   * Nombre de la calle del domicilio del chofer
   */
  calle?: string;
  
  /**
   * Número exterior del domicilio.
   * 
   * @property {string} [numeroExterior]
   * Número oficial de la fachada del inmueble
   */
  numeroExterior?: string;
  
  /**
   * Número interior del domicilio.
   * 
   * @property {string} [numeroInterior]
   * Número de departamento, local o unidad específica
   */
  numeroInterior?: string;
  
  /**
   * País de residencia.
   * 
   * @property {string} [pais]
   * País donde reside el chofer
   */
  pais?: string;
  
  /**
   * Estado o entidad federativa.
   * 
   * @property {string} [estado]
   * Estado de la República Mexicana donde reside
   */
  estado?: string;
  
  /**
   * Municipio o alcaldía.
   * 
   * @property {string} [municipioAlcaldia]
   * División administrativa local (municipio o alcaldía)
   */
  municipioAlcaldia?: string;
  
  /**
   * Colonia del domicilio.
   * 
   * @property {string} [colonia]
   * Nombre de la colonia o fraccionamiento
   */
  colonia?: string;
  
  /**
   * País de residencia específico.
   * 
   * @property {string} [paisDeResidencia]
   * País específico de residencia del chofer
   */
  paisDeResidencia?: string;
  
  /**
   * Ciudad del domicilio.
   * 
   * @property {string} [ciudad]
   * Ciudad donde está ubicado el domicilio
   */
  ciudad?: string;
  
  /**
   * Localidad del domicilio.
   * 
   * @property {string} [localidad]
   * Localidad específica dentro del municipio
   */
  localidad?: string;
  
  /**
   * Código postal del domicilio.
   * 
   * @property {string} [codigoPostal]
   * Código postal de 5 dígitos del domicilio
   */
  codigoPostal?: string; 


  /**
   * Número de teléfono de contacto.
   * 
   * @property {string} telefono
   * Número telefónico de contacto del chofer (obligatorio)
   */
  telefono: string;
  
  /**
   * Correo electrónico de contacto.
   * 
   * @property {string} correoElectronico
   * Dirección de correo electrónico del chofer (obligatorio)
   */
  correoElectronico: string;
}

/**
 * Interfaz que representa los datos de choferes extranjeros.
 * 
 * Esta interfaz define la estructura de información para choferes de
 * nacionalidad extranjera que participan en el transporte de mercancías
 * en el trámite 40103. Incluye documentación específica para extranjeros
 * como identificación fiscal y seguro social del país de origen.
 * 
 * Contiene campos específicos para:
 * - Identificación personal y nacionalidad
 * - Documentación de conductor extranjero
 * - Información fiscal y de seguridad social
 * - Datos de domicilio y contacto
 * 
 * @interface ChoferesExtranjeros
 * 
 * @example
 * ```typescript
 * const choferExtranjero: ChoferesExtranjeros = {
 *   numero: 'CHE001',
 *   primerApellido: 'Smith',
 *   segundoApellido: 'Johnson',
 *   nacionalidad: 'Estados Unidos',
 *   numeroDeGafete: 'US123456',
 *   vigenciaGafete: '2025-06-30',
 *   numeroDelSeguroSocial: '123-45-6789',
 *   numberDeIdeFiscal: 'US-TAX-123456',
 *   pais: 'Estados Unidos',
 *   estado: 'Texas',
 *   calle: 'Main Street',
 *   numeroExterior: '123',
 *   correoElectronico: 'john.smith@email.com',
 *   telefono: '+1-555-123-4567'
 * };
 * ```
 * 
 * @since 1.0.0
 */
export interface ChoferesExtranjeros {
  /**
   * Número de identificación del chofer extranjero.
   * 
   * @property {string} [numero]
   * Número de identificación único del chofer extranjero
   */
  numero?:string;
  
  /**
   * Primer apellido del chofer extranjero.
   * 
   * @property {string} [primerApellido]
   * Apellido paterno o primer apellido del conductor
   */
  primerApellido?: string;
  
  /**
   * Segundo apellido del chofer extranjero.
   * 
   * @property {string} [segundoApellido]
   * Apellido materno o segundo apellido del conductor
   */
  segundoApellido?: string;

  /**
   * Nacionalidad del chofer extranjero.
   * 
   * @property {string} [nacionalidad]
   * País de nacionalidad del conductor extranjero
   */
  nacionalidad?: string;
  
  /**
   * Número de gafete del chofer extranjero.
   * 
   * @property {string} [numeroDeGafete]
   * Número de identificación del gafete internacional o del país de origen
   */
  numeroDeGafete?: string;
  
  /**
   * Vigencia del gafete extranjero.
   * 
   * @property {string} [vigenciaGafete]
   * Fecha de vencimiento del gafete en formato string
   */
  vigenciaGafete?: string;

  /**
   * Número del seguro social del país de origen.
   * 
   * @property {string} [numeroDelSeguroSocial]
   * Número de seguro social del país de origen del conductor
   */
  numeroDelSeguroSocial?: string;
  
  /**
   * Número de identificación fiscal extranjera.
   * 
   * @property {string} [numberDeIdeFiscal]
   * Número de identificación fiscal del país de origen
   */
  numberDeIdeFiscal?: string;

  /**
   * País de origen del chofer.
   * 
   * @property {string} [pais]
   * País de origen o nacionalidad del conductor
   */
  pais?: string;
 
  /**
   * Apellido paterno del chofer extranjero.
   * 
   * @property {string} [apellidoPaterno]
   * Apellido paterno según documentación del país de origen
   */
  apellidoPaterno?: string;
  
  /**
   * Código postal del domicilio.
   * 
   * @property {string} [codigoPostal]
   * Código postal del domicilio en el país de origen
   */
  codigoPostal?: string;
  
  /**
   * Estado o provincia del domicilio.
   * 
   * @property {string} [estado]
   * Estado, provincia o división administrativa del país de origen
   */
  estado?: string;

  /**
   * Calle del domicilio.
   * 
   * @property {string} [calle]
   * Nombre de la calle del domicilio del chofer
   */
  calle?: string;
  
  /**
   * Número exterior del domicilio.
   * 
   * @property {string} [numeroExterior]
   * Número exterior del inmueble donde reside
   */
  numeroExterior?: string;
  
  /**
   * Número interior del domicilio.
   * 
   * @property {string} [numeroInterior]
   * Número interior, departamento o unidad específica
   */
  numeroInterior?: string;
  
  /**
   * País de residencia actual.
   * 
   * @property {string} [paisDeResidencia]
   * País donde reside actualmente el conductor
   */
  paisDeResidencia?: string;
  
  /**
   * Ciudad del domicilio.
   * 
   * @property {string} [ciudad]
   * Ciudad donde está ubicado el domicilio
   */
  ciudad?: string;

  /**
   * Correo electrónico de contacto.
   * 
   * @property {string} [correoElectronico]
   * Dirección de correo electrónico del chofer extranjero
   */
  correoElectronico?: string;
  
  /**
   * Teléfono de contacto.
   * 
   * @property {string} [telefono]
   * Número telefónico de contacto del chofer extranjero
   */
  telefono?: string;
}
/**
 * Interfaz que representa una lista de pagos de derechos.
 * 
 * Esta interfaz define la estructura de datos para el manejo de información
 * relacionada con pagos de derechos y datos adicionales de transportistas
 * en el trámite 40103. Contiene una mezcla de campos para diferentes tipos
 * de información personal, fiscal y de domicilio.
 * 
 * @interface PagoDerechosLista
 * 
 * @example
 * ```typescript
 * const pagoDerechos: PagoDerechosLista = {
 *   numero: 'PAG001',
 *   calle: 'Av. Principal',
 *   estado: 'Ciudad de México',
 *   pais: 'México',
 *   apellidoPaterno: 'García',
 *   apellidoMaterno: 'López',
 *   rfc: 'GALO850315ABC',
 *   gafete: '123456789',
 *   vigenciaGafete: '2025-12-31'
 * };
 * ```
 * 
 * @since 1.0.0
 */
export interface PagoDerechosLista {
  /**
   * Número de línea de captura del pago.
   * 
   * @property {string} [numero]
   * Línea de captura o número de referencia del pago
   */
  numero?: string;
  
  /**
   * Calle del domicilio.
   * 
   * @property {string} [calle]
   * Nombre de la calle del domicilio
   */
  calle?: string;
  
  /**
   * Estado o entidad federativa.
   * 
   * @property {string} [estado]
   * Estado de la República Mexicana
   */
  estado?: string;
  
  /**
   * País de residencia.
   * 
   * @property {string} [pais]
   * País donde reside la persona
   */
  pais?: string;
  
  /**
   * Apellido paterno.
   * 
   * @property {string} [apellidoPaterno]
   * Primer apellido de la persona
   */
  apellidoPaterno?: string;
  
  /**
   * Apellido materno.
   * 
   * @property {string} [apellidoMaterno]
   * Segundo apellido de la persona
   */
  apellidoMaterno?: string;
  
  /**
   * RFC de la persona.
   * 
   * @property {string} [rfc]
   * Registro Federal de Contribuyentes
   */
  rfc?: string;
  
  /**
   * Número de gafete.
   * 
   * @property {string} [gafete]
   * Número de identificación del gafete
   */
  gafete?: string;
  
  /**
   * Vigencia del gafete.
   * 
   * @property {string} [vigenciaGafete]
   * Fecha de vencimiento del gafete
   */
  vigenciaGafete?: string;
  
  /**
   * Municipio de residencia.
   * 
   * @property {string} [municipio]
   * Municipio donde reside la persona
   */
  municipio?: string;
  
  /**
   * Colonia del domicilio.
   * 
   * @property {string} [colonia]
   * Nombre de la colonia o fraccionamiento
   */
  colonia?: string;
  
  /**
   * País de origen.
   * 
   * @property {string} [paisOrigen]
   * País de origen de la persona
   */
  paisOrigen?: string;
  
  /**
   * Ciudad del domicilio.
   * 
   * @property {string} [ciudad]
   * Ciudad donde está ubicado el domicilio
   */
  ciudad?: string;
  
  /**
   * CURP de la persona.
   * 
   * @property {string} [curp]
   * Clave Única de Registro de Población
   */
  curp?: string;
  
  /**
   * Número exterior del domicilio.
   * 
   * @property {string} [númeroExterior]
   * Número exterior del inmueble
   */
  númeroExterior?: string;
  
  /**
   * Número interior del domicilio.
   * 
   * @property {string} [númeroInterior]
   * Número interior del inmueble
   */
  númeroInterior?: string;
  
  /**
   * País alternativo.
   * 
   * @property {string} [país]
   * Campo alternativo para país
   */
  país?: string;
  
  /**
   * Primer apellido.
   * 
   * @property {string} [primerApellido]
   * Primer apellido de la persona
   */
  primerApellido?: string;
  
  /**
   * Segundo apellido.
   * 
   * @property {string} [segundoApellido]
   * Segundo apellido de la persona
   */
  segundoApellido?: string;
  
  /**
   * Número de gafete alternativo.
   * 
   * @property {string} [númeroDeGafete]
   * Campo alternativo para número de gafete
   */
  númeroDeGafete?: string;
  
  /**
   * Fecha fin de vigencia.
   * 
   * @property {string} [fechaFindDeVigencia]
   * Fecha de finalización de vigencia
   */
  fechaFindDeVigencia?: string;
  
  /**
   * Municipio o alcaldía.
   * 
   * @property {string} [municipioAlcaldía]
   * Campo alternativo para municipio o alcaldía
   */
  municipioAlcaldía?: string;
  
  /**
   * País de residencia alternativo.
   * 
   * @property {string} [PaísDeResidencia]
   * Campo alternativo para país de residencia
   */
  PaísDeResidencia?: string;
}

/**
 * Interfaz que representa la información completa de un vehículo.
 * 
 * Esta interfaz define la estructura de datos para vehículos utilizados
 * en el transporte de mercancías en el trámite 40103. Incluye información
 * técnica del vehículo, documentación oficial, y características específicas
 * requeridas para el transporte comercial.
 * 
 * Contiene información esencial como:
 * - Identificación del vehículo (VIN, placas, número económico)
 * - Características técnicas (marca, modelo, año, color)
 * - Documentación oficial y país emisor
 * - Información adicional y descripción
 * 
 * @interface Vehiculo
 * 
 * @example
 * ```typescript
 * const vehiculo: Vehiculo = {
 *   id: 1,
 *   solicitudVehiculoVin2: '1HGBH41JXMN109186',
 *   solicitudVehiculoTipoVehiculo: 'Tractor',
 *   solicitudVehiculoNumeroEconomico: 'ECO001',
 *   solicitudVehiculoNumeroPlacas: 'ABC-123',
 *   solicitudVehiculoPaisEmisor: 'México',
 *   solicitudDomicilioEstado: 'Nuevo León',
 *   solicitudVehiculoMarca: 'Volvo',
 *   solicitudVehiculoModelo: 'VNL',
 *   anioVehiculoVEH: '2023',
 *   solicitudVehiculoTransponder: 'TRP001',
 *   solicitudVehiculoColor: 'Blanco'
 * };
 * ```
 * 
 * @since 1.0.0
 */
export interface Vehiculo {
  /**
   * Identificador único del vehículo.
   * 
   * @property {number} id
   * Número de identificación único del registro del vehículo
   */
  id: number;
  
  /**
   * Número VIN del vehículo.
   * 
   * @property {string} solicitudVehiculoVin2
   * Número de Identificación Vehicular (Vehicle Identification Number)
   */
  solicitudVehiculoVin2: string;
  
  /**
   * Tipo de vehículo.
   * 
   * @property {string} solicitudVehiculoTipoVehiculo
   * Clasificación del tipo de vehículo (Tractor, Remolque, etc.)
   */
  solicitudVehiculoTipoVehiculo: string;
  
  /**
   * Número económico del vehículo.
   * 
   * @property {string} solicitudVehiculoNumeroEconomico
   * Número de identificación económica asignado por la empresa
   */
  solicitudVehiculoNumeroEconomico: string;
  
  /**
   * Número de placas del vehículo.
   * 
   * @property {string} solicitudVehiculoNumeroPlacas
   * Número de placas oficiales del vehículo
   */
  solicitudVehiculoNumeroPlacas: string;
  
  /**
   * País emisor de las placas.
   * 
   * @property {string} solicitudVehiculoPaisEmisor
   * País que emitió las placas del vehículo
   */
  solicitudVehiculoPaisEmisor: string;
  
  /**
   * Estado del domicilio relacionado.
   * 
   * @property {string} solicitudDomicilioEstado
   * Estado donde está registrado el domicilio del vehículo
   */
  solicitudDomicilioEstado: string;
  
  /**
   * Marca del vehículo.
   * 
   * @property {string} solicitudVehiculoMarca
   * Marca o fabricante del vehículo
   */
  solicitudVehiculoMarca: string;
  
  /**
   * Modelo del vehículo.
   * 
   * @property {string} solicitudVehiculoModelo
   * Modelo específico del vehículo
   */
  solicitudVehiculoModelo: string;
  
  /**
   * Año del vehículo.
   * 
   * @property {string} anioVehiculoVEH
   * Año de fabricación del vehículo
   */
  anioVehiculoVEH: string;
  
  /**
   * Número de transponder del vehículo.
   * 
   * @property {string} solicitudVehiculoTransponder
   * Número de identificación del transponder electrónico
   */
  solicitudVehiculoTransponder: string;
  
  /**
   * Color del vehículo.
   * 
   * @property {string} solicitudVehiculoColor
   * Color principal del vehículo
   */
  solicitudVehiculoColor: string;
  
  /**
   * Número de segunda placa (opcional).
   * 
   * @property {string} [solicitudVehiculoNumero2daPlaca]
   * Número de segunda placa si aplica
   */
  solicitudVehiculoNumero2daPlaca?: string;
  
  /**
   * Emisor de la segunda placa (opcional).
   * 
   * @property {string} [solicitudVehiculoEmisor2daPlaca]
   * Entidad que emitió la segunda placa
   */
  solicitudVehiculoEmisor2daPlaca?: string;
  
  /**
   * País emisor de la segunda placa (opcional).
   * 
   * @property {string} [solicitudVehiculoPaisEmisorSegundaPlaca]
   * País que emitió la segunda placa
   */
  solicitudVehiculoPaisEmisorSegundaPlaca?: string;
  
  /**
   * Descripción adicional del vehículo (opcional).
   * 
   * @property {string} [solicitudVehiculoDesc]
   * Descripción adicional o comentarios sobre el vehículo
   */
  solicitudVehiculoDesc?: string;
}

/**
 * Interfaz que representa un chofer con información completa.
 * 
 * Esta interfaz define la estructura de datos unificada para choferes que
 * pueden ser nacionales o extranjeros. Incluye campos para identificación,
 * documentación, domicilio y contacto, adaptándose a diferentes tipos de
 * conductores según su nacionalidad.
 * 
 * @interface Chofer
 * 
 * @example
 * ```typescript
 * const chofer: Chofer = {
 *   descripcion: 'Chofer Nacional',
 *   clave: 'CHN001',
 *   id: 1,
 *   curp: 'PAMC850315HDFRRR09',
 *   rfc: 'PAMC850315ABC',
 *   nombre: 'Carlos',
 *   apellidoPaterno: 'Pérez',
 *   apellidoMaterno: 'Martínez',
 *   gafete: '123456789',
 *   vigenciagafete: '2025-12-31'
 * };
 * ```
 * 
 * @since 1.0.0
 */
export interface Chofer {
  /**
   * Descripción del tipo de chofer.
   * 
   * @property {string} descripcion
   * Descripción textual del tipo de chofer (nacional, extranjero, etc.)
   */
  descripcion: string;
  
  /**
   * Clave de identificación del chofer.
   * 
   * @property {string} clave
   * Clave única de identificación del chofer en el sistema
   */
  clave: string;
  
  /**
   * Identificador único del chofer.
   * 
   * @property {number} id
   * Número de identificación único del registro del chofer
   */
  id: number;
  
  /**
   * CURP del chofer (opcional).
   * 
   * @property {string} [curp]
   * Clave Única de Registro de Población para choferes nacionales
   */
  curp?: string;
  
  /**
   * RFC del chofer (opcional).
   * 
   * @property {string} [rfc]
   * Registro Federal de Contribuyentes para choferes nacionales
   */
  rfc?: string;
  
  /**
   * Nombre del chofer (opcional).
   * 
   * @property {string} [nombre]
   * Nombre de pila del conductor
   */
  nombre?: string;
  
  /**
   * Apellido paterno (opcional).
   * 
   * @property {string} [apellidoPaterno]
   * Primer apellido del conductor
   */
  apellidoPaterno?: string;
  
  /**
   * Apellido materno (opcional).
   * 
   * @property {string} [apellidoMaterno]
   * Segundo apellido del conductor
   */
  apellidoMaterno?: string;
  
  /**
   * Número de gafete (opcional).
   * 
   * @property {string} [gafete]
   * Número de identificación del gafete de conductor
   */
  gafete?: string;
  
  /**
   * Vigencia del gafete (opcional).
   * 
   * @property {string} [vigenciagafete]
   * Fecha de vencimiento del gafete
   */
  vigenciagafete?: string;
  
  /**
   * Calle del domicilio (opcional).
   * 
   * @property {string} [calle]
   * Nombre de la calle del domicilio
   */
  calle?: string;
  
  /**
   * Número exterior (opcional).
   * 
   * @property {string} [numeroExterior]
   * Número exterior del domicilio
   */
  numeroExterior?: string;
  
  /**
   * Número interior (opcional).
   * 
   * @property {string} [numeroInterior]
   * Número interior del domicilio
   */
  numeroInterior?: string;
  
  /**
   * Ciudad (opcional).
   * 
   * @property {string} [ciudad]
   * Ciudad del domicilio
   */
  ciudad?: string;
  
  /**
   * Localidad (opcional).
   * 
   * @property {string} [localidad]
   * Localidad del domicilio
   */
  localidad?: string;
  
  /**
   * Código postal (opcional).
   * 
   * @property {string} [codigoPostal]
   * Código postal del domicilio
   */
  codigoPostal?: string;
  
  /**
   * País para chofer nacional (opcional).
   * 
   * @property {string} [paisChn]
   * País de residencia para chofer nacional
   */
  paisChn?: string;
  
  /**
   * Estado (opcional).
   * 
   * @property {string} [estado]
   * Estado o entidad federativa
   */
  estado?: string;
  
  /**
   * Número del seguro social (opcional).
   * 
   * @property {string} [numerodelsegurosocial]
   * Número del seguro social del chofer
   */
  numerodelsegurosocial?: string;
  
  /**
   * Entidad federativa para chofer nacional (opcional).
   * 
   * @property {string} [entidadFederativaCHN]
   * Entidad federativa específica para chofer nacional
   */
  entidadFederativaCHN?: string;
  
  /**
   * Delegación para chofer nacional (opcional).
   * 
   * @property {string} [delegacionCHN]
   * Delegación o alcaldía para chofer nacional
   */
  delegacionCHN?: string;
  
  /**
   * Colonia para chofer nacional (opcional).
   * 
   * @property {string} [coloniaCHN]
   * Colonia específica para chofer nacional
   */
  coloniaCHN?: string;
  
  /**
   * País de origen para chofer nacional (opcional).
   * 
   * @property {string} [paisOrigenCHN]
   * País de origen para chofer nacional
   */
  paisOrigenCHN?: string;
  
  /**
   * Correo electrónico (opcional).
   * 
   * @property {string} [correo]
   * Dirección de correo electrónico
   */
  correo?: string;
  
  /**
   * Teléfono (opcional).
   * 
   * @property {string} [telefono]
   * Número telefónico de contacto
   */
  telefono?: string;
  
  /**
   * Nacionalidad para chofer extranjero (opcional).
   * 
   * @property {string} [nacionalidadCHE]
   * Nacionalidad específica para chofer extranjero
   */
  nacionalidadCHE?: string;
  
  /**
   * NSS para chofer extranjero (opcional).
   * 
   * @property {string} [nss]
   * Número de Seguro Social para chofer extranjero
   */
  nss?: string;
  
  /**
   * Identificación fiscal para chofer extranjero (opcional).
   * 
   * @property {string} [ideFiscal]
   * Número de identificación fiscal para chofer extranjero
   */
  ideFiscal?: string;
  
  /**
   * País para chofer extranjero (opcional).
   * 
   * @property {string} [paisCHE]
   * País específico para chofer extranjero
   */
  paisCHE?: string;
  
  /**
   * Entidad federativa para chofer extranjero (opcional).
   * 
   * @property {string} [entidadFederativaCHE]
   * Entidad federativa para chofer extranjero
   */
  entidadFederativaCHE?: string;
  
  /**
   * País de origen para chofer extranjero (opcional).
   * 
   * @property {string} [paisOrigenCHE]
   * País de origen para chofer extranjero
   */
  paisOrigenCHE?: string;
}

/**
 * Interfaz que representa la estructura de datos para un Director General.
 * 
 * Esta interfaz define los campos básicos necesarios para almacenar
 * la información personal de un Director General en el sistema.
 * Incluye nombres y apellidos en diferentes formatos según los
 * requerimientos del trámite.
 * 
 * @interface DirectorGeneralData
 * 
 * @example
 * ```typescript
 * const directorGeneral: DirectorGeneralData = {
 *   nombre: 'Juan',
 *   primerApellido: 'García',
 *   segundoApellido: 'López',
 *   apellidoPaterno: 'García',
 *   apellidoMaternoCHN: 'López'
 * };
 * ```
 * 
 * @since 1.0.0
 */
export interface DirectorGeneralData {
  /**
   * Nombre del Director General.
   * 
   * @property {string} nombre
   * Nombre de pila del Director General
   */
  nombre: string;
  
  /**
   * Primer apellido del Director General.
   * 
   * @property {string} primerApellido
   * Primer apellido del Director General
   */
  primerApellido: string;
  
  /**
   * Segundo apellido del Director General.
   * 
   * @property {string} segundoApellido
   * Segundo apellido del Director General
   */
  segundoApellido: string;
  
  /**
   * Apellido paterno del Director General.
   * 
   * @property {string} apellidoPaterno
   * Apellido paterno del Director General
   */
  apellidoPaterno: string;
  
  /**
   * Apellido materno del Director General en formato CHN.
   * 
   * @property {string} apellidoMaternoCHN
   * Apellido materno del Director General según formato CHN
   */
  apellidoMaternoCHN: string;
}


/**
 * Interfaz que representa los datos básicos de un vehículo.
 * 
 * Esta interfaz define la estructura de datos para almacenar información
 * esencial de un vehículo utilizado en el transporte de mercancías.
 * Incluye todos los campos necesarios para la identificación y
 * características del vehículo.
 * 
 * @interface DatosVehiculo
 * 
 * @example
 * ```typescript
 * const datosVehiculo: DatosVehiculo = {
 *   numero: 'VEH001',
 *   tipoDeVehiculo: 'Tractor',
 *   idDeVehiculo: 'ID123',
 *   numeroPlaca: 'ABC-123',
 *   paisEmisor: 'México',
 *   estado: 'Nuevo León',
 *   marca: 'Volvo',
 *   modelo: 'VNL',
 *   ano: '2023',
 *   transponder: 'TRP001',
 *   colorVehiculo: 'Blanco',
 *   numeroEconomico: 'ECO001'
 * };
 * ```
 * 
 * @since 1.0.0
 */

/**
 * Representa los datos del domicilio fiscal.
 */
export interface DomicilioFiscal {
  ciudad: string | null;
  pais: string | null;
  codigo_postal: string | null;
  estado: string | null;
  municipio?: string | null;
  localidad?: string | null;
  colonia?: string ;
  calle: string | null;
  numero_exterior: string | null;
  numero_interior?: string | null;
  correo_electronico: string | null;
  telefono: string | null;
  pais_de_residencia: string | null;
}

/**
 * Datos personales del chofer nacional.
 */
export interface ChoferNacionalDatos {
  rfc: string | null;
  curp: string | null;
  nombre: string | null;
  primer_apellido: string | null;
  segundo_apellido?: string | null;
  numero_de_gafete: string | null;
  vigencia_del_gafete: string | null;
}

/**
 * Datos personales del chofer extranjero.
 */
export interface ChoferExtranjeroDatos {
  nombre: string | null;
  primer_apellido: string | null;
  segundo_apellido?: string | null;
  numero_de_gafete?: string | null;
  vigencia_del_gafete?: string | null;
  num_del_seg_social?: string | null;
  num_de_iden_fisc?:string | null;
  nacionalidad?: string | null;
}

/**
 * Chofer nacional con domicilio.
 */
export interface ChoferNacionalPayload {
  operacion: 'AGREGAR' | 'MODIFICAR' | 'ELIMINAR';
  chofer_datos: ChoferNacionalDatos;
  domicilio_fiscal: DomicilioFiscal;
}

/**
 * Chofer extranjero con domicilio.
 */
export interface ChoferExtranjeroPayload {
  operacion: 'AGREGAR' | 'MODIFICAR' | 'ELIMINAR';
  chofer_datos: ChoferExtranjeroDatos;
  domicilio_fiscal: DomicilioFiscal;
}

/**
 * Datos del director general.
 */
export interface DirectorGeneralPayload {
  nombre?: string | null;
  primer_apellido?:string | null;
  segundo_apellido?: string | null;
}

/**
 * Vehículo principal (parque vehicular).
 */
export interface VehiculoPayload {
  operacion: string;
  numero_identificacion_vehicular: string;
  tipo_vehiculo: string;
  id_vehiculo: string;
  numero_placas: string;
  pais_emisor: string;
  estado_provincia: string;
  color_vehiculo: number;
  numero_economico: string;
  numero_2da_placa: string;
  estado_emisor_2da_placa: string;
  pais_emisor_2da_placa: string;
  descripcion_vehiculo: string;
  marca: string;
  modelo: string;
  anio: string;
  transponder: string;
}

/**
 * Unidad de arrastre.
 */
export interface UnidadArrastrePayload {
  operacion: string;
  numero_identificacion_vehicular: string;
  tipo_vehiculo: string;
  id_vehiculo: string|number;
  numero_placas: string;
  pais_emisor: string;
  estado_provincia: string;
  color_vehiculo: number;
  numero_economico: string;
  numero_2da_placa: string;
  estado_emisor_2da_placa: string;
  pais_emisor_2da_placa: string;
  descripcion_vehiculo: string;
  tipo_vehiculo_arrastre: string;
  id_vehiculo_arrastre: string;
  color_vehiculo_arrastre: number;
  descripcion_unidad_arrastre: string;
}

/**
 * Estructura completa del payload para trámite 40103.
 */
export interface Payload40103 {
  choferes_nacionales: ChoferNacionalPayload[];
  choferes_extranjeros: ChoferExtranjeroPayload[];
  director_general: DirectorGeneralPayload | null;
  vehiculos: {
    parque_vehicular: VehiculoPayload[];
    unidades_arrastre: UnidadArrastrePayload[];
  };
}
export interface DatosVehiculo {
  /**
   * Número del vehículo.
   * 
   * @property {string} numero
   * Número de identificación del vehículo
   */
  numero: string;
   /**
   * Identificador del vehículo.
   * 
   * @property {string} idDeUnidad
   * Identificador único de la unidad de arrastre
   */
  idDeUnidad?: string;
  
  /**
   * Tipo de vehículo.
   * 
   * @property {string} tipoDeVehiculo
   * Clasificación del tipo de vehículo
   */
  tipoDeVehiculo: string;
  
  /**
   * Identificador del vehículo.
   * 
   * @property {string} idDeVehiculo
   * Identificador único del vehículo
   */
  idDeVehiculo: string;
  
  /**
   * Número de placa.
   * 
   * @property {string} numeroPlaca
   * Número de placa oficial del vehículo
   */
  numeroPlaca: string;
  
  /**
   * País emisor.
   * 
   * @property {string} paisEmisor
   * País que emitió la documentación del vehículo
   */
  paisEmisor: string;
  
  /**
   * Estado.
   * 
   * @property {string} estado
   * Estado o entidad federativa
   */
  estado: string;
  
  /**
   * Marca.
   * 
   * @property {string} marca
   * Marca del vehículo
   */
  marca: string;
  
  /**
   * Modelo.
   * 
   * @property {string} modelo
   * Modelo del vehículo
   */
  modelo: string;
  
  /**
   * Año.
   * 
   * @property {string} ano
   * Año de fabricación del vehículo
   */
  ano: string;
  
  /**
   * Transponder.
   * 
   * @property {string} transponder
   * Número del transponder del vehículo
   */
  transponder: string;
  
  /**
   * Color del vehículo.
   * 
   * @property {string} colorVehiculo
   * Color principal del vehículo
   */
  colorVehiculo: string;
  
  /**
   * Número económico.
   * 
   * @property {string} numeroEconomico
   * Número económico asignado al vehículo
   */
  numeroEconomico: string;
  
  /**
   * Número de segunda placa.
   * 
   * @property {string} numero2daPlaca
   * Número de segunda placa si aplica
   */
  numero2daPlaca: string;
  
  /**
   * Estado de la segunda placa.
   * 
   * @property {string} estado2daPlaca
   * Estado emisor de la segunda placa
   */
  estado2daPlaca: string;
  
  /**
   * País emisor de la segunda placa.
   * 
   * @property {string} paisEmisor2daPlaca
   * País que emitió la segunda placa
   */
  paisEmisor2daPlaca: string;
  
  /**
   * Descripción.
   * 
   * @property {string} descripcion
   * Descripción adicional del vehículo
   */
  descripcion: string;
}
/**
 * Interfaz que representa los datos de una unidad de arrastre.
 * 
 * Esta interfaz define la estructura de datos para unidades de arrastre
 * utilizadas en el transporte de mercancías. Incluye información específica
 * para remolques, semirremolques y otras unidades que son arrastradas
 * por vehículos tractores.
 * 
 * @interface DatosUnidad
 * 
 * @example
 * ```typescript
 * const unidadArrastre: DatosUnidad = {
 *   vinVehiculo: '1HGBH41JXMN109186',
 *   tipoDeUnidadArrastre: 'Semirremolque',
 *   idDeVehiculo: 'ID456',
 *   numeroEconomico: 'ECO002',
 *   numeroPlaca: 'REM-456',
 *   paisEmisor: 'México',
 *   estado: 'Nuevo León',
 *   colorVehiculo: 'Blanco'
 * };
 * ```
 * 
 * @since 1.0.0
 */
export interface DatosUnidad{
  /**
   * VIN del vehículo.
   * 
   * @property {string} vinVehiculo
   * Número de Identificación Vehicular de la unidad de arrastre
   */
  vinVehiculo: string;
  colorUnidad:number;
  
  /**
   * Tipo de unidad de arrastre.
   * 
   * @property {string} tipoDeUnidadArrastre
   * Clasificación del tipo de unidad (remolque, semirremolque, etc.)
   */
  tipoDeUnidadArrastre: string;
  
  /**
   * Identificador del vehículo.
   * 
   * @property {string} idDeVehiculo
   * Identificador único de la unidad de arrastre
   */
  idDeVehiculo: string;
  /**
   * Identificador del vehículo.
   * 
   * @property {string} idDeUnidad
   * Identificador único de la unidad de arrastre
   */
  idDeUnidad?: string;
   /**
   * Identificador del vehículo.
   * 
   * @property {string} idDeVehiculoUnidad
   * Identificador único de la unidad de arrastre
   */
  idDeVehiculoUnidad?: string;
  
  /**
   * Número económico.
   * 
   * @property {string} numeroEconomico
   * Número económico asignado a la unidad de arrastre
   */
  numeroEconomico: string;
  
  /**
   * Número de placa.
   * 
   * @property {string} numeroPlaca
   * Número de placa oficial de la unidad de arrastre
   */
  numeroPlaca: string;
  
  /**
   * País emisor.
   * 
   * @property {string} paisEmisor
   * País que emitió la documentación de la unidad
   */
  paisEmisor: string;
  
  /**
   * Estado.
   * 
   * @property {string} estado
   * Estado o entidad federativa emisora
   */
  estado: string;
  
  /**
   * Color del vehículo.
   * 
   * @property {string} colorVehiculo
   * Color principal de la unidad de arrastre
   */
  colorVehiculo: string;  


  
  /**
   * Número de segunda placa.
   * 
   * @property {string} numero2daPlaca
   * Número de segunda placa si aplica
   */
  numero2daPlaca: string;
  
  /**
   * Estado de la segunda placa.
   * 
   * @property {string} estado2daPlaca
   * Estado emisor de la segunda placa
   */
  estado2daPlaca: string;
  
  /**
   * País emisor de la segunda placa.
   * 
   * @property {string} paisEmisor2daPlaca
   * País que emitió la segunda placa
   */
  paisEmisor2daPlaca: string;
  
  /**
   * Descripción.
   * 
   * @property {string} descripcion
   * Descripción adicional de la unidad de arrastre
   */
  descripcion: string;
}

/**
 * Interfaz que representa una lista de catálogos.
 * 
 * Esta interfaz define la estructura para almacenar una colección
 * de catálogos que se utilizan en el sistema para selecciones
 * y clasificaciones diversas.
 * 
 * @interface CatalogoLista
 * 
 * @example
 * ```typescript
 * const listaCatalogos: CatalogoLista = {
 *   datos: [
 *     { id: 1, nombre: 'Catálogo 1', descripcion: 'Descripción 1' },
 *     { id: 2, nombre: 'Catálogo 2', descripcion: 'Descripción 2' }
 *   ]
 * };
 * ```
 * 
 * @since 1.0.0
 */
export interface CatalogoLista {
  /**
   * Lista de catálogos.
   * 
   * @property {Catalogo[]} datos
   * Array que contiene los elementos del catálogo
   */
  datos: Catalogo[];
}

/**
 * Interfaz que representa los datos de la tabla de vehículos.
 * 
 * Esta interfaz define la estructura de datos para una tabla
 * que contiene información de múltiples vehículos organizados
 * en formato tabular.
 * 
 * @interface VehiculoTablaDatos
 * 
 * @example
 * ```typescript
 * const tablaVehiculosDatos: VehiculoTablaDatos = {
 *   datos: [vehiculoTabla1, vehiculoTabla2, vehiculoTabla3]
 * };
 * ```
 * 
 * @since 1.0.0
 */
export interface VehiculoTablaDatos {
  /**
   * Lista de vehículos en la tabla.
   * 
   * @property {DatosVehiculo[]} datos
   * Array que contiene los datos de vehículos en formato de tabla
   */
  datos: DatosVehiculo[];
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
    clave: (item: DatosUnidad) => string;

    /**
     * @property {number} orden
     * Orden de aparición de la columna en la tabla.
     * Número que determina la secuencia de las columnas de izquierda a derecha.
     */
    orden: number;
  }[];

  /**
   * @property {DatosUnidad[]} datos
   * Lista de datos de las unidades para mostrar en la tabla.
   * Array de objetos que contienen la información de cada unidad de arrastre.
   */
  datos: DatosUnidad[];
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
    clave: (item: DatosVehiculo) => string;
    orden: number;
  }[];

  /**
   * Lista de datos de vehículos que se mostrarán en la tabla.
   */
  datos: DatosVehiculo[];
}
