/**
 * PERMISO_A_DESISTIR es una constante que define la estructura de los campos
 * utilizados en el formulario para gestionar el desistimiento de un permiso.
 * 
 * Cada objeto dentro del arreglo representa un campo del formulario, con las siguientes propiedades:
 * - `labelNombre`: Etiqueta que describe el campo.
 * - `campo`: Nombre del campo utilizado como identificador.
 * - `class`: Clase CSS aplicada al campo para definir su diseño.
 * - `tipoInput`: Tipo de entrada del campo (por ejemplo, número, texto, área de texto).
 * - `disabled`: Indica si el campo está deshabilitado.
 * - `validators`: Validaciones aplicadas al campo (por ejemplo, requerido).
 * - `placeholder`: Texto de marcador de posición para el campo.
 * - `tooltip`: Información adicional que se muestra como un tooltip (opcional).
 */
export const PERMISO_A_DESISTIR = [
  {
    id: 'acuseResolucion.folio',
    labelNombre: 'Folio',
    campo: 'folio',
    clase: 'col-md-12',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [
      {
        tipo: '', mensaje: ''
      }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  },
  {
    id: 'tipoDeSolicitud',
    labelNombre: 'Tipo de solicitud',
    campo: 'tipoDeSolicitud',
    clase: 'col-md-12',
    tipoInput: 'textarea',
    desactivado: true,
    soloLectura: false,
    validadores:[
      {
        tipo: '', mensaje: ''
      }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 3
  },
  {
    id: 'motivo',
    labelNombre: 'Motivo de desistimiento',
    campo: 'motivoDesistimiento',
    clase: 'col-md-12',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' }
    ],
    marcadorDePosicion: '',
    marginTop: 3
  }
];

/**
 * REPRESENTANTE_LEGAL es una constante que define la estructura de los campos
 * utilizados en el formulario para gestionar el desistimiento de un permiso.
 * 
 * Cada objeto dentro del arreglo representa un campo del formulario, con las siguientes propiedades:
 * - `labelNombre`: Etiqueta que describe el campo.
 * - `campo`: Nombre del campo utilizado como identificador.
 * - `class`: Clase CSS aplicada al campo para definir su diseño.
 * - `tipoInput`: Tipo de entrada del campo (por ejemplo, número, texto, área de texto).
 * - `disabled`: Indica si el campo está deshabilitado.
 * - `validators`: Validaciones aplicadas al campo (por ejemplo, requerido).
 * - `placeholder`: Texto de marcador de posición para el campo.
 * - `tooltip`: Información adicional que se muestra como un tooltip (opcional).
 */
export const REPRESENTANTE_LEGAL = [
  {
    id: 'representanteLegalRFC',
    labelNombre: 'RFC',
    campo: 'rfc',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      {
        tipo: 'required'
      }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  },
  {
    id: 'consultarIDC',
    labelNombre: 'Buscar',
    campo: 'buscar',
    clase: 'col-md-4',
    tipoInput: 'button',
    desactivado: false,
    marginTop: 5,
    divWidth:"none"
  },
  {
    id: 'representanteLegalNombre',
    labelNombre: 'Nombre o Razón Social',
    campo: 'nombre',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores:[
      {
        tipo: 'required'
      }
    ],
    marcadorDePosicion: '',
    marginTop: 3
  },
  {
    id: 'representanteLegalApPaterno',
    labelNombre: 'Apellido paterno',
    campo: 'apellidoPaterno',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [
      { tipo: 'required' }
    ],
    marcadorDePosicion: '',
    marginTop: 3
  },
  {
    id: 'representanteLegalApMaterno',
    labelNombre: 'Apellido materno',
    campo: 'apellidoMaterno',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [
      { tipo: '' }
    ],
    marcadorDePosicion: '',
    marginTop: 3
  }
];



/**
 * MANIFIESTOS_ALERT:
 * Contiene un mensaje de alerta que se muestra al usuario.
 *
 * - message: Mensaje en formato HTML que indica al usuario que debe capturar
 *   la descripción de la mercancía en los mismos términos de la carta de donación.
 */
export const MANIFIESTOS_ALERT = {
  message: "Cumplo con los requisitos y la normatividad aplicable, sin que ello me exima de que la autoridad sanitaria verifique su cumplimiento, esto sin perjuicio de las sanciones en las que pueda incurrir por falsedad de declaraciones dadas a una autoridad. Asimismo, acepto que la notificación de este trámite sea a través de la Ventanilla Única de Comercio Exterior por los mecanismos de la misma.",
};
