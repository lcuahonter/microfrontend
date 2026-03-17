/**
 * Modelos de datos y configuraciones para el trámite 290101 - Café de Exportadores.
 * 
 * Este archivo contiene las interfaces, constantes y configuraciones necesarias para el manejo
 * de datos relacionados con los procesos de registro y gestión de café de exportación,
 * incluyendo regiones, beneficios, bodegas y pasos del asistente.
 */

/**
 * Modelo de datos para los pasos del asistente de IMMEX.
 * 
 * Define la estructura para cada paso en el flujo del asistente, permitiendo
 * el control del estado de navegación y progreso del usuario.
 * 
 * @export
 * @interface ListaPasosWizard
 */
export interface ListaPasosWizard {
  /**
   * Posición del paso en el asistente.
   * @property {number} indice
   */
  indice: number;
  
  /**
   * Título descriptivo del paso.
   * @property {string} titulo
   */
  titulo: string;
  
  /**
   * Indica si el paso está activo actualmente.
   * @property {boolean} activo
   */
  activo: boolean;
  
  /**
   * Indica si el paso está completado.
   * @property {boolean} completado
   */
  completado: boolean;
}

/**
 * Modelo de datos para las opciones de un radio button.
 * 
 * Define la estructura básica para opciones de selección única,
 * comúnmente utilizada en formularios de interfaz de usuario.
 * 
 * @export
 * @interface RadioOpcion
 */
export interface RadioOpcion {
  /**
   * Etiqueta visible de la opción para el usuario.
   * @property {string} label
   */
  label: string;
  
  /**
   * Valor interno de la opción.
   * @property {string} value
   */
  value: string;
}

/**
 * Modelo de datos para un catálogo.
 * 
 * Estructura genérica para representar elementos de catálogos del sistema,
 * con propiedades básicas y opcionales para diferentes tipos de clasificaciones.
 * 
 * @export
 * @interface Catalogo
 */
export interface Catalogo {
  /**
   * Identificador único del catálogo.
   * @property {number} id
   */
  id: number;
  
  /**
   * Descripción del elemento del catálogo.
   * @property {string} descripcion
   */
  descripcion: string;
  
  /**
   * Clave opcional del catálogo.
   * @property {string} [clave]
   */
  clave?: string;
  
  /**
   * Tamaño opcional del catálogo.
   * @property {string} [tam]
   */
  tam?: string;
  
  /**
   * DPI opcional del catálogo.
   * @property {string} [dpi]
   */
  dpi?: string;
}

/**
 * Configuración de las columnas de la tabla para el servicio REGIONES.
 * 
 * Define la estructura y configuración de las columnas que se mostrarán
 * en la tabla de regiones, incluyendo encabezados, claves de acceso y orden de presentación.
 * Cada columna está configurada con una función de acceso que extrae el valor
 * correspondiente del objeto RegionesInfo.
 * 
 * @constant {Array<Object>}
 */
export const REGIONES_SERVICIO = [
  {
    /**
     * @property {string} encabezado
     * Título de la columna que se muestra al usuario.
     */
    encabezado: 'Estado',
    
    /**
     * @property {Function} clave
     * Función que extrae el valor de la columna del objeto de datos.
     */
    clave: (ele: RegionesInfo): string => ele.TABLA_Columna_1,
    
    /**
     * @property {number} orden
     * Posición de la columna en la tabla.
     */
    orden: 1
  },
  {
    encabezado: 'Café Compra',
    clave: (ele: RegionesInfo): string => ele.TABLA_Columna_2,
    orden: 2
  },
  {
    encabezado: 'Región',
    clave: (ele: RegionesInfo): string => ele.TABLA_Columna_3,
    orden: 3
  },
  {
    encabezado: 'Tipo de Café',
    clave: (ele: RegionesInfo): string => ele.TABLA_Columna_4,
    orden: 4
  },
  {
    encabezado: 'Volúmen',
    clave: (ele: RegionesInfo): string => ele.TABLA_Columna_5,
    orden: 5
  }
]

/**
 * Interfaz para la información de REGIONES.
 * 
 * Define la estructura de datos para representar información de regiones
 * en el sistema de café de exportación. Contiene columnas de datos específicas
 * y el estado de activación de cada región.
 * 
 * @export
 * @interface RegionesInfo
 */
export interface RegionesInfo {
  /**
   * Información del Estado.
   * @property {string} TABLA_Columna_1
   */
  TABLA_Columna_1: string;
  
  /**
   * Información de Café Compra.
   * @property {string} TABLA_Columna_2
   */
  TABLA_Columna_2: string;
  
  /**
   * Información de la Región.
   * @property {string} TABLA_Columna_3
   */
  TABLA_Columna_3: string;
  
  /**
   * Información del Tipo de Café.
   * @property {string} TABLA_Columna_4
   */
  TABLA_Columna_4: string;
  
  /**
   * Información del Volumen.
   * @property {string} TABLA_Columna_5
   */
  TABLA_Columna_5: string;
  
  /**
   * Estado de activación de la región.
   * @property {boolean} estatus
   */
  estatus: boolean;
}

/**
 * Configuración de las columnas de la tabla para el servicio BENEFICIOS.
 * 
 * Define la estructura y configuración de las columnas para la visualización
 * de información de beneficios de café. Incluye datos de ubicación, características
 * y capacidades de los beneficios registrados en el sistema.
 * 
 * @constant {Array<Object>}
 */
export const BENEFICIOS_SERVICIO = [
  {
    /**
     * @property {string} encabezado
     * Título de la columna - Nombre del beneficio.
     */
    encabezado: 'Nombre',
    
    /**
     * @property {Function} clave
     * Función que extrae el nombre del beneficio.
     */
    clave: (ele: BeneficiosInfo): string => ele.TABLA_Columna_1,
    
    /**
     * @property {number} orden
     * Posición de la columna en la tabla.
     */
    orden: 1
  },
  {
    encabezado: 'Calle',
    clave: (ele: BeneficiosInfo): string => ele.TABLA_Columna_3,
    orden: 2
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: BeneficiosInfo): string => ele.TABLA_Columna_4,
    orden: 3
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: BeneficiosInfo): string => ele.TABLA_Columna_5,
    orden: 4
  },
  {
    encabezado: 'Colonia',
    clave: (ele: BeneficiosInfo): string => ele.TABLA_Columna_6,
    orden: 5
  }
  ,
  {
    encabezado: 'Estado',
    clave: (ele: BeneficiosInfo): string => ele.TABLA_Columna_7,
    orden: 6
  }
  ,
  {
    encabezado: 'Código Postal',
    clave: (ele: BeneficiosInfo): string => ele.TABLA_Columna_8,
    orden: 7
  }
  ,
  {
    encabezado: 'Propia o Aliquilada',
    clave: (ele: BeneficiosInfo): string => ele.TABLA_Columna_2,
    orden: 8
  }
  ,
  {
    encabezado: 'Capacidad (Kg)',
    clave: (ele: BeneficiosInfo): string => ele.TABLA_Columna_9,
    orden: 9
  }
  ,
  {
    encabezado: 'Volúmen (Kg)',
    clave: (ele: BeneficiosInfo): string => ele.TABLA_Columna_10,
    orden: 10
  }
]

/**
 * Interfaz para la información de BENEFICIOS.
 * 
 * Define la estructura de datos para representar información completa
 * de los beneficios de café, incluyendo datos de ubicación, propiedad,
 * capacidades de procesamiento y estado operativo.
 * 
 * @export
 * @interface BeneficiosInfo
 */
export interface BeneficiosInfo {
  /**
   * Nombre del beneficio.
   * @property {string} TABLA_Columna_1
   */
  TABLA_Columna_1: string;
  
  /**
   * Calle de la dirección del beneficio.
   * @property {string} TABLA_Columna_2
   */
  TABLA_Columna_2: string;
  
  /**
   * Número exterior del beneficio.
   * @property {string} TABLA_Columna_3
   */
  TABLA_Columna_3: string;
  
  /**
   * Número interior del beneficio.
   * @property {string} TABLA_Columna_4
   */
  TABLA_Columna_4: string;
  
  /**
   * Colonia donde se ubica el beneficio.
   * @property {string} TABLA_Columna_5
   */
  TABLA_Columna_5: string;
  
  /**
   * Estado donde se encuentra el beneficio.
   * @property {string} TABLA_Columna_6
   */
  TABLA_Columna_6: string;
  
  /**
   * Código postal del beneficio.
   * @property {string} TABLA_Columna_7
   */
  TABLA_Columna_7: string;
  
  /**
   * Tipo de propiedad (Propia o Alquilada).
   * @property {string} TABLA_Columna_8
   */
  TABLA_Columna_8: string;
  
  /**
   * Capacidad de procesamiento en kilogramos.
   * @property {string} TABLA_Columna_9
   */
  TABLA_Columna_9: string;
  
  /**
   * Volumen de procesamiento en kilogramos.
   * @property {string} TABLA_Columna_10
   */
  TABLA_Columna_10: string;
  
  /**
   * Estado operativo del beneficio.
   * @property {boolean} estatus
   */
  estatus: boolean;
}

/**
 * Configuración de las columnas de la tabla para el servicio BODEGAS.
 * 
 * Define la estructura y configuración de las columnas para la visualización
 * de información de bodegas de almacenamiento de café. Incluye datos de ubicación,
 * características de propiedad y capacidades de almacenamiento.
 * 
 * @constant {Array<Object>}
 */
export const BODEGAS_SERVICIO = [
  {
    /**
     * @property {string} encabezado
     * Título de la columna - Nombre de la bodega.
     */
    encabezado: 'Nombre',
    
    /**
     * @property {Function} clave
     * Función que extrae el nombre de la bodega.
     */
    clave: (ele: BodegasInfo): string => ele.TABLA_Columna_1,
    
    /**
     * @property {number} orden
     * Posición de la columna en la tabla.
     */
    orden: 1
  },
  {
    encabezado: 'Calle',
    clave: (ele: BodegasInfo): string => ele.TABLA_Columna_2,
    orden: 2
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: BodegasInfo): string => ele.TABLA_Columna_3,
    orden: 3
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: BodegasInfo): string => ele.TABLA_Columna_4,
    orden: 4
  },
  {
    encabezado: 'Colonia',
    clave: (ele: BodegasInfo): string => ele.TABLA_Columna_5,
    orden: 5
  },
  {
    encabezado: 'Estado',
    clave: (ele: BodegasInfo): string => ele.TABLA_Columna_6,
    orden: 6
  },
  {
    encabezado: 'Código Postal',
    clave: (ele: BodegasInfo): string => ele.TABLA_Columna_7,
    orden: 7
  },
  {
    encabezado: 'Propia o Aliquilada',
    clave: (ele: BodegasInfo): string => ele.TABLA_Columna_8,
    orden: 8
  },
  {
    encabezado: 'Capacidad (Kg)',
    clave: (ele: BodegasInfo): string => ele.TABLA_Columna_9,
    orden: 9
  }
]

/**
 * Interfaz para la información de BODEGAS.
 * 
 * Define la estructura de datos para representar información completa
 * de las bodegas de almacenamiento de café, incluyendo datos de ubicación,
 * tipo de propiedad, capacidades de almacenamiento y estado operativo.
 * 
 * @export
 * @interface BodegasInfo
 */
export interface BodegasInfo {
  /**
   * Nombre de la bodega.
   * @property {string} TABLA_Columna_1
   */
  TABLA_Columna_1: string;
  
  /**
   * Calle de la dirección de la bodega.
   * @property {string} TABLA_Columna_2
   */
  TABLA_Columna_2: string;
  
  /**
   * Número exterior de la bodega.
   * @property {string} TABLA_Columna_3
   */
  TABLA_Columna_3: string;
  
  /**
   * Número interior de la bodega.
   * @property {string} TABLA_Columna_4
   */
  TABLA_Columna_4: string;
  
  /**
   * Colonia donde se ubica la bodega.
   * @property {string} TABLA_Columna_5
   */
  TABLA_Columna_5: string;
  
  /**
   * Estado donde se encuentra la bodega.
   * @property {string} TABLA_Columna_6
   */
  TABLA_Columna_6: string;
  
  /**
   * Código postal de la bodega.
   * @property {string} TABLA_Columna_7
   */
  TABLA_Columna_7: string;
  
  /**
   * Tipo de propiedad (Propia o Alquilada).
   * @property {string} TABLA_Columna_8
   */
  TABLA_Columna_8: string;
  
  /**
   * Capacidad de almacenamiento en kilogramos.
   * @property {string} TABLA_Columna_9
   */
  TABLA_Columna_9: string;
  
  /**
   * Estado operativo de la bodega.
   * @property {boolean} estatus
   */
  estatus: boolean;
}

/**
 * Configuración de las columnas de la tabla para el servicio CAFÉ DE EXPORTACIÓN.
 * 
 * Define la estructura y configuración de las columnas para la visualización
 * de información del café destinado a exportación. Incluye datos de marca comercial,
 * clasificación del producto y volúmenes de exportación.
 * 
 * @constant {Array<Object>}
 */
export const CAFE_EXPORTADORES = [
  {
    /**
     * @property {string} encabezado
     * Título de la columna - Marca comercial del café.
     */
    encabezado: 'Marca Comercial',
    
    /**
     * @property {Function} clave
     * Función que extrae la marca comercial del café.
     */
    clave: (ele: CafeExporacionInfo): string => ele.TABLA_Columna_1,
    
    /**
     * @property {number} orden
     * Posición de la columna en la tabla.
     */
    orden: 1
  },
  {
    encabezado: 'Clasificación',
    clave: (ele: CafeExporacionInfo): string => ele.TABLA_Columna_2,
    orden: 2
  },
  {
    encabezado: 'Volúmen (Kg)',
    clave: (ele: CafeExporacionInfo): string => ele.TABLA_Columna_3,
    orden: 3
  },
]

/**
 * Interfaz para la información de CAFÉ DE EXPORTACIÓN.
 * 
 * Define la estructura de datos para representar información específica
 * del café destinado a exportación, incluyendo marca comercial, clasificación
 * del producto, volúmenes y estado de registro.
 * 
 * @export
 * @interface CafeExporacionInfo
 */
export interface CafeExporacionInfo {
  /**
   * Marca comercial del café de exportación.
   * @property {string} TABLA_Columna_1
   */
  TABLA_Columna_1: string;
  
  /**
   * Clasificación del tipo de café.
   * @property {string} TABLA_Columna_2
   */
  TABLA_Columna_2: string;
  
  /**
   * Volumen de exportación en kilogramos.
   * @property {string} TABLA_Columna_3
   */
  TABLA_Columna_3: string;
  
  /**
   * Estado del registro de café de exportación.
   * @property {boolean} estatus
   */
  estatus: boolean;
}