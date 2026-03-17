import {
  DatosCatalago,
  DatosEmpresaExtranjera,
  Servicio,
  ServicioInmex,
} from '../models/nuevo-programa-industrial.model';

/**
 * Representa los pasos necesarios para completar un proceso en el sistema.
 * Cada paso incluye información sobre su índice, título, estado de actividad y estado de completado.
 *
 * @constant
 * @type {Array<{indice: number, titulo: string, activo: boolean, completado: boolean}>}
 *
 * @property {number} indice - El número de orden del paso dentro del proceso.
 * @property {string} titulo - El título descriptivo del paso.
 * @property {boolean} activo - Indica si el paso está actualmente activo.
 * @property {boolean} completado - Indica si el paso ha sido completado.
 *
 * @example
 * // Ejemplo de uso:
 * console.log(PASOS[0].titulo); // Salida: 'Capturar solicitud'
 *
 * @remarks
 * Este arreglo es útil para representar el flujo de trabajo en una interfaz de usuario,
 * donde cada paso puede ser mostrado y actualizado según el estado del proceso.
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
    titulo: 'Requisitos necesarios',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Constante que representa el título del mensaje utilizado para el registro
 * de una solicitud de modificación del programa IMMEX. Este mensaje describe
 * específicamente la modificación de alta a domicilio de una planta, bodega o almacén.
 */
export const TITULOMENSAJE =
  'Registro de solicitud de modificación programa IMMEX (Modificación Alta a domicilio de una planta, bodega o almacén)';

/**
 * Texto informativo que se muestra al usuario al registrar una solicitud.
 * Indica que la solicitud ha sido registrada con un número temporal, 
 * el cual no tiene validez legal y sirve únicamente para identificar 
 * la solicitud. También informa que un folio oficial será asignado 
 * cuando la solicitud sea firmada.
 */
export const TEXTOS_REQUISITOSS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * CONFIGURACION_DOMICILIOS
 * 
 * Esta constante define una configuración para la representación de domicilios
 * en una tabla o lista. Cada objeto dentro del arreglo representa una columna
 * con las siguientes propiedades:
 * 
 * - `encabezado`: El título o encabezado de la columna.
 * - `clave`: Una función que toma un objeto de tipo `ServicioInmex` y devuelve
 *   el valor correspondiente para esa columna. Si no se encuentra el valor, 
 *   devuelve `undefined`.
 * - `orden`: Un número que indica el orden en el que se debe mostrar la columna.
 * 
 * Propiedades específicas de las columnas:
 * 
 * 1. **Servicio**: Representa el servicio asociado.
 * 2. **Registro federal de contribuyentes**: Muestra el registro federal de 
 *    contribuyentes.
 * 3. **Denominación o razón social**: Indica la denominación o razón social.
 * 4. **Número del programa IMMEX**: Contiene el número del programa IMMEX.
 * 5. **Año del programa IMMEX**: Representa el año del programa IMMEX.
 * 
 * Esta configuración es útil para estructurar y mostrar datos relacionados con
 * los domicilios en el contexto de un programa IMMEX.
 */
export const CONFIGURACION_DOMICILIOS = [
  {
    encabezado: 'Servicio',
    clave: (ele: ServicioInmex): string | undefined => ele.Servicio,
    orden: 1,
  },
  {
    encabezado: 'Registro federal de contribuyentes',
    clave: (ele: ServicioInmex): string | undefined =>
      ele.RegistroContribuyentes,
    orden: 2,
  },
  {
    encabezado: 'Denominación o razón socialNúmero Interior',
    clave: (ele: ServicioInmex): string | undefined => ele.DenominaciónSocial,
    orden: 3,
  },
  {
    encabezado: 'Numero del programa IMMEX',
    clave: (ele: ServicioInmex): string | undefined => ele.NumeroIMMEX,
    orden: 4,
  },
  {
    encabezado: 'Año del programa IMMEXad',
    clave: (ele: ServicioInmex): string | undefined => ele.AñoIMMEX,
    orden: 5,
  },
];

/**
 * CONFIGURACION_SERVICIO_IMMEX es una constante que define la configuración
 * para un servicio IMMEX. Contiene un arreglo de objetos que especifican
 * los encabezados, claves y el orden de los campos que se utilizarán
 * para describir y categorizar los servicios.
 *
 * Cada objeto en el arreglo tiene las siguientes propiedades:
 * - `encabezado`: Una cadena que representa el título o encabezado del campo.
 * - `clave`: Una función que toma un objeto de tipo `Servicio` y devuelve
 *   un valor de tipo `string` o `undefined`, correspondiente a la clave
 *   específica del servicio.
 * - `orden`: Un número que indica el orden en el que se deben mostrar
 *   los campos.
 */
export const CONFIGURACION_SERVICIO_IMMEX = [
  {
    encabezado: 'Descripión del servicio',
    clave: (ele: Servicio): string | undefined => ele.descripiónDelServicio,
    orden: 1,
  },
  {
    encabezado: 'Tipo de servicio',
    clave: (ele: Servicio): string | undefined => ele.tipode,
    orden: 2,
  },
];

/**
 * Configuración para la representación de datos de una empresa extranjera.
 * 
 * Este arreglo contiene objetos que definen la estructura y las propiedades
 * necesarias para mostrar información relacionada con una empresa extranjera.
 * Cada objeto incluye un encabezado, una clave que es una función para acceder
 * a un valor específico de la empresa, y un orden que determina la prioridad
 * de visualización.
 * 
 * Propiedades de cada objeto:
 * - `encabezado`: El título que se mostrará en la interfaz para el campo correspondiente.
 * - `clave`: Una función que toma un objeto de tipo `DatosEmpresaExtranjera` y devuelve
 *   el valor asociado al campo correspondiente.
 * - `orden`: Un número que indica el orden de prioridad para la visualización del campo.
 * 
 * Ejemplo de uso:
 * Este arreglo puede ser utilizado para generar dinámicamente tablas o formularios
 * que muestren información de empresas extranjeras.
 */
export const CONFIGURACION_EMPRESA_ECTRANJERA = [
  {
    encabezado: 'Tax ID',
    clave: (ele: DatosEmpresaExtranjera): string | undefined =>
      ele.taxIdEmpresaExt,
    orden: 1,
  },
  {
    encabezado: 'Nombre del empresa',
    clave: (ele: DatosEmpresaExtranjera): string | undefined =>
      ele.nombreEmpresaExt,
    orden: 2,
  },
  {
    encabezado: 'País',
    clave: (ele: DatosEmpresaExtranjera): string | undefined =>
      ele.entidadFederativaEmpresaExt,
    orden: 2,
  },
  {
    encabezado: 'Dirección',
    clave: (ele: DatosEmpresaExtranjera): string | undefined =>
      ele.direccionEmpresaExtranjera,
    orden: 2,
  },
];

/**
 * Constante que define la estructura de datos para el formulario de empresa extranjera.
 * 
 * Contiene un arreglo de objetos que representan los campos necesarios para capturar
 * la información de una empresa extranjera. Cada objeto incluye propiedades como:
 * 
 * - `labelNombre`: Etiqueta que describe el campo.
 * - `campo`: Nombre del campo en el modelo de datos.
 * - `class`: Clases CSS para el diseño del campo.
 * - `tipo_input`: Tipo de entrada del campo (por ejemplo, texto, selección, área de texto).
 * - `required`: Indica si el campo es obligatorio.
 * - `orden`: Orden en el que se muestra el campo en el formulario.
 * - `opciones`: Opciones disponibles para campos de tipo selección (opcional).
 * 
 * Esta constante es utilizada para generar dinámicamente el formulario de captura
 * de datos de una empresa extranjera.
 */
export const FORMA_EMPRESA_ECTRANJERA: DatosCatalago[] = [
  {
    labelNombre: 'Tax ID',
    campo: 'taxIdEmpresaExt',
    class: 'col-md-4 col-sm-10',
    tipo_input: 'text',
    required: true,
    orden: 1,
  },
  {
    labelNombre: 'Nombre del empresa',
    campo: 'nombreEmpresaExt',
    class: 'col-md-4 col-sm-10',
    tipo_input: 'text',
    required: true,
    orden: 2,
  },
  {
    labelNombre: 'País',
    campo: 'entidadFederativaEmpresaExt',
    class: 'col-md-10 col-10',
    tipo_input: 'select',
    required: true,
    opciones: [],
    orden: 3,
  },
  {
    labelNombre: 'Dirección',
    campo: 'direccionEmpresaExtranjera',
    class: 'col-md-10 col-10',
    tipo_input: 'textarea',
    required: true,
    orden: 4,
  },
];



/**
 * Constante que define las secciones y pasos de un trámite específico (80101).
 * 
 * Contiene la configuración de validación para cada paso y sección del trámite.
 * 
 * - `PASO_1`: Incluye las validaciones de tres secciones (`VALIDACION_SECCION_1`, `VALIDACION_SECCION_2`, `VALIDACION_SECCION_3`).
 * - `PASO_2`: Contiene una validación general para la sección (`VALIDACION_SECCION`).
 * - `PASO_3`: Indica si se requiere validación para este paso (`requiereValidacion`).
 * 
 * Esta constante es útil para gestionar el flujo y las validaciones necesarias
 * en los diferentes pasos de un trámite.
 */
export const SECCIONES_TRAMITE_80101 = {
    PASO_1: {
      VALIDACION_SECCION_1: false,
      VALIDACION_SECCION_2: false,
      VALIDACION_SECCION_3: false,
    },
    PASO_2: {
      VALIDACION_SECCION: true,
    },
    PASO_3: {
      requiereValidacion: true,
    },
  };

/**
 * Contiene los textos utilizados como instrucciones y mensajes para la gestión de requisitos en el programa.
 *
 * @property INSTRUCCIONES - Texto HTML que proporciona instrucciones generales para la gestión de documentos.
 *   - Explica que algunos documentos pueden ser obligatorios dependiendo del caso.
 *   - Indica cómo eliminar documentos no requeridos.
 *   - Describe el proceso para anexar múltiples documentos del mismo tipo.
 *
 * @property ADJUNTAR - Texto HTML que explica cómo adjuntar un nuevo documento.
 *   - Indica la opción a seleccionar para adjuntar un nuevo documento.
 *   - Describe el uso del botón "Adjuntar documentos".
 */
export const TEXTOS_REQUISITOS = {
  INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos dcumentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, seleccionalo y elíminalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo".</p>`,
  ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar dcumentos"</p>`,
};

/**
 * Representa un catálogo de datos complementarios para fracciones.
 * 
 * Este objeto contiene una lista de elementos con identificadores y descripciones
 * que pueden ser utilizados para complementar información relacionada con fracciones.
 * 
 * Propiedades:
 * - `id`: Identificador único del elemento en el catálogo. Por defecto, es `0`.
 * - `descripcion`: Descripción del elemento en el catálogo. Por defecto, es una cadena vacía.
 * 
 * Uso:
 * Este catálogo puede ser utilizado para inicializar o proporcionar valores predeterminados
 * en formularios o procesos relacionados con fracciones.
 */
export const COMPLEMENTAR_FRACCION_CATALOGO_DATOS = [
    {
      id: 1,
      descripcion: 'Materia Prima',
    },
    {
      id: 2,
      descripcion: 'Producto terminado',
    },
];


/**
 * Representa un objeto que contiene información complementaria sobre una fracción arancelaria.
 * Este objeto incluye detalles como la fracción arancelaria, anexos, tipo, unidad de medida, categoría,
 * descripción, y valores relacionados con moneda nacional y volumen en diferentes periodos.
 * 
 * Propiedades:
 * - `fraccionArancelaria`: Cadena que representa la fracción arancelaria.
 * - `anexoDos`: Cadena que contiene información del anexo dos relacionado.
 * - `tipo`: Cadena que indica el tipo de fracción arancelaria.
 * - `umt`: Cadena que representa la unidad de medida utilizada.
 * - `catagoria`: Cadena que describe la categoría de la fracción arancelaria.
 * - `descripcion`: Cadena que proporciona una descripción detallada de la fracción arancelaria.
 * - `monedaNacionalMensual`: Número que indica el valor mensual en moneda nacional.
 * - `monedaNacionalDeDosPeriodos`: Número que representa el valor acumulado en moneda nacional de dos periodos.
 * - `volumenMensual`: Número que indica el volumen mensual.
 * - `twoPeriodVolume`: Número que representa el volumen acumulado de dos periodos.
 */
export const COMPLEMENTAR_FRACCION_DATOS = {
  fraccionArancelaria: '',
  anexoDos: '',
  tipo: '',
  umt: '',
  catagoria: '',
  descripcion: '',
  monedaNacionalMensual: '',
  monedaNacionalDeDosPeriodos: '',
  volumenMensual: '',
  twoPeriodVolume: ''
}

/**
 * Contiene los datos del proyecto relacionados con el trámite.
 * 
 * @property fraccionArancelaria - Representa la fracción arancelaria del proyecto.
 * @property anexoDos - Indica si el proyecto es sensible o no sensible.
 * @property tipo - Define el tipo de operación, como exportación.
 * @property umt - Unidad de medida utilizada, por ejemplo, kilogramos.
 * @property descripcion - Descripción complementaria del proyecto.
 * @property tipoDeDocumente - Tipo de documento asociado al proyecto.
 * @property fechaDeFirma - Fecha en la que se firmó el documento.
 * @property fechaDeVigencia - Fecha de vigencia del documento.
 * @property rfcTaxId - RFC o Tax ID del contribuyente asociado al proyecto.
 * @property razonSocial - Razón social del contribuyente asociado al proyecto.
 */
export const PROYECTO_DATOS = {
  fraccionArancelaria: '6465469',
  anexoDos: 'NO SENSIBLE',
  tipo: 'EXPORTACCION',
  umt: 'KILOGRAM',
  descripcion: 'TEST COMPLEMENTOR',
  tipoDeDocumente: '',
  fechaDeFirma: '',
  fechaDeVigencia: '',
  rfcTaxId: 0,
  razonSocial: ''
}

/**
 * DOCUMENTO_CATALOGO_DATOS es una constante que representa un catálogo de datos de documentos.
 * 
 * Cada elemento del catálogo contiene las siguientes propiedades:
 * - `id`: Identificador único del documento (tipo numérico).
 * - `descripcion`: Descripción del documento (tipo cadena de texto).
 * 
 * En este caso, el catálogo incluye un único elemento con los siguientes valores:
 * - `id`: 0
 * - `descripcion`: 'Cantrado De Maqula'
 * 
 * Esta constante puede ser utilizada para gestionar y mostrar información relacionada con documentos en el sistema.
 */
export const DOCUMENTO_CATALOGO_DATOS = [
  {
    id: 0,
    descripcion: 'Cantrado De Maqula'
  }
]