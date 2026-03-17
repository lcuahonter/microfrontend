
/**
 * Representa una fila de la tabla de registro de solicitudes.
 *
 * @property pais - El país relacionado con la solicitud.
 * @property tratado - El tratado asociado a la solicitud.
 * @property origen - El origen de la solicitud.
 */
export interface RegistroDeSolicitudesTabla {
    pais?: string;
    tratado?: string;
    origen?: string;
}

/**
 * Representa una fila de la tabla de tratados.
 */
export interface TratadosTabla {
    pais: string;
    tratado: string;
    origen: string;
    normaOrigen: string;
    requisitoEspecifico: string;
    calificacionSistema: string;
    calificacionDictaminad: string;
    otrasInstancias: string;
    procesoTransformacion: string;
}
/**
 * Representa una fila de la tabla de insumos.
 *
 * @property nombreTecnico - Nombre técnico del insumo.
 * @property proveedor - Proveedor del insumo.
 * @property fabricanteOProductor - Fabricante o productor del insumo.
 * @property rfc - RFC del proveedor o fabricante.
 * @property fraccionArancelaria - Fracción arancelaria correspondiente.
 * @property valorDeTransaccion - Valor de transacción del insumo.
 */
export interface InsumosTabla {
    nombreTecnico: string | null;
    proveedor: string | null;
    fabricanteOProductor: string | null;
    rfc: string | null;
    fraccionArancelaria: string | null;
    valorEnDolares: number | null;
    paisDeOrigen: string | null;
    peso: number | null;
    volumen: boolean | null;
    cvePais: string | null | undefined;
}

/**
 * Representa una fila de la tabla de envases.
 *
 * @property nombreTecnico - Nombre técnico del envase.
 * @property proveedor - Proveedor del envase.
 * @property fabricanteOProductor - Fabricante o productor del envase.
 * @property fraccionArancelaria - Fracción arancelaria correspondiente.
 * @property valorEnDolares - Valor en dólares del envase.
 * @property paisDeOrigen - País de origen del envase.
 */
export interface EnvasesTabla {
    nombreTecnico: string | null;
    proveedor: string | null;
    fabricanteOProductor: string | null;
    rfc: string | null;
    fraccionArancelaria: string | null;
    valorEnDolares: number | null;
    paisDeOrigen: string | null;
    peso: number | null;
    volumen: boolean | null;
    cvePais: string | null | undefined;
}

/**
 * Representa una fila de la tabla modal de mercancías.
 *
 * @property tratado - Nombre del tratado o acuerdo comercial.
 * @property pais - País o bloque relacionado.
 */
export interface DatosMercanciaModalTabla {
   /** ID único del criterio de tratado */
    id_criterio_tratado?: number;
    
    /** ID del bloque comercial (null si no aplica) */
    id_bloque?: number | null;
    
    /** ID del tratado o acuerdo */
    id_tratado_acuerdo?: number;
    
    /** Clave del grupo de criterio */
    cve_grupo_criterio?: string;
    
    /** Nombre del país o bloque comercial */
    nombre_pais_bloque: string;
    
    /** Nombre del tratado o acuerdo */
    tratado_nombre: string;
    
    /** Clave del país (null si es bloque) */
    cve_pais?: string | null;
    
    /** Mensaje de agregado (null si no aplica) */
    mensaje_agregado?: string | null;

    /** Cve tratado acuerdo (null si no aplica)*/
    cve_tratado_acuerdo?: string | null;

    /** Cve tratado acuerdo bloque (null si no aplica)*/
    cve_tratado_acuerdo_bloque: string | null;

    /**Uso exclusivo UI */
    selected?: boolean;
}
/**
 * Representa una fila de la tabla de procesos.
 *
 * @property proceso - Nombre del proceso.
 */
export interface ProcesosTabla {
    proceso: string;
}