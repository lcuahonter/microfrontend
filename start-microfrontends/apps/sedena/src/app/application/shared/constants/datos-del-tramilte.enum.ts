/**
 * Lista de aduanas disponibles para la lista cruzada.
 *
 * @constant
 * @type {string[]}
 * @description Contiene un arreglo de nombres de aduanas disponibles para la lista cruzada.
 */
export const CROSLISTA_ADUANAS_DISPONIBLES: string[] = [
  'ACAPULCO, PUERTO Y AEROPUERT',
  'ADUANA DE PANTACO',
  'AEROPUERTO INT. DE LA CD DE MEX',
  'AEROPUERTO INTERNACIONAL FELIP',
  'AGUA PRIETA',
  'AGUASCALIENTES, AGS.',
  'ALTAMIRA',
  'CANCUN, AEROPUERTO',
  'CD. CAMARGO, TAMPS.',
  'CD. DEL CARMEN',
  'CD. JUAREZ',
  'CHIHUAHUA, CHIH.',
];

/**
 * Identificadores numéricos relacionados con permisos definitivos.
 *
 * @constant
 * @type {number[]}
 * @description Representa códigos específicos utilizados en el sistema para identificar tipos de permisos definitivos.
 */
export const PERMISO_DEFINITIVO_TITULO = [
  240119, 240120, 240118, 240107, 240106, 240108, 240308, 240117, 240121, 240405, 240111, 240305, 240311, 240411, 240122, 240407, 240123, 240321, 240112,240105,240108
];

/**
 * Identificadores numéricos relacionados con permisos aduaneros.
 *
 * @constant
 * @type {number[]}
 * @description Representa códigos específicos utilizados en el sistema para identificar permisos aduaneros.
 */
export const PERMISO_ADUNA_TITULO = [240119, 240120, 240118, 240123,240117,240122];

/**
 * Identificadores numéricos relacionados con permisos OCULTAR_BOTONES.
 *
 * @constant
 * @type {number[]}
 * @description Representa códigos específicos utilizados en el sistema para identificar permisos OCULTAR_BOTONES.
 */
export const OCULTAR_BOTONES = [240120, 240121, 240107, 240311, 240407, 240123, 240321, 240118];

/**
* @const NO_VISIBILIDAD_UMC
* @type {number[]}
* @description Arreglo que contiene los identificadores numéricos de las UMC (Unidades de Medida y Clasificación) 
* que no deben ser visibles en la aplicación.
* @author [Tu Nombre o Equipo]
*/
export const NO_VISIBILIDAD_UMC: number[] = [

];

/**
 * Mapa de etiquetas asociadas a países.
 *
 * @constant
 * @type {Map<number, string>}
 * @description Contiene un mapa que asocia identificadores numéricos con etiquetas descriptivas de países.
 */
export const PAISE_DENTINO_EITIQUETA: Map<number, string> = new Map<
  number,
  string
>([
  [240119, 'País de procedencia'],
  [240117, 'País de procedencia'],
  [240120, 'País de procedencia'],
  [240118, 'País de procedencia'],
  [240123, 'País de procedencia'],
  [240122, 'País de procedencia'],
  [240108, 'paise destino'],
  [240308, 'paise destino'],
  [240405, 'paise destino'],
  [240305, 'paise destino'],
  [240411, 'paise destino'],
  [240407, 'País destino'],
  [240102, 'País destino'],
  [240101, 'País destino'],
  [240105, 'País destino'],
  [240107, 'País destino'],
  [240106, 'País destino'],
]);

/**
 * Códigos de mercancía que pueden mostrar la lista cruzada.
 *
 * @constant
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos que representan mercancías específicas para las cuales se permite mostrar la lista cruzada.
 */
export const PUEDE_MOSTRAR_LA_LISTA_CRUZADA_FOR_MERCANCIA = [240108, 240107, 240117, 240121, 240111, 240122,240105];

/**
 * Período del semestre habilitado.
 *
 * @constant
 * @type {number[]}
 * @description Contiene un arreglo de números que identifican el semestre habilitado. Este valor puede ser utilizado para validar o configurar funcionalidades relacionadas con el período académico activo.
 */
export const PERIODO_SEMESTRE_HABILITADO = [
  240119, 240108, 240107, 240114, 240106, 240308, 240117, 240121, 240405, 240111, 240305, 240311, 240411, 240407, 240321,240105
];

/**
 * Identificadores numéricos relacionados con manifiestos y declaraciones.
 *
 * @constant
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos relacionados con manifiestos y declaraciones en el sistema.
 */
export const MANIFIESTOS_DECLARACIONES = [240107, 240106, 240117, 240407, 240123];

/**
 * Identificadores numéricos relacionados con fechas de pago.
 *
 * @constant
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos relacionados con fechas de pago en el sistema.
 */
export const FETCHA_PAGO = [240107, 240106, 240407];

/**
 * Identificadores numéricos relacionados con fechas de salida.
 *
 * @constant
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos relacionados con fechas de salida en el sistema.
 */
export const FETCHA_SALIDA = [240123];

/**
 * Identificadores numéricos relacionados con CURP.
 *
 * @constant
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos relacionados con CURP en el sistema.
 */
export const ES_CURP = [240107, 240114, 240118, 240117, 240121, 240311, 240105];

/**
 * Identificadores numéricos relacionados con RFC.
 *
 * @constant
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos relacionados con NACIONAL en el sistema.
 */
export const ES_NACIONAL = [240118];

/**
 * Período del primer semestre.
 *
 * @constant
 * @type {Array<{label: string, value: string}>}
 * @description Contiene un arreglo de objetos que representan el primer semestre, con propiedades `label` y `value`.
 */
export const PERIODO_UNO_SEMESTRE = [
  {
    label: '1° semestre',
    value: 'unoSemestre',
  },
    {
    label: '2° semestre',
    value: 'dosSemestre',
  },
];

/**
 * Período del segundo semestre.
 *
 * @constant
 * @type {Array<{label: string, value: string}>}
 * @description Contiene un arreglo de objetos que representan el segundo semestre, con propiedades `label` y `value`.
 */
export const PERIODO_DOS_SEMESTRE = [
  {
    label: '2° semestre',
    value: 'dosSemestre',
  },
];

/**
 * Mapa de datos relacionados con trámites específicos.
 *
 * @constant
 * @type {Map<string, number[]>}
 * @description Este mapa asocia claves de tipo string con arreglos de números. Cada clave representa un identificador único del trámite, mientras que el valor asociado es un arreglo de números que contiene información relevante para ese trámite.
 */
export const DATOS_DEL_TRAMITE_MAP: Map<string, number[]> = new Map([
  ['unoSemestre', [240119]],
  ['dosSemestre', [240119]],
  ['anoEnCurso', [240119]],
]);

/**
 * Lista de IDs de países en los que se debe ocultar la opción "Agregar mercancía".
 *
 * @constant
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos de países donde se debe ocultar la opción "Agregar mercancía".
 */
export const AGGREGAR_MERCANCIA_PAISE_OCULTAR = [240108];

/**
 * @constant
 * @name PERMISO_JUSTIFICACION
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos relacionados con permisos de justificación específicos.
 * Este valor es utilizado en el sistema para identificar trámites que requieren justificación.
 */
export const PERMISO_JUSTIFICACION = [240308, 240405, 240305, 240411, 240407, 240321];

/**
 * @constant
 * @name PERMISO_JUSTIFICACION
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos relacionados con permisos de justificación específicos.
 * Este valor es utilizado en el sistema para identificar trámites que requieren justificación.
 */
export const PERMISO_DISABLE = [240305];

/**
 * Constante que define una lista de permisos generales que deben ser ocultados.
 * 
 * @const OCULTAR_PERMISO_GENERAL
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos que representan permisos específicos
 * que no deben ser visibles o accesibles en ciertas partes de la aplicación.
 */
export const OCULTAR_PERMISO_GENERAL = [240102];

/**
 * Identificadores numéricos relacionados con RFC.
 * 
 * @constant
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos relacionados con RFC en el sistema.
 */
export const ES_RFC = [240117];

/**
 * @constant
 * @name DESACTIVADO_PERMISO_GENERAL
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos que representan permisos generales desactivados en el sistema.
 * Este valor es utilizado para identificar permisos que no están habilitados o disponibles en ciertas funcionalidades.
 */
export const DESACTIVADO_PERMISO_GENERAL = [240405, 240411, 240321];

/**
 * @constant
 * @name ADUANA_TEXTO
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos relacionados con aduanas específicas.
 * Este valor es utilizado en el sistema para identificar trámites o permisos asociados a estas aduanas.
 */
export const ADUANA_TEXTO = [240123, 240120, 240118,240119,240117,240122];