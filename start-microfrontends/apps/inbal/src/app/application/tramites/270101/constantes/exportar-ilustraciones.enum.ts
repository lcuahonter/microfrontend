import { AduanaDeSalida, DatosDelSolicitud } from "../models/exportar-ilustraciones.model";
import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";

/**
  * @constant DATOS_DE_LA_SOLICICTUD
  * @type {Record<string, string>}
  * @description
  * Este objeto contiene las claves y descripciones de los campos relacionados con los datos de la solicitud. 
  * Se utiliza para mapear los nombres de los campos con sus descripciones legibles.
  * 
  * Funcionalidad:
  * - Proporciona una referencia centralizada para los nombres y descripciones de los campos.
  * - Facilita la reutilización y consistencia en la aplicación.
  * 
  * @example
  * console.log(DATOS_DE_LA_SOLICICTUD.AUTOR);
  * // Salida: 'Autor'
  */
export const DATOS_DE_LA_SOLICICTUD = {
  AUTOR: 'Autor',
  TITULO: 'Titulo',
  TECNICA_DE_REALIZACION: 'Técnica de realización',
  CON_MARCO: 'Con marco',
  ANCHO: 'Ancho (centímetros)',
  ALTO: 'Alto (centímetros)',
  PROFUNDIDAD: 'Profunded (centímetros)',
  DIAMETRO: 'Diametro (centímetros)',
  VARIABLES: 'Variables',
  ANO_DE_CREACION: 'Año de creación',
  AVALUO: 'Avalúo',
  MONEDA: 'Moneda',
  PROPIETARIO: 'Propietario',
  FRACCION_ARANCELARIA: 'Fracción arancelaria',
  DESCRIPCION: 'Descripción de la fracción arancelaria',
};

/**
  * @constant INFORMACION_DE_LA_OBRA_ARTE
  * @type {Array<Record<string, unknown>>}
  * @description
  * Este arreglo contiene la configuración de los campos dinámicos relacionados con la información de la obra de arte. 
  * Se utiliza para definir las propiedades de cada campo, como su tipo, validadores, y valores predeterminados.
  * 
  * Funcionalidad:
  * - Proporciona una referencia centralizada para la configuración de los campos de la obra de arte.
  * - Facilita la generación dinámica de formularios y la reutilización de la configuración.
  * 
  * @example
  * console.log(INFORMACION_DE_LA_OBRA_ARTE[0].labelNombre);
  * // Salida: 'Autor'
  */
export const INFORMACION_DE_LA_OBRA_ARTE = [
  {
    id: 'autor',
    labelNombre: 'Autor',
    campo: 'autor',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Selecciona un valor',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'titulo',
    labelNombre: 'Titulo',
    campo: 'titulo',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Inserta titulo',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'technicaDeRealizacion',
    labelNombre: 'Técnica de realización',
    campo: 'technicaDeRealizacion',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Inserta técnica de realización',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'medidas',
    labelNombre: 'Medidas',
    campo: 'medidas',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: 'con',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Con marco',
        value: 'con',
      },
      {
        label: 'Sin marco',
        value: 'sin',
      },
    ],
  },
  {
    id: 'alto',
    labelNombre: 'Alto (centímetros)',
    campo: 'alto',
    clase: 'col-md-4',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '0.00',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'ancho',
    labelNombre: 'Ancho (centímetros)',
    campo: 'ancho',
    clase: 'col-md-4',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '0.00',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'profundidad',
    labelNombre: 'Profundidad (centímetros)',
    campo: 'profundidad',
    clase: 'col-md-4',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '0.00',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'diametro',
    labelNombre: 'Diametro (centímetros)',
    campo: 'diametro',
    clase: 'col-md-4',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '0.00',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'variables',
    labelNombre: 'Variables',
    campo: 'variables',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Inserta variables',
    valorPredeterminado: '',
    marginTop: 0,
  }
];

/**
  * @constant PERIODO_EN_EL_QUE_PERMANECERA
  * @type {Array<Record<string, unknown>>}
  * @description
  * Este arreglo contiene la configuración de los campos dinámicos relacionados con el periodo en el que permanecerá 
  * en el extranjero durante el proceso de exportación. Define las propiedades de cada campo, como su tipo, validadores, 
  * y valores predeterminados.
  * 
  * Funcionalidad:
  * - Proporciona una referencia centralizada para la configuración de los campos del periodo en el extranjero.
  * - Facilita la generación dinámica de formularios y la reutilización de la configuración.
  * 
  * @example
  * console.log(PERIODO_EN_EL_QUE_PERMANECERA[0].labelNombre);
  * // Salida: 'Fecha inicio'
  */
export const PERIODO_EN_EL_QUE_PERMANECERA = [
  {
      id: 'fecha_inicio',
      labelNombre: 'Fecha inicio',
      campo: 'fecha_inicio',
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
      id: 'fecha_fin',
      labelNombre: 'Fecha fin',
      campo: 'fecha_fin',
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
      id: 'responsable_exportacion',
      labelNombre: 'Responsable de la exportación',
      campo: 'responsable_exportacion',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [{ tipo: 'required' }],
      marcadorDePosicion: '',
      valorPredeterminado: '',
      marginTop: 0,
  }
];

/**
  * @constant MOTIVO_DE_LA_EXPORTACION
  * @type {Array<Record<string, unknown>>}
  * @description
  * Este arreglo contiene la configuración de los campos dinámicos relacionados con el motivo de la exportación. 
  * Define las propiedades de cada campo, como su tipo, validadores y valores predeterminados.
  * 
  * Funcionalidad:
  * - Proporciona una referencia centralizada para la configuración de los campos del motivo de la exportación.
  * - Facilita la generación dinámica de formularios y la reutilización de la configuración.
  * 
  * @example
  * console.log(MOTIVO_DE_LA_EXPORTACION[0].labelNombre);
  * // Salida: 'Motivo'
  */
export const MOTIVO_DE_LA_EXPORTACION = [
  {
    id: 'motivo',
    labelNombre: 'Motivo',
    campo: 'motivo',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Selecciona un valor',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'nombre',
    labelNombre: 'Nombre',
    campo: 'nombre',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    mostrar: false
  },
]

/**
  * @constant LUGAR_DE_DESTINO
  * @type {Array<Record<string, unknown>>}
  * @description
  * Este arreglo contiene la configuración de los campos dinámicos relacionados con el motivo de la exportación. 
  * Define las propiedades de cada campo, como su tipo, validadores y valores predeterminados.
  * 
  * Funcionalidad:
  * - Proporciona una referencia centralizada para la configuración de los campos del motivo de la exportación.
  * - Facilita la generación dinámica de formularios y la reutilización de la configuración.
  * 
  * @example
  * console.log(LUGAR_DE_DESTINO[0].labelNombre);
  * // Salida: 'Motivo'
  */
export const LUGAR_DE_DESTINO = [
  {
    id: 'pais',
    labelNombre: 'País',
    campo: 'pais',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Selecciona un valor',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'ciudad',
    labelNombre: 'Ciudad',
    campo: 'ciudad',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  },
  {
    id: 'sede',
    labelNombre: 'Sede',
    campo: 'sede',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  },
]

/**
  * @constant ITINERARIO_DE_EXPORTACION
  * @type {Array<Record<string, unknown>>}
  * @description
  * Este arreglo contiene la configuración de los campos dinámicos relacionados con el motivo de la exportación. 
  * Define las propiedades de cada campo, como su tipo, validadores y valores predeterminados.
  * 
  * Funcionalidad:
  * - Proporciona una referencia centralizada para la configuración de los campos del motivo de la exportación.
  * - Facilita la generación dinámica de formularios y la reutilización de la configuración.
  * 
  * @example
  * console.log(ITINERARIO_DE_EXPORTACION[0].labelNombre);
  * // Salida: 'Motivo'
  */
export const ITINERARIO_DE_EXPORTACION = [
  {
    id: 'tipoItinerario',
    labelNombre: 'Tipo itinerario',
    campo: 'tipoItinerario',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: true,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '1',
    marginTop: 0,
    opciones: [
      {
        id: 1, descripcion: 'Traslado'
      }
    ]
  },
  {
    id: 'ciudad',
    labelNombre: 'Ciudad',
    campo: 'ciudad',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
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
    id: 'tipoDeTraslado',
    labelNombre: 'Tipo de traslado',
    campo: 'tipoDeTraslado',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  },
  {
    id: 'observaciones',
    labelNombre: 'Observaciones',
    campo: 'observaciones',
    clase: 'col-md-8',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  },
  {
    id: 'fechaInicio',
    labelNombre: 'Fecha inicio',
    campo: 'fechaInicio',
    clase: 'col-md-4',
    tipoInput: 'date',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    habilitado: true
  },
  {
    id: 'fechaFin',
    labelNombre: 'Fecha fin',
    campo: 'fechaFin',
    clase: 'col-md-4',
    tipoInput: 'date',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    habilitado: true
  },
]

/**
  * @constant ITINERARIO_DE_EXPORTACION_MAXIMO
  * @type {Array<Record<string, unknown>>}
  * @description
  * Este arreglo contiene la configuración de los campos dinámicos relacionados con el motivo de la exportación. 
  * Define las propiedades de cada campo, como su tipo, validadores y valores predeterminados.
  * 
  * Funcionalidad:
  * - Proporciona una referencia centralizada para la configuración de los campos del motivo de la exportación.
  * - Facilita la generación dinámica de formularios y la reutilización de la configuración.
  * 
  * @example
  * console.log(ITINERARIO_DE_EXPORTACION_MAXIMO[0].labelNombre);
  * // Salida: 'Motivo'
  */
export const ITINERARIO_DE_EXPORTACION_MAXIMO = [
  {
    id: 'tipoItinerario',
    labelNombre: 'Tipo itinerario',
    campo: 'tipoItinerario',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: true,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Selecciona un valor',
    valorPredeterminado: '1',
    marginTop: 0,
    opciones: [
      {
        id: 1, descripcion: 'Traslado'
      }
    ]
  },
  {
    id: 'ciudad',
    labelNombre: 'Ciudad',
    campo: 'ciudad',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  },
  {
    id: 'nombre',
    labelNombre: 'Nombre de Sede',
    campo: 'nombre',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  },
  {
    id: 'observaciones',
    labelNombre: 'Observaciones',
    campo: 'observaciones',
    clase: 'col-md-9',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  },
  {
    id: 'fechaDeExhibicion',
    labelNombre: 'Fecha de exhibicion',
    campo: 'fechaDeExhibicion',
    clase: 'col-md-4',
    tipoInput: 'date',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    habilitado: true
  },
  {
    id: 'fechaInicio',
    labelNombre: 'Fecha inicio',
    campo: 'fechaInicio',
    clase: 'col-md-4',
    tipoInput: 'date',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    habilitado: true
  },
  {
    id: 'fechaFin',
    labelNombre: 'Fecha fin',
    campo: 'fechaFin',
    clase: 'col-md-4',
    tipoInput: 'date',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    habilitado: true
  },
]

/**
  * @constant PAGO_DE_DERECHOS
  * @type {Array<Record<string, unknown>>}
  * @description
  * Este arreglo contiene la configuración de los campos dinámicos relacionados con el motivo de la exportación. 
  * Define las propiedades de cada campo, como su tipo, validadores y valores predeterminados.
  * 
  * Funcionalidad:
  * - Proporciona una referencia centralizada para la configuración de los campos del motivo de la exportación.
  * - Facilita la generación dinámica de formularios y la reutilización de la configuración.
  * 
  * @example
  * console.log(PAGO_DE_DERECHOS[0].labelNombre);
  * // Salida: 'Motivo'
  */
export const PAGO_DE_DERECHOS = [
  {
    id: 'claveDeReferencia',
    labelNombre: 'Clave de referencia',
    campo: 'claveDeReferencia',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '144000786',
    marginTop: 0
  },
  {
    id: 'cadenaDeLaDependencia',
    labelNombre: 'Cadena de la dependencia',
    campo: 'cadenaDeLaDependencia',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '04055740400001',
    marginTop: 0
  },
  {
    id: 'banco',
    labelNombre: 'Banco',
    campo: 'banco',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Selecciona un valor',
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
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  },
  {
    id: 'fechaDePago',
    labelNombre: 'Fecha de pago',
    campo: 'fechaDePago',
    clase: 'col-md-4',
    tipoInput: 'date',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    habilitado: true
  },
  {
    id: 'importeDePago',
    labelNombre: 'Importe de pago',
    campo: 'importeDePago',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '40',
    marginTop: 0
  },
]

/**
  * @constant OBRA_DE_ARTE_ALERT
  * @type {string}
  * @description
  * Este mensaje de alerta informa al usuario sobre la importancia de proporcionar las medidas de cada pieza 
  * para evitar afectar la dictaminación de su solicitud.
  * 
  * @example
  * console.log(OBRA_DE_ARTE_ALERT);
  * // Salida: 'Nota: Es indispensable proporcionar las medidas de cada pieza, ya que de no hacerlo se puede afectar la dictaminación de su solicitud'
  */
export const OBRA_DE_ARTE_ALERT =
  'Nota: Es indispensable proporcionar las medidas de cada pieza, ya que de no hacerlo se puede afectar la dictaminación de su solicitud';

  /**
  * @constant ADUANA_ALERT
  * @type {string}
  * @description
  * Este mensaje de alerta informa al usuario sobre el proceso para agregar datos del traslado y la sede, 
  * indicando que a cada traslado le corresponde una sede con un máximo de dos itinerarios.
  * 
  * @example
  * console.log(ADUANA_ALERT);
  * // Salida: 'Agrega los datos del traslado y, posteriormente, siguiendo el mismo proceso, agrega la sede. A cada traslado le corresponde una sede (máximo 2 itinerarios).'
  */
export const ADUANA_ALERT =
'Agrega los datos del traslado y, posteriormente, siguiendo el mismo proceso, agrega la sede. A cada traslado le corresponde una sede (máximo 2 itinerarios).';

/**
  * @constant ERROR_DE_REGISTRO_ALERT
  * @type {string}
  * @description
  * Este mensaje de alerta informa al usuario sobre el proceso para agregar datos del traslado y la sede, 
  * indicando que a cada traslado le corresponde una sede con un máximo de dos itinerarios.
  */
export const ERROR_DE_REGISTRO_ALERT =
'<strong>¡Error de registro! </strong>En el itinerario de la exportación y transportacion a cada translado le corresponde una sede.';

/**
  * @constant ERROR_FORMA_ALERT
  * @type {string}
  * @description
  * Este mensaje de alerta informa al usuario sobre el proceso para agregar datos del traslado y la sede, 
  * indicando que a cada traslado le corresponde una sede con un máximo de dos itinerarios.
  */
export const ERROR_FORMA_ALERT =
'<strong>¡Error de registro! </strong>Faltan campos por capturar.';

/**
* Constantes para el manejo de los pasos del wizard de cupos
* @type {ConfiguracionColumna<>[AduanaDeSalida]}
* @description Configuración de las columnas para la tabla de cupos
*/
export const CONFIGURACION_ADUANA_DE_TABLA: ConfiguracionColumna<AduanaDeSalida>[] = [
    {
      encabezado: 'Tipo',
      clave: (item: AduanaDeSalida) => item.tipo,
      orden: 1,
    },
    {
      encabezado: 'Tipo ciudad',
      clave: (item: AduanaDeSalida) => item.ciudad,
      orden: 2,
    },
    {
      encabezado: 'Sede',
      clave: (item: AduanaDeSalida) => item.sede,
      orden: 3,
    },
    {
      encabezado: 'Tipo traslado',
      clave: (item: AduanaDeSalida) => item.tipoDeTraslado,
      orden: 4,
    },
    {
      encabezado: 'Fecha exhibición',
      clave: (item: AduanaDeSalida) => item.fechaExhibicion,
      orden: 5,
    },
    {
      encabezado: 'Observaciones',
      clave: (item: AduanaDeSalida) => item.observaciones,
      orden: 6,
    },
    {
      encabezado: 'Fecha inicio',
      clave: (item: AduanaDeSalida) => item.fechoInicio,
      orden: 6,
    },
    {
      encabezado: 'Fecha fin',
      clave: (item: AduanaDeSalida) => item.fechaFin,
      orden: 6,
    },
  ];

  /**
   * /**
* Constantes para el manejo de los pasos del wizard de cupos
* @type {ConfiguracionColumna<>[DatosDelSolicitud]}
* @description Configuración de las columnas para la tabla de cupos
*/
export const CONFIGURACION_DATOS_SOLICITUD_DE_TABLA: ConfiguracionColumna<DatosDelSolicitud>[] = [
    {
      encabezado: DATOS_DE_LA_SOLICICTUD.AUTOR,
      clave: (item: DatosDelSolicitud) => item.autor,
      orden: 1,
    },
    {
      encabezado: DATOS_DE_LA_SOLICICTUD.TITULO,
      clave: (item: DatosDelSolicitud) => item.titulo,
      orden: 2,
    },
    {
      encabezado:
      DATOS_DE_LA_SOLICICTUD.TECNICA_DE_REALIZACION,
      clave: (item: DatosDelSolicitud) => item.tecnicaDeRealizacion,
      orden: 3,
    },
    {
      encabezado:
      DATOS_DE_LA_SOLICICTUD.CON_MARCO,
      clave: (item: DatosDelSolicitud) => item.conMarco,
      orden: 4,
    },
    {
      encabezado: DATOS_DE_LA_SOLICICTUD.ANCHO,
      clave: (item: DatosDelSolicitud) => item.ancho,
      orden: 5,
    },
    {
      encabezado: DATOS_DE_LA_SOLICICTUD.ALTO,
      clave: (item: DatosDelSolicitud) => item.alto,
      orden: 6,
    },
    {
      encabezado: DATOS_DE_LA_SOLICICTUD.PROFUNDIDAD,
      clave: (item: DatosDelSolicitud) => item.profundidad,
      orden: 7,
    },
    {
      encabezado: DATOS_DE_LA_SOLICICTUD.DIAMETRO,
      clave: (item: DatosDelSolicitud) => item.diametro,
      orden: 8,
    },
    {
      encabezado: DATOS_DE_LA_SOLICICTUD.VARIABLES,
      clave: (item: DatosDelSolicitud) => item.variables,
      orden: 9,
    },
    {
      encabezado: DATOS_DE_LA_SOLICICTUD.ANO_DE_CREACION,
      clave: (item: DatosDelSolicitud) => item.anoDeCreacion,
      orden: 10,
    },
    {
      encabezado: DATOS_DE_LA_SOLICICTUD.AVALUO,
      clave: (item: DatosDelSolicitud) => item.avaluo,
      orden: 11,
    },
    {
      encabezado: DATOS_DE_LA_SOLICICTUD.MONEDA,
      clave: (item: DatosDelSolicitud) => item.moneda,
      orden: 12,
    },
    {
      encabezado: DATOS_DE_LA_SOLICICTUD.PROPIETARIO,
      clave: (item: DatosDelSolicitud) => item.propietario,
      orden: 13,
    },
    {
      encabezado: DATOS_DE_LA_SOLICICTUD.FRACCION_ARANCELARIA,
      clave: (item: DatosDelSolicitud) => item.fraccionArancelaria,
      orden: 14,
    },
    {
      encabezado: DATOS_DE_LA_SOLICICTUD.DESCRIPCION,
      clave: (item: DatosDelSolicitud) => item.descripcion,
      orden: 15,
    },
  ];
