/**
 * Modelo de salida para las opciones de evaluación del trámite 130118.
 * Este modelo define la estructura de la respuesta que se espera al consultar las opciones de evaluación.
 */
export interface OpcionesEvaluacionRequest {
    /**
     * Clave de la fracción arancelaria.
     */
    cve_rol_capturista: string;

    /**
     * Indica si el usuario es capturista.
     */
    considera_capturista: boolean;
}
export interface OpinionData {
      id_opinion: number;
      num_folio_tramite: string;
      ide_est_opinion: string;
      estado_opinion: string;
      tipo_opinion: string | null;
      cve_area_solicitante: string;
      id_dependencia: string | null;
      fecha_creacion: string;
      fecha_atencion: string | null;
      fecha_solicitud: string | null;
      fecha_generacion: string | null;
      fecha_visita: string | null;
      justificacion: string;
      ide_sent_opinion: string | null;
      sentido_opinion: string;
      pais_opinante: string | null;
      respuesta: string | null;
      descripcion_opinion: string | null;
      cve_usuario: string | null;
      descripcion?:string|null;
      areaObj?:string|null;
}
    
export interface OpcionesGuardarResponse {
    id_accion: string;
    clave_usuario: string;
    opiniones: OpinionItem[];
}

export interface OpinionItem {
    id_opinion: number;
}