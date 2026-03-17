/**
 * Modelo de respuesta para la consulta de solicitud.
 * Contiene información detallada sobre la solicitud, incluyendo datos de la mercancía,
 */
export interface ConsultaSolicitudResponse {
    id_solicitud: number;
    mercancia: Mercancia;
    productor: Productor;
    representacion_federal: RepresentacionFederal;
    solicitante: Solicitante;
    cve_clasificacion_regimen: string;
    clasificacion_regimen: string;
    cve_regimen: string;
    regimen: string;
}

/**
 * Modelo que representa la mercancía asociada a una solicitud.
 * Incluye detalles como cantidad, valor, fracción arancelaria, país de origen y
 * destino, entre otros.
 */
export interface Mercancia {
    cantidad_tarifaria: number;
    valor_factura_usd: number;
    precio_unitario: number;
    observaciones: string;
    fecha_salida: string;
    lote: string;
    cve_fraccion_arancelaria: string;
    fraccion_arancelaria: string;
    cve_subdivision: string;
    subdivision: string;
    cve_unidad_medida_tarifaria: string;
    unidad_medida_tarifaria: string;
    cve_pais_origen: string;
    pais_origen: string;
    cve_pais_destino: string;
    pais_destino: string;
    descripcion: string;
}

/**
 * Modelo que representa al productor asociado a una solicitud.
 * Incluye información como nombre, ubicación, razón social, tipo de persona,
 * apellidos y RFC.
 */
export interface Productor {
    nombre: string;
    descripcion_ubicacion: string;
    razon_social: string;
    tipo_persona: boolean;
    apellido_paterno: string;
    apellido_materno: string;
    rfc: string;
    pais: string;
}

/**
 * Modelo que representa la representación federal asociada a una solicitud.
 * Incluye información sobre la entidad federativa y la unidad administrativa.
 */
export interface RepresentacionFederal {
    cve_entidad_federativa: string;
    entidad_federativa: string;
    cve_unidad_administrativa: string;
    unidad_administrativa: string;
}

/**
 * Modelo que representa al solicitante de una solicitud.
 * Incluye información como nombre, RFC y si es persona moral.
 */
export interface Solicitante {
    nombre: null;
    rfc: string;
    es_persona_moral: boolean;
}
