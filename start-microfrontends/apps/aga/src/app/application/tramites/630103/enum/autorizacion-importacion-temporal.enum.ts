/**
 * Importación de constantes de expresiones regulares utilizadas para validaciones en los formularios.
 */
import { 
    REGEX_CORREO_ELECTRONICO, 
    REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, 
    REGEX_PATRON_ALFANUMERICO, 
    REGEX_POSTAL, 
    REGEX_TELEFONO 
  } from "@libs/shared/data-access-user/src/tramites/constantes/regex.constants";

/**
 * FORMULARIO_DATOS_MERCANCIA
 * Define los campos del formulario para la mercancía.
 * Cada campo contiene un ID, nombre de etiqueta, campo, clase, tipo de input, validadores y otros atributos.
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
        
        marginTop: 4
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
    {
        id: 'listaMercancia',
        labelNombre: 'Lista detallada de la mercancía',
        campo: 'listaMercancia',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [
           { tipo: 'required'},
            { tipo: 'pattern', valor:REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL, mensaje: 'Por favor, corrija la lista detallada de la mercancía.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 4
    }
];

/**
 * FORMULARIO_DATOS_SOLICITUD
 * Define los campos del formulario para la solicitud.
 * Cada campo contiene un ID, nombre de etiqueta, campo, clase, tipo de input, validadores y otros atributos.
 **/

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
        id: 'correoElectronico',
        labelNombre: 'Correo electrónico',
        campo: 'correoElectronico',
        clase: 'col-md-4',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor:REGEX_CORREO_ELECTRONICO, mensaje: 'Por favor, escriba una dirección de correo válida.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
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
            { tipo: 'pattern', valor:REGEX_TELEFONO, mensaje: 'Por favor, corrija el teléfono.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
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
            { tipo: 'pattern', valor:REGEX_POSTAL, mensaje: 'Debe contener sólo 5 números.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
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
        clase: 'col-md-8 ps-0',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' },
            { tipo: 'pattern', valor: REGEX_PATRON_ALFANUMERICO, mensaje: 'Por favor, corrija el folio de autorización de importación temporal formato en papel.' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 0
    },
    {
        id: 'aduanaDeIngreso',
        labelNombre: 'Aduana de ingreso',
        campo: 'aduanaDeIngreso',
        clase: 'col-md-4 ps-0 form-group',
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
        labelNombre: 'Sección aduanera',
        campo: 'seccionAduanera',
        clase: 'col-md-4 ps-0 form-group',
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
        id: 'fechaIngreso',
        labelNombre: 'Fecha de ingreso',
        campo: 'fechaIngreso',
        clase: 'col-md-4 ps-0',
        tipoInput: 'date',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 4,
        habilitado: true
    },
    {
        id: 'fechaVencimiento',
        labelNombre: 'Fecha de vencimiento',
        campo: 'fechaVencimiento',
        clase: 'col-md-4 ps-0',
        tipoInput: 'date',
        desactivado: false,
        soloLectura: false,
        validadores: [
            { tipo: 'required' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 4,
        habilitado: true
    }
];


/**
 * Definición de campos para el formulario de fecha de importación.
 * Actualmente está vacío, preparado para futura implementación.
 * Lista de objetos que representan cada campo del formulario.
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
        valorPredeterminado: '',
        marginTop: 4,
        habilitado: true
    },
    {
        id: 'fechaLimiteRetorno',
        labelNombre: ':  ',
        campo: 'fechaLimiteRetorno',
        clase: 'col-md-4',
        tipoInput: 'date',
        desactivado: true,
        soloLectura: true,
        validadores: [
        //    { tipo: 'required' }
        ],
        marcadorDePosicion: '',
        valorPredeterminado: '',
        marginTop: 4,
        habilitado: true,
          tooltipQuestionCircle: true,
        tooltipTxt: 'Fecha límite estimada de retorno' 
    
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

export const ERROR_FORMA_ALERT =`<div class="d-flex justify-content-center text-center">
<div>
  <div class="col-md-12">
    Faltan campos por capturar.
  </div>
</div>
</div>`;
export const ERROR_FORMA_ALERT_DOS = `
<div class="d-flex justify-content-center text-center">
  <div class="col-md-12 p-3  border-danger  text-danger rounded">
    <div class="mb-2 text-secondary" >Corrija los siguientes errores:</div>

    <div class="d-flex justify-content-start mb-1">
      <span class="me-2">1.</span>
      <span class="flex-grow-1 text-center">(Manifiestos Seleccionados) es un campo requerido</span>
    </div>

  </div>
</div>`;