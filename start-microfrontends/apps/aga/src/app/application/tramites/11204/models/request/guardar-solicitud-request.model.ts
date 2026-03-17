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

/**
 * Represents a federal representation using codes for the federative entity and the administrative unit.
 *
 * This interface encapsulates the identifiers required to reference a federative entity (state)
 * and a specific administrative unit within that entity.
 *
 * @property cve_entidad_federativa - The code identifying the federative entity (state). Represented as a string.
 * @property cve_unidad_administrativa - The code identifying the administrative unit within the federative entity. Represented as a string.
 */
export interface RepresentacionFederal {
    cve_entidad_federativa: string;
    cve_unidad_administrativa: string;
}

/**
 * Describes a "solicitante" (requester) included in a trámite request.
 *
 * @remarks
 * - `rfc` is the RFC (Registro Federal de Contribuyentes) identifier for the requester.
 * - `nombre` is the full name (for a person) or business name (for a legal entity).
 * - `es_persona_moral` indicates whether the requester is a legal entity (true) or an individual (false).
 * - `certificado_serial_number` is the serial number of the digital certificate associated with the requester.
 *
 * @example
 * // Example usage
 * // const solicitante: Solicitante = {
 * //   rfc: "ABC123456T78",
 * //   nombre: "Empresa Ejemplo S.A. de C.V.",
 * //   es_persona_moral: true,
 * //   certificado_serial_number: "01AB23CD45EF6789"
 * // };
 *
 * @public
 */
export interface Solicitante {
    rfc: string;
    nombre: string;
    es_persona_moral: boolean;
    certificado_serial_number: string
}
