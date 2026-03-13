
/**
 * Arreglo que define las opciones y configuraciones para el campo "Indique si realiza".
 * Este campo es utilizado para determinar si se realizan o realizarán importaciones temporales
 * de mercancías de las fracciones arancelarias listadas en el Anexo II del Decreto IMMEX
 * y/o en el Anexo 28.
 *
 * Propiedades:
 * - `id`: Identificador único del campo.
 * - `labelNombre`: Etiqueta descriptiva del campo.
 * - `campo`: Nombre del campo asociado.
 * - `clase`: Clase CSS aplicada al contenedor del campo.
 * - `tipoInput`: Tipo de entrada del campo (en este caso, un botón de radio).
 * - `desactivado`: Indica si el campo está deshabilitado.
 * - `soloLectura`: Indica si el campo es de solo lectura.
 * - `validadores`: Lista de validadores aplicados al campo (actualmente vacío).
 * - `layout`: Disposición del diseño del campo (horizontal o vertical).
 * - `marcadorDePosicion`: Texto de marcador de posición (placeholder) para el campo.
 * - `marginTop`: Margen superior aplicado al contenedor del campo.
 * - `opciones`: Opciones disponibles para el campo, cada una con:
 *   - `label`: Etiqueta visible para la opción.
 *   - `value`: Valor asociado a la opción.
 */
export const CONFIGURACION_DATOS = [
    {
      id: 'indiqueSiRealiza',
      labelNombre: 'Indique si realiza o realizará importaciones temporales de mercancías de las fracciones arancelarias listadas en el Anexo II del Decreto IMMEX y/o de las fracciones arancelarias listadas en el Anexo 28.',
      campo: 'indiqueSiRealiza',
      clase: 'col-md-12',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 5,
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
 * Constante que define los datos relacionados con el régimen de Depósito Fiscal.
 * 
 * Cada objeto dentro del arreglo representa un campo de entrada con sus respectivas propiedades
 * y configuraciones para ser utilizado en un formulario.
 * 
 * Propiedades comunes de los objetos:
 * - `id`: Identificador único del campo.
 * - `labelNombre`: Etiqueta que describe el propósito del campo.
 * - `campo`: Nombre del campo asociado.
 * - `clase`: Clase CSS aplicada al contenedor del campo.
 * - `tipoInput`: Tipo de entrada del campo (por ejemplo, "radio").
 * - `desactivado`: Indica si el campo está deshabilitado.
 * - `soloLectura`: Indica si el campo es de solo lectura.
 * - `validadores`: Lista de validadores aplicados al campo (vacío por defecto).
 * - `layout`: Disposición del campo (por ejemplo, "horizontal").
 * - `marcadorDePosicion`: Texto de marcador de posición (vacío por defecto).
 * - `marginTop`: Margen superior aplicado al campo.
 * - `opciones`: Lista de opciones disponibles para el campo (en caso de ser un campo de tipo "radio").
 * 
 * Ejemplo de opciones:
 * - `label`: Etiqueta visible para el usuario.
 * - `value`: Valor asociado a la opción.
 */
export const DEPOSITO_FISCAL = [
    {
      id: 'cancelacion',
      labelNombre: 'Indique si se encuentra sujeto a un procedimiento de cancelación',
      campo: 'cancelacion',
      clase: 'col-md-12',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 5,
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
      id: 'cumplimientoReglas',
      labelNombre: 'Indique si ha cumplido adecuadamente con los requisitos de las reglas 4.5.30 y 4.5.32.',
      campo: 'cumplimientoReglas',
      clase: 'col-md-12',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 5,
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
 * Constante `ELABORACION` que define un arreglo de objetos utilizados para configurar
 * campos de entrada en un formulario relacionado con trámites específicos.
 * 
 * Cada objeto dentro del arreglo representa un campo de entrada con las siguientes propiedades:
 * 
 * - `id`: Identificador único del campo.
 * - `labelNombre`: Etiqueta descriptiva que se muestra al usuario.
 * - `campo`: Nombre del campo asociado.
 * - `clase`: Clase CSS utilizada para el diseño del campo.
 * - `tipoInput`: Tipo de entrada del campo (por ejemplo, "radio").
 * - `desactivado`: Indica si el campo está deshabilitado.
 * - `soloLectura`: Indica si el campo es de solo lectura.
 * - `validadores`: Arreglo de validadores aplicados al campo (actualmente vacío).
 * - `layout`: Diseño del campo (por ejemplo, "horizontal").
 * - `marcadorDePosicion`: Texto de marcador de posición (placeholder) para el campo.
 * - `marginTop`: Margen superior aplicado al campo.
 * - `opciones`: Arreglo de opciones disponibles para el campo, cada una con:
 *   - `label`: Etiqueta de la opción.
 *   - `value`: Valor asociado a la opción.
 * 
 * Ejemplo de uso:
 * Este arreglo puede ser utilizado para generar dinámicamente campos de entrada
 * en un formulario de acuerdo con los requisitos de un trámite específico.
 */
export const ELABORACION = [
  {
    id: 'indiqueCancelacion',
    labelNombre: 'Indique si se encuentra sujeto a un procedimiento de cancelación',
    campo: 'indiqueCancelacion',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [
      
    ],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginTop: 5,
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
    id: 'comercioExterior',
    labelNombre: 'Indique si cumple con los lineamientos que determinen las autoridades aduaneras para el control, vigilancia y seguridad del recinto y de las mercancías del comercio exterior.',
    campo: 'comercioExterior',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [
      
    ],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginTop: 5,
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
 * Constante que define los datos relacionados con el recinto fiscalizado.
 * 
 * Contiene una lista de objetos que representan configuraciones para campos de entrada
 * en un formulario. Cada objeto incluye propiedades como el identificador del campo,
 * la etiqueta, el tipo de entrada, opciones disponibles, y otras configuraciones
 * relacionadas con la presentación y validación del campo.
 * 
 * @const
 * @type {Array<Object>}
 * 
 * @property {string} id - Identificador único del campo.
 * @property {string} labelNombre - Etiqueta descriptiva del campo.
 * @property {string} campo - Nombre del campo asociado.
 * @property {string} clase - Clase CSS para el diseño del campo.
 * @property {string} tipoInput - Tipo de entrada del campo (por ejemplo, "radio").
 * @property {boolean} desactivado - Indica si el campo está desactivado.
 * @property {boolean} soloLectura - Indica si el campo es de solo lectura.
 * @property {Array} validadores - Lista de validadores aplicados al campo.
 * @property {string} layout - Diseño del campo (por ejemplo, "horizontal").
 * @property {string} marcadorDePosicion - Texto del marcador de posición del campo.
 * @property {number} marginTop - Margen superior aplicado al campo.
 * @property {Array<Object>} opciones - Opciones disponibles para el campo de entrada.
 */
export const RECINTO_FISCALIZADO = [
  {
    id: 'recintoEstrategico',
    labelNombre: 'Indique si se encuentra sujeto a un procedimiento de cancelación',
    campo: 'recintoEstrategico',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [
      
    ],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginTop: 5,
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
    id: 'cumplimientoLineamientos',
    labelNombre: 'Indique si cumple con los lineamientos que determinan las autoridades aduaneras para el control, vigilancia y seguridad del recinto y de las mercancías del comercio exterior.',
    campo: 'cumplimientoLineamientos',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [
      
    ],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginTop: 5,
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
 * Constante que define los datos y configuraciones para el régimen de importación temporal.
 * 
 * Contiene una lista de objetos que representan los campos de un formulario, cada uno con sus propiedades
 * específicas como identificador, etiqueta, tipo de entrada, validadores, opciones, entre otros.
 * 
 * @const IMPORTACION_TEMPORAL
 * 
 * @property {string} id - Identificador único del campo.
 * @property {string} labelNombre - Etiqueta descriptiva del campo que se muestra al usuario.
 * @property {string} campo - Nombre del campo que se utiliza para identificarlo en el formulario.
 * @property {string} clase - Clase CSS aplicada al contenedor del campo.
 * @property {string} tipoInput - Tipo de entrada del campo (por ejemplo, "radio", "text").
 * @property {boolean} desactivado - Indica si el campo está deshabilitado.
 * @property {boolean} soloLectura - Indica si el campo es de solo lectura.
 * @property {Array} validadores - Lista de validadores aplicados al campo (vacío en este caso).
 * @property {string} layout - Disposición del campo en el formulario (por ejemplo, "horizontal").
 * @property {string} marcadorDePosicion - Texto de marcador de posición para el campo.
 * @property {number} marginTop - Margen superior aplicado al campo.
 * @property {Array} opciones - Lista de opciones disponibles para campos de tipo "radio".
 *   - @property {string} label - Etiqueta de la opción.
 *   - @property {string} value - Valor asociado a la opción.
 * @property {string} [valorPredeterminado] - Valor inicial del campo (aplicable solo a ciertos tipos de entrada).
 */
export const IMPORTACION_TEMPORAL = [
  {
    id: 'indique',
    labelNombre: 'Indique si durante los últimos doce meses, el valor de la mercancía transformada y retornada, retornada en su mismo estado, o a la que se le prestó un servicio, durante dicho periodo representa al menos el 80% del valor de las importaciones temporales de insumos durante el mismo periodo. (Declare solo aquellos conceptos que le apliquen).',
    campo: 'indique',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [
      
    ],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginTop: 5,
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
    id: 'empresaSolicitante',
    labelNombre: '¿La empresa solicitante ha realizado operaciones al amparo del Programa IMMEX en al menos los 12 meses previos a la solicitud?',
    campo: 'empresaSolicitante',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [
      
    ],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginTop: 5,
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
    id: 'captureElValorTotal',
    labelNombre: 'Capture el valor total en moneda nacional de sus importaciones temporales de materiales directos e insumos del periodo requerido conforme al párrafo anterior',
    campo: 'captureElValorTotal',
    clase: 'col-md-12',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  }
];