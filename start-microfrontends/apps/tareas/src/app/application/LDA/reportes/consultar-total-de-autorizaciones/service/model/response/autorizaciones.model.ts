/**
 * Modelo de respuesta para autorizaciones
 */
export interface Autorizaciones {
    id: number;
    aduana: string;
    razonSocial: string;
    oficioAutorizacion: string;
    fechaAutorizacion: string;
    vigencia: string;
    tipoTramite: string;
}