
/**
 * Constante que define la configuración para el permiso a desistir.
 * 
 * Esta constante contiene un arreglo de objetos que representan los campos
 * necesarios para capturar la información relacionada con el permiso a desistir.
 * 
 * Propiedades del objeto:
 * - `id`: Identificador único del campo.
 * - `labelNombre`: Etiqueta descriptiva que se muestra al usuario.
 * - `campo`: Nombre del campo utilizado para enlazar datos.
 * - `clase`: Clase CSS aplicada al contenedor del campo.
 * - `tipoInput`: Tipo de entrada del campo (en este caso, un radio button).
 * - `desactivado`: Indica si el campo está deshabilitado.
 * - `soloLectura`: Indica si el campo es de solo lectura.
 * - `validadores`: Lista de validadores aplicados al campo (actualmente vacío).
 * - `layout`: Disposición del campo (horizontal o vertical).
 * - `marcador_de_posicion`: Texto de marcador de posición (placeholder) para el campo.
 * - `margin_top`: Margen superior aplicado al campo.
 * - `opciones`: Opciones disponibles para el campo de tipo radio button.
 *   - Cada opción incluye:
 *     - `label`: Etiqueta visible para el usuario.
 *     - `value`: Valor asociado a la opción.
 */
export const PERMISO_A_DESISTIR = [
  {
    id: 'manifieste',
    labelNombre: 'Manifieste si los proveedores nacionales señalados anteriormente, se encuentran a la fecha de presentación de la solicitud, en las publicaciones a que hace referencia el artículo 69-B, cuarto párrafo del CFF.',
    campo: 'manifieste',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [
      
    ],
    layout: 'horizontal',
    marcador_de_posicion: '',
    margin_top: 5,
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
];


/**
 * Constante que define un conjunto de configuraciones para campos de entrada de tipo radio
 * utilizados en un formulario relacionado con trámites específicos.
 * 
 * @const PERMISO_A_DESISTIR_DOS
 * @type {Array<Object>}
 * 
 * @property {string} id - Identificador único del campo.
 * @property {string} labelNombre - Etiqueta descriptiva que se muestra al usuario.
 * @property {string} campo - Nombre del campo asociado.
 * @property {string} clase - Clase CSS aplicada al contenedor del campo.
 * @property {string} tipoInput - Tipo de entrada del campo (en este caso, "radio").
 * @property {boolean} desactivado - Indica si el campo está deshabilitado.
 * @property {boolean} soloLectura - Indica si el campo es de solo lectura.
 * @property {Array} validadores - Lista de validadores aplicados al campo (actualmente vacío).
 * @property {string} layout - Disposición del diseño del campo (en este caso, "horizontal").
 * @property {string} marcador_de_posicion - Texto de marcador de posición (actualmente vacío).
 * @property {number} margin_top - Margen superior aplicado al campo.
 * @property {Array<Object>} opciones - Opciones disponibles para el campo de tipo radio.
 * 
 * @property {string} opciones.label - Etiqueta de la opción que se muestra al usuario.
 * @property {string} opciones.value - Valor asociado a la opción.
 */
export const PERMISO_A_DESISTIR_DOS = [
  {
    id: 'manifiesteSi',
    labelNombre: 'Manifieste si se le ha notificado algún crédito fiscal por parte del SAT en los últimos 12 meses anteriores a la fecha de presentación de la solicitud o acrediten que están al amparo del procedimiento previsto en el segundo parrafo, de la presente regla o, en su caso, hayan efectuado el pago del mismo.',
    campo: 'manifiesteSi',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [
      
    ],
    layout: 'horizontal',
    marcador_de_posicion: '',
    margin_top: 2,
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
    id: 'manifiesteCorrespondiente',
    labelNombre: 'Manifieste si se le ha emitido resolución de improcedencia de las devoluciones del IVA solicitadas en los últimos 6 meses, contados a partir de la fecha de presentación de la solicitud de certificación correspondiente',
    campo: 'manifiesteCorrespondiente',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [
      
    ],
    layout: 'horizontal',
    marcador_de_posicion: '',
    margin_top: 2,
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
];

/**
 * Constante que define la configuración de los campos para el formulario de monto de inversión.
 *
 * Cada objeto dentro del arreglo representa un campo del formulario con sus propiedades específicas:
 * - `id`: Identificador único del campo.
 * - `labelNombre`: Etiqueta descriptiva que se muestra al usuario.
 * - `campo`: Nombre del campo utilizado para enlazar datos en el formulario.
 * - `clase`: Clase CSS aplicada al contenedor del campo para diseño responsivo.
 * - `tipoInput`: Tipo de entrada del campo (por ejemplo, 'select-catalogos', 'number', 'text').
 * - `desactivado`: Indica si el campo está deshabilitado.
 * - `soloLectura`: Indica si el campo es de solo lectura.
 * - `validadores`: Lista de validadores aplicados al campo.
 *   - `tipo`: Tipo de validador (por ejemplo, 'required').
 * - `marcadorDePosicion`: Texto de marcador de posición (placeholder) para el campo.
 * - `valorPredeterminado`: Valor inicial del campo.
 * - `marginTop`: Margen superior aplicado al campo.
 *
 * Esta constante se utiliza para construir dinámicamente el formulario de inversión en la aplicación.
 */
export const INVERSION_MONTO = [
    {
      id: 'tipoInversion',
      labelNombre: 'Tipo de inversión',
      campo: 'tipoInversion',
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
      marginTop: 0,
    },
    {
      id: 'valorEnPesos',
      labelNombre: 'Valor en pesos',
      campo: 'valorEnPesos',
      clase: 'col-md-6',
      tipoInput: 'number',
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
      id: 'descGeneral',
      labelNombre: 'Descripción general',
      campo: 'descGeneral',
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
];


/**
 * Constante que define un conjunto de configuraciones para los permisos relacionados con la certificación
 * en materia de IVA e IEPS, así como el cumplimiento de obligaciones relativas al Anexo 30.
 * 
 * Cada objeto dentro del arreglo representa un campo de entrada con sus respectivas propiedades y opciones.
 * 
 * Propiedades de cada objeto:
 * - `id`: Identificador único del campo.
 * - `labelNombre`: Etiqueta descriptiva que se muestra al usuario.
 * - `campo`: Nombre del campo asociado.
 * - `clase`: Clase CSS aplicada al contenedor del campo.
 * - `tipoInput`: Tipo de entrada del campo (en este caso, "radio").
 * - `desactivado`: Indica si el campo está deshabilitado.
 * - `soloLectura`: Indica si el campo es de solo lectura.
 * - `validadores`: Lista de validadores aplicados al campo (actualmente vacío).
 * - `layout`: Disposición del campo (en este caso, "horizontal").
 * - `marcador_de_posicion`: Texto de marcador de posición (actualmente vacío).
 * - `margin_top`: Margen superior aplicado al campo.
 * - `opciones`: Lista de opciones disponibles para el campo, cada una con:
 *   - `label`: Etiqueta visible para el usuario.
 *   - `value`: Valor asociado a la opción.
 */
export const PERMISO_A_DESISTIR_TRES = [
  {
    id: 'contado',
    labelNombre: 'Ha contado previamente con la Certificación en materia de IVA e IEPS, el Registro en el Esquema de Certificación de Empresas bajo la modalidad IVA e IEPS o Garantía del interés fiscal del IVA e IEPS.',
    campo: 'contado',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [
      
    ],
    layout: 'horizontal',
    marcador_de_posicion: '',
    margin_top: 2,
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
    id: 'caso',
    labelNombre: 'En caso afirmativo, señale si se encuentra al corriente en el cumplimiento de las obligaciones relativas al Anexo 30 sobre dicho registro:',
    campo: 'caso',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [
      
    ],
    layout: 'horizontal',
    marcador_de_posicion: '',
    margin_top: 2,
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
];


/**
 * Constante que define una lista de objetos utilizados para representar opciones
 * relacionadas con certificaciones en la modalidad de IVA e IEPS.
 * 
 * Cada objeto en la lista contiene las siguientes propiedades:
 * 
 * - `labelNombre`: Una descripción textual que representa la opción.
 * - `campo`: Identificador único para la opción.
 * - `clase`: Clase CSS utilizada para definir el diseño del elemento en la interfaz.
 * - `tipoInput`: Tipo de entrada HTML, en este caso siempre es un checkbox.
 * - `desactivado`: Indica si el checkbox está deshabilitado (false por defecto).
 * - `marcador_de_posicion`: Texto de marcador de posición (vacío por defecto).
 */
export const CONFIGURACION_IVAEIEPS_DOS = [
  {
    labelNombre: 'Que durante los últimos cuatro años o más han llevado a cabo operaciones al amparo del régimen para el cual solicitan la certificación en la modalidad de IVA e IEPS.',
    campo: 'durante',
    clase: 'col-md-12',
    tipoInput: 'checkbox',
    desactivado: false,
    marcador_de_posicion: '',
  },
  {
    labelNombre: 'Fecha inicio de operaciones bajo el régimen',
    campo: 'fechaInicio',
    clase: 'col-md-6',
    tipoInput: 'date',
    desactivado: false,
    soloLectura: false,
    marcador_de_posicion: '',
  },
  {
    labelNombre: 'Que durante los últimos 12 meses anteriores en promedio contaron con más de 1,000 empleados registrados ante el IMSS.',
    campo: 'anteElImss',
    clase: 'col-md-12',
    tipoInput: 'checkbox',
    desactivado: false,
    marcador_de_posicion: '',
  },
  {
    labelNombre: 'Número de empleados ante el IMSS',
    campo: 'numeroDeEmpleados',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
  },
  {
    labelNombre: 'Que el valor de su maquinaria y equipo es superior a los 50,000,000 de pesos.',
    campo: 'dePesos',
    clase: 'col-md-12',
    tipoInput: 'checkbox',
    desactivado: false,
    marcador_de_posicion: '',
  },
  {
    labelNombre: 'Valor total de la maquinaria y equipo',
    campo: 'valorMaquinaria',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
  },
];

/**
 * Constante que define los campos necesarios para el pago de derechos.
 * Cada objeto dentro del arreglo representa un campo con sus propiedades específicas.
 * 
 * Propiedades de cada campo:
 * - `id`: Identificador único del campo.
 * - `labelNombre`: Etiqueta que describe el nombre del campo.
 * - `campo`: Nombre del campo utilizado para enlazar datos.
 * - `clase`: Clase CSS aplicada al campo para diseño responsivo.
 * - `tipoInput`: Tipo de entrada del campo (por ejemplo, texto, selección, etc.).
 * - `desactivado`: Indica si el campo está deshabilitado.
 * - `soloLectura`: Indica si el campo es de solo lectura.
 * - `validadores`: Lista de validadores aplicados al campo.
 *   - `tipo`: Tipo de validador (por ejemplo, requerido).
 * - `marcadorDePosicion`: Texto de marcador de posición para el campo.
 * - `valorPredeterminado`: Valor inicial del campo.
 * - `marginTop`: Margen superior aplicado al campo.
 */
export const PAGO_DE_DERECHOS = [
  {
    id: 'claveDeReferencia',
    labelNombre: 'Clave de referencia',
    campo: 'claveDeReferencia',
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
    id: 'folioDePago',
    labelNombre: 'Folio de pago',
    campo: 'folioDePago',
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
    id: 'numeroDeOperacion',
    labelNombre: 'Numero de operación',
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
    id: 'cadenaDependencia',
    labelNombre: 'Cadena de la dependencia',
    campo: 'cadenaDependencia',
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
    id: 'banco',
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
    labelNombre: 'Fecha de pago',
    campo: 'fechaPago',
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
    id: 'importePago',
    labelNombre: 'Importe de pago',
    campo: 'importePago',
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
];