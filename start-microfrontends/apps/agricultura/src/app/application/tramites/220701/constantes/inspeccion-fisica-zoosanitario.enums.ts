/**
 * Pasos del trámite.
 * Define los pasos necesarios para completar el trámite, incluyendo su estado de activación y finalización.
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
 * Textos de instrucciones generales.
 * Contiene las instrucciones para el usuario sobre cómo proceder con el trámite.
 */
export const TEXTOS = {
    INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, seleccionalo y elíminalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo seleccionalo de la lista y presiona "Agregar nuevo".</p>`
};

/**
 * Textos de requisitos.
 * Contiene instrucciones específicas para adjuntar documentos y requisitos adicionales.
 */
export const TEXTOS_REQUISITOS = {
    INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, seleccionalo y elimínalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo seleccionalo de la lista y presiona "Agregar nuevo".</p>`,
    ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
};

/**
 * Mensaje de éxito para la etapa uno del trámite.
 * Proporciona información al usuario sobre el registro exitoso de la solicitud.
 */
export const MENSAJE_DE_ÉXITO_ETAPA_UNO = `La solicitud ha quedado registrada con el número temporal 202758511. Este no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.`;

/**
 * Configuración para el solicitante físico nacional en el trámite zoosanitario.
 * Define los campos y validaciones necesarias.
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
    }
];

/**
 * Configuración para la fecha de pago.
 * Define las propiedades del campo de fecha de pago.
 */
export const FECHA_DE_PAGO = {
    labelNombre: 'Fecha de pago',
    required: true,
    habilitado: false,
};

/**
 * Mensaje de alerta para las tablas obligatorias.
 * Proporciona información al usuario sobre la obligatoriedad de ciertos registros.
 */
export const TERCERO_TEXTO_DE_ALERTA = 'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';

/**
 * Identificador único del usuario.
 * @constant {number}
 */
export const ID_DE_USUARIO = 21;

/**
 * Instrucción para realizar doble clic en la tabla.
 * Proporciona información al usuario sobre cómo interactuar con la tabla.
 * @constant {string}
 */
export const INSTRUCCION_DOBLE_CLIC = 'AI dar clic en el boton "Cargar" se creara una nueva solicitud con los mismos datos de la solicitud 202766690';

/**
 * Instrucción obligatoria para las tablas.
 * Define las instrucciones necesarias para las tablas marcadas con un asterisco.
 * @constant {string}
 */
export const MANDATORY_INSTRUCTION = 'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';

/**
 * Configuración para la fecha de expedición de la factura.
 * Define las propiedades del campo de fecha de expedición.
 */
export const EXPEDICION_FACTURA_FECHA = {
    labelNombre: 'Fecha de pago:',
    required: false,
    habilitado: false,
};


/**
 * Configuración para la fecha de expedición de la factura.
 * Define las propiedades del campo de fecha de expedición.
 */
export const PAGODEDARECHOS_FACTURA_FECHA = {
    labelNombre: 'Fecha de pago',
    required: true,
    habilitado: false,
};
/**
 * Opciones para el tipo de radio.
 * Define las opciones disponibles para los botones de radio.
 */
export const TIPO_RADIO = [
    {
        label: "No",
        value: "No"
    },
    {
        label: "Sí",
        value: "Si"
    }
];

/**
 * Configuración de validación para las secciones del trámite 220701.
 * Define las validaciones necesarias para cada paso del trámite.
 */
export const SECCIONES_TRAMITE_220701 = {
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