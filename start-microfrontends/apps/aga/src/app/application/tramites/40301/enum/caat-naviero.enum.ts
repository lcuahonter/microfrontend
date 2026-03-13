
/**
 * Constantes y configuraciones utilizadas en el trámite CAAT Naviero 40301 para la gestión de pasos, secciones y catálogos.
 *
 * Este archivo contiene todas las configuraciones estáticas necesarias para el funcionamiento del trámite
 * CAAT (Certificado de Autorización de Agente de Transporte) específico para operadores navieros.
 * Define la estructura de pasos del wizard, configuraciones de validación por secciones, metadatos
 * del proceso, catálogos de tipos de agente, y identificadores de recursos del sistema.
 *
 * Las configuraciones incluyen:
 * - Definición de secciones y validaciones por paso del trámite
 * - Configuración de pasos del wizard con estados y títulos
 * - Identificadores de catálogos y recursos del sistema
 * - Metadatos del proceso CAAT Naviero
 * - Catálogo de tipos de agentes de transporte marítimo
 *
 * @fileoverview Configuraciones y constantes del trámite CAAT Naviero 40301
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module CaatNavieroEnums
 */

/**
 * Configuración de secciones a mostrar y validar dentro de cada paso del trámite CAAT Naviero 40301.
 *
 * Esta constante define la estructura de secciones que deben ser mostradas y validadas
 * en cada paso del proceso de registro CAAT Naviero. Cada paso puede contener múltiples
 * secciones con sus respectivas configuraciones de validación, permitiendo un control
 * granular sobre la progresión del usuario a través del formulario.
 *
 * Estructura por pasos:
 * - `PASO_1`: Contiene las validaciones para las secciones del primer paso
 * - `PASO_2`: Contiene las configuraciones de validación del segundo paso
 * - Cada sección puede tener flags de validación específicos
 *
 * @constant {Object} SECCIONES_TRAMITE_40301
 *
 * @example
 * ```typescript
 * // Verificar si una sección requiere validación:
 * const requiereValidacion = SECCIONES_TRAMITE_40301.PASO_1.VALIDACION_SECCION_1;
 * 
 * // Iterar sobre las secciones de un paso:
 * Object.keys(SECCIONES_TRAMITE_40301.PASO_1).forEach(seccion => {
 *   console.log(`Sección ${seccion}:`, SECCIONES_TRAMITE_40301.PASO_1[seccion]);
 * });
 * ```
 *
 * @since 1.0.0
 */
export const SECCIONES_TRAMITE_40301 = {
    /**
     * Configuración de secciones para el primer paso del trámite CAAT Naviero.
     *
     * Define las secciones que deben ser validadas durante el primer paso del proceso
     * de registro. Cada sección representa una parte específica del formulario que
     * requiere validación antes de permitir el avance al siguiente paso.
     *
     * @property {Object} PASO_1
     */
    PASO_1: {
        /**
         * @property {boolean} VALIDACION_SECCION_1
         * Indica si la primera sección del paso 1 requiere validación.
         * Controla la validación de datos básicos del solicitante.
         */
        VALIDACION_SECCION_1: true,

        /**
         * @property {boolean} VALIDACION_SECCION_2
         * Indica si la segunda sección del paso 1 requiere validación.
         * Controla la validación de información complementaria del agente.
         */
        VALIDACION_SECCION_2: true,
    },

    /**
     * Configuración de secciones para el segundo paso del trámite CAAT Naviero.
     *
     * Define las configuraciones de validación específicas para el segundo paso
     * del proceso, que generalmente incluye la captura de firma digital y
     * finalización del trámite.
     *
     * @property {Object} PASO_2
     */
    PASO_2: {
      /**
       * @property {boolean} requiereValidacion
       * Indica si el segundo paso requiere validación general.
       * Controla la validación del proceso de firma digital.
       */
      requiereValidacion: true,
    },
  };

  /**
   * Configuración de los pasos del wizard para el trámite CAAT Naviero 40301.
   *
   * Esta constante define la estructura completa de pasos que conforman el wizard
   * de registro CAAT Naviero. Cada paso contiene información sobre su estado,
   * título descriptivo, y configuración de navegación. La estructura sigue el
   * patrón estándar de wizards con control de progresión secuencial.
   *
   * Cada paso está representado por un objeto que contiene las siguientes propiedades:
   * - `indice`: Número secuencial del paso en el flujo
   * - `titulo`: Título descriptivo que se muestra al usuario
   * - `activo`: Indica si el paso está actualmente activo o disponible
   * - `completado`: Indica si el paso ha sido completado exitosamente
   *
   * @constant {Array<Object>} CAAT_NAVIERO_PASOS
   *
   * @example
   * ```typescript
   * // Obtener el paso actual:
   * const pasoActual = CAAT_NAVIERO_PASOS.find(paso => paso.activo);
   *
   * // Verificar pasos completados:
   * const pasosCompletados = CAAT_NAVIERO_PASOS.filter(paso => paso.completado);
   *
   * // Obtener título del primer paso:
   * const tituloPrimerPaso = CAAT_NAVIERO_PASOS[0].titulo;
   * ```
   *
   * @since 1.0.0
   */
  export const CAAT_NAVIERO_PASOS = [
    {
      /**
       * @property {number} indice
       * Índice del primer paso en el flujo del wizard.
       */
      indice: 1,

      /**
       * @property {string} titulo
       * Título descriptivo del primer paso mostrado al usuario.
       */
      titulo: 'Capturar solicitud',

      /**
       * @property {boolean} activo
       * Indica si el primer paso está activo y disponible para el usuario.
       */
      activo: true,

      /**
       * @property {boolean} completado
       * Indica si el primer paso ha sido completado exitosamente.
       */
      completado: true,
    },
    {
      /**
       * @property {number} indice
       * Índice del segundo paso en el flujo del wizard.
       */
      indice: 2,

      /**
       * @property {string} titulo
       * Título descriptivo del segundo paso mostrado al usuario.
       */
      titulo: 'Firmar solicitud',

      /**
       * @property {boolean} activo
       * Indica si el segundo paso está activo y disponible para el usuario.
       */
      activo: false,

      /**
       * @property {boolean} completado
       * Indica si el segundo paso ha sido completado exitosamente.
       */
      completado: false,
    },
  ];
  

/**
 * Identificadores de catálogos y recursos utilizados en el trámite CAAT Naviero 40301.
 *
 * Esta constante centraliza todos los identificadores únicos utilizados para
 * referenciar catálogos, endpoints de API, y recursos específicos del trámite
 * 40301. Facilita el mantenimiento y la consistencia en el uso de identificadores
 * a través de toda la aplicación.
 *
 * @constant {Object} CATALOGOS_40301_ID
 *
 * @example
 * ```typescript
 * // Usar identificador del trámite:
 * const tramiteId = CATALOGOS_40301_ID.TRAMITE;
 *
 * // Referenciar endpoint de metadatos:
 * const metaInfoEndpoint = CATALOGOS_40301_ID.OBTENER_META_INFO;
 *
 * // Acceder al catálogo de agentes:
 * const catalogoAgentes = CATALOGOS_40301_ID.AGENT_CATALOG;
 * ```
 *
 * @since 1.0.0
 */
export const CATALOGOS_40301_ID = {
  /**
   * @property {string} TRAMITE
   * Identificador único del trámite CAAT Naviero.
   */
  TRAMITE: '40301',

  /**
   * @property {string} OBTENER_META_INFO
   * Identificador del endpoint para obtener metadatos del trámite.
   */
  OBTENER_META_INFO: "obtenerMetaInfo",

  /**
   * @property {string} AGENT_CATALOG
   * Identificador del catálogo de tipos de agente naviero.
   */
  AGENT_CATALOG: "tipoAgente"
}

/**
 * Metadatos y configuración general del trámite CAAT Naviero 40301.
 *
 * Esta constante contiene la información de metadatos utilizada para configurar
 * la interfaz de usuario del trámite CAAT Naviero. Incluye títulos, etiquetas,
 * y configuraciones de roles que definen el comportamiento y la presentación
 * del proceso de registro.
 *
 * @constant {Object} META_INFO_40301
 *
 * @example
 * ```typescript
 * // Configurar título de la página:
 * document.title = META_INFO_40301.titulo;
 *
 * // Obtener etiqueta para campo de tipo de agente:
 * const labelTipoAgente = META_INFO_40301.tipoAgenteLabel;
 *
 * // Verificar si un rol tiene acceso:
 * const tieneAcceso = META_INFO_40301.roles.includes(rolUsuario);
 * ```
 *
 * @since 1.0.0
 */
export const META_INFO_40301 = {
  /**
   * @property {string} titulo
   * Título principal del trámite mostrado en la interfaz de usuario.
   */
  titulo: 'CAAT Naviero',

  /**
   * @property {string} tipoAgenteLabel
   * Etiqueta descriptiva para el campo de selección de tipo de agente.
   */
  tipoAgenteLabel: 'Tipo de agente',

  /**
   * @property {string[]} roles
   * Lista de roles de usuario autorizados para acceder al trámite CAAT Naviero.
   * Incluye roles administrativos, de usuario estándar y persona moral.
   */
  roles: ['Admin', 'User', "personaMoral"], // Roles de usuario que pueden acceder al trámite
};


/**
 * Catálogo de tipos de agentes de transporte marítimo para el trámite CAAT Naviero 40301.
 *
 * Esta constante define el catálogo completo de tipos de agentes autorizados
 * para operar en el transporte marítimo según las regulaciones mexicanas.
 * Cada tipo de agente tiene características específicas y permisos diferenciados
 * para realizar operaciones portuarias y de comercio exterior.
 *
 * Cada entrada del catálogo contiene:
 * - `id`: Identificador único numérico del tipo de agente
 * - `clave`: Código alfanumérico oficial del tipo de agente
 * - `descripcion`: Descripción detallada del tipo de agente y sus funciones
 *
 * @constant {Array<Object>} AGENT_CATALOG
 *
 * @example
 * ```typescript
 * // Buscar agente por ID:
 * const agente = AGENT_CATALOG.find(a => a.id === 1);
 *
 * // Obtener descripciones para combo box:
 * const descripciones = AGENT_CATALOG.map(a => a.descripcion);
 *
 * // Filtrar por tipo específico:
 * const agentesNavieros = AGENT_CATALOG.filter(a => 
 *   a.clave.includes('AN')
 * );
 * ```
 *
 * @since 1.0.0
 */
export const AGENT_CATALOG = [
  { 
    /**
     * @property {number} id
     * Identificador único del agente naviero.
     */
    id: 1, 

    /**
     * @property {string} clave
     * Código oficial del agente naviero según normativa mexicana.
     */
    clave: "TIAGN.AN", 

    /**
     * @property {string} descripcion
     * Descripción del tipo de agente naviero y sus funciones operativas.
     */
    descripcion: "Agente naviero" 
  },
  { 
    /**
     * @property {number} id
     * Identificador único del agente internacional de carga.
     */
    id: 2, 

    /**
     * @property {string} clave
     * Código oficial del agente internacional de carga.
     */
    clave: "TIAGN.AIC", 

    /**
     * @property {string} descripcion
     * Descripción del agente internacional de carga y sus responsabilidades.
     */
    descripcion: "Agente internacional de carga" 
  },
  { 
    /**
     * @property {number} id
     * Identificador único del consignatario de buque.
     */
    id: 3, 

    /**
     * @property {string} clave
     * Código oficial del consignatario de buque.
     */
    clave: "TIAGN.CB", 

    /**
     * @property {string} descripcion
     * Descripción del consignatario de buque y sus funciones portuarias.
     */
    descripcion: "Consignatario de buque" 
  }
];

export const ERROR_MESSAGES = {
  // Mensaje de éxito con número temporal
  REGISTRO_EXITOSO: (numeroSolicitud: string) : string =>
    `<p>La solicitud ha quedado registrada con el número temporal ${
      numeroSolicitud ?? ''
    }. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.</p>`,

  // Mensaje para trámite vigente (3 parámetros)
  CAAT_EXISTENTE: (folio: string, fecha: string, tipo: string): string =>
    `El usuario ya cuenta con un CAAT naviero asociado con folio: ${folio}, con fecha de fin de vigencia: ${fecha} y tipo de agente: ${tipo}.`,

  // Mensaje para tareas pendientes (Sin parámetros)
  CAAT_TAREAS_PENDIENTES: () : string =>
    `El usuario tiene tareas de CAAT pendientes. Favor de revisar la bandeja de tareas pendientes.`
};

export enum ApiErrorCode {
  CAAT_EXISTENTE = "11",
  CAAT_TAREAS_PENDIENTES = "12"
}
