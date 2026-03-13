/**
 * Modelo de request para solicitud completa de trámite
 */
export interface SolicitudCompletaRequest {
   /** ID de la solicitud */
    id_solicitud: number | null;
    
    /** ID del tipo de trámite */
    id_tipo_tramite: number | null;
    
    /** RFC del solicitante */
    rfc: string | null;

    /** Nombre del solicitante */
    rol_capturista: string;

    /** Clave de la unidad administrativa */
    cve_unidad_administrativa: string | null;
    
    /** Costo total del trámite */
    costo_total: number | null;
    
    /** Número de serie del certificado */
    certificado_serial_number: string | null;
    
    /** Número de folio del trámite original */
    numero_folio_tramite_original: string | null;
    
    /** Datos del representante legal */
    representante_legal: RepresentanteLegal;
    
    /** Registro del cuestionario de solicitud */
    registro_cuestionario_sol: RegistroCuestionarioMercancia;
    
    /** Criterios de tratados aplicados */
    criterios_tratados: CriterioTratado[];
    
    /** Entidad federativa */
    entidad_federativa: EntidadFederativa;
    
    /** Declaraciones de la solicitud */
    declaraciones_solicitud: DeclaracionSolicitud[];
    
    /** Procesos asociados */
    procesos: Proceso[] | null;

    /** ID de la solicitud del productor */
    id_solicitud_productor: number | null;
}

/**
 * Modelo para representante legal
 */
export interface RepresentanteLegal {
    /** Nombre del representante */
    nombre: string | null;
    
    /** Apellido paterno */
    ap_paterno: string | null;
    
    /** Apellido materno */
    ap_materno: string | null;
    
    /** Teléfono de contacto */
    telefono: string | null;
}

/**
 * Modelo para registro de cuestionario con mercancía
 */
export interface RegistroCuestionarioMercancia {
    /** ID de la solicitud */
    id_solicitud: number | null;
    
    
    /** ID tipo de exportador */
    ide_tipo_exportador: string | null;
    
    /** Solicita exportador autorizado */
    solicita_exportador_aut: boolean | null;
    
    /** Separación contable */
    separacion_contable: boolean | null;
    
    /** ID condición exportador autorizado */
    ide_condicion_exportador_aut: string | null;

    /** Solicita exportador autorizado Japón */
    solicita_exportador_aut_jpn: boolean | null;
    
    /** ID condición exportador autorizado Japón */
    ide_condicion_exportador_aut_jpn: string | null;
    
    /** Mercancía asociada a la solicitud */
    mercancia_asociada: MercanciaAsociadaSol;
}

/**
 * Modelo para mercancía asociada completa
 */
export interface MercanciaAsociadaSol {
    /** ID de la solicitud */
    id_solicitud: number | null;
    
    /** ID descripción alterna UE */
    id_descripcion_alterna_ue: number | null;
    
    /** ID descripción alterna AELC */
    id_descripcion_alterna_aelc: number | null;
    
    /** ID descripción alterna SGP */
    id_descripcion_alterna_sgp: number | null;
    
    /** ID descripción alterna ACE */
    id_descripcion_alterna_ace: number | null;
    
    /** Nombre comercial del producto */
    nombre_comercial: string | null;
    
    /** Nombre en inglés del producto */
    nombre_ingles: string | null;
    
    /** Fracción arancelaria */
    fraccion_arancelaria: string | null;
    
    /** Precio franco fábrica */
    precio_franco_fabrica: number | null;
    
    /** Valor transaccional */
    valor_transaccional: number | null;
    
    /** Costo neto */
    costo_neto: number | null;
    
    /** Valor transaccional FOB */
    valor_transaccional_fob: number | null;
    
    /** Costo neto AP */
    costo_neto_ap: number | null;
    
    /** Unidad de medida comercial */
    unidad_medida_comercial: string | null;
    
    /** Unidad de medida tarifaria */
    unidad_medida_tarifaria: string | null;
    
    /** Peso acumulado textil */
    peso_acumulado_textil: number | null;
    
    /** Peso insumos no originarios */
    peso_insumos_no_originarios: number | null;
    
    /** Peso es requerido */
    peso_es_requerido: boolean | null;
    
    /** Volumen es requerido */
    volumen_es_requerido: boolean | null;
    
    /** Acumulación Uruguay */
    acumulacion_uruguay: boolean | null;
    
    /** Materiales fungibles Uruguay */
    materiales_fungibles_uruguay: boolean | null;
    
    /** Materiales intermedios Uruguay */
    materiales_intermedios_uruguay: boolean | null;
    
    /** Criterio origen Uruguay */
    criterio_origen_uruguay: string | null;
    
    /** Acumulación Perú */
    acumulacion_peru: boolean | null;
    
    /** Materiales fungibles Perú */
    materiales_fungibles_peru: boolean | null;
    
    /** Materiales intermedios Perú */
    materiales_intermedios_peru: boolean | null;
    
    /** Criterio origen Perú */
    criterio_origen_peru: string | null;
    
    /** Acumulación general */
    acumulacion: boolean | null;
    
    /** Materiales fungibles general */
    materiales_fungibles: string | null;
    
    /** Materiales intermedios general */
    materiales_intermedios: string | null;
    
    /** Acumulación AP */
    acumulacion_ap: boolean | null;
    
    /** Requiere juegos o surtidos */
    requiere_juegos_o_surtidos: string | null;
    
    /** Insumos de la mercancía */
    insumos: InsumoMercancia[];
    
    /** Empaques de la mercancía */
    empaques: EmpaqueMercancia[];
    
    /** ID fracción NALADI */
    id_fraccion_naladi: number | null | undefined;
    
    /** Clave fracción NALADI */
    cve_fraccion_naladi: string | null | undefined;
    
    /** ID fracción NALADISA 93 */
    id_fraccion_naladisa93: number | null | undefined;
    
    /** Clave fracción NALADISA 93 */
    cve_fraccion_naladisa93: string | null | undefined;
    
    /** ID fracción NALADISA 96 */
    id_fraccion_naladisa96: number | null | undefined;
    
    /** Clave fracción NALADISA 96 */
    cve_fraccion_naladisa96: string | null | undefined;
    
    /** ID fracción NALADISA 02 */
    id_fraccion_naladisa02: number | null | undefined;
    
    /** Clave fracción NALADISA 02 */
    cve_fraccion_naladisa02: string | null | undefined;
}

/**
 * Modelo para insumo de mercancía
 */
export interface InsumoMercancia {
    /** ID de la solicitud */
    id_solicitud: number | null;
    
    /** Nombre del insumo */
    nombre: string | null;
    
    /** Descripción del fabricante/productor */
    desc_fabricante_productor: string | null;
    
    /** Descripción del proveedor */
    desc_proveedor: string | null;
    
    /** Clave de la fracción arancelaria */
    cve_fraccion: string | null;
    
    /** Importe del valor */
    importe_valor: number | null;
    
    /** ID tipo de insumo */
    ide_tipo_insumo: string | null;
    
    /** Peso del insumo */
    peso: number | null;
    
    /** Volumen del insumo */
    volumen: number | null;
    
    /** Clave del país */
    cve_pais: string | null;
    
    /** Clave de unidad de medida */
    cve_unidad_medida: string | null;
    
    /** RFC del fabricante/productor */
    rfc_fabricante_productor: string | null;
    
    /** Descripción del insumo */
    descripcion: string | null;
    
    /** Criterios de tratados del insumo */
    criterios_tratados: CriterioTratado[];
}

/**
 * Modelo para empaque de mercancía
 */
export interface EmpaqueMercancia {
    /** ID de la solicitud */
    id_solicitud: number | null;
    
    /** Nombre del empaque */
    nombre: string | null;
    
    /** Descripción del fabricante/productor */
    desc_fabricante_productor: string | null;
    
    /** Descripción del proveedor */
    desc_proveedor: string | null;
    
    /** Clave de la fracción arancelaria */
    cve_fraccion: string | null;
    
    /** Importe del valor */
    importe_valor: number | null;
    
    /** ID tipo de insumo */
    ide_tipo_insumo: string | null;
    
    /** Peso del empaque */
    peso: number | null;
    
    /** Volumen del empaque */
    volumen: number | null;
    
    /** Clave del país */
    cve_pais: string | null;
    
    /** Clave de unidad de medida */
    cve_unidad_medida: string | null;
    
    /** RFC del fabricante/productor */
    rfc_fabricante_productor: string | null;
    
    /** Descripción del empaque */
    descripcion: string | null;
    
    /** Criterios de tratados del empaque */
    criterios_tratados: CriterioTratado[];
}

/**
 * Modelo simplificado para criterio de tratado
 */
export interface CriterioTratado {
    /** ID del criterio de tratado */
    id_criterio_tratado: number | null;
    
    /** ID de la solicitud */
    id_solicitud: number | null;
    
    /** Clave grupo criterio */
    cve_grupo_criterio: string | null;
    
    /** ID del bloque */
    id_bloque: number | null;
    
    /** ID tratado acuerdo */
    id_tratado_acuerdo: number | null;
    
    /** Clave del país */
    cve_pais: string | null;
    
    /** Clave tratado acuerdo */
    cve_tratado_acuerdo: string | null;
    
    /** Clave tratado acuerdo bloque */
    cve_tratado_acuerdo_bloque: string | null;
    
}

/**
 * Modelo simplificado para entidad federativa
 */
export interface EntidadFederativa {
    /** ID de la solicitud */
    id_solicitud: number | null;
    
    /** Clave entidad */
    cve_entidad: string | null;
}

/**
 * Modelo para declaración de solicitud
 */
export interface DeclaracionSolicitud {
    /** ID solicitud */
    id_solicitud: number | null;
    
    /** Clave declaración */
    cve_declaracion: string | null;
    
    /** Aceptado */
    aceptado: number | null;
}

/**
 * Modelo simplificado para proceso
 */
export interface Proceso {
    /** Aprobado */
    aprobado: boolean | null;
    
    /** ID proceso CEROR */
    id_proceso_ceror: string | null;
}