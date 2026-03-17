import {
  DatosCatalago,
  DatosEmpresaExtranjera,
  Servicio,
  ServicioInmex,
} from '../models/nuevo-programa-industrial.model';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { FraccionArancelariaDescripcion } from '../../../shared/models/empresas.model';


/**
 * @const PASOS
 * @description Representa los pasos de un proceso en una solicitud.
 * Cada paso contiene información sobre su índice, título, estado de actividad y si ha sido completado.
 * 
 * @property {number} indice - El índice del paso dentro del proceso.
 * @property {string} titulo - El título descriptivo del paso.
 * @property {boolean} activo - Indica si el paso está activo actualmente.
 * @property {boolean} completado - Indica si el paso ha sido completado.
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
export const CONFIGURACION_EMPRESA_EXTRANJERA = [
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
export const FORMA_EMPRESA_EXTRANJERA: DatosCatalago[] = [
  {
    labelNombre: 'Tax ID',
    campo: 'taxIdEmpresaExt',
    class: 'col-md-4 col-sm-10',
    tipo_input: 'text',
    required: true,
    orden: 1,
  },
  {
    labelNombre: 'Nombre de la empresa',
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
* Secciones a mostrar dentro de cada Paso de acuerdo al trámite
*/
export const SECCIONES_TRAMITE_230401 = {
    PASO_1: {
      VALIDACION_SECCION_1: false,
      VALIDACION_SECCION_2: true,
      VALIDACION_SECCION_3: true,
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
 * @constant
 * @description Constante que representa un catálogo de datos para complementar fracciones.
 * Contiene un arreglo de objetos con propiedades `id` y `descripcion`.
 * 
 * @type {Array<{ id: number; descripcion: string }>}
 * @example
 * // Ejemplo de uso:
 * console.log(COMPLEMENTAR_FRACCION_CATALOGO_DATOS);
 * // Salida: [{ id: 0, descripcion: '' }]
 */
export const COMPLEMENTAR_FRACCION_CATALOGO_DATOS = [{
  id: 0,
  descripcion: ''
}];

/**
 * @constant
* @description Objeto que representa los datos complementarios de una fracción arancelaria.
 * Contiene información como la fracción arancelaria, anexos, tipo, unidad de medida, categoría,
 * descripción, y valores relacionados con moneda nacional y volumen.
 * 
 * @property {string} fraccionArancelaria - Código de la fracción arancelaria.
 * @property {string} anexoDos - Información adicional del anexo dos.
 * @property {string} tipo - Tipo de fracción o categoría.
 * @property {string} umt - Unidad de medida utilizada.
 * @property {string} catagoria - Categoría a la que pertenece la fracción.
 * @property {string} descripcion - Descripción detallada de la fracción.
 * @property {number} monedaNacionalMensual - Valor mensual en moneda nacional.
 * @property {number} monedaNacionalDeDosPeriodos - Valor acumulado de dos periodos en moneda nacional.
 * @property {number} volumenMensual - Volumen mensual asociado.
 * @property {number} twoPeriodVolume - Volumen acumulado de dos periodos.
 */
export const COMPLEMENTAR_FRACCION_DATOS = {
  fraccionArancelaria: '',
  anexoDos: '',
  tipo: '',
  umt: '',
  catagoria: '',
  descripcion: '',
  monedaNacionalMensual: 0,
  monedaNacionalDeDosPeriodos: 0,
  volumenMensual: 0,
  twoPeriodVolume: 0
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
 * @constant DOCUMENTO_CATALOGO_DATOS
 * @description Representa un catálogo de documentos con sus respectivos identificadores y descripciones.
 * Contiene una lista de objetos que describen los documentos disponibles.
 * 
 * @property {number} id - Identificador único del documento.
 * @property {string} descripcion - Descripción del documento.
 */
export const DOCUMENTO_CATALOGO_DATOS = [
  {
    id: 0,
    descripcion: 'Cantrado De Maqula'
  }
]
/**
 * @constant CONFIGURACION_DOS_DATOS
 * @description Configuración de columnas para la representación de datos de fracciones arancelarias.
 * Contiene un arreglo de objetos que definen el encabezado, clave y orden de las columnas.
 * 
 * @type {Array<ConfiguracionColumna<FraccionArancelariaDescripcion>>}
 */

export const CONFIGURACION_DOS_DATOS: ConfiguracionColumna<FraccionArancelariaDescripcion>[] = [
    { encabezado: 'Fracción arancelaria', clave: (item: FraccionArancelariaDescripcion) => item.fraccionArancelaria, orden: 1 },
    { encabezado: 'Descripción', clave: (item: FraccionArancelariaDescripcion) => item.descripcion, orden: 1 },
  ]

  export const USUARIO_INFO = {
        "persona": {
          "claveUsuario": "828811",
          "rfc": "LEQI8101314S7",
          "nombre": "Juan",
          "apellidoPaterno": "Pérez",
          "apellidoMaterno": "Gómez"
        },
        "firmaElectronica": {
        "cadenaOriginal": "ABCDEF1234567890",
        "certificado": "3082054030820428a00302010202143230303031303030303030313030303032303534300d06092a864886f70d01010505003082016f3118301606035504030c0f412e432e2064652070727565626173312f302d060355040a0c26536572766963696f2064652041646d696e69737472616369c3b36e205472696275746172696131383036060355040b0c2f41646d696e69737472616369c3b36e20646520536567757269646164206465206c6120496e666f726d616369c3b36e3129302706092a864886f70d010901161a617369736e657440707275656261732e7361742e676f622e6d783126302406035504090c1d41762e20486964616c676f2037372c20436f6c2e20477565727265726f310e300c06035504110c053036333030310b3009060355040613024d583119301706035504080c10446973747269746f204665646572616c3112301006035504070c09436f796f6163c3a16e31153013060355042d130c5341543937303730314e4e333132303006092a864886f70d0109020c23526573706f6e7361626c653a2048c3a963746f72204f726e656c617320417263696761301e170d3130313232393135343330365a170d3134313232393135343334365a3081ba312630240603550403141d49474e4143494f204544554152444f204c454f5320515549d14f4e4553312630240603550429141d49474e4143494f204544554152444f204c454f5320515549d14f4e455331263024060355040a141d49474e4143494f204544554152444f204c454f5320515549d14f4e4553310b3009060355040613024d5831163014060355042d130d4c455149383130313331345337311b3019060355040513124c455149383130313331484447535847303530819f300d06092a864886f70d010101050003818d0030818902818100be63d94ebf3d6fb4e9a99eb630a80f10dba552c1ee367c93faffec9181244d0b2d6c3c788f4a084dddc7b150b9e2f669d06ee0738d602cc0d2ee6f9e32758e492658ca5b2434a7b3c3ee8fa96b38befb0fc1b8efcd38fb16439626e9990c310d7c9368993c3bc090159693484b6406941f318186517eca71c7a236fc4457c0190203010001a382010830820104300c0603551d130101ff04023000300b0603551d0f0404030203d8301106096086480186f84201010404030205a0301d0603551d0e04160414171ca985e9f7da9f398291ebed01b10b71898956302e0603551d1f042730253023a021a01f861d687474703a2f2f706b692e7361742e676f622e6d782f7361742e63726c303306082b0601050507010104273025302306082b060105050730018617687474703a2f2f6f6373702e7361742e676f622e6d782f301f0603551d23041830168014eb597d04229a538d9e711aa0589629f539e0a0c530100603551d2004093007300506032a0304301d0603551d250416301406082b0601050507030406082b06010505070302300d06092a864886f70d01010505000382010100ce60a5b5b8a3a7ea57878af4cdbe001e8833889ee7287da2c44e865cf4bb8c7770f2561e22aaa57eb7034684a537fc1e08b6f18e4bb2d0821ff27a772dbda420894fa94fb5bb00a9cf4c6dac3c91e23b4cd83cb1ba8ed6c577eb8a3dbd809a475bb904f31a86f10491ecb7ea7851c4586ba44a4da7493f795f4693a83bfc277a8118eeab4e3a4825f41cb69936f2996e0775df50ad78646d8d38abba279666bd21b31ce1e850d4af3ebf88fbc50b00460c2f161af54e3318445b8d8334b173e2e4e874332e1970d7252672956cad704fbd1b5ff6dd38ed1ee3a2dffe502531af5ab4f8cdad18253a26b58c432c2a6aeaaed10ecb9bed8085a217d43641514b53",
        "firma": "uSabSdHjrNAzOLvbSHfjcbHJcJAX8jNEu+K+bMMUeuV9ECJojB0jUmWwKoMK64PWjbJovApPDqa7Y5uwh1qRqIj/3pfLpTR+KCJa9CxotE0ECo8wBxWS3stkkBvxhp8hTDO7ummX8GeQkDvw1Fmaqn3BnG9jxwEVnTeb+1DG2EE="
        },
        "rolActual": "CAPTURISTA_GUBERNAMENTAL",
        "rfcSolicitante": "LEQI8101314S7",
        "idSolicitud": 202775426,
        "referenciaSolicitud": ""
      }