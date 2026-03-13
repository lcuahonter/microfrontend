/**
 * Representa las opciones disponibles de radio para la autorización del agente.
 * Cada opción contiene un `label` para mostrar y un `value` para seleccionar.
 *
 * @example
 * // Ejemplo de uso:
 * RADIO_OPCIONES[0] // { label: 'Si Autorizo', value: 'Si' }
 */
export const RADIO_OPCIONS = [
  { label: 'Si Autorizo', value: 'Si' },
  { label: 'No Autorizo', value: 'No' },
];
/**
 * @constant
 * @name CONFIGURACION
 * @description
 * Arreglo de objetos de configuración para los campos del formulario relacionados con el agente aduanal.
 * Cada objeto representa una pregunta específica que debe ser respondida por el usuario, incluyendo información
 * sobre el estado de la patente aduanal, procesos legales y cumplimiento de estándares de seguridad.
 *
 * @property {string} id - Identificador único del campo.
 * @property {number} row - Número de fila en el formulario.
 * @property {string} labelNombre - Texto de la pregunta que se muestra al usuario.
 * @property {string} campo - Nombre del campo en el formulario.
 * @property {string} clase - Clases CSS aplicadas al campo.
 * @property {string} tipoInput - Tipo de entrada del campo (por ejemplo, 'radio').
 * @property {boolean} desactivado - Indica si el campo está desactivado.
 * @property {boolean} soloLectura - Indica si el campo es solo de lectura.
 * @property {Array} validadores - Lista de validadores aplicados al campo.
 * @property {string} layout - Disposición del campo en el formulario.
 * @property {string} marcadorDePosicion - Texto del marcador de posición.
 * @property {number} marginBottom - Espacio inferior del campo.
 * @property {Array<{label: string, value: string}>} opciones - Opciones disponibles para el campo tipo radio.
 */
export const CONFIGURACION = [
    {
      id: 'senaleSi',
      row: 1,
      labelNombre: 'Señale si a la fecha de la presentación de su solicitud la patente aduanal se encuentra activa.',
      campo: 'senaleSi',
      clase: 'col-md-12',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginBottom: 5,
      opciones: [
          {
          "label": "Si",
          "value": "Si"
         },
          {
          "label": "No",
          "value": "No"
         }
      ]
    },
    {
      id: 'presentacion',
      row: 2,
      labelNombre: 'Señale si a la fecha de la presentación la patente aduanal se encuentra sujeta a un proceso de suspensión, cancelación, extinción inhabilitación o suspensión voluntaria a que se refieren los artículos 164, 165 y 166 de la Ley.',
      campo: 'presentacion',
      clase: 'col-md-12',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginBottom: 5,
      opciones: [
          {
          "label": "Si",
          "value": "Si"
         },
          {
          "label": "No",
          "value": "No"
         }
      ]
    },
    {
      id: 'manifesteSi',
      row: 3,
      labelNombre: 'Manifieste si cumple con los estándares mínimos en materia de seguridad establecidos en el formato denominado Perfil del Agente Aduanal.',
      campo: 'manifesteSi',
      clase: 'col-md-12',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginBottom: 5,
      opciones: [
          {
          "label": "Si",
          "value": "Si"
         },
          {
          "label": "No",
          "value": "No"
         }
      ]
    }
]

/**
 * Arreglo de configuración para los campos del formulario "Certificado Comercial".
 *
 * Cada objeto en el arreglo representa un campo del formulario con sus propiedades, tales como:
 * - `id`: Identificador único del campo.
 * - `row`: Número de fila para la posición en el layout.
 * - `labelNombre`: Etiqueta que se muestra para el campo.
 * - `campo`: Nombre del campo utilizado para el enlace de datos.
 * - `clase`: Clase CSS para el diseño.
 * - `tipoInput`: Tipo de control de entrada (por ejemplo, 'radio', 'text').
 * - `desactivado`: Indica si el campo está deshabilitado.
 * - `soloLectura`: Indica si el campo es solo de lectura.
 * - `validadores`: Arreglo de reglas de validación para el campo.
 * - `layout`: Orientación del layout (por ejemplo, 'horizontal').
 * - `marcadorDePosicion`: Texto de marcador de posición para el input.
 * - `marginBottom` / `marginTop`: Valores de margen para el espaciado.
 * - `opciones`: Arreglo de opciones para los inputs tipo radio.
 * - `valorPredeterminado`: Valor predeterminado para el campo.
 * - `mostrar`: Controla la visibilidad del campo.
 *
 * Esta configuración se utiliza para renderizar y validar dinámicamente el formulario de certificado comercial.
 */
export const CONFIGURACION_COMERCIAL_CERTIFICADO = [

  {
    id: 'rfc',
    row: 1,
    labelNombre: 'RFC',
    campo: 'rfc',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginBottom: 5,
    opciones: [
    { label: 'Sí', value: 'Si' },
    { label: 'No', value: 'No' }
    ]
  },
  {
    id: 'nombreORazonSocial',
    row: 2,
    labelNombre: 'Nombre o Razón Social',
    campo: 'nombreORazonSocial',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginBottom: 5,
    opciones: [
    { label: 'Sí', value: 'Si' },
    { label: 'No', value: 'No' }
    ]
  },
  {
    id: 'direccionFiscal',
    row: 3,
    labelNombre: 'Dirección Fiscal',
    campo: 'direccionFiscal',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginBottom: 5,
    opciones: [
    { label: 'Sí', value: 'Si' },
    { label: 'No', value: 'No' }
    ]
  },
  {
    id: 'paginaElectronica',
    row: 4,
    labelNombre: 'Página Electrónica',
    campo: 'paginaElectronica',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginBottom: 5,
    opciones: [
    { label: 'Sí', value: 'Si' },
    { label: 'No', value: 'No' }
    ]
  },
  {
    id: 'correoElectronico',
    row: 5,
    labelNombre: 'Correo Electrónico de contacto',
    campo: 'correoElectronico',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginBottom: 5,
    opciones: [
    { label: 'Sí', value: 'Si' },
    { label: 'No', value: 'No' }
    ]
  },
  {
    id: 'telefonoContacto',
    row: 6,
    labelNombre: 'Teléfono de contacto',
    campo: 'telefonoContacto',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginBottom: 5,
    opciones: [
    { label: 'Sí', value: 'Si' },
    { label: 'No', value: 'No' }
    ]
  },
  {
    id: 'pagina',
    row: 4,
    labelNombre: '',
    campo: 'pagina',
    clase: 'col-md-12',
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
    marginTop: 0,
    mostrar: false
  },
  {
    id: 'correo',
    row: 5,
    labelNombre: '',
    campo: 'correo',
    clase: 'col-md-12',
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
    marginTop: 0,
    mostrar: false
  },
  {
    id: 'lada',
    row: 6,
    labelNombre: 'Lada',
    campo: 'lada',
    clase: 'col-md-2',
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
    marginTop: 0,
    mostrar: false
  },
  {
    id: 'telefonoUno',
    row: 6,
    labelNombre: 'Teléfono',
    campo: 'telefonoUno',
    clase: 'col-md-7',
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
    marginTop: 0,
    mostrar: false
  },
    {
    id: 'ladaDos',
    row: 7,
    labelNombre: 'Lada',
    campo: 'ladaDos',
    clase: 'col-md-2',
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
    marginTop: 2,
    mostrar: false
  },
  {
    id: 'telefonoDos',
    row: 7,
    labelNombre: 'Teléfono',
    campo: 'telefonoDos',
    clase: 'col-md-7',
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
    marginTop: 2,
    mostrar: false
  },
  {
    id: 'ladatres',
    row: 8,
    labelNombre: 'Lada',
    campo: 'ladaTres',
    clase: 'col-md-2',
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
    marginTop: 2,
    mostrar: false
  },
  {
    id: 'telefonoTres',
    row: 8,
    labelNombre: 'Teléfono',
    campo: 'telefonoTres',
    clase: 'col-md-7',
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
    marginTop: 2,
    mostrar: false
  }

]

/**
 * @constant CLASIFICACION
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 *
 * @property {string} id - Identificador único del campo.
 * @property {number} row - Número de fila en el layout del formulario.
 * @property {string} labelNombre - Etiqueta descriptiva mostrada al usuario.
 * @property {string} campo - Nombre del campo en el modelo de datos.
 * @property {string} clase - Clase CSS para el diseño del campo.
 * @property {string} tipoInput - Tipo de input utilizado (radio).
 * @property {boolean} desactivado - Indica si el campo está desactivado.
 * @property {boolean} soloLectura - Indica si el campo es solo de lectura.
 * @property {Array} validadores - Lista de validadores aplicados al campo.
 * @property {string} layout - Tipo de layout para el input.
 * @property {string} marcadorDePosicion - Texto de marcador de posición.
 * @property {number} marginBottom - Margen inferior en píxeles.
 * @property {Array<{label: string, value: string}>} opciones - Opciones disponibles para el input radio.
 * @property {boolean} mostrar - Indica si el campo debe mostrarse.
 */
export const CLASIFICACION = [
    {
        id: 'proporcionada',
        row: 1,
        labelNombre: 'La información proporcionada, durante este trámite para el Registro de Certificación de Empresas es clasificada por la empresa como:',
        campo: 'proporcionada',
        clase: 'col-md-12',
        tipoInput: 'radio',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        layout: 'horizontal',
        marcadorDePosicion: '',
        marginBottom: 5,
        opciones: [
        { label: 'Pública', value: 'Si' },
        { label: 'Privada', value: 'No' }
        ]
    } 
]

/**
 * @constant PAGO_DE_DERECHOS
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */

export const PAGO_DE_DERECHOS = [
  {
    id: 'claveDeReferencia',
    row: 1,
    labelNombre: 'Clave de referencia',
    campo: 'claveDeReferencia',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: true,
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
    id: 'numeroDeOperacion',
    row: 1,
    labelNombre: 'Número de operación',
    campo: 'numeroDeOperacion',
    clase: 'col-md-6',
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
    id: 'cadenaDeDependencia',
    row: 2,
    labelNombre: 'Cadena de la dependencia',
    campo: 'cadenaDeDependencia',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: true,
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
    id: 'banco',
    row: 2,
    labelNombre: 'Banco',
    campo: 'banco',
    clase: 'col-md-6',
    tipoInput: 'select-catalogos',
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
    id: 'llaveDePago',
    row: 3,
    labelNombre: 'Llave de pago',
    campo: 'llaveDePago',
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
    id: 'fechaPago',
    row: 3,
    labelNombre: 'Fecha de pago',
    campo: 'fechaPago',
    clase: 'col-md-4',
    tipoInput: 'date',
    desactivado: false,
    soloLectura: false,
    validadores: [
      {
        tipo: 'required'
      }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    habilitado: true
  },
  {
    id: 'importePago',
    row: 3,
    labelNombre: 'Importe de pago',
    campo: 'importePago',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
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
];


/**
 * Configuración para el formulario de Certificación de Empresas.
 *
 * Cada objeto en el arreglo representa un campo del formulario relacionado con la autorización para compartir información
 * de la empresa en el contexto del Esquema de Certificación de Empresas, conforme al artículo 21 de la Ley Federal de Transparencia.
 *
 * @property {string} id - Identificador único del campo.
 * @property {number} row - Número de fila en el layout del formulario.
 * @property {string} labelNombre - Texto descriptivo que se muestra como etiqueta del campo.
 * @property {string} campo - Nombre del campo en el modelo de datos.
 * @property {string} clase - Clases CSS aplicadas al campo para el diseño responsivo.
 * @property {string} tipoInput - Tipo de input del campo (por ejemplo, 'radio').
 * @property {boolean} desactivado - Indica si el campo está deshabilitado.
 * @property {boolean} soloLectura - Indica si el campo es solo de lectura.
 * @property {Array} validadores - Lista de validadores aplicados al campo.
 * @property {string} layout - Disposición del campo en el formulario ('horizontal', etc.).
 * @property {string} marcadorDePosicion - Texto de marcador de posición para el campo.
 * @property {number} marginBottom - Espaciado inferior del campo en píxeles.
 * @property {Array} opciones - Opciones disponibles para el input tipo radio.
 */
export const CONFIGURACION_CERTIFICACION_DE_EMPRESAS = [
    {
        id: 'certificacionDeEmpresas',
        row: 1,
        labelNombre: 'Por lo anterior y de conformidad con lo dispuesto en el artículo 21 de la Ley Federal de Transparencia y Acceso a la Información Pública Gubernamental, autorizo al sujeto obligado denominado SAT, a través de la AGACE, a compartir, difundir o distribuir con otras autoridades nacionales o extranjeras los datos personales y demás información de la empresa que represento, y que se genere durante el transcurso en que la misma se encuentre inscrita en el Registro en el Esquema de Certificación de Empresas.',
        campo: 'certificacionDeEmpresas',
        clase: 'col-md-12',
        tipoInput: 'radio',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        layout: 'horizontal',
        marcadorDePosicion: '',
        marginBottom: 5,
        opciones: RADIO_OPCIONS
    } 
]