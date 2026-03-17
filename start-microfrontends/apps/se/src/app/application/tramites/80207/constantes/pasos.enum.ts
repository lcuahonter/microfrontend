/**
 * @fileoverview Archivo de constantes que define la configuración de pasos del trámite 80207
 * @description
 * Este archivo contiene las definiciones de constantes esenciales para el manejo del flujo
 * de pasos del trámite 80207 de empresas submanufactureras. Incluye la configuración de
 * estados de cada paso y la información del usuario para procesos de firma electrónica.
 * 
 * @module PasosConstantes
 * @tramite 80207
 * @version 1.0.0
 * @author Sistema VUCEM
 */

/**
 * @constant {Array<PasoConfig>} PASOS
 * @description
 * Configuración completa de los pasos del proceso del trámite 80207.
 * Define la secuencia de pasos que debe seguir el usuario para completar
 * el trámite de empresas submanufactureras, incluyendo estados de activación
 * y completitud de cada etapa.
 * 
 * @structure
 * Cada paso contiene las siguientes propiedades:
 * - **indice**: Número secuencial del paso (1-based)
 * - **titulo**: Descripción textual de la etapa del proceso
 * - **activo**: Indica si el usuario puede interactuar con este paso
 * - **completado**: Marca si el paso ha sido finalizado exitosamente
 * 
 * @workflow_steps
 * 1. **Capturar solicitud**: Ingreso de datos principales del trámite
 * 2. **Requisitos necesarios**: Verificación y carga de documentos requeridos
 * 3. **Firmar solicitud**: Proceso de firma electrónica y envío final
 * 
 * @state_management
 * Los estados se actualizan dinámicamente durante el flujo:
 * - Paso inicial activo y completado por defecto
 * - Pasos siguientes inactivos hasta completar prerrequisitos
 * - Progresión secuencial obligatoria
 * 
 * @business_rules
 * - Solo un paso puede estar activo a la vez
 * - Los pasos deben completarse secuencialmente
 * - No se permite saltar pasos sin completar el anterior
 * - El estado de completitud se valida automáticamente
 * 
 * @ui_integration
 * Se utiliza para renderizar:
 * - Indicadores de progreso visual
 * - Navegación entre pasos
 * - Validación de estado de formularios
 * - Habilitación/deshabilitación de controles
 * 
 * @export
 * @property {number} indice - Índice del paso en la secuencia del proceso
 * @property {string} titulo - Título descriptivo del paso para mostrar al usuario
 * @property {boolean} activo - Indica si el paso está activo y permite interacción
 * @property {boolean} completado - Indica si el paso está completado exitosamente
 */
export const PASOS = [
  {
    /**
     * @property {number} indice
     * @description
     * Índice numérico del primer paso del proceso del trámite.
     * Representa la etapa inicial de captura de solicitud donde
     * el usuario ingresa los datos principales del trámite.
     * 
     * @value 1
     * @sequence_position Primer paso del flujo
     */
    indice: 1,

    /**
     * @property {string} titulo
     * @description
     * Título descriptivo del primer paso del proceso que se muestra
     * al usuario en la interfaz. Indica claramente la acción principal
     * que debe realizar en esta etapa del trámite.
     * 
     * @value "Capturar solicitud"
     * @purpose Guiar al usuario sobre la acción requerida
     * @display Se muestra en navegadores de pasos y breadcrumbs
     */
    titulo: 'Capturar solicitud',

    /**
     * @property {boolean} activo
     * @description
     * Estado de activación del primer paso. Indica que este paso
     * está disponible para interacción del usuario desde el inicio
     * del proceso, permitiendo la captura de datos.
     * 
     * @value true
     * @behavior Permite navegación e interacción inmediata
     * @ui_effect Habilita controles y formularios del paso
     */
    activo: true,

    /**
     * @property {boolean} completado
     * @description
     * Estado de completitud del primer paso. Se marca como completado
     * por defecto para permitir el flujo inicial del proceso.
     * En implementación real, se actualiza dinámicamente.
     * 
     * @value true
     * @validation Se actualiza según validaciones de formulario
     * @progression Habilita navegación al siguiente paso
     */
    completado: true,
  },
  {
    /**
     * @step_configuration Segundo paso del proceso
     * @description Configuración del paso de requisitos necesarios
     */
    indice: 2,
    titulo: 'Requisitos necesarios',
    activo: false,
    completado: false,
  },
  {
    /**
     * @step_configuration Tercer paso del proceso
     * @description Configuración del paso de firma electrónica
     */
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * @constant {UsuarioInfo} USUARIO_INFO
 * @description
 * Objeto que contiene la información completa del usuario y los datos necesarios
 * para el proceso de firma electrónica del trámite. Incluye datos personales,
 * certificados digitales y metadatos de la solicitud.
 * 
 * @structure
 * La estructura contiene las siguientes secciones principales:
 * - **persona**: Datos personales del usuario solicitante
 * - **firmaElectronica**: Información de certificado y firma digital
 * - **rolActual**: Rol del usuario en el sistema
 * - **rfcSolicitante**: RFC del usuario que realiza la solicitud
 * - **idSolicitud**: Identificador único de la solicitud
 * - **referenciaSolicitud**: Referencia adicional de la solicitud
 * 
 * @security_context
 * Contiene información sensible que debe manejarse con cuidado:
 * - Certificados de firma electrónica
 * - Claves de usuario
 * - Datos personales identificables
 * - Firmas digitales criptográficas
 * 
 * @usage_scenarios
 * Se utiliza en los siguientes contextos:
 * - Proceso de autenticación de usuario
 * - Generación de firmas electrónicas
 * - Validación de identidad del solicitante
 * - Registro de auditoría de transacciones
 * 
 * @compliance
 * Los datos cumplen con normativas mexicanas de:
 * - Ley de Firma Electrónica Avanzada
 * - Normativas del SAT para certificados digitales
 * - Protección de datos personales
 * - Trazabilidad de trámites gubernamentales
 * 
 * @data_integrity
 * La información se mantiene íntegra mediante:
 * - Certificados X.509 válidos
 * - Firmas digitales verificables
 * - Cadenas originales de certificación
 * - Validación criptográfica de datos
 */
export const USUARIO_INFO = {
        /**
         * @property {PersonaInfo} persona
         * @description
         * Información personal del usuario que realiza el trámite.
         * Contiene los datos de identificación necesarios para
         * validar la identidad del solicitante en el sistema.
         * 
         * @fields
         * - **claveUsuario**: Identificador único del usuario en el sistema
         * - **rfc**: Registro Federal de Contribuyentes del usuario
         * - **nombre**: Nombre(s) de la persona física
         * - **apellidoPaterno**: Apellido paterno del usuario
         * - **apellidoMaterno**: Apellido materno del usuario
         * 
         * @validation
         * Todos los campos son obligatorios y deben coincidir
         * con la información del certificado de firma electrónica.
         */
        "persona": {
          /**
           * @property {string} claveUsuario
           * @description Identificador único del usuario en el sistema VUCEM
           */
          "claveUsuario": "828811",
          
          /**
           * @property {string} rfc
           * @description Registro Federal de Contribuyentes del usuario
           */
          "rfc": "LEQI8101314S7",
          
          /**
           * @property {string} nombre
           * @description Nombre(s) de la persona física
           */
          "nombre": "Juan",
          
          /**
           * @property {string} apellidoPaterno
           * @description Apellido paterno del usuario
           */
          "apellidoPaterno": "Pérez",
          
          /**
           * @property {string} apellidoMaterno
           * @description Apellido materno del usuario
           */
          "apellidoMaterno": "Gómez"
        },
        
        /**
         * @property {FirmaElectronicaInfo} firmaElectronica
         * @description
         * Información completa del certificado de firma electrónica y
         * los datos criptográficos necesarios para el proceso de firma
         * digital del trámite según normativas mexicanas.
         * 
         * @cryptographic_components
         * - **cadenaOriginal**: Cadena de texto base para generar la firma
         * - **certificado**: Certificado X.509 en formato DER codificado en Base64
         * - **firma**: Firma digital generada con la clave privada del usuario
         * 
         * @security_level
         * Cumple con estándares de seguridad gubernamentales mexicanos
         * para firma electrónica avanzada con validez jurídica.
         * 
         * @certificate_authority
         * El certificado es emitido por el SAT (Servicio de Administración
         * Tributaria) como autoridad certificadora oficial.
         */
        "firmaElectronica": {
        /**
         * @property {string} cadenaOriginal
         * @description
         * Cadena de caracteres alfanuméricos que sirve como base
         * para la generación de la firma electrónica. Debe ser
         * única para cada transacción y garantizar la integridad
         * de los datos firmados.
         */
        "cadenaOriginal": "ABCDEF1234567890",
        
        /**
         * @property {string} certificado
         * @description
         * Certificado de firma electrónica en formato X.509 DER
         * codificado en Base64. Contiene la clave pública del usuario
         * y los metadatos de identificación emitidos por el SAT.
         * 
         * @format X.509 DER encoded in Base64
         * @issuer SAT (Servicio de Administración Tributaria)
         * @validity Debe estar vigente al momento de la firma
         */
        "certificado": "3082054030820428a00302010202143230303031303030303030313030303032303534300d06092a864886f70d01010505003082016f3118301606035504030c0f412e432e2064652070727565626173312f302d060355040a0c26536572766963696f2064652041646d696e69737472616369c3b36e205472696275746172696131383036060355040b0c2f41646d696e69737472616369c3b36e20646520536567757269646164206465206c6120496e666f726d616369c3b36e3129302706092a864886f70d010901161a617369736e657440707275656261732e7361742e676f622e6d783126302406035504090c1d41762e20486964616c676f2037372c20436f6c2e20477565727265726f310e300c06035504110c053036333030310b3009060355040613024d583119301706035504080c10446973747269746f204665646572616c3112301006035504070c09436f796f6163c3a16e31153013060355042d130c5341543937303730314e4e333132303006092a864886f70d0109020c23526573706f6e7361626c653a2048c3a963746f72204f726e656c617320417263696761301e170d3130313232393135343330365a170d3134313232393135343334365a3081ba312630240603550403141d49474e4143494f204544554152444f204c454f5320515549d14f4e4553312630240603550429141d49474e4143494f204544554152444f204c454f5320515549d14f4e455331263024060355040a141d49474e4143494f204544554152444f204c454f5320515549d14f4e4553310b3009060355040613024d5831163014060355042d130d4c455149383130313331345337311b3019060355040513124c455149383130313331484447535847303530819f300d06092a864886f70d010101050003818d0030818902818100be63d94ebf3d6fb4e9a99eb630a80f10dba552c1ee367c93faffec9181244d0b2d6c3c788f4a084dddc7b150b9e2f669d06ee0738d602cc0d2ee6f9e32758e492658ca5b2434a7b3c3ee8fa96b38befb0fc1b8efcd38fb16439626e9990c310d7c9368993c3bc090159693484b6406941f318186517eca71c7a236fc4457c0190203010001a382010830820104300c0603551d130101ff04023000300b0603551d0f0404030203d8301106096086480186f84201010404030205a0301d0603551d0e04160414171ca985e9f7da9f398291ebed01b10b71898956302e0603551d1f042730253023a021a01f861d687474703a2f2f706b692e7361742e676f622e6d782f7361742e63726c303306082b0601050507010104273025302306082b060105050730018617687474703a2f2f6f6373702e7361742e676f622e6d782f301f0603551d23041830168014eb597d04229a538d9e711aa0589629f539e0a0c530100603551d2004093007300506032a0304301d0603551d250416301406082b0601050507030406082b06010505070302300d06092a864886f70d01010505000382010100ce60a5b5b8a3a7ea57878af4cdbe001e8833889ee7287da2c44e865cf4bb8c7770f2561e22aaa57eb7034684a537fc1e08b6f18e4bb2d0821ff27a772dbda420894fa94fb5bb00a9cf4c6dac3c91e23b4cd83cb1ba8ed6c577eb8a3dbd809a475bb904f31a86f10491ecb7ea7851c4586ba44a4da7493f795f4693a83bfc277a8118eeab4e3a4825f41cb69936f2996e0775df50ad78646d8d38abba279666bd21b31ce1e850d4af3ebf88fbc50b00460c2f161af54e3318445b8d8334b173e2e4e874332e1970d7252672956cad704fbd1b5ff6dd38ed1ee3a2dffe502531af5ab4f8cdad18253a26b58c432c2a6aeaaed10ecb9bed8085a217d43641514b53",
        
        /**
         * @property {string} firma
         * @description
         * Firma digital generada utilizando la clave privada del usuario
         * aplicada sobre la cadena original. Resultado del proceso
         * criptográfico que garantiza autenticidad e integridad.
         * 
         * @algorithm RSA con SHA-256 (según estándares SAT)
         * @encoding Base64
         * @verification Se verifica usando la clave pública del certificado
         */
        "firma": "uSabSdHjrNAzOLvbSHfjcbHJcJAX8jNEu+K+bMMUeuV9ECJojB0jUmWwKoMK64PWjbJovApPDqa7Y5uwh1qRqIj/3pfLpTR+KCJa9CxotE0ECo8wBxWS3stkkBvxhp8hTDO7ummX8GeQkDvw1Fmaqn3BnG9jxwEVnTeb+1DG2EE="
        },
        
        /**
         * @property {string} rolActual
         * @description
         * Rol activo del usuario en el sistema que determina los permisos
         * y funcionalidades disponibles durante el proceso del trámite.
         * Define el nivel de autorización para realizar operaciones.
         * 
         * @value "CAPTURISTA_GUBERNAMENTAL"
         * @permissions Permite captura y modificación de datos del trámite
         * @scope Operaciones gubernamentales de primer nivel
         */
        "rolActual": "CAPTURISTA_GUBERNAMENTAL",
        
        /**
         * @property {string} rfcSolicitante
         * @description
         * RFC de la persona que realiza la solicitud del trámite.
         * Debe coincidir con el RFC del certificado de firma electrónica
         * para garantizar la concordancia de identidad.
         * 
         * @format RFC de persona física (13 caracteres)
         * @validation Debe coincidir con persona.rfc
         */
        "rfcSolicitante": "LEQI8101314S7",
        
        /**
         * @property {number} idSolicitud
         * @description
         * Identificador único numérico de la solicitud en el sistema.
         * Se genera automáticamente al crear la solicitud y sirve
         * como referencia principal para todas las operaciones.
         * 
         * @type number
         * @unique true
         * @auto_generated true
         */
        "idSolicitud": 202775426,
        
        /**
         * @property {string} referenciaSolicitud
         * @description
         * Campo opcional para referencia adicional de la solicitud.
         * Puede contener identificadores externos o referencias
         * cruzadas con otros sistemas gubernamentales.
         * 
         * @optional true
         * @usage Integración con sistemas externos
         */
        "referenciaSolicitud": ""
      }
      export const ERROR_PLANTAS_SUBMANUFACTURERAS =
`
    <div class="custom-error-box mx-auto p-4" style="max-width: 800px;">
        <div class="text-center">
            <p class="error-title mb-2">Corrija los siguientes errores:</p>
        </div>
        <div class="d-flex align-items-center">
            <p class="mb-0 error-detail">
                (Debe seleccionar plantas submanufatureras) es un campo requerido
            </p>
        </div>
    </div>
</div>
<style>
    .error-title {
        color: #6c757d; 
    }
    .error-detail {
        color: red; 
    }
</style>
`;