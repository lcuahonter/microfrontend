/**
 * Modelo de request para gestión de tratados y acuerdos
 */
export interface TratadoAcuerdoCriterioRequest {
    /** ID del tratado o acuerdo */
    id_tratado_acuerdo: number;
    
    /** Clave del país o bloque */
    clave_pais_bloque: string | undefined;
    
    /** Criterio del certificado */
    criterio_certificado: string | undefined;
    
    /** Indica si requiere juegos o surtidos */
    requiere_juegos_o_surtidos: boolean;
    
    /** Indica si es un bloque comercial */
    is_bloque: boolean;
    
    /** Lista de tratados agregados */
    tratados_agregados?: TratadoAgregado[];
}

/**
 * Modelo para tratados agregados
 */
export interface TratadoAgregado {
    /** ID del criterio del tratado */
    id_criterio_tratado?: number;

    /** ID del bloque comercial */
    id_bloque?: number | null;

    /** ID del tratado o acuerdo */
    id_tratado_acuerdo?: number;

    /** Clave del grupo de criterio */
    cve_grupo_criterio?: string;
    
    /** Nombre del país */
    nombre_pais_bloque?: string;

    /** Nombre del tratado */
    tratado_nombre?: string;
    
    /** Clave del país */
    cve_pais?: string | null;

    /** Clave tratado acuerdo*/
    cve_tratado_acuerdo?: string | null;
    
    /** Mensaje agregado */
    mensaje_agregado?: string | null;
}

/** Modelo que representa tratatados archivo */
export interface TratadoArchivo {
  /** ID del tratado o acuerdo */
  id_tratado_acuerdo: number | null;

  /** Clave del grupo de criterio */
  cve_grupo_criterio: string | null;

  /** Clave del país */
  cve_pais: string | null;

  /** Clave del tratado o acuerdo */
  cve_tratado_acuerdo: string | null;
}
