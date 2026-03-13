import { ComposicionMaterial, TablaNumeroCasType } from "../models/materiales-peligrosos.model";

/**
 * Define una constante que representa la lista de pasos para un asistente (wizard).
 * Cada paso incluye su índice, título, estado de actividad y estado de completitud.
 *
 * Índice numérico del paso.
 * Título descriptivo del paso.
 * Indica si el paso está actualmente activo y visible.
 * Indica si el paso ha sido completado.
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
   * Representa una tabla de configuración para materiales peligrosos con información específica
   * como el número CAS, descripción no arancelaria, nombre químico y constancia CISEN.
   * 
   * Cada objeto en la tabla contiene las siguientes propiedades:
   * 
   * - `encabezado`: El título de la columna en la tabla.
   * - `clave`: Una función que toma un elemento de tipo `TablaNumeroCasType` y devuelve el valor correspondiente
   *   para esa columna.
   * - `orden`: El orden de la columna en la tabla.
   * 
   * @constant
   * @type {Array<{ encabezado: string; clave: (ele: TablaNumeroCasType) => string; orden: number }>}
   */
  export const NUMERO_CAS_TABLA = [
    {
      encabezado: 'Número CAS',
      clave: (ele: TablaNumeroCasType): string => ele.numeroCas,
      orden: 1,
    },
    {
      encabezado: 'Descripción no arancelaria',
      clave: (ele: TablaNumeroCasType): string => ele.descripcionNoArancelaria,
      orden: 1,
    },
    {
      encabezado: 'Nombre químico/Nomenclatura IUPAC del material',
      clave: (ele: TablaNumeroCasType): string => ele.nombreQuimico,
      orden: 1,
    },
    {
      encabezado: 'Constancia CISEN',
      clave: (ele: TablaNumeroCasType): string => ele.constanciaCisen,
      orden: 1,
    },
  ];

  /**
   * Representa una tabla de configuración para la composición de materiales peligrosos.
   * 
   * Cada objeto en la tabla contiene las siguientes propiedades:
   * 
   * - `encabezado`: El título de la columna en la tabla.
   * - `clave`: Una función que toma un elemento de tipo `ComposicionMaterial` y devuelve el valor correspondiente
   *   para esa columna.
   * - `orden`: El orden de la columna en la tabla.
   * 
   * @constant
   * @type {Array<{ encabezado: string; clave: (ele: ComposicionMaterial) => string; orden: number }>}}
   */
  export const COMPOSICION_TABLA = [
    {
      encabezado: 'Componente del material',
      clave: (ele: ComposicionMaterial): string => ele.componente,
      orden: 1,
    },
    {
      encabezado: 'Porcentaje de concentración',
      clave: (ele: ComposicionMaterial): string => ele.porcentajeConcentracion.toString(),
      orden: 1,
    },
  ];

  /**
 * Constant representing the invoice date field configuration.
 * 
 * @property {string} labelNombre - The label for the invoice date field.
 * @property {boolean} required - Indicates if the invoice date field is required.
 * @property {boolean} habilitado - Indicates if the invoice date field is enabled.
 */
export const FECHA_FACTURA = {
  labelNombre: 'Fecha prevista para llevar a cabo la exportación:',
  required: false,
  habilitado: true,
};


/**
 * Constante que define los datos específicos válidos para el control de materiales peligrosos.
 * 
 * Esta lista contiene los nombres de las propiedades que deben ser verificadas y validadas
 * en el contexto de los trámites relacionados con materiales peligrosos. Cada elemento de 
 * la lista representa un atributo específico que es requerido para el manejo adecuado de 
 * estos materiales.
 * 
 * Propiedades incluidas:
 * - `nombreComun`: Nombre común del material peligroso.
 * - `nombreComercial`: Nombre comercial del material peligroso.
 * - `estadoFisico`: Estado físico del material (sólido, líquido, gaseoso, etc.).
 * - `cantidad`: Cantidad del material peligroso.
 * - `unidadMedida`: Unidad de medida utilizada para la cantidad.
 * - `licenciaSanitaria`: Información sobre la licencia sanitaria asociada.
 * - `usoEspecifico`: Uso específico del material peligroso.
 * - `fechaExportacion`: Fecha en la que se exportará el material.
 * - `modoCantidad`: Modo en el que se especifica la cantidad del material.
 * 
 * Esta constante es utilizada para garantizar que los datos proporcionados cumplan con los 
 * requisitos necesarios para el control y manejo seguro de materiales peligrosos.
 */
export const DATOS_ESPECIFICOS_VALIDO_CONTROL = [
  'nombreComun',
  'nombreComercial',
  'estadoFisico',
  'cantidad',
  'unidadMedida',
  'licenciaSanitaria',
  'usoEspecifico',
  'fechaExportacion',
  'modoCantidad'
];

/**
 * Lista de claves válidas para el control de información general.
 * 
 * Esta constante define las propiedades que son consideradas válidas 
 * para el control de información general en el contexto de materiales peligrosos.
 * 
 * @const INFO_GENERAL_VALIDO_CONTROL
 * @type {string[]}
 */
export const INFO_GENERAL_VALIDO_CONTROL = [
  'fraccionArancelaria',
  'numeroCas',
  ];


  /**
   * Representa las opciones disponibles para un botón de radio en el formulario.
   * 
   * Este arreglo contiene objetos que definen las etiquetas y valores asociados 
   * a las opciones del botón de radio. Las opciones disponibles son:
   * 
   * - "Fisica": Representa una entidad física.
   * - "Moral": Representa una entidad moral.
   * 
   * @const OPCIONES_DE_BOTON_DE_RADIO
   * @type {Array<{label: string, value: string}>}
   */
  export const OPCIONES_DE_BOTON_DE_RADIO = [
    {
      label: 'Fisica',
      value: 'Fisica',
    },
    {
      label: 'Moral',
      value: 'Moral',
    }
  ];

/**
 * Representa las opciones disponibles para un botón de radio en el contenedor.
 * 
 * Cada opción está definida por un objeto que contiene:
 * - `label`: El texto que se mostrará al usuario para identificar la opción.
 * - `value`: El valor asociado a la opción, que puede ser utilizado en la lógica de la aplicación.
 * 
 * Opciones disponibles:
 * - `Numérico`: Representa una opción basada en valores numéricos.
 * - `Rangos`: Representa una opción basada en rangos de valores.
 * 
 * Este arreglo es útil para configurar dinámicamente botones de radio en la interfaz de usuario.
 */
export const OPCIONES_DE_BOTON_DE_RADIO_CONTENEDOR = [
  {
    label: 'Numérico',
    value: 'Numérico',
  },
  {
    label: 'Rangos',
    value: 'Rangos',
  }
]
