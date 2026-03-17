/**
 * Modelo de respuesta para detalle completo de solicitud
 */
export interface ComercializadoresProductosResponse {
    /** Criterios de tratado aplicados */
    criterios_tratado: CriterioTratadoDetalle[];
    
    /** Registro del cuestionario */
    registro_cuestionario: RegistroCuestionarioDetalle;
    
    /** Nombre de la unidad administrativa */
    nombre_unidad_a: string;
    
    /** Clave de la unidad administrativa */
    cve_unidad_administrativa: string;
    
    /** Entidad de la solicitud */
    entidad_solicitud: EntidadSolicitud;
    
    /** Solicitud productor */
    id_solicitud_productor:number | null;
}

/**
 * Modelo para criterio de tratado detallado
 */
export interface CriterioTratadoDetalle {
    /** ID del criterio de tratado */
    id_criterio_tratado: number;
    
    /** Descripción del requisito */
    descripcion_requisito: string;
    
    /** Calificación aprobada por sistema */
    cal_aprobada_sistema: boolean;
    
    /** Calificación aprobada por dictaminador */
    cal_aprobada_dictaminador: boolean;
    
    /** Importe insumos originarios */
    imp_insumos_originarios: number;
    
    /** Importe insumos no originarios */
    imp_insumos_no_originarios: number;
    
    /** Importe envases originarios */
    imp_envases_originarios: number;
    
    /** Importe envases no originarios */
    imp_envases_no_originarios: number;
    
    /** Porcentaje valor no originarios */
    pct_valor_no_originarios: number | null;
    
    /** Porcentaje valor contenido regional */
    pct_valor_contenido_regional: number | null;
    
    /** Proceso CEROR asociado */
    proceso_ceror: ProcesoCerorDetalle | null;
    
    /** Grupo de criterio */
    grupo_criterio: GrupoCriterio;
    
    /** Bloque comercial */
    id_bloque: number | null;
    
    /** Tratado o acuerdo */
    tratado_acuerdo: TratadoAcuerdoDetalle;
    
    /** País asociado */
    pais: PaisDetalle;
    
    /** Criterio de origen */
    criterio_origen: CriterioOrigen;
    
    /** Norma de país criterio */
    norma_pais_criterio: NormaPaisCriterio;
    
    /** Clave norma SGP */
    cve_norma_sgp: string | null;
    
    /** Porcentaje peso total fibras */
    pct_peso_total_fibras: number | null;
    
    /** Porcentaje peso total mercancía */
    pct_peso_total_mercancia: number | null;
    
    /** Nombre del país o bloque */
    pais_bloque_nombre: string;
    
    /** Otras instancias asociadas */
    otras_instancias_asociadas: string | null;
    
    /** Descripción juego surtido */
    descripcion_juego_surtido: string | null;
    
    /** ID del tratado o acuerdo */
    id_tratado_acuerdo: number;
    
    /** Clave del grupo de criterio */
    cve_grupo_criterio: string;
    
    /** Clave del país */
    cve_pais: string | null;
    
    /** Clave tratado acuerdo bloque */
    cve_tratado_acuerdo_bloque: string | null;

    /** Tipo proceso mercancia */
    ide_tipo_proceso_mercancia:string | null;

    /** Cumple juego*/
    cumple_juego: boolean;
}

/**
 * Modelo para proceso CEROR detallado
 */
export interface ProcesoCerorDetalle {
    /** ID del proceso CEROR */
    id_proceso_ceror: number;
    
    /** Nombre del proceso */
    nombre: string;
    
    /** Fecha inicio vigencia */
    fec_inicio_vigencia: string;
    
    /** Fecha fin vigencia */
    fec_fin_vigencia: string | null;
    
    /** Activo */
    activo: boolean;
    
    /** Cumple proceso */
    cumple_proceso: boolean;
}

/**
 * Modelo para grupo de criterio
 */
export interface GrupoCriterio {
    /** Clave del grupo */
    clave: string;
    
    /** Nombre del grupo */
    nombre: string;
}

/**
 * Modelo para tratado acuerdo detallado
 */
export interface TratadoAcuerdoDetalle {
    /** ID del tratado acuerdo */
    id_tratado_acuerdo: number;
    
    /** Clave del tratado acuerdo */
    cve_tratado_acuerdo: string | null;
    
    /** Fecha de captura */
    fecha_captura: string;
    
    /** Fecha fin vigencia */
    fecha_fin_vigencia: string | null;
    
    /** Nombre del tratado */
    nombre: string;
}

/**
 * Modelo para país detallado
 */
export interface PaisDetalle {
    /** Clave del país */
    cve_pais: string;
    
    /** Nombre del país */
    nombre: string;
}

/**
 * Modelo para criterio de origen
 */
export interface CriterioOrigen {
    /** Clave del criterio */
    clave: string;
    
    /** Nombre del criterio */
    nombre: string;
}

/**
 * Modelo para norma de país criterio
 */
export interface NormaPaisCriterio {
    /** ID de la norma país criterio */
    id_norma_pais_criterio: number;
    
    /** Descripción de la norma de origen */
    descripcion_norma_origen: string;
}

/**
 * Modelo para registro de cuestionario detallado
 */
export interface RegistroCuestionarioDetalle {
    /** ID de la solicitud */
    id_solicitud: number;
    
    /** Clave número de registro */
    cve_numero_registro: string;
    
    /** Fecha de expedición */
    fec_expedicion: string;
    
    /** Fecha de vencimiento */
    fec_vencimiento: string;
    
    /** ID tipo de exportador */
    ide_tipo_exportador: string;
    
    /** Solicita exportador autorizado */
    solicita_exportador_aut: boolean;
    
    /** Separación contable */
    separacion_contable: boolean;
    
    /** ID condición exportador autorizado */
    ide_condicion_exportador_aut: string | null;
    
    /** Calificación exportador autorizado por dictamen */
    cal_exp_aut_dictam: boolean | null;
    
    /** Calificación exportador autorizado por sistema */
    cal_exp_aut_sistema: boolean | null;
    
    /** Clave número registro productor */
    cve_numero_registro_productor: string | null;
    
    /** Calificación descripción similar ALADI */
    cal_desc_similar_aladi: boolean | null;
    
    /** Solicita exportador autorizado Japón */
    solicita_exp_aut_jpn: boolean;
    
    /** Calificación exportador autorizado sistema Japón */
    cal_exp_aut_sistema_jpn: boolean;
    
    /** ID condición exportador autorizado Japón */
    ide_condicion_exp_aut_jpn: string | null;
    
    /** Calificación exportador autorizado dictamen Japón */
    cal_exp_aut_dictam_jpn: boolean;
    
    /** Mercancía asociada */
    mercancia_asociada: MercanciaAsociadaDetalle;
}

/**
 * Modelo para mercancía asociada detallada
 */
export interface MercanciaAsociadaDetalle {
    /** ID de la solicitud */
    id_solicitud: number;
    
    /** Cantidad unidad medida comercial */
    cantidad_umc: number | null;
    
    /** Unidad de medida comercial */
    unidad_medida_comercial: string | null;
    
    /** Cantidad unidad medida tarifaria */
    cantidad_umt: number | null;
    
    /** Unidad de medida tarifaria */
    unidad_medida_tarifaria: string | null;
    
    /** Unidades autorizadas */
    unidades_autorizadas: number | null;
    
    /** Importador exportador previo */
    importador_exportador_previo: string | null;
    
    /** Capacidad */
    capacidad: number | null;
    
    /** Año */
    anio: number | null;
    
    /** Modelo */
    modelo: string | null;
    
    /** Marca */
    marca: string | null;
    
    /** Serie */
    serie: string | null;
    
    /** Lote */
    lote: string | null;
    
    /** Descripción */
    descripcion: string | null;
    
    /** Uso específico */
    uso_especifico: string | null;
    
    /** Estado físico */
    estado_fisico: string | null;
    
    /** Condición mercancía */
    condicion_mercancia: string | null;
    
    /** Volumen */
    volumen: number | null;
    
    /** Peso */
    peso: number | null;
    
    /** Nombre científico */
    nombre_cientifico: string | null;
    
    /** Nombre comercial */
    nombre_comercial: string;
    
    /** Nombre común */
    nombre_comun: string | null;
    
    /** Nombre en inglés */
    nombre_ingles: string;
    
    /** Nombre químico */
    nombre_quimico: string | null;
    
    /** Nombre técnico */
    nombre_tecnico: string | null;
    
    /** Costo unitario */
    costo_unitario: number | null;
    
    /** Costo neto */
    costo_neto: number | null;
    
    /** Número de unidades */
    numero_unidades: number | null;
    
    /** Precio unitario */
    precio_unitario: number | null;
    
    /** Valor agregado México */
    valor_agregado_mex: number | null;
    
    /** Valor factura USD */
    valor_factura_usd: number | null;
    
    /** Número de factura */
    numero_factura: string | null;
    
    /** Fecha de factura */
    fecha_factura: string | null;
    
    /** Observaciones */
    observaciones: string | null;
    
    /** Justificación importación exportación */
    justificacion_importacion_exportacion: string | null;
    
    /** Descripción CLOB genérica 1 */
    desc_clob_generica1: string | null;
    
    /** Descripción CLOB genérica 2 */
    desc_clob_generica2: string | null;
    
    /** Fecha pedimento */
    fec_pedimento: string | null;
    
    /** ID genérica 1 */
    ide_generica1: string | null;
    
    /** ID genérica 2 */
    ide_generica2: string | null;
    
    /** ID genérica 3 */
    ide_generica3: string | null;
    
    /** ID tipo método */
    ide_tipo_metodo: string | null;
    
    /** Número CAS */
    numero_cas: string | null;
    
    /** Número folio pedimento */
    numero_folio_pedimento: string | null;
    
    /** Uso */
    uso: string | null;
    
    /** Daño muestra */
    danio_muestra: string | null;
    
    /** Clave fracción */
    cve_fraccion: string;

    /** Descripción fracción */
    descripcion_fraccion: string | null;
    
    /** Precio franco fábrica */
    precio_franco_fabrica: number | null;
    
    /** Peso acumulado mercancía */
    peso_acumulado_mercancia: number | null;
    
    /** Peso acumulado */
    peso_acumulado: number | null;
    
    /** Volumen acumulado */
    volumen_acumulado: number | null;
    
    /** Valor transacción */
    valor_transaccion: number;
    
    /** Valor transacción FOB */
    valor_transaccion_fob: number | null;
    
    /** Costo neto AP */
    costo_neto_ap: number | null;
    
    /** Descripción juego */
    descripcion_juego: string | null;
    
    /** Insumos */
    insumos: InsumoDetalle[];
    
    /** Empaques */
    empaques: InsumoDetalle[];
    
    /** Descripciones alternas UE */
    id_descripcion_alterna_ue: number | null;
    
    /** Descripciones alternas AULC */
    id_descripcion_alterna_aelc: number | null;
    
    /** Descripciones alternas SGP */
    id_descripcion_alterna_sgp: number | null;
    
    /** Descripciones alternas ACE */
    id_descripcion_alterna_ace: number | null;
    
    /** Acumulación Uruguay */
    acumulacion_uruguay: boolean;
    
    /** Materiales fungibles Uruguay */
    materiales_fungibles_uruguay: boolean;
    
    /** Materiales intermedios Uruguay */
    materiales_intermedios_uruguay: boolean;
    
    /** Clave criterio origen Uruguay */
    clave_criterio_origen_uruguay: string | null;
    
    /** Acumulación Perú */
    acumulacion_peru: boolean;
    
    /** Materiales fungibles Perú */
    materiales_fungibles_peru: boolean;
    
    /** Materiales intermedios Perú */
    materiales_intermedios_peru: boolean;
    
    /** Clave criterio origen Perú */
    clave_criterio_origen_peru: string | null;
    
    /** Acumulación general */
    acumulacion: boolean;
    
    /** Materiales fungibles general */
    materiales_fungibles: boolean;
    
    /** Materiales intermedios general */
    materiales_intermedios: boolean;
    
    /** Acumulación AP */
    acumulacion_ap: boolean;
    
    /** Requiere juegos o surtidos */
    requiere_juegos_o_surtidos: boolean;
    
    /** Cumple juegos surtidos AP */
    cumple_juegos_surtidos_AP: boolean;
    
    /** Cumple acumulación AP */
    cumple_acumulacion_AP: boolean;
    
    /** Cumple juegos surtidos */
    cumple_juegos_surtidos: boolean;
    
    /** Cumple juegos surtidos Perú */
    cumple_juegos_surtidos_Per: boolean;
    
    /** Fracción NALADI */
    fraccion_naladi: FraccionAladi | null;
    
    /** Fracción NALADISA 93 */
    fraccion_naladisa93: FraccionAladi | null;
    
    /** Fracción NALADISA 96 */
    fraccion_naladisa96: FraccionAladi | null;
    
    /** Fracción NALADISA 02 */
    fraccion_naladisa02: FraccionAladi | null;
    
    /** Proceso requerido */
    proceso_requerido: boolean;
    
    /** Procesos solicitados */
    procesos_solicitados: ProcesoSolicitadoDetalle[];
}

/**
 * Modelo para insumo detallado
 */
export interface InsumoDetalle {
    /** ID de la solicitud */
    id_solicitud: number;
    
    /** ID del insumo */
    id_insumo: number;

    ide_tipo_insumo: string;
    
    /** Nombre del insumo */
    nombre: string;
    
    /** Descripción fabricante productor */
    desc_fabricante_productor: string;
    
    /** Descripción proveedor */
    desc_proveedor: string;
    
    /** Clave fracción */
    cve_fraccion: string;
    
    /** Importe valor */
    imp_valor: number;
    
    /** Peso */
    peso: number | null;

    /** Volumen */
    volumen: number | null;
    
    /** Clave país */
    cve_pais: string;
    
    /** Nombre país */
    nombre_pais: string;
    
    /** RFC fabricante productor */
    rfc_fabricante_productor: string;
    
    /** Originario */
    originario: boolean;
    
    /** Tratados originarios */
    tratados_originarios: TratadoOriginarioInsumo[];
}

/**
 * Modelo para tratado originario de insumo
 */
export interface TratadoOriginarioInsumo {
    /** ID del criterio de tratado */
    id_criterio_tratado: number;
    
    /** Descripción requisito */
    descripcion_requisito: string | null;
    
    /** Calificación aprobada por sistema */
    cal_aprobada_sistema: boolean;
    
    /** Calificación aprobada por dictaminador */
    cal_aprobada_dictaminador: boolean;
    
    /** Importe insumos originarios */
    imp_insumos_originarios: number;
    
    /** Importe insumos no originarios */
    imp_insumos_no_originarios: number;
    
    /** Importe envases originarios */
    imp_envases_originarios: number;
    
    /** Importe envases no originarios */
    imp_envases_no_originarios: number;
    
    /** Porcentaje valor no originarios */
    pct_valor_no_originarios: number | null;
    
    /** Porcentaje valor contenido regional */
    pct_valor_contenido_regional: number | null;
    
    /** Bloque */
    id_bloque: number | null;
    
    /** Tratado acuerdo */
    tratado_acuerdo: number | null;
    
    /** Clave norma SGP */
    cve_norma_sgp: string | null;
    
    /** Porcentaje peso total fibras */
    pct_peso_total_fibras: number | null;
    
    /** Porcentaje peso total mercancía */
    pct_peso_total_mercancia: number | null;
    
    /** País bloque nombre */
    pais_bloque_nombre: string | null;
    
    /** Otras instancias asociadas */
    otras_instancias_asociadas: string | null;
    
    /** Descripción juego surtido */
    descripcion_juego_surtido: string | null;
    
    /** ID tratado acuerdo */
    id_tratado_acuerdo: number;
    
    /** Clave grupo criterio */
    cve_grupo_criterio: string;
    
    /** Clave país */
    cve_pais: string;
    
    /** Clave tratado acuerdo bloque */
    cve_tratado_acuerdo_bloque: string | null;

    /** Clave tratado acuerdo*/
    cve_tratado_acuerdo: string | null
}

/**
 * Modelo para fracción ALADI
 */
export interface FraccionAladi {
    /** ID fracción ALADI */
    id_fraccion_aladi: number | null;
    
    /** ID tipo fracción ALADI */
    ide_tipo_fraccion_aladi: string | null
    
    /** Clave fracción */
    cve_fraccion: string | null;
    
    /** Descripción */
    descripcion: string | null;
    
    /** Fecha captura */
    fecha_captura: string | null;
    
    /** Fecha inicio vigencia */
    fecha_inicio_vigencia: string | null;
    
    /** Fecha fin vigencia */
    fecha_fin_vigencia: string | null;
    
    /** Activo */
    activo: boolean | null;
}

/**
 * Modelo para proceso solicitado detallado
 */
export interface ProcesoSolicitadoDetalle {
    /** ID proceso CEROR */
    id_proceso_ceror: number;
    
    /** Nombre del proceso */
    nombre: string;
    
    /** Fecha inicio vigencia */
    fec_inicio_vigencia: string | null;
    
    /** Fecha fin vigencia */
    fec_fin_vigencia: string | null;
    
    /** Activo */
    activo: boolean | null;
    
    /** Cumple proceso */
    cumple_proceso: boolean;
}

/**
 * Modelo para entidad de solicitud
 */
export interface EntidadSolicitud {
    /** ID entidad solicitud */
    id_entidad_solicitud: number;
    
    /** ID solicitud */
    id_solicitud: number;
    
    /** Clave entidad */
    cve_entidad: string;
    
    /** ID tipo entidad solicitud */
    ide_tipo_entidad_sol: string | null;
    
    /** Clave delegación municipio */
    cve_delegacion_municipio: string | null;
}
