/**
 * @const PASOS
 * @description Arreglo que define los pasos del trámite IMMEX.
 * Cada paso incluye un índice, un título descriptivo, y estados de actividad y completitud.
 *
 * @property {number} indice - Número que identifica el orden del paso.
 * @property {string} titulo - Título descriptivo del paso.
 * @property {boolean} activo - Indica si el paso está activo actualmente.
 * @property {boolean} completado - Indica si el paso ha sido completado.
 */
export const PASOS = [
    {
        indice: 1,
        titulo: 'Capturar solicitud',
        activo: true,
        completado: true,
    },
    {
        indice: 2,
        titulo: 'Anexar necesarios',
        activo: false,
        completado: false,
    },
    {
        indice: 3,
        titulo: 'Firmar solicitud',
        activo: false,
        completado: false,
    },
];

/**
 * @const TEXTOS_REQUISITOS
 * @description Contiene los textos informativos y de ayuda relacionados con los requisitos del trámite IMMEX.
 *
 * @property {string} INSTRUCCIONES - HTML con instrucciones generales para el usuario sobre cómo manejar los documentos requeridos.
 * @property {string} ADJUNTAR - HTML con indicaciones para adjuntar nuevos documentos en el sistema.
 *
 * @example
 * // Para mostrar las instrucciones en el componente de requisitos:
 * this.instruccionesHtml = TEXTOS_REQUISITOS.INSTRUCCIONES;
 *
 * // Para mostrar el texto de adjuntar documentos:
 * this.adjuntarHtml = TEXTOS_REQUISITOS.ADJUNTAR;
 */
export const TEXTOS_REQUISITOS = {
    INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, selecciónalo y elimínalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo".</p>`,
    ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
};

/**
 * @const SUCECESS_MESSAGE_STAGEONE
 * @description Mensaje de éxito mostrado al usuario después de completar la etapa uno del trámite IMMEX.
 *
 * @type {string}
 * @example
 * // Se utiliza para mostrar el mensaje de éxito al registrar la solicitud
 * this.successMessage = SUCECESS_MESSAGE_STAGEONE;
 */
export const SUCECESS_MESSAGE_STAGEONE = `La solicitud ha quedado registrada con el número temporal 202758511. Este no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.`;

/**
 * @const SECCIONES_TRAMITE_80208
 * @description Configuración de las secciones y validaciones para cada paso del trámite IMMEX.
 *
 * @property {Object} PASO_1 - Configuración de validaciones para el paso 1.
 * @property {Object} PASO_2 - Configuración de validaciones para el paso 2.
 * @property {Object} PASO_3 - Configuración de validaciones para el paso 3.
 */
export const SECCIONES_TRAMITE_80208 = {
    PASO_1: {
        VALIDACION_SECCION_1: false,
        VALIDACION_SECCION_2: true,
    },
    PASO_2: {
        VALIDACION_SECCION: true,
    },
    PASO_3: {
        requiereValidacion: true,
    },
};

/**
 * Información del usuario utilizada en el proceso de solicitud.
 *
 * @property {object} persona - Datos personales del usuario.
 * @property {string} persona.claveUsuario - Clave única del usuario.
 * @property {string} persona.rfc - RFC del usuario.
 * @property {string} persona.nombre - Nombre del usuario.
 * @property {string} persona.apellidoPaterno - Apellido paterno del usuario.
 * @property {string} persona.apellidoMaterno - Apellido materno del usuario.
 * @property {object} firmaElectronica - Información de la firma electrónica del usuario.
 * @property {string} firmaElectronica.cadenaOriginal - Cadena original utilizada en la firma.
 * @property {string} firmaElectronica.certificado - Certificado digital en formato PEM.
 * @property {string} firmaElectronica.firma - Firma electrónica generada.
 * @property {string} rolActual - Rol actual del usuario en el sistema.
 * @property {string} rfcSolicitante - RFC del solicitante.
 * @property {number} idSolicitud - Identificador único de la solicitud.
 * @property {string} referenciaSolicitud - Referencia adicional de la solicitud.
 */
export const USUARIO_INFO = {
  persona: {
    claveUsuario: '828811',
    rfc: 'LEQI8101314S7',
    nombre: 'Juan',
    apellidoPaterno: 'Pérez',
    apellidoMaterno: 'Gómez',
  },
  firmaElectronica: {
    cadenaOriginal: 'ABCDEF1234567890',
    certificado:
      '3082054030820428a00302010202143230303031303030303030313030303032303534300d06092a864886f70d01010505003082016f3118301606035504030c0f412e432e2064652070727565626173312f302d060355040a0c26536572766963696f2064652041646d696e69737472616369c3b36e205472696275746172696131383036060355040b0c2f41646d696e69737472616369c3b36e20646520536567757269646164206465206c6120496e666f726d616369c3b36e3129302706092a864886f70d010901161a617369736e657440707275656261732e7361742e676f622e6d783126302406035504090c1d41762e20486964616c676f2037372c20436f6c2e20477565727265726f310e300c06035504110c053036333030310b3009060355040613024d583119301706035504080c10446973747269746f204665646572616c3112301006035504070c09436f796f6163c3a16e31153013060355042d130c5341543937303730314e4e333132303006092a864886f70d0109020c23526573706f6e7361626c653a2048c3a963746f72204f726e656c617320417263696761301e170d3130313232393135343330365a170d3134313232393135343334365a3081ba312630240603550403141d49474e4143494f204544554152444f204c454f5320515549d14f4e4553312630240603550429141d49474e4143494f204544554152444f204c454f5320515549d14f4e455331263024060355040a141d49474e4143494f204544554152444f204c454f5320515549d14f4e4553310b3009060355040613024d5831163014060355042d130d4c455149383130313331345337311b3019060355040513124c455149383130313331484447535847303530819f300d06092a864886f70d010101050003818d0030818902818100be63d94ebf3d6fb4e9a99eb630a80f10dba552c1ee367c93faffec9181244d0b2d6c3c788f4a084dddc7b150b9e2f669d06ee0738d602cc0d2ee6f9e32758e492658ca5b2434a7b3c3ee8fa96b38befb0fc1b8efcd38fb16439626e9990c310d7c9368993c3bc090159693484b6406941f318186517eca71c7a236fc4457c0190203010001a382010830820104300c0603551d130101ff04023000300b0603551d0f0404030203d8301106096086480186f84201010404030205a0301d0603551d0e04160414171ca985e9f7da9f398291ebed01b10b71898956302e0603551d1f042730253023a021a01f861d687474703a2f2f706b692e7361742e676f622e6d782f7361742e63726c303306082b0601050507010104273025302306082b060105050730018617687474703a2f2f6f6373702e7361742e676f622e6d782f301f0603551d23041830168014eb597d04229a538d9e711aa0589629f539e0a0c530100603551d2004093007300506032a0304301d0603551d250416301406082b0601050507030406082b06010505070302300d06092a864886f70d01010505000382010100ce60a5b5b8a3a7ea57878af4cdbe001e8833889ee7287da2c44e865cf4bb8c7770f2561e22aaa57eb7034684a537fc1e08b6f18e4bb2d0821ff27a772dbda420894fa94fb5bb00a9cf4c6dac3c91e23b4cd83cb1ba8ed6c577eb8a3dbd809a475bb904f31a86f10491ecb7ea7851c4586ba44a4da7493f795f4693a83bfc277a8118eeab4e3a4825f41cb69936f2996e0775df50ad78646d8d38abba279666bd21b31ce1e850d4af3ebf88fbc50b00460c2f161af54e3318445b8d8334b173e2e4e874332e1970d7252672956cad704fbd1b5ff6dd38ed1ee3a2dffe502531af5ab4f8cdad18253a26b58c432c2a6aeaaed10ecb9bed8085a217d43641514b53',
    firma:
      'uSabSdHjrNAzOLvbSHfjcbHJcJAX8jNEu+K+bMMUeuV9ECJojB0jUmWwKoMK64PWjbJovApPDqa7Y5uwh1qRqIj/3pfLpTR+KCJa9CxotE0ECo8wBxWS3stkkBvxhp8hTDO7ummX8GeQkDvw1Fmaqn3BnG9jxwEVnTeb+1DG2EE=',
  },
  rolActual: 'CAPTURISTA_GUBERNAMENTAL',
  rfcSolicitante: 'LEQI8101314S7',
  idSolicitud: 202775426,
  referenciaSolicitud: '',
};

/**
 * @const ERROR_FORMA_ALERT
 * @description Mensaje de error HTML para el campo "Cambio de modalidad" cuando es requerido.
 * Contiene una estructura HTML con clases Bootstrap para mostrar el error de validación
 * centrado al usuario cuando no se ha seleccionado una modalidad de cambio.
 * 
 * @type {string}
 * @example
 * // Se utiliza para mostrar errores de validación en el formulario
 * this.errorMessage = ERROR_FORMA_ALERT;
 */
export const ERROR_FORMA_ALERT =
  `
  <div class="row">
<div class="col-md-12 justify-content-center text-center">
  <div class="row">
    <div class="col-md-12">
    <p>Corrija los siguientes errores:</p>
    <ol>
    <li>(Cambio de modalidad) es un campo requerido</li>
    </ol>
    </div>
  </div>
</div>
</div>
`

/**
 * @const ERROR_SERVICIOS_ALERT
 * @description Mensaje de error HTML para cuando no se han agregado servicios requeridos.
 * Contiene una estructura HTML con clases Bootstrap para mostrar el error de validación
 * centrado al usuario cuando debe agregar al menos un servicio a la solicitud.
 * 
 * @type {string}
 * @example
 * // Se utiliza para mostrar errores de validación cuando faltan servicios
 * this.errorMessage = ERROR_SERVICIOS_ALERT;
 */
export const ERROR_SERVICIOS_ALERT =
  `
  <div class="row">
<div class="col-md-12 justify-content-center text-center">
  <div class="row">
    <div class="col-md-12">
    <p>Corrija los siguientes errores:</p>
    <ol>
    <li>(Debe agregar al menos un servicio) es un campo requerido</li>
    </ol>
    </div>
  </div>
</div>
</div>
`