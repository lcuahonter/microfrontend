/**
 * Lista de opciones para seleccionar la modalidad de exportación.
 * 
 * Cada objeto en el arreglo representa una opción con las siguientes propiedades:
 * - `label`: El nombre descriptivo de la modalidad de exportación.
 * - `value`: El valor asociado a la modalidad, representado como una cadena.
 * - `id`: El identificador único relacionado con el tipo de régimen.
 * 
 * Opciones disponibles:
 * - `Definitiva`: Representa una exportación definitiva.
 * - `Temporal`: Representa una exportación temporal.
 */
export const MODALIDAD_RADIO_OPCIONS = [
  { label: 'Definitiva', value: '1', id: 'idTipoRegimenDefinitivo' },
  { label: 'Temporal', value: '2', id: 'idTipoRegimenTemporal' },
];


/**
 * Opciones de selección para indicar si hay exposición o no.
 * 
 * Cada opción incluye:
 * - `label`: El texto que se mostrará al usuario.
 * - `value`: El valor asociado a la opción, representado como una cadena.
 * - `id`: Un identificador único para la opción.
 * 
 * Opciones disponibles:
 * - "Si": Representa que hay exposición.
 * - "No": Representa que no hay exposición.
 */
export const EXPOSICION_RADIO_OPCIONS = [
  { label: 'Si', value: "true", id: 'radioExposicionSi' }, 
  { label: 'No', value: "false", id: 'radioExposicionNo' }, 
];


/**
 * Interfaz que representa las propiedades de un monumento.
 */
export interface Monumentos {
  /**
   * Título del monumento.
   */
  titulo: string;

  /**
   * Época del monumento.
   */
  epoca: string;

  /**
   * Autor del monumento.
   */
  autor: string;

  /**
   * Material del monumento.
   */
  material: string;

  /**
   * Altura del monumento en unidades específicas.
   */
  alto: number;

  /**
   * Ancho del monumento en unidades específicas.
   */
  ancho: number;

  /**
   * Profundidad del monumento en unidades específicas.
   */
  profundidad: string;

  /**
   * Fracción arancelaria del monumento.
   */
  fraccion: string;

  /**
   * Descripción del estado del monumento.
   */
  descripcionEstado: string;

  /**
   * Descripción detallada del material del monumento.
   */
  descMaterial: string;

  /**
   * Descripción detallada de la fracción arancelaria.
   */
  descFraccion: string;

  /**
   * Descripción detallada de la época del monumento.
   */
  descEpoca: string;
}
  
/**
 * Configuración de la tabla de accionistas para la visualización de monumentos.
 * Cada objeto en el arreglo representa una columna de la tabla con su respectivo encabezado,
 * clave para obtener el valor de la columna y el orden en que debe aparecer.
 */
export const CONFIGURACION_ACCIONISTAS_TABLA = [
  {
    /**
     * Encabezado de la columna que muestra el título del monumento.
     */
    encabezado: 'Título',
    /**
     * Función que obtiene el título del monumento.
     * @param ele - Objeto de tipo `Monumentos`.
     * @returns El título del monumento.
     */
    clave: (ele: Monumentos): string => ele.titulo,
    /**
     * Orden de la columna en la tabla.
     */
    orden: 1,
  },
  {
    /**
     * Encabezado de la columna que muestra el autor del monumento.
     */
    encabezado: 'Autor',
    /**
     * Función que obtiene el autor del monumento.
     * @param ele - Objeto de tipo `Monumentos`.
     * @returns El autor del monumento.
     */
    clave: (ele: Monumentos): string => ele.autor,
    /**
     * Orden de la columna en la tabla.
     */
    orden: 2,
  },
  {
    /**
     * Encabezado de la columna que muestra la época del monumento.
     */
    encabezado: 'Época',
    /**
     * Función que obtiene la descripción de la época del monumento.
     * @param ele - Objeto de tipo `Monumentos`.
     * @returns La descripción de la época del monumento.
     */
    clave: (ele: Monumentos): string => ele.descEpoca,
    /**
     * Orden de la columna en la tabla.
     */
    orden: 3,
  },
  {
    /**
     * Encabezado de la columna que muestra la altura del monumento.
     */
    encabezado: 'Alto',
    /**
     * Función que obtiene la altura del monumento.
     * @param ele - Objeto de tipo `Monumentos`.
     * @returns La altura del monumento.
     */
    clave: (ele: Monumentos): number => ele.alto,
    /**
     * Orden de la columna en la tabla.
     */
    orden: 4,
  },
  {
    /**
     * Encabezado de la columna que muestra el ancho del monumento.
     */
    encabezado: 'Ancho',
    /**
     * Función que obtiene el ancho del monumento.
     * @param ele - Objeto de tipo `Monumentos`.
     * @returns El ancho del monumento.
     */
    clave: (ele: Monumentos): number => ele.ancho,
    /**
     * Orden de la columna en la tabla.
     */
    orden: 5,
  },
  {
    /**
     * Encabezado de la columna que muestra la profundidad del monumento.
     */
    encabezado: 'Profundidad',
    /**
     * Función que obtiene la profundidad del monumento.
     * @param ele - Objeto de tipo `Monumentos`.
     * @returns La profundidad del monumento.
     */
    clave: (ele: Monumentos): string => ele.profundidad,
    /**
     * Orden de la columna en la tabla.
     */
    orden: 6,
  },
  {
    /**
     * Encabezado de la columna que muestra el tipo de material del monumento.
     */
    encabezado: 'Tipo de Material',
    /**
     * Función que obtiene la descripción del material del monumento.
     * @param ele - Objeto de tipo `Monumentos`.
     * @returns La descripción del material del monumento.
     */
    clave: (ele: Monumentos): string => ele.descMaterial,
    /**
     * Orden de la columna en la tabla.
     */
    orden: 7,
  },
  {
    /**
     * Encabezado de la columna que muestra la fracción arancelaria del monumento.
     */
    encabezado: 'Fracción Arancelaria',
    /**
     * Función que obtiene la descripción de la fracción arancelaria del monumento.
     * @param ele - Objeto de tipo `Monumentos`.
     * @returns La descripción de la fracción arancelaria del monumento.
     */
    clave: (ele: Monumentos): string => ele.descFraccion,
    /**
     * Orden de la columna en la tabla.
     */
    orden: 8,
  },
  {
    /**
     * Encabezado de la columna que muestra la descripción del estado del monumento.
     */
    encabezado: 'Descripción del Estado',
    /**
     * Función que obtiene la descripción del estado del monumento.
     * @param ele - Objeto de tipo `Monumentos`.
     * @returns La descripción del estado del monumento.
     */
    clave: (ele: Monumentos): string => ele.descripcionEstado,
    /**
     * Orden de la columna en la tabla.
     */
    orden: 9,
  },
];
   
/**
 * Interfaz que define las propiedades de un elemento añadido en el trámite de permiso de exportación.
 * 
 * Esta interfaz es utilizada para representar los elementos que se añaden a la solicitud de permiso,
 * incluyendo detalles como la descripción, dimensiones y presentación del elemento.
 */
export interface Elemento {
  /**
   * Propiedades del elemento añadido.
   */
  descElementoAnadido: string;
  /**
   * ID del elemento añadido.
   */
  idElementoAnadido: string;
  /**
   * Descripción de la presentación del material del elemento.
   */
  descripcionPresentacion: string;
  /**
   * Dimensiones del elemento añadido.
   */
  alto: number;
  /**
   * Ancho del elemento añadido.
   */
  ancho: number;
  /**
   * Profundidad del elemento añadido.
   */
  profundidad: number;
}

// Configuración de la tabla para mostrar los datos de los elementos añadidos.
/**
 * Configuración de los elementos de la tabla para el módulo de permisos de exportación.
 * Cada objeto en el arreglo representa una columna de la tabla con su respectivo encabezado,
 * clave para obtener el valor y el orden en el que aparece.
 */
export const CONFIGURACION_ELEMENTO_TABLA = [
  {
    /**
     * Encabezado de la columna que muestra el nombre del elemento.
     */
    encabezado: 'Elemento', // Encabezado de la columna.
    /**
     * Función que obtiene la descripción del elemento añadido.
     * @param ele - Objeto del tipo `Elemento`.
     * @returns La descripción del elemento añadido.
     */
    clave: (ele: Elemento): string => ele.descElementoAnadido, // Obtiene la descripción del elemento añadido.
    /**
     * Orden en el que aparece la columna en la tabla.
     */
    orden: 1, // Orden de la columna.
  },
  {
    /**
     * Encabezado de la columna que muestra la altura del elemento.
     */
    encabezado: 'Alto',
    /**
     * Función que obtiene la altura del elemento.
     * @param ele - Objeto del tipo `Elemento`.
     * @returns La altura del elemento.
     */
    clave: (ele: Elemento): number => ele.alto,
    /**
     * Orden en el que aparece la columna en la tabla.
     */
    orden: 2,
  },
  {
    /**
     * Encabezado de la columna que muestra el ancho del elemento.
     */
    encabezado: 'Ancho',
    /**
     * Función que obtiene el ancho del elemento.
     * @param ele - Objeto del tipo `Elemento`.
     * @returns El ancho del elemento.
     */
    clave: (ele: Elemento): number => ele.ancho,
    /**
     * Orden en el que aparece la columna en la tabla.
     */
    orden: 3,
  },
  {
    /**
     * Encabezado de la columna que muestra la profundidad del elemento.
     */
    encabezado: 'Profundidad',
    /**
     * Función que obtiene la profundidad del elemento.
     * @param ele - Objeto del tipo `Elemento`.
     * @returns La profundidad del elemento.
     */
    clave: (ele: Elemento): number => ele.profundidad,
    /**
     * Orden en el que aparece la columna en la tabla.
     */
    orden: 4,
  },
  {
    /**
     * Encabezado de la columna que muestra la descripción del material del elemento.
     */
    encabezado: 'Descripcion de material',
    /**
     * Función que obtiene la descripción de la presentación del material.
     * @param ele - Objeto del tipo `Elemento`.
     * @returns La descripción de la presentación del material.
     */
    clave: (ele: Elemento): string => ele.descripcionPresentacion,
    /**
     * Orden en el que aparece la columna en la tabla.
     */
    orden: 5,
  },
  {
    /**
     * Encabezado de la columna que muestra otra descripción del elemento.
     */
    encabezado: 'Descripcion otro',
    /**
     * Función que obtiene otra descripción de la presentación del material.
     * @param ele - Objeto del tipo `Elemento`.
     * @returns Otra descripción de la presentación del material.
     */
    clave: (ele: Elemento): string => ele.descripcionPresentacion,
    /**
     * Orden en el que aparece la columna en la tabla.
     */
    orden: 6,
  },
];