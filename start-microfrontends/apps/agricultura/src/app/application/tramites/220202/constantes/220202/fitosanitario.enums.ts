/**
 * @description Constante que define los pasos del formulario.
 * Cada objeto representa un paso con su índice, título, estado activo y completado.
 * @constant {Array<Object>} PASOS
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
    titulo: 'Anexar requisitos',
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
 * @const FITOSANITARIO_PERSONA_MORAL_O_FISICA_NACIONAL
 *
 * Arreglo de objetos que define la configuración de los campos de formulario para la captura de datos
 * de una persona moral o física nacional en el contexto fitosanitario.
 *
 * Cada objeto representa un campo del formulario e incluye las siguientes propiedades:
 * - `labelNombre`: Etiqueta descriptiva que se muestra al usuario.
 * - `campo`: Nombre de la propiedad asociada al campo.
 * - `class`: Clases CSS para el diseño responsivo del campo.
 * - `tipo_input`: Tipo de entrada del campo (por ejemplo, 'text').
 * - `disabled`: Indica si el campo está deshabilitado.
 * - `tooltip`: Texto de ayuda que se muestra como tooltip.
 * - `validators`: Arreglo de validadores aplicados al campo (por ejemplo, 'required', 'maxLength').
 * - `placeholder`: Texto de marcador de posición para el campo.
 *
 * Este arreglo es utilizado para generar dinámicamente los campos del formulario de dirección y contacto,
 * asegurando la validación y presentación adecuada de los datos requeridos por el trámite fitosanitario.
 */
export const FITOSANITARIO_PERSONA_MORAL_O_FISICA_NACIONAL = [
  {
    labelNombre: 'País',
    campo: 'pais',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    tooltip: 'País',
    validators: ['required', 'maxLength:120'],
    placeholder: '',
  },
  {
    labelNombre: 'Código Postal',
    campo: 'codigoPostal',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    tooltip: 'Código Postal',
    validators: ['required', 'maxLength:10'],
    placeholder: '',
  },
  {
    labelNombre: 'Estado',
    campo: 'entidadFederativa',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    tooltip: 'Estado',
    validators: ['required', 'maxLength:50'],
    placeholder: '',
  },
  {
    labelNombre: 'Municipio o alcaldía',
    campo: 'municipio',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    tooltip: 'Municipio o alcaldía',
    validators: ['required', 'maxLength:120'],
    placeholder: '',
  },
  {
    labelNombre: 'Localidad',
    campo: 'localidad',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    tooltip: 'Localidad',
    validators: ['required', 'maxLength:68'],
    placeholder: '',
  },
  {
    labelNombre: 'Colonia',
    campo: 'colonia',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    tooltip: 'Colonia',
    validators: ['required', 'maxLength:68'],
    placeholder: '',
  },
  {
    labelNombre: 'Calle',
    campo: 'calle',
    class: 'col-md-8',
    tipo_input: 'text',
    disabled: true,
    tooltip: 'Calle',
    validators: ['required', 'maxLength:68'],
    placeholder: '',
  },
  {
    labelNombre: 'Número exterior',
    campo: 'nExt',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    tooltip: 'Número exterior',
    validators: ['required', 'maxLength:10'],
    placeholder: '',
  },
  {
    labelNombre: 'Número interior',
    campo: 'nInt',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    tooltip: 'Número interior',
    validators: ['maxLength:15'],
    placeholder: '',
  },
  {
    labelNombre: 'Lada',
    campo: 'lada',
    class: 'col-md-1',
    tipo_input: 'text',
    disabled: true,
    tooltip: 'Lada',
    validators: ['required', 'maxLength:15'],
    placeholder: '',
  },
  {
    labelNombre: 'Teléfono',
    campo: 'telefono',
    class: 'col-md-3',
    tipo_input: 'text',
    disabled: true,
    tooltip: 'Teléfono',
    validators: ['required', 'maxLength:15'],
    placeholder: '',
  },
];

/**
 * @description Constante que define la instrucción para el doble clic en la tabla.
 * @constant {string} INSTRUCCION_DOBLE_CLIC
 */
export const INSTRUCCION_DOBLE_CLIC =
  'Al dar doble clic en el registro seleccionado creará una nueva solicitud con los mismos datos de la solcitud elegida.';

/**
 * @description Constante que define el mensaje para tablas obligatorias.
 * @constant {string} ESREQUIREDTABLESMENSAJE
 */
export const ES_REQUERIDO_TABLAS_MENSAJE =
  'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';

/**
 * @description Constante que define la configuración para el input de fecha de pago.
 * @constant {Object} FECHA_DE_PAGO
 */
export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha de pago',
  required: true,
  habilitado: true,
};

/**
 * @description Constante que define la configuración para el input de fecha de pago.
 * @constant {Object} TEXTOS_REQUISITOS
 */
export const TEXTOS_REQUISITOS = {
  INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, selecciónalo y elimínalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo".</p>`,
  ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
};

/**
 * Constante que define la ruta relativa a los archivos JSON necesarios para la configuración del input de fecha de pago.
 */
export const URL: string = '../../../../../assets/json/220202/';

/**
 * @description Constante que define la configuración para el input de fecha final de pago en acuicultura.
 * Esta constante se utiliza para establecer las propiedades del campo de fecha de pago, indicando que es requerido y no habilitado.
 * @constant {Object}
 */
export const FECHA_SALIDA_ACUICULTURA = {
  labelNombre: 'Fecha de pago',
  required: true,
  habilitado: false,
};

/**
 * @description Constante que define las opciones para un campo de tipo radio.
 * Cada objeto representa una opción con su etiqueta y valor.
 * @constant {Array<Object>}
 */
export const TIPO_RADIO = [
  {
    label: 'No',
    value: 'No',
  },
  {
    label: 'Sí',
    value: 'Si',
  },
];

/**
 * Contiene el texto HTML para mostrar un aviso de privacidad simplificado.
 * Este aviso informa al usuario sobre el tratamiento de datos personales por parte del Servicio de Administración Tributaria (SAT)
 * a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCE).
 * Incluye información sobre el uso, transferencia y protección de los datos personales, así como un enlace al aviso de privacidad integral.
 *
 * @constant
 * @type {string}
 */
export const ALERT_TEXTO = `<div>  
  <div style="text-align: center; margin-bottom: 10px;">
    <strong style="color: #007baf;">Aviso de privacidad simplificado</strong>
  </div>
  <p style="margin-top: 10px; text-align: justify;">
    El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCE), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.
  </p>
  <p style="margin-top: 10px;text-align: center;">
    <a href="#" style="text-decoration: underline;">Aviso de privacidad integral</a>
  </p>
</div>
`;

/**
 * Mensaje mostrado cuando es obligatorio agregar al menos un registro en tablas con asterisco.
 * @type {string}
 */
export const SELECCIONADO =
  'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro';

/**
 * Opciones para el botón de radio de tipo de persona (Física o Moral).
 * @type {{label: string, value: string}[]}
 */
export const OPCION_DE_BOTON_DE_RADIO = [
  {
    /**
     * Etiqueta para persona física.
     * @type {string}
     */
    label: 'Fisica',
    /**
     * Valor para persona física.
     * @type {string}
     */
    value: 'yes',
  },
  {
    /**
     * Etiqueta para persona moral.
     * @type {string}
     */
    label: 'Moral',
    /**
     * Valor para persona moral.
     * @type {string}
     */
    value: 'no',
  },
];

/**
 * @const CROSLISTA_DE_DATOS
 * @description Lista de datos de ejemplo que incluye nombres de países y autorizaciones de programas.
 * @type {string[]}
 */
export const CROSLISTA_DE_DATOS: string[] = [
  'AFGANISTÁN (EMIRATO ISLÁMICO)',
  'ALBANIA (REPÚBLICA DE)',
  'ALEMANIA (REPÚBLICA FEDERAL DE)',
  'ANDORRA (PRINCIPADO DE)',
  '8-2024-AUTORIZACIÓN PROGRAMA NUEVO',
];

/**
 * @constante MENSAJE_DE_EXITO_ETAPA_UNO
 * @tipo {string}
 * @exportado
 * @descripcion
 * Mensaje de confirmación mostrado al usuario cuando la primera etapa del trámite se completa exitosamente.
 * 
 * @contenido_del_mensaje
 * - **Confirmación de registro**: Informa que la solicitud ha sido registrada exitosamente
 * - **Número temporal**: Proporciona el número de identificación temporal (202758511)
 * - **Aclaración legal**: Especifica que este número no tiene validez legal oficial
 * - **Propósito del número**: Explica que sirve únicamente para identificación interna
 * - **Proceso siguiente**: Indica que el folio oficial se asignará al firmar la solicitud
 * 
 * @importancia_comunicacion
 * Este mensaje es crucial porque:
 * - Tranquiliza al usuario confirmando que su acción fue exitosa
 * - Establece expectativas claras sobre el número temporal
 * - Evita confusiones sobre la validez legal del número mostrado
 * - Orienta sobre los próximos pasos del proceso
 * 
 * @aspectos_legales
 * - Aclara explícitamente que el número temporal NO tiene validez legal
 * - Informa sobre cuándo se asigna el folio oficial (al firmar)
 * - Protege tanto al usuario como a la institución de malentendidos
 * 
 * @contexto_uso
 * - Mostrado en modales de confirmación
 * - Presentado en páginas de resultado exitoso
 * - Incluido en notificaciones de estado del sistema
 * 
 * @experiencia_usuario
 * - Proporciona retroalimentación inmediata y clara
 * - Reduce ansiedad del usuario con confirmación explícita
 * - Educa sobre el proceso institucional
 * 
 * @numero_ejemplo
 * El número 202758511 es un ejemplo representativo que sigue
 * el patrón de numeración temporal del sistema.
 */
export const MENSAJE_DE_EXITO_ETAPA_UNO = `La solicitud ha quedado registrada con el número temporal _folio_. Este no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.`;

/**
 * mensaje de error.
 * @const
 * @type {string}
 */
export const ERROR_FORMA_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
    <strong>¡Error de registro! </strong> Faltan campos por capturar</div>
  </div>
</div>
`
/**
 * mensaje de error de llave de pago duplicada.
 * @const
 * @type {string}
 */
export const ERROR_LLAVE_DUPLICADA_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
    <strong> Corrija los siguientes errores: </strong> La llave de pago ingresada ha sido utilizada en otro trámite. Favor de verificar.</div>
  </div>
</div>
`