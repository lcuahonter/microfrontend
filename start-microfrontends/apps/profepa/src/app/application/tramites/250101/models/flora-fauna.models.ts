/**
 * Representa una fila de datos en una tabla, compuesta por múltiples celdas.
 */
export interface TablaDatos {
  /** Datos correspondientes a las celdas del cuerpo de la tabla. */
  tbodyData: string[];
}

/**
 * Información relacionada con el transporte involucrado en el trámite.
 */
export interface Transporte {
  /** Número de identificación del transporte. */
  numeroIdentificacion: string;
  /** Número económico del transporte. */
  numeroEconomico: string;
  /** Placa del vehículo de transporte. */
  placa: string;
}

/**
 * Representa un requisito del trámite, incluyendo su número, fecha y tipo.
 */
export interface Requisito {
  /** Número o identificador del requisito. */
  No: string;
  /** Fecha en la que se presentó o generó el requisito. */
  Fecha: string;
  /** Tipo de requisito (puede ser indefinido si no se ha seleccionado). */
  Tipo: string | undefined;
}

/**
 * Representa la información básica de un producto relacionado al trámite.
 */
export interface Producto {
  /** Descripción general del producto (puede ser indefinida). */
  descripcion: string | undefined;
}

/**
 * Representa el detalle de una mercancía o producto dentro del trámite,
 * incluyendo información arancelaria, cantidades y origen.
 */
export interface Detalle {
  /** Fracción arancelaria del producto (puede ser indefinida). */
  fraccionArancelaria: string | undefined;
  /** Cantidad del producto. */
  cantidad: string;
  /** Unidad de medida utilizada (puede ser indefinida). */
  unidadMedida: string | undefined;
  /** Nombre científico del producto o especie (puede ser indefinido). */
  nombreCientifico: string | undefined;
  /** Nombre común del producto o especie (puede ser indefinido). */
  nombreComun: string | undefined;
  /** País de origen del producto (puede ser indefinido). */
  paisOrigen: string | undefined;
  /** País de procedencia del producto (puede ser indefinido). */
  paisProcedencia: string | undefined;
}

/**
 * Configuración de columnas para una tabla que muestra productos.
 * Cada objeto define el encabezado, cómo obtener el valor de cada celda
 * y el orden de aparición de la columna.
 */
export const CONFIGURATION_TABLA = [
  {
    /** Texto del encabezado de la columna. */
    encabezado: 'Descripción de la mercancía',
    /**
     * Función que retorna el valor a mostrar en la celda.
     * En este caso, obtiene la descripción del producto.
     *
     * @param item Producto del cual se extrae la información.
     * @returns {string | undefined} Descripción del producto.
     */
    clave: (item: Producto): string | undefined => item.descripcion,
    
    /** Orden en el que aparece la columna dentro de la tabla. */
    orden: 1,
  },
];

/**
 * Configuración de columnas para una tabla que muestra detalles de mercancías.
 * Cada objeto define el encabezado de la columna, cómo obtener el valor de cada celda
 * y el orden de aparición de las columnas dentro de la tabla.
 */
export const CONFIGURATION_TABLA_MERCANCIAS = [
  {
    /** Texto del encabezado de la columna 'Fracción arancelaria'. */
    encabezado: 'Fracción arancelaria',
    /**
     * Función que retorna el valor a mostrar en la celda para la fracción arancelaria.
     * Extrae la fracción arancelaria del detalle de la mercancía.
     *
     * @param item Detalle de la mercancía.
     * @returns {string | undefined} Fracción arancelaria.
     */
    clave: (item: Detalle): string | undefined => item.fraccionArancelaria,
    
    /** Orden en el que aparece la columna dentro de la tabla. */
    orden: 1,
  },
  {
    /** Texto del encabezado de la columna 'Cantidad'. */
    encabezado: 'Cantidad',
    /**
     * Función que retorna el valor a mostrar en la celda para la cantidad.
     * Extrae la cantidad del detalle de la mercancía.
     *
     * @param item Detalle de la mercancía.
     * @returns {string} Cantidad de mercancía.
     */
    clave: (item: Detalle): string => item.cantidad,
    
    /** Orden en el que aparece la columna dentro de la tabla. */
    orden: 2,
  },
  {
    /** Texto del encabezado de la columna 'Unidad de medida'. */
    encabezado: 'Unidad de medida',
    /**
     * Función que retorna el valor a mostrar en la celda para la unidad de medida.
     * Extrae la unidad de medida del detalle de la mercancía.
     *
     * @param item Detalle de la mercancía.
     * @returns {string | undefined} Unidad de medida.
     */
    clave: (item: Detalle): string | undefined => item.unidadMedida,
    
    /** Orden en el que aparece la columna dentro de la tabla. */
    orden: 3,
  },
  {
    /** Texto del encabezado de la columna 'Nombre científico'. */
    encabezado: 'Nombre científico',
    /**
     * Función que retorna el valor a mostrar en la celda para el nombre científico.
     * Extrae el nombre científico del detalle de la mercancía.
     *
     * @param item Detalle de la mercancía.
     * @returns {string | undefined} Nombre científico.
     */
    clave: (item: Detalle): string | undefined => item.nombreCientifico,
    
    /** Orden en el que aparece la columna dentro de la tabla. */
    orden: 4,
  },
  {
    /** Texto del encabezado de la columna 'Nombre común'. */
    encabezado: 'Nombre común',
    /**
     * Función que retorna el valor a mostrar en la celda para el nombre común.
     * Extrae el nombre común del detalle de la mercancía.
     *
     * @param item Detalle de la mercancía.
     * @returns {string | undefined} Nombre común.
     */
    clave: (item: Detalle): string | undefined => item.nombreComun,
    
    /** Orden en el que aparece la columna dentro de la tabla. */
    orden: 5,
  },
  {
    /** Texto del encabezado de la columna 'País de origen'. */
    encabezado: 'País de origen',
    /**
     * Función que retorna el valor a mostrar en la celda para el país de origen.
     * Extrae el país de origen del detalle de la mercancía.
     *
     * @param item Detalle de la mercancía.
     * @returns {string | undefined} País de origen.
     */
    clave: (item: Detalle): string | undefined => item.paisOrigen,
    
    /** Orden en el que aparece la columna dentro de la tabla. */
    orden: 6,
  },
  {
    /** Texto del encabezado de la columna 'País de procedencia'. */
    encabezado: 'País de procedencia',
    /**
     * Función que retorna el valor a mostrar en la celda para el país de procedencia.
     * Extrae el país de procedencia del detalle de la mercancía.
     *
     * @param item Detalle de la mercancía.
     * @returns {string | undefined} País de procedencia.
     */
    clave: (item: Detalle): string | undefined => item.paisProcedencia,
    
    /** Orden en el que aparece la columna dentro de la tabla. */
    orden: 7,
  },
];

/**
 * Configuración de columnas para una tabla que muestra información del transporte.
 * Cada objeto define el encabezado de la columna, cómo obtener el valor de cada celda
 * y el orden de aparición de las columnas dentro de la tabla.
 */
export const CONFIGURATION_TABLA_TRANSPORTE = [
  {
    /** Texto del encabezado de la columna 'No. de Identificación'. */
    encabezado: 'No. de Identificación',
    /**
     * Función que retorna el valor a mostrar en la celda para el número de identificación del transporte.
     * Extrae el número de identificación del transporte.
     *
     * @param item Información del transporte.
     * @returns {string} Número de identificación del transporte.
     */
    clave: (item: Transporte): string => item.numeroIdentificacion,
    
    /** Orden en el que aparece la columna dentro de la tabla. */
    orden: 1,
  },
  {
    /** Texto del encabezado de la columna 'No. económico'. */
    encabezado: 'No. económico',
    /**
     * Función que retorna el valor a mostrar en la celda para el número económico del transporte.
     * Extrae el número económico del transporte.
     *
     * @param item Información del transporte.
     * @returns {string} Número económico del transporte.
     */
    clave: (item: Transporte): string => item.numeroEconomico,
    
    /** Orden en el que aparece la columna dentro de la tabla. */
    orden: 2,
  },
  {
    /** Texto del encabezado de la columna 'Placa'. */
    encabezado: 'Placa',
    /**
     * Función que retorna el valor a mostrar en la celda para la placa del transporte.
     * Extrae la placa del transporte.
     *
     * @param item Información del transporte.
     * @returns {string} Placa del transporte.
     */
    clave: (item: Transporte): string => item.placa,
    
    /** Orden en el que aparece la columna dentro de la tabla. */
    orden: 3,
  },
];

/**
 * Configuración de columnas para una tabla que muestra los requisitos del trámite.
 * Cada objeto define el encabezado de la columna, cómo obtener el valor de cada celda
 * y el orden de aparición de las columnas dentro de la tabla.
 */
export const CONFIGURATION_TABLA_REQUISITOS = [
  {
    /** Texto del encabezado de la columna 'No'. */
    encabezado: 'No',
    /**
     * Función que retorna el valor a mostrar en la celda para el número del requisito.
     * Extrae el número del requisito.
     *
     * @param item Requisito relacionado.
     * @returns {string} Número del requisito.
     */
    clave: (item: Requisito): string => item.No,
    
    /** Orden en el que aparece la columna dentro de la tabla. */
    orden: 1,
  },
  {
    /** Texto del encabezado de la columna 'Fecha'. */
    encabezado: 'Fecha',
    /**
     * Función que retorna el valor a mostrar en la celda para la fecha del requisito.
     * Extrae la fecha del requisito.
     *
     * @param item Requisito relacionado.
     * @returns {string} Fecha del requisito.
     */
    clave: (item: Requisito): string => item.Fecha,
    
    /** Orden en el que aparece la columna dentro de la tabla. */
    orden: 2,
  },
  {
    /** Texto del encabezado de la columna 'Tipo'. */
    encabezado: 'Tipo',
    /**
     * Función que retorna el valor a mostrar en la celda para el tipo del requisito.
     * Extrae el tipo del requisito.
     *
     * @param item Requisito relacionado.
     * @returns {string | undefined} Tipo del requisito (puede ser indefinido).
     */
    clave: (item: Requisito): string | undefined => item.Tipo,
    
    /** Orden en el que aparece la columna dentro de la tabla. */
    orden: 3,
  },
];

/**
 * Representa los datos de las columnas de una tabla de certificados.
 * Contiene un arreglo con los nombres de las columnas que se mostrarán en la tabla.
 */
export interface CertificadosTablaDatos {
  /** Lista de nombres de las columnas para la tabla de certificados. */
  columns: string[];
}

/**
 * Representa los datos de las columnas de una tabla de destinatarios.
 * Contiene un arreglo con los nombres de las columnas que se mostrarán en la tabla.
 */
export interface DestinatarioTablaDatos {
  /** Lista de nombres de las columnas para la tabla de destinatarios. */
  columns: string[];
}

/**
 * Representa la estructura de los datos de una fila de certificados.
 */
export interface CertificadosFilaTableDatos {
  /**
   * Datos de la tabla asociados al certificado.
   */
  data: TablaDatos;
}

/**
 * Representa la estructura de los datos de una fila de certificados fitosanitarios.
 */
export interface CertificadosFitoFilaTableDatos {
  /**
   * Datos de la tabla asociados al certificado fitosanitario.
   */
  data: TablaDatos;
}

/**
 * Representa la estructura de los datos de permisos relacionados con certificados fitosanitarios.
 */
export interface PermisosCertificadosFitoFilaTableDatos {
  /**
   * Datos de la tabla asociados a los permisos de certificados fitosanitarios.
   */
  data: TablaDatos;
}
