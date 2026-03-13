import {
  AvisoTabla,
  DesperdicioTabla,
  PedimentoTabla,
  ProcesoTabla,
} from '../models/aviso-destruccion.model';

/**
 * Constante que define los pasos del wizard en el trámite.
 *
 * Esta constante contiene un array de objetos que representan los pasos del wizard,
 * incluyendo su índice, título, y estado (activo o completado).
 */
export const PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 4,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Textos utilizados en el trámite.
 *
 * Esta constante contiene textos como instrucciones o mensajes que se muestran
 * en la interfaz del usuario.
 */
export const TEXTOS = {
  TIPO_CARGO: ` El archivo no debe exceder los 1000 registros. Para descargar plantilla del archivo de excel de click <span class="">*</span><br />
     <label><a href="javascript:void(0);"> Descargar plantilla</a></label>
        `,
  TERCEROS_TEXTO_DE_ALERTA:
    'La solicitud ha quedado registrada con el número temporal 202767903 Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.',
  SELECTOR_DESPERDICIO: `
  <input type="checkbox" formControlName="selectorDesperdicio" /><span class="require">*</span>No es posible declarar el porcentaje que representa la mercancia a destruir, de la mercancia importada temporalmente de la que procede
  `,
};
/**
 * Configuración para la fecha de ingreso.
 *
 * Define las propiedades de la fecha de ingreso, como el nombre de la etiqueta, si es requerida y si está habilitada.
 */
export const FECHA_INGRESO = {
  labelNombre: 'Fecha de programada del traslado',
  required: true,
  habilitado: true,
};

/**
 * Tipos de aviso disponibles.
 *
 * Define los valores y etiquetas para los tipos de aviso.
 */
export const TIPAVI = [
  {
    value: 'nohabitual',
    label: 'No habitual',
  },
  {
    value: 'periodica',
    label: 'Periodica',
  },
];
/**
 * Tipos de carga disponibles.
 *
 * Define los valores y etiquetas para los tipos de carga.
 */
export const TIPACA = [
  {
    value: 'manual',
    label: 'Manual',
  },
  {
    value: 'carga_masiva',
    label: 'Carga masiva',
  },
];

/**
 * @property {object} tablaDeDatos
 * @description Configuración de la tabla de datos utilizada en el componente.
 * Contiene las definiciones de las columnas (encabezados) y los datos que se mostrarán en la tabla.
 */
export const TABLA_DE_DATOS: {
  /**
   * Contiene dos propiedades principales:
   * - **encabezadas**: Arreglo de objetos que representan los encabezados de la tabla, con su título, clave de acceso y orden.
   * - **datos**: Arreglo de elementos de tipo `ProcesoTabla` que contiene la información a mostrar en la tabla.
   */
  encabezadas: {
    encabezado: string;
    clave: (ele: AvisoTabla) => string;
    orden: number;
  }[];
  /**
   * @property {ProcesoTabla[]} datos
   * Arreglo de datos que alimenta las filas de la tabla. Inicialmente vacío.
   */
  datos: AvisoTabla[];
} = {
  encabezadas: [
    {
      encabezado: 'Nombre comercial',
      clave: (ele: AvisoTabla) => ele.nombreComercial,
      orden: 1,
    },
    {
      encabezado: 'Entidad federativa',
      clave: (ele: AvisoTabla) => ele.entidadFederativa,
      orden: 2,
    },
    {
      encabezado: 'Alcaldía o Municipio',
      clave: (ele: AvisoTabla) => ele.alcaldioOMuncipio,
      orden: 3,
    },
    {
      encabezado: 'Colonia',
      clave: (ele: AvisoTabla) => ele.colonia,
      orden: 4,
    },
    {
      encabezado: 'Hora Destrucción',
      clave: (ele: AvisoTabla) => ele.horaDestruccion,
      orden: 5,
    },
    {
      encabezado: 'Fecha Destrucción',
      clave: (ele: AvisoTabla) => ele.fechaDestruccion,
      orden: 5,
    },
  ],
  datos: [],
};

/**
 * @property {object} tablaPedimento
 * @description Configuración de la tabla de Pedimento utilizada en el componente.
 * Contiene las definiciones de las columnas (encabezados) y los datos que se mostrarán en la tabla.
 */
export const TABLA_PEDIMENTO: {
  /**
   * Contiene dos propiedades principales:
   * - **encabezadas**: Arreglo de objetos que representan los encabezados de la tabla, con su título, clave de acceso y orden.
   * - **datos**: Arreglo de elementos de tipo `ProcesoTabla` que contiene la información a mostrar en la tabla.
   */
  encabezadas: {
    encabezado: string;
    clave: (ele: PedimentoTabla) => string;
    orden: number;
  }[];
  /**
   * @property {ProcesoTabla[]} datos
   * Arreglo de datos que alimenta las filas de la tabla. Inicialmente vacío.
   */
  datos: PedimentoTabla[];
} = {
  encabezadas: [
    {
      encabezado: 'Número de patente',
      clave: (ele: PedimentoTabla) => ele.patenteAutorizacion,
      orden: 1,
    },
    {
      encabezado: 'Número de pedimento',
      clave: (ele: PedimentoTabla) => ele.pedimento,
      orden: 2,
    },
    {
      encabezado: 'Aduana del pedimento',
      clave: (ele: PedimentoTabla) => ele.claveAduanaPedimento,
      orden: 3,
    },
    {
      encabezado: 'Fracción de la mercancía',
      clave: (ele: PedimentoTabla) => ele.claveFraccionArancelariaPedimento,
      orden: 4,
    },
    {
      encabezado: 'NICO de la mercancía',
      clave: (ele: PedimentoTabla) => ele.nicoPedimento,
      orden: 5,
    },
    {
      encabezado: 'Cantidad de la mercancía',
      clave: (ele: PedimentoTabla) => ele.cantidadPedimento,
      orden: 6,
    },
    {
      encabezado: 'Unidad de medida de la mercancía',
      clave: (ele: PedimentoTabla) => ele.claveUnidadMedidaPedimento,
      orden: 6,
    },
  ],
  datos: [],
};

/**
 * @property {object} tablaProceso
 * @description Configuración de la tabla de Proceso utilizada en el componente.
 * Contiene las definiciones de las columnas (encabezados) y los datos que se mostrarán en la tabla.
 */
export const TABLA_PROCESO: {
  /**
   * Contiene dos propiedades principales:
   * - **encabezadas**: Arreglo de objetos que representan los encabezados de la tabla, con su título, clave de acceso y orden.
   * - **datos**: Arreglo de elementos de tipo `ProcesoTabla` que contiene la información a mostrar en la tabla.
   */
  encabezadas: {
    encabezado: string;
    clave: (ele: ProcesoTabla) => string;
    orden: number;
  }[];
  /**
   * @property {ProcesoTabla[]} datos
   * Arreglo de datos que alimenta las filas de la tabla. Inicialmente vacío.
   */
  datos: ProcesoTabla[];
} = {
  encabezadas: [
    {
      encabezado: 'Descripción del proceso destructivo',
      clave: (ele: ProcesoTabla) => ele.descripcionProcesoDestruccion,
      orden: 1,
    },
  ],
  datos: [],
};

/**
 * @property {object} tablaDesperdicio
 * @description Configuración de la tabla de Desperdicio utilizada en el componente.
 * Contiene las definiciones de las columnas (encabezados) y los datos que se mostrarán en la tabla.
 */
export const TABLA_DESPERDICIO: {
  /**
   * Contiene dos propiedades principales:
   * - **encabezadas**: Arreglo de objetos que representan los encabezados de la tabla, con su título, clave de acceso y orden.
   * - **datos**: Arreglo de elementos de tipo `ProcesoTabla` que contiene la información a mostrar en la tabla.
   */
  encabezadas: {
    encabezado: string;
    clave: (ele: DesperdicioTabla) => string;
    orden: number;
  }[];
  /**
   * @property {ProcesoTabla[]} datos
   * Arreglo de datos que alimenta las filas de la tabla. Inicialmente vacío.
   */
  datos: DesperdicioTabla[];
} = {
  encabezadas: [
    {
      encabezado: 'Datos de los desperdicios a destruir',
      clave: (ele: DesperdicioTabla) => ele.descripcionProcesoDestruccion,
      orden: 1,
    },
  ],
  datos: [],
};

/**
 * Texto descriptivo que indica la hora en la que se llevará a cabo la destrucción.
 *
 * Contiene caracteres HTML escapados (`&aacute;`, `&oacute;`)
 * para asegurar la correcta visualización de acentos en entornos web.
 */
export const HORA_DESTRUCCION =
  'Hora en la que se efectuar&aacute; la destrucci&oacute;n';

/**
 * @constant TITLE_NOTIFICATION
 * @description
 * Mensaje de advertencia que se muestra al usuario antes de culminar el trámite.
 * Informa que debe verificar todos los datos capturados y los documentos adjuntos,
 * ya que posteriormente a la firma no será posible modificar o eliminar la información.
 */
export const TITLE_NOTIFICATION =
  'Se sugiere verificar todos los datos capturados y documentos adjuntos antes de culminar el trámite, ya que, en caso de existir algún error, no se podrá modificar o eliminar la información posterior a su firma.';
