import { DatosCatalago } from '../../tramites/80102/models/autorizacion-programa-nuevo.model';
import { SociaoAccionistas } from '../models/complimentos.model';

/**
 * Constante que define un catálogo de datos para la forma de socios accionistas.
 * 
 * Cada elemento del catálogo representa un campo que debe ser llenado en un formulario
 * relacionado con los socios accionistas. Los campos incluyen información como el 
 * identificador fiscal, razón social, país, código postal, estado y correo electrónico.
 * 
 * Propiedades de cada elemento del catálogo:
 * 
 * - `labelNombre`: Etiqueta que describe el nombre del campo en el formulario.
 * - `campo`: Identificador único del campo en el formulario.
 * - `class`: Clases CSS utilizadas para definir el diseño y estilo del campo.
 * - `tipo_input`: Tipo de entrada del campo (por ejemplo, texto, selección, etc.).
 * - `required`: Indica si el campo es obligatorio (`true`) o no (`false`).
 * - `maxLength`: Longitud máxima permitida para el valor del campo (opcional, solo para campos de texto).
 * - `orden`: Orden en el que el campo aparece en el formulario.
 * - `opciones`: Lista de opciones disponibles para campos de tipo selección (opcional).
 * 
 * Ejemplo de uso:
 * 
 * ```typescript
 * import { FORMA_SOCIO_ACCIONISTAS } from './constantes/complimentos.enum';
 * 
 * FORMA_SOCIO_ACCIONISTAS.forEach(campo => {
 *   console.log(`Campo: ${campo.labelNombre}, Tipo: ${campo.tipo_input}`);
 * });
 * ```
 * 
 * Esta constante es útil para generar dinámicamente formularios basados en los datos
 * definidos en el catálogo, asegurando consistencia y reutilización de configuraciones.
 */
export const FORMA_SOCIO_ACCIONISTAS: DatosCatalago[] = [
  {
    labelNombre: 'TAX ID',
    campo: 'taxId',
    class: 'col-md-6 col-sm-10 pr-5',
    tipo_input: 'text',
    required: true,
    maxlength: 12,
    orden: 1,
  },
  {
    labelNombre: 'Denominación o razón social',
    campo: 'razonSocial',
    class: 'col-md-6 col-sm-10 mt-3',
    tipo_input: 'text',
    required: true,
    maxlength: 254,
    orden: 3,
  },
  {
    labelNombre: 'País',
    campo: 'pais',
    class: 'col-md-6 col-10 mt-1',
    tipo_input: 'select-catalog',
    required: true,
    opciones: [],
    orden: 4,
  },
  {
    labelNombre: 'Código postal',
    campo: 'codigoPostal',
    class: 'col-md-6 col-10 mt-3',
    tipo_input: 'text',
    required: true,
    maxlength: 12,
    orden: 5,
  },
  {
    labelNombre: 'Estado',
    campo: 'estado',
    class: 'col-md-6 col-10  mt-1',
    tipo_input: 'text',
    required: true,
    opciones: [],
    maxlength: 255,
    orden: 6,
  },
  {
    labelNombre: 'Correo electrónico',
    campo: 'correoElectronico',
    class: 'col-md-6 col-10 mt-3',
    tipo_input: 'text',
    required: true,
    maxlength: 200,
    orden: 7,
  },
];

/**
 * Constante que define la estructura de datos para el formulario de socios accionistas extranjeros.
 * 
 * Cada elemento del arreglo representa un campo del formulario con sus respectivas propiedades
 * como el nombre del campo, tipo de entrada, validaciones y orden de aparición.
 * 
 * Propiedades de cada objeto en el arreglo:
 * 
 * - `labelNombre`: Etiqueta que describe el nombre del campo en el formulario.
 * - `campo`: Identificador único del campo, utilizado para enlazar con los datos del modelo.
 * - `class`: Clases CSS aplicadas al campo para definir su estilo y diseño en la interfaz.
 * - `tipo_input`: Tipo de entrada del campo (por ejemplo, texto, selección, etc.).
 * - `required`: Indica si el campo es obligatorio (`true`) o no (`false`).
 * - `maxLength`: Longitud máxima permitida para el valor del campo (aplicable a entradas de texto).
 * - `orden`: Posición del campo en el formulario, utilizada para ordenar los elementos.
 * - `opciones`: Lista de opciones disponibles para campos de tipo selección (opcional).
 * 
 * Uso:
 * 
 * Esta constante se utiliza para generar dinámicamente los campos de un formulario
 * en la interfaz de usuario, asegurando consistencia en el diseño y validaciones.
 */
export const FORMA_SOCIO_ACCIONISTAS_EXTRANJEROS: DatosCatalago[] = [
  {
    labelNombre: 'Nombre',
    campo: 'nombre',
    class: 'col-md-4 col-sm-10 mt-3',
    tipo_input: 'text',
    required: true,
    maxlength: 200,
    orden: 1,
  },
  {
    labelNombre: 'Apellido paterno',
    campo: 'apellidoPaterno',
    class: 'col-md-4 col-sm-10 mt-3',
    tipo_input: 'text',
    required: true,
    maxlength: 200,
    orden: 2,
  },
  {
    labelNombre: 'País',
    campo: 'pais',
    class: 'col-md-6 mt-1',
    tipo_input: 'select-paise',
    required: true,
    opciones: [],
    orden: 3,
  },
  {
    labelNombre: '',
    campo: '',
    class: 'col-4 col-10 mt-3',
    tipo_input: 'spacer',
    required: false,
    opciones: [],
    maxlength: 0,
    orden: 4,
  },
  {
    labelNombre: 'Código postal',
    campo: 'codigoPostal',
    class: 'col-md-4 col-10 mt-3',
    tipo_input: 'text',
    required: true,
    maxlength: 12,
    orden: 5,
  },
  {
    labelNombre: 'Estado',
    campo: 'estado',
    class: 'col-md-4 col-10 mt-3',
    tipo_input: 'select-catalog ',
    required: true,
    opciones: [],
    maxlength: 255,
    orden: 6,
  },
  {
    labelNombre: '',
    campo: '',
    class: 'col-4 col-10 mt-3',
    tipo_input: 'spacer',
    required: false,
    opciones: [],
    maxlength: 0,
    orden: 7,
  },
  {
    labelNombre: 'Correo electrónico',
    campo: 'correoElectronico',
    class: 'col-md-4 col-10 mt-3',
    tipo_input: 'text',
    required: true,
    maxlength: 200,
    orden: 8,
  },
  {
    labelNombre: 'Tax ID',
    campo: 'taxId',
    class: 'col-md-4 col-sm-10 mt-3',
    tipo_input: 'text',
    required: true,
    maxlength: 12,
    orden: 9,
  },
];

/**
 * Constante que define un catálogo de datos para la forma de socio.
 * 
 * Esta constante contiene un arreglo de objetos que representan los campos
 * necesarios para capturar información relacionada con el registro de un socio.
 * Cada objeto incluye propiedades que definen las características del campo,
 * como su etiqueta, nombre, clase CSS, tipo de entrada, validaciones y orden.
 * 
 * Propiedades de cada objeto en el arreglo:
 * - `labelNombre`: Etiqueta que describe el campo (por ejemplo, "Registro Federal de Contribuyentes").
 * - `campo`: Nombre del campo que se utiliza como identificador único.
 * - `class`: Clases CSS aplicadas al campo para definir su estilo y diseño.
 * - `tipo_input`: Tipo de entrada HTML (por ejemplo, "text").
 * - `required`: Indica si el campo es obligatorio (`true` para obligatorio).
 * - `maxLength`: Longitud máxima permitida para el valor del campo.
 * - `orden`: Orden en el que se debe mostrar el campo en la interfaz.
 * 
 * Ejemplo de uso:
 * ```typescript
 * console.log(FORMA_SOCIO[0].labelNombre); // "Registro Federal de Contribuyentes"
 * ```
 */
export const FORMA_SOCIO: DatosCatalago[] = [
  {
    labelNombre: 'Registro federal de contribuyentes',
    campo: 'rfc',
    class: 'col-md-6 col-10 mt-3',
    tipo_input: 'text',
    required: true,
    maxlength: 13,
    orden: 1,
  },
];

/**
 * Enumeración que define los diferentes tipos de forma utilizados en la aplicación.
 * 
 * @enum {number}
 * 
 * @property {number} DEFAULT - Representa el tipo de forma predeterminado.
 * @property {number} TIPO_PERSONA - Representa el tipo de forma asociado a una persona.
 * @property {number} NATIONALIDAD_MEXICANA - Representa el tipo de forma para personas con nacionalidad mexicana.
 */
export enum TIPO_FORMA {
  DEFAULT = 1,
  TIPO_PERSONA = 2,
  NATIONALIDAD_MEXICANA = 3,
}

/**
 * Constante que define la estructura de la tabla para los datos de socios accionistas.
 * 
 * Cada elemento de la tabla contiene la siguiente información:
 * - `encabezado`: El nombre de la columna que se mostrará en la tabla.
 * - `clave`: Una función que toma un objeto de tipo `SociaoAccionistas` y devuelve el valor correspondiente
 *   para esa columna, o `undefined` si no existe.
 * - `orden`: El orden en el que se deben mostrar las columnas en la tabla.
 * 
 * Propiedades de las columnas:
 * 1. **RFC**: Representa el Registro Federal de Contribuyentes del socio accionista.
 * 2. **Razón social**: Representa la razón social del socio accionista.
 * 3. **Nombre**: Representa el nombre del socio accionista.
 * 4. **Apellido paterno**: Representa el apellido paterno del socio accionista.
 * 5. **Apellido materno**: Representa el apellido materno del socio accionista.
 * 6. **Correo**: Representa el correo electrónico del socio accionista.
 * 
 * Esta constante es útil para generar dinámicamente tablas en la interfaz de usuario
 * basadas en los datos de los socios accionistas.
 */
export const TABLA_SOCIO_ACCIONISTAS = [
  {
    encabezado: 'RFC',
    clave: (ele: SociaoAccionistas): string | undefined => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'Razón social',
    clave: (ele: SociaoAccionistas): string | undefined => ele.razonSocial,
    orden: 2,
  },
  {
    encabezado: 'Nombre',
    clave: (ele: SociaoAccionistas): string | undefined => ele.nombre,
    orden: 3,
  },
  {
    encabezado: 'Apellido paterno',
    clave: (ele: SociaoAccionistas): string | undefined => ele.apellidoPaterno,
    orden: 4,
  },

  {
    encabezado: 'Apellido materno',
    clave: (ele: SociaoAccionistas): string | undefined => ele.apellidoMaterno,
    orden: 5,
  },
  {
    encabezado: 'Correo',
    clave: (ele: SociaoAccionistas): string | undefined =>
      ele.correoElectronico,
    orden: 6,
  },
];

/**
 * Constante que define la configuración de la tabla para mostrar información
 * de socios accionistas extranjeros. Cada objeto dentro del arreglo representa
 * una columna de la tabla, especificando su encabezado, la clave para obtener
 * el valor correspondiente de un objeto `SociaoAccionistas`, y el orden en el
 * que debe aparecer la columna.
 *
 * Propiedades de cada columna:
 * - `encabezado`: El título que se mostrará en la cabecera de la columna.
 * - `clave`: Una función que recibe un objeto de tipo `SociaoAccionistas` y 
 *   devuelve el valor correspondiente para esa columna. Puede devolver un 
 *   string o `undefined` si no se encuentra el valor.
 * - `orden`: Un número que indica la posición de la columna en la tabla.
 *
 * Columnas definidas:
 * 1. TAX ID: Identificador fiscal del socio accionista.
 * 2. Razón social: Nombre comercial o razón social del socio accionista.
 * 3. Nombre: Primer nombre del socio accionista.
 * 4. Apellido paterno: Apellido paterno del socio accionista.
 * 5. País: País de residencia del socio accionista.
 * 6. CP: Código postal del socio accionista.
 * 7. Estado: Estado o región del socio accionista.
 * 8. Correo: Dirección de correo electrónico del socio accionista.
 *
 * @constant
 */
export const TABLA_SOCIO_ACCIONISTAS_EXTRANJEROS = [
  {
    encabezado: 'TAX ID',
    clave: (ele: SociaoAccionistas): string | undefined => ele.taxId,
    orden: 1,
  },
  {
    encabezado: 'Razón social',
    clave: (ele: SociaoAccionistas): string | undefined => ele.razonSocial,
    orden: 2,
  },
  {
    encabezado: 'Nombre',
    clave: (ele: SociaoAccionistas): string | undefined => ele.nombre,
    orden: 3,
  },
  {
    encabezado: 'Apellido paterno',
    clave: (ele: SociaoAccionistas): string | undefined => ele.apellidoPaterno,
    orden: 4,
  },

  {
    encabezado: 'País',
    clave: (ele: SociaoAccionistas): string | undefined => ele.pais,
    orden: 5,
  },
  {
    encabezado: 'CP',
    clave: (ele: SociaoAccionistas): string | undefined => ele.codigoPostal,
    orden: 6,
  },
  {
    encabezado: 'Estado',
    clave: (ele: SociaoAccionistas): string | undefined => ele.estado,
    orden: 6,
  },
  {
    encabezado: 'Correo',
    clave: (ele: SociaoAccionistas): string | undefined =>
      ele.correoElectronico,
    orden: 7,
  },
];

/**
 * Constante que representa la clave utilizada para identificar un país.
 * 
 * @constant
 * @type {string}
 * @default 'pais'
 * 
 * @description
 * Esta constante se utiliza como identificador para representar un país en el sistema.
 * Puede ser utilizada en diferentes contextos donde se necesite referenciar un país
 * de manera uniforme y consistente.
 * 
 * @example
 * ```typescript
 * import { PAIS } from './constantes/complimentos.enum';
 * 
 * console.log(PAIS); // Salida: 'pais'
 * ```
 */
export const PAIS = 'pais';


/**
 * Constante que representa el estado de una entidad o proceso.
 * 
 * Esta constante se utiliza para identificar o manejar el estado
 * dentro de la aplicación. Puede ser empleada en diversas partes
 * del sistema donde se requiera una referencia al estado actual
 * o deseado.
 * 
 * @const
 * @type {string}
 * @example
 * // Uso de la constante ESTADO
 * if (variable === ESTADO) {
 *   console.log('El estado coincide con la constante definida.');
 * }
 */
export const ESTADO = 'estado';


/**
 * Constante que representa la configuración de la fecha de pago.
 * 
 * @property {string} labelNombre - Etiqueta que describe el nombre del campo.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado.
 */
export const FECHA_DE_PAGO = {
  labelNombre: 'fecha de emision del acta',
  required: true,
  habilitado: true,
};
