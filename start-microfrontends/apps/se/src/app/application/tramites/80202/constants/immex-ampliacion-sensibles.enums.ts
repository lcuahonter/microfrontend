/**
 * Constante que define los pasos de un proceso específico.
 * 
 * Cada paso contiene la siguiente información:
 * - `indice`: Número que representa el orden del paso en el proceso.
 * - `titulo`: Descripción breve del paso.
 * - `activo`: Indica si el paso está activo actualmente.
 * - `completado`: Indica si el paso ha sido completado.
 * 
 * Esta constante puede ser utilizada para controlar el flujo de un proceso
 * y determinar el estado de cada paso.
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
 * Contiene los textos utilizados como requisitos en la aplicación.
 * 
 * @property INSTRUCCIONES - Instrucciones detalladas para el usuario sobre cómo manejar los documentos requeridos.
 *   - Explica que algunos documentos podrían ser obligatorios dependiendo del caso.
 *   - Indica cómo eliminar documentos no necesarios.
 *   - Proporciona instrucciones para anexar múltiples documentos del mismo tipo.
 * 
 * @property ADJUNTAR - Texto que guía al usuario sobre cómo adjuntar nuevos documentos.
 *   - Explica el proceso para seleccionar y adjuntar documentos adicionales.
 */
export const TEXTOS_REQUISITOS = {
  INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, selecciónalo y elimínalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo".</p>`,
  ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
};

/**
 * Mensaje de éxito para la etapa uno del proceso de solicitud.
 * Este mensaje informa al usuario que la solicitud ha sido registrada
 * con un número temporal, el cual no tiene validez legal y sirve únicamente
 * para identificar la solicitud. Se asignará un folio oficial cuando la
 * solicitud sea firmada.
 */
export const MENSAJE_DE_EXITO_ETAPA_UNO = `La solicitud ha quedado registrada con el número temporal 202758511. Este no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.`;
/**
 * Constante que define los campos y configuraciones para el formulario
 * de un solicitante físico nacional en el contexto zoosanitario.
 * 
 * Cada objeto dentro del arreglo representa un campo del formulario con
 * las siguientes propiedades:
 * 
 * - `labelNombre`: Etiqueta que describe el campo.
 * - `campo`: Nombre del campo utilizado para enlazar datos.
 * - `class`: Clase CSS para definir el diseño del campo.
 * - `tipo_input`: Tipo de entrada del campo (por ejemplo, texto).
 * - `disabled`: Indica si el campo está deshabilitado.
 * - `tooltip`: Texto de ayuda que se muestra al usuario.
 * - `validators`: Lista de validaciones aplicadas al campo.
 * - `placeholder`: Texto de marcador de posición para el campo.
 * 
 * Esta configuración está diseñada para ser utilizada en formularios
 * donde los datos del solicitante son predefinidos y no editables.
 */
export const ZOOSANITARIO_SOLICITANTE_FISICA_NACIONAL = [
  {
    labelNombre: 'Registro federal de contribuyentes:',
    campo: 'rfc',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    tooltip: 'Registro federal de contribuyentes:',
    validators: ['required'],
    placeholder: '',
  },
  {
    labelNombre: 'Denominación o razón social:',
    campo: 'nombreRazonSocial',
    class: 'col-md-8',
    tipo_input: 'text',
    disabled: true,
    tooltip: 'Denominación o razón social',
    validators: ['required'],
    placeholder: '',
  },
  {
    labelNombre: 'Actividad económica preponderante:',
    campo: 'actEconomica',
    class: 'col-md-12',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
  {
    labelNombre: 'Correo electrónico',
    campo: 'correo',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
];
/**
 * Constante que representa la configuración para la "Fecha de pago".
 * 
 * @property {string} labelNombre - Etiqueta que describe el nombre del campo.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado o no.
 */
export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha de pago',
  required: true,
  habilitado: false,
};
/**
 * Constante que contiene un mensaje de texto utilizado para indicar
 * que se debe agregar al menos una mercancía para continuar con el trámite.
 */
export const TEXTOS =
  'Para continuar con el trámite, deberá agregar por lo menos una mercancía.';
/**
 * Constante que define un mensaje de alerta para indicar que las tablas 
 * marcadas con un asterisco son obligatorias y deben contener al menos 
 * un registro.
 */
export const TERCEROR_TEXTO_DE_ALERTA =
  'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';
/**
 * Constante que representa el identificador único del usuario.
 * 
 * @const IDDEUSUARIO
 * @type {number}
 * @description Utilizado para identificar al usuario en el sistema.
 * @valor 21
 */
export const IDDEUSUARIO = 21;

/**
 * @const SECCIONES_TRAMITE_80202
 * @description Configuración de las secciones y validaciones para cada paso del trámite IMMEX.
 *
 * @property {Object} PASO_1 - Configuración de validaciones para el paso 1.
 * @property {Object} PASO_2 - Configuración de validaciones para el paso 2.
 * @property {Object} PASO_3 - Configuración de validaciones para el paso 3.
 */
export const SECCIONES_TRAMITE_80202 = {
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
 * Constante que contiene la información del usuario en formato JSON.
 * Esta información incluye detalles personales, firma electrónica,
 * rol actual, RFC del solicitante, ID de la solicitud y referencia de la solicitud.
 */
export const USUARIO_INFO = {
  "persona": {
    "claveUsuario": "828811",
    "rfc": "LEQI8101314S7",
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "Gómez"
  },
  "firmaElectronica": {
    "cadenaOriginal": "ABCDEF1234567890",
    "certificado": "3082054030820428a00302010202143230303031303030303030313030303032303534300d06092a864886f70d01010505003082016f3118301606035504030c0f412e432e2064652070727565626173312f302d060355040a0c26536572766963696f2064652041646d696e69737472616369c3b36e205472696275746172696131383036060355040b0c2f41646d696e69737472616369c3b36e20646520536567757269646164206465206c6120496e666f726d616369c3b36e3129302706092a864886f70d010901161a617369736e657440707275656261732e7361742e676f622e6d783126302406035504090c1d41762e20486964616c676f2037372c20436f6c2e20477565727265726f310e300c06035504110c053036333030310b3009060355040613024d583119301706035504080c10446973747269746f204665646572616c3112301006035504070c09436f796f6163c3a16e31153013060355042d130c5341543937303730314e4e333132303006092a864886f70d0109020c23526573706f6e7361626c653a2048c3a963746f72204f726e656c617320417263696761301e170d3130313232393135343330365a170d3134313232393135343334365a3081ba312630240603550403141d49474e4143494f204544554152444f204c454f5320515549d14f4e4553312630240603550429141d49474e4143494f204544554152444f204c454f5320515549d14f4e455331263024060355040a141d49474e4143494f204544554152444f204c454f5320515549d14f4e4553310b3009060355040613024d5831163014060355042d130d4c455149383130313331345337311b3019060355040513124c455149383130313331484447535847303530819f300d06092a864886f70d010101050003818d0030818902818100be63d94ebf3d6fb4e9a99eb630a80f10dba552c1ee367c93faffec9181244d0b2d6c3c788f4a084dddc7b150b9e2f669d06ee0738d602cc0d2ee6f9e32758e492658ca5b2434a7b3c3ee8fa96b38befb0fc1b8efcd38fb16439626e9990c310d7c9368993c3bc090159693484b6406941f318186517eca71c7a236fc4457c0190203010001a382010830820104300c0603551d130101ff04023000300b0603551d0f0404030203d8301106096086480186f84201010404030205a0301d0603551d0e04160414171ca985e9f7da9f398291ebed01b10b71898956302e0603551d1f042730253023a021a01f861d687474703a2f2f706b692e7361742e676f622e6d782f7361742e63726c303306082b0601050507010104273025302306082b060105050730018617687474703a2f2f6f6373702e7361742e676f622e6d782f301f0603551d23041830168014eb597d04229a538d9e711aa0589629f539e0a0c530100603551d2004093007300506032a0304301d0603551d250416301406082b0601050507030406082b06010505070302300d06092a864886f70d01010505000382010100ce60a5b5b8a3a7ea57878af4cdbe001e8833889ee7287da2c44e865cf4bb8c7770f2561e22aaa57eb7034684a537fc1e08b6f18e4bb2d0821ff27a772dbda420894fa94fb5bb00a9cf4c6dac3c91e23b4cd83cb1ba8ed6c577eb8a3dbd809a475bb904f31a86f10491ecb7ea7851c4586ba44a4da7493f795f4693a83bfc277a8118eeab4e3a4825f41cb69936f2996e0775df50ad78646d8d38abba279666bd21b31ce1e850d4af3ebf88fbc50b00460c2f161af54e3318445b8d8334b173e2e4e874332e1970d7252672956cad704fbd1b5ff6dd38ed1ee3a2dffe502531af5ab4f8cdad18253a26b58c432c2a6aeaaed10ecb9bed8085a217d43641514b53",
    "firma": "uSabSdHjrNAzOLvbSHfjcbHJcJAX8jNEu+K+bMMUeuV9ECJojB0jUmWwKoMK64PWjbJovApPDqa7Y5uwh1qRqIj/3pfLpTR+KCJa9CxotE0ECo8wBxWS3stkkBvxhp8hTDO7ummX8GeQkDvw1Fmaqn3BnG9jxwEVnTeb+1DG2EE="
  },
  "rolActual": "CAPTURISTA_GUBERNAMENTAL",
  "rfcSolicitante": "LEQI8101314S7",
  "idSolicitud": 202775426,
  "referenciaSolicitud": ""
}
