import { CatalogosSelect, ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { DatosDetalle, DatosSolicitud } from '../models/datos-tramite.model';

/**
 * Representa la configuración de un destinatario con información detallada.
 *
 * @property Nombre - Nombre del destinatario.
 * @property ApellidoPaterno - Apellido paterno del destinatario.
 * @property ApellidoMaterno - Apellido materno del destinatario.
 * @property RazonSocial - Razón social del destinatario.
 * @property pais - País del destinatario.
 * @property ciudad - Ciudad del destinatario.
 * @property domicilio - Domicilio del destinatario.
 * @property codigoPostal - Código postal o equivalente del destinatario.
 *
 * @remarks
 * - `entidadFederativa` (comentado): Representa la entidad federativa del destinatario.
 */
export interface DestinatarioConfiguracionItem {
  /**
   * First name of the recipient.
   */
  nombre: string;

  /**
   * Last name (paternal) of the recipient.
   */
  apellidoPaterno: string;

  /**
   * Last name (maternal) of the recipient.
   */
  apellidoMaterno: string;

  /**
   * Legal or business name of the recipient.
   */
  razonSocial: string;

  /**
   * Country of the recipient.
   */
  pais: number | null;

  /**
   * Country of the recipient.
   */
  paisStr: string ;

  /**
   * City of the recipient.
   */
  ciudad: string;

  /**
   * Address of the recipient.
   */
  domicilio: string;

  /**
   * Postal code or equivalent of the recipient.
   */
  codigoPostal: number;
}

/**
 * Texto de alerta para terceros.
 */
export const TERCEROS_TEXTO_DE_ALERTA = 'La solicitud ha quedado registrada con el número temporal 202757598 Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.';

/**
 * Configuración de las columnas para la tabla de terceros.
 * Define cómo se mostrarán los datos de los destinatarios en la tabla, incluyendo encabezados, claves y orden.
 */
export const DESTINATARIO_TABLA_CONFIGURACION: ConfiguracionColumna<DestinatarioConfiguracionItem>[] = [
  {

    encabezado: 'Nombre',

    clave: (item: DestinatarioConfiguracionItem) => item.nombre,
    orden: 1,
  },
  {

    encabezado: 'Apellido Paterno',

    clave: (item: DestinatarioConfiguracionItem) => item.apellidoPaterno,

    orden: 2,
  },
  {

    encabezado: 'Apellido materno',

    clave: (item: DestinatarioConfiguracionItem) => item.apellidoMaterno,

    orden: 3,
  },
  {

    encabezado: 'Razon Social',

    clave: (item: DestinatarioConfiguracionItem) => item.razonSocial,

    orden: 4,
  },
  {
    /**
     * Encabezado de la columna para el país.
     */
    encabezado: 'País',
    /**
     * Clave que define cómo obtener el valor del país de un elemento.
     */
    clave: (item: DestinatarioConfiguracionItem) => item.paisStr,
    /**
     * Orden de la columna en la tabla.
     */
    orden: 5,
  },
  {
    /**
     * Encabezado de la columna para la ciudad.
     */
    encabezado: 'Ciudad',
    /**
     * Clave que define cómo obtener el valor de la ciudad de un elemento.
     */
    clave: (item: DestinatarioConfiguracionItem) => item.ciudad,
    /**
     * Orden de la columna en la tabla.
     */
    orden: 6,
  },
  {
    /**
     * Encabezado de la columna para el domicilio.
     */
    encabezado: 'Domicilio',
    /**
     * Clave que define cómo obtener el valor del domicilio de un elemento.
     */
    clave: (item: DestinatarioConfiguracionItem) => item.domicilio,
    /**
     * Orden de la columna en la tabla.
     */
    orden: 7,
  },
  {
    /**
     * Encabezado de la columna para el código postal o equivalente.
     */
    encabezado: 'Código postal o equivalente',
    /**
     * Clave que define cómo obtener el valor del código postal de un elemento.
     */
    clave: (item: DestinatarioConfiguracionItem) => item.codigoPostal,
    /**
     * Orden de la columna en la tabla.
     */
    orden: 8,
  },
];

/**
 * Representa la configuración para los encabezados de la tabla y su correspondiente mapeo de datos
 * en la aplicación. Cada entrada en el arreglo define el encabezado de una columna, la clave para extraer
 * datos de un elemento y el orden de la columna en la tabla.
 *
 * @constant
 * @type {ConfiguracionColumna<DatosSolicitud>[]}
 *
 * @property {string} encabezado - El texto del encabezado mostrado para la columna.
 * @property {(articulo: DatosSolicitud) => any} clave - Una función que mapea un elemento
 * al valor mostrado en la columna.
 * @property {number} orden - El orden en el que la columna aparece en la tabla.
 */
export const ENCABEZADO_DE_TABLE_CONFIGURACION: ConfiguracionColumna<DatosSolicitud>[] = [
  { encabezado: '', clave: (articulo) => articulo.id, orden: 1 },
  {
    encabezado: 'Fracción arancelaria',
    clave: (articulo) => articulo.fraccionArancelaria,
    orden: 2,
  },
  {
    encabezado: 'Cantidad',
    clave: (articulo) => articulo.cantidad,
    orden: 3,
  },
  {
    encabezado: 'Cantidad (letra)',
    clave: (articulo) => articulo.cantidadLetra,
    orden: 4,
  },
  ];



/**
 * Entrada predeterminada para la tabla de destinatarios.
 * Proporciona valores iniciales para los datos de un destinatario.
 */
export const DESTINATARIO_TABLE_ENTRY = {
  /**
   * Nombre del destinatario.
   */
  Nombre: 'prueba',

  /**
   * Apellido paterno del destinatario.
   */
  ApellidoPaterno: 'prueba',

  /**
   * Apellido materno del destinatario.
   */
  ApellidoMaterno: 'prueba',

  /**
   * Razón social del destinatario.
   */
  RazonSocial: 'prueba',

  /**
   * País del destinatario.
   */
  pais: 'MEXICO (ESTADOS UNIDOS MEXICANOS)',

  /**
   * Ciudad del destinatario.
   */
  ciudad: '---',

  /**
   * Domicilio del destinatario.
   */
  domicilio: 'prueba',

  /**
   * Código postal del destinatario.
   */
  codigoPostal: 96533,
};

/**
 * Represents the options for nationality selection.
 * Each option includes a label for display purposes and a corresponding value.
 * 
 * Options:
 * - `Nacional`: Represents a national individual with the value 'nacional'.
 * - `Extranjero`: Represents a foreign individual with the value 'extranjero'.
 */
export const NACIONALIDAD_OPCIONES = [
  {
    label: 'Nacional',
    value: 'nacional',
  },
  {
    label: 'Extranjero',
    value: 'extranjero',
  }
];

/**
 * Represents the options for the type of person (persona) in a dropdown or selection component.
 * Each option includes a label for display purposes and a corresponding value.
 * 
 * Options:
 * - `Fisica`: Represents a physical person (individual).
 * - `Moral`: Represents a moral person (legal entity or corporation).
 */
export const TIPO_PERSONA_OPCIONES = [
  {
    label: 'Fisica',
    value: 'fisica',
  },
  {
    label: 'Moral',
    value: 'moral',
  }
];


/**
 * An object containing information labels for a recipient (destinatario).
 * This object is used to define various properties related to a recipient's details,
 * such as nationality, type of person, and address information.
 *
 * Properties:
 * - `nacionalidad`: Label for the recipient's nationality.
 * - `tipoPersona`: Label for the type of person (e.g., individual or entity).
 * - `nacional`: Label indicating the recipient is a national.
 * - `extranjero`: Label indicating the recipient is a foreigner.
 * - `denominacion`: Label for the denomination or business name.
 * - `nombre`: Label for the recipient's first name.
 * - `apellidoPaterno`: Label for the recipient's paternal last name.
 * - `apellidoMaterno`: Label for the recipient's maternal last name.
 * - `codigoPostal`: Label for the recipient's postal code.
 * - `pais`: Label for the recipient's country.
 * - `ciudad`: Label for the recipient's city.
 * - `domicilio`: Label for the recipient's address.
 */
export const DESTINARIO_INFO = {
  nacionalidad: "Nacionalidad:",
  tipoPersona: "Tipo de persona:",
  nacional: 'Nacional',
  extranjero: 'Extranjero',
  denominacion: "Denominación o Razón Social",
  nombre: "Nombre",
  apellidoPaterno: "Apellido Paterno",
  apellidoMaterno: "Apellido Materno",
  codigoPostal: "Código Postal",
  pais: "País",
  ciudad: "Ciudad",
  domicilio: "Domicilio"
}

/**
 * Representa la configuración para el destinatario "Banco" en la aplicación.
 * 
 * @constant
 * @type {CatalogosSelect}
 * @property {string} labelNombre - El nombre de la etiqueta para el destinatario, establecido como "Banco".
 * @property {boolean} required - Indica si este campo es obligatorio.
 * @property {string} primerOpcion - La primera opción predeterminada mostrada en la selección, establecida como "Selecciona un valor".
 * @property {Array} catalogos - Un arreglo para contener las opciones del catálogo, inicialmente vacío.
 */
export const DESTINATARIO_BANCO: CatalogosSelect = {
  labelNombre: 'Banco',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
};


/**
 * Representa la configuración para los encabezados de la tabla y su correspondiente mapeo de datos
 * para la sección "Detalle" en la aplicación.
 *
 * Cada entrada en el arreglo define:
 * - `encabezado`: El nombre mostrado en el encabezado de la columna.
 * - `clave`: Una función que mapea un elemento de tipo `DatosDetalle` al valor mostrado en la columna.
 * - `orden`: El orden en el que la columna aparece en la tabla.
 *
 * @type {ConfiguracionColumna<DatosDetalle>[]}
 */
export const ENCABEZADO_DE_TABLA_DETALLE: ConfiguracionColumna<DatosDetalle>[] = [
  { encabezado: '', clave: (articulo) => articulo.id, orden: 1 },
  {
    encabezado: 'Nombre científico',
    clave: (articulo) => articulo.nombreCientifico,
    orden: 2,
  },
  {
    encabezado: 'Nombre común',
    clave: (articulo) => articulo.nombreComunDetalle,
    orden: 3,
  },
  ];