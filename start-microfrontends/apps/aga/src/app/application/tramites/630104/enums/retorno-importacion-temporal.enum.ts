/**
 * Constantes de expresiones regulares utilizadas en la validación de todos los formularios.
 * @constant {RegExp} REGEX_CORREO_ELECTRONICO - Validación para direcciones de correo electrónico.
 * @constant {RegExp} REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL - Validación para evitar espacios al inicio o final del texto.
 * @constant {RegExp} REGEX_POSTAL - Validación para códigos postales.
 * @constant {RegExp} REGEX_TELEFONO - Validación para números telefónicos.
 */
import {
    REGEX_CORREO_ELECTRONICO,
    REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
    REGEX_POSTAL,
    REGEX_TELEFONO
} from "@libs/shared/data-access-user/src/tramites/constantes/regex.constants";

/**
 * Configuración para el campo de fecha límite estimada de retorno.
 * @property {string} labelNombre - Texto que se muestra como etiqueta del campo.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado para interacción.
 * @property {boolean} desactivado - Indica si el campo está desactivado por defecto.
 */
export const ESTIMADA_RETORNO = {
    labelNombre: 'Fecha límite estimada de retorno',
    required: true,
    habilitado: true,
    desactivado: true
};

/**
 * Configuración para el campo de fecha estimada de ingreso.
 * @property {string} labelNombre - Texto que se muestra como etiqueta del campo.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado para interacción.
 */

export const FECHA_ESTIMADA_DE_INGRESO = {
    labelNombre: 'Fecha estimada de ingreso',
    required: false,
    habilitado: true
};


/**
 * Definición de campos para el formulario de datos de mercancía.
 * Contiene los campos necesarios para la descripción y justificación de la mercancía a importar temporalmente.
 * @property {Array<Object>} - Lista de objetos que representan cada campo del formulario.
 * 
 * Los campos incluyen:
 * - Descripción general de la mercancía (textarea)
 * - Motivo o justificación de la importación temporal (textarea)
 * - Nombre comercial del artista o grupo musical (text)
 * - Observaciones (textarea)
 * - Lista detallada de la mercancía (textarea)
 * 
 * Cada campo incluye validadores para asegurar la correcta entrada de datos.
 */

export const FORMULARIO_DATOS_MERCANCIA = [
    {
        id: 'descripcionMercancia',
        labelNombre: 'Descripción general de la mercancía',
        campo: 'descripcionMercancia',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la descripción general de la mercancía.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'motivo',
        labelNombre: 'Motivo o justificación de la importación temporal',
        campo: 'motivo',
        clase: 'col-md-12 mt-3',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija el motivo o justificación de la importación temporal.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },

    {
        id: 'nombre',
        labelNombre: 'Nombre commercial del artista o grupo musical',
        campo: 'nombreComercial',
        clase: 'col-md-12 mt-3',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija el motivo o justificación de la importación temporal.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },

    {
        id: 'observaciones',
        labelNombre: 'Observaciones',
        campo: 'observaciones',
        clase: 'col-md-12 mt-3',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija el motivo o justificación de la importación temporal.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'listaMercancia',
        labelNombre: 'Lista detallada de la mercancía',
        campo: 'listaMercancia',
        clase: 'col-md-12 mt-3',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la lista detallada de la mercancía.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    }
];


/**
 * Definición de campos para el formulario de datos de solicitud.
 * Contiene campos relacionados con la aduana de entrada.
 * @property {Array<Object>} - Lista de objetos que representan cada campo del formulario.
 * 
 * Los campos incluyen:
 * - Aduana de ingreso (select-catalogos)
 * - Sección aduanera (select-catalogos)
 * 
 * La aduana de ingreso es obligatoria, mientras que la sección aduanera es opcional.
 */
export const FORMULARIO_DATOS_SOLICITUD = [
    {
        id: 'cveAduana',
        labelNombre: 'Aduana de ingreso',
        campo: 'cveAduana',
        clase: 'col-md-4',
        tipoInput: 'select-catalogos',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'cveSeccionAduanera',
        labelNombre: 'Sección aduanera',
        campo: 'cveSeccionAduanera',
        clase: 'col-md-4',
        tipoInput: 'select-catalogos',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
];

/**
 * Definición de campos para el formulario de fecha de importación.
 * Actualmente está vacío, preparado para futura implementación.
 * @property {Array<Object>} - Lista de objetos que representan cada campo del formulario.
 */
export const FORMULARIO_FECHA_IMPORTACION = [
    {
        id: 'fechaIngreso',
        labelNombre: 'Fecha estimada de ingreso',
        campo: 'fechaIngreso',
        clase: 'col-md-4',
        tipoInput: 'date',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '10/02/2025',
        marginTop: 4,
        habilitado: true
    },
    {
        id: 'fechaLimiteRetorno',
        labelNombre: 'Fecha limite estimada de retorno: ',
        campo: 'fechaLimiteRetorno',
        clase: 'col-md-4',
        tipoInput: 'date',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' }
        ],
        tooltipQuestionCircle: true,
        tooltipTxt: 'Fecha límite estimada de retorno' ,
        marcadorDePosicion: '',
        valorPredeterminado: '10/03/2025',
        marginTop: 4,
        habilitado: true
    }
];



/**
 * Definición de campos para el formulario de domicilio fiscal.
 * Contiene todos los campos necesarios para registrar un domicilio fiscal completo.
 * @property {Array<Object>} - Lista de objetos que representan cada campo del formulario.
 * 
 * Los campos incluyen:
 * - Calle (text, desactivado)
 * - Número exterior (text, desactivado)
 * - Número interior (text, desactivado)
 * - Código postal (text, desactivado)
 * - Colonia (text, desactivado)
 * - País (text, desactivado)
 * - Estado (text, desactivado)
 * - Localidad (text, desactivado)
 * - Municipio o alcaldía (text, desactivado)
 * - Teléfono (text, desactivado)
 * 
 * Todos los campos están en modo de solo lectura y son pre-completados con valores predeterminados.
 */


export const FORMULARIO_DOMICILIO_FISCAL = [
    {
        id: 'calle',
        labelNombre: 'Calle',
        campo: 'calle',
        clase: 'col-md-3',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la calle.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: 'LIBERTAD',
        marginTop: 0
    },
    {
        id: 'numeroExterior',
        labelNombre: 'Número y/o letra exterior',
        campo: 'numeroExterior',
        clase: 'col-md-3',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la numeroExterior.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: 'SN',
        marginTop: 0
    },
    {
        id: 'numeroInterior',
        labelNombre: 'Número interior',
        campo: 'numeroInterior',
        clase: 'col-md-3',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la numeroInterior.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },

    {
        id: 'codigoPostal',
        labelNombre: 'Código postal',
        campo: 'codigoPostal',
        clase: 'col-md-3',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la codigoPostal.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'colonia',
        labelNombre: 'Colonia',
        campo: 'colonia',
        clase: 'col-md-6',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la colonia.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: 'VICTORIA DE DURANGO CENTRO',
        marginTop: 0
    },
    {
        id: 'pais',
        labelNombre: 'País',
        campo: 'pais',
        clase: 'col-md-6',
        tipoInput: 'select-catalogos',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la pais.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: 'ESTADOS UNIDOS MEXICANOS',
        marginTop: 0
    },

    {
        id: 'td_estadoLocalidad_representante_rep',
        labelNombre: 'Estado',
        campo: 'td_estadoLocalidad_representante_rep',
        clase: 'col-md-6',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la td_estadoLocalidad_representante_rep.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: 'DURANGO',
        marginTop: 0
    },
    {
        id: 'td_estadoLocalidad',
        labelNombre: 'Localidad',
        campo: 'estadoLocalidad',
        clase: 'col-md-6',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la estadoLocalidad.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: 'VICTORIA DE DURANGO',
        marginTop: 0
    },

    {
        id: 'delegacionMunicipio',
        labelNombre: 'Municipio o alcaldia',
        campo: 'delegacionMunicipio',
        clase: 'col-md-6',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la delegacionMunicipio.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: 'DURANGO',
        marginTop: 0
    },
    {
        id: 'telefono',
        labelNombre: 'Teléfono',
        campo: 'telefono',
        clase: 'col-md-6',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la telefono.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '618-256-2532',
        marginTop: 0
    },
];


/**
 * Definición de campos para el formulario de datos generales.
 * Contiene campos de información personal y comercial del solicitante.
 * @property {Array<Object>} - Lista de objetos que representan cada campo del formulario.
 * 
 * Los campos incluyen:
 * - Nombre(s) (text, desactivado)
 * - Primer Apellido (text, desactivado)
 * - Segundo Apellido (text, desactivado)
 * - Actividad económica preponderante (text, desactivado)
 * - RFC (text, desactivado)
 * - CURP (text, desactivado)
 * - Correo electrónico (text, desactivado)
 * 
 * Todos los campos están en modo de solo lectura y contienen validadores para asegurar la integridad de los datos.
 */

export const FORMULARIO_DATOS_GENERALES = [
    {
        id: 'trNombres',
        labelNombre: 'Nombre(s)',
        campo: 'nombre',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la nombre.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: 'EUROFOODS DE MEXICO',
        marginTop: 0
    },

    {
        id: 'apellidoPaterno',
        labelNombre: 'Primer Apellido',
        campo: 'apellidoPaterno',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la apellidoPaterno.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: 'GONZALEZ',
        marginTop: 0
    },
    {
        id: 'segundoApellido',
        labelNombre: 'Segundo Apellido',
        campo: 'segundoApellido',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la segundoApellido.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: 'PINAL',
        marginTop: 0
    },
    {
        id: 'descripcionGiro',
        labelNombre: 'Actividad económica preponderante',
        campo: 'descripcionGiro',
        clase: 'col-md-12',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la descripcionGiro.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: 'Consultorios de medicina general pertenecientes al sector privado que cuenten con título de médico conforme a las leyes',
        marginTop: 0
    },
    {
        id: 'rfc',
        labelNombre: 'RFC',
        campo: 'rfc',
        clase: 'col-md-3',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la rfc.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: 'MAVL621207C95',
        marginTop: 0
    },
    {
        id: 'curpolicitante',
        labelNombre: 'Clave Única de Registro de Población',
        campo: 'curp',
        clase: 'col-md-5',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la curp.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: 'MAVL621207HDGRLS06',
        marginTop: 0
    },
    {
        id: 'correoElectronico',
        labelNombre: 'Correo electrónico',
        campo: 'correoElectronico',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: true,
        soloLectura: true,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_CORREO_ELECTRONICO, mensaje: 'Por favor, escriba una dirección de correo válida.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 5
    },
]

/**
 * Definición de campos para el formulario de dirección del propietario.
 * Contiene todos los campos necesarios para registrar la dirección del propietario de la mercancía.
 * @property {Array<Object>} - Lista de objetos que representan cada campo del formulario.
 * 
 * Los campos incluyen:
 * - Calle (text)
 * - Número exterior (number)
 * - Número interior (number)
 * - País (select-catalogos)
 * - Estado y Localidad (text)
 * - Correo electrónico (text)
 * - Teléfono (text)
 * - Código postal (text)
 * 
 * Incluye validadores para cada campo, como REGEX_CORREO_ELECTRONICO, REGEX_TELEFONO y REGEX_POSTAL.
 */

export const FORMULARIO_DATOS_PROPIETARIO_DIRECCION = [

    {
        id: 'calle',
        labelNombre: 'Calle',
        campo: 'calle',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la calle.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'numeroExterior',
        labelNombre: 'Número exterior',
        campo: 'numeroExterior',
        clase: 'col-md-4',
        tipoInput: 'number',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'numeroInterior',
        labelNombre: 'Número interior',
        campo: 'numeroInterior',
        clase: 'col-md-4',
        tipoInput: 'number',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'pais',
        labelNombre: 'País',
        campo: 'pais',
        clase: 'col-md-4',
        tipoInput: 'select-catalogos',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 4
    },
    {
        id: 'estadoLocalidad',
        labelNombre: 'Estado y Localidad',
        campo: 'estadoLocalidad',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija el estado y localidad.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 4
    },
    {
        id: '',
        labelNombre: '',
        campo: '',
        clase: 'col-md-4',
        tipoInput: '',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'correoElectronico',
        labelNombre: 'Correo electrónico',
        campo: 'correoElectronico',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_CORREO_ELECTRONICO, mensaje: 'Por favor, escriba una dirección de correo válida.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 4
    },
    {
        id: 'telefono',
        labelNombre: 'Teléfono',
        campo: 'telefono',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_TELEFONO, mensaje: 'Por favor, corrija el teléfono.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 4
    },
    {
        id: 'codigoPostal',
        labelNombre: 'Código postal',
        campo: 'codigoPostal',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_POSTAL, mensaje: 'Debe contener sólo 5 números.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 4
    }
];


/**
 * Definición de campos para el formulario de nombre del propietario.
 * Contiene campos para registrar el nombre completo o razón social del propietario.
 * @property {Array<Object>} - Lista de objetos que representan cada campo del formulario.
 * 
 * Los campos incluyen:
 * - Nombre(s) (text)
 * - Apellido paterno (text)
 * - Apellido materno (text)
 * - Denominación o razón social (text)
 * 
 * Los campos obligatorios son nombre, apellido paterno y razón social, con validadores para evitar espacios al inicio o final.
 */

export const FORMULARIO_DATOS_PROPIETARIO_NOMBRE = [
    {
        id: 'nombre',
        labelNombre: 'Nombre(s)',
        campo: 'nombre',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija el nombre.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'apellidoPaterno',
        labelNombre: 'Apellido paterno',
        campo: 'apellidoPaterno',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija el apellido paterno.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'apellidoMaterno',
        labelNombre: 'Apellido materno',
        campo: 'apellidoMaterno',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija el apellido materno.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'razonSocial',
        labelNombre: 'Denominación o razón social',
        campo: 'razonSocial',
        clase: 'col-md-8',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la denominación o razón social.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
    }
];


/**
 * Definición de campos para el formulario de dirección del representante.
 * Contiene todos los campos necesarios para registrar la dirección completa del representante legal.
 * @property {Array<Object>} - Lista de objetos que representan cada campo del formulario.
 * 
 * Los campos incluyen:
 * - Denominación o razón social (text)
 * - Calle (text)
 * - Número exterior (number)
 * - Número interior (number)
 * - País (select-catalogos, desactivado)
 * - Entidad federativa (text)
 * - Municipio o delegación (select-catalogos)
 * - Localidad (select-catalogos)
 * - Colonia (select-catalogos)
 * - Correo electrónico (text)
 * - Teléfono (text)
 * - Código postal (text)
 * 
 * Incluye validadores específicos para cada tipo de campo utilizando las constantes de expresiones regulares.
 */
export const FORMULARIO_TIPO_REPRESENTANTE_DIRECCION = [
    {
        id: 'razonSocial',
        labelNombre: 'Denominación o razón social',
        campo: 'razonSocial',
        clase: 'col-md-12',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la denominación o razón social.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
    },
    {
        id: 'calle',
        labelNombre: 'Calle',
        campo: 'calle',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la calle.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'numeroExterior',
        labelNombre: 'Número exterior',
        campo: 'numeroExterior',
        clase: 'col-md-4',
        tipoInput: 'number',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'numeroInterior',
        labelNombre: 'Número interior',
        campo: 'numeroInterior',
        clase: 'col-md-4',
        tipoInput: 'number',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'pais',
        labelNombre: 'País',
        campo: 'pais',
        clase: 'col-md-6',
        tipoInput: 'select-catalogos',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 4
    },
     {
        id: '',
        labelNombre: '',
        campo: '',
        clase: 'col-md-6',
        tipoInput: '',
        desactivado: false,
        soloLectura: false,
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 4
    },
    {
        id: 'correoElectronico',
        labelNombre: 'Correo electrónico',
        campo: 'correoElectronico',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_CORREO_ELECTRONICO, mensaje: 'Por favor, escriba una dirección de correo válida.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 4
    },
    {
        id: 'telefono',
        labelNombre: 'Teléfono',
        campo: 'telefono',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_TELEFONO, mensaje: 'Por favor, corrija el teléfono.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 4
    },
    {
        id: 'codigoPostal',
        labelNombre: 'Código postal',
        campo: 'codigoPostal',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_POSTAL, mensaje: 'Debe contener sólo 5 números.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 4
    }
];


/**
 * Definición de campos para el formulario de nombre del representante.
 * Contiene campos para registrar los datos personales del representante legal.
 * @property {Array<Object>} - Lista de objetos que representan cada campo del formulario.
 * 
 * Los campos incluyen:
 * - RFC (text)
 * - CURP (text)
 * - Nombre(s) (text)
 * - Apellido paterno (text)
 * - Apellido materno (text)
 * 
 * Los campos obligatorios son nombre y apellido paterno, mientras que el apellido materno, RFC y CURP son opcionales.
 */
export const FORMULARIO_TIPO_REPRESENTANTE_NOMBRE = [
    {
        id: 'td_rfc_representante',
        labelNombre: 'R F C',
        campo: 'datosRepresentanteRFC',
        clase: 'col-md-6',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija el nombre.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'td_curp_representantev',
        labelNombre: 'C U R P',
        campo: 'datosRepresentantecurp',
        clase: 'col-md-6',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija el datosRepresentantecurp.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'nombre',
        labelNombre: 'Nombre(s)',
        campo: 'nombre',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija el nombre.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'apellidoPaterno',
        labelNombre: 'Apellido paterno',
        campo: 'apellidoPaterno',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija el apellido paterno.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'apellidoMaterno',
        labelNombre: 'Apellido materno',
        campo: 'apellidoMaterno',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija el apellido materno.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
];
