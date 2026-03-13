/**
 * Representa una fracción arancelaria dentro de una estructura jerárquica (árbol).
 *
 * Se utiliza para modelar fracciones que pueden contener subfracciones,
 * así como para controlar su estado visual y de carga en componentes
 * como árboles o listas expandibles.
 */
export interface FraccionArancelaria {
  /**
   * Identificador único de la fracción arancelaria.
   */
  id: string;

  /**
   * Estado actual del nodo en el árbol.
   * - 'open': el nodo está expandido.
   * - 'closed': el nodo está colapsado.
   */
  state: 'open' | 'closed';

  /**
   * Título o descripción de la fracción arancelaria.
   */
  title: string;

  /**
   * Información adicional asociada a la fracción.
   */
  content: {
    /**
     * Nombre o clave visible de la fracción arancelaria.
     */
    name: string;
  };

  /**
   * Lista de fracciones hijas (subniveles).
   * Es opcional y solo se define cuando existen subfracciones.
   */
  children?: FraccionArancelaria[];

  /**
   * Indica si la fracción tiene subfracciones disponibles.
   * Se utiliza comúnmente para carga diferida (lazy loading).
   */
  hasChildren?: boolean;

  /**
   * Indica si la fracción se encuentra en proceso de carga.
   */
  isLoading?: boolean;

  /**
   * Indica si la fracción está actualmente expandida en el árbol.
   */
  isExpanded?: boolean;

  /**
   * Nivel jerárquico de la fracción dentro del árbol.
   * El nivel raíz suele ser 0 o 1, dependiendo de la implementación.
   */
  level?: number;
}

/**
 * Representa la respuesta del servicio que retorna fracciones arancelarias.
 */
export interface FraccionesResponse {
  /**
   * Objeto contenedor de la información retornada por el servicio.
   */
  data: {
    /**
     * Lista de fracciones arancelarias obtenidas.
     */
    items: FraccionArancelaria[];
  };
}
