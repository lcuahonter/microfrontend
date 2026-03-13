/**
 * @fileoverview Modelos e interfaces TypeScript para el trámite 80207 de submanufactura
 * @description
 * Este archivo contiene todas las definiciones de tipos, interfaces y modelos de datos
 * utilizados en el trámite 80207 para registro de empresas de submanufactura bajo
 * el régimen IMMEX. Define la estructura de datos para información de registro,
 * datos empresariales, direcciones de plantas y estado del trámite.
 * 
 * @module SubfabricanteModels
 * @tramite 80207
 * @version 1.0.0
 * @author Sistema VUCEM
 * @typescript_models Definiciones de tipos para submanufactura
 * @business_domain Operaciones IMMEX y registro empresarial
 */

/**
 * @interface InfoRegistro
 * @description
 * Interfaz que define la estructura para la información básica de registro del trámite 80207.
 * Contiene los metadatos esenciales que identifican y categorizan el proceso de solicitud
 * de submanufactura en el sistema VUCEM, incluyendo modalidad operativa, identificador
 * único y periodo temporal del trámite.
 * 
 * @business_purpose
 * Esta información es fundamental para:
 * - **Identificación única**: Distinguir el trámite de otros procesos
 * - **Categorización**: Clasificar según modalidad de operación IMMEX
 * - **Trazabilidad**: Seguimiento temporal del proceso de solicitud
 * - **Auditoría**: Registro oficial para verificación gubernamental
 * 
 * @registry_context
 * Los campos de registro permiten:
 * - Clasificación según tipo de operación manufacturera
 * - Asignación de folios consecutivos para control
 * - Agrupación temporal por periodos fiscales
 * - Referencia cruzada con sistemas gubernamentales
 * 
 * @validation_requirements
 * Todos los campos son obligatorios para:
 * - Cumplir con normativas de la Secretaría de Economía
 * - Garantizar trazabilidad completa del proceso
 * - Facilitar búsquedas y consultas posteriores
 * - Mantener consistencia en reportes oficiales
 * 
 * @export
 * @interface
 * @metadata_model
 */
export interface InfoRegistro {
  /**
   * @property {string} modalidad
   * @description
   * La modalidad del registro que especifica el tipo de operación IMMEX bajo la cual
   * se realizará la submanufactura. Define la categoría operativa según regulaciones
   * de la Secretaría de Economía y determina los procedimientos aplicables.
   * 
   * @business_values
   * Modalidades típicas incluyen:
   * - Empresa de comercio exterior con programa IMMEX
   * - Submanufactura de exportación
   * - Operaciones de maquila
   * - Servicios de exportación
   * 
   * @regulatory_importance
   * - Determina normativas aplicables
   * - Define procedimientos de validación
   * - Establece requisitos documentales
   * - Influye en tiempos de procesamiento
   * 
   * @required
   * @regulatory_field
   */
  modalidad: string;

  /**
   * @property {string} folio
   * @description
   * El folio único asociado al registro que identifica de manera unívoca el trámite
   * en el sistema VUCEM. Generado automáticamente por el sistema siguiendo secuencias
   * oficiales para garantizar unicidad y trazabilidad completa.
   * 
   * @uniqueness_guarantee
   * Características del folio:
   * - Único en todo el sistema VUCEM
   * - Generado secuencialmente
   * - Inmutable una vez asignado
   * - Utilizado en toda comunicación oficial
   * 
   * @system_integration
   * El folio se utiliza para:
   * - Referencias en documentos oficiales
   * - Búsquedas en base de datos
   * - Comunicación con otros sistemas gubernamentales
   * - Auditoría y seguimiento del proceso
   * 
   * @required
   * @unique_identifier
   */
  folio: string;

  /**
   * @property {number} ano
   * @description
   * El año del registro que indica el periodo fiscal en el cual se realiza el trámite.
   * Utilizado para categorización temporal, reportes anuales y procesos de auditoría
   * según los ciclos administrativos gubernamentales.
   * 
   * @temporal_classification
   * El año permite:
   * - Agrupación por periodos fiscales
   * - Generación de estadísticas anuales
   * - Aplicación de normativas vigentes por periodo
   * - Organización de archivos y expedientes
   * 
   * @business_cycles
   * Importante para:
   * - Reportes anuales a autoridades
   * - Cálculos de indicadores por periodo
   * - Aplicación de tarifas y procedimientos del año
   * - Cumplimiento de obligaciones fiscales
   * 
   * @required
   * @fiscal_year
   */
  ano: number;
}

export interface DomicilioDto {
  calle?: string;
  numExterior?: string | number;
  numInterior?: string | number;
  codigoPostal?: string | number;
  colonia?: string;
  municipio?: string;
  delegacionMunicipio?: string;
  entidadFederativa?: { nombre?: string };
  pais?: { nombre?: string };
}

/**
 * @interface DatosSubcontratista
 * @description
 * Interfaz que define la estructura para los datos esenciales de la empresa subcontratista
 * que solicita autorización para operaciones de submanufactura. Contiene información
 * fiscal y de ubicación mínima requerida para iniciar el proceso de validación y
 * verificación empresarial en el sistema VUCEM.
 * 
 * @contractor_validation
 * Estos datos permiten:
 * - **Identificación fiscal**: Verificación de existencia y validez del RFC
 * - **Ubicación geográfica**: Determinación de jurisdicción y normativas aplicables
 * - **Validación empresarial**: Consulta de estatus en padrón de contribuyentes
 * - **Elegibilidad IMMEX**: Verificación de capacidad para operaciones autorizadas
 * 
 * @sat_integration
 * Permite integración con sistemas SAT para:
 * - Validación de RFC activo y válido
 * - Consulta de información fiscal adicional
 * - Verificación de cumplimiento tributario
 * - Validación de capacidad legal para el trámite
 * 
 * @business_requirements
 * La empresa debe cumplir:
 * - RFC válido y activo en padrón SAT
 * - Ubicación en territorio nacional mexicano
 * - Capacidad legal para operaciones de comercio exterior
 * - Cumplimiento de obligaciones fiscales
 * 
 * @validation_triggers
 * Estos datos desencadenan:
 * - Consultas automáticas a bases de datos SAT
 * - Validación de información empresarial
 * - Verificación de elegibilidad para IMMEX
 * - Carga de información complementaria del sistema
 * 
 * @export
 * @interface
 * @contractor_data
 */
export interface DatosSubcontratista {
  /**
   * @property {string} rfc
   * @description
   * El Registro Federal de Contribuyentes (RFC) del subcontratista, identificador único
   * fiscal asignado por el SAT que garantiza la identificación inequívoca de la empresa
   * ante las autoridades tributarias mexicanas y permite validación de su estatus legal.
   * 
   * @fiscal_identifier
   * Características del RFC:
   * - 12 caracteres para personas morales
   * - 13 caracteres para personas físicas con actividad empresarial
   * - Único e irrepetible en el sistema tributario mexicano
   * - Requerido para todas las operaciones de comercio exterior
   * 
   * @validation_requirements
   * El RFC debe:
   * - Existir en el padrón de contribuyentes SAT
   * - Estar en estatus activo
   * - Corresponder a persona moral o física con actividad empresarial
   * - Tener capacidad legal para operaciones IMMEX
   * 
   * @system_integration
   * Utilizado para:
   * - Consultas automáticas al SAT
   * - Validación de existencia y vigencia
   * - Carga de información empresarial complementaria
   * - Verificación de cumplimiento fiscal
   * 
   * @required
   * @unique_fiscal_id
   */
  rfc: string;

  /**
   * @property {string} estado
   * @description
   * El estado o entidad federativa donde se encuentra ubicado el subcontratista.
   * Determina la jurisdicción territorial, normativas aplicables y procedimientos
   * específicos según la división política administrativa de México.
   * 
   * @territorial_jurisdiction
   * El estado determina:
   * - Normativas locales aplicables
   * - Procedimientos administrativos específicos
   * - Autoridades competentes por jurisdicción
   * - Tiempos y requisitos particulares por entidad
   * 
   * @administrative_classification
   * Utilizado para:
   * - Asignación de autoridades competentes
   * - Aplicación de normativas estatales
   * - Determinación de procedimientos locales
   * - Clasificación geográfica para reportes
   * 
   * @geographic_context
   * Importante para:
   * - Identificación de zona geográfica de operaciones
   * - Aplicación de incentivos regionales
   * - Determinación de centros de distribución
   * - Planificación logística de operaciones
   * 
   * @required
   * @geographic_identifier
   */
  estado: string;
}

/**
 * @interface SubfabricanteDireccionModelo
 * @description
 * Modelo completo que representa la dirección e información empresarial detallada de un
 * subfabricante disponible en el sistema. Incluye dirección física completa según
 * estándares mexicanos, datos de identificación fiscal y información legal empresarial
 * necesaria para operaciones de submanufactura bajo régimen IMMEX.
 * 
 * @comprehensive_address_model
 * Este modelo integra:
 * - **Dirección física**: Ubicación completa según normativas mexicanas
 * - **Identificación fiscal**: RFC y datos tributarios
 * - **Información legal**: Razón social y domicilio fiscal
 * - **Identificadores únicos**: ID de subfabricante en sistema
 * 
 * @mexican_address_standard
 * Sigue estándar mexicano oficial con:
 * - Estructura de dirección según INEGI
 * - Códigos postales de SEPOMEX
 * - Divisiones políticas administrativas oficiales
 * - Nomenclatura geográfica estandarizada
 * 
 * @business_applications
 * Utilizado para:
 * - Mostrar opciones de subfabricantes en búsquedas
 * - Validar direcciones para operaciones IMMEX
 * - Generar documentación oficial del trámite
 * - Integrar con sistemas de validación empresarial
 * 
 * @data_completeness
 * Garantiza información completa para:
 * - Identificación inequívoca de la empresa
 * - Ubicación física verificable
 * - Datos fiscales validables con SAT
 * - Información legal suficiente para autorizaciones
 * 
 * @export
 * @interface
 * @address_business_model
 */
export interface SubfabricanteDireccionModelo {
  /**
   * @property {string} calle
   * @description
   * Nombre de la calle donde se encuentra ubicado el subfabricante. Campo fundamental
   * para identificación geográfica y constituye la base de la dirección física
   * según nomenclatura oficial mexicana.
   * 
   * @geographic_reference Base principal de la dirección mexicana
   * @required Campo obligatorio para dirección completa
   */
  calle: string;

  /**
   * @property {number} numExterior
   * @description
   * Número exterior del domicilio que identifica específicamente el inmueble
   * en la vía pública. Esencial para ubicación precisa del subfabricante.
   * 
   * @address_precision Identificación específica del inmueble
   * @numeric_identifier Número asignado por autoridades municipales
   */
  numExterior: number;

  /**
   * @property {number} numInterior
   * @description
   * Número interior del domicilio para identificación de ubicación específica
   * dentro del inmueble cuando aplique (edificios, complejos, etc.).
   * 
   * @internal_location Ubicación dentro del inmueble
   * @optional_field Puede ser 0 si no aplica
   */
  numInterior: number;

  /**
   * @property {number} codigoPostal
   * @description
   * Código postal oficial mexicano de 5 dígitos asignado por SEPOMEX.
   * Identifica la zona postal y facilita servicios de correspondencia.
   * 
   * @sepomex_standard Código oficial de SEPOMEX
   * @postal_zone Identificador de zona postal mexicana
   */
  codigoPostal: number;

  /**
   * @property {string} colonia
   * @description
   * Nombre de la colonia, fraccionamiento o asentamiento donde se ubica
   * el subfabricante según nomenclatura oficial del INEGI.
   * 
   * @neighborhood_designation Subdivisión urbana oficial
   * @inegi_classification Clasificación geográfica oficial
   */
  colonia: string;

  /**
   * @property {string} delegacionMunicipio
   * @description
   * Nombre de la delegación o municipio según división política administrativa
   * mexicana. Determina jurisdicción y autoridades competentes.
   * 
   * @political_division División administrativa oficial
   * @jurisdiction_identifier Determina autoridades competentes
   */
  delegacionMunicipio: string;
  /**
   * @property {string} entidadFederativa
   * @description
   * Nombre de la entidad federativa (estado) de la República Mexicana donde
   * se encuentra el subfabricante. Determina normativas estatales aplicables.
   * 
   * @federal_entity Estado de la República Mexicana
   * @state_jurisdiction Normativas estatales aplicables
   */
  entidadFederativa: string;
  /**
   * @property {string} pais
   * @description
   * Nombre del país donde se ubica el subfabricante. Para operaciones IMMEX
   * normalmente será "México" pero permite flexibilidad para casos especiales.
   * 
   * @country_designation País de ubicación del subfabricante
   * @international_context Contexto para operaciones internacionales
   */
  pais: string;
  /**
   * @property {string} idSubfabricante
   * @description
   * Identificador único del subfabricante en el sistema VUCEM. Permite
   * referencia directa y relación con otros registros del sistema.
   * 
   * @unique_system_id Identificador único en VUCEM
   * @system_reference Referencia para relaciones de datos
   */
  idSubfabricante: string;
  /**
   * @property {string} rfc
   * @description
   * Registro Federal de Contribuyentes del subfabricante. Identificador
   * fiscal oficial que permite validación ante autoridades tributarias.
   * 
   * @fiscal_identifier RFC oficial del subfabricante
   * @tax_validation Validación ante autoridades fiscales
   */
  rfc: string;
  /**
   * @property {string} domicilioFiscalSolicitante
   * @description
   * Dirección completa del domicilio fiscal registrado ante el SAT por el
   * subfabricante. Debe coincidir con información oficial tributaria.
   * 
   * @fiscal_address Domicilio fiscal oficial ante SAT
   * @tax_compliance Cumplimiento de obligaciones fiscales
   */
  domicilioFiscalSolicitante: string;
  /**
   * @property {string} razonSocial
   * @description
   * Denominación o razón social legal completa del subfabricante según
   * registro oficial ante autoridades. Nombre legal para documentos oficiales.
   * 
   * @legal_denomination Denominación legal oficial
   * @official_name Nombre para documentos oficiales
   */
  razonSocial: string;
}
/**
 * @interface PlantasDireccionModelo
 * @description
 * Modelo que representa la dirección e información completa de plantas manufactureras
 * asociadas a operaciones de submanufactura. Estructura similar a SubfabricanteDireccionModelo
 * pero específicamente diseñada para gestionar instalaciones físicas de producción
 * bajo régimen IMMEX, con campo de localidad en lugar de colonia.
 * 
 * @manufacturing_facilities
 * Representa plantas que:
 * - Realizan operaciones de manufactura, maquila y servicios de exportación
 * - Están autorizadas para procesos de transformación de insumos importados
 * - Operan bajo régimen IMMEX con autorizaciones específicas
 * - Cumplen con normativas de comercio exterior
 * 
 * @address_specialization
 * Adaptado para plantas industriales con:
 * - Campo "localidad" apropiado para zonas industriales
 * - Información de ubicación precisa para operaciones logísticas
 * - Datos fiscales para identificación empresarial
 * - Información legal para documentación oficial
 * 
 * @immex_operations
 * Las plantas gestionadas pueden realizar:
 * - Procesos de manufactura de productos de exportación
 * - Operaciones de maquila con insumos importados
 * - Servicios de exportación especializados
 * - Transformación de materiales bajo control aduanal
 * 
 * @business_integration
 * Utilizado para:
 * - Registro de plantas en trámites de submanufactura
 * - Validación de capacidad operativa
 * - Generación de autorizaciones oficiales
 * - Control de ubicaciones autorizadas para IMMEX
 * 
 * @export
 * @interface
 * @manufacturing_plant_model
 */
export interface PlantasDireccionModelo {
  /**
   * @property {string} calle
   * @description
   * Nombre de la calle donde se encuentra ubicada la planta manufacturera.
   * Fundamental para identificación geográfica de la instalación productiva.
   * 
   * @plant_location Ubicación física de la planta
   * @logistics_reference Referencia para operaciones logísticas
   */
  calle: string;

  /**
   * @property {number} numExterior
   * @description
   * Número exterior del domicilio de la planta manufacturera para
   * identificación precisa de la instalación industrial.
   * 
   * @facility_identification Identificación de instalación industrial
   * @precise_location Ubicación exacta de la planta
   */
  numExterior: number;

  /**
   * @property {number} numInterior
   * @description
   * Número interior del domicilio de la planta cuando se encuentre
   * en complejos industriales o parques manufactureros.
   * 
   * @industrial_complex Ubicación en complejo industrial
   * @internal_reference Referencia interna en parque industrial
   */
  numInterior: number;

  /**
   * @property {number} codigoPostal
   * @description
   * Código postal oficial de la zona donde se ubica la planta manufacturera.
   * Importante para servicios logísticos y clasificación geográfica.
   * 
   * @postal_zone Zona postal de la planta
   * @logistics_classification Clasificación para servicios logísticos
   */
  codigoPostal: number;

  /**
   * @property {string} localidad
   * @description
   * Nombre de la localidad donde se encuentra la planta. Campo específico
   * para plantas industriales, diferente a "colonia" usado en direcciones comerciales.
   * 
   * @industrial_locality Localidad específica para plantas
   * @geographic_classification Clasificación geográfica industrial
   * @note Diferente a "colonia" - campo especializado para plantas
   */
  localidad: string;

  /**
   * @property {string} delegacionMunicipio
   * @description
   * Delegación o municipio donde se ubica la planta manufacturera.
   * Determina jurisdicción y autoridades competentes para la planta.
   * 
   * @jurisdiction Jurisdicción de la planta
   * @municipal_authority Autoridad municipal competente
   */
  delegacionMunicipio: string;
  /**
   * @property {string} entidadFederativa
   * @description
   * Entidad federativa donde se encuentra la planta manufacturera.
   * Determina normativas estatales aplicables a operaciones industriales.
   * 
   * @state_jurisdiction Estado donde opera la planta
   * @industrial_regulations Normativas industriales estatales
   */
  entidadFederativa: string;
  /**
   * @property {string} pais
   * @description
   * País donde se ubica la planta manufacturera. Para operaciones IMMEX
   * debe estar en territorio nacional mexicano.
   * 
   * @national_territory Territorio nacional para IMMEX
   * @country_operations País de operaciones de la planta
   */
  pais: string;
  /**
   * @property {string} idSubfabricante
   * @description
   * Identificador del subfabricante propietario de la planta. Relaciona
   * la instalación con la empresa responsable de las operaciones.
   * 
   * @owner_reference Referencia al propietario de la planta
   * @business_relationship Relación empresa-planta
   */
  idSubfabricante: string;
  /**
   * @property {string} rfc
   * @description
   * RFC de la empresa propietaria de la planta manufacturera.
   * Necesario para identificación fiscal de operaciones industriales.
   * 
   * @plant_owner_rfc RFC del propietario de la planta
   * @fiscal_operations Identificación fiscal para operaciones
   */
  rfc: string;
  /**
   * @property {string} domicilioFiscalSolicitante
   * @description
   * Domicilio fiscal del propietario de la planta según registro SAT.
   * Debe corresponder con información tributaria oficial.
   * 
   * @owner_fiscal_address Domicilio fiscal del propietario
   * @tax_correspondence Correspondencia con datos SAT
   */
  domicilioFiscalSolicitante: string;
  /**
   * @property {string} razonSocial
   * @description
   * Razón social de la empresa propietaria de la planta manufacturera.
   * Denominación legal para documentos oficiales de la instalación.
   * 
   * @plant_owner_name Razón social del propietario
   * @legal_documentation Documentación legal de la planta
   */
  razonSocial: string;
}


/**
 * @interface Tramite80207State
 * @description
 * Interfaz principal que define la estructura completa del estado para el trámite 80207
 * de submanufactura. Representa toda la información necesaria para gestionar el proceso
 * de solicitud, incluyendo datos del solicitante, plantas manufactureras, validaciones
 * y metadatos del trámite en el sistema VUCEM.
 * 
 * @state_management
 * Como estructura de estado centralizada incluye:
 * - **Identificación**: ID único del trámite y metadatos
 * - **Datos empresariales**: Información del subcontratista solicitante
 * - **Plantas industriales**: Instalaciones manufactureras del proceso
 * - **Validaciones**: Estado de validez de diferentes secciones
 * - **Flujo de trabajo**: Control de progreso y completitud
 * 
 * @business_workflow
 * Soporta el flujo completo de:
 * 1. Registro inicial de información básica
 * 2. Captura de datos del subcontratista
 * 3. Búsqueda y selección de plantas
 * 4. Validación de información
 * 5. Envío y procesamiento del trámite
 * 
 * @data_consistency
 * Garantiza consistencia mediante:
 * - Tipado fuerte de todas las propiedades
 * - Relaciones claras entre entidades
 * - Validaciones granulares por sección
 * - Estado de completitud verificable
 * 
 * @reactive_state
 * Diseñado para:
 * - Actualizaciones reactivas del estado
 * - Notificaciones automáticas de cambios
 * - Sincronización entre componentes
 * - Persistencia de datos durante navegación
 * 
 * @export
 * @interface
 * @state_model
 */
export interface Tramite80207State {
  
    /**
     * @property {number | null} idSolicitud
     * @description
     * Identificador único de la solicitud del trámite 80207 en el sistema VUCEM.
     * Puede ser nulo si aún no se ha generado o asignado un ID oficial al trámite.
     * 
     * @unique_identifier ID único del trámite en sistema
     * @nullable Puede ser null antes de envío oficial
     * @system_reference Referencia para tracking y consultas
     */
  idSolicitud: number | null;
  /**
   * @property {InfoRegistro} infoRegistro
   * @description
   * Información de registro asociada al trámite que incluye modalidad operativa,
   * folio de identificación y año del proceso. Metadatos esenciales del trámite.
   * 
   * @metadata_section Metadatos básicos del trámite
   * @registry_data Información de registro oficial
   */
  infoRegistro: InfoRegistro;

  /**
   * @property {DatosSubcontratista} datosSubcontratista
   * @description
   * Datos del subcontratista relacionados con el trámite, incluyendo RFC y
   * estado de ubicación. Información básica para identificación empresarial.
   * 
   * @contractor_info Datos básicos del subcontratista
   * @business_identification Identificación empresarial fiscal
   */
  datosSubcontratista: DatosSubcontratista;

  /**
   * @property {SubfabricanteDireccionModelo[]} plantasBuscadas
   * @description
   * Lista de plantas encontradas en operaciones de búsqueda realizadas por el usuario.
   * Contiene opciones disponibles para selección y adición al trámite.
   * 
   * @search_results Resultados de búsquedas de plantas
   * @selection_options Opciones disponibles para selección
   */
  plantasBuscadas: SubfabricanteDireccionModelo[];

  
  /**
   * @property {PlantasDireccionModelo[]} plantas
   * @description
   * Lista de plantas manufactureras que han sido oficialmente agregadas al trámite.
   * Representa las instalaciones definitivas que formarán parte del proceso IMMEX.
   * 
   * @official_plants Plantas oficialmente incluidas en el trámite
   * @immex_facilities Instalaciones autorizadas para operaciones
   */
  plantas: PlantasDireccionModelo[];

  /**
   * @property {PlantasDireccionModelo[]} plantasSubfabricantesAgregar
   * @description
   * Lista de plantas de subfabricantes que están en proceso de ser agregadas.
   * Funciona como área de staging antes de confirmación definitiva.
   * 
   * @staging_area Plantas en proceso de adición
   * @pending_addition Plantas seleccionadas pero no confirmadas
   */
  plantasSubfabricantesAgregar:PlantasDireccionModelo[];

  /**
   * @property {Object} formaValida
   * @description
   * Objeto que mantiene el estado de validación de diferentes secciones del
   * formulario del trámite. Controla el flujo y habilitación de funcionalidades.
   * 
   * @validation_control Control de validación por secciones
   * @workflow_management Gestión de flujo del trámite
   */
  formaValida: {
    /**
     * @property {boolean} esDatosSubcontratistaValido
     * @description
     * Indica si los datos del subcontratista han sido validados correctamente.
     * Controla si el usuario puede proceder con siguientes pasos del trámite.
     * 
     * @validation_flag Bandera de validación de datos empresariales
     * @workflow_gate Control de flujo para avance del proceso
     */
    esDatosSubcontratistaValido: boolean;
  };
}

/**
 * @interface DomicilioPayload
 * @description
 * Interfaz que define la estructura completa para payload de domicilio utilizado
 * en comunicaciones con servicios backend. Incluye todos los campos necesarios
 * para representar una dirección mexicana según estándares oficiales y
 * requerimientos del sistema VUCEM para operaciones de validación y registro.
 * 
 * @backend_communication
 * Estructura diseñada para:
 * - Envío de datos de dirección a servicios web
 * - Recepción de información validada desde backend
 * - Intercambio con sistemas externos de validación
 * - Sincronización con catálogos oficiales
 * 
 * @comprehensive_address
 * Incluye campos para:
 * - Dirección física completa según estándares mexicanos
 * - Identificadores de catálogos oficiales (INEGI, SEPOMEX)
 * - Información de contacto (teléfonos, fax)
 * - Metadatos de clasificación y referencia
 * 
 * @official_catalogs
 * Integra con catálogos oficiales:
 * - Códigos de entidades federativas
 * - Claves de municipios y delegaciones
 * - Identificadores de localidades
 * - Códigos postales oficiales
 * 
 * @validation_ready
 * Preparado para:
 * - Validación automática con servicios oficiales
 * - Verificación de existencia y consistencia
 * - Consultas a catálogos gubernamentales
 * - Transformación entre diferentes formatos
 * 
 * @export
 * @interface
 * @address_payload
 */
export interface DomicilioPayload {
  /**
   * @property {number} idDomicilio - Identificador único del domicilio en sistema
   */
  idDomicilio: number;
  /**
   * @property {string} calle - Nombre de la calle o vía principal
   */
  calle: string;
  /**
   * @property {string} numeroExterior - Número exterior del inmueble
   */
  numeroExterior: string;
  /**
   * @property {string} numeroInterior - Número interior del inmueble
   */
  numeroInterior: string;
  /**
   * @property {string} codigoPostal - Código postal mexicano
   */
  codigoPostal: string;
  /**
   * @property {string} informacionExtra - Información adicional de ubicación
   */
  informacionExtra: string;
  /**
   * @property {string} clave - Clave de identificación en catálogos
   */
  clave: string;
  /**
   * @property {string} cveLocalidad - Clave oficial de la localidad
   */
  cveLocalidad: string;
  /**
   * @property {string} cveDelegMun - Clave de delegación o municipio
   */
  cveDelegMun: string;
  /**
   * @property {string} cveEntidad - Clave de la entidad federativa
   */
  cveEntidad: string;
  /**
   * @property {string} cvePais - Clave del país
   */
  cvePais: string;
  /**
   * @property {string} ciudad - Nombre de la ciudad
   */
  ciudad: string;
  /**
   * @property {string} telefono - Número telefónico principal
   */
  telefono: string;
  /**
   * @property {string} fax - Número de fax
   */
  fax: string;
  /**
   * @property {string} municipio - Nombre del municipio
   */
  municipio: string;
  /**
   * @property {string} colonia - Nombre de la colonia
   */
  colonia: string;
  /**
   * @property {string} descUbicacion - Descripción detallada de ubicación
   */
  descUbicacion: string;
  /**
   * @property {string} cveCatalogo - Clave de catálogo de referencias
   */
  cveCatalogo: string;
  /**
   * @property {string} telefonos - Números telefónicos adicionales
   */
  telefonos: string;
  /**
   * @property {number} tipoDomicilio - Tipo de domicilio según clasificación
   */
  tipoDomicilio: number;
}
export interface DatoComplementario {
  idPlantaC?: string | number;
  idDato?: string | number;
  amparoPrograma?: string;
}
export interface BaseItem {
  datosComplementarios?: DatoComplementario[];
  [key: string]: unknown; // allows extra properties safely
}
export interface PlantasDireccionModelos {
  calle?: string;
  numInterior?: string | number;
  numExterior?: string | number;
  codigoPostal?: string | number;
  localidad?: string;
  delegacionMunicipio?: string;
  entidadFederativa?: string;
  pais?: string;
  rfc?: string;
  domicilioFiscalSolicitante?: string;
  razonSocial?: string;
}
export interface EntidadFederativa {
  cveEntidad?: string | null;
  nombre?: string;
}

export interface Pais {
  nombre?: string;
}

export interface EmpresaDto {
  razonSocial?: string;
  rfc?: string;
  domicilioSolicitud?: DomicilioDto;
}

export interface ApiResponseItem {
  idSubfabricante?: number;
  calle?: string;
  numeroExterior?: string | number | null;
  numeroInterior?: string | number | null;
  codigoPostal?: string | number | null;
  colonia?: string;
  delegacionMunicipio?: string;
  entidadFederativa?: string;
  pais?: string;
  rfc?: string;
  razonSocial?: string;
  domicilioDto?: DomicilioDto;
  empresaDto?: EmpresaDto;
}
