import { TabCapturarSolicitud } from '../interfaces/catalogos.interface';

export const TABS_CAPTURAR_SOLICITUD: TabCapturarSolicitud[] = [
    {
        indice: 1,
        titulo: 'Solicitante',
        activo: true
    },
    {
        indice: 2,
        titulo: 'Datos de la solicitud',
        activo: false
    },
    {
        indice: 3,
        titulo: 'Terceros',
        activo: false,
        disabled: true
    },
    {
        indice: 4,
        titulo: 'Pago de derechos',
        activo: false
    }
]

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
    `<p style="text-align: center;">
    La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. 
    Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. 
    Un folio oficial le será asignado al momento en que ésta sea firmada.
  </p>`;


/**
 * Genera el mensaje HTML para notificación de requerimiento
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para notificación
 */
export const GENERARMENSAJENOTIFICACION = (numeroSolicitud: string): string => {
    return `<div class='text-center'>La notificación de Requerimiento de Información para el trámite con número ${numeroSolicitud ?? ''} ha sido confirmada.</div>`;
};

/**
 * Genera el mensaje HTML para notificación de resolución
 * @param numeroTramite Número de trámite a incluir en el mensaje
 * @returns Mensaje HTML formateado para notificación
 */
export const GENERARMENSAJERESOLUCION = (numeroTramite: string): string => {
    return `<div class='text-center'>La notificación de la resolución para el trámite con número ${numeroTramite} ha sido confirmada.</div>`;
}
