/**
 * Modelo de respuesta para la validación de la solicitud completa.
 */
export interface ValidarSolicitudResponse {
  /** Datos de la mercancía */
  mercancia: Mercancia;

  /** Lista de tratados agregados a la mercancía */
  tratados_agregados: TratadoAgregado[];

   /** 
   * Lista de errores de validación devueltos por el servicio.  
   * Si contiene elementos, indica que la validación no fue completamente exitosa,
   * incluso si el código de respuesta fue EXITO.
   */
  errores?: string[];
}

/**
 * Modelo que representa los datos de la mercancía.
 */
export interface Mercancia {
  /** Peso de la mercancía */
  peso: number | null;

  /** Volumen de la mercancía */
  volumen: number | null;

  /** Identificador del tipo de método aplicado */
  ide_tipo_metodo: string | null;

  /** Fracción NALADI principal */
  fraccion_naladi: FraccionNaladi;

  /** Fracción NALADI versión 1993 */
  fraccion_naladi_93: FraccionNaladi;

  /** Fracción NALADI versión 1996 */
  fraccion_naladi_96: FraccionNaladi;

  /** Fracción NALADI versión 2002 */
  fraccion_naladi_02: FraccionNaladi;

  /** Descripciones alternas para la Unión Europea */
  descripciones_alternas_ue: DescripcionAlternaResponse[] | null;

  /** Descripciones alternas para la Asociación Europea de Libre Comercio (AELC) */
  descripciones_alternas_aelc: DescripcionAlternaResponse[] | null;

  /** Descripciones alternas para el Sistema Generalizado de Preferencias (SGP) */
  descripciones_alternas_sgp: DescripcionAlternaResponse[] | null;

  /** Descripciones alternas para Acuerdos de Complementación Económica (ACE) */
  descripciones_alternas_ace: DescripcionAlternaResponse[] | null;

  /** Procesos solicitados */
  procesos_solicitados: ProcesoSolicitado[] | null;

  /** Indica si el proceso es requerido */
  proceso_es_requerido: boolean;
    
  /** Descripción alterna modificada (null si no aplica) */
  descripcion_alterna_modificada: boolean | null;
}

/**
 * Modelo para la fracción NALADI en sus distintas versiones.
 */
export interface FraccionNaladi {
  /** Identificador de la fracción NALADI */
  id_fraccion: number | null;

  /** Clave de la fracción NALADI */
  clave_fraccion: string | null;

  /** Descripción de la fracción NALADI */
  descripcion_fraccion: string | null;
}

/**
 * Modelo que representa los tratados agregados a la mercancía.
 */
export interface TratadoAgregado {
  /** Identificador del tratado o acuerdo */
  id_tratado_acuerdo: number;

  /** Clave del grupo de criterio del tratado */
  cve_grupo_criterio: string | null;

  /** Clave del país asociado al tratado */
  cve_pais: string | null;

  /** Identificador del bloque comercial (si aplica) */
  id_bloque: number | null;

  /** Clave del bloque comercial (si aplica) */
  cve_bloque: string | null;

  /** Identificador del tipo de proceso de mercancía */
  ide_tipo_proceso_mercancia: string | null;

  /** Indica si cumple con el juego de reglas del tratado */
  cumple_juego: boolean | null;

  /** Indica si cumple con la acumulación del tratado */
  cumple_acumulacion: boolean | null;
  
  /** Clave tratado acuerdo */
    cve_tratado_acuerdo: string | null;
}

/**
 * Modelo para descripción alterna de fracción
 */
export interface DescripcionAlternaResponse {
    /** ID de la descripción alterna de fracción */
    id_descripcion_alterna_fraccion: number;
    
    /** Descripción detallada de la fracción */
    descripcion: string;
}


/**
 * Modelo para proceso solicitado
 */
export interface ProcesoSolicitado {
    /** ID del proceso CEROR */
    id_proceso_ceror: number;
    
    /** Nombre del proceso */
    nombre: string;
    
    /** Fecha de inicio de vigencia */
    fec_ini_vigencia: string;
    
    /** Fecha de fin de vigencia (null si no aplica) */
    fec_fin_vigencia: string | null;
    
    /** Indica si el proceso está activo */
    activo: boolean;
    
    /** Indica si cumple con el proceso */
    cumple_proceso: boolean;
}