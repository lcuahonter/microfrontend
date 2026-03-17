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
  mercancia: Mercancia[];
}

/**
 * Modelo de respuesta de mercancia
 */
export interface Mercancia {
  id_solicitud: number,
  id_mercancia_gob: number,
  numero_partida: number,
  tipo_requisito: number,
  descripcion_tipo_requisito: string,
  requisitos: string,
  numero_certificado: string,
  id_fraccion_gubernamental: number,
  cve_fraccion: string,
  descripcion_fracción_arancelaria: string,
  clave_nico: string,
  descripcion_nico: string,
  descripcion_mercancia: string,
  cantidad_umt: number,
  clave_unidad_medida: string,
  descripcion_umt: string,
  cantidad_umc: number,
  clave_unidad_comercial: string,
  descripcion_umc: string,
  id_uso_mercancia_tipo_tramite: number,
  descripcion_uso: string,
  numero_lote: string,
  fase_desarrollo: string,
  descripcion_especie: string,
  clave_paises_origen: string,
  nombre_pais_origen: string,
  nombre_corto_pais_origen: string,
  clave_paises_procedencia: string,
  nombre_pais_procedencia: string,
  nombre_corto_pais_procedencia: string,
  cantidad_umc_con_comas: string,
  cantidad_umt_con_comas: string,
  descripcion_corta_mercancia: string,
  fraccion_arancelaria_corto: string,
  lista_detalle_mercancia: DetalleMercancia[];
  id_tipo_producto_tipo_tramite: number,
  descripcion_tipo_producto: string,
}

/**
 * Modelo de respuesta de detalle de mercancia
 */
export interface DetalleMercancia {
  id_detalle_mercancia: number,
  id_mercancia_gob: number,
  nombre_cientifico_detalle: string
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