import { ConfiguracionColumna, REGEX_CORREO_ELECTRONICO_EXPORTADOR, REGEX_DESCRIPCION_ESPECIALES, REGEX_NO_SOLO_NUMEROS, REGEX_RFC, REGEX_TELEFONO_OPCIONAL, REG_X } from "@libs/shared/data-access-user/src";
import { DetallesDelProducto } from "../models/certi-registro.model";

/**
 * DATOS_DEL_TRAMITE:
 * Contiene la configuración de los campos relacionados con los datos del trámite.
 * Cada objeto dentro del arreglo representa un campo con las siguientes propiedades:
 * 
 * - labelNombre: Etiqueta que describe el campo.
 * - campo: Nombre del campo utilizado para identificarlo.
 * - class: Clase CSS que define el tamaño y diseño del campo.
 * - tipo_input: Tipo de entrada del campo (ej. select-catalogos, checkbox, textarea, etc.).
 * - disabled: Indica si el campo está deshabilitado (true o false).
 * - validators: Validaciones aplicadas al campo (ej. 'required').
 * - placeholder: Texto de marcador de posición para el campo.
 * - tooltip: Información adicional que se muestra como un tooltip (opcional).
 */
export const DATOS_DEL_TRAMITE = [
  {
    id: 'aduana',
    labelNombre: 'Aduana por la que ingresará la mercancía',
    campo: 'aduana',
    clase: 'col-md-8',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    opciones: [],
    marginTop: 3,
  },
  {
    id: 'organismoPublico',
    labelNombre: 'Organismo público',
    campo: 'organismoPublico',
    clase: 'col-md-4',
    tipoInput: 'checkbox',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    marginTop: 5,
  }
];

  /**
 * MERCANCIAS:
 * Contiene la configuración de los campos relacionados con los datos del trámite.
 * Cada objeto dentro del arreglo representa un campo con las siguientes propiedades:
 * 
 * - labelNombre: Etiqueta que describe el campo.
 * - campo: Nombre del campo utilizado para identificarlo.
 * - class: Clase CSS que define el tamaño y diseño del campo.
 * - tipo_input: Tipo de entrada del campo (ej. select-catalogos, checkbox, textarea, etc.).
 * - disabled: Indica si el campo está deshabilitado (true o false).
 * - validators: Validaciones aplicadas al campo (ej. 'required').
 * - placeholder: Texto de marcador de posición para el campo.
 * - tooltip: Información adicional que se muestra como un tooltip (opcional).
 */
export const MERCANCIAS = [
  {
    id: 'finAlDestinara',
    labelNombre: 'Fin al cual se destinará la mercancía',
    campo: 'finAlDestinara',
    clase: 'col-md-12',
    tipoInput: 'textarea',
    desactivado: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    marginTop: 0,
  }
]

  /**
 * PRODUCTOS:
 * Contiene la configuración de los campos relacionados con las mercancías.
 * Cada objeto dentro del arreglo representa un campo con las siguientes propiedades:
 * 
 * - labelNombre: Etiqueta que describe el campo.
 * - campo: Nombre del campo utilizado para identificarlo.
 * - class: Clase CSS que define el tamaño y diseño del campo.
 * - tipo_input: Tipo de entrada del campo (ej. select-catalogos, checkbox, textarea, etc.).
 * - disabled: Indica si el campo está deshabilitado (true o false).
 * - validators: Validaciones aplicadas al campo (ej. 'required').
 * - placeholder: Texto de marcador de posición para el campo.
 * - tooltip: Información adicional que se muestra como un tooltip (opcional).
 */
  export const PRODUCTOS = [
    {
      id: 'tipoDeMercancia',
      labelNombre: 'Tipo de mercancía',
      campo: 'tipoDeMercancia',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
        { tipo: 'required' },
        {
          tipo: 'maxlength',
          valor: 200
        },
        {
          tipo: 'pattern',
          valor: REGEX_DESCRIPCION_ESPECIALES,
          mensaje: 'Ingresa datos validos',
        },
      ],
      marcadorDePosicion: '',
      marginTop: 0,
    },
    {
    id: 'condicionDeLaMercancia',
    labelNombre: 'Condición de la mercancía',
    campo: 'condicionDeLaMercancia',
    clase: 'col-md-8',
    tipoInput: 'select-catalogos',
    desactivado: true,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '1',
    opciones: [
      {
        id: 1,
        descripcion: 'Usados',
      },
    ],
    marginTop: 0,
  },
  {
      id: 'cantidad',
      labelNombre: 'Cantidad',
      campo: 'cantidad',
      clase: 'col-md-8',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
        { tipo: 'required' },
        {
          tipo: 'pattern',
          valor: REG_X.DECIMALES_DOS_LUGARES,
          mensaje: 'Por favor, escribe un número válido',
        },
      ],
      marcadorDePosicion: '',
      marginTop: 5,
    },
    {
    id: 'unidadDeMedida',
    labelNombre: 'Unidad de medida',
    campo: 'unidadDeMedida',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    opciones: [],
    marginTop: 5,
  },
   {
    id: 'enSuCaso',
    labelNombre: 'En su caso (maquinaria y equipo obsoleto)',
    campo: '',
    clase: 'col-md-12',
    tipoInput: 'label-only',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 5,
  },
  {
      id: 'marca',
      labelNombre: 'Marca',
      campo: 'marca',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
        {
          tipo: 'pattern',
          valor: REGEX_DESCRIPCION_ESPECIALES,
          mensaje: 'Ingresa datos validos',
        },
        {
          tipo: 'maxlength',
          valor: 100
        },
      ],
      marcadorDePosicion: '',
      marginTop: 5,
    },
    {
      id: 'anoDeImportacionTemporal',
      labelNombre: 'Año de importación temporal',
      campo: 'anoDeImportacionTemporal',
      clase: 'col-md-4',
      tipoInput: 'select-catalogos',
      desactivado: false,
      soloLectura: false,
      validadores: [],
      marcadorDePosicion: '',
      opciones: [],
      marginTop: 5,
    },
    {
      id: 'modelo',
      labelNombre: 'Modelo',
      campo: 'modelo',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
        {
          tipo: 'maxlength',
          valor: 50
        },
      ],
      marcadorDePosicion: '',
      marginTop: 5,
    },
    {
      id: 'numeroDeSerie',
      labelNombre: 'Número de serie',
      campo: 'numeroDeSerie',
      clase: 'col-md-8',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
        {
          tipo: 'pattern',
          valor: REGEX_DESCRIPCION_ESPECIALES,
          mensaje: 'Ingresa datos validos',
        },
      ],
      marcadorDePosicion: '',
      marginTop: 5,
    },
  ];

  /**
 * DATOS_DEL_DONANTE:
 * Contiene la configuración de los campos relacionados con las mercancías.
 * Cada objeto dentro del arreglo representa un campo con las siguientes propiedades:
 * 
 * - labelNombre: Etiqueta que describe el campo.
 * - campo: Nombre del campo utilizado para identificarlo.
 * - class: Clase CSS que define el tamaño y diseño del campo.
 * - tipo_input: Tipo de entrada del campo (ej. select-catalogos, checkbox, textarea, etc.).
 * - disabled: Indica si el campo está deshabilitado (true o false).
 * - validators: Validaciones aplicadas al campo (ej. 'required').
 * - placeholder: Texto de marcador de posición para el campo.
 * - tooltip: Información adicional que se muestra como un tooltip (opcional).
 */
  export const DATOS_DEL_DONANTE = [
    {
      id: 'rfc',
      labelNombre: 'RFC',
      campo: 'rfc',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
        {
          tipo: 'required',
        },
        {
          tipo: 'maxlength',
          valor: 13
        },
        {
          tipo: 'pattern',
          valor: REGEX_RFC,
          mensaje: 'Ingresa un RFC válido',
        }
      ],
      marcadorDePosicion: '',
      marginTop: 0,
      tooltipQuestionCircle: true,
      tooltipTxt: 'Registro Federal de Contribuyentes'
    },
    {
      id: 'programaImmex',
      labelNombre: 'Número de programa Immex',
      campo: 'programaImmex',
      clase: 'col-md-8',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
        {
          tipo: 'required',
        },
        {
          tipo: 'pattern',
          valor: REGEX_NO_SOLO_NUMEROS,
          mensaje: 'El dato debe de ser conforme el formato indicado',
        }
      ],
      marcadorDePosicion: '',
      marginTop: 0,
      tooltipQuestionCircle: true,
      tooltipTxt: 'Mínimo 1 dígito para programa / 4 dígitos para año'
    },
    {
      id: 'nombreRazonSocial',
      labelNombre: 'Razón / Razon Social',
      campo: 'nombreRazonSocial',
      clase: 'col-md-8',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores: [
        {
          tipo: 'required',
        }
      ],
      marcadorDePosicion: '',
      marginTop: 3
    }
  ];

  /**
 * DOMICILIO_FISCAL:
 * Contiene la configuración de los campos relacionados con las mercancías.
 * Cada objeto dentro del arreglo representa un campo con las siguientes propiedades:
 * 
 * - labelNombre: Etiqueta que describe el campo.
 * - campo: Nombre del campo utilizado para identificarlo.
 * - class: Clase CSS que define el tamaño y diseño del campo.
 * - tipo_input: Tipo de entrada del campo (ej. select-catalogos, checkbox, textarea, etc.).
 * - disabled: Indica si el campo está deshabilitado (true o false).
 * - validators: Validaciones aplicadas al campo (ej. 'required').
 * - placeholder: Texto de marcador de posición para el campo.
 * - tooltip: Información adicional que se muestra como un tooltip (opcional).
 */
  export const DOMICILIO_FISCAL = [
    {
      id: 'pais',
      labelNombre: 'País',
      campo: 'pais',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores: [
        {
          tipo: 'required',
        }
      ],
      marcadorDePosicion: '',
      marginTop: 0,
    },
    {
      id: 'zonaPostal',
      labelNombre: 'C.P o zona postal',
      campo: 'zonaPostal',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores: [
        {
          tipo: 'required',
        }
      ],
      marcadorDePosicion: '',
      marginTop: 0,
    },
    {
      id: 'estado',
      labelNombre: 'Estado',
      campo: 'estado',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores: [
        {
          tipo: 'required',
        }
      ],
      marcadorDePosicion: '',
      marginTop: 3,
    },
    {
      id: 'colonia',
      labelNombre: 'Colonia',
      campo: 'colonia',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores: [
        {
          tipo: 'required',
        }
      ],
      marcadorDePosicion: '',
      marginTop: 3,
    },
    {
      id: 'calle',
      labelNombre: 'Calle',
      campo: 'calle',
      clase: 'col-md-8',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores: [
        {
          tipo: 'required',
        }
      ],
      marcadorDePosicion: '',
      marginTop: 3,
    },
    {
      id: 'numeroExterior',
      labelNombre: 'Número y/o letra exterior',
      campo: 'numeroExterior',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores: [
        {
          tipo: 'required',
        }
      ],
      marcadorDePosicion: '',
      marginTop: 3,
    },
    {
      id: 'numeroInterior',
      labelNombre: 'Número y/o letra interior',
      campo: 'numeroInterior',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores: [
        {
          tipo: 'required',
        }
      ],
      marcadorDePosicion: '',
      marginTop: 3,
    },
    {
      id: 'correoElectronico',
      labelNombre: 'Correo electrónico',
      campo: 'correoElectronico',
      clase: 'col-md-8',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores: [],
      marcadorDePosicion: '',
      marginTop: 3,
    },
    {
      id: 'telephono',
      labelNombre: 'Teléfono',
      campo: 'telephono',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores: [],
      marcadorDePosicion: '',
      marginTop: 3,
    },
    {
      id: 'correoElectronicoOpcional',
      labelNombre: 'Correo electrónico (opcional)',
      campo: 'correoElectronicoOpcional',
      clase: 'col-md-8',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
        {
          tipo: 'pattern',
          valor: REGEX_CORREO_ELECTRONICO_EXPORTADOR,
          mensaje: 'El dato no esta conforme al formato esperado',
        },
      ],
      marcadorDePosicion: '',
      marginTop: 3,
    },
    {
      id: 'telephonoOpcional',
      labelNombre: 'Teléfono (opcional)',
      campo: 'telephonoOpcional',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
        {
          tipo: 'pattern',
          valor: REGEX_TELEFONO_OPCIONAL,
          mensaje: 'El dato no esta conforme al formato esperado',
        },
        {
          tipo: 'maxlength',
          valor: 30
        }
      ],
      marcadorDePosicion: '',
      marginTop: 3,
    }
  ];

  /**
 * DATOS_ALERT:
 * Contiene un mensaje de alerta que se muestra al usuario.
 * 
 * - message: Mensaje en formato HTML que indica al usuario que debe capturar
 *   la descripción de la mercancía en los mismos términos de la carta de donación.
 */
export const DATOS_ALERT = {
  message: `
  <div class="text-center">
    <p>Debes capturar la descripción de la mercancía en los mismos términos de la carta de donación.</p>
  </div>
  `,
};

/**
 * Arreglo de configuraciones de columnas para mostrar los detalles de un producto.
 * Cada objeto define la información que se mostrará en la tabla de productos, incluyendo:
 * - El encabezado de la columna.
 * - La clave o función para obtener el valor correspondiente del producto.
 * - El orden en el que se mostrará la columna.
 *
 * @type {ConfiguracionColumna<DetallesDelProducto>[]}
 * 
 * @ejemplo
 * Este arreglo puede ser utilizado para generar dinámicamente las columnas de una tabla
 * que muestre información relevante sobre los productos en el trámite 302.
 */
export const DATOS_DEL_PRODUCTO : ConfiguracionColumna<DetallesDelProducto>[] = [
      {
        encabezado: 'Tipo de mercancía',
        clave: (item: DetallesDelProducto) => item.tipoDeMercancia,
        orden: 1,
      },
      { 
        encabezado: 'Cantidad',
        clave: (item: DetallesDelProducto) => item.cantidad,
        orden: 2
      },
      {
        encabezado: 'Unidad de medida de comercialización',
        clave: (item: DetallesDelProducto) => item.unidadDeMedida,
        orden: 3,
      },
      {
        encabezado: 'Año de importación temporal',
        clave: (item: DetallesDelProducto) => item.anoDeImportacionTemporal,
        orden: 4,
      },
      {
        encabezado: 'Modelo',
        clave: (item: DetallesDelProducto) => item.modelo,
        orden: 5,
      },
      {
        encabezado: 'Marca',
        clave: (item: DetallesDelProducto) => item.marca,
        orden: 6,
      },
      {
        encabezado: 'Número de serie',
        clave: (item: DetallesDelProducto) => item.numeroDeSerie,
        orden: 7,
      },
      {
        encabezado: 'Condición de la mercancía',
        clave: (item: DetallesDelProducto) => item.condicionDeLaMercancia,
        orden: 8,
      },
    ];
