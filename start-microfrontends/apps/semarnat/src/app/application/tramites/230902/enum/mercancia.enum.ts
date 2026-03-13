   /**
 * @description
 * Interfaz que define la estructura de un elemento de configuración para la tabla de mercancías.
 */
   export interface ConfiguracionItem {
    /**
     * @description
     * Fracción arancelaria de la mercancía.
     */
    id: number; // Added the 'id' property
    fraccionArancelaria: string;
    fraccionDescripcion : string;
    /**
     * @description
     * Indica si la mercancía pertenece a otra fracción.
     */
    otraFraccion: boolean;
  
    /**
     * @description
     * Descripción de la mercancía.
     */
    descripcion: string;
  
    /**
     * @description
     * Clasificación taxonómica de la mercancía.
     */
    clasificacionTaxonomica: string;
  
    /**
     * @description
     * Rendimiento del producto.
     */
    rendimientoProducto: string;
  
    /**
     * @description
     * Nombre científico de la mercancía.
     */
    nombreCientifico: string;
  
    /**
     * @description
     * Nombre común de la mercancía.
     */
    nombreComun: string;
  
    /**
     * @description
     * Marca o marcaje de la mercancía.
     */
    marca: string;
  
    /**
     * @description
     * cantidad de la mercancía.
     */
    cantidad: string;
  
    /**
     * @description
     * Unidad de medida de la mercancía.
     */
    unidadMedida: string;
  
    /**
     * @description
     * País de origen de la mercancía.
     */
    paisOrigen: string;
  
    /**
     * @description
     * País de procedencia de la mercancía.
     */
    paisProcedencia: string;
    
  }
  
  /**
   * @description
   * Configuración de las columnas para la tabla de mercancías.
   */
  export const CONFIGURACION_TABLA_MERCANCIA = [
    {
      /**
       * @description
       * Encabezado de la columna para la fracción arancelaria.
       */
      encabezado: 'Fracción arancelaria',
      /**
       * @description
       * Clave que define cómo obtener el valor de la fracción arancelaria de un elemento.
       */
      clave: (item: ConfiguracionItem): string => item.fraccionArancelaria,
      /**
       * @description
       * Orden de la columna en la tabla.
       */
      orden: 1,
    },
    {
      encabezado: 'Otra fracción',
      clave: (item: ConfiguracionItem): boolean => item.otraFraccion,
      orden: 2,
    },
    {
      encabezado: 'Descripción',
      clave: (item: ConfiguracionItem): string => item.descripcion,
      orden: 3,
    },
    {
      encabezado: 'Rendimiento del producto',
      clave: (item: ConfiguracionItem): string => item.rendimientoProducto,
      orden: 4,
    },
    {
      encabezado: 'Nombre científico',
      clave: (item: ConfiguracionItem): string => item.nombreCientifico,
      orden: 5,
    },
    {
      encabezado: 'Nombre común',
      clave: (item: ConfiguracionItem): string => item.nombreComun,
      orden: 6,
    },
    {
      encabezado: 'Marca (marcaje)',
      clave: (item: ConfiguracionItem): string => item.marca,
      orden: 7,
    },
    {
      encabezado: 'cantidad',
      clave: (item: ConfiguracionItem): string => item.cantidad,
      orden: 8,
    },
    {
      encabezado: 'Unidad de medida',
      clave: (item: ConfiguracionItem): string => item.unidadMedida,
      orden: 9,
    },
    {
      encabezado: 'País de orígen',
      clave: (item: ConfiguracionItem): string => item.paisOrigen,
      orden: 10,
    },
    {
      encabezado: 'País de procedencia',
      clave: (item: ConfiguracionItem): string => item.paisProcedencia,
      orden: 11,
    },
  ];