/**
 * Class: DocumentoSolicitud
 * 
 * Description:
 * 
 * Modelo que representa la respuesta de consulta de documentación guardada del trámite.
 *
 * @author MCARRO
 * 
 * @created 22 de noviembre de 2025
 * @version 1.0
 */

/** Modelo para almacenar la respuesta de las apis de documentos */
export interface DocumentosResponse {
    codigo: string;
    mensaje: string;
    datos: DocumentoSolicitud[];
}

/**
 * Modelo general de documentos
 */
export interface DocumentoSolicitud {

    id_documento_solicitud: number;
    id_solicitud: number;
    documento: Documento;
    tipo_documento: TipoDocumento;
    ide_est_documento_sol: string;
    estado_documento_solicitud: string;
    descripcion?: string;
    fecha_asociacion: string;
    id_persona?: number;
    complementario?: string;
    fecha_comprobante?: string;
    num_comprobante?: string;
    documento_requerimiento?: string;
}


export interface Documento {
    id_documento: number;
    id_tipo_documento: number;
    id_persona: number;
    fecha_fin_vigencia: string;
    fecha_ini_vigencia: string;
    nombre: string;
    fecha_creacion: string;
    id_e_document: string;
    cve_usu_capturista?: string;
    cve_rol_capturista?: string;
    ide_est_documento: string;
    enviado_documento?: string;
}

/**
 * @property
 */
export interface TipoDocumento {
    id_tipo_documento: number;
    tipo_documento: string;
    fecha_captura: string;
    fecha_fin_vigencia?: string;
    fecha_ini_vigencia?: string;
    activo: boolean;
    ide_rango_resolucion_imagen: string;
    tamanio_maximo: number;
}
