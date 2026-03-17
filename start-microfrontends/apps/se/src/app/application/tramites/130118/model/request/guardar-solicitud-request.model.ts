/**
 * Modelo de solicitud para guardar una solicitud de trámite.
 * Define la estructura de los datos necesarios para guardar una solicitud en el sistema.
 */
export interface GuadarSolicitudRequest {
    id_solcitud: number | null;
    cve_regimen: string;
    cve_clasificacion_regimen: string;
    mercancia: Mercancia;
    productor: Productor;
    solicitante: Solicitante;
    representacion_federal: RepresentacionFederal;
}

/**
 * Modelo que representa una mercancía en el trámite.
 * Contiene información detallada sobre la mercancía involucrada en el trámite.
 */
export interface Mercancia {
    cve_fraccion_arancelaria: string;
    cve_subdivision: string;
    descripcion: string;
    cve_unidad_medida_tarifaria: string;
    cve_pais_origen: string;
    cve_pais_destino: string;
    cantidad_tarifaria: number;
    valor_factura_usd: string;
    precio_unitario: number;
    lote: string;
    fecha_salida: string;
    observaciones: string;
}

/**
 * Modelo que representa un productor en el trámite.
 * Contiene información sobre el tipo de persona, nombre, RFC y ubicación del productor.
 */
export interface Productor {
    tipo_persona: boolean;
    nombre: string;
    apellido_materno: string;
    apellido_paterno: string;
    razon_social: string;
    descripcion_ubicacion: string;
    rfc: string;
    pais: string;
}

export interface RepresentacionFederal {
    cve_entidad_federativa: string;
    cve_unidad_administrativa: string;
}

export interface Solicitante {
    /**
     * Indica si el solicitante es una persona moral.
     */
    rfc: string;

    /**
     * Nombre del solicitante, puede ser razón social o nombre completo.
     */
    nombre: string | null;

    /**
     * Indica si el solicitante es una persona moral.
     */
    es_persona_moral: boolean;

    /**
     * Número de serie del certificado del solicitante.
     */
    certificado_serial_number: string;

    /**
     * Rol del capturista que realiza la solicitud.
     */
    rol_capturista: string,
}
