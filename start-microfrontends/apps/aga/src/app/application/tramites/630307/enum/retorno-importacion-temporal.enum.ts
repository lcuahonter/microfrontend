/**
 * Importación de constantes de expresiones regulares utilizadas para validaciones en los formularios.
 */
import { 
    REGEX_ALFANUMERICO_CON_ESPACIOS,
    REGEX_CORREO_ELECTRONICO, 
    REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, 
    REGEX_PATRON_ALFANUMERICO, 
    REGEX_POSTAL_12,
    REGEX_SOLO_NUMEROS, 
    REGEX_TELEFONO,
    REG_X,
  } from "@libs/shared/data-access-user/src/tramites/constantes/regex.constants";
/**
 * PASOS_REGISTRO
 * Define los pasos del registro para el trámite 630303.
 * Cada paso contiene un índice, un título, y estados de actividad y completitud.
 */
export const PASOS_REGISTRO = [
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
    }
];

/**
 * FORMULARIO_DATOS_MERCANCIA
 * Define los campos del formulario para la mercancía.
 * Cada campo contiene un ID, nombre de etiqueta, campo, clase, tipo de input, validadores y otros atributos.
 */

export const FORMULARIO_DATOS_MERCANCIA = [
    {
        id: 'marca',
        labelNombre: 'Marca',
        campo: 'marca',
        clase: 'col-md-6',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_ALFANUMERICO_CON_ESPACIOS, mensaje: 'Por favor, escribe un número entero válido.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        maxlength: 100
    },
    {
        id: 'modelo',
        labelNombre: 'Modelo',
        campo: 'modelo',
        clase: 'col-md-6',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_ALFANUMERICO_CON_ESPACIOS, mensaje: 'Por favor, escribe un número entero válido.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        maxlength: 50
    },
    {
        id: 'numeroDeSerie',
        labelNombre: 'Número de serie',
        campo: 'numeroDeSerie',
        clase: 'col-md-6',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_SOLO_NUMEROS, mensaje: 'Por favor, escribe un número entero válido.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        maxlength: 100
    },
    {
        id: 'numeroDeMotor',
        labelNombre: 'Número de motor',
        campo: 'numeroDeMotor',
        clase: 'col-md-6',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_SOLO_NUMEROS, mensaje: 'Por favor, escribe un número entero válido.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        maxlength: 100
    },
    {
        id: 'descripcionMercancia',
        labelNombre: 'Descripción adicional de la mercancía',
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
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija el motivo o justificación de la importación temporal.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 4
    },
   
];

/**
 * FORMULARIO_DATOS_SOLICITUD
 * Define los campos del formulario para la solicitud.
 * Cada campo contiene un ID, nombre de etiqueta, campo, clase, tipo de input, validadores y otros atributos.
 **/

export const FORMULARIO_DATOS_SOLICITUD = [
    {
        id: 'cveAduana',
        labelNombre: 'Aduana de retorno',
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
        labelNombre: 'Sección aduanera de retorno',
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
        id: 'fechaLimiteRetorno',
        labelNombre: 'Fecha límite estimada de retorno',
        campo: 'fechaLimiteRetorno',
        clase: 'col-md-4',
        tipoInput: 'date',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado:'10/02/2025',
        marginTop: 0,
        habilitado: true
    },
    {
        id: 'cuentaProrroga',
        labelNombre: 'Cuenta con prórroga',
        campo: 'cuentaProrroga',
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
    }
];

/**
 * FORMULARIO_DATOS_PROPIETARIO_DIRECCION
 * Este formulario define los campos relacionados con la dirección del propietario.
 * Cada campo incluye un identificador único (ID), el nombre de la etiqueta, el nombre del campo,
 * la clase CSS, el tipo de input, validadores y otros atributos necesarios para la validación y presentación.
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
            { tipo: 'pattern', valor:REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la calle.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        row:2,
        maxlength: 80
    },
    {
        id: 'numeroExterior',
        labelNombre: 'Número exterior',
        campo: 'numeroExterior',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor:REG_X.SOLO_NUMEROS, mensaje: 'Por favor, escribe un número entero válido.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        row:2,
        maxlength: 10
    },
    {
        id: 'numeroInterior',
        labelNombre: 'Número interior',
        campo: 'numeroInterior',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'pattern', valor:REG_X.SOLO_NUMEROS, mensaje: 'Por favor, escribe un número entero válido.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        row:2,
        maxlength: 10
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
        marginTop: 0
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
            { tipo: 'pattern', valor:REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija el estado y localidad.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        row: 3,
        maxlength: 50
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
            { tipo: 'pattern', valor:REGEX_CORREO_ELECTRONICO, mensaje: 'Por favor, escribe una dirección de correo válida.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        row: 4,
        maxlength: 320
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
            { tipo: 'pattern', valor:REGEX_TELEFONO, mensaje: 'Por favor, escribe un número entero válido.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        row: 4,
        maxlength: 12
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
            { tipo: 'pattern', valor:REGEX_POSTAL_12, mensaje: 'Por favor, escribe un número entero válido.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        row: 4,
        maxlength: 12
    }
];

/**
 * FORMULARIO_DATOS_AUTORIZACION
 * Define los campos del formulario para la autorización.
 * Cada campo contiene un ID, nombre de etiqueta, campo, clase, tipo de input, validadores y otros atributos.
 */

export const FORMULARIO_DATOS_AUTORIZACION = [
    {
        id: 'folioInformacionGeneralAutorizacion',
        labelNombre: 'Folio de autorización de importación temporal formato en papel',
        campo: 'folioInformacionGeneralAutorizacion',
        clase: 'col-md-8',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_PATRON_ALFANUMERICO, mensaje: 'Por favor, corrija el folio de autorización de importación temporal formato en papel.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        row :1,
        maxlength: 25
    },
    {
        id: 'aduanaDeIngreso',
        labelNombre: 'Aduana de ingreso',
        campo: 'aduanaDeIngreso',
        clase: 'col-md-4 form-group',
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
        id: 'seccionAduanera',
        labelNombre: 'Sección Aduanera',
        campo: 'seccionAduanera',
        clase: 'col-md-4 form-group',
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
        id: 'fechaIngreso',
        labelNombre: 'Fecha de ingreso',
        campo: 'fechaIngreso',
        clase: 'col-md-4',
        tipoInput: 'date',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        habilitado: true
    },
    {
        id: 'fechaVencimiento',
        labelNombre: 'Fecha de vencimiento',
        campo: 'fechaVencimiento',
        clase: 'col-md-4',
        tipoInput: 'date',
        desactivado: false,
        soloLectura: false,
        validadores: [  
            { tipo: 'required' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        habilitado: true
    }
];

/**
 * FORMULARIO_DATOS_PRORROGA
 * Define los campos del formulario para la prórroga.
 * Cada campo contiene un ID, nombre de etiqueta, campo, clase, tipo de input, validadores y otros atributos.
 * Este formulario se utiliza para capturar información relacionada con las prórrogas de importación temporal.
 */
export const FORMULARIO_DATOS_PRORROGA = [
    {
        id: 'folioInformacionGeneralProrroga',
        labelNombre: 'Folio de prórroga de importación temporal formato en papel',
        campo: 'folioInformacionGeneralProrroga',
        clase: 'col-md-8',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_PATRON_ALFANUMERICO, mensaje: 'Por favor, corrija el folio de prórroga de importación temporal formato en papel.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
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
        id: 'fechaInicioProrroga',
        labelNombre: 'Fecha de inicio prórroga',
        campo: 'fechaInicioProrroga',
        clase: 'col-md-4',
        tipoInput: 'date',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        habilitado: true
    },
    {
        id: 'fechaVencimientoProrroga',
        labelNombre: 'Fecha de vencimiento prórroga',
        campo: 'fechaVencimientoProrroga',
        clase: 'col-md-4',
        tipoInput: 'date',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0,
        habilitado: true
    }
];

/**
 * FORMULARIO_DATOS_PROPIETARIO_NOMBRE
 * Define los campos del formulario para el nombre del propietario.
 * Cada campo contiene un ID, nombre de etiqueta, campo, clase, tipo de input, validadores y otros atributos.
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
        marginTop: 0,
        maxlength: 200
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
        marginTop: 0,
        maxlength: 200
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
        marginTop: 0,
        maxlength: 200
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
        marginTop: 2,
        row:1,
        maxlength: 120
    }
];
/**
 * Texto de manifiesto de declaración bajo protesta de decir verdad.
 */
export const MANIFIESTO_DECLARACION_TEXTO =
    'Declaro bajo protesta de decir verdad que retornaré oportunamente al extranjero la mercancía importada temporalmente a los Estados Unidos Mexicanos y a no realizar actos u omisiones que configuren delitos o infracciones por el indebido uso o destino de las mismas.';