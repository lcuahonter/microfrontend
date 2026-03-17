import {
  REGEX_DIGITOS,
  REGEX_PERMITE_11_2_DIGITS,
  REGEX_PERMITE_11_3_DIGITS,
  REGEX_SOLO_DIGITOS
} from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { Partidas } from '../models/importacion-definitiva.model';

/**
 * @constant DATOS_DEL_TRAMITE_REALIZAR
 * @description
 * Este objeto define la configuración de los campos del formulario para los datos del trámite realizar
 * en el proceso de importación definitiva. Cada campo incluye propiedades como el identificador,
 * nombre del campo, tipo de entrada, validadores, y opciones dinámicas.
 *
 * Funcionalidad:
 * - Define los campos del formulario con sus respectivas configuraciones.
 * - Permite la validación y renderización dinámica de los campos en el formulario.
 *
 * Campos:
 * - `solicitud`: Campo de tipo radio para seleccionar la solicitud inicial.
 * - `regimen`: Campo de tipo select-catalogos para seleccionar el régimen de la mercancía.
 * - `clasificacion`: Campo de tipo select-catalogos para seleccionar la clasificación del régimen.
 *
 * @example
 * const solicitudField = DATOS_DEL_TRAMITE_REALIZAR.find(field => field.id === 'solicitud');
 * console.log(solicitudField.labelNombre); // "Solicitud"
 */
export const DATOS_DEL_TRAMITE_REALIZAR = [
  {
    id: 'solicitud',
    labelNombre: 'Solicitud',
    campo: 'solicitud',
    clase: 'col-md-4',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: 'inicial',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Inicial',
        value: 'inicial',
      },
    ],
  },
  {
    id: 'regimen',
    labelNombre: 'Régimen al que se destinará la mercancía',
    campo: 'regimen',
    clase: 'col-md-8',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marginTop: 0,
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
    marginTop: 0,
  },
  {
    id: 'clasificacion',
    labelNombre: 'Clasificación del régimen',
    campo: 'clasificacion',
    clase: 'col-md-8',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marginTop: 0,
  },
];

/**
 * @constant DATOS_DE_LA_MERCANCIA
 * @description
 * Este objeto define la configuración de los campos del formulario para los datos de la mercancía
 * en el proceso de importación definitiva. Cada campo incluye propiedades como el identificador,
 * nombre del campo, tipo de entrada, validadores, y opciones dinámicas.
 *
 * Funcionalidad:
 * - Define los campos del formulario con sus respectivas configuraciones.
 * - Permite la validación y renderización dinámica de los campos en el formulario.
 *
 * Campos:
 * - `producto`: Campo de tipo radio para seleccionar si el producto es nuevo o usado.
 * - `descripcion`: Campo de tipo textarea para describir la mercancía.
 * - `fraccion_arancelaria`: Campo de tipo select-catalogos para seleccionar la fracción arancelaria.
 * - `unidad_de_medida`: Campo de tipo select-catalogos para seleccionar la unidad de medida.
 * - `cantidad`: Campo de tipo number para ingresar la cantidad de la mercancía.
 * - `valor_factura_USD`: Campo de tipo number para ingresar el valor de la factura en USD.
 *
 * @example
 * const productoField = DATOS_DE_LA_MERCANCIA.find(field => field.id === 'producto');
 * console.log(productoField.labelNombre); // "Producto"
 */
export const DATOS_DE_LA_MERCANCIA = [
  {
    id: 'producto',
    labelNombre: 'Producto',
    campo: 'producto',
    clase: 'col-md-4',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: 'nuevo',
    marginTop: 0,
    layout: 'vertical',
    opciones: [
      {
        label: 'Nuevo',
        value: 'nuevo',
      },
      {
        label: 'Usado',
        value: 'usado',
      },
    ],
  },
  {
    id: 'descripcion',
    labelNombre: 'Descripción de la mercancía',
    campo: 'descripcion',
    clase: 'col-md-8',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
    validadores: [
      {
        tipo: 'required'
      },
      {
        tipo: 'maxlength',
        valor: 250,
        mensaje: 'Máximo 250 caracteres permitidos',
      },
    ],
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'fraccion_arancelaria',
    labelNombre: 'Fracción Arancelaria',
    campo: 'fraccion_arancelaria',
    clase: 'col-md-12',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marginTop: 0,
  },
  {
    id: 'unidad_de_medida',
    labelNombre: 'Unidad de medida',
    campo: 'unidad_de_medida',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marginTop: 0,
  },
  {
    id: 'cantidad',
    labelNombre: 'Cantidad',
    campo: 'datos_cantidad',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },

      {
        tipo: 'pattern',
        valor: REGEX_DIGITOS,
        mensaje: 'Por favor, escribe un número entero válido',
      },

      {
        tipo: 'pattern',
        valor: REGEX_PERMITE_11_3_DIGITS,
        mensaje: 'Este campo permite 11 enteros y tres decimales',
      },
    ],
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'valor_factura_USD',
    labelNombre: 'Valor factura USD',
    campo: 'valor_factura_USD',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
   validadores: [
      { tipo: 'required' },

      {
        tipo: 'pattern',
        valor: REGEX_DIGITOS,
        mensaje: 'Por favor, escribe un número entero válido',
      },

      {
        tipo: 'pattern',
        valor: REGEX_PERMITE_11_2_DIGITS,
        mensaje: 'Este campo permite 11 enteros y tres decimales',
      },
    ],
    marcadorDePosicion: '',
    marginTop: 0,
  },
];

/**
 * @constant PARTIDAS_DE_LA_MERCANCIA
 * @description
 * Este objeto define la configuración de los campos del formulario para las partidas de la mercancía
 * en el proceso de importación definitiva. Cada campo incluye propiedades como el identificador,
 * nombre del campo, tipo de entrada, validadores, y opciones dinámicas.
 *
 * Funcionalidad:
 * - Define los campos del formulario con sus respectivas configuraciones.
 * - Permite la validación y renderización dinámica de los campos en el formulario.
 *
 * Campos:
 * - `cantidad`: Campo de tipo number para ingresar la cantidad de la mercancía.
 * - `fraccion_arancelaria_tigie`: Campo de tipo number para ingresar la fracción arancelaria TIGIE.
 * - `seleccion_fraccion`: Campo de tipo select-catalogos para seleccionar una fracción específica.
 * - `descripcion`: Campo de tipo textarea para describir la mercancía.
 * - `valor_partida_usd`: Campo de tipo number para ingresar el valor de la partida en USD.
 *
 * @example
 * const cantidadField = PARTIDAS_DE_LA_MERCANCIA.find(field => field.id === 'cantidad');
 * console.log(cantidadField.labelNombre); // "Cantidad"
 */
export const PARTIDAS_DE_LA_MERCANCIA = [
  {
    id: 'partidas_cantidad',
    labelNombre: 'Cantidad',
    campo: 'partidas_cantidad',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      { tipo: 'pattern', valor: REGEX_SOLO_DIGITOS, mensaje: 'Por favor, escribe un número entero válido' }
    ],
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'fraccion_arancelaria_tigie',
    labelNombre: 'Fracción Arancelaria TIGIE',
    campo: 'fraccion_arancelaria_tigie',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      { tipo: 'pattern', valor: REGEX_SOLO_DIGITOS, mensaje: 'Por favor, escribe un número entero válido' }
    ],
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'seleccion_fraccion',
    labelNombre: '',
    campo: 'seleccion_fraccion',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: '' }],
    marcadorDePosicion: 'Selecciona una fracción',
    opciones: [
      {
        id: 1,
        descripcion: '87033302 Usados.',
      },
    ],
    marginTop: 0,
  },
  {
    id: 'partidas_descripcion',
    labelNombre: 'Descripción',
    campo: 'partidas_descripcion',
    clase: 'col-md-8',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
    validadores: [
      {
        tipo: 'required'
      },
      {
        tipo:'maxlength',
         valor:250
      }
    ],
    marcadorDePosicion: '',
    marginTop: 0
  },
  {
    id: 'partidas_valor_factura_USD',
    labelNombre: 'Valor partida USD',
    campo: 'partidas_valor_factura_USD',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      { tipo: 'pattern', valor: REGEX_SOLO_DIGITOS, mensaje: 'Por favor, escribe un número entero válido' }
    ],
    marcadorDePosicion: '',
    marginTop: 0,
  }
];

/**
 * @constant USO_ESPECIFICO_DE_LA_MERCANCIA
 * @description
 * Este objeto define la configuración de los campos del formulario para el uso específico de la mercancía
 * en el proceso de importación definitiva. Cada campo incluye propiedades como el identificador,
 * nombre del campo, tipo de entrada, validadores, y opciones dinámicas.
 *
 * Funcionalidad:
 * - Define los campos del formulario con sus respectivas configuraciones.
 * - Permite la validación y renderización dinámica de los campos en el formulario.
 *
 * Campos:
 * - `fraccion_arancelaria`: Campo de tipo select-catalogos para especificar la fracción arancelaria del producto.
 * - `descripcion`: Campo de tipo textarea para describir el nombre comercial o técnico del producto.
 *
 * @example
 * const fraccionField = USO_ESPECIFICO_DE_LA_MERCANCIA.find(field => field.id === 'fraccion_arancelaria');
 * console.log(fraccionField.labelNombre); // "Fracción arancelaria PROSEC"
 */
export const USO_ESPECIFICO_DE_LA_MERCANCIA = [
  {
    id: 'uso_fraccion_arancelaria',
    labelNombre:
      'Fracción arancelaria PROSEC (Especificar la fracción arancelaria del producto en el que se utilizará la mercancía a importar)',
    campo: 'uso_fraccion_arancelaria',
    clase: 'col-md-8',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marginTop: 0,
    tooltipQuestionCircle: true,
  },
  {
    id: 'uso_descripcion',
    labelNombre:
      'Descripción fracción PROSEC (Especificar el nombre comercial o técnico del producto en el que se utilizará la mercancía a importar)',
    campo: 'uso_descripcion',
    clase: 'col-md-8',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    marginTop: 0,
    tooltipQuestionCircle: true,
  },
];

/**
 * @constant CRITERIO_DE_DICTAMEN_DE_REGLA_OCTAVA
 * @description
 * Este objeto define la configuración de los campos del formulario para el criterio de dictamen
 * de la regla octava en el proceso de importación definitiva. Cada campo incluye propiedades como
 * el identificador, nombre del campo, tipo de entrada, validadores, y opciones dinámicas.
 *
 * Funcionalidad:
 * - Define los campos del formulario con sus respectivas configuraciones.
 * - Permite la validación y renderización dinámica de los campos en el formulario.
 *
 * Campos:
 * - `solicitud_mercancia`: Campo de tipo select-catalogos para seleccionar la solicitud de mercancía.
 * - `criterio_de_dictamen`: Campo de tipo textarea para mostrar el criterio de dictamen seleccionado.
 *
 * @example
 * const solicitudField = CRITERIO_DE_DICTAMEN_DE_REGLA_OCTAVA.find(field => field.id === 'solicitud_mercancia');
 * console.log(solicitudField.labelNombre); // "Solicitud mercancia esquema regla octava clave"
 */
export const CRITERIO_DE_DICTAMEN_DE_REGLA_OCTAVA = [
  {
    id: 'solicitud_mercancia',
    labelNombre: 'Solicitud mercancia esquema regla octava clave',
    campo: 'solicitud_mercancia',
    clase: 'col-md-8',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marginTop: 0,
  },
  {
    id: 'criterio_de_dictamen',
    labelNombre: 'Criterio de dictamen de regla octava seleccionado',
    campo: 'criterio_de_dictamen',
    clase: 'col-md-8',
    tipoInput: 'textarea',
    desactivado: true,
    soloLectura: false,
    validadores: [{ tipo: '' }],
    marcadorDePosicion: '',
    marginTop: 0,
  },
];

/**
 * @constant SELECCION
 * @description
 * Este objeto define las constantes utilizadas para la selección en el proceso de importación definitiva.
 *
 * Funcionalidad:
 * - Proporciona una constante para seleccionar todos los elementos.
 *
 * Campos:
 * - `SELECT_ALL`: Constante utilizada para seleccionar todos los elementos.
 *
 * @example
 * console.log(SELECCION.SELECT_ALL); // "selectAll"
 */
export const SELECCION = {
  SELECT_ALL: 'selectAll',
};

/**
 * @constant CROSLISTA_DE_PAISES
 * @description
 * Este arreglo define una lista de países utilizados en el proceso de importación definitiva.
 *
 * Funcionalidad:
 * - Proporciona una lista de países para ser utilizados en formularios o configuraciones relacionadas.
 *
 * Campos:
 * - `ESTADOS UNIDOS DE AMERICA`: País incluido en la lista.
 * - `CANADA`: País incluido en la lista.
 *
 * @example
 * console.log(CROSLISTA_DE_PAISES); // ["ESTADOS UNIDOS DE AMERICA", "CANADA"]
 */
export const CROSLISTA_DE_PAISES: string[] = [
  'ESTADOS UNIDOS DE AMERICA',
  'CANADA',
];

/**
 * @constant PAIS_PROCEDENCIA
 * @description
 * Este objeto define la configuración de los campos del formulario para el país de procedencia
 * en el proceso de importación definitiva. Cada campo incluye propiedades como el identificador,
 * nombre del campo, tipo de entrada, validadores, y opciones dinámicas.
 *
 * Funcionalidad:
 * - Define los campos del formulario con sus respectivas configuraciones.
 * - Permite la validación y renderización dinámica de los campos en el formulario.
 *
 * Campos:
 * - `bloque`: Campo de tipo select-catalogos para seleccionar un bloque de países.
 * - `todos_los_paises`: Campo de tipo botón para seleccionar todos los países.
 *
 * @example
 * const bloqueField = PAIS_PROCEDENCIA.find(field => field.id === 'bloque');
 * console.log(bloqueField.labelNombre); // "Bloque"
 */
export const PAIS_PROCEDENCIA = [
  {
    id: 'bloque',
    labelNombre: 'Bloque',
    campo: 'bloque',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: '' }],
    marginTop: 0,
  },
  {
    id: 'todos_los_paises',
    labelNombre: 'Todos los países',
    campo: 'todos_los_paises',
    clase: 'col-md-8',
    tipoInput: 'button',
    desactivado: false,
    marginTop: 5,
  },
];

/**
 * @constant REPRESENTACION_FEDERAL
 * @description
 * Este objeto define la configuración de los campos del formulario para la representación federal
 * en el proceso de importación definitiva. Cada campo incluye propiedades como el identificador,
 * nombre del campo, tipo de entrada, validadores, y opciones dinámicas.
 *
 * Funcionalidad:
 * - Define los campos del formulario con sus respectivas configuraciones.
 * - Permite la validación y renderización dinámica de los campos en el formulario.
 *
 * Campos:
 * - `entidad`: Campo de tipo select-catalogos para seleccionar la entidad federativa.
 * - `reprsentation_federal`: Campo de tipo select-catalogos para seleccionar la representación federal.
 *
 * @example
 * const entidadField = REPRESENTACION_FEDERAL.find(field => field.id === 'entidad');
 * console.log(entidadField.labelNombre); // "Entidad federativa"
 */
export const REPRESENTACION_FEDERAL = [
  {
    id: 'Entidad federativa*:',
    labelNombre: 'Entidad federativa',
    campo: 'entidad',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marginTop: 0,
  },
  {
    id: 'reprsentation_federal',
    labelNombre: 'Representación federal',
    campo: 'reprsentation_federal',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Selecciona una opcion',
    marginTop: 0,
  },
];
/*
* @constant MODIFICAR_PARTIDAS_FORM
*/
export const MODIFICAR_PARTIDAS_FORM = [
  {
    id: 'cantidad_partidas',
    labelNombre: 'Cantidad',
    campo: 'cantidad_partidas',
    clase: 'col-md-4',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    marginTop: 0,
  },
   {
    id: 'descripcion_partidas',
    labelNombre: 'Descripción',
    campo: 'descripcion_partidas',
    clase: 'col-md-8',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
    validadores: [
      {
        tipo: 'required',
        mensaje: '',
      },
    ],
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'valor_partidas_usd',
    labelNombre: 'Valor partida USD',
    campo: 'valor_partidas_usd',
    clase: 'col-md-4',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'fraccion_partidas',
    labelNombre: 'Fracción arancelaria TIGIE',
    campo: 'fraccion_partidas',
    clase: 'col-md-8',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: '' }],
    marcadorDePosicion: 'Selecciona una fracción',
    opciones: [
      {
        id: 1,
        descripcion: '87033302 Usados.',
      },
    ],
    marginTop: 0,
  },
 
 
];

/**
 * @constant ENCABEZADO_TABLA
 * @description
 * Define la configuración de las columnas para la tabla de partidas en el proceso de importación definitiva.
 * @type {ConfiguracionColumna<Partidas>[]}
 */
export const ENCABEZADO_TABLA: ConfiguracionColumna<Partidas>[] = [
    { encabezado: 'ID', clave: (artículo) => artículo.id, orden: 1 },
    {
      encabezado: 'Fracción Arancelaria',
      clave: (artículo) => artículo.fraccionArancelariaProsec,
      orden: 2,
    },
    {
      encabezado: 'Descripción',
      clave: (artículo) => artículo.descripcion,
      orden: 3,
    },
  ]

  /**
 * @constant PARTIDAS_COLUMN_TABLA
 * @description
 * Define la configuración de las columnas para la tabla de partidas en el proceso de importación definitiva.
 * @type {ConfiguracionColumna<Partidas>[]}
 */
  export const PARTIDAS_COLUMN_TABLA: ConfiguracionColumna<Partidas>[] = [
      { encabezado: '', clave: (artículo) => artículo.id, orden: 1 },
      {
        encabezado: 'Cantidad',
        clave: (artículo) => artículo.cantidad,
        orden: 1,
      },
      {
        encabezado: 'Unidad de medida',
        clave: (artículo) => artículo.unidadDeMedida,
        orden: 2,
      },
      {
        encabezado: 'Fracción Arancelaria',
        clave: (artículo) => artículo.fraccionArancelariaTigie,
        orden: 3,
      },
      {
        encabezado: 'Descripción',
        clave: (artículo) => artículo.descripcion,
        orden: 4,
      },
      {
        encabezado: 'Precio unitario USD',
        clave: (artículo) => artículo.precioUnitario,
        orden: 5,
      },
      {
        encabezado: 'Total USD',
        clave: (artículo) => artículo.totalUsd,
        orden: 6,
      },
    ];
    /**
 * @description Constante que contiene datos prellenados para la tabla de usos específicos.
 * Cada objeto representa una fila con sus respectivos campos: id, fracción arancelaria PROSEC y descripción.
 */
    export const PREFILL_USO: Partidas[] = [
      {
        id: 10,
        fraccionArancelariaProsec: '12345678',
        descripcion: 'Nueva descripción',
      }
    ];

    /**
 * Opciones de productos para la solicitud.
 * Cada opción incluye una etiqueta y un valor asociado.
 * 
 */ 
export const PRODUCTO_OPCION = [
    {
        /** Etiqueta para la opción "Nuevo" */
        label: 'Nuevo',
        /** Valor asociado a la opción "Nuevo" */
        value: 'CONDMER.N'
    },
    {
        /** Etiqueta para la opción "Usado" */
        label: 'Usado',
        /** Valor asociado a la opción "Usado" */
        value: 'CONDMER.U'
    }
];

/**
 * Opciones de opiniones para la solicitud.
 */
export const OPINIONES_SOLICITUD = [{
    /** Etiqueta para la opción "Inicial" */
    label: 'Inicial', value: 'TISOL.I'
}];

/**
 * Plantilla HTML utilizada para mostrar un mensaje de error en el formulario
 * cuando existen campos obligatorios sin capturar.
 */
export const FORM_ERROR_ALERT = `<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
     <b>¡Error de registro!</b> Faltan campos por capturar.
    </div>
  </div>
</div>
`

/**
 * Genera una plantilla HTML con un mensaje de error personalizado relacionado
 * con el proceso de cálculo.
 */
export const CALCULATE_ALERT_ERROR = (mensajeDeError: string): string => `<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
     <p style="color: #000000;">Corrija los siguientes errores:</p>
     <ol><li style="color: #b72222;"> ${mensajeDeError} </li></ol>
    </div>
  </div>
</div>
`

/** Genera el mensaje HTML para registro exitoso
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado al momento en que ésta sea firmada.</p>`;
