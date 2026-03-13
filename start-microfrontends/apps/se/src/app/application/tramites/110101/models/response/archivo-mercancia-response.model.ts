/**
 * Modelo de respuesta para validación de archivos
 */
export interface ArchivoMercanciaResponse {
    /** Elementos válidos procesados */
    elementos_validos: ElementoValido[];
    
    /** Errores encontrados durante la validación */
    errores: ErrorValidacion[];
    
    /** Mensaje general del proceso */
    mensaje: string;
}

/**
 * Modelo para errores de validación
 */
export interface ErrorValidacion {
    /** Número de línea con error */
    numero_linea: number;
    
    /** Contenido de la línea con error */
    contenido_linea: string;
    
    /** Mensaje descriptivo del error */
    mensaje_error: string;
}

/**
 * Modelo para elemento válido
 */
export interface ElementoValido {
    /** Nombre técnico del elemento */
    nombre_tecnico: string;
    
    /** Valor del elemento */
    valor: number;
    
    /** Fabricante del elemento */
    fabricante: string;
    
    /** Fracción arancelaria */
    fraccion_arancelaria: string;
    
    /** Descripción de la fracción arancelaria */
    descripcion_fraccion_arancelaria: string;
    
    /** País de origen */
    pais_origen: string;
    
    /** Tipo de elemento */
    tipo_elemento: string;
    
    /** Número de línea en el archivo */
    numero_linea: number;
    
    /** Proveedor del elemento */
    proveedor: string;
    
    /** Peso del elemento (null si no aplica) */
    peso: number | null;
    
    /** Unidad de medida */
    unidad_medida: string;
    
    /** RFC del fabricante */
    rfc_fabricante: string;
    
    /** Indica si es originario */
    es_originario: string;
    
    /** Tratados originarios (null si no aplica) */
    tratados_originarios: TratadosOriginarios[];
}

/** Modelo que representa tratatados archivo */
export interface TratadosOriginarios {
  /** ID del tratado o acuerdo */
  id_tratado_acuerdo: number | null;

  /** Clave del grupo de criterio */
  cve_grupo_criterio: string | null;

  /** Clave del país */
  cve_pais: string | null;

  /** Clave del tratado o acuerdo */
  cve_tratado_acuerdo: string | null;
}