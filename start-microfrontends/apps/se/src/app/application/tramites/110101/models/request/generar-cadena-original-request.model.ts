/**
 * Modelo de request para generar la cadena original.
 */
export interface GenerarCadenaOrigRequest {
    /** Número de folio del trámite */
    num_folio_tramite: string | null;

    /** Indica si el solicitante es extranjero */
    boolean_extranjero: boolean;

    /** Datos del solicitante */
    solicitante: SolicitanteRequest;

    /** Clave del rol del capturista */
    cve_rol_capturista: string;

    /** Clave del usuario capturista */
    cve_usuario_capturista: string;

        /** Fecha de la firma del trámite */
    fecha_firma: string;

    /** Clave de la unidad administrativa */
    clave_unidad_admin: string | null;

    /** Clave de la entidad */
    clave_entidad: string | null;

    /** Lista de tratados agregados */
    tratados_agregados: TratadoAgregadoRequest[];

    /** Registro del cuestionario */
    registro_cuestionario: RegistroCuestionarioRequest;
}

/**
 * Información del solicitante de la solicitud.
 */
export interface SolicitanteRequest {
    /** Identificador del domicilio */
    id_domicilio: number;

    /** Nombre del solicitante */
    nombre: string;

    /** Apellido paterno del solicitante */
    apellido_paterno: string;

    /** Apellido materno del solicitante */
    apellido_materno: string;

    /** Razón social */
    razon_social: string;

    /** RFC del solicitante */
    rfc: string;

    /** CURP del solicitante */
    curp: string;

    /** Clave de usuario */
    cve_usuario: string;

    /** Descripción del giro del solicitante */
    descripcion_giro: string;

    /** Número de identificación fiscal */
    numero_identificacion_fiscal: string;

    /** Número de seguridad social */
    nss: string;

    /** Correo electrónico del solicitante */
    correo_electronico: string;
}

/**
 * Representa un tratado o acuerdo agregado.
 */
export interface TratadoAgregadoRequest {
    /** ID del tratado o acuerdo */
    id_tratado_acuerdo: number;

    /** Clave del país relacionado */
    clave_pais: string | null;

    /** Clave del bloque económico */
    id_bloque: string | null;

    /** Clave del grupo de criterio */
    clave_grupo_criterio: string | null;

    /** Indica si cumple con el juego */
    cumple_juego: boolean | null;

    /** Identificador del tipo de proceso de la mercancía */
    ide_tipo_proceso_mercancia: string | null;
}

/**
 * Datos del registro de cuestionario.
 */
export interface RegistroCuestionarioRequest {
    /** Indica si la descripción es similar a ALADI */
    cal_descripcion_similar_aladi: boolean | null;

    /** Indica si existe separación contable */
    separacion_contable: boolean;

    /** Indica si se solicita exportador autorizado */
    solicita_exportador_autorizado: boolean;

    /** Condición del exportador autorizado */
    ide_condicion_exportador_autorizado: string | null;

    /** Información de la mercancía */
    mercancia: MercanciaRequest;
}

/**
 * Información detallada de la mercancía.
 */
export interface MercanciaRequest {
    /** Nombre comercial de la mercancía */
    nombre_comercial: string | null;

    /** Nombre en inglés de la mercancía */
    nombre_ingles: string | null;

    /** Fracción arancelaria */
    fraccion_arancelaria: string | null;

    /** Precio franco fábrica */
    precio_franco_fabrica: number | null;

    /** Valor transaccional */
    valor_transaccional: number | null;

    /** Costo neto */
    costo_neto: number | null;

    /** Clave de fracción NALADI */
    cve_fraccion_naladi: string | null;

    /** Clave de fracción NALADISA 93 */
    cve_fraccion_naladisa93: string | null;

    /** Clave de fracción NALADISA 96 */
    cve_fraccion_naladisa96: string | null;

    /** Clave de fracción NALADISA 02 */
    cve_fraccion_naladisa02: string | null;

    /** Tipo de método aplicado */
    tipo_metodo: string | null;

    /** Procesos solicitados para la mercancía */
    procesos_solicitados: ProcesoSolicitadoRequest[];
}

/**
 * Información sobre los procesos solicitados.
 */
export interface ProcesoSolicitadoRequest {
    /** ID del proceso CEROR */
    id_proceso_ceror: number | null;

    /** Indica si cumple el proceso */
    cumple_proceso: boolean | null;
}