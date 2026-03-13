/**
 * Constantes utilizadas en el trámite IMMEX 80203 para la configuración de pasos, mensajes y datos relacionados con el procedimiento.
 *
 * Este archivo contiene configuraciones que definen los pasos del trámite, textos de instrucciones, mensajes de éxito,
 * configuraciones de formularios y validaciones específicas para el registro de solicitud de modalidad IMMEX.
 *
 * @fileoverview Constantes y enumeraciones para el trámite IMMEX de registro de solicitud de modalidad.
 * @module ImmexRegistroSolicitudModalityEnums
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 */

/**
 * Configuración de los pasos del trámite IMMEX.
 *
 * Cada paso está representado por un objeto que contiene las siguientes propiedades:
 * - `indice`: Número del paso en el flujo del trámite.
 * - `titulo`: Título descriptivo del paso.
 * - `activo`: Indica si el paso está activo actualmente.
 * - `completado`: Indica si el paso ha sido completado.
 *
 * @constant {Array<Object>}
 * @export
 * @readonly
 * @see {@link https://vucem.gob.mx|VUCEM}
 * @since 1.0.0
 * @example
 * // Output: 'Capturar solicitud'
 * @example
 * const pasoActivo = PASOS.find(paso => paso.activo);
 */
export const PASOS = [
    {
        /**
         * @property {number} indice
         * Índice del paso en el flujo del trámite IMMEX.
         */
        indice: 1,

        /**
         * @property {string} titulo
         * Título descriptivo del primer paso del trámite.
         */
        titulo: 'Capturar solicitud',

        /**
         * @property {boolean} activo
         * Indica si el paso está activo actualmente.
         */
        activo: true,

        /**
         * @property {boolean} completado
         * Indica si el paso está completado.
         */
        completado: true,
    },
    {
        /**
         * @property {number} indice
         * Índice del segundo paso en el flujo del trámite.
         */
        indice: 2,

        /**
         * @property {string} titulo
         * Título descriptivo del segundo paso del trámite.
         */
        titulo: 'Anexar necesarios',

        /**
         * @property {boolean} activo
         * Indica si el segundo paso está activo.
         */
        activo: false,

        /**
         * @property {boolean} completado
         * Indica si el segundo paso está completado.
         */
        completado: false,
    },
    {
        /**
         * @property {number} indice
         * Índice del tercer paso en el flujo del trámite.
         */
        indice: 3,

        /**
         * @property {string} titulo
         * Título descriptivo del tercer paso del trámite.
         */
        titulo: 'Firmar solicitud',

        /**
         * @property {boolean} activo
         * Indica si el tercer paso está activo.
         */
        activo: false,

        /**
         * @property {boolean} completado
         * Indica si el tercer paso está completado.
         */
        completado: false,
    },
];

/**
 * Textos de instrucciones generales para el trámite IMMEX.
 *
 * Contiene las instrucciones básicas que se muestran al usuario durante el proceso del trámite,
 * incluyendo información sobre documentos obligatorios y procedimientos de anexado.
 *
 * @constant {Object}
 * @export
 * @readonly
 * @namespace TEXTOS
 * @since 1.0.0
 * @example
 * // Output: HTML con las instrucciones
 */
export const TEXTOS = {
    /**
     * @property {string} INSTRUCCIONES
     * Instrucciones HTML generales para el manejo de documentos en el trámite.
     */
    INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, seleccionalo y elíminalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo seleccionalo de la lista y presiona "Agregar nuevo".</p>`
};

/**
 * Textos específicos relacionados con los requisitos del trámite IMMEX.
 *
 * Contiene instrucciones detalladas y textos de ayuda para el manejo de requisitos
 * y documentos en diferentes secciones del trámite IMMEX.
 *
 * @constant {Object}
 * @export
 * @readonly
 * @namespace TEXTOS_REQUISITOS
 * @since 1.0.0
 * @example
 * @example
 * document.getElementById('help').innerHTML = TEXTOS_REQUISITOS.ADJUNTAR;
 */
export const TEXTOS_REQUISITOS = {
    /**
     * @property {string} INSTRUCCIONES
     * Instrucciones específicas para el manejo de requisitos y documentos.
     */
    INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, seleccionalo y elimínalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo seleccionalo de la lista y presiona "Agregar nuevo".</p>`,

    /**
     * @property {string} ADJUNTAR
     * Texto de ayuda para adjuntar nuevos documentos al trámite.
     */
    ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
};

/**
 * Mensaje de éxito de la etapa uno del trámite IMMEX.
 *
 * Contiene el texto que se muestra al usuario después de completar exitosamente
 * la primera etapa del trámite, incluyendo información sobre el número temporal
 * asignado y su validez legal.
 *
 * @constant {string}
 * @export
 * @readonly
 * @since 1.0.0
 * @example
 * alert(MENSAJE_DE_ÉXITO_ETAPA_UNO);
 * @example
 * const mensaje = MENSAJE_DE_ÉXITO_ETAPA_UNO;
 */
export const MENSAJE_DE_ÉXITO_ETAPA_UNO = `La solicitud ha quedado registrada con el número temporal 202758511. Este no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.`

/**
 * Configuración de campos del formulario para solicitantes físicos nacionales.
 *
 * Define la estructura y configuración de los campos del formulario específicamente
 * para solicitantes físicos nacionales en el trámite zoosanitario, incluyendo
 * validaciones, estilos CSS y propiedades de cada campo.
 *
 * @constant {Array<Object>}
 * @export
 * @readonly
 * @since 1.0.0
 * @example
 * const campos = ZOOSANITARIO_SOLICITANTE_FISICA_NACIONAL;
 * @example
 * const rfcField = ZOOSANITARIO_SOLICITANTE_FISICA_NACIONAL.find(field => field.campo === 'rfc');
 */
export const ZOOSANITARIO_SOLICITANTE_FISICA_NACIONAL = [
    {
        /**
         * @property {string} labelNombre
         * Etiqueta descriptiva del campo RFC.
         */
        labelNombre: 'Registro federal de contribuyentes:',

        /**
         * @property {string} campo
         * Nombre del campo en el modelo de datos.
         */
        campo: 'rfc',

        /**
         * @property {string} class
         * Clase CSS aplicada al campo para diseño responsivo.
         */
        class: 'col-md-4',

        /**
         * @property {string} tipo_input
         * Tipo de entrada HTML del campo.
         */
        tipo_input: 'text',

        /**
         * @property {boolean} disabled
         * Indica si el campo está deshabilitado para edición.
         */
        disabled: true,

        /**
         * @property {string} tooltip
         * Texto de ayuda mostrado en el tooltip del campo.
         */
        tooltip: 'Registro federal de contribuyentes:',

        /**
         * @property {Array<string>} validators
         * Array de validadores aplicados al campo.
         */
        validators: ['required'],

        /**
         * @property {string} placeholder
         * Texto de marcador de posición del campo.
         */
        placeholder: '',
    },
    {
        /**
         * @property {string} labelNombre
         * Etiqueta descriptiva del campo de denominación o razón social.
         */
        labelNombre: 'Denominación o razón social:',

        /**
         * @property {string} campo
         * Nombre del campo en el modelo de datos.
         */
        campo: 'nombreRazonSocial',

        /**
         * @property {string} class
         * Clase CSS aplicada al campo para diseño responsivo.
         */
        class: 'col-md-8',

        /**
         * @property {string} tipo_input
         * Tipo de entrada HTML del campo.
         */
        tipo_input: 'text',

        /**
         * @property {boolean} disabled
         * Indica si el campo está deshabilitado para edición.
         */
        disabled: true,

        /**
         * @property {string} tooltip
         * Texto de ayuda mostrado en el tooltip del campo.
         */
        tooltip: 'Denominación o razón social',

        /**
         * @property {Array<string>} validators
         * Array de validadores aplicados al campo.
         */
        validators: ['required'],

        /**
         * @property {string} placeholder
         * Texto de marcador de posición del campo.
         */
        placeholder: '',
    },
    {
        /**
         * @property {string} labelNombre
         * Etiqueta descriptiva del campo de actividad económica.
         */
        labelNombre: 'Actividad económica preponderante:',

        /**
         * @property {string} campo
         * Nombre del campo en el modelo de datos.
         */
        campo: 'actEconomica',

        /**
         * @property {string} class
         * Clase CSS aplicada al campo para diseño responsivo.
         */
        class: 'col-md-12',

        /**
         * @property {string} tipo_input
         * Tipo de entrada HTML del campo.
         */
        tipo_input: 'text',

        /**
         * @property {boolean} disabled
         * Indica si el campo está deshabilitado para edición.
         */
        disabled: true,

        /**
         * @property {Array<string>} validators
         * Array de validadores aplicados al campo.
         */
        validators: ['required'],

        /**
         * @property {string} placeholder
         * Texto de marcador de posición del campo.
         */
        placeholder: '',
    },
    {
        /**
         * @property {string} labelNombre
         * Etiqueta descriptiva del campo de correo electrónico.
         */
        labelNombre: 'Correo electrónico',

        /**
         * @property {string} campo
         * Nombre del campo en el modelo de datos.
         */
        campo: 'correo',

        /**
         * @property {string} class
         * Clase CSS aplicada al campo para diseño responsivo.
         */
        class: 'col-md-4',

        /**
         * @property {string} tipo_input
         * Tipo de entrada HTML del campo.
         */
        tipo_input: 'text',

        /**
         * @property {boolean} disabled
         * Indica si el campo está deshabilitado para edición.
         */
        disabled: true,

        /**
         * @property {Array<string>} validators
         * Array de validadores aplicados al campo.
         */
        validators: ['required'],

        /**
         * @property {string} placeholder
         * Texto de marcador de posición del campo.
         */
        placeholder: '',
    }
];

/**
 * Configuración para el campo de fecha de pago en el formulario.
 *
 * Define las propiedades y configuración específica para el campo
 * de fecha de pago utilizado en los formularios del trámite IMMEX.
 *
 * @constant {Object}
 * @export
 * @readonly
 * @since 1.0.0
 * @example
 * const config = FECHA_DE_PAGO;
 * @example
 * if (FECHA_DE_PAGO.required) {
 *   // Campo obligatorio
 * }
 */
export const FECHA_DE_PAGO = {
    /**
     * @property {string} labelNombre
     * Etiqueta descriptiva del campo de fecha de pago.
     */
    labelNombre: 'Fecha de pago',

    /**
     * @property {boolean} required
     * Indica si el campo es obligatorio para el formulario.
     */
    required: true,

    /**
     * @property {boolean} habilitado
     * Indica si el campo está habilitado para edición.
     */
    habilitado: false,
};

/**
 * Texto de alerta sobre tablas obligatorias.
 *
 * Mensaje informativo que se muestra al usuario para indicar cuáles
 * tablas son obligatorias y requieren al menos un registro para
 * completar el trámite IMMEX correctamente.
 *
 * @constant {string}
 * @export
 * @readonly
 * @since 1.0.0
 * @example
 * document.querySelector('.alert').textContent = TERCERO_TEXTO_DE_ALERTA;
 * @example
 * console.warn(TERCERO_TEXTO_DE_ALERTA);
 */
export const TERCERO_TEXTO_DE_ALERTA = 'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';

/**
 * Identificador único del usuario del sistema.
 *
 * Constante que define el identificador numérico único asignado
 * al usuario específico para operaciones y seguimiento en el sistema VUCEM.
 *
 * @constant {number}
 * @export
 * @readonly
 * @since 1.0.0
 * @default 21
 * @example
 * const userId = ID_DE_USUARIO;
 * @example
 * if (currentUser.id === ID_DE_USUARIO) {
 *   // Usuario específico
 * }
 */
export const ID_DE_USUARIO = 21;

/**
 * Encabezados de las columnas para la tabla de permisos IMMEX.
 *
 * Array que define los títulos de las columnas utilizadas en la tabla
 * de visualización de permisos IMMEX, incluyendo información sobre números
 * de permiso, fracciones arancelarias y fechas de vigencia.
 *
 * @constant {Array<string>}
 * @export
 * @readonly
 * @since 1.0.0
 * @example
 * const headers = PERMISO_IMMEX;
 * headers.forEach((header, index) => console.log(`${index}: ${header}`));
 * @example
 * const tableHeaders = PERMISO_IMMEX.map(header => `<th>${header}</th>`);
 */
export const PERMISO_IMMEX = [
    'No.',
    'Número permiso',
    'Fracción arancelaria',
    'Descripción de la TIGIE',
    'UMT',
    'Cantidad por periodo #',
    'Fetcha inicio vigencia',
];

/**
 * Encabezados de las columnas para la tabla de fracciones arancelarias.
 *
 * Array que define los títulos de las columnas utilizadas en la tabla
 * de visualización de fracciones arancelarias, incluyendo información sobre
 * mercancías de importación y descripciones comerciales de exportación.
 *
 * @constant {Array<string>}
 * @export
 * @readonly
 * @since 1.0.0
 * @example
 * const columnHeaders = FRACCION_ARANCELARIA;
 * @example
 * const firstHeader = FRACCION_ARANCELARIA[0]; // 'No.'
 */
export const FRACCION_ARANCELARIA = [
    'No.',
    'Fracción arancelaria',
    'Mercancía de importación',
    'UMT',
    'Descripción de la TIGIE',
    'Descripción commercial de la exportación', 
];

/**
 * Encabezados de las columnas para la tabla de NICO.
 *
 * Array que define los títulos de las columnas utilizadas en la tabla
 * de visualización de códigos NICO (Nomenclatura de Identificación de Commodities),
 * incluyendo el código y su descripción correspondiente.
 *
 * @constant {Array<string>}
 * @export
 * @readonly
 * @since 1.0.0
 * @example
 * const nicoHeaders = NICO;
 * console.log(nicoHeaders); // ['Nico', 'Descripción']
 * @example
 * NICO.forEach(header => console.log(header));
 */
export const NICO = [
    'Nico',
    'Descripción',
];

/**
 * Configuración de las secciones y validaciones para cada paso del trámite IMMEX 80203.
 *
 * Objeto que define la configuración de validaciones específicas para cada paso
 * del trámite IMMEX, incluyendo configuraciones por sección y requisitos
 * de validación para completar correctamente el proceso.
 *
 * @constant {Object}
 * @export
 * @readonly
 * @namespace SECCIONES_TRAMITE_80203
 * @since 1.0.0
 * @example
 * const config = SECCIONES_TRAMITE_80203;
 * if (config.PASO_1.VALIDACION_SECCION_2) {
 *   // Validar sección 2 del paso 1
 * }
 * @example
 * const paso3Config = SECCIONES_TRAMITE_80203.PASO_3;
 */
export const SECCIONES_TRAMITE_80203 = {
    /**
     * @property {Object} PASO_1
     * Configuración de validaciones para el primer paso del trámite.
     */
    PASO_1: {
        /**
         * @property {boolean} VALIDACION_SECCION_1
         * Indica si la primera sección del paso 1 requiere validación.
         */
        VALIDACION_SECCION_1: false,

        /**
         * @property {boolean} VALIDACION_SECCION_2
         * Indica si la segunda sección del paso 1 requiere validación.
         */
        VALIDACION_SECCION_2: true,
    },

    /**
     * @property {Object} PASO_2
     * Configuración de validaciones para el segundo paso del trámite.
     */
    PASO_2: {
        /**
         * @property {boolean} VALIDACION_SECCION
         * Indica si el segundo paso requiere validación de sección.
         */
        VALIDACION_SECCION: true,
    },

    /**
     * @property {Object} PASO_3
     * Configuración de validaciones para el tercer paso del trámite.
     */
    PASO_3: {
        /**
         * @property {boolean} requiereValidacion
         * Indica si el tercer paso requiere validación general.
         */
        requiereValidacion: true,
    },
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
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      <p>Corrija los siguientes errores:</p>
      <p> 1. - (Cambio de modalidad) es un campo requerido</p>
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
export const ERROR_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
    <p>Corrija los siguientes errores:</p>
    <p>1. (Las fracciones de exportación son obligatorias para cada permiso) es un campo requerido</p>
    <p>2. (Los datos del detalle de la mercancía) es un campo requerido</p>
    </div>
  </div>
</div>
`
/**
 * @const ERROR_FRACCION_ALERT
 * @description Mensaje de error HTML para cuando no se han agregado fracciones de exportación requeridas.
 * Contiene una estructura HTML con clases Bootstrap para mostrar el error de validación
 * centrado al usuario cuando debe agregar al menos una fracción de exportación para cada permiso IMMEX.
 * 
 * @type {string}
 * @example
 * // Se utiliza para mostrar errores de validación cuando faltan fracciones de exportación
 * this.errorMessage = ERROR_FRACCION_ALERT;
 */
export const ERROR_FRACCION_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
    <p>Corrija los siguientes errores:</p>
    <p>1. (Las fracciones de exportación son obligatorias para cada permiso) es un campo requerido</p>
    </div>
  </div>
</div>
`
/**
 * @const ERROR_DETALLE_ALERT
 * @description Mensaje de error HTML para cuando no se han completado los datos del detalle de la mercancía.
 * Contiene una estructura HTML con clases Bootstrap para mostrar el error de validación
 * centrado al usuario cuando debe completar la información detallada de la mercancía en el formulario.
 * 
 * @type {string}
 * @example
 * // Se utiliza para mostrar errores de validación cuando faltan datos del detalle de mercancía
 * this.errorMessage = ERROR_DETALLE_ALERT;
 */
export const ERROR_DETALLE_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
    <p>Corrija los siguientes errores:</p>
    <p>1. (Los datos del detalle de la mercancía) es un campo requerido</p>
    </div>
  </div>
</div>
`

export const ERROR_NICO = `
<div class="d-flex justify-content-center text-center">
  <div class="col-md-12">
    Debe contener al menos un nico.
  </div>
</div>
`;

export const ERROR_REQ_MERCANCIA = `
<div class="d-flex justify-content-center text-center">
  <div class="col-md-12">
    Los campos marcados con (*) son requeridos.
  </div>
</div>
`;

export const ERROR_CANTIDAD = `
<div class="d-flex justify-content-center text-center">
  <div class="col-md-12">
    Las cantidades deben tener un valor mayor a cero.
  </div>
</div>
`;

export const ERROR_CAPACIDAD = `
<div class="d-flex justify-content-center text-center">
  <div class="col-md-12">
    La capacidad instalada por periodo debe ser menor o igual a la cantidad anual.
  </div>
</div>
`;

export const ERROR_CANDIDAD_POR_PERIODO = `
<div class="d-flex justify-content-center text-center">
  <div class="col-md-12">
    La cantidad por periodo no puede ser mayor a la cantida anual dividida entre 3.
  </div>
</div>
`;