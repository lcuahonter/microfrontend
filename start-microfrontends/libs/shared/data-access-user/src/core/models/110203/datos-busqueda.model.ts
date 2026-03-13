/**
 * Interfaz que representa una opción de tipo radio en un formulario o componente.
 * 
 * Esta interfaz se utiliza para definir las propiedades necesarias de una opción
 * que será desplegada como un botón de opción (radio button) en un formulario o
 * componente interactivo. Cada opción tiene una etiqueta visible para el usuario
 * y un valor interno que puede ser utilizado para identificar la opción seleccionada
 * o enviarla al backend como parte de los datos del formulario.
 * 
 * @property {string} label - Etiqueta o texto descriptivo que se muestra al usuario para esta opción.
 *                            Este texto es lo que el usuario verá junto al botón de opción.
 *                            Por ejemplo, "Hombre" o "Mujer" en un formulario de selección de género.
 * 
 * @property {string} value - Valor asociado a esta opción, que generalmente se utiliza para identificarla
 *                            de manera única en el sistema. Este valor es enviado al backend cuando el
 *                            formulario es enviado. Por ejemplo, "M" para "Masculino" o "F" para "Femenino".
 */
export interface RadioOpcion {
    /**
     * Etiqueta o texto descriptivo que se muestra al usuario para esta opción.
     * Este texto es lo que el usuario verá junto al botón de opción (radio button).
     * Por ejemplo, "Hombre" o "Mujer" en un formulario de selección de género.
     */
    label: string; 

    /**
     * Valor interno asociado a esta opción, que generalmente se utiliza para identificarla
     * de manera única en el sistema. Este valor es enviado al backend cuando el formulario
     * es enviado. Por ejemplo, "M" para "Masculino" o "F" para "Femenino".
     */
    value: string; 
}
/**
 * **Representa un ítem dentro de un catálogo**  
 * Contiene un identificador único y una descripción del ítem.
 */
interface CatalogoItem {
    /** Identificador único del ítem en el catálogo. */
    id: number;
  
    /** Descripción del ítem dentro del catálogo. */
    descripcion: string;
  }
  
  /**
   * **Configuración de un Dropdown basado en un catálogo**  
   * Contiene una lista de ítems que serán utilizados dentro del dropdown.
   */
  export interface ConfiguracionDropdown {
    /** Lista de elementos disponibles en el catálogo para el dropdown. */
    catalogos: CatalogoItem[];
  }
  
  /**
   * **Estructura de datos para una tabla**  
   * Define el formato general de los datos utilizados en una tabla.
   */
  export interface TableData {
    /** Encabezados de la tabla, representados como un array de strings. */
    encabezadoDeTabla: string[];
  
    /** Cuerpo de la tabla, representado como un array de filas. */
    cuerpoTabla: TableRow[];
  }
  
  /**
   * **Representa una fila dentro de una tabla**  
   * Contiene los datos organizados por columnas dentro del cuerpo de la tabla.
   */
 interface TableRow {
    /** Datos de la fila, organizados como un array de strings. */
    tbodyData: string[];
  }