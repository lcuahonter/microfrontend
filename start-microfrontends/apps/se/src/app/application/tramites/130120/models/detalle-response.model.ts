/**
 * Modelo de respuesta para el detalle de una solicitud.
 */
export interface DetalleResponse {
    // ID de la solicitud.
    id_solicitud: number;
    // mercancía asociada a la solicitud.
    mercancia: Mercancia;
    // documento de salida de exportación.
    documento_salida_exportacion: DocumentoSalidaExportacion;
    // datos del productor.
    productor: Productor;
    // datos del exportador.
    exportador: Exportador;
    // datos de la representación federal.
    representacion_federal: RepresentacionFederal;
    // Clave de clasificación del régimen.
    cve_clasificacion_regimen: string;
    // Clasificación del régimen.
    clasificacion_regimen: string;
    // Clave del régimen.
    cve_regimen: string;
    // Régimen.
    regimen: string;
}

/**
 * Modelo para la mercancía en el detalle de la solicitud.
 */
export interface Mercancia {
    // Descripción de la mercancía.
    descripcion: string;
    // Marcas de la mercancía.
    marcas: string;
    // Tipo de aduana.
    tipo_aduana: string;
    // Clave de tipo de aduana.
    cve_tipo_aduana: string;
    // clave de fracción arancelaria.
    cve_fraccion_arancelaria: string;
    // Fracción arancelaria.
    fraccion_arancelaria: string;
    // Clave de subdivisión.
    cve_subdivision: string;
    // Subdivisión.
    subdivision: string;
    // Clave de unidad de medida tarifaria.
    cve_unidad_medida_tarifaria: string;
    // Unidad de medida tarifaria.
    unidad_medida_tarifaria: string;
    // numero de factura.
    numero_factura: string;
    // fecha de factura.
    fecha_factura: string;
    // clave de unidad de medida comercialización.
    cve_unidad_medida_comercial: string;
    // Unidad de medida comercialización.
    unidad_medida_comercial: string;
    // otro unidad de medida comercialización.
    otro_umc: string;
    // cantidad de comercialización.
    cantidad_comercial: number;
    // factor de conversión.
    factor_conversion: number;
    // cantidad tarifaria.
    cantidad_tarifaria: number;
    // valor de la factura en moneda de comercialización.
    valor_factura_moneda_comercial: number;
    // clave de moneda de comercialización.
    cve_moneda_comercial: string;
    // moneda de comercialización.
    moneda_comercial: string;
    // valor de la factura en USD.
    valor_factura_usd: number;
    // precio unitario.
    precio_unitario: number;
    // país de origen.
    pais_origen: string;
    // clave de país de origen.
    cve_pais_origen: string;
    // clave de país de destino.
    cve_pais_destino: string;
    // país de destino.
    pais_destino: string;
    // valor total en moneda de comercialización.
    valor_total_moneda_comercial: number;
    // valor total en USD.
    valor_total_usd: number;
    // observaciones.
    observaciones: string;
}

/**
 * Modelo para el documento de salida de exportación en el detalle de la solicitud.
 */
export interface DocumentoSalidaExportacion {
    // número de documento.
    numero_documento: string;
    // fecha del documento.
    fecha_documento: string;
    // descripción de la mercancía.
    descripcion_mercancia: string;
    // código arancelario.
    codigo_arancelario: string;
    // cantidad de unidad.
    cantidad_unidad: string;
    // valor en USD.
    valor_usd: string;
    // precio unitario.
    precio_unitario: string;
}
/**
 * Modelo para el productor en el detalle de la solicitud.
 */
export interface Productor {
    // Nombre del productor.
    nombre: string;
    // Descripción de la ubicación.
    descripcion_ubicacion: string;
    // Razón social.
    razon_social: string;
    // Tipo de persona.
    tipo_persona: string;
    // Apellido paterno.
    apellido_paterno: string;
    // Apellido materno.
    apellido_materno: string;
    // RFC.
    rfc: string;
    // País.
    pais: string;
}

/**
 * Modelo para el exportador en el detalle de la solicitud.
 */
export interface Exportador {
    // Nombre del exportador.
    nombre: string;
    // Domicilio del exportador.
    descripcion_ubicacion: string;
    // Razón social del exportador.
    razon_social: string;
    // Tipo de persona del exportador.
    tipo_persona: string;
    // Apellido paterno del exportador.
    apellido_paterno: string;
    // Apellido materno del exportador.
    apellido_materno: string;
    // RFC del exportador.
    rfc: string;
    // Observaciones del exportador.
    observaciones: string;
}
/**
 * Modelo para la representación federal en el detalle de la solicitud.
 */
export interface RepresentacionFederal {
    // Clave de la entidad federativa.
    cve_entidad_federativa: string;
    // Entidad federativa.
    entidad_federativa: string;
    // Clave de la unidad administrativa.
    cve_unidad_administrativa: string;
    // Unidad administrativa.
    unidad_administrativa: string;
}

/**
 * Modelo para el solicitante en el detalle de la solicitud.
 */
export interface Solicitante {
    // nombre del solicitante.
    nombre: string;
    // RFC del solicitante.
    rfc: string;
    // Indica si es persona moral.
    es_persona_moral: boolean;
}
