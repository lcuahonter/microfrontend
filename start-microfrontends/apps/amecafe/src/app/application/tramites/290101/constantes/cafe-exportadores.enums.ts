/**
 * Constantes utilizadas en el trámite 290101 para la configuración de pasos, mensajes y datos relacionados con el procedimiento de café exportadores.
 *
 * Este archivo contiene configuraciones que definen los pasos del trámite, textos de instrucciones, configuraciones de formularios,
 * y constantes específicas para el manejo de solicitudes de exportación de café.
 */

/**
 * Configuración de los pasos del trámite 290101.
 *
 * Cada paso está representado por un objeto que contiene las siguientes propiedades:
 * - `indice`: Número del paso.
 * - `titulo`: Título descriptivo del paso.
 * - `activo`: Indica si el paso está activo.
 * - `completado`: Indica si el paso ha sido completado.
 *
 * @constant {Array<Object>}
 */
export const PASOS = [
    {
        /**
         * @property {number} indice
         * Índice del paso en el flujo.
         */
        indice: 1,

        /**
         * @property {string} titulo
         * Título descriptivo del paso.
         */
        titulo: 'Capturar solicitud',

        /**
         * @property {boolean} activo
         * Indica si el paso está activo.
         */
        activo: true,

        /**
         * @property {boolean} completado
         * Indica si el paso está completado.
         */
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
 * Textos de instrucciones generales para el trámite.
 *
 * Contiene las instrucciones principales que se muestran al usuario durante el proceso.
 *
 * @constant {Object}
 */
export const TEXTOS = {
    /**
     * @property {string} INSTRUCCIONES
     * Instrucciones HTML para el manejo de documentos en el trámite.
     */
    INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, seleccionalo y elíminalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo seleccionalo de la lista y presiona "Agregar nuevo".</p>`
};

/**
 * Textos específicos para la sección de requisitos del trámite.
 *
 * Contiene instrucciones detalladas para el manejo de documentos y adjuntos.
 *
 * @constant {Object}
 */
export const TEXTOS_REQUISITOS = {
    /**
     * @property {string} INSTRUCCIONES
     * Instrucciones HTML para el manejo de documentos requisitos.
     */
    INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, seleccionalo y elimínalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo seleccionalo de la lista y presiona "Agregar nuevo".</p>`,
    
    /**
     * @property {string} ADJUNTAR
     * Instrucciones para adjuntar nuevos documentos.
     */
    ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
};

/**
 * Mensaje de éxito que se muestra al completar la primera etapa del trámite.
 *
 * Contiene información sobre el número temporal asignado a la solicitud y su validez.
 *
 * @constant {string}
 */
export const MENSAJE_DE_ÉXITO_ETAPA_UNO = `La solicitud ha quedado registrada con el número temporal 202758511. Este no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.`
/**
 * Configuración de campos para solicitante físico nacional en trámites zoosanitarios.
 *
 * Define la estructura de los campos del formulario para personas físicas nacionales,
 * incluyendo validaciones, estilos y configuraciones de UI.
 *
 * @constant {Array<Object>}
 */
export const ZOOSANITARIO_SOLICITANTE_FISICA_NACIONAL = [
    {
        /**
         * @property {string} labelNombre - Etiqueta visible del campo
         * @property {string} campo - Nombre del campo en el modelo de datos
         * @property {string} class - Clases CSS para el estilo del campo
         * @property {string} tipo_input - Tipo de input HTML
         * @property {boolean} disabled - Si el campo está deshabilitado
         * @property {string} tooltip - Texto de ayuda emergente
         * @property {Array<string>} validators - Validadores aplicados al campo
         * @property {string} placeholder - Texto de marcador de posición
         */
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
 * Configuración del campo de fecha de pago.
 *
 * Define las propiedades para el campo de fecha de pago en el formulario.
 *
 * @constant {Object}
 */
export const FECHA_DE_PAGO = {
    /**
     * @property {string} labelNombre - Etiqueta visible del campo
     */
    labelNombre: 'Fecha de pago',
    
    /**
     * @property {boolean} required - Indica si el campo es obligatorio
     */
    required: true,
    
    /**
     * @property {boolean} habilitado - Indica si el campo está habilitado
     */
    habilitado: false,
};

/**
 * Texto de alerta para terceros sobre tablas obligatorias.
 *
 * Mensaje que informa al usuario sobre la obligatoriedad de completar ciertas tablas.
 *
 * @constant {string}
 */
export const TERCERO_TEXTO_DE_ALERTA = 'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';

/**
 * Identificador único del usuario.
 *
 * @constant {number}
 */
export const ID_DE_USUARIO = 21;

/**
 * Instrucción para el doble clic en la tabla de solicitudes.
 *
 * Define el texto de instrucción que se muestra al usuario cuando realiza doble clic
 * en una tabla, explicando que se creará una nueva solicitud con los mismos datos.
 *
 * @constant {string}
 */
export const INSTRUCCION_DOBLE_CLIC = 'AI dar clic en el boton "Cargar" se creara una nueva solicitud con los mismos datos de la solicitud 202766690';

/**
 * Instrucción obligatoria para tablas marcadas con asterisco.
 *
 * Define el mensaje que informa al usuario sobre la obligatoriedad de completar
 * las constantes que definen las tablas de instrucciones marcadas con asterisco.
 *
 * @constant {string}
 */
export const MANDATORY_INSTRUCTION = 'Se requieren las constantes que definen las tablas de instrucciones marcadas con un asterisco.';

/**
 * Configuración del campo de fecha de expedición de factura.
 *
 * Define las propiedades para el campo de fecha de expedición en el formulario.
 *
 * @constant {Object}
 */
export const EXPEDICION_FACTURA_FECHA = {
    /**
     * @property {string} labelNombre - Etiqueta visible del campo
     */
    labelNombre: 'Fecha de expedición de la factura:',
    
    /**
     * @property {boolean} required - Indica si el campo es obligatorio
     */
    required: true,
    
    /**
     * @property {boolean} habilitado - Indica si el campo está habilitado
     */
    habilitado: true,
};
/**
 * Opciones para campos de tipo radio button.
 *
 * Define las opciones disponibles para componentes de selección de tipo Sí/No.
 *
 * @constant {Array<Object>}
 */
export const TIPO_RADIO = [
    {
        /**
         * @property {string} label - Etiqueta visible de la opción
         * @property {string} value - Valor de la opción
         */
        label: "No",
        value: "No"
    },
    {
        label: "Sí",
        value: "Si"
    }
];

/**
 * Configuración de validaciones por sección del trámite 290101.
 *
 * Define qué secciones requieren validación en cada paso del trámite.
 *
 * @constant {Object}
 */
export const SECCIONES_TRAMITE_290101 = {
    /**
     * @property {Object} PASO_1 - Configuración de validaciones para el primer paso
     */
    PASO_1: {
        /**
         * @property {boolean} VALIDACION_SECCION_1 - Indica si la sección 1 requiere validación
         */
        VALIDACION_SECCION_1: false,
        
        /**
         * @property {boolean} VALIDACION_SECCION_2 - Indica si la sección 2 requiere validación
         */
        VALIDACION_SECCION_2: true,
    },
    
    /**
     * @property {Object} PASO_2 - Configuración de validaciones para el segundo paso
     */
    PASO_2: {
        /**
         * @property {boolean} VALIDACION_SECCION - Indica si la sección requiere validación
         */
        VALIDACION_SECCION: true,
    },
    
    /**
     * @property {Object} PASO_3 - Configuración de validaciones para el tercer paso
     */
    PASO_3: {
        /**
         * @property {boolean} requiereValidacion - Indica si el paso requiere validación
         */
        requiereValidacion: true,
    },
};