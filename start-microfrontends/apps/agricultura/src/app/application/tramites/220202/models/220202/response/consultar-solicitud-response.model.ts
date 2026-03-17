
/**
 * Modelo de respuesta para la consulta de solicitud.
 * Contiene información detallada sobre la solicitud, incluyendo datos de la mercancía,
 */
export interface ConsultaSolicitudResponse {
    id_solicitud: number;
    cve_aduana: string;
    oficina_inspeccion_sanidad_agropecuaria: string;
    punto_inspeccion: string;
    numero_autorizacion: string;
    clave_regimen: string;
    numero_carro_ferrocarril: string;
    mercancia: Mercancia[];
}

/**
 * Modelo que representa la mercancía asociada a una solicitud.
 * Incluye detalles como cantidad, valor, fracción arancelaria, país de origen y
 * destino, entre otros.
 */
export interface Mercancia {
  id_solicitud: number;
  id_mercancia_gob: number;
  numero_partida: number;
  tipo_requisito: number;
  descripcion_tipo_requisito: string;
  requisitos: string;
  numero_certificado: string;
  cve_fraccion: string;
  descripcion_fracción_arancelaria: string;
  clave_nico: string;
  descripcion_nico: string;
  descripcion_mercancia: string;
  cantidad_umt: number;
  clave_unidad_medida: string;
  descripcion_umt: string;
  cantidad_umc: number;
  clave_unidad_comercial: string;
  descripcion_umc: string;
  id_uso_mercancia_tipo_tramite: number;
  descripcion_uso: string;
  id_tipo_producto_tipo_tramite: number;
  descripcion_tipo_producto: string;
  numero_lote: string;
  clave_paises_origen: string;
  clave_paises_procedencia: string;
  nombre_corto_pais_origen: string;
  nombre_pais_origen: string;
  nombre_corto_pais_procedencia: string;
  nombre_pais_procedencia: string;
  id_fraccion_gubernamental: number;
  cantidad_umc_con_comas: string;
  cantidad_umt_con_comas: string;
  descripcion_corta_mercancia: string;
  fraccion_arancelaria_corto: string;
  id_nombre_cientifico: string;
  nombre_cientifico_corto: string;
  nombre_cientifico_cross: string[];
  lista_detalle_mercancia: DetalleMercancia[];
}

export interface DetalleMercancia {
  id_detalle_mercancia: number;
  id_mercancia_gob: number;
  id_vida_silvestre: number;
  nombre_cientifico: string;
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
