/**
 * Modelo de respuesta para la consulta de solicitud.
 * Contiene información detallada sobre la solicitud, incluyendo datos de la mercancía,
 */
export interface ConsultaSolicitudResponse {
    /**
     * Identificador único de la solicitud.
     * @property {number} id_solicitud - Identificador único de la solicitud.
     */
    id_solicitud: number;
    /**
     * Información detallada de la solicitud.
     * @property {Mercancia} mercancia - Detalles de la mercancía asociada a la solicitud.
     */
    mercancia: Mercancia;
    /**
     * Información del productor asociado a la solicitud.
     * @property {Productor} productor - Detalles del productor.
     */
    productor: Productor;
    /**
     * Información de la representación federal asociada a la solicitud.
     * @property {RepresentacionFederal} representacion_federal - Detalles de la representación federal.
     */
    representacion_federal: RepresentacionFederal;
    /**
     * Información del solicitante de la solicitud.
     * @property {Solicitante} solicitante - Detalles del solicitante.
     */
    solicitante: Solicitante;
    /**
     * Clave de clasificación del régimen.
     * @property {string} cve_clasificacion_regimen - Clave de clasificación del régimen.
     */
    cve_clasificacion_regimen: string;
    /**
     * Descripción de la clasificación del régimen.
     * @property {string} clasificacion_regimen - Descripción de la clasificación del régimen.
     */
    clasificacion_regimen: string;
    /**
     * Clave del régimen.
     * @property {string} cve_regimen - Clave del régimen.
     */
    cve_regimen: string;
    /**
     * Descripción del régimen.
     * @property {string} regimen - Descripción del régimen.
     */
    regimen: string;
}

/**
 * Modelo que representa la mercancía asociada a una solicitud.
 * Incluye detalles como cantidad, valor, fracción arancelaria, país de origen y
 * destino, entre otros.
 */
export interface Mercancia {
    /**
     * Cantidad tarifaria de la mercancía.
     * @property {number} cantidad_tarifaria - Cantidad tarifaria de la mercancía.
     */
    cantidad_tarifaria: number;
    /**
     * Valor de la factura en USD.
     * @property {number} valor_factura_usd - Valor de la factura en USD.
     */
    valor_factura_usd: number;
    /**
     * Precio unitario de la mercancía.
     * @property {number} precio_unitario - Precio unitario de la mercancía.
     */
    precio_unitario: number;

    /**
     * Observaciones sobre la mercancía.
     * @property {string} observaciones - Observaciones sobre la mercancía.
     */
    observaciones: string;
    /**
     * Fecha de salida de la mercancía.
     * @property {string} fecha_salida - Fecha de salida de la mercancía.
     */
    fecha_salida: string;
    /**
     * Número de lote de la mercancía.
     * @property {string} lote - Número de lote de la mercancía.
     */
    lote: string;
    /** Clave de la fracción arancelaria.
     * @property {string} cve_fraccion_arancelaria - Clave de la fracción arancelaria.
     */
    cve_fraccion_arancelaria: string;
    /** Descripción de la fracción arancelaria.
     * @property {string} fraccion_arancelaria - Descripción de la fracción arancelaria.
     */
    fraccion_arancelaria: string;
    /**
     * Clave de la subdivisión.
     * @property {string} cve_subdivision - Clave de la subdivisión.
     */
    cve_subdivision: string;
    /** Descripción de la subdivisión.
     * @property {string} subdivision - Descripción de la subdivisión.
     */
    subdivision: string;
    /**
     * Clave de la unidad de medida tarifaria.
     * @property {string} cve_unidad_medida_tarifaria - Clave de la unidad de medida tarifaria.
     */
    cve_unidad_medida_tarifaria: string;
    /** Descripción de la unidad de medida tarifaria.
     * @property {string} unidad_medida_tarifaria - Descripción de la unidad de medida tarifaria.
     */
    unidad_medida_tarifaria: string;
    /** Clave del país de origen.
     * @property {string} cve_pais_origen - Clave del país de origen.
     */
    cve_pais_origen: string;
    /** Nombre del país de origen.
     * @property {string} pais_origen - Nombre del país de origen.
     */
    pais_origen: string;
    /** Clave del país de destino.
     * @property {string} cve_pais_destino - Clave del país de destino.
     */
    cve_pais_destino: string;
    /** Nombre del país de destino.
     * @property {string} pais_destino - Nombre del país de destino.
     */
    pais_destino: string;
    /** Clave de la moneda.
     * @property {string} cve_moneda - Clave de la moneda.
     */
    cve_moneda: string;
    /** Descripción de la moneda.
     * @property {string} descripcion - Descripción de la moneda.
     */
    descripcion: string;
}

/**
 * Modelo que representa al productor asociado a una solicitud.
 * Incluye información como nombre, ubicación, razón social, tipo de persona,
 * apellidos y RFC.
 */
export interface Productor {
    /** Nombre del productor.
     * @property {string} nombre - Nombre del productor.
     */
    nombre: string;
    /** Descripción de la ubicación del productor.
     * @property {string} descripcion_ubicacion - Descripción de la ubicación del productor.
     */
    descripcion_ubicacion: string;
    /** Razón social del productor.
     * @property {string} razon_social - Razón social del productor.
     */
    razon_social: string;
    /** Indica si el productor es persona física o moral.
     * @property {boolean} tipo_persona - Indica si el productor es persona física o moral.
     */
    tipo_persona: boolean;
    /** Apellido paterno del productor.
     * @property {string} apellido_paterno - Apellido paterno del productor.
     */
    apellido_paterno: string;
    /** Apellido materno del productor.
     * @property {string} apellido_materno - Apellido materno del productor.
     */
    apellido_materno: string;
    /** RFC del productor.
     * @property {string} rfc - RFC del productor.
     */
    rfc: string;
    /** País del productor.
     * @property {string} pais - País del productor.
     */
    pais: string;
}

/**
 * Modelo que representa la representación federal asociada a una solicitud.
 * Incluye información sobre la entidad federativa y la unidad administrativa.
 */
export interface RepresentacionFederal {
    /** Clave de la entidad federativa.
     * @property {string} cve_entidad_federativa - Clave de la entidad federativa.
     */
    cve_entidad_federativa: string;
    /** Nombre de la entidad federativa.
     * @property {string} entidad_federativa - Nombre de la entidad federativa.
     */
    entidad_federativa: string;
    /** Clave de la unidad administrativa.
     * @property {string} cve_unidad_administrativa - Clave de la unidad administrativa.
     */
    cve_unidad_administrativa: string;
    
    /** Nombre de la unidad administrativa.
     * @property {string} unidad_administrativa - Nombre de la unidad administrativa.
     */
    unidad_administrativa: string;
}

/**
 * Modelo que representa al solicitante de una solicitud.
 * Incluye información como nombre, RFC y si es persona moral.
 */
export interface Solicitante {
    /** Nombre del solicitante.
     * @property {string | null} nombre - Nombre del solicitante.
     */
    nombre: null;
    /** RFC del solicitante.
     * @property {string} rfc - RFC del solicitante.
     */
    rfc: string;
    /** Indica si el solicitante es persona moral.
     * @property {boolean} es_persona_moral - Indica si el solicitante es persona moral.
     */
    es_persona_moral: boolean;
}
