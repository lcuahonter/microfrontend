/**
 * @const CROSLISTA_DE_PAISES
 * @description Lista de países con sus nombres oficiales y descripciones adicionales.
 */
export const CROSLISTA_DE_PAISES: string[] = [
  'AFGANISTÁN (EMIRATO ISLÁMICO)',
  'ALBANIA (REPÚBLICA DE)',
  'ALEMANIA (REPÚBLICA FEDERAL DE)',
  'ANDORRA (PRINCIPADO DE)',
  'ANGOLA (REPÚBLICA DE)',
  'ANGUILLA',
  'ANTIGUA Y BARBUDA',
  'ARABIA SAUDITA (COMUNIDAD ECONÓMICA EUROPEA)',
  'ARGELIA (REPÚBLICA DEMOCRÁTICA Y POPULAR DE)',
  'ARGENTINA (REPÚBLICA)',
  'AUSTRALIA (COMMONWEALTH OF)',
  'AUSTRIA (REPUBLIC OF)',
  'BAHAMAS (COMMONWEALTH OF THE)',
  'BAHRAIN (KINGDOM OF)',
  "BANGLADESH (PEOPLE'S REPUBLIC OF)",
  'BARbados',
  'BELGIUM (KINGDOM OF)',
  'BELIZE',
  'BENIN (REPUBLIC OF)',
  'BHUTAN (KINGDOM OF)',
];

/**
 * @const CONTINUAR
 * @description Constante que representa un valor genérico para continuar con un proceso.
 */
export const CONTINUAR: string = 't';

/**
 * @const MENSAJE_DE_ALERTA
 * @description Mensaje de alerta sobre el cumplimiento de normativas y posibles sanciones.
 */
export const MENSAJE_DE_ALERTA: string =
  'Cumplo con los requisitos y normatividad aplicable, sin que me eximan de que la autoridad sanitaria verifique su cumplimiento, esto sin perjuicio de las sanciones en que puedo incurrir por falsedad de declaraciones dadas a una autoridad. Asimismo acepto que la notificación de este trámite, sea a través de la Ventanilla Única de Comercio Exterior por los mecanismos de la misma.';

/**
 * @const INPUT_FECHA_CONFIG
 * @description Configuración para un campo de entrada relacionado con la fecha de pago.
 */
export const INPUT_FECHA_CONFIG = {
  labelNombre: 'Fecha de pago',
  required: true,
  habilitado: true,
};

/**
 * @const INPUT_FECHA_CADUCIDAD_CONFIG
 * @description Configuración para un campo de entrada relacionado con la fecha de caducidad.
 */
export const INPUT_FECHA_CADUCIDAD_CONFIG = {
  labelNombre: 'Fecha de caducidad',
  required: false,
  habilitado: true,
};

/**
 * @const TERCEROS_RELACIONADOS_TABLA_HEADER_DATOS
 * @description Encabezados para la tabla de terceros relacionados.
 */
export const TERCEROS_RELACIONADOS_TABLA_HEADER_DATOS = [
  'Nombre/denominación o razón social',
  'R.F.C',
  'CURP',
  'Teléfono',
  'Correo electrónico',
  'Calle',
  'Número exterior',
  'Número interior',
  'País',
  'Colonia',
  'Municipio o alcaldía',
  'Localidad',
  'Entidad federativa',
  'Estado/localidad',
  'Código postal',
];

/**
 * @const DEFAULT_TABLA_ORDEN
 * @description Orden y visibilidad de los sujetos en la tabla.
 */
export const DEFAULT_TABLA_ORDEN = [
  { nombre: 'Fabricante', orden: 1, esVisible: true },
  { nombre: 'Formulador', orden: 2, esVisible: true },
  { nombre: 'Proveedor', orden: 3, esVisible: true },
];


/**
 * Datos del cuerpo de la tabla de terceros relacionados.
 */
export const TERCEROS_RELACIONADOS_TABLA_BODY_DATOS = {
  tbodyData: [
    "FEREZ", "RFC2113", "DUMYD", "12-42322445", "5234", "Avenida Insurgentes", "DUMYD", "23", "1", "DUMYD", "DUMYD", "DUMYD", "DUMYD", "BAJA CALIFORNIA", "DUMYD", "DUMYD"
  ]
};

/**
 * @const TERCEROS_RELACIONADOS_DATOS_INICIALES
 * @description
 * Arreglo que contiene los identificadores de procedimientos para los que se habilitan campos adicionales en los formularios de terceros relacionados.
 * Utilizado para determinar si ciertos campos deben estar habilitados según el trámite seleccionado.
 */
export const TERCEROS_RELACIONADOS_DATOS_INICIALES:number[] = [260601,260101];
/**
 * @constant DEFAULT_TABLA_ORDENS
 * @description Lista de identificadores de trámites para los cuales se
 * aplica el comportamiento por defecto en la tabla de órdenes.
 *
 * @type {number[]}
 */
export const DEFAULT_TABLA_ORDENS = [260201]
