import { PersonaSolicitud, Mercancia } from '../32502/tramite32502.model'
import { DireccionMercancia, OperacionImportacion } from '../32502/tramite32502.model'

/**
 * Representación del request de guardado.
 */
export interface GuardaSolicitud32502Request {

    /** Id solicitud */
    id_solicitud?: number;

    /** Datos de la mercancía */
    mercancia?: Mercancia;

    /** Datos del solicitante */
    solicitante: SolicitanteRequest;

    /** Dirección de la mercancía */
    direccion: DireccionMercancia;

    /** Fecha inicio  mercancia importada */
    fecha_inicio?: string;

    /** Transacción vucem */
    id_transaccion_vu?: string;

    /** Operacion de Importación */
    operacion_importacion?: OperacionImportacion;

    /** Datos de solicitante extranjero */
    persona_solicitud: PersonaSolicitud;

    /** Clave de declaracion aceptada */
    cve_declaracion: string;

    /** Aceptación declaración */
    bln_acepto: number;

}

/**
 * Datos generales del solicitante
 */
export interface SolicitanteRequest {
    
    /** RFC del solicitante */
    rfc: string;

    /** Nombre del solicitante */
    nombre: string;

    /** Identificador de contribuyente */
    es_persona_moral: boolean;

    /** Certificado - vacio */
    certificado_serial_number: string;
}
