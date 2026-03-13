import { BandejaDeSolicitudesResponse } from "@libs/shared/data-access-user/src/core/models/shared/lib-bandeja.model";

/**
 * Clase transformadora para los datos de la bandeja de solicitudes.
 * Esta clase toma un objeto de respuesta de la bandeja de solicitudes
 * y lo transforma en una estructura más adecuada para su uso en la aplicación.
 */
export class BandejaSolicitudTransformer {
    id: string;
    id_solicitud: string;
    departamento: string;
    diasTranscurridos: string;
    estado_solicitud: string;
    fechaActualizacion: string;
    fecha: string;
    numeroDeProcedimiento: string;
    tipoDeTramite: string;
    constructor({
        id_solicitud = '',
        dependencia = '',
        dias_transcurridos = '',
        estado_solicitud = '',
        fecha_actualizacion = '',
        fecha_creacion = '',
        id_tipoTramite = '',
        nombre_tramite = ''
    }: BandejaDeSolicitudesResponse) {
        this.id = id_solicitud;
        this.id_solicitud = id_solicitud;
        this.departamento = dependencia;
        this.diasTranscurridos = dias_transcurridos;
        this.estado_solicitud = estado_solicitud;
        this.fechaActualizacion = fecha_actualizacion;
        this.fecha = fecha_creacion;
        this.numeroDeProcedimiento = id_tipoTramite;
        this.tipoDeTramite = nombre_tramite;
    }
}